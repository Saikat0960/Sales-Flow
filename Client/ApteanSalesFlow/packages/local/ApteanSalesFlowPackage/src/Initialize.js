Ext.define('ApteanSalesFlowPackage.Initialize', {
    singleton: true,
    requires: [
        'ApteanSalesFlowPackage.ApteanSalesFlow'
    ],

    constructor: function () {
        try {
            ABP.util.PluginManager.register('ApteanSalesFlowPackage', 'ApteanSalesFlowPackage.ApteanSalesFlow');
        }
        catch (err) {
            ABP.util.Logger.logError("Cannot register Your Application Package plugins: " + err.message);
        }
    }
});