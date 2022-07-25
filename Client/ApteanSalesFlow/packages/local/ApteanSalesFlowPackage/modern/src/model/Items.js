Ext.define('ApteanSalesFlowPackage.model.Items', {
    extend: 'Ext.data.Model',

    fields: [
        { name: 'part_Id', type: 'int' },
        { name: 'part_Name', type: 'string' },
        { name: 'description', type: 'string' },
        { name: 'product_Class', type: 'string' },
        { name: 'product_Group', type: 'string' },
        { name: 'uom', type: 'string' },
        { name: 'revision', type: 'string' }
    ]
});