/**
 * Store which will read in the services.
 * @ignore
 */
Ext.define('ABP.store.ApplicationAuthenticationStore', {
    extend: 'Ext.data.Store',

    requires: [        
        'Ext.data.proxy.Rest'
    ],

    storeId: 'ApplicationAuthenticationStore',

    proxy: {
        type: 'rest',
        url: Ext.getResourcePath('application.settings.json?_dc=' + Date.now(), 'shared'), // Get this JSON file from the 'shared' resource pool.
        reader: {
            type: 'json',
            rootProperty: 'authentication'
        }
    }
});