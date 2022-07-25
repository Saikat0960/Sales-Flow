Ext.define('ABP.view.control.ABPLoggingPopupController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.loggingpopup',

    config: {
        clearLogsClickCount: 0
    },

    constructor: function () {
        this.callParent();
    },

    onCloseClick: function () {
        var me = this;
        me.getView().closePanel();
    },

    onClickClearLogs: function () {
        var me = this;
        var view = me.getView();

        if (me.getClearLogsClickCount() > 0) {
            ABP.util.Logger.clearLogs();
            view.closePanel();
        } else {
            view.down('#clearLogsButtonContainer').add({
                xtype: 'component',
                cls: 'loggingpanel-button-text',
                html: 'Clear Logs'
            });
            me.setClearLogsClickCount(1);
        }
    },

    onClickSave: function () {
        var me = this;
        me.getView().closePanel();
    }
});
