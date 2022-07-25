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
 */
Ext.define('ABP.view.base.components.ExpandPanel', {
    extend: 'Ext.Dialog',
    requires: [
        'ABP.view.base.components.ExpandPanelViewModel'
    ],

    alias: 'widget.abpexpandpanel',

    cls: 'baseexpandpanel',
    bodyCls: 'x-unselectable',

    floating: true,
    modal: true,
    centered: true,
    hideOnMaskTap: true,
    manageBorders: false,
    draggable: false,

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

        margin: 0,

        /** @cfg {Object} [fullscreenContainer]
         * The container component to use as the full screen bounds
         */
        fullscreenContainer: undefined,

        /** @cfg {Boolean} [fullscreen]
         * Whether to show the popup at the full size of the container
         */
        // fullscreen: false
    },

    bumper: 10,
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
                me.animate({
                    duration: me.animationDuration,
                    to: {
                        x: me.origin.x,
                        y: me.origin.y,
                        width: me.origin.width,
                        height: me.origin.height
                    },
                    callback: function () {
                        me.waitForAnimation = false;
                        me.close();
                    }
                });

                return false;
            }
        },

        beforedestroy: function () {
            // Tidy up
            Ext.Viewport.un('orientationchange', this.onViewportResize, this);
        }
    },

    constructor: function (config) {
        config = config || {};
        if (!config.parentComponent) {
            ABP.util.Logger.logError("'parentComponent' not included in config.", "The parent component must be passed into the base expand panel.");
        }

        this.callParent([config]);

        if (!config.fullscreen) {
            Ext.Viewport.add(this);
        }
    },

    initialize: function () {
        var me = this;
        me.callParent();

        var parent = me.getParentComponent();

        // Store the original size and position
        if (parent) {
            var size = parent.getSize();
            me.origin.width = size.width;
            me.origin.height = size.height;
            me.origin.x = parent.getX();
            me.origin.y = parent.getY();
        }

        // Make sure this popup still fits within the viewable area
        me.onViewportResize();

        me.setTools((this.tools || []).concat([{
            type: 'close',
            iconCls: 'icon-navigate-cross',
            handler: function () {
                me.close();
            }
        }]));

        // Catch resize events from the daashboard so we can properly resize
        Ext.Viewport.on('orientationchange', me.onViewportResize, me);
    },

    privates: {
        /**
         * @private
         *
         * Get the maximum size of the dialog
         */
        getMaxSize: function (width, height) {
            var me = this;
            var vpSize = Ext.getBody().getViewSize();
            var maxSize = Ext.clone(vpSize);;
            // Sometimes during re-orientation the width and height measurements are delayed
            if (Ext.Viewport.getOrientation() === Ext.Viewport.PORTRAIT) {
                if (vpSize.width > vpSize.height) {
                    maxSize.height = vpSize.width;
                    maxSize.width = vpSize.height;
                }
            }
            else {
                // Landscape
                if (vpSize.width < vpSize.height) {
                    maxSize.height = vpSize.width;
                    maxSize.width = vpSize.height;
                }
            }
            maxSize.width -= (me.bumper * 2);
            maxSize.height -= (me.bumper * 2);

            if (!me.fullscreen) {
                maxSize.width = Math.min(me.getDesiredWidth(), maxSize.width);
                maxSize.height = Math.min(me.getDesiredHeight(), maxSize.height);
            }

            return maxSize;
        },

        /**
         * @private
         *
         * Handle the user resizeing the viewport, ensure the popup is re-sized so its
         * still viewable.
         */
        onViewportResize: function (vp, orientation, width, height) {
            var me = this;

            var size = me.getMaxSize(width, height);
            var to = { x: null, y: null, width: size.width, height: size.height };

            me.setSize(to.width, to.height);

            if (me.fullscreen) {
                to.y = me.bumper;
                to.x = me.bumper;

                me.setCentered(false);

                me.setX(to.x);
                me.setY(to.y);
            }
            else {
                me.center();
            }
        },

        isPhone: function () {
            return Ext.os.deviceType === 'Phone';
        }
    }
});
