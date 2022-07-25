Ext.define('ABP.view.session.settings.SettingsContainerController', {
    extend: 'ABP.controllers.base.rightPane.RightPanePanelController',
    alias: 'controller.settingscontainer',

    listen: {
        controller: {
            '*': {
                closeActiveSettingsMenu: 'toggleMenuButton',
                rightPane_toggleTab: '__toggleTab',
                session_toggleRightPane: '__toggleTab'
            }
        }
    },

    init: function () {
        this.constructSettingsMenu();
    },
    // User Menu Section Start
    constructSettingsMenu: function () {
        var me = this;
        var settings = ABP.util.Config.getSessionConfig().settings;

        if (!settings) {
            return;
        }

        me.__initSessionTimer();
        me.__setVisibleSettings(settings);

        me.__buildDefaultSettingsView();
        // Create the application-defined settings.
        me.__createAppSettings(settings.appSettings);

        // Init Settings Views
        me.__buildFavoritesManagerView(settings);
        me.__buildHeadlinesManagerView(settings);
        me.__buildThemeOptions(settings);
        me.__buildLanguageOptions(settings);
        me.__buildAboutView(settings);
        me.__buildHelpView(settings);
        me.__buildLogsView(settings);
        me.__buildOfflineModeToggle();
        me.__buildSignOffButton(settings);

    },


    closeRightPane: function () {
        this.fireEvent('rightPane_toggle');
    },

    __initSessionTimer: function () {
        // Create a new task to run every second, update session time.
        var me = this;
        var view = me.getView();
        var vm = me.getViewModel();
        var sessionTimeLabel = view.lookupReference('sessionTimeLabel');
        var taskRunner = new Ext.util.TaskRunner();

        var sessionTimeLabel = view.lookupReference('sessionTimeLabel');
        sessionTimeLabel.task = taskRunner.newTask({
            run: function (vm) {
                try {
                    vm.set('now', Date.now());
                } catch (error) {
                    // Do not log error.
                }
            },
            interval: 1000,
            fireOnStart: true, // call run right away when the task starts.
            args: [vm]
        });
        sessionTimeLabel.task.start();
    },

    __setVisibleSettings: function (settings) {
        var me = this;
        var vm = me.getViewModel();
        if (settings.settingsPage && Ext.isBoolean(me.__boolConverter(settings.settingsPage.showEnvironment))) {
            vm.set('showEnvironment', settings.settingsPage.showEnvironment);
        }
        if (settings.settingsPage && Ext.isBoolean(me.__boolConverter(settings.settingsPage.showSessionTimer))) {
            vm.set('showSessionTimer', settings.settingsPage.showSessionTimer);
        }
        if (settings.settingsPage && Ext.isBoolean(me.__boolConverter(settings.settingsPage.enableUser))) {
            vm.set('showUserName', settings.settingsPage.enableUser);
        }
    },

    __buildDefaultSettingsView: function () {
        var me = this,
            view = me.getView(),
            displayName = ABP.util.Config.getDisplayName(),
            hideUserName = (displayName === ABP.util.Config.getUsername());

        var canEditProfile = ABP.util.Config.getSessionConfig().settings.userConfig.enableEditProfile;

        var height = 40,
            ariaRole = 'presentation',
            focusable = false,
            cls = 'x-unselectable settings-container-profile-container content-header',
            overCls = '',
            tooltip = '';

        if (!hideUserName) {
            cls += ' large-profile-icon'
        }
        if (canEditProfile) {
            height = 70;
            ariaRole = 'button';
            focusable = true;
            cls += ' editable';
            overCls = 'user-profile-over';
            tooltip = ABP.util.Common.geti18nString('sessionMenu_editPreferences');
        }


        var userContainer = {
            xtype: 'container',
            overCls: overCls,
            cls: cls,
            height: height,
            focusable: focusable,
            ariaRole: ariaRole,
            tooltip: tooltip,
            tabIndex: 0,
            bind: {
                hidden: '{!showUserName}'
            },
            layout: {
                type: 'hbox',
                align: 'center',
                pack: 'start'
            },

            items: [{
                    xtype: 'abpprofileimage',
                    bind: {
                        src: '{profilePhoto}'
                    },
                    margin: '0 0 0 7',
                    width: height - 10,
                    height: height - 10
                },
                {
                    xtype: 'container',
                    layout: 'vbox',
                    flex: 1,
                    items: [{
                            xtype: 'label',
                            margin: '0 0 0 5',
                            flex: 2,
                            bind: {
                                html: displayName ? Ext.String.htmlEncode(displayName) : Ext.String.htmlEncode(ABP.util.Config.getUsername())
                            }
                        },
                        {
                            xtype: 'label',
                            margin: '0 0 0 5',
                            flex: 1,
                            cls: 'user-name',
                            bind: {
                                html: Ext.String.htmlEncode(ABP.util.Config.getUsername()),
                                hidden: hideUserName
                            }
                        }
                    ]
                }

            ]
        };

        if (canEditProfile) {
            if (ABP.util.Common.getModern()) {
                userContainer.listeners = {
                    click: {
                        element: 'element', //bind to the underlying el property on the panel
                        fn: function () {
                            me.onUserProfileClick(this);
                        }
                    }
                }
            } else {
                userContainer.listeners = {
                    element: 'el',
                    click: function (e) {
                        me.onUserProfileClick(this);
                    },
                    keydown: function (f) {
                        if (f.getKey() === f.ENTER) {
                            me.onUserProfileClick(this);
                        } else if (f.getKey() === f.ESC) {
                            me.onCloseUserSettings(this);
                        }
                    }
                }
            }

        }

        view.add(userContainer);
    },

    onCloseUserSettings: function (cmp) {
        this.fireEvent('rightPane_toggle');
    },
    onUserProfileClick: function (cmp) {
        this.fireEvent(ABP.Events.userProfileEdit, cmp.component);
    },

    __buildFavoritesManagerView: function (settings) {
        var me = this;
        var view = me.getView();

        if (settings.enableMenuFavorites) {
            view.add({
                bind: {
                    text: '{i18n.sessionMenu_manageFavorites:htmlEncode}',
                    ariaLabel: '{i18n.sessionMenu_manageFavorites:ariaEncode}'
                },
                automationCls: 'toolusermenu-favorites',
                handler: 'launchFavoritesManager'
            });
        }
    },

    __buildHeadlinesManagerView: function (settings) {
        var me = this;
        var view = me.getView();
        if (settings.settingsPage && me.__boolConverter(settings.settingsPage.enableHeadlinesManager)) {
            if (ABP.util.Common.getModern()) {
                // Current not supported on modern.
                return;
            }
            // Fire the event to allow the application to hook into the headlines store of the headline manager grid.
            me.fireEvent('headline_manager_initialize', Ext.create("Ext.data.Store", {
                storeId: "ABPHeadlines",
                autoDestroy: false,
                fields: [
                    'actionText',
                    'actionTextKey',
                    'message',
                    'messageKey',
                    {
                        name: 'startTime',
                        type: 'date'
                    },
                    {
                        name: 'endTime',
                        type: 'date'
                    },
                    {
                        name: 'published',
                        type: 'boolean'
                    },
                    {
                        name: 'priority',
                        type: 'int'
                    },
                    'uniqueId'
                ]
            }));
            view.add({
                bind: {
                    text: '{i18n.sessionMenu_manageHeadlines:htmlEncode}',
                    ariaLabel: '{i18n.sessionMenu_manageHeadlines:ariaEncode}'
                },
                automationCls: 'toolusermenu-headlines',
                handler: 'launchHeadlinesManager'
            });
        }
    },

    __buildAboutView: function (settings) {
        var me = this;
        var view = me.getView();

        if (settings.enableAbout || settings.settingsPage.enableAbout) {
            view.add({
                bind: {
                    text: '{i18n.sessionMenu_about:htmlEncode}',
                    ariaLabel: '{i18n.sessionMenu_about:ariaEncode}'
                },
                automationCls: 'toolusermenu-about',
                handler: 'launchAbout'
            });
        }
    },

    __buildHelpView: function (settings) {
        var me = this;
        var view = me.getView();

        if (settings.settingsPage.enableHelp) {
            view.add({
                bind: {
                    text: '{i18n.sessionMenu_help:htmlEncode}',
                    ariaLabel: '{i18n.sessionMenu_help:ariaEncode}'
                },
                automationCls: 'toolusermenu-help',
                handler: 'launchHelp'
            });
        }
    },

    __buildLogsView: function (settings) {
        var me = this;
        var view = me.getView();

        if (settings.settingsPage.enableLoggerView) {
            view.add({
                bind: {
                    text: '{i18n.sessionMenu_logger:htmlEncode}',
                    ariaLabel: '{i18n.sessionMenu_logger:ariaEncode}'
                },
                automationCls: 'toolusermenu-logger',
                handler: 'launchLogger'
            });
        }
    },

    __buildThemeOptions: function (settings) {
        var me = this;
        var view = me.getView();
        var vm = me.getViewModel();
        var themeOptions = [];
        var i = 0;
        if (settings.settingsPage.enableThemeChange) {
            if (Ext.theme && Ext.theme.subThemeList) {
                var themes = Ext.theme.subThemeList;
                // may need to move this to the 
                var selected = ABP.util.LocalStorage.getForLoggedInUser('ChosenTheme');

                if (themes) {
                    for (i = 0; i < themes.length; ++i) {
                        var title = themes[i].split('aptean-theme-')[1];
                        title = ABP.util.String.makeHumanReadable(title, '-');

                        themeOptions.push({
                            title: title,
                            name: 'themes',
                            automationCls: title + '-radio',
                            value: themes[i],
                            checked: selected && selected === themes[i]
                        });
                    }
                    view.add(me.__createRadialSetting({
                        titleKey: 'sessionMenu_theme',
                        automationCls: 'toolusermenu-themes',
                        cls: 'theme-option',
                        ui: 'radiobutton',
                        appId: 'container',
                        event: 'switchTheme',
                        addToggle: true,
                        options: themeOptions,
                        layout: Ext.toolkit === 'classic' ? 'table' : 'hbox'
                    }));
                }
            }
        }
    },

    __buildLanguageOptions: function (settings) {
        var me = this;
        var view = me.getView();
        var vm = me.getViewModel();
        var langmenu = [];
        var currentLanguage = ABP.util.Config.getLanguage();
        var i = 0;
        var env;
        var languages;

        if (settings.settingsPage.enableLanguages) {
            env = vm.get('selected.environment');
            if (env) {
                env = vm.get('main_environmentStore').getById(env);
                if (env && env.data && env.data.languages) {
                    languages = env.data.languages;
                    for (i = 0; i < languages.length; ++i) {
                        langmenu.push({
                            title: Ext.String.htmlEncode(languages[i].name),
                            name: 'languages',
                            value: languages[i].key,
                            checked: languages[i].key === currentLanguage
                        });
                    }
                    view.add(me.__createRadialSetting({
                        titleKey: 'sessionMenu_languages',
                        automationCls: 'toolusermenu-languages',
                        cls: 'language-option',
                        appId: 'container',
                        event: 'switchLanguage',
                        options: langmenu,
                        layout: 'vbox'
                    }));
                }
            }
        }
    },

    __buildOfflineModeToggle: function () {
        var me = this;
        var view = me.getView();
        var vm = me.getViewModel();
        if (ABP.util.LocalStorage.get('OfflineBootstrap')) {
            if (vm.get('bootstrapConf.hideOfflineModeToggle') === true) {
                return;
            }
            if (vm.get('bootstrapConf.offlineAuthenticationType') === 1) {
                // Offline password auth type - add the set offline password button.
                view.add({
                    bind: {
                        text: '{i18n.sessionMenu_setOfflinePassword:htmlEncode}',
                        hidden: '{offlineMode}',
                        ariaLabel: '{i18n.sessionMenu_setOfflinePassword}'
                    },
                    cls: 'settings-container-button',
                    ui: 'menuitem',
                    uiCls: 'light',
                    textAlign: 'left',
                    automationCls: 'toolusermenu-setofflinepassword',
                    handler: 'setOfflinePassword'
                });
            }
            // Offline bootstrap exists, user may toggle online/offline mode.
            view.add({
                bind: {
                    text: '{goOnlineText:htmlEncode}',
                    ariaLabel: '{goOnlineText:ariaEncode:ariaEncode}'
                },
                cls: 'settings-container-button',
                ui: 'menuitem',
                uiCls: 'light',
                textAlign: 'left',
                automationCls: 'toolusermenu-swtichonlinestate',
                handler: 'switchOnlineState'
            })
        }
    },

    __buildSignOffButton: function (settings) {
        var me = this;
        var view = me.getView();

        if (settings.settingsPage.enableSignOff) {
            view.add({
                bind: {
                    text: '{i18n.sessionMenu_signoff:htmlEncode}',
                    ariaLabel: '{i18n.sessionMenu_signoff:ariaEncode}'
                },
                automationCls: 'toolusermenu-signoff',
                handler: 'logout'
            });
        }
    },
    // Handler for when the right pane or a particular panel is toggled.
    // Calls into __toggleMenuButton and also Determines whether or not to start/stop the task runner.
    __toggleTab: function (tab) {
        var me = this;
        var sessionTimeLabel, startTask;
        var view = me.getView();
        var vm = view.getViewModel();
        var rightPaneOpen = vm.get('rightPaneOpen');
        sessionTimeLabel = me.lookupReference('sessionTimeLabel');
        // First call to toggle any active menu buttons.
        me.toggleMenuButton(tab);

        if (Ext.toolkit === 'modern') {
            startTask = rightPaneOpen;
        } else {
            // Now determine if the session time task runner needs to be stopped/resumed.
            if (tab) {
                // Tab was provided, if settings was activated start the task.
                startTask = (tab.uniqueId === 'abp-settings')
            }
            // Right pane was just closed, settings is obviously not showing so stop the task.
            if (rightPaneOpen === false) {
                startTask = false;
            }
        }

        if (startTask === true && sessionTimeLabel.task.stopped === true) {
            sessionTimeLabel.task.start();
        } else if (startTask === false && sessionTimeLabel.task.stopped === false) {
            sessionTimeLabel.task.stop();
        }
    },

    launchFavoritesManager: function () {
        if (Ext.toolkit === 'modern') {
            this.fireEvent('rightPane_toggle');
        }
        this.fireEvent('container_showSettings', 'favoritesManager');
    },

    launchHeadlinesManager: function () {
        if (Ext.toolkit === 'modern') {
            this.fireEvent('rightPane_toggle');
        }
        this.fireEvent('container_showSettings', 'headlinesManager');
    },

    launchHelp: function () {
        if (Ext.toolkit === 'modern') {
            this.fireEvent('rightPane_toggle');
        }
        this.fireEvent('container_showSettings', 'helpview');
    },

    launchAbout: function () {
        if (Ext.toolkit === 'modern') {
            this.fireEvent('rightPane_toggle');
        }
        this.fireEvent('container_showSettings', 'about');
    },

    launchLogger: function () {
        if (Ext.toolkit === 'modern') {
            this.fireEvent('rightPane_toggle');
        }
        this.fireEvent('container_showSettings', 'loggerpage');
    },

    logout: function () {
        this.fireEvent('main_fireAppEvent', 'container', 'signout', ['user init', false]);
    },

    setOfflinePassword: function () {
        if (Ext.toolkit === 'modern') {
            this.fireEvent('rightPane_toggle');
        }
        this.fireEvent('container_showSettings', 'offlinepassword');
    },

    switchOnlineState: function () {
        var me = this,
            view = me.getView(),
            vm = view.getViewModel();
        if (vm.get('offlineMode')) {
            me.fireEvent('container_go_online');
        } else {
            me.fireEvent('container_go_offline');
        }
    },

    //changed for product backlog item - 36167
    // Create the custom application settings 
    //Custom menus,Buttons - radio group, checkbox group, boolean.
    __createAppSettings: function (appSettings) {
        if (!appSettings) {
            return;
        }
        var me=this;
             
        var i = 0;
        for (i = 0; i < appSettings.length; ++i) {
            if (appSettings[i].type === 'check') {
                me.__createCheckSetting(appSettings[i]);
            } else if (appSettings[i].type === 'radial') {
                me.__createRadialSetting(appSettings[i]);
            } else if (appSettings[i].type === 'bool') {
                me.__createCheckSetting(appSettings[i], true);
            } else if (appSettings[i].type === 'event') {
                me.__createButtonSetting(appSettings[i]);
            }else if (appSettings[i].type === 'menu') {
                        var menuItemsContainer={
                        xtype:'container',
                        items:[]
                    }
                    var menuItems={
                        xtype:'container',
                        margin:'0 0 0 7',
                        items:[{
                            xtype:appSettings[i].xtype
                        }]
                    }
                    menuItemsContainer.items.push(menuItems)
                    me.addMenuButton(menuItemsContainer.items,{
                        title:appSettings[i].title,
                        cls: 'settings-container-button',
                    })
                

            }
        }
    
    },
    //end comment for changed for product backlog item - 36167

    // Create custom checkbox group.
    __createCheckSetting: function (appSetting, bool) {
        var me = this;
        var view = me.getView();
        var checks = [];
        var ci = 0;
        var end = bool ? 1 : appSetting.options.length;
        var padding = (bool === true) ? '0 0 0 8' : '0 0 0 0';
        for (ci = 0; ci < end; ++ci) {
            checks.push({
                xtype: 'checkbox',
                indent: false,
                padding: padding,
                name: appSetting.options[ci].value,
                boxLabel: appSetting.options[ci].title,
                boxLabelAlign: 'after',
                bind: appSetting.options[ci].titleKey ? {
                    boxLabel: '{i18n.' + appSetting.options[ci].titleKey + ':htmlEncode}'
                } : {},
                cls: 'settings-container-checkfield',
                automationCls: 'toolusermenu-check-' + appSetting.options[ci].value,
                event: appSetting.appId + '_' + appSetting.event,
                checked: me.__boolConverter(appSetting.options[ci].checked),
                listeners: {
                    change: function () {
                        var values = {};
                        if (Ext.toolkit === 'modern') {
                            this.up().items.each(function (item) {
                                values[item.name] = item.isChecked();
                            });
                        } else {
                            this.up().items.each(function (item) {
                                values[item.name] = item.getValue();
                            });
                        }
                        me.fireEvent(this.event, values);
                    }
                }
            });
        }

        me.addMenuButton(checks, {
            layout: appSetting.layout,
            title: appSetting.title,
            titleKey: appSetting.titleKey,
            cls: 'settings-container-button',
            automationCls: 'toolusermenu-unsafe-' + appSetting.titleKey || appSetting.title
        });
    },

    // Create custom radio fields.
    __createRadialSetting: function (appSetting) {
        var me = this;
        var view = me.getView();
        var btnCls = 'settings-container-button';
        var radialOptions = [];
        var radialMenu;
        var showLabel;
        var ci = 0;
        if (!appSetting.layout) {
            appSetting.layout = 'vbox';
        }
        showLabel = appSetting.layout === 'vbox';
        for (ci = 0; ci < appSetting.options.length; ++ci) {
            var currOption = {
                xtype: 'radiofield',
                name: appSetting.options[ci].name || 'radField', //radField for backwards compatibility.
                indent: false,
                boxLabelAlign: 'after',
                boxLabel: showLabel ? appSetting.options[ci].title : null,
                //bind: appSetting.options[ci].titleKey && showLabel ? { boxLabel: '{i18n.' + appSetting.options[ci].titleKey + ':htmlEncode}' } : {},
                cls: 'settings-container-radio' + ' ' + appSetting.cls,
                automationCls: 'toolusermenu-radio-' + appSetting.options[ci].value + ' ' + appSetting.cls,
                event: appSetting.appId + '_' + appSetting.event,
                checked: me.__boolConverter(appSetting.options[ci].checked),
                inputValue: appSetting.options[ci].value, // classic
                ariaRole: 'menuitemradio',
                listeners: {
                    change: function (radio, value) {
                        // modern
                        if (value === false) {
                            return
                        }
                        var values = {};
                        values[radio.name] = ABP.util.Common.getModern() ? radio.config.inputValue : radio.inputValue;
                        me.fireEvent(this.event, values);
                    },
                    specialkey: function (radio, key) {
                        var parent = radio.ownerCt,
                            ev = key.event.key,
                            parentIndex = parent.ownerCt.items.keys.indexOf(parent.id);
                        if (ev === 'ArrowLeft' || ev === 'ArrowRight') {
                            key.event.preventDefault();
                            if (ev === 'ArrowLeft') {
                                parent.ownerCt.items.items[parentIndex - 1].click();
                            }
                        }
                    }
                }
            }
            if (appSetting.options[ci].titleKey) {
                currOption.bind = {
                    ariaLabel: '{i18n.' + appSetting.options[ci].titleKey + ':ariaEncode}'
                }
                if (showLabel) {
                    currOption.bind.boxLabel = '{i18n.' + appSetting.options[ci].titleKey + ':htmlEncode}'
                }
            } else if (appSetting.options[ci].title) {
                currOption.ariaLabel = appSetting.options[ci].title;
            }

            radialOptions.push(currOption);
        }

        btnCls += appSetting.automationCls ? '' : ' a-toolusermenu-unsafe-' + appSetting.titleKey || appSetting.title;

        return me.addMenuButton(radialOptions, {
            layout: appSetting.layout,
            title: appSetting.title,
            titleKey: appSetting.titleKey,
            cls: btnCls,
            automationCls: appSetting.automationCls || undefined,
            listeners: {
                click: function (button) {
                    setTimeout(function () {
                        if (!button.nextSibling().hidden) {
                            var selected = button.nextSibling().items.items.filter(function (item) {
                                return item.checked === true;
                            });
                            if (selected.length > 0) {
                                selected[0].focus();
                            } else {
                                button.nextSibling().items.items[0].focus();
                            }
                        }
                    }, 100);
                }
            },
            keyMap: {
                scope: 'this',
                RIGHT: me.__onSpecialKeyPress,
                LEFT: me.__onSpecialKeyPress
            }
        });
    },

    __onSpecialKeyPress: function (event, button) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
            var key = event.event.key,
                menu = button.nextSibling(),
                shouldClick = (key === 'ArrowRight' && menu.hidden) || (key === 'ArrowLeft' && !menu.hidden)
            if (shouldClick) {
                button.click();
            }
        }
    },

    __createButtonSetting: function (appSetting) {
        var me = this;
        var view = me.getView();
        view.add({
            text: appSetting.title,
            bind: appSetting.titleKey ? {
                text: '{i18n.' + appSetting.titleKey + ':htmlEncode}'
            } : {},
            cls: 'settings-container-button',
            ui: 'menuitem',
            uiCls: 'light',
            textAlign: 'left',
            automationCls: 'toolusermenu-unsafe-' + appSetting.titleKey || appSetting.title,
            event: appSetting.event,
            eventArgs: appSetting.eventArgs,
            iconCls: appSetting.icon,
            appId: appSetting.appId,
            activateApp: appSetting.activateApp,
            listeners: {
                click: function (button) {
                    this.fireEvent('main_fireAppEvent', button.appId, button.event, button.eventArgs);
                },
                tap: function (button) {
                    this.fireEvent('main_fireAppEvent', button.appId, button.event, button.eventArgs);
                },
                scope: me
            }
        });
    },

    __boolConverter: function (item) {
        if (typeof item === 'string' || item instanceof String) {
            switch (item.toLowerCase()) {
                case 'false':
                case '0':
                    return false;
                case 'true':
                case '1':
                    return true;
            }
        } else {
            if (Ext.isBoolean(item)) {
                return item;
            } else {
                return false;
            }
        }
    }
});