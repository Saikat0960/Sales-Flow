Ext.define('ApteanSalesFlowPackage.store.Tax', {
    extend: 'Ext.data.Store',

    alias: 'store.tax',

    fields: [
        { name: 'id', type: 'int' },
        { name: 'name', type: 'string' },
        { name: 'type', type: 'string' },
        { name: 'rate', type: 'float' }
    ],
    autoLoad: true
});