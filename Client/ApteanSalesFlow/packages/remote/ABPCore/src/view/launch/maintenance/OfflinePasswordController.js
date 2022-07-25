/*
    Controller for Offline password view.
*/
Ext.define('ABP.view.launch.settings.OfflinePasswordController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.offlinepasswordcontroller',

    listen: {
        component: {
            '*': {
                savepassword: 'saveButtonClick'
            }
        }
    },

    /**
     * Just proceed to client, offline mode will not work until password is set.
     */
    cancelButtonClick: function () {
        if (!ABP.util.Config.getLoggedIn()) {
            ABP.util.LocalStorage.setForLoggedInUser('OfflinePasswordSkipped', true);
            this.fireEvent('main_doConfiguration');
        }
        else {
            this.fireEvent('featureCanvas_hideSetting');
        }
    },

    /**
     *  Store offline password in local storage
     */
    saveButtonClick: function () {
        var me = this;
        var view = me.getView();
        var vm = this.getViewModel();
        var passwordField = me.lookupReference('offlinepassword');
        var confirmpasswordField = me.lookupReference('confirmofflinepassword');
        var password = passwordField.getValue();
        var confirmpassword = confirmpasswordField.getValue();

        if (!password) {
            passwordField.markInvalid('Enter a password');
            passwordField.focus();
            return;
        }
        if (!confirmpassword) {
            confirmpasswordField.markInvalid('Enter password again');
            confirmpasswordField.focus();
            return;
        }
        if (password !== confirmpassword) {
            ABP.view.base.popUp.PopUp.showError('offline_passwords_dont_match');
            return;
        }
        if (vm.get('bootstrapConf.validateOfflinePassword') === true) {
            var serverUrl = ABP.util.LocalStorage.get('ServerUrl');
            jsonData = {
                logonId: ABP.util.Config.getUsername(),
                environment: ABP.util.Config.getEnvironment(),
                offlinePassword: password
            };

            ABP.util.Ajax.request({
                url: serverUrl + '/abp/offlinePassword',
                withCredentials: true,
                cors: (Ext.browser.name !== 'IE' || Ext.browser.version > 9.0),
                method: 'POST',
                jsonData: jsonData,
                success: function (response) {
                    // populate configuration store
                    var resp = Ext.JSON.decode(response.responseText);
                    if (resp.resultCode === 0) {
                        me.saveOfflinePassword(password);
                    } else {
                        ABP.view.base.popUp.PopUp.showPopup(resp.errorMessage, 'error_ok_btn');
                        return;
                    }
                },
                failure: function (response) {
                    // Report failure, do not proceed.
                    ABP.view.base.popUp.PopUp.showPopup('login_error_authFailure', 'error_ok_btn');
                }
            });
        } else {
            me.saveOfflinePassword(password);
        }


    },

    saveOfflinePassword: function (password) {
        ABP.util.LocalStorage.removeForLoggedInUser('OfflinePasswordSkipped');
        var salt = ABP.util.Sha256.generateSaltForUser(ABP.util.Config.getUsername(), ABP.util.Config.getEnvironment());
        ABP.util.LocalStorage.setForLoggedInUser('OfflinePassword', ABP.util.Sha256.sha256(password, salt));
        if (!ABP.util.Config.getLoggedIn()) {
            this.fireEvent('main_doConfiguration');
        }
        else {
            this.fireEvent('featureCanvas_hideSetting');
        }
    }
});