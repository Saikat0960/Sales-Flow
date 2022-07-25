Ext.define('ApteanSalesFlowPackage.view.SalesOrder.SalesOrderSearchView', {
    extend: 'Ext.grid.Panel',
    itemId: 'customerGrid',
    xtype: 'SalesOrderSearchView',
    requires: [
        'ApteanSalesFlowPackage.store.SalesOrder',
        'GridFilterBar.grid.FilterBar',
        'ApteanSalesFlowPackage.view.SalesOrder.SalesOrderShowEditWindowView'
    ],
    controller: 'salesordersearch',
    // listeners: {
    //     customerUpdation: 'onItemUpdate'
    // },
    xtype: 'SearchSalesOrderView',

    title: 'Sales Order Details',

    store: {
        type: 'salesorder'
    },
    columns: [{
        dataIndex: 'sO_Number',
        text: 'SO Number',
        filter: {
            type: 'int'
        },
        flex: 0.5
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
        dataIndex: 'pO_Number',
        text: 'PO Number',
        filter: {
            type: 'int'
        },
        flex: 0.5
    },
    {
        dataIndex: 'sales_Person',
        text: 'Sales Person',
        filter: {
            type: 'string'
        },
        flex: 0.5
    },
    {
        dataIndex: 'status',
        text: 'Status',
        filter: {
            type: 'string'
        },
        flex: 0.5
    },
    {
        xtype: 'actioncolumn',
        text: 'Edit',
        align: 'center',
        items: [{
            iconCls: 'x-fa fa-edit',
            tooltip: 'Show/Edit',
            handler: 'showEditWindow'
        }],
        flex: 0.3
    },
    {
        xtype: 'actioncolumn',
        text: 'Report',
        align: 'center',
        items: [{
            iconCls: 'icon-report-show',
            tooltip: 'SO Report',
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