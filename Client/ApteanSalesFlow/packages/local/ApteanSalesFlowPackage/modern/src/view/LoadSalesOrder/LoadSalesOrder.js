Ext.define('ApteanSalesFlowPackage.view.LoadSalesOrder.LoadSalesOrder', {
    extend: 'Ext.window.Window',
    alias: 'widget.salesorder',
    autoShow: true,
    requires: [
        'ApteanSalesFlowPackage.store.SalesOrder',  
    ],
    controller: 'loadsalesorder',
    title: 'Choose Sales Order',
    height: '60%',
    width: '60%',
    modal: true,
    layout: 'fit',
    items: {  
        xtype: 'SalesOrderGrid',
    }
})