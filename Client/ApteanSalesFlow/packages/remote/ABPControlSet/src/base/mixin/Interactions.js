/**
 *
 * At the core, the set is expected to be passed an array of configuration objects.
 * Each interaction has the ability to have binding applied from the form's view model data.
 */
Ext.define('ABPControlSet.base.plugin.Interactions', {
    extend: 'Ext.AbstractPlugin',
    alias: 'plugin.abpinteractions',
    requires: [
        'ABPControlSet.view.rightpane.interactions.Interactions',
        'ABPControlSet.common.types.Interaction'
    ],

    /** @private */
    groupDefaults: {
        xtype: 'container',
        padding: 0
    },

    /** @private */
    itemDefaults: {
        flex: 1,
        xtype: 'abpbutton',
        scale: 'medium'
    },

    config: {
        /**
         * @cfg {Object[]} interactions
         * An array of interactions
         */
        interactions: null,

        /**
         * @private
         */
        thumbarInteractions: null,

        /**
         * @private
         */
        headerInteractions: null,

        /**
         * @private
         */
        rightPaneInteractions: null
    },
    /** @private */
    interactionsBar: null,
    /** @private */
    __thumbarInteractions: null,
    /** @private */
    __headerInteractions: null,
    /** @private */
    __rightPaneInteractions: null,
    /** @private */
    paneName: 'interactions',

    init: function (cmp) {
        var me = this,
            interactions = cmp.interactions,
            listeners = {
                boxready: me.interactionOnShow,
                aftershow: me.interactionOnShow,
                beforehide: me.interactionOnHide,
                beforedestroy: me.interactionOnHide,
                scope: me
            };

        listeners[Ext.toolkit === 'modern' ? 'painted' : 'render'] = {
            fn: me.interactionOnShow,
            scope: me,
            single: true
        };

        me.setInteractions(interactions);

        delete cmp.interactions;
        cmp.on(listeners);
    },

    /**
     * @private
     */
    setInteractions: function (interactions) {
        interactions = interactions || [];
        var me = this;
        me.callParent(arguments);
        // Default empty arrays.
        me.__thumbarInteractions = [];
        me.__headerInteractions = [];
        me.__rightPaneInteractions = [];
        // Force array for processing.
        me.processInteractions(interactions, false);

        // Finalize setting the correct items after process is finished.
        me.setThumbarInteractions(me.__thumbarInteractions);
        if (Ext.toolkit === 'classic') {
            me.setHeaderInteractions(me.__headerInteractions);
        }
        me.setRightPaneInteractions(me.__rightPaneInteractions);
    },

    /**
     * @private
     */
    interactionOnShow: function () {
        var me = this,
            view = me.getCmp(),
            controller = view.getController();
        if (controller) {
            if (Ext.toolkit === 'classic') {
                controller.fireEvent('container_rightPane_initTab', me.paneName);
            }
            controller.fireEvent('container_rightPane_showButton', me.paneName, true);
            controller.fireEvent('interactions_populate', me.getRightPaneInteractions());
            if (Ext.toolkit === 'modern') {
                controller.fireEvent('container_thumbbar_show', {
                    buttons: me.getThumbarInteractions()
                });
            }
        }
    },

    /**
     * @private
     */
    interactionOnHide: function () {
        var me = this,
            view = me.getCmp(),
            controller = view.getController();

        if (controller) {
            if (Ext.toolkit === 'modern') {
                controller.fireEvent('container_thumbbar_hide', true);
            }
            controller.fireEvent('container_rightPane_showButton', me.paneName, false);
            controller.fireEvent('container_rightPane_toggleTab', me.paneName, false);
            controller.fireEvent('interactions_populate', []);
        }
    },

    /**
     * Thumbbar setting is only occurring on the show event of the form.
     * Thumbbar is also hidden on the beforehide event.
     */
    setThumbarInteractions: function (interactions) {
        var me = this,
            view = me.getCmp();
        interactions = interactions || [];
        interactions = interactions.sort(function (a, b) { return a.thumbbarPriority - b.thumbbarPriority });
        // Apply the items as proper thumbbar configs.
        this.callParent([interactions]);

        var me = this,
            isVisible = view.isVisible();

        if (isVisible) {
            me.interactionOnShow();
        }
    },
    /**
     * @private
     * Header item update is immediate since it is contained within the form itself.
     */
    setHeaderInteractions: function (interactions) {
        var me = this,
            interactionsBar = me.getTBar();
        interactions = interactions || [];
        interactions = interactions.sort(function (a, b) { return a.headerPriority - b.headerPriority });
        if (Ext.toolkit === 'classic' /* Possible tablets as well. */) {
            if (interactionsBar && Ext.isArray(interactions)) {
                if (interactionsBar.removeAll) {
                    interactionsBar.removeAll();
                    interactionsBar.add(interactions);
                } else {
                    interactionsBar.items = interactions;
                }
            }
        }
    },
    /**
     * @private
     */
    getTBar: function () {
        var me = this,
            view = me.getCmp(),
            interactionsBar = me.interactionsBar;

        if (!interactionsBar) {
            interactionsBar = Ext.create({
                scrollable: 'horizontal',
                xtype: 'toolbar',
                docked: 'top',
                dock: 'top',
                cls: 'interactions-toolbar'
            });
            me.interactionsBar = view.addDocked(interactionsBar)[0];
        }
        return me.interactionsBar;
    },
    /**
     * Right pane setting is only occurring on the show event of the form.
     * Right pane is also hidden on the beforehide event.
     */
    setRightPaneInteractions: function (interactions) {
        this.callParent(arguments)
        var me = this,
            view = me.getCmp(),
            isVisible = view.isVisible();

        if (isVisible) {
            me.interactionsOnShow();
        }
    },

    /**
     * @private
     */
    processInteractions: function (interaction, isChild, parent) {
        var me = this,
            view = me.getCmp(),
            thumbbar = me.__thumbarInteractions,
            header = me.__headerInteractions,
            rightPane = me.__rightPaneInteractions,
            controller = view.getController(),
            vm = view.getViewModel();

        isChild = interaction.items ? false : isChild;
        if (Ext.isObject(interaction)) {
            interaction.viewModel = {
                parent: vm
            };
            if (interaction.handler && controller) {
                var handler = interaction.handler;
                interaction.handler = Ext.isObject(handler) ? handler.fn.bind(handler.scope || controller) : (Ext.isFunction(handler) ? handler : controller[handler] ? controller[handler] : Ext.emptyFn).bind(controller);
            }
            interaction.refOwner = view;
            interaction.scope = controller || view;
            if (Ext.toolkit === 'modern' && Ext.isNumber(interaction.thumbbarPriority)) {
                var thumbarClone = Ext.clone(interaction);
                delete thumbarClone.text;
                thumbbar.push(thumbarClone);
            }
            // Do not put child items into the header since the parent will determine placement.
            if (!isChild && Ext.toolkit === 'classic' && Ext.isNumber(interaction.headerPriority)) {
                var headerClone = Ext.clone(interaction);
                if (headerClone.items) {
                    me.processInteractions(headerClone.items, !!parent, headerClone);
                    Ext.applyIf(headerClone, {
                        defaultType: 'abpbutton'
                    });
                    Ext.applyIf(headerClone, me.groupDefaults);
                    Ext.applyIf(headerClone, {
                        defaults: me.itemDefaults
                    });
                } else {
                    Ext.applyIf(headerClone, me.itemDefaults);
                }
                header.push(headerClone);
            }
            if (!isChild && interaction.rightPane !== false) {
                var rightPaneClone = Ext.clone(interaction);
                if (Ext.toolkit === 'classic') {
                    rightPaneClone.getBubbleTarget = function () {
                        return view;
                    };
                }
                // Do not put child items into the right pane since the parent will determine placement.
                // All can go to right pane unless explicitely set not to do so.
                if (rightPaneClone.items) {
                    var rightPaneItems = [],
                        length = rightPaneClone.items.length;
                    for (var i = 0; i < length; i++) {
                        if (rightPaneClone.items[i].rightPane !== false) {
                            rightPaneItems.push(rightPaneClone.items[i]);
                        }
                    }
                    rightPaneClone.items = rightPaneItems;
                    me.processInteractions(rightPaneClone.items, !!parent, rightPaneClone);
                    Ext.applyIf(rightPaneClone, me.groupDefaults);
                    Ext.applyIf(rightPaneClone, {
                        defaults: me.itemDefaults
                    });
                } else {
                    Ext.applyIf(rightPaneClone, me.itemDefaults);
                }
                // Apply the specific title.
                if (rightPaneClone.rightPaneTitle) {
                    rightPaneClone.title = rightPaneClone.rightPaneTitle;
                }
                rightPane.push(rightPaneClone);
            }
            return interaction;
        } else if (Ext.isArray(interaction)) {
            var length = interaction.length;
            for (var i = 0; i < length; i++) {
                interaction[i] = me.processInteractions(interaction[i], !!parent, parent);
            }
        }
    }
});