Ext.define('ApteanSalesFlowPackage.view.SalesPerson.LoadSalesPersonGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'SalesPersonGrid',

    requires: [
        'GridFilterBar.grid.FilterBar'
    ],
    border: false,
    store: {
        type: 'salesperson'
    },
    itemId: 'salespersonGrid',
    columns: [{
        xtype: 'gridcolumn',
        dataIndex: 'id',
        text: 'ID',
        filter: {
            type: 'int'
        },
        flex: 1
    },
    {
        xtype: 'gridcolumn',
        dataIndex: 'name',
        text: 'Name',
        filter: {
            type: 'string'
        },
        flex: 2
    },
    {
        xtype: 'gridcolumn',
        dataIndex: 'territory',
        text: 'Territory',
        filter: {
            type: 'string'
        },
        flex: 2
    },
    {
        xtype: 'gridcolumn',
        dataIndex: 'commission',
        text: 'Commission(%)',
        filter: {
            type: 'string'
        },
        flex: 2
    }
    ],
    listeners: {
        itemclick: 'onSelectSalesPerson'
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