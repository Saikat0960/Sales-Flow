/**
 * Insight Authentication Manager.
 */
Ext.define('ABP.util.AuthenticationManager', {
    alternateClassName: 'ABPAuthManager',
    singleton: true,
    tokenKey: 'servicetoken',
    tokenAudience: [],
    tokenRefreshTask: null,
    tokenAudienceLoaded: false,
    requestingToken: false,
    tokens: new Ext.util.HashMap(),
    serviceToken: null,
    token: null,

    /**
     * Calls out to the abp/token endpoint to retrieve a token suitable for services.
     * @param {Boolean} usesB2cToken whether or not to request a token from b2c. Defaults to true.
     * @returns a promise which resolves when the token is retrieved.
     */
    requestToken: function (usesB2cToken) {
        var me = this;
        var promises = [];
        var audiences = me.getTokenAudience();
        usesB2cToken = Ext.isBoolean(usesB2cToken) ? usesB2cToken : true;

        if (usesB2cToken) {
            promises.push(ABP.util.Msal.getToken());
        } else {
            for (i = 0; i < audiences.length; i++) {
                promises.push(me.requestTokenForService(audiences[i]));
            }
        }
        return Ext.Deferred.all(promises);
    },

    /**
     * 
     * @param {String/Object} service the service.
     */
    serviceUsesB2cToken: function (service) {
        var me = this;
        service = Ext.isString(service) ? ABPServiceManager.getService(service) : service;
        return Ext.isEmpty(service.usesB2cToken) ? true : service.usesB2cToken;
    },

    /**
     * Calls out to the abp/token endpoint to retrieve a token suitable for services.
     * @returns a promise which resolves when the token is retrieved.
     */
    requestTokenForService: function (audience) {
        var me = this;

        var service = ABPServiceManager.getService(audience);
        if (service && service.usesB2cToken) {
            var message = Ext.String.format('Service {0} is configured to use B2C tokens.', audience);
            ABPLogger.logDebug(message);
            return;
        }
        // Make sure the services store has loaded before requesting the token.
        if (me.requestingToken) {
            return;
        }
        url = ABP.util.Ajax.getServerUrl();

        var deferred = new Ext.Deferred();
        me.requestingToken = true;
        var request = {
            method: 'GET',
            withCredentials: true,
            url: url + '/abp/token?audience=' + audience,
            success: function (response) {
                me.requestingToken = false;
                var resp = Ext.JSON.decode(response.responseText);
                me.authenticationSuccessService(resp.authorizationToken);
                deferred.resolve(resp);
            },
            failure: function (response) {
                me.requestingToken = false;
                me.authenticationFailure(response);
                deferred.reject(response);
            }
        };

        var previousToken = me.getToken(audience);
        if (previousToken) {
            request.headers = {
                'Authorization': 'Bearer ' + previousToken
            }
        }

        ABP.util.Ajax.request(request);

        return deferred.promise;
    },

    /**
     * Whether or not this class is activley requesting a token.
     */
    isRequestingToken: function () {
        return this.requestingToken;
    },

    /**
     * Checks if the current access token is valid.
     */
    isTokenValid: function () {
        var me = this;
        var now = Math.floor(Date.now() / 1000);
        var tokenExpires = me.currentTokenExpires;
        if (!Ext.isNumber(tokenExpires)) {
            tokenExpires = me.getTokenExpiration();
        }
        // Buffer the token expires with 2s to estimate time before the token will actually be consumed by the recieving service.
        return tokenExpires > now + 2;
    },

    /**
     * Retrieves the token from storage.
     */
    getToken: function () {
        var me = this;
        return ABP.util.SessionStorage.get(me.tokenKey);
    },

    /**
     * Sets a new token in local storage.
     * @param {String} token 
     */
    setToken: function (token, payload) {
        var me = this;
        if (!Ext.isEmpty(token)) {
            me.token = token;
            ABP.util.SessionStorage.set(me.tokenKey, token);
        }
    },

    /**
     * Gets the service token, one issued by the Aptean token service.
     */
    getServiceToken: function () {
        var me = this;
        if (me.serviceToken) {
            return me.serviceToken;
        } else {
            return ABP.util.SessionStorage.get('abpservicetoken');
        }
    },

    /**
     * Sets a token, one issued by the Aptean token service.
     * @param {String} token 
     */
    setServiceToken: function (token) {
        var me = this;
        if (!Ext.isEmpty(token)) {
            me.serviceToken = token;
            ABP.util.SessionStorage.set('abpservicetoken', token);
        }
    },

    /**
     * Gets a token suitable for this audience (service).
     * @param {String} audience the audience for which we need authorization.
     */
    getTokenForAudience: function (audience) {
        // TODO: Currently we only store one token and update it with the audiences as necessary. 
        // This class/function 
        return this.getServiceToken();
    },

    privates: {

        /**
         * Adds an audience to the token requests.
         * @param {String} audience 
         * @private
         */
        addTokenAudience: function (audience) {
            var me = this;
            if (me.tokenAudience.indexOf(audience) > -1) {
                return;
            } else {
                me.tokenAudience.push(audience);
            }
        },

        /**
         * Removes an audience from the token request.
         * @param {String} audience audience(s) to remove.
         * @private
         */
        removeTokenAudience: function (audience) {
            var me = this;
            var indexOfAudience = me.tokenAudience.indexOf(audience);
            if (indexOfAudience > -1) {
                me.tokenAudience.splice(indexOfAudience, 1);
            }
        },

        /**
         * Gets the audience for a token request.
         * @private
         */
        getTokenAudience: function () {
            return ABPServiceManager.getRegisteredServices();
        },

        authenticationSuccessService: function (token) {
            var me = this;
            if (ABP.util.Jwt.isJwt(token)) {
                var tokenPayload = ABP.util.Jwt.getPayload(token);
                me.setServiceToken(token, tokenPayload);
                me.setServiceTokenRefreshTask(token, tokenPayload);
            }
            // TODO: Currently request queue is a public utility.
            // it's possible requests were queued for a reason other than waiting on a token so we should check that.
            if (!ABPRequestQueue.isEmpty()) {
                ABPRequestQueue.start();
            }
        },

        /**
         * Successfully retrieved a token - store it and set a refresh task.
         * @param {String} response 
         * @private
         */
        authenticationSuccess: function (token) {
            var me = this;

            if (ABP.util.Jwt.isJwt(token)) {
                var tokenPayload = ABP.util.Jwt.getPayload(token);
                ABPLogger.logDebug('Token Generation Success: ' + tokenPayload.aud);
                me.setToken(token, tokenPayload);
                me.setTokenRefreshTask(token, tokenPayload);
            }
            // TODO: Currently request queue is a public utility.
            // it's possible requests were queued for a reason other than waiting on a token so we should check that.
            if (!ABPRequestQueue.isEmpty()) {
                ABPRequestQueue.start();
            }
        },

        /**
         * Handles authentication failure.
         * @param {Object} response failure response.
         * @private
         */
        authenticationFailure: function (response) {
            ABPLogger.logError('Token Generation Failed.');
            ABPLogger.logDebug(response.responseText);
        },

        /**
         * Gets the number of seconds until the current token expires.
         * @private
         */
        getTokenExpiration: function (token, payload) {
            var me = this;
            var token = token || me.getToken();
            if (ABP.util.Jwt.isJwt(token)) {
                var jwtPayload = Ext.isEmpty(payload) ? ABP.util.Jwt.getPayload(token) : payload;
                if (Ext.isNumber(jwtPayload.exp) && !Ext.isEmpty(jwtPayload.iat)) {
                    // (Expiration - Issued Time) - 2seconds. The two seconds is a simple buffer for network latency on both ends.
                    return (jwtPayload.exp - jwtPayload.iat);
                }
            }
        },

        /**
         * Sets a task to refresh this token when it has about 30% of its duration remaining.
         * @param {String} token the token.
         * @param {Object} payload decoded payload of the token.
         * @private
         */
        setTokenRefreshTask: function (token, payload) {
            var me = this;
            // Token expires in this many seconds.            
            if (Ext.isEmpty(me.tokenRefreshTask)) {
                me.tokenRefreshTask = new Ext.util.DelayedTask(
                    me.requestToken,
                    me);
            }
            // Combine multiple update requests with a delayed task.
            var tokenExpiresIn = me.getTokenExpiration(token, payload);

            if (ABP.Config.getDebugMode() && payload) {
                var tokenLogString = 'Token: {0}\n\nExpires at UTC: {1}.\n\nCurrent UTC: {2}';
                var currentDate = new Date();
                var expireDate = new Date(currentDate.getTime() + (tokenExpiresIn * 1000));
                tokenLogString = Ext.String.format(tokenLogString, token, expireDate.toUTCString(), currentDate.toUTCString());
                ABPLogger.logDebug(tokenLogString);
            }
            var tokenExpiresMs = tokenExpiresIn;
            if (Ext.isNumber(tokenExpiresIn)) {
                tokenExpiresMs = (tokenExpiresMs * 1000) * 0.70; // Convert to ms. Request when the token has about 30% time remaining.
                tokenExpiresMs = Math.floor(tokenExpiresMs);
                me.tokenRefreshTask.delay(tokenExpiresMs);
                ABPLogger.logDebug('Services token is set to refresh in about ' + Math.round((tokenExpiresMs / 1000) / 60) + ' minutes.');
            }
        },

        setServiceTokenRefreshTask: function (token, payload) {
            var me = this;
            // Token expires in this many seconds.            
            if (Ext.isEmpty(me.tokenRefreshTask)) {
                me.tokenRefreshTask = new Ext.util.DelayedTask(
                    me.requestTokenForService,
                    me);
            }
            // Combine multiple update requests with a delayed task.
            var tokenExpiresIn = me.getTokenExpiration(token, payload);

            if (ABP.Config.getDebugMode() && payload) {
                var tokenLogString = 'Token: {0}\n\nExpires at UTC: {1}.\n\nCurrent UTC: {2}';
                var currentDate = new Date();
                var expireDate = new Date(currentDate.getTime() + (tokenExpiresIn * 1000));
                tokenLogString = Ext.String.format(tokenLogString, token, expireDate.toUTCString(), currentDate.toUTCString());
                ABPLogger.logDebug(tokenLogString);
            }
            var tokenExpiresMs = tokenExpiresIn;
            if (Ext.isNumber(tokenExpiresIn)) {
                tokenExpiresMs = (tokenExpiresMs * 1000) * 0.70; // Convert to ms. Request when the token has about 30% time remaining.
                tokenExpiresMs = Math.floor(tokenExpiresMs);
                me.tokenRefreshTask.delay(tokenExpiresMs);
                ABPLogger.logDebug('Services token is set to refresh in about ' + Math.round((tokenExpiresMs / 1000) / 60) + ' minutes.');
            }
        }
    }
});