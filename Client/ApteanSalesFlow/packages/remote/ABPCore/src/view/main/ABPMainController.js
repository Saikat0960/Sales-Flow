/**
 * The main view controller used by the ABP Container.
 *
 * @event main_hideLoading
 * Fires when the loading screen is to be hidden
 */

/**
 * @event launchCarousel_Maintenance
 * Fires when the loading screen is to be hidden
 * @param {Ext.form.field.ComboBox} combo This combo box
 * @param {Ext.data.Model/Ext.data.Model[]} record With {@link #multiSelect}
 * `false`, the value will be a single record. With {@link #multiSelect} `true`, the
 * value will be an array of records.
 */

/**
 * @event main_doPostConfiguration
 * <TODO>
 */

/**
 * @event afterSwitchLanguage
 * Fires after the language is switched post Configuration.  The event is fired after the new strings have replaced the old in the view model.
 */

Ext.define('ABP.view.main.ABPMainController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.abpmaincontroller',

    requires: [
        'ABP.util.Ajax',
        'ABP.util.Discovery',
        'ABP.util.AuthenticationManager',
        'ABP.view.launch.loading.LoadingScreen',
        'ABP.view.base.noSupport.NoSupport',
        'ABP.view.base.automation.AutomationHintOverlay',
        'ABP.util.LocalStorage',
        'ABP.util.SessionStorage',
        'ABP.util.ServiceManager',
        'ABP.view.session.offline.PasswordPrompt',
        'Ext.Package',
        'ABP.util.Sha256',
        'ABP.view.launch.LaunchCanvas',
        'ABP.util.keyboard.Shortcuts',
        'ABP.ThemeManager'
    ],

    listen: {
        global: {
            main_tokenAuthenticate: 'tokenAuthenticate',
        },
        controller: {
            '*': {
                main_Authenticate: 'authenticate',
                main_doBootstrap: 'doBootstrap',
                main_doConfiguration: 'doConfiguration',
                main_getSubscriptionServices: 'getSubscriptionServices',
                main_ShowLogin: 'showLogin',
                main_ShowNoSupportPage: 'showNoSupportPage',
                main_AddSession: 'addSession',
                main_DestroySession: 'destroySession',
                main_relaunch: 'relaunch',
                main_appUnloaded: 'onAppUnloaded',
                main_appLoaded: 'onAppLoaded',
                main_appShutdown: 'onAppShutdown',
                main_fireAppEvent: 'fireAppEvent',
                main_logoutComplete: 'logoutComplete',
                main_showLoading: 'showLoading',
                main_switchLanguage: 'switchLanguage',
                main_hideLoading: 'hideLoading',
                main_forceLogin: 'forceLogin',
                main_addDefaultLanguageStrings: 'addDefaultLanguageStrings',
                main_saveExtraFieldInfo: 'saveExtras',
                main_routingWarningCallback: 'routingWarningCallback',
                main_secondAuthStep: 'secondAuthStep',
                main_loginAsUser: 'loginAsUser',
                main_showLoginForNewUser: 'showLoginForNewUser',
                main_processHeadlines: 'processHeadlines',
                main_pendingChanges: 'pendingChangesToggle',
                main_activeAppFocus: 'activeAppFocus',
                main_updateUserProfile: 'onUpdateUserProfile',
                main_updateLanguageStrings: 'updateLanguageStrings',

                container_go_online: 'promptOnlineMode',
                container_go_offline: 'promptOfflineMode',

                abp_milestone_authentication_success: 'afterLoginSuccess'
            }
        },
        component: {
            '*': {
                main_fireAppEvent: 'fireAppEvent'
            }
        },

        theme: {
            changed: 'switchTheme'
        }
    },

    keyboardNavigator: null,
    requestingLogin: false,

    init: function () {
        var me = this;
        var vm = me.getViewModel();

        // If launched requiring a specific user to attempt auto-login then
        // save that information from local storage and put it in memory.
        // Remove that user info from local storage because we don't want it hanging around,
        // for security.
        var loginAsUser = ABP.util.LocalStorage.get('LoginAsUser');
        ABP.util.LocalStorage.remove('LoginAsUser');
        if (loginAsUser) {
            var loginAsUserObj = ABP.util.Common.jsonDecode(loginAsUser);
            if (Ext.isObject(loginAsUserObj)) {
                // Ignore if expired.
                if ((Date.now() - loginAsUserObj.created) / 1000 <= ABP.util.Constants.login.loginAsUserLifetime) {
                    // Set up things to login as this user.
                    this.setLoginUser(loginAsUserObj);
                    // The login attempt will happen later in the code...
                }
            }
        }

        // Screen size.
        var ssThresh = this.getViewModel().get('smallScreenThreshold');
        vm.set('smallScreen', ABP.util.Common.getClassic() ? false : Ext.Viewport.getWindowWidth() <= ssThresh || Ext.Viewport.getWindowHeight() <= ssThresh);

        // Global keystrokes.
        this.initKeyboardBindings();

        // Add global listeners for online/offline events. Ensure the scope is this controller.
        window.addEventListener('online', function (event) {
            me.handleConnectionStateChange(event);
        });
        window.addEventListener('offline', function (event) {
            me.handleConnectionStateChange(event);
        });

        // Tab close handler.
        // TODO: May not work in Chrome any more.
        window.addEventListener('beforeunload', function (e) {
            me.onBeforeUnload(e);
        });

        // Read application settings file & load that store.
        me.loadApplicationServices();

        // Get the prebootstrap configuration if enabled,
        // before determining bootstrap and other settings logic.
        var hardcodedConfig = ABP.util.Config.getHardcodedConfig();
        if (!hardcodedConfig || hardcodedConfig.enablePreBootstrapLoad === true) {
            var prebootstrapConfigStore = Ext.data.StoreManager.lookup('ABPPreBootstrapConfigStore');
            if (prebootstrapConfigStore) {
                // Load the config from the server. If it fails (there might not be the need for a config) then continue to bootstrap.
                prebootstrapConfigStore.load({
                    callback: function (records, operation, success) {
                        try { // Use try-catch to ensure continuation in the case of an unexpected error.
                            // Did a config come back from the server?
                            if (success) {
                                var preBootRecord = this.first(),
                                    usesRedirectForToken = preBootRecord ? preBootRecord.get('usesRedirectForToken') : false;
                                // Update the used server URL if it is currently empty or if overrideExistingServerUrl == true.
                                var serverUrl = preBootRecord.get('serverUrl');
                                var overrideExistingServerUrl = preBootRecord.get('overrideExistingServerUrl');
                                var b2cShowLogin = preBootRecord.get('b2cShowLogin');
                                if (Ext.isBoolean(b2cShowLogin)) {
                                    ABP.util.Msal.setStopAtLoginPage(b2cShowLogin);
                                }
                                if (overrideExistingServerUrl || (!Ext.isEmpty(serverUrl) && Ext.isEmpty(ABP.util.LocalStorage.get('ServerUrl')))) { // Only do something if the config has a server URL and the local storage version is empty, or it says to override whatever is in local storage.
                                    ABP.util.LocalStorage.set('ServerUrl', serverUrl);
                                    // Ensure the settings panel shows this new value, if the settings panel is constructed at this point.
                                    me.fireEvent('settings_refresh_server_url');
                                }
                                if (ABP.util.Msal.enabled) {
                                    me.tokenAuthenticate();
                                    //return;
                                }
                                if (usesRedirectForToken) {
                                    me.handleAuthRedirect();
                                    // *** Do not continue to bootstrap.
                                    return; // RETURNS HERE
                                }
                            }
                        } catch (ex) { }
                        // Always continue to getting the bootstrap config file.
                        me.continueToBootstrap();
                    }
                });
            } else {
                // No good reason why the store cannot be found, but continue to bootstrap anyway, for robustness.
                ABP.util.Logger.log("Cannot lookup ABPPreBootstrapConfigStore");
                // Always continue to getting the bootstrap config file.
                this.continueToBootstrap();
            }
        } else {
            // Always continue to getting the bootstrap config file.
            this.continueToBootstrap();
        }
    },

    tokenAuthenticate: function () {
        var me = this;
        if (Ext.isEmpty(ABP.util.LocalStorage.get('ServerUrl'))) {
            return;
        }
        var token = ABPAuthManager.getToken();
        if (token) {
            me.loginWithB2cToken(token);
        } else {
            me.fireEvent('main_showLoading', 'load_authenticating', 'fullSize');
            // Do nothing for now - Msal library will be responsible for invoking this function.
        }
    },

    handleAuthRedirect: function () {
        var me = this;
        // See if query has id_token.
        function getParameterByName(name) {
            var match = RegExp('[#&]' + name + '=([^&]*)').exec(window.location.hash);
            return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
        };

        function getIdToken() {
            return getParameterByName('id_token');
        };
        var idToken = getIdToken();
        if (idToken) {
            function parseJwt(token) {
                var base64Url = token.split('.')[1];
                var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));

                return JSON.parse(jsonPayload);
            };
            // Get user info.
            var jwt = parseJwt(idToken);
            if (jwt) {
                if (!ABP.util.Jwt.validateNonce(jwt.nonce)) {
                    ABP.util.Logger.logError('ERROR: Nonce is not OK! Token replay attack might be underway');
                    return;
                }

                var name = jwt.preferred_username || jwt.name;
                me.authenticateWithIDPToken(idToken, {
                    logonId: name
                });
            }
        } else {
            // Try to get the tenant info
            var tenantIdentifier = ABP.util.LocalStorage.get('TenantIdentifier');
            if (tenantIdentifier) {
                // If the customer auth info is not able to be obtained, show the customer discovery launch tab
                ABP.util.Discovery.discover(tenantIdentifier, null, function (error) {
                    // Land the user on the discovery page.
                    me.showLaunch('discovery-tab', error ? {
                        error: error
                    } : null);
                });
            } else {
                function getError() {
                    return getParameterByName('error');
                };
                var error = getError();
                me.showLaunch('discovery-tab', error ? {
                    error: error
                } : null);
            }
        }
    },

    loginWithB2cToken: function (token, options) {
        var me = this;
        var bootstrapConfig = ABP.util.Config.getBootstrapConfig();
        var vm = me.getViewModel();
        var jsonData;
        var keepSignedIn;
        var tokenPayload = ABP.util.Jwt.getPayload(token);
        // Hide the default message on the loading screen since we are showing our own.
        vm.set('hidePreAuthMessage', true);
        if (Ext.isEmpty(bootstrapConfig)) {
            // Wait until bootstrap configuration is available.
            return;
        }
        var stopAtLoginPage = ABP.util.Msal.getStopAtLoginPage();
        // Display the login page if we are configured to do so.
        if (stopAtLoginPage === true && Ext.isEmpty(options)) {
            // If the user selected "keep me signed in" attempt to bypass the login screen.
            var keepMeSignedIn = (!!ABP.util.LocalStorage.get('keepSignedIn') === true);
            // Show login page before coming back here.
            if (keepMeSignedIn) {
                // Attempt to reconstruct the jsonData object to pass along.
                options = options || {};
                options.jsonData = me.reconstructUserSessionObject();
            } else {
                me.showLogin();
                return;
            }
        }
        if (!Ext.isEmpty(vm.get('loginTime')) || me.requestingLogin === true) {
            // Avoiding a race condition, if we have established a loginTime it means we have already had a successful login.
            // Just make sure we aren't still showing a loading mask.
            me.fireEvent('main_hideLoading');
            return;
        }
        options = options || {};
        jsonData = Ext.isEmpty(options.jsonData) ? { logonId: "" } : options.jsonData;
        keepSignedIn = Ext.isEmpty(options.jsonData) ? false : options.keepSignedIn;
        me.requestingLogin = true;
        me.fireEvent('main_showLoading', 'load_authenticating', 'fullSize');

        ABP.util.Ajax.request({
            url: ABP.util.LocalStorage.get('ServerUrl') + '/abp/login/',
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            jsonData: jsonData,
            keepSignedIn: keepSignedIn,
            cors: (Ext.browser.name !== 'IE' || Ext.browser.version.major > 9.0),
            success: function (response, request) {
                me.requestingLogin = false;
                var jsonData = request.jsonData || {};
                var keepSignedIn = request.keepSignedIn;
                if (tokenPayload) {
                    // Attempt to set user name so we have something if the login endpoint did not override.
                    if (!Ext.isEmpty(tokenPayload.emails)) {
                        jsonData.logonId = tokenPayload.emails[0];
                    } else if (tokenPayload.family_name && tokenPayload.given_name) {
                        // TODO: This probably should never happen.
                        jsonData.logonId = tokenPayload.given_name + ' ' + tokenPayload.family_name;
                    } else {
                        // Default to the MSAL user account name. Also definitely less than ideal.
                        // This behavior should be dictated by config if anything.
                        var msalUserAccount = ABP.util.Msal.instance.getAccount();
                        if (msalUserAccount && msalUserAccount.name) {
                            jsonData.logonId = msalUserAccount.name;
                        }
                    }
                }
                var responseData = Ext.JSON.decode(response.responseText);
                // If the login request returns an authorisation token lets store it for 
                // use when we get the token
                if (responseData.authorizationToken) {
                    ABPAuthManager.authenticationSuccess(responseData.authorizationToken);
                }
                me.authenticationLogic(responseData, true, jsonData, keepSignedIn);
            },
            failure: function (err) {
                me.requestingLogin = false;
                if (err) {
                    // Show error in the discovery page.
                } else { }
                me.fireEvent('main_hideLoading');
            }
        });
    },

    authenticateWithIDPToken: function (token, jsonData) {
        var me = this;
        var vm = me.getViewModel();

        // Hide the default message on the loading screen since we are showing our own.
        vm.set('hidePreAuthMessage', true);
        me.fireEvent('main_showLoading', 'load_authenticating', 'fullSize');

        ABP.util.Ajax.request({
            url: ABP.util.LocalStorage.get('ServerUrl') + '/abp/login/',
            method: 'POST',
            jsonData: jsonData,
            headers: {
                'Authorization': 'Bearer ' + token
            },
            cors: (Ext.browser.name !== 'IE' || Ext.browser.version.major > 9.0),
            success: function (response) {
                if (jsonData.customerName) {
                    ABP.util.LocalStorage.set('TenantIdentifier', jsonData.customerName);
                }
                var responseData = Ext.JSON.decode(response.responseText);
                // If the login request returns an authorisation token lets store it for 
                // use when we get the token
                if (responseData.authorizationToken) {
                    ABPAuthManager.authenticationSuccess(responseData.authorizationToken);
                }
                me.authenticationLogic(responseData, true, jsonData);
            },
            failure: function (err) {
                if (err) {
                    // Show error in the discovery page.
                } else { }
                me.fireEvent('main_hideLoading');
            }
        });
    },

    continueToBootstrap: function () {
        var vm = this.getViewModel();
        // Extra settings fields.
        var eFields = ABP.util.Config.config.prebootSettingsExtraFields;
        if (!Ext.isEmpty(eFields)) {
            vm.set('injectedSettingsFields', eFields);
        }
        if (Ext.isEmpty(eFields)) {
            this.doBootstrap();
        } else {
            if (this.checkPrebootVsLocalStorage(eFields)) /*if LocalStorage saved preeboot info matches prebootFields*/ {
                this.doBootstrap();
            } else {
                this.showLaunch('settings-tab');
            }
        }
    },

    /**
     * Logic before unloading the application.
     */
    onBeforeUnload: function (event) {
        var me = this,
            vm = me.getViewModel();
        // Only prompt if there are pending changes and the user did not explicitely sign off.
        if (vm.get('pendingChanges') && !vm.get('signout')) {
            return (event || window.event).returnValue = ABP.util.Common.geti18nString('reload_warning');
        }
    },

    /**
     * Use the supplied user info to set up the environment and attempt to a login
     * as that user.
     * @private
     */
    loginAsUser: function (userInfo) {
        // Set up memory with specified user.
        this.setLoginUser(userInfo);
        // Attempt authentication.
        this.authCheck();
    },

    /**
     * Clear out any existing user environment
     * because a new user is being used.
     * @private
     */
    showLoginForNewUser: function () {
        // Set up memory for user.
        this.setLoginUser(null);
        // Make sure the login panel is visible.
        this.fireEvent('launchCarousel_Login', this);
    },

    /**
     * @private
     * Either a user has been specified to login (userInfo is specified)
     * or a new user is needed (userInfo is null) Set up memory accordingly.
     *
     * If specified then the user info is restored into existing global local storage variables because
     * this is the most recent data used to attempt login.
     * This means that should the user start another tab after this, and the
     * multi-user login was ignored, then they would see this user info defaulted in the login form.
     */
    setLoginUser: function (userInfo) {
        // Save the infoInfo for later code that looks for auto-login cases.
        var vm = this.getViewModel();
        vm.set('loginAsUser', userInfo);

        // Session and local storage.
        userInfo = userInfo || {}; // A null userInfo means a new user. But convert to an empty object to make code below simpler.
        // Indicates a new tab was opened by openBrowserWindow() requesting specifically not to log in as current user.
        // Clear token and saved username from session storage so that the authentication logic does not think this is a refresh.
        if (userInfo.clearSession) {
            ABP.util.SessionStorage.remove('sessionToken');
            ABP.util.SessionStorage.remove('SavedUsername');
            return;
        }

        // sessionToken
        if (Ext.isEmpty(userInfo.sessionToken)) {
            // User did not have a sessionToken, or new user. Remove any existing one.
            ABP.util.SessionStorage.remove('sessionToken');
            ABP.util.SessionStorage.remove('SavedUsername'); // sessionTokens don't have the user id in them. So these are stored alongside.
            ABP.util.LocalStorage.remove('sessionToken');
        } else {
            if (Ext.isObject(userInfo.sessionToken)) {
                userInfo.sessionToken = Ext.JSON.encode(userInfo.sessionToken);
            }
            ABP.util.SessionStorage.set('sessionToken', userInfo.sessionToken);
            // Only set the global sessionToken is multiuser is not allowed.
            if (vm.get('bootstrapConf.settings.canKeepMultipleUsersSignedIn')) {
                ABP.util.LocalStorage.remove('sessionToken');
            }
        }

        // User
        if (Ext.isEmpty(userInfo.logonId)) {
            // No user. Remove any saved one in global and session local storage.
            ABP.util.LocalStorage.remove('SavedUsername');
            ABP.util.SessionStorage.remove('SavedUsername');
        } else {
            ABP.util.LocalStorage.set('SavedUsername', userInfo.logonId);
            ABP.util.SessionStorage.set('SavedUsername', userInfo.logonId); // sessionTokens don't have the user id in them. So these are stored alongside.
        }

        // Password
        if (Ext.isEmpty(userInfo.password)) {
            // No password. Remove any saved one in global local storage.
            ABP.util.LocalStorage.remove('SavedPassword');
        } else {
            ABP.util.LocalStorage.set('SavedPassword', userInfo.password);
        }

        // Environment
        if (Ext.isEmpty(userInfo.environment)) {
            // No environment. Remove any saved one in global local storage.
            ABP.util.LocalStorage.remove('SavedEnvironment');
        } else {
            ABP.util.LocalStorage.set('SavedEnvironment', userInfo.environment);
        }

        // Language
        if (Ext.isEmpty(userInfo.locale)) {
            // No language. Remove any saved one in global local storage.
            ABP.util.LocalStorage.remove('SavedLanguage');
        } else {
            ABP.util.LocalStorage.set('SavedLanguage', userInfo.locale);
        }

        // Do not go to the select user panel if authentication fails or there is not enough information to authenticate.
        vm.set('allowAutoShowSelectUser', false);

        // Notify the login view model that values it holds have changed in storge.
        // It would be nice if this could be done by binding.
        // But the local storage is not bound.
        this.fireEvent('login_updateViewModel');
    },

    authenticate: function (jsonData, keepSignedIn) {
        var me = this;
        var vm = me.getViewModel();

        if (ABP.util.Msal.enabled) {
            var token = ABPAuthManager.getToken();
            if (token) {
                // B2C authentication is enabled. If the user needs to and has already run through the login screen, proceed to login.
                me.loginWithB2cToken(token, { jsonData: jsonData, keepSignedIn: keepSignedIn });
                return;
            }
        }
        me.fireEvent('main_showLoading', 'load_authenticating', 'fullSize');
        if (keepSignedIn === undefined) {
            keepSignedIn = vm.get('keepMeSignedIn');
        }
        if (keepSignedIn) {
            vm.set('keepMeSignedIn', true);
        }
        vm.set('selected.environment', jsonData.environment);
        vm.set('selected.language', jsonData.locale);

        // Check if the user is logged in, user needs to authenticate to go online.
        if ((vm.get('isOffline') || vm.get('offlineMode')) && !ABP.util.Config.getLoggedIn()) {
            me.offlineAuthenticate(jsonData, keepSignedIn);
            return;
        }

        ABP.util.Ajax.request({
            url: ABP.util.LocalStorage.get('ServerUrl') + '/abp/login/',
            method: 'POST',
            withCredentials: true,
            cors: (Ext.browser.name !== 'IE' || Ext.browser.version.major > 9.0),
            jsonData: jsonData,
            success: function (response) {
                me.loginSuccess(response, jsonData, true);
            },
            failure: function (err) {
                if (err) {
                    // TODO: Should we boot the user?
                    if ((vm.get('isOffline') || vm.get('offlineMode')) && ABP.util.Config.getLoggedIn()) {
                        // Tell the user auth failed, cannot go online.
                        me.fireEvent('main_hideLoading');
                        ABP.view.base.popUp.PopUp.showPopup('offline_passwordPrompt_failure', 'error_ok_btn');
                        return;
                    }

                    if (err.timedout) {
                        ABP.view.base.popUp.PopUp.showPopup('error_timedout', 'error_ok_btn', function () {
                            me.fireEvent('login_UserHit');
                        });
                    } else if (err.responseText !== "") {
                        var resText = Ext.JSON.decode(err.responseText);

                        me.handleLoginFailureResponse(resText, false, null, function () {
                            me.fireEvent('login_UserHit');
                        });
                    }
                } else {
                    ABP.view.base.popUp.PopUp.showPopup('login_error_authFailure', 'error_ok_btn', function () {
                        me.fireEvent('login_UserHit');
                    });
                }
                me.redirectTo('login', true);
                me.fireEvent('main_hideLoading');
            }
        });
    },

    authenticationLogic: function (responseData, loginPass, jsonData, keepSignedIn) {
        var me = this;
        var vm = me.getViewModel();
        vm.set('loginTime', Date.now());
        // Save successful login form values.

        // Allow responseData.logonId to override jsonData.logonId
        if (responseData && responseData.logonId) {
            jsonData = jsonData || {};
            jsonData.logonId = responseData.logonId;
        }
        if (jsonData) {
            // It is important that username and selected environment are saved before anything else because
            // some state information is dependent on the user and environment.
            if (loginPass || jsonData.logonId) {
                ABP.util.Config.setUsername(jsonData.logonId);
                ABP.util.SessionStorage.set('SavedUsername', jsonData.logonId);
            }
            if (loginPass || jsonData.environment) {
                ABP.util.Config.setEnvironment(jsonData.environment);
            }
            if (loginPass) {
                // One-off upgrade if previous login was using an older local storage schema.
                ABP.util.LocalStorage.upgradeUserStorage();
            }

            // Record this username (as typed in by the use) and when this user last logged in. The latter is used for recently-used features.
            if (loginPass) {
                ABP.util.LocalStorage.setForLoggedInUser(ABP.util.LocalStorage.usernameKey, ABP.util.Config.getUsername());
                ABP.util.LocalStorage.setForLoggedInUser('LastLogin', Date.now());
            }

            // Save successful login form values.
            if (loginPass || jsonData.logonId) {
                me.rememberValue({
                    value: jsonData.logonId,
                    toLocalStorageKey: 'SavedUsername',
                    ifLocalStorageEnabledBy: 'bootstrapConf.settings.rememberUsername',
                    orIf: keepSignedIn
                });
            }
            if (loginPass || jsonData.password) {
                me.rememberValue({
                    value: jsonData.password,
                    toLocalStorageKey: 'SavedPassword',
                    ifLocalStorageEnabledBy: 'bootstrapConf.settings.rememberPassword', // Was canKeepMeSignedIn.
                    andOnlyIf: keepSignedIn,
                    toLoggedInUserLocalStorageKey: true
                });
            }
            if (loginPass || jsonData.environment) {
                me.rememberValue({
                    value: jsonData.environment,
                    toLocalStorageKey: 'SavedEnvironment',
                    ifLocalStorageEnabledBy: 'bootstrapConf.settings.rememberEnvironment'
                });
            }
            if (loginPass || jsonData.locale) {
                me.rememberValue({
                    value: jsonData.locale,
                    toLocalStorageKey: 'SavedLanguage',
                    ifLocalStorageEnabledBy: 'bootstrapConf.settings.rememberLanguage',
                    toLoggedInUserLocalStorageKey: true
                });
            }

            // Save hash of password if required by offline authentication mode.
            if (loginPass || jsonData.logonId && jsonData.password) {
                // Do not save globally in local storage, only for this user.
                if (vm.get('bootstrapConf.offlineAuthenticationType') === 2) {
                    // Create salt for the password, concat environment and username is sufficient for client side (temporary storage).
                    var salt = ABP.util.Sha256.generateSaltForUser(jsonData.logonId, jsonData.environment);
                    var passwordHash = ABP.util.Sha256.sha256(jsonData.password, salt);
                    ABP.util.LocalStorage.setForLoggedInUser('SavedPasswordHash', passwordHash);
                }
            }
        }

        if (loginPass) {
            me.rememberValue({
                value: me.getExtraSettingsFieldsAsString(),
                toLocalStorageKey: 'settingsextrafields',
                ifLocalStorageEnabledBy: 'bootstrapConf.settings.rememberExtraSettingsFields'
            });
            me.rememberValue({
                value: me.getExtraLoginFieldsAsString(),
                toLocalStorageKey: 'loginextrafields',
                ifLocalStorageEnabledBy: 'bootstrapConf.settings.rememberExtraLoginFields'
            });
            if (keepSignedIn) {
                ABP.util.LocalStorage.setForLoggedInUser('keepSignedIn', true);
                ABP.util.LocalStorage.set('keepSignedIn', true);
            }
        }

        if (responseData && responseData.extraStep) {
            // more info needed - responseData.extraStep
            // lets ABP know that there is a step between login and configuration
            // responseData.extraStep = {
            // xtype (string) - custom xtype that the product package provides.  this xtype will
            // be rendered as an additional maintenance page with a login button (stock).
            // args (array) - optional arguments array that can be passed forward to be used by the
            // product's implementation of this xtype
            // path (string) - the string to be appended to ABP.util.LocalStorage.get("ServerUrl") for the
            // product's handling of an Ajax call for the additional information.
            // }
            // when the user clicks that login button we will resend the login request with the
            // additional information from this xtype.

            me.showLaunch('extraloginstep-tab', responseData.extraStep);
            me.fireEvent('main_hideLoading');
        } else {
            // Legacy Case - No auth type defined.
            if (Ext.isEmpty(ABP.util.Config.getAuthType())) {
                if (!ABP.util.Config._bootstrapConfig || !ABP.util.Config._bootstrapConfig.authenticatedUserName) {
                    if (ABP.util.Common.isJsonString(responseData.sessionId)) {
                        var breakdown = Ext.JSON.decode(responseData.sessionId);
                        ABP.util.Config.setSessionId(breakdown);
                        ABP.util.Config.setAuthType('oauth');
                        me.handleNewToken(breakdown, keepSignedIn);
                    } else {
                        ABP.util.Config.setSessionId(responseData.sessionId);
                        ABP.util.Config.setAuthType('integrated');
                    }
                }
            }
            // Store session credentials depending on the auth type.
            if (ABP.util.Config.getAuthType() === 'oauth') {
                var tokenResponse = Ext.JSON.decode(responseData.sessionId);
                ABP.util.Config.setSessionId(tokenResponse);
                me.handleNewToken(tokenResponse, keepSignedIn);
            } else if (ABP.util.Config.getAuthType() === 'integrated') {
                // TODO: Credentials are automatically apended for most integrated cases.
                // SessionId is still set in case there are backwards-compatibility cases to support where products use ABP.util.Config.getSessionId()
                if (responseData.sessionId) {
                    ABP.util.Config.setSessionId(responseData.sessionId);
                }
            } else if (ABP.util.Config.getAuthType() === 'cookie') {
                // Do nothing, the expectation is that the server's response included the Set-Cookie header and now the session has a cookie that will authorize the user for subsequent requests.
            }
            // Allow tracking filtered by the authenticated user.
            if (typeof appInsights == 'object') {
                appInsights.setAuthenticatedUserContext(jsonData.logonId);
            }
            // trigger milestone event
            me.fireEvent('container_authentication_success');
            // Get configuration now that user can be authorized.
            me.fireEvent('main_doConfiguration', jsonData && jsonData.locale ? jsonData.locale : vm.get('selected.language'));
        }
    },

    // Product uses a middle step between authenticate and configuration
    // They require a seperate/custom AJAX call for their additional information
    // Success should trigger doConfiguration()
    // jsonData - the json object the project needs passed back
    // path - the string to append to the end of the serverurl to make the call
    secondAuthStep: function (jsonData, path) {
        var me = this;
        var vm = me.getViewModel();
        if (path && path[0] !== '/') {
            path = '/' + path;
        }
        me.fireEvent('main_showLoading', ABP.util.Common.geti18nString('load_extraAuthStep'));
        ABP.util.Ajax.request({
            url: ABP.util.LocalStorage.get("ServerUrl") + path,
            method: 'POST',
            withCredentials: true,
            cors: (Ext.browser.name !== 'IE' || Ext.browser.version.major > 9.0),
            jsonData: jsonData,
            success: function (response) {
                me.loginSuccess(response, jsonData, false);
            },
            failure: function (err) {
                if (err) {
                    if (err.timedout) {
                        ABP.view.base.popUp.PopUp.showPopup(vm.get('i18n.error_timedout'), vm.get('i18n.error_ok_btn'), function () {
                            me.fireEvent('login_UserHit');
                        });
                    } else if (err.responseText !== "") {
                        // TODO: This code should be refactored - a proper failure will not necessarily have the same structure.
                        try {
                            var resText = Ext.JSON.decode(err.responseText);
                            var mess = resText.errorMessage;
                        } catch (error) { }
                        if (mess) {
                            ABP.view.base.popUp.PopUp.showPopup(mess, vm.get('i18n.error_ok_btn'), function () {
                                me.fireEvent('login_UserHit');
                            });
                        } else {
                            ABP.view.base.popUp.PopUp.showPopup(vm.get('i18n.login_error_authFailure'), vm.get('i18n.error_ok_btn'), function () {
                                me.fireEvent('login_UserHit');
                            });
                        }
                    }
                } else {
                    ABP.view.base.popUp.PopUp.showPopup(vm.get('i18n.login_error_authFailure'), vm.get('i18n.error_ok_btn'), function () {
                        me.fireEvent('login_UserHit');
                    });
                }
                me.redirectTo('login', true);
                me.fireEvent('main_hideLoading');
            }
        });
    },

    showLaunch: function (startingLaunchCarouselTab, options) {
        var me = this;
        var view = this.getView();
        if (!view.down('launchcanvas')) {
            view.removeAll(true, true);
            me.getViewModel().set('startingLaunchCarouselTab', startingLaunchCarouselTab);
            view.add({
                xtype: 'launchcanvas'
            });
        }
        // Launch canvas is created, but the specified tab may not be on view.
        switch (startingLaunchCarouselTab) {
            case 'settings-tab':
                me.fireEvent('launchCarousel_Settings');
                break;
            case 'login-tab':
                me.fireEvent('launchCarousel_Login');
                break;
            case 'maintenance-tab':
                me.fireEvent('launchCarousel_Maintenance');
                break;
            case 'selectuser-tab':
                me.fireEvent('launchCarousel_SelectUser');
                break;
            case 'discovery-tab':
                me.fireEvent('launchCarousel_Discovery', options);
                break;
            case 'extraloginstep-tab':
                me.fireEvent('launchCarousel_Maintenance', 'maintenanceextrastep', options);
        }
    },

    showNoSupportPage: function () {
        var me = this;
        var view = me.getView();
        view.removeAll(true, true);
        view.add({
            xtype: 'nosupportpage'
        })
    },

    showSettings: function () {
        this.showLaunch('settings-tab');
    },

    showLogin: function () {
        if (this.getViewModel().get('allowAutoShowSelectUser') == true && this.userSelectionPossible()) {
            // If there is already users stored then present a choice to the user to use that or login as another user.
            this.showLaunch('selectuser-tab');
        } else {
            // Otherwise continue as normal.
            this.showLaunch('login-tab');
        }
    },

    // Determine if the user can pick from a list of users.
    userSelectionPossible: function () {
        // Allowed to keep track of multiple logins?
        // NOTE: If bootstrap is not loaded yet then it must be assumed that user selection is not possible.
        var vm = this.getViewModel();
        if (vm && vm.get('bootstrapped') && ABP.util.Config.getBootstrapConfig().settings.canKeepMultipleUsersSignedIn) {
            // Are there any saved users for known environments?
            var userData = ABP.util.LocalStorage.getUserData();
            if (userData && userData.length > 1) { // more than 1 - if only one, show main login with username pre-populated
                return true;
            }
        }
        return false;
    },

    doBootstrap: function () {
        var me = this;
        var vm = me.getView().getViewModel();
        var serverUrl = ABP.util.Ajax.getBootstrapServerUrl();
        var extraFields = me.getExtraSettingsFields();
        var fullUrl = '';

        // If settings URL is not available, show launch canvas and focus on settings screen.
        if (!serverUrl || (Ext.browser.name === 'IE' && Ext.browser.version.major === 9.0 && !ABP.util.Config.checkHostNameMatch(serverUrl))) {
            me.showSettings();
            return;
        }

        fullUrl = serverUrl + '/abp/bootstrap?deviceType=' + Ext.os.deviceType + '&locale=' + ABP.util.Common.getBrowserLanguage();

        if (!Ext.isEmpty(extraFields)) {
            var i = 0;
            for (i; i < extraFields.length; ++i) {
                fullUrl += '&' + extraFields[i].fieldId + '=' + extraFields[i].val;
            }
        }

        // Make call to bootstrap service.
        Ext.Ajax.useDefaultXhrHeader = true;
        ABP.util.Ajax.request({
            url: fullUrl,
            withCredentials: true,
            cors: (Ext.browser.name !== 'IE' || Ext.browser.version.major > 9.0),
            method: 'GET',
            success: function (response) {
                try {
                    // If bootstrap succeeds, populate configuration store.
                    ABP.util.LocalStorage.set('ServerUrl', serverUrl);
                    var resp = Ext.JSON.decode(response.responseText);
                    vm.set('offlineMode', false);

                    if (resp.resultCode === 0) {
                        me.loadBootstrapConfig(resp.configuration);
                    } else if (resp.resultCode === 11) {
                        me.showSettings();
                    } else {
                        if (resp.errorMessage) {
                            ABP.view.base.popUp.PopUp.showError(resp.errorMessage);
                        }
                        me.showSettings();
                    }
                } catch (ex) {
                    me.doBootstrapErrorHander(ex, me, vm);
                }
            },
            failure: function (err) {
                me.doBootstrapErrorHander(err, me, vm);
            }
        });
    },

    doBootstrapErrorHander: function (err, me, vm) {
        // Check if there is a cached bootstrap/configuration which can be used for Offline login.
        // Status 0 typically means a general network error. Sometimes that the request couldn't be completed for multiple reasons (illegal CORS, firewalls, cancelled requests, browser extensions).
        if ((err.status === 404 || err.status === 0) && (!navigator.onLine || (navigator.connection && (navigator.connection.type === 'unknown' || navigator.connection.type === 'none')))) {
            if (ABP.util.LocalStorage.get('OfflineBootstrap')) {
                vm.set('offlineMode', true);
                var offlineBootstrap = Ext.JSON.decode(ABP.util.LocalStorage.get('OfflineBootstrap'));
                var offlineAuthType = offlineBootstrap.offlineAuthenticationType;
                var hideOfflineModeToggle = offlineBootstrap.hideOfflineModeToggle;
                offlineBootstrap = offlineBootstrap.bootstrap;
                offlineBootstrap.offlineAuthenticationType = offlineAuthType;
                offlineBootstrap.hideOfflineModeToggle = hideOfflineModeToggle;
                me.loadBootstrapConfig(offlineBootstrap);
                return;
            }
        }
        if (ABP.util.Ajax.getAttemptDiscoveryServerUrl()) {
            // This was a discovery attempt. Re-try with another URL.
            me.doBootstrap();
            return;
        }
        // If bootstrap fails, show launch canvas and focus on settings screen.
        me.showSettings();
        var connection = vm.checkI18n('error_connection_failed');
        var conMess = vm.checkI18n('error_connection_instructions');
        var okBtn = vm.checkI18n('error_ok_btn');
        if (err && err.responseText !== "") {
            var mess = '';
            try {
                var resText = Ext.JSON.decode(err.responseText, true);
                mess = resText.errorMessage;
            } catch (e) {
                mess = (err.status || '') + ' ' + (err.statusText || '');
            }
            if (mess) {
                ABP.view.base.popUp.PopUp.showError(conMess, connection + ' ' + mess, okBtn);
            } else {
                ABP.view.base.popUp.PopUp.showError(conMess, connection, okBtn);
            }
        } else {
            ABP.view.base.popUp.PopUp.showError(conMess, connection, okBtn);
        }
    },

    authCheck: function () {
        var me = this,
            vm = me.getView().getViewModel(),
            jsonData;

        var loginAsUser = vm.get('loginAsUser') || {};
        vm.set('loginAsUser', null); // Clear out loginAsUser so it cannot be used again.

        // If already authenticated, make call to configuration service.
        if (ABP.util.Config.isPreAuthenticated()) {
            ABP.util.Config.setUsername(ABP.util.Config.getBootstrapConfig().authenticatedUserName);
            if (!me.checkEnvLangAvailability()) { // Check for env/lang in bootstrap (if not there go here).
                if (me.extraFieldsProcessForLoginBypass()) {
                    me.doConfiguration();
                    me.getViewModel().set('loginTime', Date.now());
                } else {
                    me.redirectTo("login", true);
                }
            } else {
                me.redirectTo("login", true);
            }
            return;
        }

        // The sessionToken normally lives in session storage once the user has been authenticated.
        // So a tab refresh will have the sessionToken in session storage.
        // A session token can also come from the loginAsUser.
        var sessionToken = loginAsUser.sessionToken || ABP.util.SessionStorage.get('sessionToken');
        if (sessionToken) {
            sessionToken = ABP.util.Common.jsonDecode(sessionToken);
            if (sessionToken && sessionToken.refresh_token) {
                var userId = ABP.util.SessionStorage.get('SavedUsername');
                // Only possible if user id is there too.
                if (userId) {
                    this.refreshTokenRelog(sessionToken.refresh_token, userId);
                    // OLD: this.refreshTokenRelog(sessionToken.refresh_token, sessionToken.UserId);
                    return;
                }
            }
        }

        // This case supports the ABP 2 model where one user can be globally logged into all tabs.
        var localToken = ABP.util.LocalStorage.get('sessionToken');
        if (localToken) {
            localToken = ABP.util.Common.jsonDecode(localToken);
            if (localToken && localToken.refresh_token) {
                var userId = ABP.util.LocalStorage.get('SavedUsername');
                // Only possible if user id is there too.
                if (userId) {
                    me.getViewModel().set('keepMeSignedIn', true);
                    me.refreshTokenRelog(localToken.refresh_token, userId);
                    // OLD this.refreshTokenRelog(localToken.refresh_token, localToken.UserId);
                    return;
                }
            }
        }

        // Cookie based authentication & username was saved. Skip login - server will be responsible for validating user's cookie(s) for this domain.
        if (ABP.util.Config.getAuthType() === 'cookie') {
            // Check the keepSignedIn flag
            var savedUserName = ABP.util.LocalStorage.get('SavedUsername');
            var savedEnvironment = ABP.util.LocalStorage.get('SavedEnvironment');
            var keepSignedIn = ABP.util.LocalStorage.getForUser(savedEnvironment, savedUserName, 'keepSignedIn') === 'true';
            // Attempt auto sign in if the keepSignedIn was set or this is a refresh.
            if (keepSignedIn || !!ABP.util.SessionStorage.get('SavedUsername')) {
                jsonData = {
                    logonId: savedUserName,
                    environment: savedEnvironment,
                    locale: ABP.util.LocalStorage.get('SavedLanguage')
                }
                me.authenticate(jsonData, keepSignedIn);
                return;
            }
        }

        me.fireEvent('main_showLoading', 'load_authCheck');
        // If autologin and all pre-reqs are met, attempt authentication.
        var autoLoginParams = me.getAutoLoginParams(loginAsUser);
        if (autoLoginParams) {
            vm.set('keepMeSignedIn', true);
            me.fireEvent('main_Authenticate', autoLoginParams, true);
            me.fireEvent('main_showLoading', 'load_log');
            return;
        }

        // An attempt at authenticating did not happen.
        // Show / go back to login form.
        this.getViewModel().set('keepMeSignedIn', false);
        me.redirectTo("login", true);
        me.fireEvent('main_hideLoading');
    },

    getExtraSettingsFields: function () {
        var ret;
        var local = ABP.util.LocalStorage.get('settingsextrafields');
        if (local) {
            ret = JSON.parse(local);;
        } else {
            ret = this.getViewModel().get('prebootstrapExtraSettingsFilled');
        }
        return ret;
    },

    getExtraSettingsFieldsAsString: function () {
        var me = this;
        var ret;
        var extra = me.getExtraSettingsFields();
        if (Ext.isString(extra)) {
            ret = extra;
        } else {
            ret = JSON.stringify(extra);
        }
        return ret;
    },

    getExtraSettingsFieldsFromString: function () {
        var me = this;
        var ret;
        var extra = me.getExtraSettingsFields();
        if (Ext.isString(extra)) {
            ret = JSON.parse(extra);
        } else {
            ret = extra;
        }
        return ret;
    },

    getExtraLoginFields: function () {
        var ret;
        var local = ABP.util.LocalStorage.get('loginextrafields');
        if (local) {
            ret = local;
        } else {
            ret = this.getViewModel().get('loginExtraFieldsFilled');
        }
        return ret;
    },

    getExtraLoginFieldsAsString: function () {
        var me = this;
        var ret;
        var extra = me.getExtraLoginFields();
        if (Ext.isString(extra)) {
            ret = extra;
        } else {
            ret = JSON.stringify(extra);
        }
        return ret;
    },

    getExtraLoginFieldsFromString: function () {
        var me = this;
        var ret;
        var extra = me.getExtraLoginFields();
        if (Ext.isString(extra)) {
            ret = JSON.parse(extra);
        } else {
            ret = extra;
        }
        return ret;
    },

    isValidServerUrl: function (url) {
        if (!url) {
            return false;
        }
        return (/^(?:(?:https?):\/\/)(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*|(?:(?:[a-z\u00a1-\uffff0-9]+_?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*)(?::\d{2,5})?(?:\/[^\s]*)?$/i).test(url);
        //        return /^(?:(?:https?):\/\/)(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i.test(url);
    },

    /**
     * @private
     * @param {Object} [loginAsUser] Optional object holding a user's login info.
     */
    getAutoLoginParams: function (loginAsUser) {
        var me = this;
        var vm = me.getViewModel();
        var i;
        var env;

        // Abort auto login if there was an intentional signout.
        var forceLogin = ABP.util.LocalStorage.get("forceLogin");
        if (forceLogin === "true") {
            ABP.util.LocalStorage.set("forceLogin", "");
            return false;
        }

        var envs = vm.get('bootstrapConf.availableEnvironments');
        var preAuthUser = vm.get('bootstrapConf.authenticatedUserName');
        var authType = vm.get('bootstrapConf.settings.authenticationType');
        // If we are already authenticated, determine if we can immediately log in
        if (authType === 'integrated' && preAuthUser && envs) {
            var autoEnv = null;
            if (envs.length === 1) {
                autoEnv = envs[0].id;
            } else {
                env = ABP.util.LocalStorage.get('SavedEnvironment');

                if (env !== "" && env !== undefined && env !== null) {
                    // make sure it's still a valid option
                    for (i = 0; i < envs.length; ++i) {
                        if (envs[i].id === env) {
                            autoEnv = env;
                            break;
                        }
                    }
                }
            }
            if (autoEnv !== null) {
                return {
                    "environment": autoEnv,
                    "logonId": preAuthUser,
                    "password": "",
                    "locale": ""
                };
            }
        }

        var user;
        var pass;
        var env;
        var lang;

        // Additional ABP 3.0 case: ignoring canKeepMeSignedIn, if a user was specified for login
        // (and there are enough credentials to try a login) then try a login.
        if (loginAsUser && !Ext.Object.isEmpty(loginAsUser)) {
            user = loginAsUser.logonId;
            pass = loginAsUser.password;
            env = loginAsUser.environment;
            lang = loginAsUser.locale;
        } else if (!this.userSelectionPossible() &&
            vm.get('bootstrapConf.settings.canKeepMeSignedIn')) {
            // Original ABP 2.0 case: canKeepMeSignedIn is true
            // and there is not the possibility for the user to select other users
            // (and there are enough credentials to try a login)
            // then try a login.
            user = ABP.util.LocalStorage.get('SavedUsername');
            pass = ABP.util.LocalStorage.get('SavedPassword');
            env = ABP.util.LocalStorage.get('SavedEnvironment');
            lang = ABP.util.LocalStorage.get('SavedLanguage');
        }

        // Will only try a login if enough credentials info has been provided.
        if ((user !== "" && user !== undefined && user !== null) &&
            (pass !== "" && pass !== undefined && pass !== null) &&
            (env !== "" && env !== undefined && env !== null) &&
            (lang !== "" && lang !== undefined && lang !== null)) {

            return {
                "environment": env,
                "logonId": user,
                "password": pass,
                "locale": lang
            };
        }

        return false;
    },

    rememberValue: function (opts) {
        var me = this;
        var vm = me.getViewModel();

        var value = '';
        var setLS = (opts.orIf) ||
            ((opts.ifLocalStorageEnabledBy) ? vm.get(opts.ifLocalStorageEnabledBy) : false);

        if (setLS === "true") {
            setLS = true;
        }

        if (setLS === true && (opts.andOnlyIf === undefined || opts.andOnlyIf === true)) {
            value = opts.value;
        }

        // Even if local storage is not enabled, set the value anyways to clear
        // any previous value.
        ABP.util.LocalStorage.set(opts.toLocalStorageKey, value);
        if (opts.toLoggedInUserLocalStorageKey) {
            ABP.util.LocalStorage.setForLoggedInUser(opts.toLocalStorageKey, value);
        }
    },

    relaunch: function () {
        var me = this;
        var view = me.getView();
        view.getViewModel().set('bootstrapped', false);
        view.removeAll(true, true);
        view.add({
            xtype: 'loadingscreen',
            anchor: '100% 100%'
        });

        me.doBootstrap();
    },

    doConfiguration: function (locale) {
        var me = this;
        var vm = me.getViewModel();
        var servicesAttempted = vm.get('servicesAttempted');
        // handle the locale first so if we have to attempt services, the value is stored
        if (locale) {
            ABP.util.Config.setLanguage(locale);
        } else {
            locale = ABP.util.Config.getLanguage();
        }
        if (!servicesAttempted) {
            // check to see if we have services 
            me.fireEvent('main_getSubscriptionServices');
            return;
        }
        var extraFields = vm.get('configurationExtraInfo');
        var extraSettings = me.getExtraSettingsFields();
        ABP.util.Config.setLanguage(locale);
        me.fireEvent('main_showLoading', 'load_load_config', 'fullSize');

        // If an offline bootstrap is cached and an offline password is not set, prompt the user to enter one.
        if (ABP.util.LocalStorage.get('OfflineBootstrap') && vm.get('bootstrapConf.offlineAuthenticationType') === 1) {
            if (!ABP.util.LocalStorage.containsForLoggedInUser('OfflinePassword') && !ABP.util.LocalStorage.getForLoggedInUser('OfflinePasswordSkipped')) {
                me.fireEvent('launchCarousel_Maintenance', 'offlinepassword');
                me.fireEvent('main_hideLoading');
                return;
            }
        }
        // Switching to online mode
        if (vm.get('switchToOnline') === true) {
            // Notify any interested parties online mode is engaging, authentication was successful or skipped.
            me.fireEvent('container_online_mode');
            vm.set('offlineMode', false);
            vm.set('switchToOnline', null);
        }
        // Load the offline configuration if the client is offline.
        if ((vm.get('isOffline') || vm.get('offlineMode')) && ABP.util.LocalStorage.getForLoggedInUser('OfflineConfiguration')) {
            me.loadSessionConfig(Ext.JSON.decode(ABP.util.LocalStorage.getForLoggedInUser('OfflineConfiguration')));
            return;
        }

        var urlPartTwo = '';
        var i = 0;
        if (locale) {
            urlPartTwo = '/abp/configuration?locale=' + locale + '&deviceType=' + Ext.os.deviceType;
        } else {
            urlPartTwo = '/abp/configuration?deviceType=' + Ext.os.deviceType;
        }
        if (extraFields && !Ext.isEmpty(extraFields)) {
            for (i = 0; i < extraFields.length; ++i) {
                urlPartTwo += '&' + extraFields[i].fieldId + '=' + extraFields[i].val;
            }
        }
        if (extraSettings && !Ext.isEmpty(extraSettings)) {
            for (i = 0; i < extraSettings.length; ++i) {
                urlPartTwo += '&' + extraSettings[i].fieldId + '=' + extraSettings[i].val;
            }
        }
        var url = ABP.util.LocalStorage.get('ServerUrl') + urlPartTwo;

        ABP.util.Ajax.request({
            url: url,
            withCredentials: true,
            cors: (Ext.browser.name !== 'IE' || Ext.browser.version.major > 9.0),
            method: 'GET',
            success: function (response) {
                // if bootstrap succeeds, populate configuration store
                me.fireEvent('main_showLoading', 'load_apply_config', 'fullSize');
                var resp = Ext.JSON.decode(response.responseText);
                if (resp.resultCode === 0) {
                    me.loadSessionConfig(resp.configuration);
                } else {
                    me.handleLoginFailureResponse(resp, false, 'login_error_configFailure');
                    me.redirectTo('login', true);
                }
                me.fireEvent("main_doPostConfiguration");
                me.fireEvent('main_hideLoading');
            },

            failure: function (err) {
                me.redirectTo('login', true);
                me.fireEvent('main_hideLoading');
                if (err) {
                    if (err.timedout) {
                        ABP.view.base.popUp.PopUp.showPopup(vm.get('i18n.error_timedout'), vm.get('i18n.error_ok_btn'), function () {
                            me.fireEvent('login_UserHit');
                        });
                    } else if (err.responseText !== "") {
                        var resText = ABP.util.Common.jsonDecode(err.responseText);
                        me.handleLoginFailureResponse(resText, false, 'login_error_configFailure');
                    } else {
                        ABP.view.base.popUp.PopUp.showPopup(vm.get('i18n.login_error_configFailure'), vm.get('i18n.error_ok_btn'));
                    }
                } else {
                    ABP.view.base.popUp.PopUp.showPopup(vm.get('i18n.login_error_configFailure'), vm.get('i18n.error_ok_btn'));
                }
            }
        });
    },

    setupConfiguration: function (config) {
        var me = this;
        var themeFound = false;
        ABP.util.Config.setLoggedIn(true);
        me.getView().getViewModel().set('conf', config);
        me.getViewModel().i18nSet(config.languageResources);
        me.fireEvent('main_AddSession');
        me.initializePlugins();
        me.fireEvent('searchDrop_storeLoad', config.settings);
        me.fireEvent('featureCanvas_hideLoading');
        if (ABP.util.Common.getClassic() && ABP.util.Config.getSessionConfig().settings.enableSearch) {
            if (config.settings.searchInfo && config.settings.searchInfo.length > 0) {
                me.fireEvent('toolbar_addSearchButton');
            }
        }
        // The toolbar title can be set by config, or directly through an event.
        if (config.settings.appToolbarTitle) {
            // Set the app toolbar (top) title from config.
            me.fireEvent('container_toolbar_setTitle', config.settings.appToolbarTitle);
        }
        if (config.settings.disableNavMenu) {
            me.fireEvent('toolbar_removeMenuButton');
        }
        if (config.toolbarMenu) {
            me.fireEvent('toolbar_setupConfig', config.toolbarMenu);
        }
        // check for presence of themes
        if (Ext.theme.subThemeList && !Ext.isEmpty(Ext.theme.subThemeList)) {
            // if persist theme, look for it in local storage
            var savedTheme = ABP.util.LocalStorage.getForLoggedInUser('ChosenTheme');
            var themeFound = false;
            if (config.settings.persistSelectedTheme && savedTheme) {
                themeFound = me.processThemeConfig(savedTheme);
            }
            // if default theme (no persist, or not found in local storage), check default against theme list
            if (!themeFound && config.settings.defaultTheme) {
                themeFound = me.processThemeConfig(config.settings.defaultTheme);
            }
            // else use first theme in array (vivid-blue)
            if (!themeFound) {
                me.processThemeConfig(Ext.theme.subThemeList[0]);
            }
            // check for mainMenuSingleExpand and personalization.mainMenuSingleExpand
            if (config.settings.mainMenuSingleExpand !== undefined) {
                me.fireEvent('mainMenu_setSingleExpand', config.settings.mainMenuSingleExpand);
            }
            // start with Favorites open
            if (config.settings.mainMenuStartFavoritesOpen !== undefined) {
                if (config.settings.mainMenuStartFavoritesOpen) {
                    me.fireEvent('mainmenu_openFavorites');
                }
            }
        }
        if (config.settings.enableMenuRecent) {
            if (config.settings.recents && Ext.isArray(config.settings.recents) && !Ext.isEmpty(config.settings.recents)) {
                // server passed in recents
                me.fireEvent('mainMeun_setRecents', config.settings.recents);
            } else {
                // see if the exist in local storage
                var localRecents = ABP.util.LocalStorage.getForLoggedInUser('ABPCore_recentPages');
                if (localRecents) {
                    me.fireEvent('mainMeun_setRecents', Ext.JSON.decode(localRecents));
                }
            }
        }

        if (config.shortcuts) {
            me.processShortcuts(config.shortcuts);
        }
        if (config.headlines) {
            me.processHeadlines(config.headlines);
        }
        /*if (config.formatting) {
            me.processFormatting(config.formatting);
        }*/
        me.processSenchaStrings();
        me.fireEvent('main_hideLoading');
    },

    processThemeConfig: function (theme) {
        var me = this;
        var vm = me.getViewModel();
        var themeFound = false;
        var i = 0;
        if (Ext.theme.subThemeList && !Ext.isEmpty(Ext.theme.subThemeList)) {
            if (theme.indexOf('aptean-theme') === -1) {
                theme = 'aptean-theme-' + theme;
            }
            for (i = 0; i < Ext.theme.subThemeList.length; ++i) {
                if (Ext.theme.subThemeList[i] === theme) {
                    ABPTheme.setTheme(theme);

                    vm.set('startingTheme', theme);
                    themeFound = true;
                    break;
                }
            }
        }
        return themeFound;
    },

    processHeadlines: function (headlines, bootstrap) {
        headlines = headlines || [];
        bootstrap = bootstrap || false;
        var me = this,
            headline,
            headlineRead,
            toAdd = [],
            loggedIn = ABP.util.Config.getLoggedIn(),
            length = headlines.length,
            i = 0;
        if (loggedIn && bootstrap) {
            return;
        }
        for (; i < length; i++) {
            headline = headlines[i];
            headlineRead = loggedIn ? ABP.util.LocalStorage.getForLoggedInUser("hr-" + headline.uniqueId) : ABP.util.LocalStorage.get("hr-" + headline.uniqueId);
            if (!headlineRead) {
                toAdd.push(headline);
            }
        }
        if (toAdd.length > 0) {
            me.fireEvent('container_headlines_show', toAdd);
        }
    },

    initializePlugins: function () {
        var hash;
        ABP.util.PluginManager.initializeAllPlugins();
        // Now that all the plugins are loaded, re-issue the route if it exists
        hash = ABP.util.SessionStorage.get("AfterLoginRedirect");
        if (hash) {
            this.redirectTo(hash, true);
            ABP.util.SessionStorage.remove("AfterLoginRedirect");
        } else {
            this.redirectTo("home");
        }
    },

    getSubscriptionServices: function () {
        var me = this;
        var vm = me.getViewModel();
        var url;
        var subService = ABPServiceManager.getService('subscription');
        if (subService) {
            url = subService.url;
        } else {
            ABPLogger.logWarn('Subscription service was not defined in the application.settings.json - service discovery will be disabled');
            vm.set('servicesAttempted', true);
            me.fireEvent('main_doConfiguration');
            return;
        }
        ABP.util.Ajax.request({
            url: url,
            withCredentials: true,
            cors: (Ext.browser.name !== 'IE' || Ext.browser.version.major > 9.0),
            method: 'GET',
            success: function (response) {
                //store subscription data in config
                vm.set('servicesAttempted', true);
                var resp = Ext.JSON.decode(response.responseText);
                ABP.Config.setSubscriptions(resp);
                // trigger configuration
                me.fireEvent('main_doConfiguration');
            },
            failure: function (err) {
                // no service support, trigger configuration
                vm.set('servicesAttempted', true);
                me.fireEvent('main_doConfiguration');
            }
        });
    },

    addSession: function () {
        var me = this;
        var view = me.getView();
        // var launch = view.down('#launch-canvas');
        // var loading = view.down('loadingscreen');
        // //        if (launch || loading) {
        // //            view.removeAll(true);
        // //        }
        // if (launch) {
        //     view.remove(launch);
        // }
        // if (loading) {
        //     view.remove(loading);
        // }
        this.activeAppId = undefined;
        view.removeAll();
        view.add({
            xtype: 'sessioncanvas'
        });
    },

    loginSuccess: function (response, jsonData, loginPass) {
        var me = this;
        var vm = me.getViewModel();
        var keepSignedIn = vm.get('keepMeSignedIn');
        var responseData = Ext.JSON.decode(response.responseText);
        if (responseData.resultCode === 0) {
            me.authenticationLogic(responseData, loginPass, jsonData, keepSignedIn);
        } else {
            if (responseData.resultCode === 1) {
                var canForcePw = me.getViewModel().get('bootstrapConf.settings.canForcePasswordChange');
                if (canForcePw === true || canForcePw === 'true') {
                    me.getViewModel().set('forcePasswordChange', jsonData);
                    me.fireEvent('launchCarousel_Maintenance', 'forcepassword');
                } else {
                    me.handleLoginFailureResponse(r, false, 'login_error_passwordExpired');
                    me.redirectTo('login', true);
                }
            } else if (responseData.resultCode === 7) { // forced login scenario
                if (responseData.errorDetailed || responseData.errorMessage) {
                    vm.set('forcedJson', jsonData);
                }
                me.handleLoginFailureResponse(responseData, true);
            } else {
                me.redirectTo('login', true);
                me.handleLoginFailureResponse(responseData, false);
            }
            me.fireEvent('main_hideLoading');
        }
    },

    handleLoginFailureResponse: function (r, forceLogin, backupString, popUpCallback) {
        forceLogin = forceLogin || false;
        backupString = backupString || 'login_error_authFailure';
        popUpCallback = popUpCallback || null;
        var buttons = forceLogin ? [{
            text: 'login_forceLogin',
            event: 'main_forceLogin'
        }, {
            text: 'error_cancel_btn'
        }] : 'error_ok_btn',
            errorString = r.errorDetailed || r.errorMessageKey || r.errorMessage,
            popUpError = errorString || backupString;
        if (!r.suppressErrorMessage) {
            ABP.view.base.popUp.PopUp.showPopup(popUpError, buttons, popUpCallback);
        }
        if (errorString) {
            ABP.util.Logger.logError('Error logging in: ' + errorString);
        }
    },

    handleNewToken: function (token, keepSignedIn, isRefresh) {
        var me = this,
            vm = me.getView().getViewModel();

        // If the expires_in time is greater than 10 minutes, subtract 5 minutes and set the refreshTask, otherwise subtract 10% and set the refreshTask.
        var expiresIn = token.expires_in > 600 ? (token.expires_in - 300) * 1000 : (token.expires_in - (token.expires_in * .1)) * 1000;
        if (!this.refreshTask) {
            // Create a delayed task.
            this.refreshTask = new Ext.util.DelayedTask(this.refreshToken, this);
            // Set the delay.
            this.refreshTask.delay(expiresIn);
        } else {
            // reset the delay, which cancels an old one if there is an old one.
            this.refreshTask.delay(expiresIn, this.refreshToken, this);
        }
        ABP.util.SessionStorage.set('sessionToken', Ext.JSON.encode(token));
        if (keepSignedIn) {
            // Local storage keeps a copy of the sessionToken if keep-me-signed-in is on,
            // so the login survives the tab closing.
            if (ABP.util.Config.getBootstrapConfig().settings.canKeepMultipleUsersSignedIn) {
                // If multiple users are allowed to be logged in at the same time then store the session token in per-user local storage.
                ABP.util.LocalStorage.setForLoggedInUser('sessionToken', Ext.JSON.encode(token));
            } else {
                // Only one user can be signed in at a time. Use the original scheme where the sessionToken is global.
                ABP.util.LocalStorage.set('sessionToken', Ext.JSON.encode(token));
            }
        } else {
            if (isRefresh) {
                if (vm.get('bootstrapConf.settings.canKeepMultipleUsersSignedIn')) {
                    // Local storage keeps a copy of the sessionToken if multiple users are configured on,
                    // so in another tab, clicking on the user you want auto-logs you in.
                    if (ABP.util.LocalStorage.getForLoggedInUser('sessionToken')) {
                        ABP.util.LocalStorage.setForLoggedInUser('sessionToken', Ext.JSON.encode(token));
                    }
                } else {
                    // Case when multiple users are not allowed to be logged in at the same time.
                    if (ABP.util.SessionStorage.get('sessionToken')) {
                        ABP.util.SessionStorage.set('sessionToken', Ext.JSON.encode(token));
                    }
                }
            } else {
                // Case when multiple users are not allowed to be logged in at the same time.
                ABP.util.LocalStorage.remove('sessionToken');
                // Case when multiple users are allowed to be logged in at the same time. Remove this just-logged-in user's sessionToken,
                // in case it is here too.
                ABP.util.LocalStorage.removeForLoggedInUser('sessionToken');
            }
        }
    },

    /**
     * @private
     * Gets a new access token for the case where the app is starting.
     * This is essentially a new sign-in, but using the refresh token.
     */
    refreshTokenRelog: function (refresh, user) {
        var me = this,
            vm = me.getViewModel();
        var refreshToken = refresh;
        var keepSignedIn = vm.get('keepMeSignedIn');

        // Not initially supporting 'Keep me signed in' for offline mode.
        if (vm.get('isOffline') || vm.get('offlineMode')) {
            return;
        }

        ABP.util.Ajax.request({
            url: ABP.util.Ajax.getServerUrl() + '/abp/refreshtoken',
            method: "POST",
            jsonData: {
                logonId: user,
                environment: ABP.util.LocalStorage.get('SavedEnvironment'),
                refreshToken: refreshToken
            },
            success: function (response, options) {
                var r = Ext.JSON.decode(response.responseText);
                var breakdown = Ext.JSON.decode(r.sessionId);
                if (r.resultCode === 0) {
                    ABP.util.Config.setSessionId(breakdown);
                    me.handleNewToken(breakdown, keepSignedIn, true);
                    ABP.util.Config.setEnvironment(ABP.util.LocalStorage.get('SavedEnvironment'));
                    ABP.util.Config.setUsername(user);
                    vm.set('loginTime', Date.now());
                    me.doConfiguration(ABP.util.LocalStorage.get('SavedLanguage'));
                    me.fireEvent('container_authentication_success');
                } else {
                    var autoLoginParams = me.getAutoLoginParams();
                    if (autoLoginParams) {
                        me.getViewModel().set('keepMeSignedIn', true);
                        me.fireEvent('main_Authenticate', autoLoginParams, true);
                        me.fireEvent('main_showLoading', 'load_log');
                    } else {
                        me.redirectTo('login', true);
                    }
                }
            },
            failure: function (response, options) {
                var autoLoginParams = me.getAutoLoginParams();
                if (autoLoginParams) {
                    me.getViewModel().set('keepMeSignedIn', true);
                    me.fireEvent('main_Authenticate', autoLoginParams, true);
                    me.fireEvent('main_showLoading', 'load_log');
                } else {
                    me.redirectTo('login', true);
                }
            }
        });
    },

    /**
     * @private
     * Gets a new access token for the case where the old one is expiring.
     */
    refreshToken: function () {
        var me = this;
        var refreshToken = ABP.util.Config.getOAuthInfo().refresh_token;
        var keepSignedIn = me.getViewModel().get('keepMeSignedIn');
        ABP.util.Ajax.request({
            url: ABP.util.LocalStorage.get('ServerUrl') + '/abp/refreshtoken',
            method: "POST",
            jsonData: {
                logonId: ABP.util.Config.getUsername(),
                environment: ABP.util.LocalStorage.get('SavedEnvironment'),
                refreshToken: refreshToken
            },
            success: function (response, options) {
                var r = Ext.JSON.decode(response.responseText);
                var breakdown = Ext.JSON.decode(r.sessionId);
                if (r.resultCode === 0) {
                    ABP.util.Config.setSessionId(breakdown);
                    me.handleNewToken(breakdown, keepSignedIn, true);
                } else {
                    // Let user know they are being signed out and sign out
                }
            },
            failure: function (response, options) {

            }
        });
    },

    activeAppId: undefined,
    activationRequest: undefined,
    shutdownInProgress: false,
    deferredShutdownRequests: [],
    fireAppEvent: function (appId, eventName, eventArgs, activateApp) {
        var me = this;

        if (appId === 'container') {
            // fire container events without app switch
            // Container event.  Application switch NOT required.
            me.fireEventArgs(appId + "_" + eventName, eventArgs instanceof Array ? eventArgs : [eventArgs]);
            return;
        } else if (appId) {

            this.fireEvent('featureCanvas_hideSetting');

            if (activateApp === false || activateApp === "false") {
                // activateApp is false, firing event
                this.fireEvent(appId + "_" + eventName, eventArgs);
                return;
            }

            if (this.activeAppId === undefined || this.activeAppId !== appId) {
                // Application switch required
                this.activationRequest = {
                    appId: appId,
                    eventName: eventName,
                    eventArgs: eventArgs
                };

                if (this.activeAppId === undefined) {
                    // No existing app - activating request
                    this.activateApp();
                } else {
                    // Requesting existing app to unload
                    this.fireEvent(this.activeAppId + "_unload");
                }
            } else {
                // Application switch NOT required.  firing event
                this.fireEvent(appId + "_" + eventName, eventArgs);
            }
        }
    },

    onAppUnloaded: function (appId, abort) {
        if (this.activeAppId === appId) {
            if (abort === true) {
                Ext.util.Logger.info('Shutdown asynchronously aborted by ' + appId);
                this.abortShutdown();
            } else if (this.shutdownInProgress) {
                this.processShutdownQueue();
            } else if (this.activationRequest) {
                // close the thumbbar, just incase it was open in the last app, new app can open it when it sends configuration data
                this.fireEvent("thumbbar_hide");
                this.activateApp();
            } else {
                this.activeAppId = undefined;
            }
        }
    },

    activateApp: function () {
        try {
            var app = ABP.util.PluginManager.getPluginInstance(this.activationRequest.appId);
            if (!app) {
                ABP.util.Logger.logError("Unable to find plugin: " + this.activationRequest.appId);
                return;
            }
            var cmp = app.getAppComponent();
            this.activeAppId = this.activationRequest.appId;
            this.fireEvent("featureCanvas_showFeature", cmp, 'main_appLoaded', this.activationRequest.appId);
        } catch (err) {
            ABP.util.Logger.logError("Error loading plugin: " + err.message);
        }
    },

    onAppLoaded: function (appId) {
        var ar = this.activationRequest;
        if (ar) {
            if (ar.appId === appId) {
                if (ar.eventName) {
                    this.fireEvent(ar.appId + "_" + ar.eventName, ar.eventArgs);
                }
            }
        }
    },

    showLoading: function (stringKey, sizeCls) {
        var me = this;
        var mess = stringKey ? me.getViewModel().get('i18n.' + stringKey) || stringKey : '';
        mess = Ext.String.htmlEncode(mess);
        var obj;
        if (ABP.util.Common.getModern()) {
            obj = {
                xtype: 'apteanloadingscreen',
                message: mess,
                messageCls: 'sm-loading'
            };
            me.getView().mask(obj);
        } else {
            obj = me.getLoadingHtml(mess, sizeCls);
            me.getView().mask(obj, 'loading-msg');
        }

    },

    getLoadingHtml: function (mess, sizeCls) {
        var msg;
        msg = '<div class="abp-loadmask loading-cont ' + (sizeCls || 'fullSize') + '"';
        msg += (mess !== undefined ? 'role="alert" aria-label="' + mess + '">' : '>');
        msg += '<div class="bars"> <div class="rect1"></div> <div class="rect2"></div> <div class="rect3"></div> <div class="rect4"></div> <div class="rect5"></div></div>';
        if (mess !== undefined) {
            msg += '<div class="sm-loading" width="215" height="37">' + mess + '</div>';
        }
        return msg;
    },

    hideLoading: function () {
        if (ABP.util.Common.getModern()) {
            this.getView().setMasked(false);
        } else {
            this.getView().unmask();
        }
    },

    /*  Signout process:
     * 0)   request to sign out received by destroySession()
     * 1)   destroySession serially asks all AppControllers if it's okay to shutdown, by calling requestShutdown()
     * 1.a) the shutdown is aborted if any AppController returns ABORT, and is expected to provide feedback to the user itself.
     * 1.b) if an AppController does not implement requestShutdown(), PROCEED is assumed
     * 1.c) All DEFER responses are added to a shutdown notify queue
     * 2)   Container asks active application to upload
     * 3)   Active app cleans up an returns a main_appUnloaded event
     * 4)   onAppUnloaded sees shutdownInProgress==true and calls shutdownAllApps()
     * 5)   shutdownAllApps fires an event to the first AppController that returned DEFER
     * 6)   the AppController fires a main_appShutdown event, containing either PROCEED or ABORT
     * 7)   onAppShutdown fired an event to the next AppController that returned DEFER
     * 7.a) or aborts if ABORT was returned
     * 8)   once the list is empty, commitDestroySession is called
     * 9)   the logout web service operation is called
     * 10)  upon respond to logout, logoutComplete reloads the UI
     */

    abortShutdown: function () {
        this.shutdownInProgress = false;
        this.deferredShutdownRequests = [];
        ABP.util.SessionStorage.remove("SignoutReason");
        this.hideLoading();
    },

    destroySession: function (reason, force) {
        var pluginsToShutdown, // [{ plugin: <object>, pluginName: <string> }]
            i,
            pluginToShutdown,
            shutdownResponse;
        if (Ext.isArray(reason) && reason.length > 1) { //event sent reason and force together as array
            force = reason[1];
            reason = reason[0];
        } else if (Ext.isBoolean(reason)) {
            force = reason;
            reason = "";
        }
        if (force !== true && this.shutdownInProgress) {
            ABP.util.Logger.logInfo("Shutdown already in progress");
            return;
        }
        this.showLoading('signout_message');
        if (reason) {
            ABP.util.SessionStorage.set("SignoutReason", reason);
            if (reason === 'user init' || reason === ABP.util.Common.geti18nString('session_timeout')) {
                this.getViewModel().set('signout', true);
            }
        }

        if (force === true) {
            // if the shutdown is forced, do not give applications an opportunity to abort
            this.getViewModel().set('signout', true); // so popup doesn't interrupt signout
            this.commitDestroySession();
            return;
        }

        this.shutdownInProgress = true;
        this.deferredShutdownRequests = [];

        // Ask each plugin (that cares) if it's okay to shut down.
        var pluginsToShutdown = ABP.util.PluginManager.getActivePluginsImplementingFunction('requestShutdown');
        var Logger = Ext.toolkit === 'classic' ? Ext.util.Logger : Ext.Logger;
        for (i = 0; i < pluginsToShutdown.length; i++) {
            pluginToShutdown = pluginsToShutdown[i];
            shutdownResponse = 'PROCEED';
            try {
                shutdownResponse = pluginToShutdown.plugin.requestShutdown();
            } catch (e) {
                Logger.warn('Exception while calling requestShutdown on pluginId "' + pluginToShutdown.pluginId + '"');
                Logger.logException(e);
            }

            if (shutdownResponse === 'ABORT') {
                // One of the plugins requested to abort the shutdown, so abort.
                // The plugin is responsible for informing the user.
                Logger.info('Shutdown synchronously aborted by ' + pluginToShutdown.pluginId);
                this.abortShutdown();
                return;
            }
            if (shutdownResponse === 'DEFER') {
                this.deferredShutdownRequests.push({
                    plugin: pluginToShutdown.plugin,
                    pluginId: pluginToShutdown.pluginId,
                    status: 'queued'
                });
            }
            // any other return value is taken as PROCEED
        }

        // We now have tentative approval to proceed with shutdown from all apps
        // deactiveate the currently active app

        if (this.activeAppId !== undefined) {
            this.fireEvent(this.activeAppId + "_unload");
        } else {
            this.processShutdownQueue();
        }
    },

    onAppShutdown: function (appId, abort) {
        var req;
        if (this.deferredShutdownRequests && this.deferredShutdownRequests.length > 0) {
            req = this.deferredShutdownRequests.shift();
            if (req.pluginId === appId) {
                if (abort === true) {
                    this.abortShutdown();
                } else {
                    if (req.status !== 'pending') {
                        ABP.util.Logger.logWarn('Unexpected state "' + req.status + '" while processing shutdown response from "' + appId + '"');
                    }
                    this.processShutdownQueue();
                }
            } else {
                ABP.util.Logger.logWarn('Unexpected main_appShutdown recevied from "' + appId + '": expected shutdown response from "' + req.pluginId + '"');
            }
        } else {
            ABP.util.Logger.logWarn('Unexpected main_appShutdown recevied from "' + appId + '": no deferred shutdown requests.');
        }
    },

    processShutdownQueue: function () {
        if (!this.deferredShutdownRequests || (this.deferredShutdownRequests.length <= 0)) {
            this.commitDestroySession();
        } else {
            this.deferredShutdownRequests[0].status = 'pending';
            this.fireEvent(this.deferredShutdownRequests[0].pluginId + "_shutdown");
        }
    },

    commitDestroySession: function () {
        var me = this;
        me.rememberValue({
            value: "",
            toLocalStorageKey: 'SavedPassword',
            ifLocalStorageEnabledBy: 'bootstrapConf.settings.rememberPassword' // Was canKeepMeSignedIn.
        });
        ABP.util.SessionStorage.remove("AfterLoginRedirect");
        ABP.util.SessionStorage.remove('sessionToken');
        ABP.util.SessionStorage.remove('SavedUsername');
        ABP.util.LocalStorage.removeForLoggedInUser(ABP.util.Config.getEnvironment(), ABP.util.Config.getUsername());
        ABP.util.LocalStorage.remove('SavedUsername');
        ABP.util.LocalStorage.remove('sessionToken');
        ABP.util.LocalStorage.remove('TenantIdentifier');
        ABP.util.LocalStorage.remove('keepSignedIn');
        ABP.util.LocalStorage.set("forceLogin", "true");
        me.logout();
    },

    logout: function () {
        window.localStorage.removeItem('URL');
        var me = this;
        var url = ABP.util.LocalStorage.get('ServerUrl') + '/abp/logout';

        ABP.util.Ajax.request({
            url: url,
            method: 'POST',
            withCredentials: true,
            cors: (Ext.browser.name !== 'IE' || Ext.browser.version.major > 9.0),
            timeout: 4000,
            success: function (response) {
                var logoutResponse,
                    logoutUrl;

                ABP.util.Config.setLoggedIn(false);
                // Parse out any override for the logoff URL and pass it along to logoutComplete.
                if (response && response.responseText) {
                    // TOOD: Use ABP.common.Common.parseJsonResponse. 
                    // We need to migrate ABPForms.common.Common.parseJsonResponse from ABPForms to ABP namespace.
                    logoutResponse = Ext.JSON.decode(response.responseText);
                    if (logoutResponse && !Ext.isEmpty(logoutResponse.redirectUrl)) {
                        logoutUrl = logoutResponse.redirectUrl;
                    }
                }
                me.logoutComplete(logoutUrl);
            },
            failure: function (err) {
                me.logoutComplete();
            }
        });
    },

    /**
     * Completes the logout process by directing the browser back to the base URL (minus the hash) or to the provided logoutUrl.
     * @param {String} [logoutUrl] (optional) The window location will be set to this URL instead of the base URL.
     */
    logoutComplete: function (logoutUrl) {
        var url;
        if (ABP.util.Msal.enabled) {
            ABP.util.Msal.signOut();
            return;
        }
        if (!Ext.isEmpty(logoutUrl)) {
            url = logoutUrl;
        } else {
            url = window.location.href;
            var hashStart = url.lastIndexOf("#");
            if (hashStart !== -1) {
                url = url.substr(0, hashStart);
            }
        }
        window.location = url;
    },

    forceLogin: function () {
        var me = this;
        var vm = me.getViewModel();
        var forcedJson = vm.get('forcedJson');
        forcedJson.forceLogin = true;
        me.authenticate(forcedJson);
    },

    addDefaultLanguageStrings: function (strings) {
        this.getViewModel().i18nSetDefaults(strings);

        this.fireEvent('afteraddlanguagestrings');
    },

    updateLanguageStrings: function (strings) {
        this.getViewModel().i18nSet(strings);
    },

    switchLanguage: function (newLang) {
        var me = this;
        var vm = me.getViewModel();
        if (newLang.languages) {
            newLang = newLang.languages;
        }
        var urlPartTwo = '/abp/configuration?locale=' + newLang + '&deviceType=' + Ext.os.deviceType;
        ABP.util.Ajax.request({
            url: ABP.util.Ajax.getServerUrl() + urlPartTwo,
            withCredentials: true,
            cors: (Ext.browser.name !== 'IE' || Ext.browser.version.major > 9.0),
            method: 'GET',
            success: function (response) {
                var resp = Ext.JSON.decode(response.responseText);
                if (resp.resultCode === 0) {
                    me.getViewModel().set('conf.languageResources', resp.configuration.languageResources);
                    me.getViewModel().set('selected.language', newLang);
                    ABP.util.Config.setLanguage(newLang);
                    me.getViewModel().i18nSet(resp.configuration.languageResources);
                    if (resp.configuration.formatting) {
                        me.processFormatting(resp.configuration.formatting);
                    }
                    me.processSenchaStrings();

                    me.rememberValue({
                        value: newLang,
                        toLocalStorageKey: 'SavedLanguage',
                        ifLocalStorageEnabledBy: 'bootstrapConf.settings.rememberLanguage',
                        toLoggedInUserLocalStorageKey: true
                    });
                    me.fireEvent('afterSwitchLanguage');
                }
            },
            failure: function (err) {
                if (err && err.responseText !== "") {
                    var resText = Ext.JSON.decode(err.responseText);
                    var mess = resText.errorMessage;
                    if (mess) {
                        ABP.view.base.popUp.PopUp.showError(mess, vm.get('i18n.error_ok_btn'));
                    } else {
                        ABP.view.base.popUp.PopUp.showError(vm.get('i18n.login_error_languageFailure'), vm.get('i18n.error_ok_btn'));
                    }
                } else {
                    ABP.view.base.popUp.PopUp.showError(vm.get('i18n.login_error_languageFailure'), vm.get('i18n.error_ok_btn'));
                }
            }
        });
    },

    checkPrebootVsLocalStorage: function (prebootFields) {
        var me = this;
        var local = me.getExtraSettingsFieldsFromString();
        var i = 0;
        var j = 0;
        var foundAll = true;
        var foundCurrent = false;
        for (i; i < prebootFields.length; ++i) {
            foundCurrent = false;
            for (j = 0; j < local.length; ++j) {
                if (prebootFields[i].fieldId === local[j].fieldId) {
                    if (local[j].val !== "") {
                        foundCurrent = true;
                        break;
                    }
                }
            }
            if (!foundCurrent) {
                foundAll = false;
                ABP.util.LocalStorage.remove('settingsextrafields');
                break;
            }
        }
        return foundAll;
    },

    checkEnvLangAvailability: function () {
        var me = this;
        var env = ABP.util.Config.getBootstrapConfig().availableEnvironments;
        var ret = false;
        if (env) {
            if (!Ext.isEmpty(env)) {
                if (env.length > 1) {
                    ret = true;
                } else {
                    if (!Ext.isEmpty(env[0].languages)) {
                        if (env[0].languages.length > 1) {
                            ret = true;
                        }
                    }
                    me.getViewModel().set('selected.environment', env[0].id);
                }
            }
        }
        return ret;
    },

    extraFieldsProcessForLoginBypass: function () {
        var me = this;
        var vm = me.getViewModel();
        var local = ABP.util.LocalStorage.get('loginextrafields');
        var extras = ABP.util.Config.getBootstrapConfig().settings.extraLoginFields;
        var ret = true;
        var extraItter = 0;
        var localItter = 0;
        var configExtras = [];
        var found = false;
        if (extras && extras.length > 0) {
            if (local) {
                local = JSON.parse(local);
                for (extraItter = 0; extraItter < extras.length; ++extraItter) {
                    found = false;
                    for (localItter = 0; localItter < local.length; ++localItter) {
                        if (extras[extraItter].fieldId === local[localItter].fieldId) {
                            configExtras.push({
                                fieldId: local[localItter].fieldId,
                                val: local[localItter].val
                            });
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        if (extras[extraItter].required) {
                            if (extras[extraItter].required === true || extras[extraItter].required === "true") {
                                ret = false;
                                break;
                            }
                        }
                    }
                }
                if (!Ext.isEmpty(configExtras) && ret) {
                    vm.set('configurationExtraInfo', configExtras);
                }
            } else {
                ret = false;
            }
        } else {
            ret = true;
        }
        return ret;
    },

    saveExtras: function () {
        this.rememberValue({
            value: this.getExtraLoginFieldsAsString(),
            toLocalStorageKey: 'loginextrafields',
            ifLocalStorageEnabledBy: 'bootstrapConf.settings.rememberExtraLoginFields'
        });
    },

    routingWarningCallback: function (answer) {
        if (answer) {
            this.getViewModel().set('signout', true);
            this.destroySession();
        } else {
            window.history.forward();
        }
    },

    switchTheme: function (newTheme) {
        var body = Ext.getBody();
        var themeList = Ext.theme.subThemeList;
        var vm = this.getViewModel();
        if (newTheme.themes) {
            newTheme = newTheme.themes;
        }
        for (var theme in themeList) {
            body.removeCls(themeList[theme]);
        }
        vm.set('currentTheme', newTheme);

        body.addCls(newTheme);
        if (ABP.util.Config._sessionConfig.settings.persistSelectedTheme) {
            ABP.util.LocalStorage.setForLoggedInUser('ChosenTheme', newTheme);
        }
    },

    /**
     * Private functions.
     */
    privates: {
        /**
         * @private
         */
        initKeyboardBindings: function () {
            // Only need keyboard bindings for the classic build
            if (!ABP.util.Common.getClassic()) {
                return;
            }

            //ABP.util.Config.getSessionConfig().settings.enableSearch

            this.keyboardNavigator = new ABP.util.keyboard.Shortcuts({
                controller: this
            });
        },

        /**
         * @private
         *
         * Process the configured shortcut key bindings, ensure they are hooked up to the
         * main listener.
         */
        processShortcuts: function (shortcuts) {
            if (this.keyboardNavigator) {
                this.keyboardNavigator.addShortcuts(shortcuts);
            }
        },

        /**
         * @private
         * Loads the bootstrap configuration once it is determined.
         * Bootstrap will either come from the Ajax request to abp/bootstrap
         * or it will have been cached in local storage for Offline mode.
         */
        loadBootstrapConfig: function (configuration) {
            var me = this;
            ABP.util.Config.processBootstrapConfig(configuration);
            var vm = me.getView().getViewModel();
            vm.set('bootstrapConf', configuration);
            if (configuration.languageResources && configuration.languageResources.length > 0) {
                me.getViewModel().i18nSet(configuration.languageResources);
            }

            vm.set('bootstrapped', true);
            var envs = vm.getStore('main_environmentStore');
            var aEnvs = configuration.availableEnvironments;
            if (envs) {
                if (aEnvs instanceof Array) { // move this logic to global overide for store.loadData?
                    envs.getSource().loadData(aEnvs);
                } else {
                    envs.getSource().loadData([aEnvs]);
                }
            }
            // Set authentication type.
            if (configuration.settings.authenticationType === 'integrated' ||
                configuration.settings.authenticationType === 'cookie' ||
                configuration.settings.authenticationType === 'oauth') {
                ABP.util.Config.setAuthType(configuration.settings.authenticationType)
            } else {
                // Log this as a warning and continue without setting authenticationType so this legacy case can be processed later.
                ABP.util.Logger.logWarn("Unrecognized authenticationType: \"" + configuration.authenticationType + "\" defaulting to \"cookie\".");
            }

            // Process any possible headlines in the bootstrap.
            if (configuration.headlines) {
                me.processHeadlines(configuration.headlines, true);
            }
            // trigger the milestone event 
            me.fireEvent('container_bootstrap_success');

            // Do not continue to the login page if msal is processing b2c auth.
            if (ABP.util.Msal && ABP.util.Msal.enabled) {
                console.log('TA/DEBUG - ABPMainController - loadBootstrapConfig - me.tokenAuthenticate');
                me.tokenAuthenticate();
                return;
            }
            // Since the list of known users that can be selected depends on which environments are valid,
            // changing or loading the environment store requires the selectable users to be re-evaluated.
            // This is done by the selectusercontroller view controller listening to the environment store, so a direct
            // call is not needed here.
            if (ABP.util.Common.getModern()) {
                if (ABP.util.Config.isDesktop() && configuration && !configuration.supportsDesktop && configuration.desktopUrl && configuration.desktopUrl.trim() !== '') {
                    window.location = configuration.desktopUrl;
                } else if (ABP.util.Config.isDesktop() && configuration && !configuration.supportsDesktop) {
                    me.redirectTo("nosupport", true);
                } else {
                    me.authCheck();
                }
            } else {
                me.authCheck();
            }
        },

        /**
         * @private
         * Sets Offline mode.
         */
        promptOfflineMode: function (force) {
            var me = this;
            var vm = me.getView().getViewModel();

            // Force - go offline with no prompt.
            if (force) {
                me.setOfflineMode(me, vm);
                return;
            }

            ABP.view.base.popUp.PopUp.showOkCancel('prompt_gooffline_text', 'prompt_gooffline_title', function (result) {
                if (result) {
                    me.setOfflineMode(me, vm);
                }
            });
        },

        /**
         * @private
         * Prompts to go online.
         */
        promptOnlineMode: function (force) {
            var me = this;
            var vm = me.getView().getViewModel();

            // Check connectivity first. If we cannot ping the server don't bother trying.
            ABP.util.Ajax.request({
                url: ABP.util.Ajax.getServerUrl() + '/abp/success',
                method: 'GET',
                withCredentials: true,
                cors: (Ext.browser.name !== 'IE' || Ext.browser.version.major > 9.0),
                timeout: 4000,
                success: function (response) {
                    // Force - go online with no prompt.
                    if (force) {
                        me.setOnlineMode(me, vm);
                        return;
                    }
                    ABP.view.base.popUp.PopUp.showOkCancel('prompt_goonline_text', 'prompt_goonline_title', function (result) {
                        if (result) {
                            me.setOnlineMode(me, vm);
                        } else {
                            if (me.offlineCheckTask) {
                                me.offlineCheckTask.stop();
                            }
                        }
                    });
                },
                failure: function (err) {
                    // Cannot go to online mode - no connection to server.
                    ABP.view.base.popUp.PopUp.showPopup('offline_noconnection', 'error_ok_btn');
                }
            });
        },

        /**
         * Handler for connection state changing offline/online.
         * Fires an event for products to potentially consume "connectionChange".
         * Shows a headline message if offline.
         * NOTE: Being online does not guarentee the client can reach back-end services. Only that the browser is connected to the internet.
         */
        handleConnectionStateChange: function (event) {
            var me = this;
            var vm = me.getViewModel();
            var hideHeadline = vm.get('bootstrapConf.hideOfflineHeadline') || false;
            if (event.type === 'offline') {
                // isOffline can certainly be set if there is no internet connection.
                vm.set('isOffline', true);
                // If the user is not logged in, engage offline mode.
                if (ABP.util.Config.getLoggedIn() === false) {
                    vm.set('offlineMode', true);
                }
                me.fireEvent('connectionChange', 'offline');
                if (!hideHeadline) {
                    // Show headline to indicate the client is offline.
                    me.fireEvent('container_headlines_show', [{
                        messageKey: 'offline_headline_message',
                        uniqueId: 'abp_offline_headline',
                        priority: 0,
                        single: true
                    }]);
                }
            } else if (event.type === 'online') {
                vm.set('isOffline', false);
                // If the user is not logged in, engage offline mode.
                if (ABP.util.Config.getLoggedIn() === false) {
                    vm.set('offlineMode', false);
                }
                me.fireEvent('connectionChange', 'online');
                // Try to hide the offline headline if it is configured to show.
                if (!hideHeadline) {
                    me.fireEvent('container_headlines_hide', 'abp_offline_headline');
                }
            }
        },

        /**
         * @private
         * Sets online mode.
         */
        setOnlineMode: function (me, vm) {
            // Pause online check task.
            if (me.offlineCheckTask) {
                me.offlineCheckTask.stop();
            }
            // Reauthenticate the user. Go online if successful.
            var passwordPrompt = Ext.create('ABP.view.session.offline.PasswordPrompt', {
                viewModel: {
                    data: {
                        passwordLabel: vm.get('i18n.offline_password_prompt'),
                        cancelBtnlabel: vm.get('i18n.button_cancel'),
                        okBtnLabel: vm.get('i18n.button_OK')
                    }
                }
            });
            passwordPrompt.show();
        },

        setOfflineMode: function (me, vm) {
            vm.set('offlineMode', true);
            // Fire event to notify any interested parties that offline mode is being engaged.
            me.fireEvent('container_offline_mode');
            // Start a task to periodically check if the server is accessible.
            var taskRunner = new Ext.util.TaskRunner();
            me.offlineCheckTask = taskRunner.newTask({
                run: me.offlineCheck,
                interval: 60 * 1000,
                scope: me
            });
            me.offlineCheckTask.start();

            // Load the offline configuration if the client is offline.
            if (ABP.util.LocalStorage.getForLoggedInUser('OfflineConfiguration')) {
                me.loadSessionConfig(Ext.JSON.decode(ABP.util.LocalStorage.getForLoggedInUser('OfflineConfiguration')));
                return;
            }
        },

        /**
         * @private
         * Handler for taskrunner - periodically checks if the server is available. If so we can switch back to online mode.
         */
        offlineCheck: function () {
            var me = this;

            if (ABP.util.Config.getLoggedIn()) {
                ABP.util.Ajax.request({
                    url: ABP.util.Ajax.getServerUrl() + '/abp/success',
                    method: 'GET',
                    withCredentials: true,
                    cors: (Ext.browser.name !== 'IE' || Ext.browser.version.major > 9.0),
                    timeout: 4000,
                    success: function (response) {
                        // Connection established, prompt user to go online.
                        me.fireEvent('container_go_online');
                    },
                    failure: function (err) {
                        // Still in offline mode.
                    }
                });
            }
        },

        /**
         * @private
         * Loads the session configuration. Provided by either abp/configuration
         * or taken from local storage for Offline mode.
         */
        loadSessionConfig: function (config) {
            var me = this;
            ABP.util.Config.processSessionConfig(config);
            var pkgItems = ABP.util.Config.getSessionConfig().packages;
            var promises = [];

            // trigger milestone event
            me.fireEvent('container_config_processed');

            // Update the view model data from the config.
            var vm = me.getViewModel();
            me.verifyProfileImage(config.settings.userConfig.photo);

            //Loading the Custom Packages mentioned in the Package array of the config file
            if (pkgItems !== undefined && pkgItems.length !== 0) {
                for (var i = 0; i < pkgItems.length; i++) {
                    var pkgUrl = pkgItems[i].url;
                    var pkgID = pkgItems[i].id;
                    if (pkgID == "" || pkgUrl == "")
                        break;

                    ABP.util.Config.setPackageURL(pkgUrl);
                    var PkgEntry = Ext.util.JSON.decode('{"css":' + true + ', "namespace": "' + pkgID + '" }');
                    Ext.manifest.packages[pkgID] = PkgEntry;
                    if (!Ext.Package.isLoaded(pkgID)) {
                        promises.push(Ext.Package.load(pkgID));
                    }
                }
                ABP.util.Config.setPackageURL(null);
            }

            Ext.Promise.all(promises).then(function () {
                me.setupConfiguration(config);
            });
        },

        /**
         * @private
         * Consolidates Offline Authentication logic into one function.
         */
        offlineAuthenticate: function (jsonData, keepSignedIn) {
            var me = this,
                vm = me.getView().getViewModel(),
                offlineAuthType = vm.get('bootstrapConf.offlineAuthenticationType');

            switch (offlineAuthType) {
                // None. As long as the user has a user entry in local storage they can log in offline.
                case 0:
                    if (Ext.isEmpty(ABP.util.LocalStorage.getForUser(jsonData.environment, jsonData.logonId, 'OfflineConfiguration'))) {
                        ABP.view.base.popUp.PopUp.showPopup('login_error_authFailure', 'error_ok_btn');
                        me.fireEvent('main_hideLoading');
                        return;
                    }
                    break;

                // Offline password.
                case 1:
                    var offlinePasswordHash = ABP.util.LocalStorage.getForUser(jsonData.environment, jsonData.logonId, 'OfflinePassword');
                    // Additionally test if this user has an entry. This gives too much info otherwise.
                    if (Ext.isEmpty(offlinePasswordHash)) {
                        ABP.view.base.popUp.PopUp.showPopup('offline_login_error_noOfflinePassword', 'error_ok_btn');
                        me.fireEvent('main_hideLoading');
                        return;
                    }
                    var salt = ABP.util.Sha256.generateSaltForUser(jsonData.logonId, jsonData.environment);
                    var enteredPasswordHash = ABP.util.Sha256.sha256(jsonData.password, salt);
                    if (enteredPasswordHash !== offlinePasswordHash) {
                        ABP.view.base.popUp.PopUp.showPopup('login_error_authFailure', 'error_ok_btn');
                        me.fireEvent('main_hideLoading');
                        return;
                    }
                    break;

                // Password hash is saved, proceed to normal login form.
                case 2:
                    var savedPasswordHash = ABP.util.LocalStorage.getForUser(jsonData.environment, jsonData.logonId, 'SavedPasswordHash');
                    var salt = ABP.util.Sha256.generateSaltForUser(jsonData.logonId, jsonData.environment);
                    var enteredPasswordHash = ABP.util.Sha256.sha256(jsonData.password, salt);
                    if (enteredPasswordHash !== savedPasswordHash) {
                        ABP.view.base.popUp.PopUp.showPopup('login_error_authFailure', 'error_ok_btn');
                        me.fireEvent('main_hideLoading');
                        return;
                    }
                    break;
            }
            vm.set('loginTime', Date.now());
            ABP.util.Config.setUsername(jsonData.logonId);
            ABP.util.Config.setEnvironment(jsonData.environment);
            me.fireEvent('main_doConfiguration', jsonData && jsonData.locale ? jsonData.locale : vm.get('selected.language'));
            me.fireEvent('main_hideLoading');
            return;
        },

        pendingChangesToggle: function (pendingChanges) {
            var me = this,
                vm = me.getViewModel();

            vm.set('pendingChanges', pendingChanges);
        },

        processFormatting: function (formatting) {
            if (formatting.monthNames) {
                Ext.Date.monthNames = formatting.monthNames;
            }
            if (formatting.dayNames) {
                Ext.Date.dayNames = formatting.dayNames;
            }
            if (formatting.decimalSeparator) {

            }
            if (formatting.thousandSeparator) {

            }
            /*
            currencySign: '$',
            dateFormat: 'm-d-Y'
            */
        },

        processSenchaStrings: function () {
            var me = this;
            var vm = me.getViewModel();
            var i18n = vm.getData().i18n;
            // handle sencha singletons
            // Message box buttons
            Ext.Msg.buttonText = {
                ok: i18n.s_window_messageBox_buttonText_ok,
                cancel: i18n.s_window_messageBox_buttonText_cancel,
                yes: i18n.s_window_messageBox_buttonText_yes,
                no: i18n.s_window_messageBox_buttonText_no
            }
            //VTypes - classic only
            if (ABP.util.Common.getClassic()) {
                Ext.form.field.VTypes.emailText = i18n.s_field_vTypes_emailText;
                Ext.form.field.VTypes.urlText = i18n.s_field_vTypes_urlText;
                Ext.form.field.VTypes.alphaText = i18n.s_field_vTypes_alphaText;
                Ext.form.field.VTypes.alphanumText = i18n.s_field_vTypes_alphanumText;
            }
        },

        onUpdateUserProfile: function (profile) {
            this.verifyProfileImage(profile.image);
        },

        verifyProfileImage: function (url) {
            var vm = this.getViewModel();

            if (!url) {
                vm.set('profilePhoto', null);
                return;
            }

            var img = new Image();
            img.onerror = function () {
                vm.set('profilePhoto', null);
            }
            img.onload = function () {
                vm.set('profilePhoto', url);
                ABP.util.LocalStorage.setForLoggedInUser('Photo', url);
            };
            img.src = url;
        }
    },

    activeAppFocus: function () {
        var activeApp = this.activeAppId;
        if (activeApp) {
            this.fireAppEvent(activeApp, 'setFocus', null, false);
        }
    },

    /**
     * Loads the application settings store
     */
    loadApplicationServices: function () {
        var me = this;
        var appSettingsStore = Ext.data.StoreManager.lookup('ABPApplicationServicesStore');
        if (appSettingsStore) {
            // Load the config from the server. If it fails (there might not be the need for a config) then continue to bootstrap.
            appSettingsStore.load({
                scope: me,
                callback: function (records, operation, success) {
                    if (!success) {
                        ABPLogger.logDebug('Failed to load application settings store.');
                    } else {
                        ABPLogger.logDebug('Loaded application settings store with ' + records.length + ' services.')
                    }
                }
            });
        }
    },

    /**
     * Handles after login logic - currently requesting services token if they are required.
     * @private
     */
    afterLoginSuccess: function () {
        var me = this;
        // Ensure the services store has loaded before requesting a token. 
        // It is necessary to have these service names available to get the correct token audience.
        var servicesStore = Ext.data.StoreManager.lookup('ABPApplicationServicesStore');
        if (servicesStore.isLoading()) {
            servicesStore.on('load', this.afterLoginSuccess, me);
        } else {
            servicesStore.un('load', this.afterLoginSuccess, me);
            // Do not request a token if there are no services defined.
            if (servicesStore.getCount() > 0) {
                // Register the services found in the service store.
                servicesStore.each(function (service) {
                    ABPServiceManager.registerService(service.getData());
                });
            }
        }
    },

    /**
     * Reconstructs the "jsonData" used in the login request.
     * This version is built by values saved to localStorage.
     * Do not rely on all of these properties having a value. 
     * Password is not returned nor should it be saved. Please don't save any passwords.
     * In fact is there a password in a ViewModel? Go delete it.
     * @private
     */
    reconstructUserSessionObject: function () {
        return {
            logonId: ABP.util.LocalStorage.get('SavedUsername'),
            environment: ABP.util.LocalStorage.get('SavedEnvironment'),
            locale: ABP.util.LocalStorage.get('SavedLanguage'),
            forceLogin: false
        }
    }
});