/**
 * Wrapper for Microsoft Authentication Library for JavaScript (MSAL.js)
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-core
 */
Ext.define('ABP.util.Msal', {
    singleton: true,

    instance: null,
    config: null,
    enabled: false,
    authStore: null,
    requiresLogin: false,
    redirectUri: null,
    interactionRedirectUri: null,

    config: {
        stopAtLoginPage: false
    },

    constructor: function () {
        try {
            if (!window["Msal"]) {
                ABPLogger.logDebug('Microsoft Authentication Library was not present.');
                return;
            }
        } catch (ex) {
            ABPLogger.logDebug('Microsoft Authentication Library was not present.');
        }
        var authStore = this.getAuthStore();
        authStore.load();
        authStore.on('load', this.authStoreLoaded, this);
    },

    signIn: function () {
        var loginRequest = this.getLoginRequest(true);
        this.instance.loginRedirect(loginRequest);
    },

    signOut: function () {
        if (!this.enabled) {
            return; //Enables the user management button to be created independent of authentication existing.
        }
        this.instance.logout();
    },

    getToken: function () {
        var me = this;
        var msalInstance = this.instance;
        if (!msalInstance.getAccount()) {
            // User is not logged in, we cannot acquire a token silently.
            me.signIn();
            return;
        }
        var tokenRequest = this.getLoginRequest();
        if (!ABPAuthManager.getToken()) {
            me.requiresLogin = true;
        }
        return msalInstance
            .acquireTokenSilent(tokenRequest)
            .then(ABP.util.Msal.handleTokenResponse)
            .catch(ABP.util.Msal.handleTokenFailure);
    },

    formatUri: function (uri) {
        if (uri.indexOf(('index.html')) > -1) {
            uri = uri.split('index.html')[0];
        }
        if (uri.slice(-1) !== '/') {
            uri += '/';
        }
        return uri;
    },

    handleTokenResponse: function (response) {
        var me = ABP.util.Msal;
        var token;
        if (!Ext.isEmpty(response.accessToken)) {
            token = response.accessToken;
        }
        ABPAuthManager.authenticationSuccess(token);
        if (me.requiresLogin) {
            var app = Ext.getApplication();
            if (app) {
                var mvm = app.getMainView().getViewModel();
                if (mvm.get('bootstrapped')) {
                    console.log('TA/DEBUG - MSAL - firing main_tokenAuthenticate');
                    Ext.fireEvent('main_tokenAuthenticate');
                }
            }
        }
    },

    handleTokenFailure: function (error) {
        var me = ABP.util.Msal;
        if (error.message && error.message.startsWith('AADB2C90205')) {
            // TODO: show a relevant error message to the user.
            ABPLogger.logWarn('Failed token acquisition', error);
        } else {
            if (me.requiresInteraction(error.errorCode)) {
                return ABP.util.Msal.signIn();
            } else {
                me.instance.acquireTokenRedirect(me.getLoginRequest());
            }
        }
    },

    getAuthStore: function () {
        if (this.authStore) {
            return this.authStore;
        }
        var authStore = Ext.data.StoreManager.lookup('ApplicationAuthenticationStore');
        if (!authStore) {
            authStore = Ext.create('ABP.store.ApplicationAuthenticationStore');
        }
        this.authStore = authStore;
        return authStore;
    },

    authStoreLoaded: function (store) {
        var me = ABP.util.Msal;
        store.un('load', this.authStoreLoaded, this);
        var config = me.getMsalConfig(store);
        if (config) {
            me.enabled = true;
            me.instance = new Msal.UserAgentApplication(config);
            me.instance.handleRedirectCallback(me.redirectCallback); // Does this need to be a global fn?        
            if (!me.authenticationSuccess) {
                me.getToken();
            }
        }
    },

    getLoginRequest: function (interactive) {
        var me = ABP.util.Msal;
        var config = me.config;
        if (config) {
            var requestConfig = {
                scopes: config.b2cScopes,
                redirectUri: me.getRedirectUri(interactive)
            };
            if (config.extraQueryParameters) {
                requestConfig.extraQueryParameters = config.extraQueryParameters;
            } else if (config.domainHint) {
                requestConfig.extraQueryParameters = { domain_hint: config.domainHint };
            }
            // TODO: Merge any other properties.
            return requestConfig;
        }
    },

    getRedirectUri: function (interactive) {
        var me = ABP.util.Msal;
        if (interactive) {
            if (!Ext.isEmpty(me.interactionRedirectUri)) {
                return me.interactionRedirectUri;
            }
        }
        if (!Ext.isEmpty(me.redirectUri)) {
            return me.redirectUri;
        }
        var redirectUri = me.instance.getRedirectUri();
        me.interactionRedirectUri = redirectUri;
        if (redirectUri.indexOf(('index.html')) > -1) {
            redirectUri = redirectUri.split('index.html')[0];
        }
        if (redirectUri.slice(-1) !== '/') {
            redirectUri += '/';
        }
        me.redirectUri = redirectUri + 'auth.html';
        // Interactive requests should not have auth.html as the redirect URL, only silent (iframe) requests.
        return (interactive === true) ? me.interactionRedirectUri : me.redirectUri;
    },

    getMsalConfig: function (store) {
        var me = this;
        var msalConfig;
        var rec = store.getAt(0);
        if (rec) {
            var config = rec.getData();
            me.config = config;
            msalConfig = {
                auth: {
                    clientId: config.clientId,
                    authority: config.authority,
                    validateAuthority: false
                },
                cache: {
                    cacheLocation: config.cacheLocation || "localStorage",
                    storeAuthStateInCookie: config.storeAuthStateInCookie || true
                }
            };
            // Apply the post logout redirect if it has been configured - if not user will wind up at IdP after logout.
            if (config.postLogoutRedirectUri) {
                if (Ext.isString(config.postLogoutRedirectUri)) {
                    msalConfig.auth.postLogoutRedirectUri = config.postLogoutRedirectUri;
                }
                if (Ext.isBoolean(config.postLogoutRedirectUri)) {
                    msalConfig.auth.postLogoutRedirectUri = me.formatUri(window.location.href) + 'signout.html';
                }
            }
        }
        return msalConfig;
    },

    redirectCallback: function (error, response) {
        var me = ABP.util.Msal;
        // In MSAL, you can get access tokens for the APIs your app needs to call using the acquireTokenSilent method which makes a silent request(without prompting the user with UI) to Azure AD to obtain an access token. The Azure AD service then returns an access token containing the user consented scopes to allow your app to securely call the API.
        // You can use acquireTokenRedirect or acquireTokenPopup to initiate interactive requests, although, it is best practice to only show interactive experiences if you are unable to obtain a token silently due to interaction required errors. If you are using an interactive token call, it must match the login method used in your application. (loginPopup=> acquireTokenPopup, loginRedirect => acquireTokenRedirect).        
        // If the acquireTokenSilent call fails with an error of type InteractionRequiredAuthError you will need to initiate an interactive request. This could happen for many reasons including scopes that have been revoked, expired tokens, or password changes.        
        // acquireTokenSilent will look for a valid token in the cache, and if it is close to expiring or does not exist, will automatically try to refresh it for you.        
        var authStore = me.getAuthStore();
        if (authStore) {
            authStore.un('load', me.authStoreLoaded, me);
        }
        var token = response.accessToken
        if (!token && response.idToken) {
            me.requiresLogin = true;
            me.getToken();
            return;
        }
        if (token) {
            ABPLogger.logDebug('Setting token from redirectCallback ' + token);
            ABPAuthManager.authenticationSuccess(token);
            me.authenticationSuccess = true;
        }
    },

    requiresInteraction: function (errorCode) {
        if (!errorCode || !errorCode.length) {
            return false;
        }
        return errorCode === "consent_required" ||
            errorCode === "interaction_required" ||
            errorCode === "login_required";
    },

    /**
     * Determines if the login process should pause at the login page before proceeding to call abp/login and attemping to load the client.
     */
    getStopAtLoginPage: function () {
        var bootstrapConfig = ABP.Config.getBootstrapConfig();
        if (bootstrapConfig) {
            return ABP.util.Common.getObjectProperty(bootstrapConfig, 'settings.b2cShowLogin');
        }
        // It's possible the pre-bootstrap has also set this property.
        return this.getB2cShowLogin();
        // TODO: Might reduce a bit of code redundancy if this function also checked if the user selected 'keep me signed in'.
    }
});