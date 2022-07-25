Ext.define('ABP.util.Version', {
    singleton: true,
    config: {
        version: '3.0.0',
        build: '0001'
    },
    constructor: function (config) {
        this.initConfig(config);
    }
});
