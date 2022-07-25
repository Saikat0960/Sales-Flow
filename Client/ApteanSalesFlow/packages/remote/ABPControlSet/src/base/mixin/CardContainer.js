/**
 * @private
 *  Base card container mixin.
 *
 */
Ext.define("ABPControlSet.base.mixin.CardContainer", {
    extend: "Ext.Mixin",

    mixinConfig: {
        id: 'abpcardcontainer'
    },
    /**
     * @private
     * Collection of singleton views which will be managed and hosted in simple containers.
     */
    singletons: null,

    constructor: function (config) {
        config = config || {};

        config.singletons = new Ext.util.Collection({
            keyFn: function (item) {
                return item["cardId"];
            }
        });
        this.callParent([config]);
    },

    /**
    * Attempt to show a view in the card container via the card id.
    *
    * @param {Object} cardId The view to add and show.
    * @param {Boolean} reset (optional) Remove all other views.
    * @param {Boolean} destroyNewer (optional) Remove all view's which are newer than the view to be shown.
    *
    * @returns false is returned if no view is found to show, else true is returned.
    */
    showView: function (cardId, reset, destroyNewer) {
        destroyNewer = destroyNewer || false;
        reset = reset || false;

        Ext.suspendLayouts();
        var me = this,
            layout = me.getLayout(),
            setActiveFn = Ext.toolkit === 'modern' ? me.setActiveItem.bind(me) : layout.setActiveItem.bind(layout),
            itemCollection = me.items,
            length = itemCollection.length;

        var viewToShow = itemCollection.findBy(function (item) {
            return item["cardId"] === cardId;
        });

        var existingSingleton = me.singletons.get(cardId);
        if (existingSingleton) {
            // If a singleton matched this cardId, and if not forward progression, find the lastHostId of the singleton, add it, and show.
            var lastHostId = existingSingleton.lastHostId;
            if (lastHostId) {
                // TODO: An issue with this is that when the user meant to go back more than 1 and enough to go behind a host to another host, it will take the last host id and find it and use it.
                // This means that moving forward in workflow from here, will leave the items between the host used and the next host back, will remain stuck and cause a leak and not be destroyed until items are reset.
                viewToShow = itemCollection.findBy(function (item) {
                    return item["cardId"] === lastHostId;
                });
                if (viewToShow) {
                    viewToShow.add(existingSingleton);
                }
            }
        }

        if (viewToShow) {
            // If we have a view to show, check if it is a host.
            if (viewToShow.isHost) {
                // If it is a host, find it's hostedCardId in the singletons and show it within it.
                var hostedCardId = viewToShow.hostedCardId,
                    hostedCard = me.singletons.get(hostedCardId);
                if (hostedCard) {
                    // Add in the hostedCard.
                    viewToShow.add(hostedCard);
                    hostedCard.lastHostId = hostedCard.hostCardId = viewToShow.cardId;
                }
            }
            var indexToShow = itemCollection.indexOf(viewToShow);
            if (reset) {
                me.removeAll(true);
            } else if (destroyNewer && indexToShow < length) {
                me.destroyNewer(indexToShow);
            }
            if (itemCollection.indexOf(viewToShow) === -1) {
                viewToShow = me.add(viewToShow);
            }
            if (setActiveFn) {
                setActiveFn(viewToShow);
            }
            Ext.resumeLayouts(true);
            return true;
        }
        Ext.resumeLayouts(true);
        return false;
    },

    destroyNewer: function (currentIndex) {
        var me = this,
            item,
            itemCollection = me.items,
            length = itemCollection.length;
        // Modern overrides this method to account for the opposite order of the item collection.
        for (var i = length; i > currentIndex; i--) {
            item = itemCollection.getAt(i);
            if (item) {
                if (item.isHost) {
                    item.removeAll(false);
                }
                me.remove(item, {
                    destroy: true
                });
            }
        }
    },
    /**
    * Add the next item in the view's item collection. It will be set as the active view.
    *
    * On the view being added, a cardId property and value is expected to be set.
    * If the view is a singleton, the card container will host it in a simple wrapping container, however, in order to preserve a proper stack and not have a potential memory leak, a hostCardId must be provided on the singleton view being added.
    * The hostCardId will be used as the cardId of the wrapping container used. This way, if the hostCardId is used in the showView method, it will know how to recognize this host, and host the previously hosted singleton view.
    *
    *
    * @param {Object} viewToShow (optional) The view to add and show.
    * @param {Boolean} reset (optional) Remove all view's prior to this view being added.
    * @param {Boolean} destroyNewer (optional) Remove views ahead of this one in the stack. Defaults to true.
    */
    addView: function (viewToShow, reset, destroyNewer) {
        reset = reset || false;
        destroyNewer = destroyNewer === false ? false : true; // Defaults to true.
        var me = this,
            originalViewToShow = viewToShow,
            itemCollection = me.items,
            layout = me.getLayout(),
            setActiveFn = Ext.toolkit === 'modern' ? me.setActiveItem.bind(me) : layout.setActiveItem.bind(layout),
            currentItem = layout.getActiveItem ? layout.getActiveItem() : me.getActiveItem ? me.getActiveItem() : null,
            currentIndex = itemCollection.indexOf(currentItem);

        Ext.suspendLayouts();
        var length = itemCollection.length;
        if (reset) {
            me.removeAll(true);
        } else if (destroyNewer && length > currentIndex && currentIndex !== -1) {
            me.destroyNewer(currentIndex);
        }
        if (viewToShow) {
            if (viewToShow.singleton === true) {
                var addHost = true;
                var existingSingleton = me.singletons.get(viewToShow.cardId);
                if (existingSingleton) {
                    var lastHostId = existingSingleton.lastHostId;
                    var hostCardId = existingSingleton.hostCardId; // The host card id will be updated by the application when shown if needed, so this will change prior to addView.
                    if (lastHostId === hostCardId) {
                        // If they remain the same, find the previous host id.
                        viewToShow = itemCollection.findBy(function (item) {
                            return item["cardId"] === lastHostId;
                        });
                        if (viewToShow) {
                            // We have a view to show in, add it, and do not add another host.
                            viewToShow.add(existingSingleton);
                            addHost = false;
                        } else {
                            viewToShow = originalViewToShow;
                        }
                    }
                }
                if (addHost) {
                    // If we need to host, add the singleton view if needed to the collection. Create and use a new host with the correct configuraiton.
                    if (!existingSingleton) {
                        me.singletons.add(viewToShow);
                    }
                    var hostCardId = viewToShow.hostCardId || Ext.id();
                    viewToShow.lastHostId = hostCardId;
                    viewToShow = Ext.widget({
                        xtype: 'container',
                        isHost: true,
                        layout: 'fit',
                        cardId: hostCardId,
                        hostedCardId: viewToShow.cardId,
                        items: [viewToShow]
                    });
                }
            }
            viewToShow = me.add(viewToShow);
            if (setActiveFn) {
                setActiveFn(viewToShow);
            }
        } else {
            viewToShow = false;
        }
        Ext.resumeLayouts(true);
        return viewToShow;
    },

    /**
    * Move to the next item in the view's item collection
    */
    forwardView: function () {
        var me = this,
            itemCollection = me.items,
            layout = me.getLayout(),
            setActiveFn = Ext.toolkit === 'modern' ? me.setActiveItem.bind(me) : layout.setActiveItem.bind(layout);

        var viewToShow,
            currentItem = layout.getActiveItem ? layout.getActiveItem() : me.getActiveItem ? me.getActiveItem() : null,
            currentIndex = itemCollection.indexOf(currentItem);

        if (currentIndex !== -1) {
            viewToShow = itemCollection.getAt(currentIndex + 1);
        }
        if (viewToShow && setActiveFn) {
            setActiveFn(viewToShow);
        }
    },

    /**
    * Move back in the view collection.
    *
    * @param {Number} backCount Defaults to 1.
    * @param {Boolean} destroyOthers Defaults to false. Using true will destroy items in front of the item the view is moving back to.
    */
    backView: function (backCount, destroyNewer) {
        var me = this,
            layout = me.getLayout(),
            setActiveFn = Ext.toolkit === 'modern' ? me.setActiveItem.bind(me) : layout.setActiveItem.bind(layout),
            currentItem = layout.getActiveItem ? layout.getActiveItem() : me.getActiveItem ? me.getActiveItem() : null,
            itemCollection = me.items;

        Ext.suspendLayouts();
        destroyNewer = destroyNewer || false;

        backCount = backCount || 1;

        var currentIndex = currentItem ? itemCollection.indexOf(currentItem) : null,
            moveTo = Ext.isNumber(currentIndex) ? currentIndex - backCount : null;

        if (Ext.isNumber(moveTo)) {
            var moveToItem = itemCollection.getAt(moveTo < 0 ? 0 : moveTo);
            if (destroyNewer) {
                if (moveTo < 0) {
                    me.removeAll(true);
                } else {
                    me.destroyNewer(moveTo);
                }
            }
            if (moveToItem && setActiveFn && moveTo >= 0) {
                setActiveFn(moveToItem)
            }
        }
        Ext.resumeLayouts(true);
    }
});