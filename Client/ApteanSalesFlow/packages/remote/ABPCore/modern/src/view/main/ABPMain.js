Ext.define('ABP.view.main.ABPMain', {
    extend: 'Ext.Container',
    xtype: 'app-main',
    requires: [
        'Ext.MessageBox',
        'ABP.view.launch.loading.Loading',
        'ABP.view.main.ABPMainModel',
        'ABP.view.main.ABPMainController',
        'ABP.view.base.abpNumberField.ABPNumberField'
    ],

    controller: 'abpmaincontroller',
    viewModel: 'abpmainmodel',
    layout: 'fit',
    items: [
        {
            xtype: 'loadingscreen'
        }
    ],
    initialize: function () {
        var me = this;
        document.addEventListener("keydown", me.onKeyDown);

    },

    onKeyDown: function (e) {
        if (e.keyCode === 90) {
            if (e.ctrlKey && e.shiftKey) {
                // call key layover
                ABP.view.base.automation.AutomationHintOverlay.toggle();
            }
        }
    }
});