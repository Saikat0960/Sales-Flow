Ext.define('ApteanSalesFlowPackage.view.main.MainView', {
    extend: 'Ext.Container',
    alias: 'widget.mainview',
    layout: 'card',
    itemId: 'mainview',

    requires: [
        'ApteanSalesFlowPackage.view.main.MainController'
    ],
    controller: 'main',
    width: '100%',
    height: '100%',
    initialize: function () {
        this.callParent();
    }
});