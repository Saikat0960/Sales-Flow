Ext.define('ABP.view.session.toolbarTop.ToolbarTopModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.toolbartopmodel',

    data: {
        title: '',
        overrideTitle: undefined,
        toolbarHeight: 44,
        toolCls: '',
        nonControlButtonsHidden: false,
        userMenu: [],
        now: Date.now(),
        showEnv: true,
        imageWidth: null
    },

    formulas: {
        micro: {
            get: function () {
                var width;
                var height;
                var ssThresh;
                var ret = false;
                if (ABP.util.Common.getModern()) {
                    width = ABP.util.Common.getWindowWidth();
                    height = ABP.util.Common.getWindowHeight();
                    ssThresh = this.get('smallScreenThreshold');
                    if (width <= ssThresh || height <= ssThresh) {
                        ret = true;
                    }
                }
                this.setToolSize(ret);
                return ret;
            }
        },
        toolbarBrandingCls: {
            bind: {
                _brand: '{mainMenuTopLabel}'
            },
            get: function (data) {
                var ret = 'toolbar-top-title';
                if (data._brand) {
                    if (data._brand.length <= 7) {
                        ret = 'toolbar-top-title';
                    } else if (data._brand.length > 7 && data._brand.length < 10) {
                        ret = 'toolbar-top-title-med';
                    } else {
                        ret = 'toolbar-top-title-sm';
                    }
                }
                return ret;
            }
        },
        toolbarTitle: {
            bind: {
                _title: '{title}',
                _override: '{overrideTitle}'
            },
            get: function (data) {
                var ret = data._title;
                if (data._override) {
                    ret = data._override;
                    this.set('nonControlButtonsHidden', true);
                } else {
                    this.set('nonControlButtonsHidden', false);
                }
                return ret;
            }
        },
        toolbarTitleImageUrl: {
            bind: {
                _toolbarTitleImageUrl: '{conf.toolbarTitleImageUrl}'
            },

            get: function (data) {
                return Ext.isEmpty(data._toolbarTitleImageUrl) ? null : data._toolbarTitleImageUrl;
            }
        },
        toolbarTitleBrandImageShow: {
            bind: {
                _toolbarTitleShowBranding: '{conf.settings.toolbarTitleShowBranding}'
            },

            get: function (data) {
                return this.get('toolbarTitleImageUrl') && data._toolbarTitleShowBranding !== false;
            }
        },
        toolbarTitleBrandNameShow: {
            bind: {
                _toolbarTitleShowBranding: '{conf.settings.toolbarTitleShowBranding}'
            },

            get: function (data) {
                return !this.get('toolbarTitleImageUrl') && data._toolbarTitleShowBranding !== false;
            }
        },
        mainMenuTopLabel: {
            bind: {
                _bootstrapConf: '{bootstrapConf.branding.companyName}'
            },
            get: function (data) {
                var ret = '';
                if (data._bootstrapConf) {
                    ret = data._bootstrapConf;
                } else {
                    ret = 'APTEAN';
                }
                return ret;
            }
        },
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
        }
    },
    setToolSize: function (micro) {
        var me = this;
        if (micro) {
            me.set('toolbarHeight', 40);
            me.set('toolCls', 'tool-top micro-tool-top');
            //me.set('menuButtonCls', 'tool-button-left toolbar-button a-toolbar-main-menu');
        } else {
            me.set('toolbarHeight', 44);
            me.set('toolCls', 'tool-top');
            //me.set('menuButtonCls', 'tool-button-left toolbar-button a-toolbar-main-menu');
        }
    }
});