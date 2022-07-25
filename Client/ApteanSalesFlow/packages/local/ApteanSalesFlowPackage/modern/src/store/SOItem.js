var SOItemsModel = Ext.create('Ext.data.Model', {
    fields: [
        {name: 'part_Id', type: 'int'},
        {name: 'part_Name', type: 'string'},
        {name: 'price', type: 'int'},
        {name: 'quantity', type: 'int'},
        {name: 'product_Class', type: 'string'},
        {name: 'product_Group', type: 'string'},
        {name: 'uom', type: 'string'},
        {
            name: 'total', calculate: function (a, b) {
                debugger
                return a.price * a.quantity
            }
        }
    ]
});

Ext.define('ApteanSalesFlowPackage.store.SOItem', {
    extend: 'Ext.data.Store',

    alias: 'store.sOItem',

    model: SOItemsModel,

    autoLoad: true
});
