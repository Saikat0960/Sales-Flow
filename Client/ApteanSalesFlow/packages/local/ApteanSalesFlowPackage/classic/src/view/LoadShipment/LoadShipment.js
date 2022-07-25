Ext.define('ApteanSalesFlowPackage.view.LoadShipment.LoadShipment', {
    extend: 'Ext.window.Window',
    alias: 'widget.LoadShipment',
    autoShow: true,
    resizable: false,
    requires: [
        'ApteanSalesFlowPackage.store.Shipment'
        //'MyApp.view.main.CustomerCreateView
    ],
    controller: 'loadshipment',
    title: 'Choose Shipment',
    height: '60%',
    width: '60%',
    modal: true,
    layout: 'fit',
    items: {  // Let's put an empty grid in just to illustrate fit layout
        xtype: 'ShipmentGrid',
    }
})