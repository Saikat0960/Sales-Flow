/**
 * The base header planel should be used when following the design pattern of a header and container. The header can container back buttons, input controls and other tools.
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
     * @cfg {Boolean} showFilter
     * `true` to make sure the filter text field available.
     * To bind to the value in the text field add a 'headerFilterValue' data value into the view model
     * or alternativly listen to the abp_header_filterChange event
     */
    showFilter: false,

    /**
     * @cfg {String} filterEmptyText
     * Set to the bindable value that will be passed in to the filter input fields configuration
     */
    filterEmptyText: '{i18n.abp_filter_empty_text:htmlEncode}',

    /**
     * @event abp_header_filterChange
     * Fires after the user has made changes to the filter.
     * @param {Ext.form.field.Text} field The filter field object
     * @param {String} newValue the new filter value
     * @param {String} oldValue The old filter value
     */

    /**
    * View init - Apply class names and init scroll listener
    */
    initialize: function () {
        var me = this;
        // make sure extended view class includes abp header class
        var className = me.getCls() || '';
        me.setCls(className + " abp-header-panel");

        if (me.items.items.length > 0) {
            me.initScrollListener();
        }

        me.initHeaderBar();

        me.callParent();
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

    privates: {
        /**
         * @private
        * Init scroll listener to apply scrolled class on scrolled - adds header box shadow
        */

        initScrollListener: function () {
            var me = this;
            var layout = me.layout.type;
            var scrollable = me.getScrollable();
            var scrolledEl = me;

            if (layout === 'fit') {
                scrollable = me.items.items[0].getScrollable();
                if (scrollable) {
                    scrolledEl = me.items.items[0];
                }
            }

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
            return {
                xtype: 'textfield',
                itemId: 'headerFilter',
                flex: 3,
                maxWidth: 300,
                minWidth: 200,
                reference: 'headerFilter',
                bind: {
                    value: '{headerFilterValue}',
                    placeholder: me.filterEmptyText
                },
                listeners: {
                    change: me.onFilterChanged,
                    scope: me
                }
            }
        },

        /**
         * @private
         * The back button to show in the header when showBack is enabled
         */
        backButton: function () {
            var me = this;
            return {
                xtype: 'tool',
                itemId: 'backButton',
                iconCls: 'icon-fa-arrow-left',
                cls: 'back-btn',
                callback: me.backHandler,
                bind: {
                    tooltip: '{i18n.button_back:htmlEncode}'
                },
            }
        },


        /**
         * @private
         * Initialise the components and tools withing the header bar
         */
        initHeaderBar: function () {
            var me = this;

            if (me.showFilter) {
                me.getHeader().insert(1, me.filterField());
            }

            if (me.showBack) {
                me.getHeader().insert(0, me.backButton());
            }
        },

        onFilterChanged: function (textbox, newValue, oldValue) {
            this.fireEvent('abp_header_filterChange', textbox, newValue, oldValue);
        }
    }
});
