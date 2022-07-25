Ext.define('ApteanSalesFlowPackage.model.Shipment', {
    extend: 'Ext.data.Model',

    fields: [
        { name: 'shipment_Number', type: 'int' },
        { name: 'tracking_No', type: 'string' },
        { name: 'company_Name', type: 'string' },
        { name: 'status', type: 'string'},
        { name: 'sO_Number', type: 'string'}
    ],
});