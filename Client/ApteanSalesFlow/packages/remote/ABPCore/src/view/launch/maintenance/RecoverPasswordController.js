Ext.define('ABP.view.launch.maintenance.RecoverPasswordController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.recoverpassword',

    listen: {
        component: {
            '*': {
                recoverpw_Send: 'sendButtonClick'
            }
        }
    },

    backButtonClick: function () {
        this.fireEvent('launchCarousel_Login', this);
    },

    sendButtonClick: function () {
        var me = this;
        var vm = me.getViewModel();
        var recId = "";
        var env = "";

        if (vm.get('env_selection')) {
            env = vm.get('env_selection').id;
        }
        if (vm.get('recover_id')) {
            recId = vm.get('recover_id');
        }

        if (env !== "" && recId !== "") {
            me.getView().down('#rec-environment-combo').removeCls('login-error');
            me.getView().down('#recUrl').removeCls('login-error');
            me.fireEvent('main_showLoading', 'Sending Request', 'fullSize');
            var urlPartTwo = '/abp/RecoverPassword?loginId=' + vm.get('recover_id') + "&environment=" + env;
            Ext.Ajax.request({
                url: me.getServerUrl() + urlPartTwo,
                disableCaching: false,
                withCredentials: true,
                cors: (Ext.browser.name !== 'IE' || Ext.browser.version > 9.0),
                method: 'GET',

                success: function (response) {
                    // if bootstrap succeeds, populate configuration store
                    var resp = Ext.JSON.decode(response.responseText);
                    me.fireEvent('main_hideLoading');
                    if (resp.resultCode === 0) {
                        ABP.view.base.popUp.PopUp.showPopup('login_recover_submit_success', 'error_ok_btn', function () {
                            me.fireEvent('launchCarousel_Login', me);
                        });
                    }
                },

                failure: function () {
                    me.fireEvent('main_hideLoading');
                    ABP.view.base.popUp.PopUp.showPopup(vm.get('login_recover_failed'), vm.get('i18n.error_ok_btn'));
                }
            });
        } else {
            // Highlight offending areas
            if (env === "") {
                me.getView().down('#rec-environment-combo').addCls('login-error');
            } else {
                me.getView().down('#rec-environment-combo').removeCls('login-error');
            }
            if (recId === "") {
                me.getView().down('#recUrl').addCls('login-error');
            } else {
                me.getView().down('#recUrl').removeCls('login-error');
            }

            if (env === "" || recId === "") {
                ABP.view.base.popUp.PopUp.showPopup('login_all_fields', 'error_ok_btn');
            }
        }
    },

    getServerUrl: function () {
        return ABP.util.LocalStorage.get('ServerUrl');
    }

});