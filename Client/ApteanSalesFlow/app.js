Ext.application({
    name: 'ApteanSalesFlow',

    extend: 'ABP.view.Application',

    namespaces: [],

    requires: [
        'ABP.view.main.ABPMain',
        'ApteanSalesFlowPackage.Initialize',
        'ApteanSalesFlowPackage.*'
    ],

    // The name of the initial view to create. With the classic toolkit this class
    // will gain a "viewport" plugin if it does not extend Ext.Viewport. With the
    // modern toolkit, the main view will be added to the Viewport.
    mainView: 'ABP.view.main.ABPMain',

    launch: function () {
        var loadingpage = Ext.fly('index-loading-page');
        if (loadingpage) {
            loadingpage.destroy();
        }
        this.callParent();
        ApteanSalesFlowPackage.globals = {
            taxCountryId: 0
        }
    },

    init: function () {
        // A few ABP settings can be set as hard-coded configurations. These do not
        // come from the configuration API /abp/bootstrap or the configuration file abp-prebootstrap-config.json.
        // They take effect before abp-prebootstrap-config.json or /abp/bootstrap are loaded.
        // They must be set in init() if they are going to be used.
        ABP.util.Config.setHardcodedConfig(
            {
                enablePreBootstrapLoad: false // Set to true if you want the file resources/abp-prebootstrap-config.json to load and be used.
            }
        );
    }

});