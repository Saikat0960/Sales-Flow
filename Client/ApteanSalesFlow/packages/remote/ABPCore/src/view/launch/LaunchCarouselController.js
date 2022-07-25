Ext.define('ABP.view.launch.LaunchCarouselController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.launchcarouselcontroller',

    listen: {
        controller: {
            '*': {
                launchCarousel_Settings: 'switchToSettings',
                launchCarousel_Login: 'switchToLogin',
                launchCarousel_Maintenance: 'switchToMaintenance',
                launchCarousel_SelectUser: 'switchToSelectUser',
                launchCarousel_Discovery: 'switchToDiscovery'
                //launchCarousel_setPaneFocus: 'setPaneFocus'
            }
        }
    },

    switchToSettings: function () {
        if (ABP.util.Common.getClassic()) {
            this.getView().setActiveTab('settings-tab');
        } else {
            this.getView().setActiveItem('#' + 'settings-tab');
            this.showLoginForm();
        }
    },

    switchToLogin: function () {
        if (ABP.util.Common.getClassic()) {
            this.getView().setActiveTab('login-tab');
        } else {
            this.getView().setActiveItem('#' + 'login-tab');
            this.showLoginForm();
        }
        if (ABP.util.Msal.enabled) {
            this.adjustLoginPageForB2cAuth();
        }
    },

    switchToMaintenance: function (xtypeToShow, additionalStepInfo) {
        var me = this;
        var view = me.getView();
        if (ABP.util.Common.getClassic()) {
            me.switchToSettings(); //wont render until settings(tab 0) has rendered
        }
        if (xtypeToShow) {
            var maintenance = view.down('maintenance');
            if (maintenance) {
                maintenance.showScreen(xtypeToShow, additionalStepInfo);
            }
        }
        if (ABP.util.Common.getClassic()) {
            this.getView().setActiveTab('maintenance-tab');
            if (xtypeToShow) {
                if (xtypeToShow === 'forcepassword') {
                    if (view.down('#newPassword')) {
                        view.down('#newPassword').focus();
                    }
                } else if (xtypeToShow === 'recoverpassword') {
                    if (view.down('#recUrl')) {
                        view.down('#recUrl').focus();
                    }
                }
            }
        } else {
            this.getView().setActiveItem('#' + 'maintenance-tab');
            this.showLoginForm();
        }
    },

    switchToSelectUser: function () {
        if (ABP.util.Common.getClassic()) {
            var v = this.getView();
            v.setActiveTab('selectuser-tab');
            Ext.defer(v.down('#selectuser-tab').initFocus, 10, v.down('#selectuser-tab'));
        } else {
            this.getView().setActiveItem('#' + 'selectuser-tab'); // TODO MODERN SELECT USER "TAB"
            this.showLoginForm();
        }
    },

    switchToDiscovery: function (options) {
        var tabName = 'discovery-tab',
            error = options ? options.error : null,
            v = this.getView();

        if (ABP.util.Common.getClassic()) {
            v.setActiveTab(tabName);
            var tab = v.down('#' + tabName),
                tabVm = tab.getViewModel();
            tabVm.set('errorText', error);
        } else {
            v.setActiveItem('#' + tabName); // TODO MODERN SELECT USER "TAB"
            this.showLoginForm();
            var tab = v.down('#' + tabName),
                tabVm = tab.getViewModel();
            tabVm.set('errorText', error);
        }
    },

    showLoginForm: function () {
        var view = this.getView();
        var wrapper = view.up('#login-form-wrapper');

        if (wrapper) {
            wrapper.setHidden(false);
        }
    },

    /**
     * Process the options prior to showing the login page.
     * @param {Object} options 
     */
    adjustLoginPageForB2cAuth: function () {
        var me = this;
        var vm = me.getViewModel();
        vm.set('b2cAuth', true);
        vm.set('showUsernameField', false);
    }
});
