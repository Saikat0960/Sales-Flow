Ext.define('ApteanSalesFlowPackage.store.SalesPerson', {
    extend: 'Ext.data.Store',

    alias: 'store.salesperson',

    fields: [
        { name: 'id', type: 'int' },
        { name: 'name', type: 'string' },
        { name: 'territory', type: 'string' },
        { name: 'commission', type: 'string' }
    ],
        autoLoad:true
    });