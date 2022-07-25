Ext.define('ApteanSalesFlowPackage.store.Customer', {
    extend: 'Ext.data.Store',

    alias: 'store.customer',
    fields: [
        { name: 'id', type: 'int' },
        { name: 'company_Name', type: 'string' },
        { name: 'email', type: 'string' },
        { name: 'sales_Person', type: 'string' },
        { name: 'status', type: 'string' }
    ],
    sorters: [{
        property: 'id',
        direction: 'DESC'
    }],
     autoLoad: true
});