/**
 * Provides a wrapper for some Ajax functionality.
 */
Ext.define('ABP.util.Ajax', {
    requires: [
        'ABP.util.RequestQueue'
    ],
    singleton: true,
    mixins: {
        observable: 'Ext.mixin.Observable'
    },

    config: {
        /**
         * @cfg {Number} timeout in ms for Ajax requests created using ABP.util.Ajax.request()
         */
        timeout: null
    },
    interceptor: null,

    /**
     * @event intercept
     * @preventable
     * Fires before a network request is made to retrieve a data object.
     * @param {String} url This URL that will be intercepted.
     */


    constructor: function (config) {
        // Will call initConfig
        this.mixins.observable.constructor.call(this, config);
    },

    /**
     * Object containing keys to the ABP Ajax calls
     *
     *       Requests:
     *           - `bootstrap` - call made initially at page load
     *           - `login` - call made with user information to be authenticated
     *           - `configuration` - call made to retrieve ABP configuration data
     *           - `refreshToken` - call made to get a new access token for the case where the old one is expiring
     *           - `saveFavorites` - call made to inform server of a change to the favorites for the user
     *           - `offlinePassword` - call made to store an offline password
     *           - `actionCenterConfig` - call made to retrieve Action Center configuration data
     *           - `logout` - call made to inform server that the user has initiated a logout
     */
    availableRequests: {
        configuration: 'configuration',
        login: 'login',
        bootstrap: 'bootstrap',
        refreshToken: 'refreshtoken',
        logout: 'logout',
        saveFavorites: 'favorites',
        offlinePassword: 'offlinePassword',
        actionCenterConfig: 'controlcenter'
    },

    /**
     * Wrapper function for the Ext.Ajax.request which provides an additional event that can be intercepted by other client components.
     * The main purpose of this function is to allow client components to generate the JSON responses locally so features can be tested
     * without the need to have the supporting server-side end points.
     *
     * The following headers are added automatically:
     *
     *  SystemId: The current SavedEnvironment in local storage.
     *
     *  UserId: The current SavedUsername in local storage.
     *
     *  Authorization: If the auth type is configured to 'oauth'. The value will be "Bearer sessionId.access_token"
     *
     * @param {Object} options An object which may contain the following properties:
     *
     * (The options object may also contain any other property which might be needed to perform
     * postprocessing in a callback because it is passed to callback functions.)
     *
     * @param {String/Function} options.url The URL to which to send the request, or a function
     * to call which returns a URL string. The scope of the function is specified by the `scope` option.
     * Defaults to the configured `url`.
     *
     * @param {Boolean} options.async `true` if this request should run asynchronously.
     * Setting this to `false` should generally be avoided, since it will cause the UI to be
     * blocked, the user won't be able to interact with the browser until the request completes.
     * Defaults to `true`.
     *
     * @param {Object/String/Function} options.params An object containing properties which are
     * used as parameters to the request, a url encoded string or a function to call to get either. The scope
     * of the function is specified by the `scope` option.
     *
     * @param {String} options.method The HTTP method to use
     * for the request. Defaults to the configured method, or if no method was configured,
     * "GET" if no parameters are being sent, and "POST" if parameters are being sent.  Note that
     * the method name is case-sensitive and should be all caps.
     *
     * @param {Function} options.callback The function to be called upon receipt of the HTTP response.
     * The callback is called regardless of success or failure and is passed the following parameters:
     * @param {Object} options.callback.options The parameter to the request call.
     * @param {Boolean} options.callback.success True if the request succeeded.
     * @param {Object} options.callback.response The XMLHttpRequest object containing the response data.
     * See [www.w3.org/TR/XMLHttpRequest/](http://www.w3.org/TR/XMLHttpRequest/) for details about
     * accessing elements of the response.
     *
     * @param {Function} options.success The function to be called upon success of the request.
     * The callback is passed the following parameters:
     * @param {Object} options.success.response The XMLHttpRequest object containing the response data.
     * @param {Object} options.success.options The parameter to the request call.
     *
     * @param {Function} options.failure The function to be called upon failure of the request.
     * The callback is passed the following parameters:
     * @param {Object} options.failure.response The XMLHttpRequest object containing the response data.
     * @param {Object} options.failure.options The parameter to the request call.
     *
     * @param {Object} options.scope The scope in which to execute the callbacks: The "this" object for
     * the callback function. If the `url`, or `params` options were specified as functions from which to
     * draw values, then this also serves as the scope for those function calls. Defaults to the browser
     * window.
     *
     * @param {Number} options.timeout The timeout in milliseconds to be used for this
     * {@link ABP.util.Ajax.setTimeout()} may also be used to configure a timeout for all Ajax requests created with this function.
     */
    request: function (options) {
        var me = this,
            response = {
                success: false,
                responseText: '',
                status: 200
            };

        options.headers = options.headers || {};
        options.headers = Ext.applyIf(options.headers, me.getRequestHeaders(options));
        // Fire the intercept event, so test harnesses can override the server logic and use local stored responses.
        if (me.fireEvent('intercept', me, options, response) !== false) {
            if (response.success) {
                if (response.status === 2001) {
                    // True async, let the caller handle the callbacks.
                    return;
                }
                if (response.status === 200) {
                    Ext.callback(options.success, options.scope, [response, options]);
                } else {
                    Ext.callback(options.failure, options.scope, [response, options]);
                }
                return;
            }
        } else {
            // If false is returned, do not continue.
            return;
        }

        if (!options.timeout && me.getTimeout()) {
            options.timeout = me.getTimeout();
        }

        var endpoint = this.getUrlInfo(options.url).abpEndPoint;
        if (endpoint) {
            var interactions = ABP.util.AjaxInteractionManager.getAjaxInteractions(endpoint);
            if (interactions) {
                var communications = interactions.communications;
                var substitute = interactions.substitute;
                var urlQueryStringParameter = interactions.urlQueryStringParameters;
                // communications are now arrays
                if (communications && Ext.isArray(communications)) {
                    var success = [];
                    var failure = [];
                    for (var i = 0; i < communications.length; i++) {
                        if (communications[i].handlerObj) {
                            if (communications[i].handlerObj.success) {
                                success.push(communications[i].handlerObj.success);
                            }
                            if (communications[i].handlerObj.failure) {
                                failure.push(communications[i].handlerObj.failure);
                            }
                        }
                    }
                    if (!Ext.isEmpty(success)) {
                        options.initialSuccess = options.success;
                        options.configSuccess = success;
                        options.success = function (resp, options) {
                            for (var successItter = 0; successItter < options.configSuccess.length; successItter++) {
                                if (Ext.isFunction(options.configSuccess[successItter])) {
                                    options.configSuccess[successItter](resp);
                                } else if (Ext.isString(options.configSuccess[successItter])) {
                                    var func = ABP.util.Common.getSingletonFunctionFromString(options.configSuccess[successItter]);
                                    if (func) {
                                        func(resp);
                                    }
                                }
                            }
                            options.initialSuccess(resp, options);
                        }
                    }
                    if (!Ext.isEmpty(failure)) {
                        options.initialFailure = options.failure;
                        options.configFailure = failure;
                        options.failure = function (resp, options) {
                            for (var failItter = 0; failItter < options.configFailure.length; failItter++) {
                                if (Ext.isFunction(options.configFailure[failItter])) {
                                    options.configFailure[failItter](resp);
                                } else if (Ext.isString(options.configFailure[failItter])) {
                                    var func = ABP.util.Common.getSingletonFunctionFromString(options.configFailure[failItter]);
                                    if (func) {
                                        func(resp);
                                    }
                                }
                            }
                            options.initialFailure(resp, options);
                        }
                    }
                }
                if (substitute && substitute.substituteFunc) {
                    if (Ext.isFunction(substitute.substituteFunc)) {
                        substitute.substituteFunc(options);
                        return;
                    } else if (Ext.isString(substitute.substituteFunc)) {
                        var func = ABP.util.Common.getSingletonFunctionFromString(substitute.substituteFunc);
                        if (func) {
                            func(options);
                            return;
                        }
                    }
                }
                if (urlQueryStringParameter && Ext.isArray(urlQueryStringParameter) && !Ext.isEmpty(urlQueryStringParameter)) {
                    var additionalParamString = options.url.indexOf('?') === -1 ? "?" : "&";
                    var urlQueryStringParameterLength = urlQueryStringParameter.length;
                    for (var i = 0; i < urlQueryStringParameterLength; ++i) {
                        if (i !== 0) {
                            additionalParamString += "&" + urlQueryStringParameter[i].name + '=' + urlQueryStringParameter[i].value;
                        } else {
                            additionalParamString += urlQueryStringParameter[i].name + '=' + urlQueryStringParameter[i].value;
                        }
                    }
                    options.url += additionalParamString;
                }
            }
        }

        // If we are making a call to a service endpoint and are using a service token we will attach our own failure handler.
        // This failure handler will check for 401s and attempt to refresh the token automatically before repeating the request.
        // The original failure/success will be invokved upon success or failure.        
        if (ABPAuthManager.getToken()) {
            options.initialFailure = options.failure;
            options.failure = me.handleAjaxFailure;
        }
        Ext.Ajax.request(options);
    },

    /**
     * Gets standard ABP request headers.
     *
     * @returns a headers object like so:
     *
     *      {
     *          Authorization: 'Bearer ' + auth token, // If using OAuth.
     *          SystemId: "",
     *          UserId: ""
     *      }
     */
    getRequestHeaders: function (options) {
        var url = options.url;
        var headers = {};
        // If OAuth is the authentication type add the Authorization header, the SystemId and UserId.
        // If there is no sessionId (token) do not do this because it is a pre-login call.                
        // It is significantly more performant to test for a service first and assume if none are returned that this is the general server URL.

        var service = ABPServiceManager.matchEndpointToService(url);
        if (!Ext.isEmpty(service)) {
            var token = ABPServiceManager.getTokenForService(service);
            if (Ext.isEmpty(token)) {
                // Check if this service is actually the "product url", if so use the non-service token.
                if (url.indexOf(ABP.util.Ajax.getServerUrl()) > -1) {
                    token = ABPAuthManager.getToken();
                }
            }
            // Do not add an empty token, ever.
            if (!Ext.isEmpty(token)) {
                headers['Authorization'] = 'Bearer ' + token;
            }
        } else {
            var token = ABPAuthManager.getToken();
            if (!Ext.isEmpty(token)) {
                headers['Authorization'] = 'Bearer ' + token;
            } else {
                if (ABP.util.Config.getAuthType() === 'oauth' && ABP.util.Config.getSessionId() !== null) {
                    headers['Authorization'] = 'Bearer ' + ABP.util.Config.getSessionId();
                }
            }
        }
        headers['SystemId'] = ABP.util.LocalStorage.get('SavedEnvironment');
        headers['UserId'] = ABP.util.LocalStorage.get('SavedUsername');
        return headers;
    },

    /**
     * get settings URL from local storage. If not present and app was served from a web server,
     * attempt to discover URL from web server URL
     *
     * @returns The fully formed url
     */
    getServerUrl: function () {
        // get settings URL from local storage
        // if not present return empty string

        var savedServerUrl = ABP.util.LocalStorage.get('ServerUrl');
        if (savedServerUrl && this.isValidServerUrl(savedServerUrl)) {
            if (savedServerUrl.indexOf('#') > 0) {
                savedServerUrl = savedServerUrl.substring(0, savedServerUrl.indexOf('#'));
            }
            return savedServerUrl;
        } else {
            return "";
        }
    },

    /**
     * get settings URL from local storage. If not present and app was served from a web server,
     * attempt to discover URL from web server URL
     *
     * @returns The fully formed url
     */
    getBootstrapServerUrl: function () {
        // get settings URL from local storage
        // if not present and app was served from a web server,
        // attempt to discover URL from web server URL

        var savedServerUrl = ABP.util.LocalStorage.get('ServerUrl');
        var baseUrl = "";

        if (savedServerUrl && this.isValidServerUrl(savedServerUrl)) {
            if (savedServerUrl.indexOf('#') > 0) {
                savedServerUrl = savedServerUrl.substring(0, savedServerUrl.indexOf('#'));
            }
            baseUrl = savedServerUrl;
        }
        else if (document.URL.indexOf('http') !== -1) {

            // if there was a previous discovery attempt, start with that URL
            if (this.attemptDiscoveryServerUrl) {
                baseUrl = this.attemptDiscoveryServerUrl;

                if (baseUrl === document.location.origin) {
                    // we already trimmed everything so return an empty string,
                    // forcing the display of the setting page
                    this.attemptDiscoveryServerUrl = '';
                    return '';
                }

            } else {
                baseUrl = document.URL;
            }

            // chop off any fragment identifiers
            if (baseUrl.indexOf('#') > 0) {
                baseUrl = baseUrl.substring(0, baseUrl.indexOf('#'));
            }

            // chop one level of path off the end
            baseUrl = baseUrl.substring(0, baseUrl.lastIndexOf('/'));
            this.attemptDiscoveryServerUrl = baseUrl;

            // add api prefix, if any
            var prefix = ABP.util.Config.getApiUrlPrefix();
            if (prefix !== null) {
                baseUrl = baseUrl + prefix;
            }
        }

        return baseUrl;
    },

    /**
     * used by doBootstrapErrorHander on ABPMainController to determine if fail was due to autodiscovery
     *
     * @returns {string} this.attemptDiscoveryServerUrl
    */
    getAttemptDiscoveryServerUrl: function () {
        return this.attemptDiscoveryServerUrl;
    },

    /**
     * Check to validate that the url supplied is valid
     *
     * @returns {Boolean} True if a valid URL was supplied, otherwise returns False
     */
    isValidServerUrl: function (url) {
        if (!url) {
            return false;
        }
        return (/^(?:(?:https?):\/\/)(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*|(?:(?:[a-z\u00a1-\uffff0-9]+_?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*)(?::\d{2,5})?(?:\/[^\s]*)?$/i).test(url);
    },

    /**
     * Breaks the URL down into its component parts
     * @returns {Object} a data structure that contains data points for:
     *    serverUrl
     *    routes
     *    abpEndPoint
     *    options
     */
    getUrlInfo: function (url) {
        var serverUrl = ABP.util.LocalStorage.get('ServerUrl')
        if (!serverUrl) {
            serverUrl = window.location.origin;
        }

        serverUrl = serverUrl.toLowerCase();
        url = url.replace(serverUrl + '/', '');
        var params = url.split('?');
        var options = null;
        if (params.length === 2) {
            options = params[1].split('&');
        }

        var route = params[0].split('/');

        var abpFunction = '';
        var i = route.lastIndexOf('abp');
        if (i > -1 && i <= route.length - 2) {
            abpFunction = route[i + 1];
        }

        return {
            baseUrl: serverUrl,
            routes: route,
            abpEndPoint: abpFunction,
            options: options
        }
    },

    /**
     * Utility function that allows the user to upload the file (Classic Only).
     *
     * Usage:
     *
     * =====
     *
     * {
     *     xtype: 'filefield',
     *     itemId: 'file-upload',
     *     label: 'Select a file',
     *     listeners: {
     *          change: function(s){
     *          var file = s.getFiles()[0];
     *          var data = new FormData();
     *          data.append('licenseId', 1045);
     *          data.append('file', file);
     *          url = 'path/to/api/upload';
     *          ABP.util.Ajax.uploadFile(data, url);
     *     }
     * }
     *
     * =====
     *
     * @param {object} file The file to be uploaded
     *
     * @param {string} sourceUrl location where the file is to be uploaded
     *
     * Note: For Mobile applications, Product lines must use Cordova/Phonegap plugins for upload/download.
     *
     */
    uploadFile: function (file, sourceUrl) {
        ABP.util.Ajax.request({
            url: sourceUrl,
            rawData: file,
            headers: {
                'Content-Type': null
            }, //to use content type of FormData
            success: function (response) {
                if (response.status !== 200)
                    ABP.view.base.popUp.PopUp.showInfo('error ' + response.status);

            },
            failure: function (response) {
                var title = ABP.util.Common.geti18nString('error_upload_failed');

                var error = Ext.JSON.decode(response.responseText);
                ABP.util.Logger.logError(title + " (" + response.stausText + ")", error.exceptionMessage)
                ABP.view.base.popUp.PopUp.showInfo(title, error.exceptionMessage);

            }
        });

    },

    /**
     * Utility function that allows the user to download a file (Classic Only).
     *
     * To download the file into a single page application, an iframe is created and the file downloaded into the frame
     *
     *  Usage:
     *
     *
     *          ABP.util.Ajax.downloadFile('path/to/api/download?id=fileId');
     *
     *
     * @param {string} sourceUrl Location of the file to download.
     *
     * Note: For Mobile applications, Product lines must use Cordova/Phonegap plugins for upload/download.
     *
     */
    downloadFile: function (sourceUrl) {
        ABP.util.Ajax.request({
            url: sourceUrl,
            success: function (response, opts) {
                try {
                    Ext.destroy(Ext.get('downloadIframe'));
                }
                catch (e) { }

                Ext.DomHelper.append(document.body, {
                    tag: 'iframe',
                    id: 'downloadIframe',
                    frameBorder: 0,
                    width: 0,
                    height: 0,
                    css: 'display:none;visibility:hidden;height:0px;',
                    src: sourceUrl
                });
            },
            failure: function (response, opts) {
                var title = ABP.util.Common.geti18nString('error_download_failed');
                if (response.status === 410) {
                    //i18n : error_download_failed
                    var message = ABP.util.Common.geti18nString('error_download_failed_fileNotFound')
                    ABP.util.Logger.logError(title + " (410)", message)
                    ABP.view.base.popUp.PopUp.showInfo(title, message);
                }
                else if (response.responseText) {
                    var error = Ext.JSON.decode(response.responseText);
                    ABP.util.Logger.logError(title + " (" + response.status + ")", error.errorMessage)
                    ABP.view.base.popUp.PopUp.showInfo(title, error.errorMessage);
                }
            }
        });
    },

    handleAjaxFailure: function (response, options) {
        // Current maximum allowed 401s per request. 
        // We will only allow each request to fail once. 
        // If it fails again we invoke the failure handler immediately.
        var usesB2cToken = ABP.util.Msal.enabled;
        var maxFailureAttempts = 1;
        options.failureAttempts = Ext.isNumber(options.failureAttempts) ? options.failureAttempts : 0;
        options.failureAttempts += 1;

        if (options.failureAttempts > maxFailureAttempts) {
            options.failure = options.initialFailure;
            delete options.initialFailure;
            Ext.callback(options.initialFailure, options.scope, [response, options]);
        }
        if (response.status === 401 && !options.refreshedToken) {
            // If a token refresh is in progress, queue this request.
            ABPRequestQueue.push(options);
            if (ABPAuthManager.isRequestingToken()) {
                return;
            }
            try {
                var service = ABPServiceManager.matchEndpointToService(options.url);
                usesB2cToken = ABPAuthManager.serviceUsesB2cToken(service);
            } catch (e) {
                ABPLogger.logWarn(e);
            }
            // We can attempt to refresh the token and try again.
            ABPAuthManager.requestToken(usesB2cToken).then(
                function () {
                    // Indicate that we have already refreshed the token, don't get stuck in a loop.
                    options.refreshedToken = true;
                    // Rehydrate the original failure handler.
                    options.failure = options.initialFailure;
                    delete options.initialFailure;
                    // Try the request again.                    
                    ABP.util.Ajax.request(options);
                    // Anything else in queue? Start those requests as well.                    
                    if (!ABPRequestQueue.isEmpty()) {
                        ABPRequestQueue.start();
                    }
                },
                function (response) {
                    Ext.callback(options.initialFailure, options.scope, [response, options]);
                }
            );
        } else {
            Ext.callback(options.initialFailure, options.scope, [response, options]);
        }
    }
});
