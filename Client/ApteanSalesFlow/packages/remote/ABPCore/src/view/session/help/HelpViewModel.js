Ext.define('ABP.view.session.help.HelpViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.helpviewviewmodel',
    requires: [
        'ABP.model.HelpLinkModel',
        'ABP.model.HelpLinkTypeModel'
    ],

    data: {
        appTitle: ''
    },

    stores: {
        helpLinkStore: {
            model: 'ABP.model.HelpLinkModel',
            storeId: 'ABPhelpLinkStore'
        },
        helpTypeStore: {
            model: 'ABP.model.HelpLinkTypeModel',
            storeId: 'ABPhelpLinkTypeStore'
        }
    },

    LoadStoreData: function () {
        var me = this;
        var plugins = ABP.util.PluginManager.config.registeredPlugins;
        var records = [];
        var types = [];
        var typeObj = {};
        var propt, name, plugAddress, currNav, i, j, links;
        var foundType;
        for (propt in plugins) {
            if (plugins.hasOwnProperty(propt)) {
                name = plugins[propt];
                plugAddress = name.split(".");
                currNav = window;
                typeObj = {};
                prodObj = {};
                for (i = 0; i < plugAddress.length; ++i) {
                    currNav = currNav[plugAddress[i]];
                }
                if (currNav.prototype.config.helpLinks && currNav.prototype.config.helpLinks.length > 0) {
                    links = currNav.prototype.config.helpLinks;
                } else {
                    links = false;
                }
                if (links) {
                    for (i = 0; i < links.length; ++i) {
                        records.push(links[i]);
                        typeObj = {};
                        prodObj = {};
                        foundType = false;
                        for (j = 0; j < types.length; ++j) {
                            if (types[j].type === links[i].type) {
                                foundType = true;
                                break;
                            }
                        }
                        if (!foundType) {
                            typeObj.text = typeObj.type = links[i].type;
                            types.push(typeObj);
                        }
                    }
                }
            }
        }
        me.getStore('helpLinkStore').loadData(records);
        me.getStore('helpTypeStore').loadData(types);
    }

});