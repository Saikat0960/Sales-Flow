Ext.define('ApteanSalesFlowPackage.view.main.MainView', {
    alias: 'widget.mainview',
    extend: 'Ext.Container',
    layout: 'card',
    itemId: 'mainview',

    requires: [
        'ApteanSalesFlowPackage.view.main.MainController'
    ],
    controller: 'main',
    width: '100%',
    height: '100%',
    store:{
        type: 'localstorage'
    },
    initComponent: function () {
        this.callParent();
    }
});