Ext.define('ABP.view.main.ABPMain', {
    extend: 'Ext.container.Container',
    xtype: 'app-main',
    requires: [
        'ABP.view.main.ABPMainModel',
        'ABP.view.main.ABPMainController',
        'ABP.view.launch.loading.Loading'
    ],
    controller: 'abpmaincontroller',
    viewModel: 'abpmainmodel',

    layout: {
        type: 'fit'
    },

    items: [{
        xtype: 'loadingscreen'
    }],
    listeners: {
        click: {
            element: 'el',
            fn: function() {
                ABP.util.Common.setKeyboardNavigation(false);
            }
        }
    }

});