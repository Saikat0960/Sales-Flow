Ext.define('ApteanSalesFlowPackage.store.SalesOrder', {
    extend: 'Ext.data.Store',
    alias: 'store.salesorder',
    fields: [
        { name: 'sO_Number', type: 'int' },
        { name: 'company_Name', type: 'string' },
        { name: 'total_Value', type: 'float' },
        { name: 'status', type: 'string'},
        { name: 'sales_Person', type: 'string'},
        { name: 'pO_Number', type: 'int' }
    ],
    sorters: [{
        property: 'sO_Number',
        direction: 'DESC'
    }],
    autoLoad: true
});