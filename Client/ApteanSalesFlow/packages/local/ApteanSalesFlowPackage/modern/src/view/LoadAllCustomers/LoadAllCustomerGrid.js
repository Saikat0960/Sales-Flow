Ext.define('ApteanSalesFlowPackage.view.LoadAllCustomers.LoadAllCustomerGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'AllCustomerGrid',

    requires:[
        'GridFilterBar.grid.FilterBar'
    ],
    border: false,
    store:{
        type: 'customer'
    },
    columns: [{
        xtype: 'gridcolumn',
        dataIndex: 'id',
        text: 'ID',
        filter: {
            type: 'int'
        },
        flex: 0.8
    },
    {
        xtype: 'gridcolumn',
        dataIndex: 'company_Name',
        text: 'Customer Name',
        filter: {
            type: 'string'
        },
        flex: 3
    },
    {
        xtype: 'gridcolumn',
        dataIndex: 'email',
        text: 'Email',
        filter: {
            type: 'string'
        },
        flex: 2
    },
    {
        xtype: 'gridcolumn',
        dataIndex: 'sales_Person',
        text: 'Sales Person',
        filter: {
            type: 'string'
        },
        flex: 1
    }],
    listeners: {
        itemclick: 'onSelectCustomer'
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