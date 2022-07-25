Ext.define('ApteanSalesFlowPackage.model.Currencies', {
    extend: 'Ext.data.Model',

    fields: [
       { name: 'name', type: 'string' },
       {name: 'id', type: 'int'},
       {name: 'country_Id', type: 'int'}
    ]
});