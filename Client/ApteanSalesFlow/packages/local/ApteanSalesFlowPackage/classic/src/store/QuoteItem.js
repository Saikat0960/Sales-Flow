var QuoteItemsModel = Ext.create('Ext.data.Model', {
    fields: [
        {name: 'part_Id', type: 'int'},
        {name: 'part_Name', type: 'string'},
        {name: 'price', type: 'number'},
        {name: 'quantity', type: 'number'},
        {name: 'product_Class', type: 'number'},
        {name: 'product_Group', type: 'number'},
        {name: 'uom', type: 'number'},
        {
            name: 'total', calculate: function (a, b) {
                return a.price * a.quantity
            }
        }
    ]
});

Ext.define('ApteanSalesFlowPackage.store.QuoteItem', {
    extend: 'Ext.data.Store',

    alias: 'store.quoteItem',

    model: QuoteItemsModel,

    autoLoad: true
});
