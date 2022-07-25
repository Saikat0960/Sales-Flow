Ext.define('ABP.model.SearchModel', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'appId', type: 'string' },
        { name: 'event', type: 'string' },
        { name: 'id', type: 'string' },
        { name: 'icon', type: 'string' },
        { name: 'minLength', type: 'int' },
        { name: 'minLengthError', type: 'string' },
        { name: 'name', type: 'string' },

        /**
         * The number of recent items to display in the popup
         */
        { name: 'recents', type: 'int', defaultValue: 5 },

        /**
         * The number of characters the user needs to enter before the suggestion event is fired
         */
        { name: 'suggestionThreshold', type: 'int', defaultValue: 3 },

        /**
         * The name of the event which to fire when the threshold is reached. When this is blank no event
         * will be triggered
         */
        { name: 'suggestionEvent', type: 'string' },
    ]
});