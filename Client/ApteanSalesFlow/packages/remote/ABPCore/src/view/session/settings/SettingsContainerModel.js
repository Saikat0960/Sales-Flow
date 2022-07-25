Ext.define('ABP.view.session.settings.SettingsContainerModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.settingscontainer',

    data: {
        now: Date.now(),
        showEnv: true,
        showEnvironment: true,
        showSessionTimer: true,
        showUserName: true
    },

    formulas: {
        username: {
            get: function () {
                var user = ABP.util.Config.getUsername();
                var allowed = (((allowed || '') + '')
                    .toLowerCase()
                    .match(/<[a-z][a-z0-9]*>/g) || [])
                    .join('');
                var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
                    commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
                return user.replace(commentsAndPhpTags, '')
                    .replace(tags, function ($0, $1) {
                        return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
                    }).replace('/>', '').trim();
            }
        },
        loggedInTime: {
            bind: {
                _loginTime: '{loginTime}',
                _now: '{now}'
            },
            get: function (data) {
                var diff = data._now - data._loginTime;
                diff = Math.floor(diff / 1000);

                var hh = Math.floor(diff / 3600);
                var mm = Math.floor(diff % 3600 / 60);
                var ss = diff % 60;

                mm = (mm < 10) ? '0' + mm : mm;
                ss = (ss < 10) ? '0' + ss : ss;

                return (hh + ":" + mm + ":" + ss);
            }
        },
        environmentName: {
            bind: {
                _selected: '{selected.environment}',
                _envStore: '{main_environmentStore}'
            },
            get: function (data) {
                if (!data._selected) {
                    data._selected = ABP.util.Config.getEnvironment();
                }
                var ret = data._selected;
                var env;
                if (data._envStore && data._selected) {
                    env = data._envStore.getById(data._selected);
                    if (env && env.data && env.data.name) {
                        ret = env.data.name;
                    }
                } else {
                    this.set('showEnv', false);
                }
                if (ret && ret.length > 25) {
                    ret = ret.slice(0, 24) + '...';
                }
                return ret;
            }
        },

        goOnlineText: {
            bind: {
                _goOnline: '{i18n.button_switch_online_mode}',
                _goOffline: '{i18n.button_switch_offline_mode}',
                _offlineMode: '{offlineMode}'
            },
            get: function (data) {
                return (data._offlineMode) ? data._goOnline : data._goOffline;
            }
        }
    }
});