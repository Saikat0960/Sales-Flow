Ext.define('ApteanSalesFlowPackage.model.SalesPerson', {
    extend: 'Ext.data.Model',

    fields: [
        { name: 'id', type: 'int' },
        { name: 'name', type: 'string' },
        { name: 'territory', type: 'string' },
        { name: 'commission', type: 'string' }
    ]
});