Ext.define('ABP.view.session.offline.PasswordPromptController', {
    extend: 'Ext.app.ViewController',
    requires: ['ABP.view.session.offline.PasswordPromptModel'],
    alias: 'controller.passwordprompt',

    onOkClicked: function () {
        var me = this,
            view = me.getView(),
            vm = me.getViewModel(),
            passwordField = view.down('#password'),
            password = passwordField.getValue();

        var jsonData = {};
        jsonData.environment = ABP.util.Config.getEnvironment();;
        jsonData.logonId = ABP.util.Config.getUsername();
        jsonData.password = password;
        ABP.util.Common.setViewModelProperty('switchToOnline', true);
        me.fireEvent('main_Authenticate', jsonData);
        view.close();
    },

    onCancelClicked: function () {
        var me = this;
        var view = me.getView();
        view.close();
    }
});
