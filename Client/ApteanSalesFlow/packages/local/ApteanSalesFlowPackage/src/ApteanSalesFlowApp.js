Ext.define('ApteanSalesFlowPackage.ApteanSalesFlow', {
    requires: [
        // Require main view, controller, and service class here...
        'ApteanSalesFlowPackage.view.main.MainView'
    ],
    // Necessary property to register with ABP
    config: {
        helpLinks: [],
        aboutInfo: [{
            name: 'Your Application',
            version: "1.0.0",
            build: "001",
            copyright: 'Aptean &copy; 2018',
            detail: 'Your copyright and about app info here'
        }],
        thirdPartyAttributions: [],

    },

    // Necessary function to register your main view with ABP.
    getAppComponent: function () {
        var appConfig = {
            xtype: 'mainview'
        };
        return appConfig;
    },

    // Service function to handle shutdown request from ABP.
    //requestShutdown: function () {
    //    return 'PROCEED';
    //}

});