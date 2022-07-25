Ext.define('ApteanSalesFlowPackage.model.Quote', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'quote_Number', type: 'int' },
        { name: 'company_Name', type: 'string' },
        { name: 'sales_Person', type: 'string' },
        { name: 'status', type: 'string' }
    ]
});