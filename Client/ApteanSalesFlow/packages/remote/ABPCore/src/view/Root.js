Ext.define('ABP.view.Root', {
    extend: 'Ext.app.Controller',

    routes: {
        'login': {
            before: 'onBeforeLogin',
            action: 'onLogin'
        },
        'logout': 'onLogout',
        'home': 'onHome',
        'nosupport': 'onNoSupport'
    },

    // Add the ability to see the app-main (ABP.view.view.main.Main)
    // so that its view model can be used in this class.
    refs: [
        {
            ref: 'main',
            selector: 'app-main',
            autoCreate: false
        }
    ],

    onLogout: function () {
        this.fireEvent('main_DestroySession');
    },

    onBeforeLogin: function (action) {
        if (ABP.util.Config.getLoggedIn()) {
            ABP.view.base.popUp.PopUp.customPopup('reload_warning', '', '?', [{ text: 'error_ok_btn', args: true }, { text: 'error_cancel_btn', args: false }], 'main_routingWarningCallback');
        } else {
            action.resume();
        }
    },

    onLogin: function () {
        // Only show the login panel if the app is in the right state.
        // This avoids showing the login panel too early when the user
        // presses refresh and #login is in the URL.
        var vm = null;
        var main = this.getMain();
        if (main) {
            vm = main.getViewModel();
        }
        if ((vm && vm.get('bootstrapped')) || !vm) { // Defensive coding: if getting the view model failed then continue to show login.
            this.fireEvent('main_ShowLogin');
        }
    },

    onNoSupport: function () {
        this.fireEvent('main_ShowNoSupportPage');
        this.setRoutes({});
    },

    onHome: function () {
        if (this.getApplication().getMainView().down('featurecanvas')) {
            this.fireEvent('featureCanvas_triggerDefaultMenuItem');
        } else {
            this.redirectTo('');
        }
    }

});
