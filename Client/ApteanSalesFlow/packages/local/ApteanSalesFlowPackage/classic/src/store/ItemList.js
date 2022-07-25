Ext.define('ApteanSalesFlowPackage.store.ItemList', {
    extend: 'Ext.data.Store',
    alias: 'store.itemlist',
    storeId: 'itemStore',
    fields: [
        { name: 'part_Id', type: 'int' },
        { name: 'part_Name', type: 'string' },
        { name: 'description', type: 'string' },
        { name: 'uom', type: 'string' },
        { name: 'product_Class', type: 'string' },
        { name: 'product_Group', type: 'string' },
        { name: 'quantity', type: 'int' },
        { name: 'price', type: 'int' },
        {
            name: 'total', calculate: function (a, b) {
                return a.price * a.quantity
            }
        }
    ],
    reader: {
        type: 'array'
    },
    autoLoad: true
});