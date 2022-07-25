Ext.define('ABP.model.WCAGRegion', {
    extend: 'Ext.data.Model',
    alias: 'model.wcagregion',
    fields: [
        { name: 'domId', type: 'string' },
        { name: 'text', type: 'string' },
        { name: 'textKey', type: 'string' },
        { name: 'event', type: 'string' },
        { name: 'context', type: 'string' }
    ]
});