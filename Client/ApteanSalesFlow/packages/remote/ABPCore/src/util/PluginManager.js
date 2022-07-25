/**
 * TODO: Update documentation
 */
Ext.define('ABP.util.PluginManager', {
    singleton: true,

    requires: [
        'ABP.util.Logger'
    ],

    config: {
        registeredPlugins: {},  // '<pluginId>': '<pluginClass>'
        activePlugins: {}       // '<pluginId>': '<pluginInstance>'
    },

    constructor: function (config) {
        this.initConfig(config);
    },

    getActivePluginsImplementingFunction: function (functionName) {
        var activePlugins = this.getActivePlugins(),
            pluginsToReturn = [],
            pluginId, plugin;

        for (pluginId in activePlugins) {
            if (activePlugins.hasOwnProperty(pluginId)) {
                plugin = activePlugins[pluginId];
                if (plugin[functionName]) {
                    pluginsToReturn.push({ plugin: plugin, pluginId: pluginId });
                }
            }
        }
        return pluginsToReturn;
    },

    getPluginClass: function (pluginId) {
        return this.getRegisteredPlugins()[pluginId];
    },

    getPluginInstance: function (pluginId) {
        var instance = this.getActivePlugins()[pluginId];

        if (!instance) {
            var pluginClass = this.getPluginClass(pluginId);
            if (pluginClass) {
                try {
                    instance = Ext.create(pluginClass);
                    this.getActivePlugins()[pluginId] = instance;
                    ABP.util.Logger.logTrace('Initialized plugin: ' + pluginClass);
                } catch (e) {
                    ABP.util.Logger.logError('Error initializing plugin: ' + pluginClass + ' : ' + e.message);
                }
            }
        }
        return instance;
    },


    getAllPluginConfigs: function () {
        var plugins = this.getRegisteredPlugins(),
            configs = [],
            pluginName, pluginClass, clazz;

        for (pluginName in plugins) {
            if (plugins.hasOwnProperty(pluginName)) {
                pluginClass = plugins[pluginName];
                clazz = Ext.ClassManager.get(pluginClass);
                if (!clazz) {
                    ABP.util.Logger.logWarn('no class found for ' + pluginClass);
                } else {
                    configs.push({ pluginName: pluginName, config: clazz.prototype.config });
                }
            }
        }
        return configs;
    },

    getMergedPluginConfigs: function (propertyName) {
        var mergedConfigs = [],
            allConfigs = this.getAllPluginConfigs(),
            i,
            configItem;

        if (propertyName === 'aboutInfo') {
            // Add ABP about info
            mergedConfigs.push(ABP.util.Common.getABPAboutData());
        }

        Ext.each(allConfigs, function (item) {
            configItem = item.config[propertyName];
            if (configItem) {
                if (configItem instanceof Array) {
                    for (i = 0; i < configItem.length; i++) {
                        mergedConfigs.push(Ext.clone(configItem[i]));
                    }
                } else {
                    mergedConfigs.push(Ext.clone(configItem));
                }
            }
        });
        return mergedConfigs;
    },

    initializeAllPlugins: function () {
        var pluginId;

        ABP.util.Logger.logTrace("Initializing all plugins");
        var plugins = ABP.util.PluginManager.getRegisteredPlugins();
        for (pluginId in plugins) {
            if (plugins.hasOwnProperty(pluginId)) {
                this.getPluginInstance(pluginId);
            }
        }
    },

    register: function (pluginId, pluginClass) {
        ABP.util.Logger.logTrace("Registering Plugin: " + pluginId + ' ' + pluginClass);
        this.getRegisteredPlugins()[pluginId] = pluginClass;
    }

});

