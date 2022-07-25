Ext.define('ABP.view.session.settings.SettingsPageModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.settingspage',

    formulas: {
        loggedInTime: {
            bind: {
                _loginTime: '{loginTime}'
            },
            get: function (data) {
                var diff = Date.now() - data._loginTime;
                diff = Math.floor(diff / 1000);

                var hh = Math.floor(diff / 3600);
                var mm = Math.floor(diff % 3600 / 60);
                var ss = diff % 60;

                mm = (mm < 10) ? '0' + mm : mm;
                ss = (ss < 10) ? '0' + ss : ss;

                return (hh + ":" + mm + ":" + ss);
            }
        }
    }

});