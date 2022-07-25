Ext.define('ApteanSalesFlowPackage.model.Invoice', {
    extend: 'Ext.data.Model',

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
});