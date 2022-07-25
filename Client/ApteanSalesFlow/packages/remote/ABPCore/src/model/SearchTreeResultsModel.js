Ext.define('ABP.model.SearchTreeResultsModel', {
    extend: 'Ext.data.Model',
    fields: [
        'appId',
        'event',
        'eventArgs',
        'text',
        'activateApp',
        'hierarchy',
        'shorthand',
        'href'
    ]
});