Ext.define('ApteanSalesFlowPackage.view.Shipment.SearchShipmentView', {
    extend: 'Ext.grid.Panel',
    itemId: 'shipmentGrid',
    requires: [
        'GridFilterBar.grid.FilterBar',
        'ApteanSalesFlowPackage.view.Shipment.ShipmentShowEditWindowView'
    ],
    controller: 'searchshipment',
    
    xtype: 'SearchShipmentView',

    title: 'Shipment Details',
    
    store: {
        type: 'shipment'
    },
    columns: [ {
        dataIndex: 'shipment_Number',
        text: 'Shipment No',
        filter: {
            type: 'int'
        },
        flex: 0.4
    }, 
    {
        dataIndex: 'company_Name',
        text: 'Customer Name',
        filter: {
            type: 'string'
        },
        flex: 1
    },
    {
        dataIndex: 'tracking_No',
        text: 'Tracking No',
        filter: {
            type: 'int'
        },
        flex: 0.4
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
        dataIndex: 'status',
        text: 'Status',
        filter: {
            type: 'string'
        },
        renderer: function(value,meta){
            if(value === 'STARTED'){
                meta.tdCls = 'orangecls'
                return 'STARTED'
            }
            else{
                meta.tdCls = 'greencls'
                return 'APPROVED'
            }
        },
        flex: 0.4
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