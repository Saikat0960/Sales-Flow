Ext.define('ABP.model.PreBootstrapConfigModel', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'serverUrl', type: 'string' },
        { name: 'overrideExistingServerUrl', type: 'boolean' },
        { name: 'usesRedirectForToken', type: 'boolean' }
    ]
});