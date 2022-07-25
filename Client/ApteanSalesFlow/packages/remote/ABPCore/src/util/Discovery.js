Ext.define('ABP.util.Discovery', {
    singleton: true,

    // 'https://localhost:5002/' below will be something like subscriptionservice.aptean.com/api/discover rather than calling into this web app's service
    discoverUrl: 'https://apteancustomermanagement.azurewebsites.net/abp/discover', // This will be directed at the customer subscription discover url - http trigger
    
    discover: function (email, failure) {
        // ** TODO: Maybe include a success that takes a current user and authenticates from metadata info rather than redirect entirely.

        var org = '';
        if (email.indexOf("@") < 0){
            org = email;
            email = '';
        }

        failure = failure || Ext.emptyFn;
        var me = this;
        Ext.Ajax.request({
            url: me.discoverUrl,
            method: 'GET',
            params: {
                org: org,
                email: email
            },
            success: function (result) {
                var responseText = result.responseText;
                if (Ext.isString(responseText)) {
                    try {
                        var customer = Ext.decode(responseText);
                        if (customer) {
                            me.setServiceUrls(customer);
                            me.__redirectForCustomer(customer)
                        }
                    } catch (ex) {
                        // Fail - trace back to discovery with error message.
                        failure("Error processing returned discover response");
                        return;
                    }
                }
            },
            failure: function (result) {
                failure(result.responseText);
            }
        });
    },

    discoverUserInfo: function (org, id_token, success, failure) {
        failure = failure || Ext.emptyFn;
        var me = this;
        Ext.Ajax.request({
            url: me.discoverUrl,
            method: 'GET',
            params: {
                org: org,
                email: ''
            },
            success: function (result) {
                var responseText = result.responseText;
                if (Ext.isString(responseText)) {
                    try {
                        var customer = Ext.decode(responseText);
                        if (customer) {
                            me.__getWellKnownMetadata(customer, function (wellKnown) {
                                me.__getAuthorizedUserInfo(wellKnown.userinfo_endpoint, id_token, success);
                            });
                        }
                    } catch (ex) {
                        // Fail - trace back to discovery with error message.
                        window.location = document.location.origin + '/#error=' + encodeURIComponent("Error processing returned discover response");
                        return;
                    }
                }
            }
        });
    },

    privates: {
        /**
         * Update the subscription endpoints from the customer current subscriptions
         * @param {Object} customer 
         */
        setServiceUrls: function(customer){
            Ext.Array.each(customer.subscriptions, function(subscription) {
                ABPServiceManager.setServiceUrl(subscription.product, subscription.endpoint);
            });
        },

        __getWellKnownMetadata: function (customer, success) {            
            var authDetails = customer.authentication;
            customer.serviceEndpoint = 'http://dga1app02comtech:8080/api/v1';
            ABP.util.LocalStorage.set('ServerUrl', customer.serviceEndpoint);
            if (authDetails) {
                authDetails = Ext.isArray(authDetails) ? authDetails[0] : authDetails;
                if (authDetails.metadataUrl) {
                    Ext.Ajax.request({
                        method: 'GET',
                        url: authDetails.metadataUrl,
                        success: function (response) {
                            var responseText = response.responseText;
                            if (Ext.isString(responseText)) {
                                var metadata = Ext.decode(responseText);
                                if (metadata) {
                                    success(metadata);
                                }
                            }
                        }
                    });
                }
            }
        },

        __getAuthorizedUserInfo: function (url, id_token, success) {
            var me = this;
            Ext.Ajax.request({
                method: 'GET',
                url: url,
                headers: {
                    'Authorization': 'Bearer ' + id_token
                },
                success: function (response) {
                    var responseText = response.responseText;
                    if (Ext.isString(responseText)) {
                        var user = Ext.decode(responseText);
                        if (success) {
                            success(user);
                        }
                    }
                }
            });
        },

        __redirectForCustomer: function (customer) {
            var me = this;
            var authDetails = customer.authentication;
            customer.serviceEndpoint = 'http://dga1app02comtech:8080/api/v1';
            ABP.util.LocalStorage.set('ServerUrl', customer.serviceEndpoint);
            if (authDetails) {
                authDetails = Ext.isArray(authDetails) ? authDetails[0] : authDetails;
                if (authDetails.metadataUrl) {
                    Ext.Ajax.request({
                        method: 'GET',
                        url: authDetails.metadataUrl,
                        success: function (response) {
                            var responseText = response.responseText;
                            if (Ext.isString(responseText)) {
                                var metadata = Ext.decode(responseText);
                                if (metadata) {
                                    me.__redirectForWellKnown(customer, authDetails, metadata);
                                }
                            }
                        }
                    });
                }
            }
        },

        __redirectForWellKnown: function (customer, authDetails, metadata) {
            var supportsOidc = metadata.scopes_supported.indexOf('openid') >= 0;
            var supportsProfile = metadata.scopes_supported.indexOf('profile') >= 0;

            var scope = 'openid';
            if (!metadata.scopes_supported.indexOf('openid')) {
                // TODO: the provider does not support opend id
            }

            if (metadata.scopes_supported.indexOf('profile') >= 0) {
                scope += ' profile';
            }

            // TODO: generate the nonce value and store 
            // TODO: looks at best practises for this session storage? 
            window.location = metadata.authorization_endpoint + '?' + Ext.Object.toQueryString({
                response_type: 'id_token',
                client_id: authDetails.clientId,
                scope: scope,
                redirect_uri: document.location.origin,
                nonce: ABP.util.Jwt.getNonce()
            });
        }
    }
});