/**
 * The global store for environments passed in from the boostrap config
 * @ignore
 */
Ext.define('ABP.store.ABPEnvironmentStore', {
    extend: 'Ext.data.Store',

    requires: [
        'ABP.model.EnvironmentModel'
    ],

    model: 'ABP.model.EnvironmentModel',

    storeId: 'ABPEnvironmentStore'
});