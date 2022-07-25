Ext.define('ABP.view.launch.maintenance.ForcePasswordController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.forcepassword',

    listen: {
        component: {
            '*': {
                forcepw_Signin: 'signInButtonClick'
            }
        }
    },

    backButtonClick: function () {
        this.fireEvent('launchCarousel_Login', this);
    },

    signInButtonClick: function () {
        var me = this;
        var vm = me.getViewModel();
        var newPass = vm.get('newPassword');
        var confPass = vm.get('confirmPassword');
        if (newPass.length <= 0 || confPass <= 0) {
            if (newPass.length <= 0) {
                me.getView().down('#newPassword').addCls('login-error');
            } else {
                me.getView().down('#newPassword').removeCls('login-error');
            }
            if (confPass <= 0) {
                me.getView().down('#confirmPassword').addCls('login-error');
            } else {
                me.getView().down('#confirmPassword').removeCls('login-error');
            }
            ABP.view.base.popUp.PopUp.showPopup(vm.get('i18n.login_recover_enterNewPassword'), vm.get('i18n.error_ok_btn'));
        } else {
            me.getView().down('#newPassword').removeCls('login-error');
            me.getView().down('#confirmPassword').removeCls('login-error');
            if (vm.get('newPassword') !== vm.get('confirmPassword')) {
                ABP.view.base.popUp.PopUp.showPopup(vm.get('i18n.login_recover_passwordsDoNotMatch'), vm.get('i18n.error_ok_btn'));
            } else {
                var loginJson = vm.get('forcePasswordChange');

                var pwChangeData = {
                    "environment": loginJson.environment,
                    "logonId": loginJson.logonId,
                    "password": loginJson.password,
                    "newPassword": vm.get('newPassword')
                };

                me.fireEvent('main_showLoading', 'Sending Request', 'fullSize');
                var urlPartTwo = '/abp/ChangePassword/';
                Ext.Ajax.request({
                    url: me.getServerUrl() + urlPartTwo,
                    disableCaching: false,
                    withCredentials: true,
                    cors: (Ext.browser.name !== 'IE' || Ext.browser.version > 9.0),
                    method: 'POST',
                    jsonData: pwChangeData,

                    success: function (response) {
                        var r = Ext.JSON.decode(response.responseText);
                        if (r.resultCode === 0) {
                            loginJson.password = pwChangeData.newPassword;
                            me.fireEvent('main_Authenticate', loginJson);
                        } else if (r.resultCode >= 1 && r.resultCode <= 6) {
                            var i18nMsg = vm.get('i18n.' + r.errorMessageKey);
                            ABP.view.base.popUp.PopUp.showPopup(i18nMsg || r.errorMessage, vm.get('i18n.error_ok_btn'));
                            me.fireEvent('main_hideLoading');
                        } else {
                            ABP.view.base.popUp.PopUp.showPopup(vm.get('i18n.login_recover_passwordChangeFailed'), vm.get('i18n.error_ok_btn'));
                            me.fireEvent('main_hideLoading');
                        }
                    },

                    failure: function () {
                        me.fireEvent('main_hideLoading');
                        ABP.view.base.popUp.PopUp.showPopup(vm.get('i18n.login_recover_passwordChangeFailed'), vm.get('i18n.error_ok_btn'));
                    }
                });
            }
        }
    },

    getServerUrl: function () {
        return ABP.util.LocalStorage.get('ServerUrl');
    }

});