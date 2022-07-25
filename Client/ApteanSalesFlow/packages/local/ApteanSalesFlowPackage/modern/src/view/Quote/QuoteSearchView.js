Ext.define('ApteanSalesFlowPackage.view.Quote.QuoteSearchView', {
    extend: 'Ext.grid.Panel',
    itemId: 'quoteGrid',
    requires: [
        'ApteanSalesFlowPackage.store.Quote',
        'GridFilterBar.grid.FilterBar',
        'ApteanSalesFlowPackage.view.Quote.QuoteShowEditWindowView',
    ],
    controller: 'quotesearchview',
    xtype: 'QuoteSearchView',
    
    title: 'Quote Details',
    
    store: {
        type: 'quote'
    },
    columns: [ {
        dataIndex: 'quote_Number',
        text: 'Quote No.',
        filter: {
            type: 'int'
        },
        flex: 0.4
    }, 
    {
        dataIndex: 'company_Name',
        text: 'Company Name',
        filter: {
            type: 'string'
        },
        flex: 1
    },
    {
        dataIndex: 'sales_Person',
        text: 'Sales Person',
        filter: {
            type: 'string'
        },
        flex: 0.4
    },
    {
        dataIndex: 'status',
        text: 'Status',
        filter: {
            type: 'string'
        },
        flex: 0.4
    },
    {
        xtype: 'actioncolumn',
        text: 'Edit',
        align: 'center',
        items: [{
            iconCls: 'x-fa fa-external-link',
            tooltip: 'Show/Edit',
            handler: 'showDetailsWindow'
        }],
        flex: 0.2
    },
    {
        xtype: 'actioncolumn',
        text: 'Report',
        align: 'center',
        items: [{
            iconCls: 'icon-report-show',
            tooltip: 'Quote Report',
            handler: 'printReport'
        }],
        flex: 0.2
    }
    ],
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
                        handler: function(btn, e) {
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