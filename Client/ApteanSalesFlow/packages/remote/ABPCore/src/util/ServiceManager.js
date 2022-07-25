/**
 * Static class to manage an Ajax request queue.
 */
Ext.define('ABP.util.ServiceManager', {
    alternateClassName: 'ABPServiceManager',
    singleton: true,
    services: new Ext.util.Collection(),

    /**
     * Registers a service with this class and makes it available for other APIs.
     * @param {Object} service 
     */
    registerService: function (service) {
        var me = this;
        if (!service) {
            return;
        }
        service.usesB2cToken = Ext.isBoolean(service.usesB2cToken) ? service.usesB2cToken : true
        me.services.add({
            id: service.name,
            service: service,
        });
        // If we have not yet requested a service token, do so now.
        if (service.usesB2cToken === false && Ext.isEmpty(ABPAuthManager.getServiceToken())) {
            ABPAuthManager.requestTokenForService(service.name);
        }
    },

    /**
     * Retrieves the authorization token suitable for this service.
     */
    getTokenForService: function (service) {
        var me = this;
        var service = me.getService(service);
        if (service && service.usesB2cToken) {
            return ABPAuthManager.getToken();
        } else {
            return ABPAuthManager.getTokenForAudience(service);
        }
    },

    /**
     * Retrieves a service.
     * @param {String} serviceName 
     */
    getService: function (serviceName) {
        var me = this;
        var item = me.services.get(serviceName);
        if (item) {
            return item.service;
        } else {
            ABPLogger.logDebug('Could not find service ' + serviceName);
            return null;
        }
    },

    /**
     * Returns the service's defined URL if the service exists.
     * @param {String} serviceName name of the service.
     */
    getServiceUrl: function (serviceName) {
        var me = this;
        var service = me.getService(serviceName);
        if (service) {
            return service.url;
        }
        return null;
    },

    /**
     * Returns the service's defined URL if the service exists.
     * @param {String} serviceName name of the service.
     */
    setServiceUrl: function (serviceName, url) {
        var me = this;
        var service = me.getService(serviceName);
        if (service) {
            service.url = url;
        }
    },

    /**
     * Checks if the current request endpoint is one defined by a service.
     * @param {String} url 
     */
    isServiceCall: function (url) {
        return Ext.isEmpty(this.matchEndpointToService(url));
    },

    /**
     * Matches a service name to the provided url.
     * @param {String} url 
     */
    matchEndpointToService: function (url) {
        var me = this;
        var serviceName;
        me.services.each(function (item) {
            var service = item.service;
            if (url.indexOf(service.url) > -1) {
                serviceName = service.name;
            }
        });
        return serviceName;
    },

    /**
     * Returns a list of registered service names.
     */
    getRegisteredServices: function () {
        var me = this;
        var serviceNames = [];
        me.services.eachKey(function (key) {
            serviceNames.push(key);
        });
        return serviceNames;
    }
});