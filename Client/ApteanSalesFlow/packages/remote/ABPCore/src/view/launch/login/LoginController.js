/**
 * @private
 *
 */
Ext.define('ABP.view.launch.login.LoginController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.logincontroller',

    listen: {
        controller: {
            '*': {
                login_updateViewModel: 'updateViewModel'
                //login_UserHit: 'userEnter'
            }
        },
        component: {
            '*': {
                login_UserHit: 'userEnter',
                login_PassHit: 'loginButtonClick',
                login_environmentChanged: 'onEnvironmentChanged'//,
                //userUpdate: 'userUpdate'
            }
        }
    },

    // Note this is only used for Classic (Modern does not have a boxready event)
    onBoxready: function (event, fn) {
        var me = this,
            vm = me.getViewModel(),
            view = me.getView();

        // if the user name has a value set the focus into the
        // password field
        if (vm.get('username')) {
            view.down('#password').focus();
        } else {
            view.down('#username').focus();
        }

        me.checkForSignoutReason();
    },

    checkForSignoutReason: function () {
        // Check if there was a previous signout reason
        var reason = ABP.util.SessionStorage.get("SignoutReason");
        if (reason && reason !== 'user init') {
            ABP.util.SessionStorage.remove("SignoutReason");

            ABP.view.base.popUp.PopUp.showError(reason);
        }
    },

    onTabChanged: function (event) {
    },

    /**
     * Check whether the current browser allows us to write values into the local storage.
     */
    checkLocalStorageAccess: function () {
        if (!ABP.util.LocalStorage.localStorageWritable()) {
            ABP.view.base.popUp.PopUp.showError('Your browser settings are preventing the use of local storage.  Please change settings before opening this program.');
        }
    },

    initViewModel: function () {
        var me = this;
        me.checkLocalStorageAccess();

        var vm = me.getViewModel();

        // Transfer signout reason to model and remove from session storage
        var reason = ABP.util.SessionStorage.get("SignoutReason");
        if (reason && reason !== 'user init') {
            vm.set('loginErrorLabel', reason);
        }
        ABP.util.SessionStorage.remove("SignoutReason");
        var preauthUser = vm.get('bootstrapConf.authenticatedUserName');
        var authType = vm.get('bootstrapConf.settings.authenticationType');
        if (authType === 'integrated' && preauthUser !== undefined && preauthUser !== null && preauthUser !== "") {
            vm.set("username", preauthUser);
        } else {
            me.setInitialValue({
                toModelField: 'username',
                ifLocalStorageEnabledBy: 'bootstrapConf.settings.rememberUsername',
                useLocalStorageKey: 'SavedUsername'
            });
            me.setInitialValue({
                toModelField: 'password',
                ifLocalStorageEnabledBy: 'bootstrapConf.settings.rememberPassword', // Was canKeepMeSignedIn.
                useLocalStorageKey: 'SavedPassword'
            });
        }
        me.setInitialValue({
            toModelField: 'selected_environment',
            useDefaultValueFrom: 'bootstrapConf.defaultEnvironment',
            ifLocalStorageEnabledBy: 'bootstrapConf.settings.rememberEnvironment',
            useLocalStorageKey: 'SavedEnvironment'
        });
        me.setInitialValue({
            toModelField: 'selected_language',
            useDefaultValueFrom: 'bootstrapConf.settings.defaultLanguage',
            ifLocalStorageEnabledBy: 'bootstrapConf.settings.rememberLanguage',
            useLocalStorageKey: 'SavedLanguage'
        });
    },

    setInitialValue: function (opts) {
        var me = this;
        var vm = me.getViewModel();
        var initialValue = (opts.useDefaultValueFrom) ? vm.get(opts.useDefaultValueFrom) : '';
        var queryLS = (opts.ifLocalStorageEnabledBy) ? vm.get(opts.ifLocalStorageEnabledBy) : false;
        if (queryLS && (queryLS === true || queryLS === 'true')) {
            var savedValue = ABP.util.LocalStorage.get(opts.useLocalStorageKey);
            if (savedValue && (savedValue !== '') && (savedValue !== null)) {
                initialValue = savedValue;
            }
        }
        vm.set(opts.toModelField, initialValue);
    },

    /**
     * @private
     * Update the view model with the latest values in local storage.
     */
    updateViewModel: function () {
        var me = this;
        var vm = me.getViewModel();
        vm.set('username', ABP.util.LocalStorage.get('SavedUsername'));
        vm.set('password', ABP.util.LocalStorage.get('SavedPassword'));
        vm.set('selected_environment', ABP.util.LocalStorage.get('SavedEnvironment'));
        vm.set('selected_language', ABP.util.LocalStorage.get('SavedLanguage'));
    },

    loginButtonClick: function () {
        var me = this;
        var view = me.getView();
        ABP.util.Common.flushAllBindings(view);// Immediately flush all control values to the view model.
        var vm = me.getViewModel();
        // There seems to be a problem sometimes with the password field value not flushing to the view model.
        // So it is done explicitly here.
        var usernameField = me.lookupReference('usernameField');
        if (usernameField) {
            vm.set('username', usernameField.getValue())
        }
        var passfield = me.lookupReference('passwordField');
        if (passfield) {
            passfield.blur();
            vm.set('password', passfield.getValue());
        }
        var complete = me.checkInputs();
        var keep = vm.get('keepMeSignedIn');
        var locale = 'en';
        var extras = view.down('#loginExtraFieldCont');
        var i = 0;
        var configExtras = [];
        var extraFields = [];
        var extraSettings = me.getExtraSettingsFields();
        if (vm.get('lan_selection')) {
            locale = vm.get('lan_selection').data.key;
        } else {
            if (vm.get('bootstrapConf.settings.defaultLanguage')) {
                locale = vm.get('bootstrapConf.settings.defaultLanguage');
            }
        }
        var env = vm.get('environment');
        if (vm.get('env_selection')) {
            env = vm.get('env_selection').id;
        }
        if (ABP.util.Common.getClassic()) {
            extras = extras.items.items;
        } else {
            extras = extras.getInnerItems();
        }

        if (complete === true) {
            var jsonData = {
                'environment': env,
                'logonId': vm.get('username'),
                'password': vm.get('password'),
                'locale': locale,
                'forceLogin': false
            };
            if (extras.length > 0) {
                for (i = 0; i < extras.length; ++i) {
                    var extraField = extras[i];
                    if (extraField.request === 'authentication') {
                        if (extraField.getValue && extraField.getValue() !== undefined) {
                            jsonData[extraField.fieldId] = extraField.getValue();
                        } else {
                            if (extraField.getFieldData && extraField.getFieldData() !== undefined) {
                                jsonData[extraField.fieldId] = extraField.getFieldData();
                            }
                        }
                    } else if (extraField.request === 'configuration') {
                        if (extraField.getValue && extraField.getValue() !== undefined) {
                            configExtras.push({ fieldId: extraField.fieldId, val: extraField.getValue() });
                        } else {
                            if (extraField.getFieldData && extraField.getFieldData() !== undefined) {
                                configExtras.push({ fieldId: extraField.fieldId, val: extraField.getFieldData() });
                            }
                        }
                    }
                    if (extraField.getValue && extraField.getValue() !== undefined) {
                        extraFields.push({ fieldId: extraField.fieldId, val: extraField.getValue() });
                    } else {
                        if (extraField.getFieldData && extraField.getFieldData() !== undefined) {
                            extraFields.push({ fieldId: extraField.fieldId, val: extraField.getFieldData() });
                        }
                    }
                }
            }
            if (extraSettings && extraSettings.length > 0) {
                for (i = 0; i < extraSettings.length; ++i) {
                    jsonData[extraSettings[i].fieldId] = extraSettings[i].val;
                }
            }

            ABP.util.LocalStorage.remove('loginextrafields');
            vm.getParent().getParent().set('configurationExtraInfo', configExtras);
            vm.getParent().getParent().set('loginExtraFieldsFilled', extraFields);

            if (extras.length > 0) {
                this.fireEvent('main_saveExtraFieldInfo');
            }
            this.fireEvent('main_Authenticate', jsonData, keep);
        }
        else {
            if (!complete) {
                ABP.view.base.popUp.PopUp.showError('login_all_fields');
            } else {
                ABP.view.base.popUp.PopUp.showError(complete);
            }
        }
    },

    /**
     * @private
     * Handle the user clicking on the settings link
     */
    onSettingsClick: function () {
        this.fireEvent('launchCarousel_Settings', this);
    },

    /**
     * @private
     * Handle the user clicking on the forgotten password link
     */
    onForgotPasswordClick: function () {
        this.fireEvent('launchCarousel_Maintenance', 'recoverpassword');
    },

    onEnvironmentChanged: function (newVal) {
        var me = this;
        var vM = me.getViewModel();
        var environments = vM.data.main_environmentStore.data;
        if (newVal) {
            if (environments !== undefined && environments.length > 0) {
                var newEnv = environments.getByKey(newVal.id || newVal);
                if (newEnv.data.languages) {
                    var langs = vM.getStore('login_settingsStore');
                    if (!Ext.isArray(newEnv.data.languages)) {
                        if (newEnv.data.languages.key) {
                            langs.loadData([newEnv.data.languages]);
                            me.showLanguages(true);
                        } else {
                            me.showLanguages(false);
                        }
                    } else {
                        var copy = newEnv.data.languages.slice(0);
                        var languages = me.getOrderedLanguages(copy);
                        if (languages) {
                            langs.loadData(languages);
                            me.showLanguages(true);
                        } else {
                            me.showLanguages(false);
                        }
                    }
                } else {
                    me.showLanguages(false);
                }
            }
        }
    },

    getOrderedLanguages: function (newLangs) {
        var me = this;
        var vM = me.getViewModel();
        var def = vM.get('bootstrapConf.settings.defaultLanguage');
        var i;
        var defaultLang;
        var rememLang;
        var remLang = ABP.util.LocalStorage.get('SavedLanguage');
        var retLangs = null;
        var removal = [];
        if (def !== undefined && def !== null && newLangs.length > 0) {
            for (i = newLangs.length - 1; i > -1; --i) {
                if (!newLangs[i].key || !newLangs[i].name) {
                    removal.push(i);
                }
            }
            if (removal.length > 0) {
                for (i = 0; i < removal.length; ++i) {
                    newLangs.splice(i, 1);
                }
            }
            if (newLangs.length > 0) {
                for (i = 0; i < newLangs.length; ++i) {
                    if (def === newLangs[i].key) {
                        defaultLang = [];
                        defaultLang.push(newLangs[i]);
                        newLangs.splice(i, 1);
                        retLangs = defaultLang.concat(newLangs);
                    }
                }
            }
            if (newLangs.length > 0 && retLangs === null) {
                retLangs = newLangs;
            }
        }
        else if (!def && newLangs.length > 0) {
            retLangs = newLangs;
        }
        if (remLang && retLangs) {
            removal = [];
            for (i = retLangs.length - 1; i > -1; --i) {
                if (!retLangs[i].key || !retLangs[i].name) {
                    removal.push(i);
                }
            }
            if (removal.length > 0) {
                for (i = 0; i < removal.length; ++i) {
                    retLangs.splice(i, 1);
                }
            }
            if (retLangs.length > 0) {
                for (i = 0; i < retLangs.length; ++i) {
                    if (remLang === retLangs[i].key) {
                        rememLang = [];
                        rememLang.push(retLangs[i]);
                        retLangs.splice(i, 1);
                        retLangs = rememLang.concat(retLangs);
                    }
                }
            }
        }
        return retLangs;
    },

    showLanguages: function (showBool) {
        var me = this;
        var vm = me.getViewModel();
        var combo = me.getView().down('#login-language');
        if (showBool) {
            combo.focusable = true;
            if (ABP.util.Common.getClassic()) {
                combo.select(combo.store.data.items[0]);
            }
        } else {
            combo.focusable = false;
        }
    },
    checkInputs: function () {
        var me = this;
        var view = me.getView();
        var ret = true;
        if (ABP.util.Msal.enabled) {
            // If B2C auth is enabled we do not care if these fields are filled out.
            return true;
        }
        var user = view.down('#username');
        var pass = view.down('#password');
        //var env = view.down('#login-environment');
        //var lang = view.down('#login-language');
        var extras = view.down('#loginExtraFieldCont');
        var i = 0;
        if (user.getValue().length <= 0) {
            ret = false;
            user.addCls('login-error');
        } else {
            user.removeCls('login-error');
        }
        if (pass.isVisible() && pass.getValue().length <= 0) {
            ret = false;
            pass.addCls('login-error');
        } else {
            pass.removeCls('login-error');
        }
        if (extras.items && extras.items.items && !Ext.isEmpty(extras.items.items)) {
            for (i = 0; i < extras.items.items.length; ++i) {
                if (extras.items.items[i].required) {
                    if (extras.items.items[i].getValue() !== "") {
                        extras.items.items[i].removeCls('login-error');
                    } else {
                        ret = false;
                        extras.items.items[i].addCls('login-error');
                    }
                }
                if (extras.items.items[i].checkValue && !extras.items.items[i].checkValue()) {
                    if (extras.items.items[i].getErrorString) {
                        ret = extras.items.items[i].getErrorString();
                    } else {
                        ret = false;
                    }
                    extras.items.items[i].addCls('login-error');
                }
            }
        }
        return ret;
    },

    keepMeSignedInClicked: function () {
        var me = this;
        var vm = me.getViewModel();
        var checked = vm.get('keepMeSignedIn');
        vm.set('keepMeSignedIn', !checked);
    },

    userEnter: function () {
        var me = this;
        var passfield = me.lookupReference('passwordField');
        if (passfield) {
            passfield.focus();
        }
    },

    getExtraSettingsFields: function () {
        var ret;
        var local = ABP.util.LocalStorage.get('settingsextrafields');
        if (local) {
            ret = JSON.parse(local);
        } else {
            ret = this.getViewModel().get('prebootstrapExtraSettingsFilled');
        }
        return ret;
    }
});
