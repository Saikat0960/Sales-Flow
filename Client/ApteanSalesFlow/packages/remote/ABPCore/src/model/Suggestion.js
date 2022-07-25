Ext.define('ABP.model.Suggestion', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'timestamp', type: 'int' },
        { name: 'count', type: 'int' },
        { name: 'text', type: 'string' },
        { name: 'hierarchy', type: 'string' },
        { name: 'instanceId', type: 'string' },
        { name: 'isRecent', type: 'boolean' }
    ]
});