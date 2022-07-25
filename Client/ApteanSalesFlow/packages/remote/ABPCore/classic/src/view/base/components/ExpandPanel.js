/**
 * @abstract
 * Base expand panel, extend this class when implementing expanded popup views.
 *
 * The expand panel adds some animiation as the window is shown so it appears to open fom the source component.
 * Ensure the parentComponent is passed in so it can position the starting animation.
 *
 *  example usage:
 *
 *     You create a panel 'Product.view.MyExpandedPanel' based on 'ABP.view.base.components.ExpandPanel'
 *
 *     var expandPanel = Ext.create('Product.view.MyExpandedPanel', {
 *           parentComponent: v,
 *           viewModel: { ... },
 *           desiredWidth: 600,
 *           desiredHeight: 600
 *       });
 *      expandPanel.show();
 *
 *  To show a maximised panel:
 *
 *      var expandPanel = Ext.create('Product.view.MyExpandedPanel', {
 *           parentComponent: v,
 *           viewModel: { ... },
 *           fullscreen: true
 *       });
 *      expandPanel.show();
 *
 */
Ext.define('ABP.view.base.components.ExpandPanel', {
    extend: 'Ext.window.Window',
    requires: [
        'ABP.view.base.components.ExpandPanelViewModel'
    ],

    alias: 'widget.abpexpandpanel',

    cls: 'baseexpandpanel',
    bodyCls: 'x-unselectable',

    floating: true,
    modal: true,

    config: {
        /**
         * @cfg {Object} [parentComponent]
         * The parent Ext Component that these settings are related to. This must be configured.
         */
        parentComponent: undefined,

        /**
         * @cfg {Number} [desiredWidth]
         * The desired width of the settings panel.
         * This will be reduced if there is not enough on the screen
         */
        desiredWidth: 500,
        /**
         * @cfg {Number} [desiredHeight]
         * The desired height of the settings panel.
         * This will be reduced if there is not enough on the screen
         */
        desiredHeight: 400,
        /**
         * @cfg {Ext.Component.keyMap} [closeKeymap]
         * Key map for closing this expand panel.
         */
        closeKeymap: undefined,

        /** @cfg {Object} [fullscreenContainer]
         * The container component to use as the full screen bounds
         */
        fullscreenContainer: undefined,

        /** @cfg {Boolean} [fullscreen]
         * Whether to show the popup at the full size of the container
         */
        fullscreen: false
    },

    bumper: 20,
    animationDuration: 250,
    origin: {
        x: 0,
        y: 0,
        height: 100,
        width: 100
    },

    //onEsc: closePanel,
    tools: [],

    listeners: {
        beforeclose: function () {
            var me = this;

            if (me.waitForAnimation) {
                // The paarent may have moded through re-size  or orientation. gets its current positions
                var parent = me.getParentComponent();
                if (!parent) {
                    return;
                }

                var pos = parent.getPosition();
                var size = parent.getSize();

                // Shrink the window back to its original parent
                me.animate({
                    duration: me.animationDuration,
                    to: {
                        x: pos[0],
                        y: pos[1],
                        width: size.width,
                        height: size.height
                    },
                    callback: function () {
                        //Ext.destroy(me.getCloseKeymap());
                        me.waitForAnimation = false;
                        me.close();
                    }
                });

                return false;
            }
        },

        beforedestroy: function () {
            var me = this;
            // Tidy up
            me.syncResizeEvents();
        }
    },

    constructor: function (config) {
        config = config || {};
        config.maxWidth = Ext.getBody().getViewSize().width - this.bumper;
        config.maxHeight = Ext.getBody().getViewSize().height - this.bumper;

        if (!config.parentComponent) {
            ABP.util.Logger.logError("'parentComponent' not included in config.", "The parent component must be passed into the base expand panel.");
        }

        this.callParent([config]);
    },

    initComponent: function () {
        var me = this;
        me.callParent();

        var parent = me.getParentComponent();
        if (parent) {
            var pos = parent.getPosition();
            var size = parent.getSize();

            // Position the window over the origin component
            me.setPosition(pos[0], pos[1]);
            me.setWidth(size.width);
            me.setHeight(size.height);
        }

        me.show();

        // Catch resize events from the daashboard so we can properly resiz
        me.syncResizeEvents();
    },

    show: function () {
        var me = this;
        me.callParent();

        var to = me.getTargetTo();
        me.animate({
            duration: me.animationDuration,
            to: to
        });
    },

    privates: {
        waitForAnimation: true,
        monitoringResize: false,

        updateFullscreen: function (newValue, oldvalue) {
            var me = this;
            if (newValue) {
                me.setMaxWidth(null);
                me.setMaxHeight(null);

                if (me.resizer) {
                    me.resizer.disable();
                }
            }

            if (oldvalue !== undefined) {
                me.syncResizeEvents();
                this.onViewportResize();
            }
        },

        /**
         * @private
         *
         * Bind or unbind the events based on the current state of the window
         */
        syncResizeEvents: function () {
            var me = this;
            unbind = me.hidden || me.destroying || me.destroyed;

            if (me.monitoringResize) {
                Ext.un('resize', me.onViewportResize, me);

                if (me.fullscreenContainer && me.fullscreen) {
                    me.fullscreenContainer.un('resize', me.onViewportResize, me);
                }

                me.monitoringResize = false;
                if (unbind) {
                    return;
                }
            }

            if (me.fullscreenContainer && me.fullscreen) {
                me.fullscreenContainer.on('resize', me.onViewportResize, me, { buffer: 1 });
            }
            else {
                Ext.on('resize', me.onViewportResize, me, { buffer: 1 });
            }

            me.monitoringResize = true;
        },

        getTargetTo: function () {
            var me = this;
            var maxSize = { width: 0, height: 0 };

            // Make sure this popup still fits within the viewable area
            if (me.getFullscreenContainer()) {
                maxSize = me.getFullscreenContainer().getSize();
            }
            else {
                maxSize = Ext.getBody().getViewSize();
                maxSize.width -= me.bumper;
                maxSize.height -= me.bumper;
            }

            var newWidth = Math.min(me.desiredWidth, maxSize.width);
            var newHeight = Math.min(me.desiredHeight, maxSize.height);

            var to = {
                x: Math.ceil((maxSize.width - newWidth) / 2),
                y: Math.ceil((maxSize.height - newHeight) / 2),
                width: newWidth,
                height: newHeight
            };

            if (me.fullscreen) {
                var size = me.container.getSize();
                to.x = 0;
                to.y = 0;

                if (me.fullscreenContainer) {
                    var pos = me.fullscreenContainer.getPosition();
                    to.x = pos[0];
                    to.y = pos[1];
                }

                to.width = maxSize.width;
                to.height = maxSize.height;
            }
            else {
                to.x += (me.bumper / 2);
                to.y += (me.bumper / 2);
            }

            return to;
        },

        /**
         * @private
         *
         * Handle the user resizeing the viewport, ensure the popup is re-sized so its
         * still viewable.
         */
        onViewportResize: function () {
            var me = this;
            var to = me.getTargetTo();

            me.animate({
                duration: me.animationDuration / 2,
                to: to
            });
        }
    }
});
