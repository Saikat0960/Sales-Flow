/**
 * Calculates item ids for menu items.
 * 
 * Usually an item's uniqueId should be provided as part of the navigation data. 
 * When it is ommitted then one is calcuated based on a SHA256 has of the config.
 */
Ext.define('ABP.util.IdCreator', {
    singleton: true,
    config: {
        currentId: 0
    },

    constructor: function (config) {
        this.initConfig(config);
    },

    /**
     * Calculates a unique id based on an object's config.
     * 
     * It is assumed that the config's contents is unique compared to other instances.
     * 
     * SHA256 is used to provide the hash value.
     * @params {Object} config The object to use to obtain a unique id.
     * @returns (String) The id.
     */
    getId: function (config) {
        // Make an object containing appId, type, event && eventargs || hash, activateApp
        var objToPass = {
            appId: config.appId,
            type: config.type,
            activateApp: config.activateApp
        };
        if (config.type === 'event') {
            objToPass.event = config.event;
            objToPass.eventArgs = config.eventArgs;
        } else if (config.type === 'route') {
            objToPass.hash = config.hash;
        }
        // Serialize
        var serialized = this.serialize(objToPass);
        // Hash
        var hashed = ABP.util.Sha256.sha256(serialized);
        // return
        return hashed;
    },

    privates: {
        serialize: function (object) {
            var type;
            var serialized = '';

            for (var element in object) {
                if (object[element]) {
                    type = typeof element;
                    serialized += "[" + type + ":" + element + ":" + object[element].toString() + "]";
                }
            }
            return serialized;
        }
    }
});