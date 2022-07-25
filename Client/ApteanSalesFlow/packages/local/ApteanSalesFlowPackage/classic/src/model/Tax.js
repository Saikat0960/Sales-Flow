Ext.define('ApteanSalesFlowPackage.model.Tax', {
    extend: 'Ext.data.Model',

    fields: [
        { name: 'id', type: 'int' },
        { name: 'name', type: 'string' },
        { name: 'type', type: 'string' },
        {name:'rate',type:'float'}
    ]
});