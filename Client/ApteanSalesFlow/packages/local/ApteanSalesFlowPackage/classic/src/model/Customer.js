Ext.define('ApteanSalesFlowPackage.model.Customer', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'id', type: 'int' },
        { name: 'company_Name', type: 'string' },
        { name: 'email', type: 'string' },
        { name: 'sales_Person', type: 'string' },
        { name: 'status', type: 'string' }
    ]
});