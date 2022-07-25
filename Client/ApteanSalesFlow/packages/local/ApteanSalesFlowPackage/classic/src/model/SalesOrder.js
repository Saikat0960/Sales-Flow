Ext.define('ApteanSalesFlowPackage.model.SalesOrder', {
    extend: 'Ext.data.Model', 
    fields: [
        { name: 'sO_Number', type: 'int' },
        { name: 'company_Name', type: 'string' },
        { name: 'total_Value', type: 'float' },
        { name: 'status', type: 'string'},
        { name: 'sales_Person', type: 'string'},
        { name: 'pO_Number', type: 'int' }
    ]
});