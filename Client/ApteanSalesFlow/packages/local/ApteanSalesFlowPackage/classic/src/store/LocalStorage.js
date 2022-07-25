Ext.define('ApteanSalesFlowPackage.store.LocalStorage', {
    extend: 'Ext.data.Store',
    alias: 'store.localstorage',
    storeId: 'localStore',
    fields: [
        {name:'url',type:'string'}
    ],
    proxy: {
        type: 'localstorage',
        id  : 'urlID'
    }
    });