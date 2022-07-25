Ext.define('ApteanSalesFlowPackage.view.LoadAllItems.LoadAllItems', {
    extend: 'Ext.window.Window',

    requires: [
        'ApteanSalesFlowPackage.store.Items',
    ],
    
    autoShow: true,
    resizable: false,
    controller: 'items',

    title: 'Choose Item',
    height: '50%',
    width: '50%',
    modal: true,
    layout:{
        type: 'fit',
        align: 'stretch'
    },
    items: {
        xtype: 'AllItemGrid',
    }
})