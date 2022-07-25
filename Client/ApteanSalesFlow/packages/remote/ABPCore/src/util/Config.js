/**
 * The singleton class that holds the current configuration for the ABP container
 */
Ext.define('ABP.util.Config', {
    singleton: true,
    alternateClassName: 'ABP.Config',

    requires: [
        'ABP.util.Logger'
    ],

    config: {
        i18n: [],
        language: "en",
        bootstrapConfig: null,
        sessionConfig: null,
        username: null,
        environment: null,
        sessionId: null,
        authType: null,
        application: null,
        loggedIn: false,
        apiUrlPrefix: null,
        prebootSettingsExtraFields: [],
        rightPaneTabs: [], // Tabs registered by packages.
        packageURL: null,
        hardcodedConfig: null, // Configs set by code, before abp-prebootstrap-config and /abp/bootstrap are loaded.`
        debugMode: false,
        b2cShowLogin: false,
        subscriptions: [],
        disabledProductSubscriptions: []
    },


    setSubscriptions: function (subs) {
        var me = this;
        var subLength = subs.length;
        var disabledProductSubscriptions = [];
        for (var i = 0; i < subLength; ++i) {
            var sub = subs[i];
            var product = sub.product.toLowerCase();
            if (!sub.enabled) {
                disabledProductSubscriptions.push(product);
            } else {
                if (product === 'abpinsight' || product === 'insight') {
                    ABPInsight.util.WebserviceManager.setApiUrl(product.endpoint);
                }
            }
        }
        me.subscriptions = subs;
        me.disabledProductSubscriptions = disabledProductSubscriptions;
    },

    /**
     * Default bootstrap configuration
     */
    DEFAULT_BOOTSTRAP_CONFIG: {
        settings: {
            canRecoverPassword: false,
            canKeepMeSignedIn: false, // canKeepMeSignedIn does not store the user's password. If you have to do that then use rememberPassword.
            canKeepMultipleUsersSignedIn: false,
            canForcePasswordChange: false,
            allowServiceChange: true,
            rememberEnvironment: true,
            rememberLanguage: true,
            rememberPassword: false, // The user's password is stored only if rememberPassword is true, and canKeepMeSignedInv is true and the user has checked Keep Me Signed In.
            rememberUsername: true,
            rememberPreviousServerUrls: true,
            authenticationType: null, // Previously 'cookie' was the default.
            extraLoginFields: [],
            usernameCaseSensitive: false,
            showSimpleLogin: true
        },
        languageResources: [],
        branding: {
            companyName: ''
        },
        availableEnvironments: [],
        defaultEnvironment: '',
        authenticatedUserName: null
    },

    /**
     * Default session configuration
     */
    DEFAULT_SESSION_CONFIG: {
        settings: {
            userConfig: {
                displayName: null,
                photo: null,
                enableEditProfile: false
            },
            appToolbarTitle: null, // The top toolbar title can be set by this config or by firing 'container_toolbar_setTitle'.
            autoHideMenu: true,
            enableMenuFavorites: false,
            enableMenuPeelOff: false,
            enableMenuRecent: false,
            enableMenuSuggested: false,
            enableNavSearch: false,
            enableSearch: false,
            notifications: {
                enabled: false,
                maxHistory: 100,
                clearBadgeOnActivate: true,
                sources: []
            },
            enableWideMenu: false,
            favorites: [],
            disableNavMenu: false,
            startMenuHidden: false,
            inactiveTimeout: 0,
            inactiveWarningTime: 0,
            rightPane: [],
            rememberMenuState: true,
            hideTreeNavigation: true,
            searchInfo: [],
            // toggleableGlobalSearchField: false, // Uncomment this line if you want to see the non-toggleable global search field.
            defaultSearch: '',
            loadPage: {
                appId: '',
                event: '',
                eventArgs: ''
            },
            toolbarTitleShowBranding: true, // Default is true. Only shown in Classic.
            layoutPersistance: 'local',
            mainMenuModernFocusFirstOption: false,
            mainMenuNavSearchDisableSoundex: false,
            mainMenuNavSearchDisableRelevance: false,
            mainMenuNavSearchDuplicateFields: '',
            mainMenuNavSearchResultsMax: 20,
            mainMenuRecentMaxShown: 5,
            mainMenuRecentServerSideSaving: false,
            mainMenuSingleExpand: false,
            mainMenuSuggestedAutoExpand: true,
            mainMenuStartFavoritesOpen: false,
            mainMenuLazyFill: true,
            navSearchShowPath: true,
            persistSelectedTheme: true,
            settingsPage: {
                enableAbout: true,
                enableHeadlinesManager: false,
                enableHelp: true,
                enableLanguages: true,
                enableLoggerView: true,
                enableSignOff: true,
                enableUser: true,
                showSessionTimer: true,
                showEnvironment: true
            }
        },
        /**
         * Array of the navigation menu options
         * Note: each navMenu entry will have possible children array, has "activateApp" boolean to check
         *
         * @cfg {Object} menu
         * The object respresentation of the menu item
         *
         * @cfg {String} menu.appId
         * The id of the package that will handle the rendering of the contents driven by the menu
         *
         * @cfg {String} menu.event
         * The id event that will be fired when the menu is clicked
         *
         * @cfg {String} menu.eventArgs
         * [Optional] args that are passed when the event is fired
         *
         * @cfg {Boolean} menu.enabled
         * Whether the menu item is enabled by default. This may be used as data but has no visual effect.
         *
         * @cfg {String} menu.label
         * The text shown to the user
         *
         * @cfg {String} menu.icon
         * The font icon shown to the user
         */
        navMenu: [],
        navMenuOrder: {
            favorites: 0,
            recents: 1,
            suggested: 2,
            navigation: 3
        },
        sessionMenu: [],
        toolbarMenu: [],
        toolbarTitleImageUrl: null, // Note: toolbarTitleShowBranding is under settings.
        enabledPlugins: [],
        availableWidgets: [],
        languageResources: [],
        headlines: []
    },

    setPrebootSettingsExtraFields: function (newfield) {
        if (Ext.isArray(newfield)) {
            if (newfield.length > 0 && !Ext.isArray(newfield[0])) {
                this.config.prebootSettingsExtraFields = this.config.prebootSettingsExtraFields.concat(newfield);
            }
        } else {
            this.config.prebootSettingsExtraFields.push(newfield);
        }
    },

    /**
     * Called from a package's Initialize to register right pane tab(s) and associated button(s).
     * @param {Array/Object} tabs one tab or an array of tabs. Each tab is configured so like:
     *
     *          var tabs = [{
     *              name: 'appId_quickCharts',
     *              // uniqueId must be unique across all products so prepend with appId.
     *              uniqueId: 'appId_quickCharts',
     *              xtype: 'quickCharts',
     *              icon: '',
     *              // Whether or not to initially hide.
     *              hidden: true
     *          }];
     *
     */
    registerRightPaneTabs: function (tabs) {
        if (Ext.isArray(tabs)) {
            if (tabs.length > 0 && !Ext.isArray(tabs[0])) {
                this.config.rightPaneTabs = this.config.rightPaneTabs.concat(tabs);
            }
        } else {
            this.config.rightPaneTabs.push(tabs);
        }
    },

    constructor: function (config) {
        this.initConfig(config);
    },

    /**
     * Check if the item is an Array.
     * @param {Object} item potential Array.
     * @param {String} description part of the log if item is not an Array.
     */
    checkArray: function (item, description) {
        if (!item) {
            ABP.util.Logger.logWarn(description + " is missing, converting to empty Array");
            return [];
        }

        if (!(item instanceof Array)) {
            ABP.util.Logger.logWarn(description + " is not an Array, converting");
            return [item];
        }
        return item;
    },

    /**
     * Check if the item is a URL.
     * @param {Object} item potential URL.
     * @param {String} description part of the log if item is not a URL.
     */
    checkUrl: function (item, description) {
        var validator = new Ext.data.validator.Url();

        if (!item) {
            ABP.util.Logger.logWarn(description + " is missing, nulling");
            return null;
        }

        // Validator can return string indicating the error
        if (!validator.validate(item) === true) {
            ABP.util.Logger.logWarn(description + " is not a valid URL, nulling");
            return null;
        }

        return item;
    },

    /**
     * Check if the item is a boolean.
     * @param {Object} item potential boolean.
     * @param {String} description part of the log if item is not a boolean.
     */
    checkBoolean: function (item, description, defaultValue) {
        if (typeof item === 'string' || item instanceof String) {
            switch (item.toLowerCase()) {
                case 'false':
                case '0':
                    ABP.util.Logger.logWarn(description + " is string value, converting to boolean.");
                    return false;
                case 'true':
                case '1':
                    ABP.util.Logger.logWarn(description + " is string value, converting to boolean.");
                    return true;
                default:
                    ABP.util.Logger.logWarn(description + " is not specified, using default value \"" + defaultValue + "\"");
                    return defaultValue;
            }
        }

        if (typeof item === 'boolean' || item instanceof Boolean) {
            return item;
        }

        return defaultValue;
    },

    /**
     * Checks if the provided item is a string, returns a default value if not.
     * @param {Object} item potential int.
     * @param {String} description part of the logged message if the parse fails.
     * @param {Object} defaultValue returns if item was not an integer.
     */
    checkInteger: function (value, description, defaultValue) {
        if (Number.isInteger && Number.isInteger(value)) {
            return value;
        } else if (Ext.Number.parseInt(value)) {
            ABP.util.Logger.logWarn(description + " is not an integer value, converting to integer. Or using Internet Explorer 11 or below.");
            return Ext.Number.parseInt(value);
        } else {
            ABP.util.Logger.logWarn(description + " is not an integer value, using default value: " + defaultValue);
            return defaultValue;
        }
    },

    /**
     * Checks if the provided item is a string, returns a default value if not.
     * @param {Object} item potential string.
     * @param {Object} defaultValue returns if item was not a string.
     */
    checkString: function (item, defaultValue) {
        if (typeof item === 'string' || item instanceof String) {
            return item;
        }

        return defaultValue;
    },

    /**
     * Ensures reasonable values/sets defaults on the bootstrap configuration.
     */
    processBootstrapConfig: function (config) {
        var me = this;
        var i = 0;
        if (!config) {
            ABP.util.Logger.logError("Bootstrap configuration is not valid, using default configuration.");
            me.setBootstrapConfig(me.DEFAULT_BOOTSTRAP_CONFIG);
            return;
        }

        // Verify all configuation elements
        // 1 - Settings
        if (!config.settings) {
            ABP.util.Logger.logError("Bootstrap configuration missing settings element, using default settings configuration.");
            config.settings = me.DEFAULT_BOOTSTRAP_CONFIG.settings;
        } else {
            // Verify each setting
            var settings = config.settings;

            settings.canRecoverPassword = me.checkBoolean(settings.canRecoverPassword,
                "Bootstrap configuration - settings - canRecoverPassword",
                me.DEFAULT_BOOTSTRAP_CONFIG.settings.canRecoverPassword);

            settings.canKeepMeSignedIn = me.checkBoolean(settings.canKeepMeSignedIn,
                "Bootstrap configuration - settings - canKeepMeSignedIn",
                me.DEFAULT_BOOTSTRAP_CONFIG.settings.canKeepMeSignedIn);

            settings.canKeepMultipleUsersSignedIn = me.checkBoolean(settings.canKeepMultipleUsersSignedIn,
                "Bootstrap configuration - settings - canKeepMultipleUsersSignedIn",
                me.DEFAULT_BOOTSTRAP_CONFIG.settings.canKeepMultipleUsersSignedIn);

            settings.canForcePasswordChange = me.checkBoolean(settings.canForcePasswordChange,
                "Bootstrap configuration - settings - canForcePasswordChange",
                me.DEFAULT_BOOTSTRAP_CONFIG.settings.canForcePasswordChange);

            settings.allowServiceChange = me.checkBoolean(settings.allowServiceChange,
                "Bootstrap configuration - settings - allowServiceChange",
                me.DEFAULT_BOOTSTRAP_CONFIG.settings.allowServiceChange);

            settings.defaultLanguage = me.checkString(settings.defaultLanguage,
                me.DEFAULT_BOOTSTRAP_CONFIG.settings.defaultLanguage);

            ABP.util.Common.setPageLanguage(settings.defaultLanguage);

            settings.rememberEnvironment = me.checkBoolean(settings.rememberEnvironment,
                "Bootstrap configuration - settings - rememberEnvironment",
                me.DEFAULT_BOOTSTRAP_CONFIG.settings.rememberEnvironment);

            settings.rememberLanguage = me.checkBoolean(settings.rememberLanguage,
                "Bootstrap configuration - settings - rememberLanguage",
                me.DEFAULT_BOOTSTRAP_CONFIG.settings.rememberLanguage);

            settings.rememberPassword = me.checkBoolean(settings.rememberPassword,
                "Bootstrap configuration - settings - rememberPassword",
                me.DEFAULT_BOOTSTRAP_CONFIG.settings.rememberPassword);

            settings.rememberUsername = me.checkBoolean(settings.rememberUsername,
                "Bootstrap configuration - settings - rememberUsername",
                me.DEFAULT_BOOTSTRAP_CONFIG.settings.rememberUsername);

            settings.rememberPreviousServerUrls = me.checkBoolean(settings.rememberPreviousServerUrls,
                "Bootstrap configuration - settings - rememberPreviousServerUrls",
                me.DEFAULT_BOOTSTRAP_CONFIG.settings.rememberPreviousServerUrls);

            settings.authenticationType = me.checkString(settings.authenticationType,
                me.DEFAULT_BOOTSTRAP_CONFIG.settings.authenticationType);

            settings.extraLoginFields = me.checkArray(settings.extraLoginFields, 'extra Login field');

            settings.showSimpleLogin = me.checkBoolean(settings.showSimpleLogin,
                "Bootstrap configuration - settings - showSimpleLogin",
                me.DEFAULT_BOOTSTRAP_CONFIG.settings.showSimpleLogin);
        }

        // 2 - languageResources
        if (!config.languageResources) {
            ABP.util.Logger.logError("Bootstrap configuration missing languageResources element, using default languageResources configuration.");
            config.languageResources = me.DEFAULT_BOOTSTRAP_CONFIG.languageResources;
        } else {
            config.languageResources = me.checkArray(config.languageResources,
                "Bootstrap configuration - languageResources");
        }

        // 3 - branding
        if (!config.branding) {
            ABP.util.Logger.logError("Bootstrap configuration missing branding element, using default branding configuration.");
            config.branding = me.DEFAULT_BOOTSTRAP_CONFIG.branding;
        }

        // 4 - availableEnvironments
        if (!config.availableEnvironments) {
            ABP.util.Logger.logError("Bootstrap configuration missing availableEnvironments element, using default availableEnvironments configuration.");
            config.availableEnvironments = me.DEFAULT_BOOTSTRAP_CONFIG.availableEnvironments;
        } else {
            config.availableEnvironments = me.checkArray(config.availableEnvironments, "Bootstrap configuration - availableEnvironments");
            for (i = 0; i < config.availableEnvironments.length; ++i) {
                if (config.availableEnvironments[i].languages) {
                    config.availableEnvironments[i].languages = me.checkArray(config.availableEnvironments[i].languages, "Bootstrap configuration - availableEnvironments - available languages");
                }
            }
            /* Simple login is a global property but is applied to individual environments.
             * If multiple environments are available the environment field will still be shown.
             * showSimpleLogin should not be changed here because the language field can still be hidden per environment.
             *
            // If the application contains multiple environments and has atleast one environment with mulitple languages, we should not use simple login
            if (config.availableEnvironments.length > 1) {
                settings.showSimpleLogin = settings.showSimpleLogin && !me.supportMultipleLanguages(config.availableEnvironments);
            }
            */
        }

        // 5 - defaultEnvironment
        if (!config.defaultEnvironment) {
            ABP.util.Logger.logError("Bootstrap configuration missing defaultEnvironment element, using default defaultEnvironment configuration.");
            config.defaultEnvironment = me.DEFAULT_BOOTSTRAP_CONFIG.defaultEnvironment;
        }

        // 6 - authenticatedUserName
        if (!config.authenticatedUserName) {
            config.authenticatedUserName = me.DEFAULT_BOOTSTRAP_CONFIG.authenticatedUserName;
        }

        // Cache Offline bootstrap if it was provided.
        if (config.offlineBootstrap) {
            ABP.util.LocalStorage.set('OfflineBootstrap', Ext.JSON.encode(config.offlineBootstrap));
            config.offlineAuthenticationType = config.offlineBootstrap.offlineAuthenticationType;
            config.hideOfflineModeToggle = config.offlineBootstrap.hideOfflineModeToggle;
            if (config.offlineBootstrap.offlineAuthenticationType === 1) {
                config.validateOfflinePassword = config.offlineBootstrap.validateOfflinePassword;
            }
        }

        // Finally, save this configuration
        this.setBootstrapConfig(config);
    },

    /**
     * @private
     * Ensures reasonable configuration values for menu items.
     * @param {Object} navMenu menu item config.
     * @param {String} menuType type of menu 'sessionMenu', 'toolbarMenu' or 'navMenu'.
     * @param {Boolean} processChildren whether or not to process children. Currently only nav menu supports this.
     */
    processSessionConfigMenuItems: function (navMenu, menuType, processChildren) {
        var me = this,
            i;

        for (i = 0; i < navMenu.length; i++) {
            navMenu[i].type = me.checkString(navMenu[i].type, 'event');
            navMenu[i].uniqueId = me.checkString(navMenu[i].uniqueId, '');
            navMenu[i].label = me.checkString(navMenu[i].label, '');
            navMenu[i].labelKey = me.checkString(navMenu[i].labelKey, '');
            navMenu[i].icon = me.checkString(navMenu[i].icon, '');
            if (navMenu[i].type === 'route') {
                navMenu[i].hash = me.checkString(navMenu[i].hash, '');
            } else {
                navMenu[i].event = me.checkString(navMenu[i].event, '');
                navMenu[i].eventArgs = me.checkArray(navMenu[i].eventArgs, "Session configuration>settings>" + menuType + ">eventArgs");
            }
            navMenu[i].appId = me.checkString(navMenu[i].appId, '');
            navMenu[i].activateApp = me.checkBoolean(navMenu[i].activateApp, "Session configuration>settings>" + menuType + ">activateApp", true);
            navMenu[i].enabled = me.checkBoolean(navMenu[i].enabled, "Session configuration>settings>" + menuType + ">enabled", true);
            navMenu[i].tooltip = me.checkString(navMenu[i].tooltip, '');
            navMenu[i].tooltipKey = me.checkString(navMenu[i].tooltipKey, '');
            navMenu[i].shorthand = me.checkString(navMenu[i].shorthand, '');
            if (processChildren) {
                navMenu[i].children = me.checkArray(navMenu[i].children, "Session configuration>" + menuType + ">children");

                if (navMenu[i].children.length > 0) {
                    navMenu[i].children = me.processSessionConfigMenuItems(navMenu[i].children, menuType, processChildren);
                }
            }
        }

        return navMenu;
    },

    /**
     * Checks configuration response and sets defaults.
     * @param {Object} config the abp/configuration configuration object.
     */
    processSessionConfig: function (config) {
        var me = this;
        var currSpPointer;
        if (!config) {
            ABP.util.Logger.logError("Session configuration is not valid, using default configuration.");
            me.setBootstrapConfig(me.DEFAULT_SESSION_CONFIG);
            return;
        }

        me.loadPersonalisation();

        // Verify all configuation elements
        // 1 - Settings
        if (!config.settings) {
            ABP.util.Logger.logError("Session configuration missing settings element, using default settings configuration.");
            config.settings = me.DEFAULT_SESSION_CONFIG.settings;
        } else {
            // Verify each setting
            var settings = config.settings;

            settings.autoHideMenu = me.checkBoolean(settings.autoHideMenu,
                "Session configuration - settings - autoHideMenu",
                me.DEFAULT_SESSION_CONFIG.settings.autoHideMenu);

            settings.enableSearch = me.checkBoolean(settings.enableSearch,
                "Session configuration - settings - enableSearch",
                me.DEFAULT_SESSION_CONFIG.settings.enableSearch);

            settings.startMenuHidden = me.checkBoolean(settings.startMenuHidden,
                "Session configuration - settings - startMenuHidden",
                me.DEFAULT_SESSION_CONFIG.settings.startMenuHidden);

            settings.rememberMenuState = me.checkBoolean(settings.rememberMenuState,
                "Session configuration - settings - rememberMenuState",
                me.DEFAULT_SESSION_CONFIG.settings.rememberMenuState);

            settings.enableWideMenu = me.checkBoolean(settings.enableWideMenu,
                "Session configuration - settings - enableWideMenu",
                me.DEFAULT_SESSION_CONFIG.settings.enableWideMenu);

            settings.disableNavMenu = me.checkBoolean(settings.disableNavMenu,
                "Session configuration - settings - disableNavMenu",
                me.DEFAULT_SESSION_CONFIG.settings.disableNavMenu);

            settings.enableMenuFavorites = me.checkBoolean(settings.enableMenuFavorites,
                "Session configuration - settings - enableMenuFavorites",
                me.DEFAULT_SESSION_CONFIG.settings.enableMenuFavorites);

            settings.enableMenuPeelOff = me.checkBoolean(settings.enableMenuPeelOff,
                "Session configuration - settings - enableMenuPeelOff",
                me.DEFAULT_SESSION_CONFIG.settings.enableMenuPeelOff);

            settings.enableMenuRecent = me.checkBoolean(settings.enableMenuRecent,
                "Session configuration - settings - enableMenuRecent",
                me.DEFAULT_SESSION_CONFIG.settings.enableMenuRecent);

            settings.enableMenuSuggested = me.checkBoolean(settings.enableMenuSuggested,
                "Session configuration - settings - enableMenuSuggested",
                me.DEFAULT_SESSION_CONFIG.settings.enableMenuSuggested);

            settings.enableNavSearch = me.checkBoolean(settings.enableNavSearch,
                "Session configuration - settings - enableNavSearch",
                me.DEFAULT_SESSION_CONFIG.settings.enableNavSearch);

            settings.hideTreeNavigation = me.checkBoolean(settings.hideTreeNavigation,
                "Session configuration - settings - hideTreeNavigation",
                me.DEFAULT_SESSION_CONFIG.settings.hideTreeNavigation);

            settings.toggleableGlobalSearchField = me.checkBoolean(settings.toggleableGlobalSearchField,
                "Session configuration - settings - toggleableGlobalSearchField",
                me.DEFAULT_SESSION_CONFIG.settings.toggleableGlobalSearchField);

            settings.mainMenuModernFocusFirstOption = me.checkBoolean(settings.mainMenuModernFocusFirstOption,
                "Session configuration - settings - mainMenuModernFocusFirstOption",
                me.DEFAULT_SESSION_CONFIG.settings.mainMenuModernFocusFirstOption);

            settings.mainMenuNavSearchDisableSoundex = me.checkBoolean(settings.mainMenuNavSearchDisableSoundex,
                "Session configuration - settings - mainMenuNavSearchDisableSoundex",
                me.DEFAULT_SESSION_CONFIG.settings.mainMenuNavSearchDisableSoundex);

            settings.mainMenuNavSearchDuplicateFields = me.checkString(settings.mainMenuNavSearchDuplicateFields,
                me.DEFAULT_SESSION_CONFIG.settings.mainMenuNavSearchDuplicateFields);

            settings.mainMenuNavSearchDisableRelevance = me.checkBoolean(settings.mainMenuNavSearchDisableRelevance,
                "Session configuration - settings - mainMenuNavSearchDisableRelevance",
                me.DEFAULT_SESSION_CONFIG.settings.mainMenuNavSearchDisableRelevance);

            settings.mainMenuNavSearchResultsMax = me.checkInteger(settings.mainMenuNavSearchResultsMax,
                "Session configuration - settings - mainMenuNavSearchResultsMax",
                me.DEFAULT_SESSION_CONFIG.settings.mainMenuNavSearchResultsMax);

            settings.mainMenuLazyFill = me.checkBoolean(settings.mainMenuLazyFill,
                "Session configuration - settings - mainMenuLazyFill",
                me.DEFAULT_SESSION_CONFIG.settings.mainMenuLazyFill);

            settings.mainMenuRecentMaxShown = me.checkInteger(settings.mainMenuRecentMaxShown,
                "Session configuration - settings - mainMenuRecentMaxShown",
                me.DEFAULT_SESSION_CONFIG.settings.mainMenuRecentMaxShown);

            settings.mainMenuSingleExpand = me.checkBoolean(settings.mainMenuSingleExpand,
                "Session configuration - settings - mainMenuSingleExpand",
                me.DEFAULT_SESSION_CONFIG.settings.mainMenuSingleExpand);

            settings.mainMenuSuggestedAutoExpand = me.checkBoolean(settings.mainMenuSuggestedAutoExpand,
                "Session configuration - settings - mainMenuSuggestedAutoExpand",
                me.DEFAULT_SESSION_CONFIG.settings.mainMenuSuggestedAutoExpand);

            settings.mainMenuStartFavoritesOpen = me.checkBoolean(settings.mainMenuStartFavoritesOpen,
                "Session configuration - settings - mainMenuStartFavoritesOpen",
                me.DEFAULT_SESSION_CONFIG.settings.mainMenuStartFavoritesOpen);

            settings.navSearchShowPath = me.checkBoolean(settings.navSearchShowPath,
                "Session configuration - settings - navSearchShowPath",
                me.DEFAULT_SESSION_CONFIG.settings.navSearchShowPath);

            settings.persistSelectedTheme = me.checkBoolean(settings.persistSelectedTheme,
                "Session configuration - settings - persistSelectedTheme",
                me.DEFAULT_SESSION_CONFIG.settings.persistSelectedTheme);

            // Verify Notification Settings
            if (!settings.notifications) {
                settings.notifications = me.DEFAULT_SESSION_CONFIG.settings.notifications;
            } else {
                settings.notifications.enabled = me.checkBoolean(settings.notifications.enabled,
                    "Session configuration - settings - notifications - enabled",
                    me.DEFAULT_SESSION_CONFIG.settings.notifications.enabled
                );
                settings.notifications.maxHistory = me.checkInteger(settings.notifications.maxHistory,
                    "Session configuration - settings - notifications - maxHistory",
                    me.DEFAULT_SESSION_CONFIG.settings.notifications.maxHistory
                );

                settings.notifications.clearBadgeOnActivate = me.checkBoolean(settings.notifications.clearBadgeOnActivate,
                    "Session configuration - settings - notifications - clearBadgeOnActivate",
                    me.DEFAULT_SESSION_CONFIG.settings.notifications.clearBadgeOnActivate
                );

                settings.notifications.sources = me.checkArray(settings.notifications.sources,
                    "Session configuration - settings - notifications - sources"
                );
            }

            //Verify Favorites
            if (!settings.favorites || Ext.isArray(settings.favorites) || Ext.isString(settings.favorites)) {
                // Legacy cases - favorites is still simply an array of favorite items.
                settings.favorites = {
                    favoriteItems: settings.favorites,
                    allowItemRename: true,
                    depthLimit: 0
                };
            } else if (Ext.isObject(settings.favorites)) {
                if (settings.favorites.depthLimit && settings.favorites.depthLimit > 2) {
                    ABP.util.Logger.logWarn('favorites.depthLimit must be equal to 0, 1 or 2. Setting default value of 0 (unlimited folder depth)');
                    settings.favorites.depthLimit = 0;
                }
            }

            // Verify RightPane Settings
            if (!settings.rightPane) {
                settings.rightPane = me.DEFAULT_SESSION_CONFIG.settings.rightPane;
            }
            // TODO: else verify each rightPane configuration item

            if (settings.enableSearch) {
                if (!settings.searchInfo) {
                    ABP.util.Logger.logError("Session configuration missing searchInfo element, using default searchInfo configuration.");
                    settings.searchInfo = me.DEFAULT_SESSION_CONFIG.settings.searchInfo;
                } else {
                    settings.searchInfo = me.checkArray(settings.searchInfo, "Session configuration - settings - searchInfo");
                }

                settings.defaultSearch = me.checkString(settings.defaultSearch, me.DEFAULT_SESSION_CONFIG.settings.defaultSearch);
            }
            if (settings.settingsPage) {
                // New SettingsPage
                // enableUser
                if (settings.settingsPage.enableUser !== undefined) {
                    currSpPointer = settings.settingsPage.enableUser;
                } else if (settings.enableUser !== undefined) {
                    currSpPointer = settings.enableUser;
                } else {
                    currSpPointer = settings.settingsPage.enableUser;
                }
                settings.settingsPage.enableUser = me.checkBoolean(currSpPointer,
                    "Session configuration - settings - settingsPage - enableUser",
                    me.DEFAULT_SESSION_CONFIG.settings.settingsPage.enableUser);
                // enableHeadlinesManager
                if (settings.settingsPage.enableHeadlinesManager !== undefined) {
                    currSpPointer = settings.settingsPage.enableHeadlinesManager;
                } else if (settings.enableHeadlinesManager !== undefined) {
                    currSpPointer = settings.enableHeadlinesManager;
                } else {
                    currSpPointer = settings.settingsPage.enableHeadlinesManager;
                }
                settings.settingsPage.enableHeadlinesManager = me.checkBoolean(currSpPointer,
                    "Session configuration - settings - settingsPage - enableHeadlinesManager",
                    me.DEFAULT_SESSION_CONFIG.settings.settingsPage.enableHeadlinesManager);
                // enableHelp
                if (settings.settingsPage.enableHelp !== undefined) {
                    currSpPointer = settings.settingsPage.enableHelp;
                } else if (settings.enableHelp !== undefined) {
                    currSpPointer = settings.enableHelp;
                } else {
                    currSpPointer = settings.settingsPage.enableHelp;
                }
                settings.settingsPage.enableHelp = me.checkBoolean(currSpPointer,
                    "Session configuration - settings - settingsPage - enableHelp",
                    me.DEFAULT_SESSION_CONFIG.settings.settingsPage.enableHelp);
                // enableAbout
                if (settings.settingsPage.enableAbout !== undefined) {
                    currSpPointer = settings.settingsPage.enableAbout;
                } else if (settings.enableAbout !== undefined) {
                    currSpPointer = settings.enableAbout;
                } else {
                    currSpPointer = settings.settingsPage.enableAbout;
                }
                settings.settingsPage.enableAbout = me.checkBoolean(currSpPointer,
                    "Session configuration - settings - settingsPage - enableAbout",
                    me.DEFAULT_SESSION_CONFIG.settings.settingsPage.enableAbout);
                // enableSignOff
                if (settings.settingsPage.enableSignOff !== undefined) {
                    currSpPointer = settings.settingsPage.enableSignOff;
                } else if (settings.enableSignOff !== undefined) {
                    currSpPointer = settings.enableSignOff;
                } else {
                    currSpPointer = settings.settingsPage.enableSignOff;
                }
                settings.settingsPage.enableSignOff = me.checkBoolean(currSpPointer,
                    "Session configuration - settings - settingsPage - enableSignOff",
                    me.DEFAULT_SESSION_CONFIG.settings.settingsPage.enableSignOff);
                // enableLoggerView
                if (settings.settingsPage.enableLoggerView !== undefined) {
                    currSpPointer = settings.settingsPage.enableLoggerView;
                } else if (settings.enableLoggerView !== undefined) {
                    currSpPointer = settings.enableLoggerView;
                } else {
                    currSpPointer = settings.settingsPage.enableLoggerView;
                }
                settings.settingsPage.enableLoggerView = me.checkBoolean(currSpPointer,
                    "Session configuration - settings - settingsPage - enableLoggerView",
                    me.DEFAULT_SESSION_CONFIG.settings.settingsPage.enableLoggerView);
                // enableLanguages
                if (settings.settingsPage.enableLanguages !== undefined) {
                    currSpPointer = settings.settingsPage.enableLanguages;
                } else if (settings.enableLanguages !== undefined) {
                    currSpPointer = settings.enableLanguages;
                } else {
                    currSpPointer = settings.settingsPage.enableLanguages;
                }
                settings.settingsPage.enableLanguages = me.checkBoolean(currSpPointer,
                    "Session configuration - settings - settingsPage - enableLanguages",
                    me.DEFAULT_SESSION_CONFIG.settings.settingsPage.enableLanguages);
                // showSessionTimer
                if (settings.settingsPage.showSessionTimer !== undefined) {
                    currSpPointer = settings.settingsPage.showSessionTimer;
                } else if (settings.showSessionTimer !== undefined) {
                    currSpPointer = settings.showSessionTimer;
                } else {
                    currSpPointer = settings.settingsPage.showSessionTimer;
                }
                settings.settingsPage.showSessionTimer = me.checkBoolean(currSpPointer,
                    "Session configuration - settings - settingsPage - showSessionTimer",
                    me.DEFAULT_SESSION_CONFIG.settings.settingsPage.showSessionTimer);
                // showEnvironment
                if (settings.settingsPage.showEnvironment !== undefined) {
                    currSpPointer = settings.settingsPage.showEnvironment;
                } else if (settings.showEnvironment !== undefined) {
                    currSpPointer = settings.showEnvironment;
                } else {
                    currSpPointer = settings.settingsPage.showEnvironment;
                }
                settings.settingsPage.showEnvironment = me.checkBoolean(currSpPointer,
                    "Session configuration - settings - settingsPage - showEnvironment",
                    me.DEFAULT_SESSION_CONFIG.settings.settingsPage.showEnvironment);
            } else {
                // Legacy - now SettingsPage
                settings.settingsPage = {};
                settings.settingsPage.enableUser = me.checkBoolean(settings.enableUser,
                    "Session configuration - settings - settingsPage - enableUser",
                    me.DEFAULT_SESSION_CONFIG.settings.settingsPage.enableUser);

                settings.settingsPage.enableHelp = me.checkBoolean(settings.enableHelp,
                    "Session configuration - settings - settingsPage - enableHelp",
                    me.DEFAULT_SESSION_CONFIG.settings.settingsPage.enableHelp);

                settings.settingsPage.enableAbout = me.checkBoolean(settings.enableAbout,
                    "Session configuration - settings - settingsPage - enableAbout",
                    me.DEFAULT_SESSION_CONFIG.settings.settingsPage.enableAbout);

                settings.settingsPage.enableSignOff = me.checkBoolean(settings.enableSignOff,
                    "Session configuration - settings - settingsPage - enableSignOff",
                    me.DEFAULT_SESSION_CONFIG.settings.settingsPage.enableSignOff);

                settings.settingsPage.enableLoggerView = me.checkBoolean(settings.enableLoggerView,
                    "Session configuration - settings - settingsPage - enableLoggerView",
                    me.DEFAULT_SESSION_CONFIG.settings.settingsPage.enableLoggerView);

                settings.settingsPage.enableLanguages = me.checkBoolean(settings.enableLanguages,
                    "Session configuration - settings - settingsPage - enableLanguages",
                    me.DEFAULT_SESSION_CONFIG.settings.settingsPage.enableLanguages);
                // New settings (post settingsPage switch)
                // showSessionTimer
                settings.settingsPage.showSessionTimer = me.checkBoolean(settings.showSessionTimer,
                    "Session configuration - settings - settingsPage - showSessionTimer",
                    me.DEFAULT_SESSION_CONFIG.settings.settingsPage.showSessionTimer);
                // showEnvironment
                settings.settingsPage.showEnvironment = me.checkBoolean(settings.showEnvironment,
                    "Session configuration - settings - settingsPage - showEnvironment",
                    me.DEFAULT_SESSION_CONFIG.settings.settingsPage.showEnvironment);
            }
            // Note: loadPage is optional

            settings.layoutPersistance = me.checkString(settings.layoutPersistance,
                me.DEFAULT_SESSION_CONFIG.settings.layoutPersistance);

            // Process User Config
            if (!settings.userConfig) {
                ABP.util.Logger.logWarn("Session configuration missing settings.userConfig element, using default userConfig.");
                settings.userConfig = me.DEFAULT_SESSION_CONFIG.settings.userConfig;
            } else {
                settings.userConfig.displayName = me.checkString(settings.userConfig.displayName,
                    me.DEFAULT_SESSION_CONFIG.settings.userConfig.displayName);

                // If a photo URL is returned, save this so we can use it on the select user page
                if (settings.userConfig.photo) {
                    ABP.util.LocalStorage.setForLoggedInUser('Photo', settings.userConfig.photo);
                }
            }

            // Show branding (Classic only) or not?
            // Default is true. It has to be set explicitly to false to hide.
            settings.toolbarTitleShowBranding = settings.toolbarTitleShowBranding === false ? false : me.DEFAULT_SESSION_CONFIG.settings.toolbarTitleShowBranding;
        }

        // 2 - navMenu
        if (!config.navMenu) {
            ABP.util.Logger.logError("Session configuration missing navMenu element, using default navMenu configuration.");
            config.navMenu = me.DEFAULT_SESSION_CONFIG.navMenu;
        } else {
            config.navMenu = me.checkArray(config.navMenu,
                "Session configuration - navMenu");

            // Check the children
            config.navMenu = me.processSessionConfigMenuItems(config.navMenu, "navMenu", true);
        }

        // 2b - navMenu order
        if (!config.navMenuOrder) {
            config.navMenuOrder = me.DEFAULT_SESSION_CONFIG.navMenuOrder;
        } else {
            config.navMenuOrder = me.processNavMenuOrder(config.navMenuOrder);
        }

        if (!config.firstMenuAtTop) {
            config.firstMenuAtTop = false;
        }

        // 3 - sessionMenu
        if (!config.sessionMenu) {
            ABP.util.Logger.logError("Session configuration missing sessionMenu element, using default sessionMenu configuration.");
            config.sessionMenu = me.DEFAULT_SESSION_CONFIG.sessionMenu;
        } else {
            config.sessionMenu = me.checkArray(config.sessionMenu,
                "Session configuration - sessionMenu");
            config.sessionMenu = me.processSessionConfigMenuItems(config.sessionMenu, "sessionMenu", false);
        }

        // 4 - toolbarMenu
        if (!config.toolbarMenu) {
            ABP.util.Logger.logError("Session configuration missing toolbarMenu element, using default toolbarMenu configuration.");
            config.toolbarMenu = me.DEFAULT_SESSION_CONFIG.toolbarMenu;
        } else {
            config.toolbarMenu = me.checkArray(config.toolbarMenu,
                "Session configuration - toolbarMenu");
            config.toolbarMenu = me.processSessionConfigMenuItems(config.toolbarMenu, "toolbarMenu", false);
        }

        // 4a - toolbarTitleImageUrl
        // Note: toolbarTitleShowBranding is in the settings sub-object.
        if (!config.toolbarTitleImageUrl) {
            config.toolbarTitleImageUrl = me.DEFAULT_SESSION_CONFIG.toolbarTitleImageUrl;
        }

        // 5 - enabledPlugins
        if (!config.enabledPlugins) {
            ABP.util.Logger.logInfo("Session configuration missing enabledPlugins element, using default enabledPlugins configuration.");
            config.enabledPlugins = me.DEFAULT_SESSION_CONFIG.enabledPlugins;
        } else {
            config.enabledPlugins = me.checkArray(config.enabledPlugins,
                "Session configuration - enabledPlugins");
        }

        // 6 - availableWidgets
        if (!config.availableWidgets) {
            ABP.util.Logger.logInfo("Session configuration missing availableWidgets element, using default availableWidgets configuration.");
            config.availableWidgets = me.DEFAULT_SESSION_CONFIG.availableWidgets;
        } else {
            config.availableWidgets = me.checkArray(config.availableWidgets,
                "Session configuration - availableWidgets");
        }

        // 6 - languageResources
        if (!config.languageResources) {
            ABP.util.Logger.logInfo("Session configuration missing languageResources element, using default languageResources configuration.");
            config.languageResources = me.DEFAULT_SESSION_CONFIG.languageResources;
        } else {
            config.languageResources = me.checkArray(config.languageResources,
                "Session configuration - languageResources");
        }

        // 7 - SettingsMenu - Removed due to settings migrating to rightPane

        // 8 - Cache Offline Configuration if it exists.
        if (config.offlineConfiguration) {
            ABP.util.LocalStorage.setForLoggedInUser('OfflineConfiguration', Ext.JSON.encode(config.offlineConfiguration));
        }

        //this.injectConfig(config);
        this.setSessionConfig(config);
    },

    /**
     * Whether or not the bootstrap config has a pre-authenticated user defined (usually integrated auth).
     */
    isPreAuthenticated: function () {
        var bc = this.getBootstrapConfig();
        if (bc && bc.authenticatedUserName) {
            return true;
        }
        return false;
    },

    /**
     * Determines if this browser appears to be on a desktop.
     */
    isDesktop: function () {
        var ua = navigator.userAgent.toLowerCase();
        var isMobile = ua.indexOf("mobile") > -1;
        var isAndroid = ua.indexOf("android") > -1;
        var isWinTab = ua.indexOf("windows nt") > -1 && ua.indexOf("touch") > -1;
        var ret = true;
        if (!isWinTab) {
            if (ua.indexOf("windows nt") > -1) {
                try {
                    document.createEvent("TouchEvent");
                    isWinTab = true;
                } catch (e) {

                }
            }
        }
        if (isMobile || isAndroid || isWinTab) {
            ret = false;
        }
        return ret;
    },

    /**
     * Get the current session id or access token
     *
     * @returns {Object/String} if sessionId is a string it is returned, if sessionId is an object it will attempt to return sessionId.access_token.
     * __NOTE__: If you require the full oAuth response use ABP.util.Config.getOAuthInfo()
     */
    getSessionId: function () {
        var me = this;
        var sess = me._sessionId;
        var ret;
        if (!Ext.isObject(sess)) {
            ret = sess;
        } else {
            ret = sess.access_token;
        }
        return ret;
    },

    /**
     * Get the OAuth session id, this is the full object returned along sessionId on login.
     *
     * @returns {Object} the current session Id.
     */
    getOAuthInfo: function () {
        return this._sessionId;
    },

    /**
     * @deprecated Returns a sessionURL with sessionId appended. Authorization info should never live in the URL.
     */
    getSessionURL: function (appendChar) {
        var me = this;
        var sess = me._sessionId;
        var aC = appendChar || '&';
        if (Ext.isString(sess)) {
            return aC + 'sessionId=' + sess;
        } else {
            return '';
        }
    },

    checkHostNameMatch: function (url) {
        var hostname = window.location.hostname;
        var parser = document.createElement('a');
        parser.href = url;

        return (parser.hostname === hostname);
    },

    injectConfig: function (config) {

        config.settings.searchInfo.unshift({
            "id": "Global",
            "name": "Global",
            "appId": "Respondv6",
            "event": "searchGlobal",
            "minLength": 0,
            "minLengthError": "Respond_Search_QuickSearchMinimumFilterLengthError"
        });
    },

    /**
     * Allows an ABP package to add their own configuration section to the _sessionConfig
     * @param {String} packageName the name of the package, which will be used as the property name for the config
     * @param {Object} packageConfig object containing the configurations for the package
     */
    addPackageConfig: function (packageName, packageConfig) {
        this._sessionConfig[packageName] = packageConfig;
    },

    privates: {
        /**
         * Check to see whether the container needs to support multiple languages
         */
        supportMultipleLanguages: function (environments) {
            if (!environments) {
                return false;
            }

            for (var i = 0; i < environments.length; i++) {
                if (environments[i].languages && environments[i].languages.length > 1) {
                    return true;
                }
            }

            return false;
        },

        /**
         * load the personalisation settings from local storage and set the default values
         */
        loadPersonalisation: function () {
            var me = this;
            me.DEFAULT_SESSION_CONFIG.settings.defaultSearch = ABP.util.LocalStorage.getForLoggedInUser('DefaultSearch');
        },

        /**
         * Get Initials for Display Name
         */
        getDisplayNameInitials: function () {
            var me = this,
                displayName = me.getSessionConfig().settings.userConfig.displayName,
                names = null;

            if (displayName) {
                names = displayName.split(' ');
                return Ext.Array.map(names, function (n) {
                    return n[0];
                }).join("").substring(0, 2).toUpperCase();
            }

            return null;
        },

        /**
         * Process the navigation menu order. The actual construction of the menu depends on this object's structure so any mistakes and the default will be used.
         */
        processNavMenuOrder: function (menuOrder) {
            var me = this;
            var undefinedValues = false;
            // Ensure all properties in config are accounted for on default object.
            // Also ensure that integers defined all fall within range (# of properties in total on default).
            var defaultOrder = me.DEFAULT_SESSION_CONFIG.navMenuOrder;
            var range = Object.keys(defaultOrder).length;
            var highestOrdinal = 0;
            var ordinalsUsed = [];

            for (var property in defaultOrder) {
                if (menuOrder.hasOwnProperty(property)) {
                    // null or undefined is okay, default is used. or these are placed at the end.
                    if (Ext.isEmpty(menuOrder[property])) {
                        undefinedValues = true; // Flag for second pass to fill in undefined values.
                        continue;
                    }
                    // Malformed integer or outside range.
                    else if (!Ext.isNumber(menuOrder[property]) || menuOrder[property] >= range) {
                        ABP.util.Logger.logError("Nav menu order is incorrect, using default. " + menuOrder[property] + " is not a number or outside range");
                        return defaultOrder;
                    }
                    // Duplicate ordinal.
                    else if (ordinalsUsed.indexOf(menuOrder[property]) > -1) {
                        ABP.util.Logger.logError(Ext.String.format('Nav menu order is incorrect, using the default order. Duplicate position found for {0}:{1}', property, menuOrder[property]));
                        return defaultOrder;
                    } else {
                        ordinalsUsed.push(menuOrder[property]);
                        if (menuOrder[property] > highestOrdinal) {
                            highestOrdinal = menuOrder[property];
                        }
                    }
                } else {
                    // property is missing, just add as null for now.
                    menuOrder[property] = null;
                }
            }
            if (undefinedValues) {
                for (var property in defaultOrder) {
                    if (Ext.isEmpty(menuOrder[property])) {
                        highestOrdinal += 1;
                        menuOrder[property] = highestOrdinal;
                    }
                }
            }
            return menuOrder;
        },


        /**
         * Get Users Display Name or login name if that does not exist
         */
        getDisplayName: function () {
            var me = this;
            if (me.getSessionConfig().settings.userConfig && me.getSessionConfig().settings.userConfig.displayName) {
                return me.getSessionConfig().settings.userConfig.displayName
            }

            return me.getUsername();
        },

        /**
         * Gets the users profile pictures
         */
        getProfilePicture: function () {
            var me = this;
            return me.getSessionConfig().settings.userConfig.photo;
        },

        updateLanguage: function (lang) {
            // Ensure the language in the document is the same as the app language
            ABP.util.Common.setPageLanguage(lang);
        },

        /**
         * Whether or not the global search field can toggle or is a static field.
         */
        canGlobalSearchToggle: function () {
            var canToggle = this.getSessionConfig().settings.toggleableGlobalSearchField;
            if (Ext.isBoolean(canToggle)) {
                return canToggle;
            } else {
                return true;
            }
        }
    }
});