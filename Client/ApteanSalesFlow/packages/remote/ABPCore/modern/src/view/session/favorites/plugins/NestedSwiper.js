/**
 * This plugin provides a way to map actions to swipe gesture on all list items.
 */
Ext.define('ABP.view.session.favorites.plugins.NestedListSwiper', {
    extend: 'Ext.plugin.Abstract',
    alias: 'plugin.nestedlistswiper',

    requires: [
        'Ext.util.DelayedTask'
    ],

    config: {
        left: [],
        right: [],

        /**
         * @cfg {Boolean} dismissOnTap
         * If `true`, actions in the undo state will be committed when the item is tapped.
         * Any open menus will be closed.
         */
        dismissOnTap: true,

        /**
         * @cfg {Boolean} dismissOnScroll
         * If `true`, actions in the undo state will be committed as soon as the list is scrolled.
         * Any open menus will be closed
         */
        dismissOnScroll: true,

        /**
         * @cfg {Number} commitDelay
         * Number of milliseconds before actions in the undo state are automatically committed (`0` to
         * disable this behavior). Only applicable for {@link #actions} with `undoable: true`.
         */
        commitDelay: 0,

        /**
         * @cfg {Object/Ext.dataview.plugin.ListSwiperStepper} widget
         * The config object for a {@link Ext.dataview.plugin.ListSwiperStepper}.
         * @cfg {String} widget.xtype (required) The type of component or widget to create.
         */
        widget: {
            xtype: 'listswiperaccordion'
        },

        swipeMax: {
            single: 50,
            multiple: 90
        },

        directionLock: true,

        /**
         * @cfg {'inner'/'outer'} [target='inner']
         * The section of the list item that is swipable.  Supports the following values:
         *
         * - `'inner'` - the default value. the body of the list item, which includes any
         * tools is swipable, and any docked items remain fixed in place while swiping.
         * - `'outer'` - the entire list item including the docked items is swipable
         */
        target: null
    },

    shadowCls: Ext.baseCSSPrefix + 'listswiper-shadow',

    init: function (list) {
        var me = this,
            scrollable = list.getScrollable();

        // Contains items being swiped or pending
        me.items = [];

        list.on({
            scope: this,
            add: 'onItemAdd'
        });

        list.el.on({
            scope: this,
            dragstart: 'onDragStart',
            drag: 'onDragMove',
            dragend: 'onDragEnd'
        });

        if (scrollable) {
            scrollable.setX(false);
        }

        me.dismissAllTask = new Ext.util.DelayedTask(me.dismissAll, me);
        me.updateDismissOnScroll(me.getDismissOnScroll());
    },

    destroy: function () {
        var list = this.cmp;

        list.un({
            scope: this,
            add: 'onItemAdd'
        });

        list.el.un({
            scope: this,
            dragstart: 'onDragStart',
            drag: 'onDragMove',
            dragend: 'onDragEnd'
        });

        this.callParent();
    },

    createWidget: function (config) {
        var me = this,
            leftItems = me.getLeft(),
            rightItems = me.getRight();

        return Ext.apply({
            owner: me,
            defaults: me.defaults,
            leftActions: leftItems,
            rightActions: rightItems
        }, config);
    },

    onScrollStart: function () {
        if (this.getDismissOnScroll()) {
            this.dismissAll();
        }
    },

    onItemAdd: function (list, item) {
        item.setTouchAction({
            panX: false
        })
    },

    onItemUpdateData: function (item) {
        // In order to migrate contexts in case of one or more records have been inserted
        // or removed at a lower index, resyncing needs to be differed until all records
        // have been reassigned to their associated item.
        Ext.asap(this.resyncItem, this, [item]);
    },

    onDragStart: function (evt) {
        var me = this,
            list = me.cmp,
            record = me.mapToRecord(list, evt),
            target, translationTarget, renderTarget, item, widget;

        if (!me.hasActions() || (evt.absDeltaX < evt.absDeltaY)) {
            return;
        }

        if (record) {
            item = me.mapToItem(list, record);
            if (item) {
                widget = item.$swiperWidget;
                if (!widget) {
                    widget = me.createWidget(me.getWidget());
                    widget.ownerCmp = item;
                    target = me.getTarget();

                    if (item.isGridRow || (target === 'outer')) {
                        renderTarget = item.el;
                        // the element that gets translated could be either the body or the
                        // dock wrapper depending on whether or not there are docked items
                        translationTarget = item.el.first();
                    } else {
                        renderTarget = item.bodyElement;
                        translationTarget = item.hasToolZones ?
                            renderTarget.child('.' + Ext.baseCSSPrefix + 'tool-dock') :
                            item.innerElement;
                    }

                    translationTarget.addCls(me.shadowCls);

                    widget.translationTarget = translationTarget;
                    renderTarget = translationTarget.parent();
                    item.$swiperWidget = widget = Ext.create(widget);
                    renderTarget.insertFirst(widget.el);
                    widget.setRendered(true);
                    if (list.infinite) {
                        list.stickItem(item, true);
                    }
                    this.items.push(item);
                }

                widget.onDragStart(evt);
            }
        }

    },

    onDragMove: function (evt) {
        var me = this,
            list = me.cmp,
            item = me.mapToItem(list, evt),
            swiperItem;

        if (item) {
            swiperItem = item.$swiperWidget;

            if (!me.hasActions() || !swiperItem) {
                return;
            }

            swiperItem.onDragMove(evt);
        }
    },

    onDragEnd: function (evt) {
        var me = this,
            list = me.cmp,
            item = me.mapToItem(list, evt),
            swiperItem;

        if (item) {
            swiperItem = item.$swiperWidget;
            if (!me.hasActions() || !swiperItem) {
                return;
            }

            swiperItem.onDragEnd(evt);
        }
    },

    updateDismissOnScroll: function (value) {
        var list = this.getCmp(),
            scrollable, listeners;

        if (this.isConfiguring || !list) {
            return;
        }

        scrollable = list.getScrollable();
        if (!scrollable) {
            return;
        }

        listeners = {
            scrollstart: 'onScrollStart',
            scope: this
        };

        if (value === true) {
            scrollable.on(listeners);
        } else {
            scrollable.un(listeners);
        }
    },

    hasActions: function () {
        return this.getLeft() || this.getRight();
    },

    privates: {
        destroyItem: function (item) {
            var me = this,
                list = me.cmp,
                swiperWidget = item.$swiperWidget,
                i = me.items.indexOf(item);
            if (i !== -1) {
                me.items.splice(i, 1);
            }

            if (swiperWidget) {
                swiperWidget.destroy()
            }
            item.$swiperWidget = null;

            if (list.infinite && !item.destroyed) {
                list.stickItem(item, null);
            }
        },

        dismissAll: function () {
            var me = this;
            me.items.map(function (item) {
                return item.$swiperWidget;
            }).forEach(function (swiperItem) {
                swiperItem.dismiss();
            });
        },

        mapToRecord: function (list, value) {
            var me = this,
                item = value,
                el = list.element,
                dom, rec;

            if (item && item.isEvent) {
                item = item.getTarget(list.itemSelector, el);
            }
            else if (item && (item.isElement || item.nodeType === 1)) {
                item = Ext.fly(item).findParent(list.itemSelector, el);
            }

            if (item) {
                // Items are either components or elements
                dom = item.isWidget ? item.el : item;
                dom = dom.dom || dom;  // unwrap Ext.Elements

                while (Ext.isFunction(dom.getAttribute) && !dom.getAttribute('data-recordid')) {
                    dom = dom.parentNode;
                    if (dom === document) {
                        return null;
                    }
                }

                rec = dom.getAttribute('data-recordid');
                rec = me.__findTreeRecordByInternalId(rec, list);
            }
            return rec || null;
        },

        mapToItem: function (nestedList, value, as) {
            var me = this;
            var i = 0;

            var record = Ext.isFunction(value.getUniqueId) ? value : me.mapToRecord(nestedList, value);
            if (record && nestedList.getActiveItem()) {
                var list = nestedList.getActiveItem();
                for (i = 0; i < list.dataItems.length; ++i) {
                    if (list.dataItems[i].getRecord().getData().id === record.getData().id) {
                        return list.dataItems[i];
                    }
                }
            }
            return null;
        },

        __findTreeRecordByInternalId: function (internalId, list) {
            if (!internalId || !list) {
                return;
            }
            var i;
            var store = list.getStore();
            var record = store.getByInternalId(internalId);
            // UI has not been updated with the new id. Find it manually.
            if (!record) {
                var parent = list.getLastNode();
                if (!parent || !parent.childNodes || parent.childNodes.length === 0) {
                    return;
                }
                for (i = 0; i < parent.childNodes.length; ++i) {
                    if (parent.childNodes[i].internalId == internalId) {
                        return parent.childNodes[i];
                    }
                }
            }
            return record;
        }
    }
});