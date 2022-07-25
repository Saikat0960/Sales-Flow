Ext.define('ABP.view.main.ABPMain', {
    extend: 'Ext.Container',

    controller: 'abpmaincontroller',
    viewModel: {
        type: 'abpmainmodel'
    },

    xtype: 'app-main',
    items: [
        {
            xtype: 'login'
        }
    ]

});