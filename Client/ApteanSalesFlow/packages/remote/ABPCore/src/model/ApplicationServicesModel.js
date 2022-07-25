Ext.define('ABP.model.ApplicationServicesModel', {
    extend: 'Ext.data.Model',
    fields: [
        /**
         * Services is an array of objects. Eg:
         * {
         *      "name": "service name",
         *      "url": "http://mydomain/service/api"
         * }
         */
        { name: 'services', type: 'auto' }
    ]
});
