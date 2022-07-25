Ext.define('ABP.store.ABPLoggingStore', {
    extend: 'Ext.data.Store',

    requires: [
        'ABP.model.ABPLoggingModel'
    ],

    model: 'ABP.model.ABPLoggingModel',

    storeId: 'ABPLoggingStore',

    proxy: {
        type: 'memory',
        reader: {
            type: 'json'
        }
    }
});