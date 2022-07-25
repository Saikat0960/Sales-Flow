Ext.define('ApteanSalesFlowPackage.store.Quote', {
    extend: 'Ext.data.Store',

    alias: 'store.quote',

    fields: [
        { name: 'quote_Number', type: 'int' },
        { name: 'company_Name', type: 'string' },
        { name: 'sales_Person', type: 'string' },
        { name: 'status', type: 'string' }
    ],
    sorters: [{
        property: 'quote_Number',
        direction: 'DESC'
    }],
    autoLoad: true
});