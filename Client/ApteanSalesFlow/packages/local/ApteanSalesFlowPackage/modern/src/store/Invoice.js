Ext.define('ApteanSalesFlowPackage.store.Invoice', {
    extend: 'Ext.data.Store',

    alias: 'store.invoice',

    fields: [
        { name: 'invoiceID', type: 'int' },
        { name: 'shipmentID', type: 'int' },
        { name: 'customerName', type: 'string' },
        { name: 'date', type: 'string'},
        { name: 'sO_Number', type: 'string'},
        {
            name: 'prettyDate', calculate: function (a, b) {
                return a.date.substring(0, 10);
            }
        }
    ],
    sorters: [{
        property: 'invoiceID',
        direction: 'DESC'
    }],
    autoLoad:true
});