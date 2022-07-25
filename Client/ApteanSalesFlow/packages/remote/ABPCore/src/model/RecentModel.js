Ext.define('ABP.model.RecentModel', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'appId', type: 'string' },
        { name: 'searchId', type: 'string' },
        { name: 'timestamp', type: 'int' },
        { name: 'count', type: 'int' },
        { name: 'text', type: 'string' },
        { name: 'hierarchy', type: 'string' },
        { name: 'instanceId', type: 'string' }
    ]
});