/**
 * Store which will read in the services.
 * @ignore
 */
Ext.define('ABP.store.ABPApplicationServicesStore', {
    extend: 'Ext.data.Store',

    requires: [
        'ABP.model.ApplicationServicesModel',
        'Ext.data.proxy.Rest'
    ],

    model: 'ABP.model.ApplicationServicesModel',

    storeId: 'ABPApplicationServicesStore',

    proxy: {
        type: 'rest',
        url: Ext.getResourcePath('application.settings.json', 'shared'), // Get this JSON file from the 'shared' resource pool.
        reader: {
            type: 'json',
            rootProperty: 'services'
        }
    },

    autoload: false // The store is loaded during ABPMainController.init()

});