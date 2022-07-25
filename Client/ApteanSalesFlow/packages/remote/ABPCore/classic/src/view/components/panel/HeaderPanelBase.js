/**
 * The base header panel should be used when following the design pattern of a header and container. The header can container back buttons, input controls and other tools.
 * An automatic shadow is shown when the content of the header panel is moved under the header.
 *
 * Example:
 *          // Show filter will provide a text input, the host container will need to handle the abp_header_filterChange event
 *          showFilter: true,
 *
 *          // Show and handle the user pressing the back button
 *          showBack: true,
 *          backHandler: 'onBackClick',
 */
Ext.define('ABP.view.components.panel.HeaderPanelBase', {
    extend: 'Ext.Panel',
    alias: 'widget.abpheaderpanel',
    closable: false,
    scrollable: true,
    header: {},
    items: [],

    config: {
        /**
        * @cfg {Boolean} isFavorite
        * `true` if current page is already a favorited page
        * if left blank the header will try to determine if the page is in favorites.
        */
        isFavorite: null,
    },

    /**
     * @cfg {Boolean} showBack
     * `true` to automatically show the back button.
     * If you set this to true, you will also need to handle the back click by specifying a backHandler
     *
     * Example:
     *      showBack: true,
     *      backHandler: 'onBackClick'
     */
    showBack: false,

    /**
     * @cfg {String} backHandler
     * The name of the function on the controller to handle when the user wants to navigate back.
     */
    backHandler: Ext.emptyFn,

    /**
     *  @cfg {Boolean} showFavorite
     * `true` to show the star/favorite button.
     * If you set this to true, you will also need to specify isFavorite
     *
     * Example:
     *      showFavorite: true,
     *      isFavorite: true
     */
    showFavorite: false,

    /**
     * @cfg {Boolean} showFilter
     * `true` to make sure the filter text field available.
     * To bind to the value in the text field add a 'headerFilterValue' data value into the view model
     * or alternatively listen to the abp_header_filterChange event
     */
    showFilter: false,

    /**
     * @cfg {Number} filterDelay
     * The number of milliseconds to wait between key presses before firing
     * the filter event. Use to prevent too many filters being applied when a user
     * types quickly. Recommend using 100 if you want a slight delay.
     */
    filterDelay: undefined,

    /**
     * @cfg {Number} filterThreshold
     * The minimum number of characters that the user must enter before
     * the change event is fired. Set this to be 2-3 characters when filtering server side
     * If filtering locally, using a single character should be fine to provide responsive feedback
     */
    filterThreshold: 1,

    /**
     * @cfg {String} filterEmptyText
     * Set to the bindable value that will be passed in to the filter input fields configuration
     */
    filterEmptyText: '{i18n.abp_filter_empty_text:htmlEncode}',

    listeners: {
        beforedestroy: function () {
            if (this.filterTask) {
                this.filterTask.cancel();
                this.filterTask = null;
            }
        }
    },

    /**
     * @event abp_header_filterChange
     * Fires after the user has made changes to the filter.
     * @param {Ext.form.field.Text} field The filter field object
     * @param {String} newValue the new filter value
     * @param {String} oldValue The old filter value
     */

    constructor: function (config) {
        config = config || {};
        config.header = config.header;
        if (config.header !== false) {
            var header = config.header || this.header;
            config.header = Ext.isObject(header) ? Ext.clone(header) : header;
        }
        this.callParent([config]);
    },

    /**
    * Classic view init - Apply class names and init scroll listener
    */
    initComponent: function () {
        var me = this;
        // make sure extended view class includes abp header class
        me.cls = (me.cls || "") + " abp-header-panel";
        if (me.items.length > 0) {
            me.initScrollListener();
        }

        me.initHeaderBar();

        me.callParent();

        // If a filter delay has been configured setup the
        if (this.filterDelay && this.filterDelay > 0) {
            this.filterTask = new Ext.util.DelayedTask(this.fireFilterRequest, this);
        }
    },

    /**
    * Destroy this view instance and fire abpHeaderPanel_closeView event
    */
    close: function () {
        var view = this;
        view.fireEvent('abpHeaderPanel_closeView', view);
        view.destroy();
    },

    showBackButton: function () {
        var me = this,
            backButton = me.down('#backButton');
        if (backButton) {
            backButton.show();
        }
    },

    hideBackButton: function () {
        var me = this,
            backButton = me.down('#backButton');
        if (backButton) {
            backButton.hide();
        }
    },

    showFavoriteButton: function () {
        var me = this;
        var favButton = me.down('#favoriteButton');
        if (favButton) {
            favButton.show();
        }
    },

    hideFavoriteButton: function () {
        var me = this;
        var favButton = me.down('#favoriteButton');
        if (favButton) {
            favButton.hide();
        }
    },

    privates: {
        favIconOn: 'icon-favorite-full',
        favIconOff: 'icon-favorite-empty',
        filterTask: null,

        updateIsFavorite: function (newValue) {
            var me = this;
            if (!me.rendered) {
                return;
            }

            var tool = me.lookupReference('favoriteButton');
            if (!tool) {
                return;
            }

            if (newValue) {
                tool.setIconCls(me.favIconOn);
                tool.setBind({ tooltip: '{i18n.button_unfavorite:htmlEncode}' });
            }
            else {
                tool.setIconCls(me.favIconOff);
                tool.setBind({ tooltip: '{i18n.button_favorite:htmlEncode}' });
            }
        },

        /**
         * @private
        * Init scroll listener to apply scrolled class on scrolled - adds header box shadow
        */

        initScrollListener: function () {
            var me = this;
            var scrollable = me.getScrollable();
            var scrolledEl = me;

            if (scrollable) {
                scrollable.on('scroll', function (scroller, x, y) {
                    if (y > 6) {
                        // add drop shadow to header
                        scrolledEl.addCls('abp-scrolled');
                    }
                    else {
                        // remove the drop shadow from header
                        scrolledEl.removeCls('abp-scrolled');
                    }
                });
            }

        },

        /**
         * @private
         * The filter to show in the header when showFilter is enabled
         */
        filterField: function () {
            var me = this;
            if (ABP.util.Common.getClassic() || Ext.os.deviceType !== 'Phone') {
                return {
                    xtype: 'textfield',
                    itemId: 'headerFilter',
                    flex: 3,
                    maxWidth: 300,
                    minWidth: 200,
                    margin: '0px 5px 0px 0px',
                    reference: 'headerFilter',
                    bind: {
                        value: '{headerFilterValue}',
                        emptyText: me.filterEmptyText
                    },
                    keyMap: {
                        ESC: function () {
                            this.setValue('');
                        }
                    },
                    listeners: {
                        change: me.onFilterChanged,
                        scope: me
                    }
                }
            }
        },

        /**
         * @private
         * Initialize the components and tools within the header bar
         */
        initHeaderBar: function () {
            var me = this;
            if (me.showFilter) {
                if (me.header && me.header.items) {
                    me.header.items.unshift(me.filterField());
                } else {
                    var header = {
                        userCls: 'header-input-fields',
                        items: [me.filterField()]
                    };
                    me.header = header;
                }
            }
            return;
        },

        onSwitchFavorite: function () {
            var me = this;
            var activeAppId = Ext.getApplication().getMainView().getController().activeAppId;
            var activeAppInstance = ABP.util.PluginManager.getPluginInstance(activeAppId);
            var config;

            if (activeAppInstance.getViewConfig) {
                config = activeAppInstance.getViewConfig();
                if (config) {
                    // Need to know we can fire events
                    var fireController = me.getController();
                    if (!fireController) {
                        // panel has no controller but we need one to adjust favorites
                        fireController = me.up('featurecanvas').getController();
                    }

                    // Is the button isFavorite?
                    if (me.isFavorite) {
                        // Yes
                        // Favorites Manager
                        if (typeof config === 'string' || config instanceof String) {
                            fireController.fireEvent(ABP.Events.menuRemoveFavorite, activeAppId, config);
                        } else if (config.uniqueId) {
                            fireController.fireEvent(ABP.Events.menuRemoveFavorite, config.appId, config.uniqueId);
                        } else {
                            var calculatedId = ABP.util.IdCreator.getId(config);
                            fireController.fireEvent(ABP.Events.menuRemoveFavorite, config.appId, calculatedId);
                        }
                        // Change icon and flip bool
                        me.setIsFavorite(false);
                    } else {
                        // No
                        // Favorites Manager
                        if (typeof config === 'string' || config instanceof String) {
                            var node = ABP.util.Common.getMenuItem(activeAppId, config, false);
                            if (node) {
                                fireController.fireEvent(ABP.Events.menuAddFavorite, node);
                                // Change icon and flip bool
                                me.setIsFavorite(true);
                            }
                        } else {
                            fireController.fireEvent(ABP.Events.menuAddFavorite, config);
                            // Change icon and flip bool
                            me.setIsFavorite(true);
                        }

                    }
                }
            }
        },

        onFilterChanged: function (textbox, newValue, oldValue) {
            if (this.filterTask) {
                if (newValue.length >= this.filterThreshold) {
                    this.filterTask.delay(this.filterDelay, this.fireFilterRequest, this, [textbox, newValue, oldValue]);
                }
                else {
                    this.filterTask.cancel();

                    // The threshold has not been met, so we need to cancel the filtering
                    this.fireFilterRequest(textbox, '', oldValue);
                }
            }
            else {
                // The delay is not being used forward the change event immediatley
                this.fireFilterRequest(textbox, newValue, oldValue);
            }
        },

        fireFilterRequest: function (textbox, newValue, oldValue) {
            this.fireEvent('abp_header_filterChange', textbox, newValue, oldValue);
        },

        beforeRender: function () {
            var me = this;
            me.callParent();

            if (me.showBack) {
                me.getHeader().insert(0, {
                    xtype: 'tool',
                    itemId: 'backButton',
                    iconCls: 'icon-fa-arrow-left',
                    callback: me.backHandler,
                    bind: {
                        tooltip: '{i18n.button_back:htmlEncode}'
                    }
                });
            }

            if (me.showFavorite) {
                if (!Ext.isBoolean(me.isFavorite)) {
                    // They didn't send the supporting boolean.  We have to do the leg work and find out where we are and if we are a favorite.
                    var activeAppId = Ext.getApplication().getMainView().getController().activeAppId;
                    var activeAppInstance = ABP.util.PluginManager.getPluginInstance(activeAppId);
                    var config;
                    if (activeAppInstance.getViewConfig) {
                        config = activeAppInstance.getViewConfig();
                        if (config) {
                            // activeApp has the info we need so we should be able to do this
                            var uniqueId;
                            if (typeof config === 'string' || config instanceof String) {
                                uniqueId = config;
                            } else if (config.uniqueId) {
                                uniqueId = config.uniqueId;
                            } else {
                                uniqueId = ABP.util.IdCreator.getId(config);
                            }
                            if (uniqueId) {
                                // now we have a uniqueId to test against our favorites
                                var isFavorite = ABP.util.Common.isFavorite(activeAppId, uniqueId);
                                me.isFavorite = isFavorite;
                            }
                        }
                    }
                }

                me.getHeader().add({
                    xtype: 'tool',
                    itemId: 'favoriteButton',
                    reference: 'favoriteButton',
                    iconCls: me.isFavorite ? me.favIconOn : me.favIconOff,
                    callback: me.onSwitchFavorite,
                    scope: me,
                    bind: {
                        tooltip: me.isFavorite ? '{i18n.button_unfavorite:htmlEncode}' : '{i18n.button_favorite:htmlEncode}'
                    }
                });
            }
        }
    }
});
