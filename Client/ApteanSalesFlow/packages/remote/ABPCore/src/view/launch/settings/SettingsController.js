Ext.define('ABP.view.launch.settings.SettingsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.settingscontroller',

    listen: {
        component: {
            '*': {
                settings_save: 'saveButtonClick',
                server_url_select: 'serverUrlSelect',
                delete_server_url: 'deleteServerUrl'
            }
        },
        controller: {
            '*': {
                settings_refresh_server_url: 'refreshServerUrl'
            }
        }
    },

    /**
     * @private
     * Called when the view initializes.
     * This is called after the view's initComponent method has been called.
     */
    init: function () {
        // Add the current server URL to the list of known server URLs
        // if it is not already there.
        var serverUrl = ABP.util.LocalStorage.get('ServerUrl');
        this.saveServerUrl(serverUrl);
    },

    /**
     * @private
     * The expand/collapse URLs button has been clicked.
     * NOTE: This function is now only used by modern
     */
    onMoreServerUrlsClick: function () {
        var view = this.getView();
        var moreServerUrls = view.down('#moreServerUrls');
        if (moreServerUrls && !(moreServerUrls.destroyed)) {
            var collapsed = (moreServerUrls.getCollapsed() === false ? false : true); // Note that getCollaposed can a boolean or a string like 'top' in Classic.
            moreServerUrls[Ext.toolkit === "modern" ? "toggleCollapsed" : "toggleCollapse"](!collapsed, null); // Modern and Classic have slightly different method names for toggle collapsed.
            // Adjust the up/down expand arrow.
            var moreServerUrlsButton = view.down('#moreServerUrls-label');
            if (moreServerUrlsButton) {
                if (collapsed) {
                    moreServerUrlsButton.setIconCls('icon-navigate-open');
                } else {
                    moreServerUrlsButton.setIconCls('icon-navigate-close');
                }
            }
        }
    },

    /**
     * @private
     * One of the previously used server URLs has been clicked.
     * This copies it to the main URL text field.
     * NOTE: This function is now only used by modern
     */
    serverUrlSelect: function (record) {
        if (record) {
            var view = this.getView();
            var url = view.down('#url');
            if (url) {
                url.setValue(record.get('url'));
            }
        }
    },

    /**
     * A previously used server URL is being deleted.
     */
    deleteServerUrl: function (record) {
        if (record) {
            var store = Ext.data.StoreManager.lookup('ABPServerUrlStore');
            if (store) {
                if (store) {
                    store.remove(record);
                }
            }
        }
    },

    /**
     * @private
     * Update the url field with the current value of ServerUrl in local storage.
     */
    refreshServerUrl: function () {
        var view = this.getView();
        var url = view.down('#url');
        if (url) {
            url.setValue(ABP.util.LocalStorage.get('ServerUrl'));
        }
    },

    backButtonClick: function () {
        this.fireEvent('launchCarousel_Login', this);
    },

    saveButtonClick: function () {
        var me = this;
        var view = me.getView();
        var url = view.down('#url').getValue();
        var goAhead = true;
        var vm;
        if (url.length <= 0) {
            vm = me.getViewModel();
            me.getView().down('#url').markInvalid(vm.get('i18n.login_all_fields'));
            ABP.view.base.popUp.PopUp.showPopup(vm.get('i18n.login_all_fields'), vm.get('i18n.error_ok_btn'));
        } else {
            me.getView().down('#url').clearInvalid();
            url = url.trim();

            if (!me.isValidServerUrl(url)) {
                ABP.view.base.popUp.PopUp.showPopup('login_settings_invalidurl');
                this.fireEvent('main_hideLoading');
                goAhead = false;
            }
            
            if (goAhead) {
                if (!view.down('#settingsExtraFieldCont') || me.extraFieldsCheck()) {
                    ABP.util.LocalStorage.set('ServerUrl', url);
                    me.saveServerUrl(url); // Make sure the entered URL is saved for future selection too.
                    this.fireEvent('main_relaunch', this);
                }
            }
        }
    },

    extraFieldsCheck: function () {
        var me = this;
        var vm = me.getViewModel();
        var view = me.getView();
        var extraFields = view.down('#settingsExtraFieldCont').items.items;
        var ret = true;
        var temp = [];
        var i = 0;
        if (!Ext.isEmpty(extraFields)) {
            for (i; i < extraFields.length; ++i) {
                if (extraFields[i].checkValue && !extraFields[i].checkValue()) {
                    ret = false;
                    break;
                }
                if (extraFields[i].getValue() !== "") {
                    var fieldId = extraFields[i].getItemId().slice(19);
                    var fieldValue = null;
                    // Combo/List.
                    if (extraFields[i].xtype === 'combo') {
                        fieldValue = extraFields[i].getRawValue();
                    } else if (extraFields[i].xtype === 'button' && Ext.isFunction(extraFields[i].getFieldData)) {
                        // Non-Toggle buttons.
                        buttonvals = extraFields[i].getFieldData();
                        if (buttonvals) {
                            for (var prop in buttonvals) {
                                temp.push({
                                    fieldId: prop,
                                    val: buttonvals[prop]
                                });
                            }
                            continue;
                        }
                    } else {
                        fieldValue = extraFields[i].getValue();
                    }
                    // Push the fieldId and value.
                    temp.push({
                        fieldId: fieldId,
                        val: fieldValue
                    });
                } else {
                    ret = false;
                    ABP.view.base.popUp.PopUp.showError('login_all_fields');
                    break;
                }
            }
            vm.getParent().getParent().set('prebootstrapExtraSettingsFilled', temp);
            ABP.util.LocalStorage.remove('settingsextrafields');
        }
        return ret;
    },

    isValidServerUrl: function (url) {
        if (!url) {
            return false;
        }
        return (/^(?:(?:https?):\/\/)(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*|(?:(?:[a-z\u00a1-\uffff0-9]+_?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*)(?::\d{2,5})?(?:\/[^\s]*)?$/i).test(url);
    },

    privates: {
        /**
         * @private
         * Add the  server URL to the list of known server URLs if it is not already there.
         * @param {String} serverUrl The URL to add.
         */
        saveServerUrl: function (serverUrl) {
            if (!Ext.isEmpty(serverUrl)) { // Empty URLs are not stored.
                var store = Ext.data.StoreManager.lookup('ABPServerUrlStore');
                if (store) {
                    if (store.find('url', serverUrl) === -1) {
                        store.insert(0, { url: serverUrl }); // Put the new URL to the top of the list.
                    }
                }
            }
        }
    }
});