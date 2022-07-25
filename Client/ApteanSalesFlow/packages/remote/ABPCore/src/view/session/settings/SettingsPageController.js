Ext.define('ABP.view.session.settings.SettingsPageController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.settingspage',

    init: function () {
        this.fireEvent('container_toolbar_setTitle', 'sessionMenu_settings');
        this.__constructSettingsPage();
    },

    __constructSettingsPage: function () {
        var me = this;
        var view = me.getView();
        var vm = me.getViewModel();
        var userItems = [];
        var settings = ABP.util.Config.getSessionConfig().settings;
        var m_items = [];
        var innerItems = [];
        var env;
        var selLang;
        var languages;
        var i = 0;

        m_items.push({
            xtype: 'container',
            docked: 'top',
            layout: { type: 'hbox', pack: 'end' },
            items: [{
                xtype: 'button',
                bind: {
                    text: '{i18n.settingsCanvas_close:htmlEncode}'
                },
                focusCls: '',
                overCls: '',
                handler: 'closeClicked'
            }]
        });

        if (settings.settingsPage.enableUser) {
            userItems.push({
                xtype: 'textfield',
                bind: {
                    label: '{i18n.sessionMenu_user:htmlEncode}'
                },
                cls: 'settingspage-field',
                labelCls: 'settingspage-label',
                labelWidth: '35%',
                value: Ext.String.htmlEncode(ABP.util.Config.getUsername()),
                readOnly: true
            });
        }
        if (settings.settingsPage.showEnvironment) {
            userItems.push({
                xtype: 'textfield',
                bind: {
                    label: '{i18n.sessionMenu_environment:htmlEncode}',
                    value: '{selected.environment}'
                },
                cls: 'settingspage-field',
                labelCls: 'settingspage-label',
                labelWidth: '45%',
                readOnly: true
            });
        }
        if (settings.settingsPage.showSessionTimer) {
            userItems.push({
                xtype: 'textfield',
                bind: {
                    label: '{i18n.sessionMenu_time:htmlEncode}',
                    value: '{loggedInTime}'
                },
                labelWidth: '45%',
                cls: 'settingspage-field',
                labelCls: 'settingspage-label',
                readOnly: true
            });
        }

        if (!Ext.isEmpty(userItems)) {
            m_items.push({
                xtype: 'panel',
                bind: {
                    title: '{i18n.settings_userInfo}'
                },
                cls: 'settings-info-panel',
                layout: { type: 'vbox', align: 'stretch' },
                items: [userItems]
            });
        }
        // Options
        // Languages
        if (settings.enableLanguages) {
            env = vm.get('selected.environment');
            if (env) {
                selLang = vm.get('selected.language');
                env = vm.get('main_environmentStore').getById(env);
                if (env && env.data && env.data.languages) {
                    languages = env.data.languages;
                    innerItems = [];
                    for (i = 0; i < languages.length; ++i) {
                        innerItems.push({
                            xtype: 'radiofield',
                            name: 'languages',
                            value: languages[i].key,
                            label: languages[i].name,
                            cls: 'settingspage-field',
                            labelCls: 'settingspage-label',
                            checked: selLang === languages[i].key,
                            listeners: {
                                'check': function () {
                                    me.fireEvent('container_switchLanguage', this.getValue());
                                }
                            }
                        });
                    }
                    if (!Ext.isEmpty(innerItems)) {
                        m_items.push({
                            xtype: 'formpanel',
                            bind: {
                                title: '{i18n.settings_languages}'
                            },
                            cls: 'settings-info-panel',
                            automationCls: 'languages-panel',
                            layout: { type: 'vbox', align: 'stretch' },
                            items: innerItems
                        });
                    }
                }
            }
        }
        // App Settings
        if (settings.appSettings) {
            m_items = m_items.concat(me.getAppSettings(settings.appSettings));
        }
        // Internal links
        if (settings.enableHelp || settings.enableAbout || settings.enableLogger) {
            innerItems = [];
            if (settings.enableHelp) {
                innerItems.push({
                    xtype: 'button',
                    cls: 'settingspage-link-button',
                    bind: {
                        text: '{i18n.sessionMenu_help:htmlEncode}'
                    },
                    handler: 'launchHelp'
                });
            }
            if (settings.enableAbout) {
                innerItems.push({
                    xtype: 'button',
                    cls: 'settingspage-link-button',
                    bind: {
                        text: '{i18n.sessionMenu_about:htmlEncode}'
                    },
                    handler: 'launchAbout'
                });
            }
            if (settings.enableLoggerView) {
                innerItems.push({
                    xtype: 'button',
                    cls: 'settingspage-link-button',
                    bind: {
                        text: '{i18n.sessionMenu_logger:htmlEncode}'
                    },
                    handler: 'launchLogger'
                });
            }
            if (!Ext.isEmpty(innerItems)) {
                m_items.push({
                    xtype: 'panel',
                    bind: {
                        title: '{i18n.settings_internalLinks}'
                    },
                    cls: 'settings-info-panel',
                    layout: { type: 'vbox', align: 'stretch' },
                    items: innerItems
                });
            }
        }
        view.add(m_items);
    },

    getAppSettings: function (appSettings) {
        var me = this;
        var ret = [];
        var i = 0;
        for (i = 0; i < appSettings.length; ++i) {
            if (appSettings[i].type) {
                if (appSettings[i].type === 'check') {
                    ret.push(me.createCheckSetting(appSettings[i]));
                } else if (appSettings[i].type === 'radial') {
                    ret.push(me.createRadialSetting(appSettings[i]));
                } else if (appSettings[i].type === 'bool') {
                    ret.push(me.createBoolSetting(appSettings[i]));
                } else if (appSettings[i].type === 'info') {
                    ret.push(me.createInfoSetting(appSettings[i]));
                }
            }
        }
        return ret;
    },
    createCheckSetting: function (appSetting) {
        var me = this;
        var ret;
        var checks = [];
        var ci = 0;
        for (ci = 0; ci < appSetting.options.length; ++ci) {
            checks.push({
                xtype: 'checkboxfield',
                value: true,
                name: appSetting.options[ci].value,
                label: appSetting.options[ci].title,
                bind: appSetting.options[ci].titleKey ? { label: '{i18n.' + appSetting.options[ci].titleKey + ':htmlEncode}' } : {},
                cls: 'settingspage-field',
                labelCls: 'settingspage-label',
                event: appSetting.appId + '_' + appSetting.event,
                checked: appSetting.options[ci].checked === "true" || appSetting.options[ci].checked === true,
                listeners: {
                    'check': function () {
                        var vals = this.up('formpanel').getValues();
                        for (var propt in vals) {
                            if (vals.hasOwnProperty(propt)) {
                                if (vals[propt] === null) {
                                    vals[propt] = false;
                                }
                            }
                        }
                        me.fireEvent(this.event, vals);
                    },
                    'uncheck': function () {
                        var vals = this.up('formpanel').getValues();
                        for (var propt in vals) {
                            if (vals.hasOwnProperty(propt)) {
                                if (vals[propt] === null) {
                                    vals[propt] = false;
                                }
                            }
                        }
                        me.fireEvent(this.event, vals);
                    }
                }
            });
        }
        if (!Ext.isEmpty(checks)) {
            ret = {
                xtype: 'formpanel',
                title: appSetting.title,
                bind: appSetting.titleKey ? { title: '{i18n.' + appSetting.titleKey + '}' } : {},
                cls: 'settings-info-panel',
                layout: { type: 'vbox', align: 'stretch' },
                items: checks
            }
        }
        return ret;
    },
    createRadialSetting: function (appSetting) {
        var me = this;
        var ret;
        var rads = [];
        var ci = 0;
        for (ci = 0; ci < appSetting.options.length; ++ci) {
            rads.push({
                xtype: 'radiofield',
                value: appSetting.options[ci].value,
                name: 'radField',
                label: appSetting.options[ci].title,
                bind: appSetting.options[ci].titleKey ? { label: '{i18n.' + appSetting.options[ci].titleKey + ':htmlEncode}' } : {},
                cls: 'settingspage-field',
                labelCls: 'settingspage-label',
                event: appSetting.appId + '_' + appSetting.event,
                checked: appSetting.options[ci].checked,
                listeners: {
                    'check': function () {
                        me.fireEvent(this.event, this.up('formpanel').getValues());
                    }
                }
            });
        }
        if (!Ext.isEmpty(rads)) {
            checkTitle = ABP.util.Common.geti18nString(appSetting.title);
            ret = {
                xtype: 'formpanel',
                title: appSetting.title,
                bind: appSetting.titleKey ? { title: '{i18n.' + appSetting.titleKey + '}' } : {},
                cls: 'settings-info-panel',
                layout: { type: 'vbox', align: 'stretch' },
                items: rads
            }
        }
        return ret;
    },
    createBoolSetting: function (appSetting) {
        var me = this;
        var ret = {
            xtype: 'panel',
            title: appSetting.title,
            bind: appSetting.titleKey ? { title: '{i18n.' + appSetting.titleKey + '}' } : {},
            cls: 'settings-info-panel',
            layout: { type: 'vbox', align: 'stretch' },
            items: [{
                xtype: 'togglefield',
                name: appSetting.options[0].value,
                value: appSetting.options[0].checked,
                label: appSetting.options[0].title,
                bind: appSetting.options[0].titleKey ? { label: '{i18n.' + appSetting.options[0].titleKey + ':htmlEncode}' } : {},
                cls: 'settingspage-field',
                labelCls: 'settingspage-label',
                event: appSetting.appId + '_' + appSetting.event,
                listeners: {
                    'change': function (tf, newVal) {
                        var name = tf.getName();
                        me.fireEvent(this.event, { name: newVal });
                    }
                }
            }]
        };
        return ret;
    },
    createInfoSetting: function (appSetting) {
        var ret = {
            xtype: 'panel',
            title: appSetting.title,
            bind: appSetting.titleKey ? {
                title: '{i18n.' + appSetting.titleKey + '}'
            } : {},
            cls: 'settings-info-panel',
            layout: { type: 'vbox', align: 'stretch' },
            items: [{
                xtype: 'textareafield',
                cls: 'settingspage-field',
                readOnly: true,
                maxRows: 4,
                scrollable: 'y',
                value: appSetting.text,
                bind: appSetting.textKey ? {
                    value: '{i18n.' + appSetting.textKey + '}'
                } : {}
            }]
        };
        return ret;
    },

    launchHelp: function () {
        this.fireEvent('container_showSettings', 'helpview');
    },
    launchAbout: function () {
        this.fireEvent('container_showSettings', 'about');
    },
    launchLogger: function () {
        this.fireEvent('container_showSettings', 'loggerpage');
    },
    closeClicked: function () {
        this.fireEvent('featureCanvas_hideSetting');
    }

});
