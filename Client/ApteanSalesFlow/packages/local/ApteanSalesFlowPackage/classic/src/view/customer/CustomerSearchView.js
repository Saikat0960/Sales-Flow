Ext.define('ApteanSalesFlowPackage.view.customer.CustomerSearchView', {
    extend: 'Ext.grid.Panel',
    itemId: 'customerGrid',
    requires: [
        'ApteanSalesFlowPackage.store.Customer',
        'GridFilterBar.grid.FilterBar',
        'ApteanSalesFlowPackage.view.customer.CustomerShowEditWindowView'
    ],
    
    controller: 'getcustomer',
    xtype: 'CustomerSearchView',

    title: 'Customers Details',
   // stripeRows: true,
    viewConfig: { 
        stripeRows: true
    },
    cls: 'gridcls',
    store: {
        type: 'customer'
    },
    columns: [ {
        xtype: 'gridcolumn',
        dataIndex: 'id',
        text: 'Customer ID',
        filter: {
            type: 'int'
        },
        flex: 0.5
    },
    {
        xtype: 'gridcolumn',
        dataIndex: 'company_Name',
        text: 'Customer Name',
        filter: {
            type: 'string'
        },
        flex: 1.2
    },
    {
        xtype: 'gridcolumn',
        dataIndex: 'email',
        text: 'Email',
        filter: {
            type: 'string'
        },
        flex: 1
    },
    {
        xtype: 'gridcolumn',
        dataIndex: 'sales_Person',
        text: 'Sales Person',
        filter: {
            type: 'string'
        },
        flex: 0.5
    },
    {
        xtype: 'gridcolumn',
        dataIndex: 'status',
        text: 'Status',
        filter: {
            type: 'string'
        },
        renderer: function(value,meta){
            if(value === 'PROSPECT'){
                meta.tdCls = 'orangecls'
                return 'PROSPECT'
            }
            else{
                meta.tdCls = 'greencls'
                return 'CONFIRMED'
            }
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