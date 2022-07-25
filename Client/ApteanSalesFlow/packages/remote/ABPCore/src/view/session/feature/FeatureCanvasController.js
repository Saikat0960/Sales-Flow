Ext.define('ABP.view.session.feature.FeatureCanvasController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.featurecanvascontroller',

    listen: {
        controller: {
            '*': {
                featureCanvas_showFeature: 'showFeature',
                featureCanvas_showSetting: 'showSetting',
                featureCanvas_hideSetting: 'hideSetting',
                featureCanvas_triggerDefaultMenuItem: 'triggerDefaultMenuItem',
                featureCanvas_openSearchBar: '__openSearchBar'/*,
                featureCanvas_closeMainMenu: '__closeMainMenu',
                featureCanvas_closeMainMenuNow: '__closeMainMenuNow',
                featureCanvas_openMainMenu: '__openMainMenu'*/
            }
        },
        component: {
            '*': {
                abpHeaderPanel_closeView: 'closeView'
            }
        }
    },

    showFeature: function (feature, cbEvent, cbEventArgs) {
        var me = this;
        var view = me.getView();
        var appContainer = view.down("#applicationContainer");

        this.__clearAppContainer();

        appContainer.add(feature);

        if (cbEvent) {
            this.fireEvent(cbEvent, cbEventArgs);
        }
    },

    showSetting: function (feature) {
        var me = this;
        var view = me.getView();
        var settingsContainer = view.down("#settingsContainer");

        settingsContainer.removeAll(true, true);

        this.__setSettingsShow(true);

        settingsContainer.add({ xtype: feature });
    },

    hideSetting: function () {
        var me = this;
        var view = me.getView();
        var settingsContainer = view.down("#settingsContainer");

        this.__setSettingsShow(false)

        settingsContainer.removeAll();
    },

    closeView: function (feature) {
        var view = this.getView();
        var appChildren = view.down("#applicationContainer").items;
        var settingsChildren = view.down("#settingsContainer").items;

        var isAppChild = appChildren.contains(feature);
        var isSettingsChild = settingsChildren.contains(feature);

        if (isAppChild) {
            this.__clearAppContainer();
        }
        if (isSettingsChild) {
            this.hideSetting();
        }
    },

    triggerDefaultMenuItem: function () {
        var me = this;
        var loadPageInfo = me.getViewModel().data.conf.settings.loadPage;
        if (loadPageInfo) {
            me.fireEvent('main_fireAppEvent', loadPageInfo.appId, loadPageInfo.event, loadPageInfo.eventArgs);
        } else {
            var navMenu = me.getViewModel().data.conf.navMenu;
            for (var i = 0; i < navMenu.length; ++i) {
                if (navMenu[i].event) {
                    me.fireEvent('main_fireAppEvent', navMenu[i].appId, navMenu[i].event, navMenu[i].eventArgs);
                    break;
                } else if (navMenu[i].children && navMenu[i].children.length > 0) {
                    if (me.lookThroughChildren(navMenu[i].children)) {
                        break;
                    }
                }
            }
        }
    },

    lookThroughChildren: function (children) {
        var me = this;
        for (var i = 0; i < children.length; ++i) {
            if (children[i].event) {
                me.fireEvent('main_fireAppEvent', children[i].appId, children[i].event, children[i].eventArgs);
                return true;
            } else if (children[i].children && children[i].children.length > 0) {
                if (me.lookThroughChildren(children[i].children)) {
                    return true;
                }
            }
        }
        return false;
    },

    __setSettingsShow: function (showSettings) {
        var view = this.getView();
        var settingsContainer = view.down("#settingsContainer");
        var appContainer = view.down("#applicationContainer");

        if (showSettings === true) {
            appContainer.hide();
            settingsContainer.show();
        } else if (showSettings === false) {
            settingsContainer.hide();
            appContainer.show();
        }

        view.settingShown = showSettings;
    },

    __clearAppContainer: function () {
        var view = this.getView();
        var appContainer = view.down("#applicationContainer");

        if (ABP.util.Common.getModern()) {
            appContainer.removeAll(true, true);
        } else {
            appContainer.removeAll();
        }
    },

    __openSearchBar: function () {
        this.getViewModel().set('searchBar.open', true);
    },

    interpretSwipe: function (event, element, eOpts) {
        this.component.getController().fireEvent('thumbbar_handleSwipe', event, element, eOpts);
    }
});
