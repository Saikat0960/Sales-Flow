Ext.define('ApteanSalesFlowPackage.view.SalesPerson.LoadSalesPerson', {
    extend: 'Ext.window.Window',
    alias: 'widget.LoadSalesPerson',
    autoShow: true,
    requires: [
        'ApteanSalesFlowPackage.store.SalesPerson'
    ],
    controller: 'SalesPerson',
    title: 'Choose Sales Person',
    height: '50%',
    width: '50%',
    modal: true,
    layout:{
        type: 'fit',
        align: 'stretch'
    },
    items: {  
        xtype: 'SalesPersonGrid'
    }
})