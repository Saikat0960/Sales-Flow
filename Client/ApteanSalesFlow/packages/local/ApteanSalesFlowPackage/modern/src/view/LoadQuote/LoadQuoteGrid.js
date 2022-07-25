Ext.define('ApteanSalesFlowPackage.view.LoadQuote.LoadQuoteGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'QuoteGrid',

    requires: [
        'GridFilterBar.grid.FilterBar'
    ],
    border: false,

    store: {
        type: 'quote'
    },

    columns: [
        {
            dataIndex: 'quote_Number',
            text: 'Quote No.',
            filter: {
                type: 'int'
            },
            flex: 1
        }, 
        {
            dataIndex: 'company_Name',
            text: 'Company Name',
            filter: {
                type: 'string'
            },
            flex: 3
        },
        {
            dataIndex: 'sales_Person',
            text: 'Sales Person',
            filter: {
                type: 'string'
            },
            flex: 1
        },
        {
            dataIndex: 'status',
            text: 'Status',
            filter: {
                type: 'string'
            },
            flex: 1
        }
    ],
    listeners: {
        itemclick: 'onSelectQuote'
    },

    plugins: [
        {
            ptype: 'filterbar',
            pluginId: 'filters',
            autoStoresRemoteProperty: 'filterData',
            autoStoresNullValue: '###NULL###',
            autoUpdateAutoStores: false,

            renderHidden: true,
            showShowHideButton: false,
            showClearButton: true,
            showClearAllButton: true,
            showTool: true,
            dock: 'top'
        }
    ],

    initComponent: function initComponent() {
        this.dockedItems = this.createDockedItems();
        this.callParent(arguments);
    },

    createDockedItems: function createDockedItems() {
        var me = this;

        return [
            {
                xtype: 'toolbar',
                dock: 'top',
                items: [
                    {
                        xtype: 'button',
                        itemId: 'filterBtn',
                        iconCls: 'fa fa-filter fa-lg',
                        width: 28,
                        height: 28,
                        ui: 'plain',
                        tooltip: 'Show  filters',
                        handler: function (btn, e) {
                            var filters;
                            filters = me.getFilterBar();
                            if (!filters) {
                                console.warn('Cant find filter plugin for this grid');
                            }
                            filters.setVisible.call(me, !me._filterBarPluginData.visible);
                            btn.setTooltip((!me._filterBarPluginData.visible ? me._filterBarPluginData.showHideButtonTooltipDo : me._filterBarPluginData.showHideButtonTooltipUndo));
                        }
                    }
                ]
            }
        ];
    }
});