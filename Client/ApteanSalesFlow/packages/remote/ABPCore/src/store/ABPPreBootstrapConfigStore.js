/**
 * The pre-bootstrap config is a file called "abp-prebootstrap-config.json".
 * It is read from the server (if there is one) before the boostrap load is attempted.
 *
 * Its current purpose is to provide a server-specific configuration for the server URL.
 * This is useful if the ABP app is hosted on a website that does not have a discoverable API URL.
 * For example, if the app URL is https://abp.aptean.com but the API is https://abp.aptean.com:4000
 * @ignore
 */
Ext.define('ABP.store.ABPPreBootstrapConfigStore', {
    extend: 'Ext.data.Store',

    requires: [
        'ABP.model.PreBootstrapConfigModel',
        'Ext.data.proxy.Rest'
    ],

    model: 'ABP.model.PreBootstrapConfigModel',

    storeId: 'ABPPreBootstrapConfigStore',

    proxy: {
        type: 'rest',
        url: Ext.getResourcePath('abp-prebootstrap-config.json', 'shared'), // Get this JSON file from the 'shared' resource pool.
        reader: {
            type: 'json'
        }
    },

    autoload: false // The store is loaded during ABPMainController.init()

});