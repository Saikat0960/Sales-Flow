Ext.define('ApteanSalesFlowPackage.store.Shipment', {
    extend: 'Ext.data.Store',

    alias: 'store.shipment',

    fields: [
        { name: 'shipment_Number', type: 'int' },
        { name: 'tracking_No', type: 'string' },
        { name: 'company_Name', type: 'string' },
        { name: 'status', type: 'string'},
        { name: 'sO_Number', type: 'string'}
    ],
    sorters: [{
        property: 'shipment_Number',
        direction: 'DESC'
    }],
    autoLoad: true
});