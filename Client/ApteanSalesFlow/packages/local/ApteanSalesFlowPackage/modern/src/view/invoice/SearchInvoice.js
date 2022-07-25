Ext.define('ApteanSalesFlowPackage.view.invoice.SearchInvoice', {
    extend: 'Ext.grid.Panel',
    itemId: 'invoiceGrid',
    requires: [
        'ApteanSalesFlowPackage.store.Invoice',
        'GridFilterBar.grid.FilterBar',
        'ApteanSalesFlowPackage.view.invoice.ShowInvoice'
    ],
    controller: 'searchinvoice',

    xtype: 'SearchInvoiceView',

    title: 'Invoice Details',
    
    store: {
        type: 'invoice'
    },
    
    columns: [ {
        dataIndex: 'invoiceID',
        text: 'Invoice ID',
        filter: {
            type: 'int'
        },
        flex: 0.4
    }, 
    {
        dataIndex: 'customerName',
        text: 'Customer Name',
        filter: {
            type: 'string'
        },
        flex: 1
    },
    {
        dataIndex: 'shipmentID',
        text: 'Shipment Number',
        filter: {
            type: 'int'
        },
        flex: 0.5
    },
    {
        dataIndex: 'sO_Number',
        text: 'SO Number',
        filter: {
            type: 'int'
        },
        flex: 0.4
    },
    {
        dataIndex: 'prettyDate',
        text: 'Date',
        filter: {
            type: 'date'
        },
        flex: 0.5
    },
    {
        xtype: 'actioncolumn',
        text: 'Report',
        align: 'center',
        items: [{
            iconCls: 'icon-report-show',
            tooltip: 'Shipment Report',
            handler: 'printReport'
        }],
        flex: 0.3
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