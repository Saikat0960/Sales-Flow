Ext.define('ABP.view.launch.login.LoginModel', {
    requires: [
        'ABP.model.SettingsLanguageModel'
    ],
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.loginmodel',

    data: {
        username: '',
        password: '',
        lan_selection: null,
        selected_environment: '',
        selected_language: ''
    },
    stores: {
        login_settingsStore: {
            model: 'ABP.model.SettingsLanguageModel'
        }
    },

    formulas: {
        canRecoverPassword: {
            bind: {
                _canRecoverPassword: '{bootstrapConf.settings.canRecoverPassword}',
                _b2cAuth: '{b2cAuth}'
            },
            get: function (data) {
                if (data._b2cAuth === false && (data._canRecoverPassword === true || data._canRecoverPassword === "true")) {
                    return true;
                }
                return false;
            }
        },
        canKeepMeSignedIn: {
            bind: {
                _canKeepMeSignedIn: '{bootstrapConf.settings.canKeepMeSignedIn}',
                _isOffline: '{isOffline}',
                _offlineMode: '{offlineMode}'
            },
            get: function (data) {
                // For now offline mode will not support keep me signed in.
                // This is because no integrity checks can be done, force user to sign in each time.
                if (data._isOffline || data._offlineMode) {
                    return false;
                }
                if (data._canKeepMeSignedIn === true || data._canKeepMeSignedIn === "true") {
                    return true;
                }
                return false;
            }
        },
        keepMeSignedInIcon: {
            bind: {
                _checked: '{keepMeSignedIn}'
            },
            get: function (data) {
                var ret;
                if (data._checked) {
                    ret = "icon-checked-square"
                } else {
                    ret = "icon-unchecked-square"
                }
                return ret;
            }
        },
        allowServiceChange: {
            bind: {
                _allowServiceChange: '{bootstrapConf.settings.allowServiceChange}'
            },
            get: function (data) {
                if (data._allowServiceChange === true || data._allowServiceChange === "true") {
                    return true;
                }
                return false;
            }
        },
        preauthenticated: {
            bind: {
                _authenticatedUserName: '{bootstrapConf.authenticatedUserName}',
                _authenticationType: '{bootstrapConf.settings.authenticationType}'
            },
            get: function (data) {
                if (data._authenticationType === 'integrated' && data._authenticatedUserName !== undefined && data._authenticatedUserName !== null && data._authenticatedUserName !== '') {
                    this.set('username', data._authenticatedUserName);
                    return true;
                }
                return false;
            }
        },
        canselectuser: {
            bind: {
                _canKeepMultipleUsersSignedIn: '{bootstrapConf.settings.canKeepMultipleUsersSignedIn}',
            },
            get: function (data) {
                // Allowed to select users?
                if (data._canKeepMultipleUsersSignedIn) {
                    // Are there any saved users?
                    var userData = ABP.util.LocalStorage.getUserData();
                    if (userData && userData.length > 0) {
                        return true;
                    }
                }
                return false;
            }
        },
        environment: {
            bind: {
                _avail: '{bootstrapConf.availableEnvironments}',
                _selected: '{selected_environment}',
                _default: '{bootstrapConf.defaultEnvironment}'
            },
            get: function (data) {
                var avail = data._avail;
                var i;

                if (data._selected && avail) {
                    for (i = 0; i < avail.length; ++i) {
                        if (avail[i].id === data._selected || avail[i].name === data._selected) {
                            return avail[i].id;
                        }
                    }
                }
                if (data._default && avail) {
                    for (i = 0; i < avail.length; ++i) {
                        if (avail[i].id === data._default || avail[i].name === data._default) {
                            return avail[i].id;
                        }
                    }
                }

                if (avail && avail.length > 0) {
                    return avail[0].id;
                }

                return null;
            }
        },

        hideEnvironment: {
            bind: {
                environments: '{bootstrapConf.availableEnvironments}',
                simplifyControls: '{bootstrapConf.settings.showSimpleLogin}'
            },
            get: function (data) {
                // If not using the simplifed layout then always show the environment.
                if (!data.simplifyControls) {
                    return false;
                }

                // if we only have 1 environment, then we can hide the environments combo
                if (data.environments && data.environments.length === 1) {
                    return true;
                }

                // All other scenarios, show the environment combo
                return false;
            }
        },

        hideLanguage: {
            bind: {
                environment: '{env_selection}',
                simplifyControls: '{bootstrapConf.settings.showSimpleLogin}'
            },
            get: function (data) {
                // If not using the simplifed layout then always show the environment.
                if (!data.simplifyControls) {
                    return false;
                }

                // If there is no selected environment show the language, something has failed
                // as we should always have a selected environment.
                if (!data.environment) {
                    return false;
                }

                // if we only have 1 language, then we can hide the environments combo
                if (data.environment.data && data.environment.data.languages && data.environment.data.languages.length === 1) {
                    return true;
                }

                // All other scenarios, show the languages combo
                return false;
            }
        },
        language: {
            bind: {
                _env: '{env_selection}',
                _avail: '{bootstrapConf.availableEnvironments}',
                _def: '{selected_language}'
            },
            get: function (data) {
                var env, i, lang;
                if (data._def && data._env && data._avail) {
                    for (i = 0; i < data._avail.length; ++i) {
                        if (data._avail[i].id === data._env.id) {
                            env = data._avail[i];
                            break;
                        }
                    }
                    if (env) {
                        if (env.languages && env.languages.length > 0) {
                            for (i = 0; i < env.languages.length; ++i) {
                                if (env.languages[i].key === data._def) {
                                    lang = env.languages[i];
                                    break;
                                }
                            }
                            if (lang) {
                                return lang.key;
                            }
                            return env.languages[0].key;
                        }
                    }

                    return null;
                }

                if (data._env && data._avail) {
                    for (i = 0; i < data._avail.length; ++i) {
                        if (data._avail[i].id === data._env.id) {
                            env = data._avail[i];
                            break;
                        }
                    }
                    if (env) {
                        if (env.languages && env.languages.length > 0) {
                            return env.languages[0].key;
                        }
                    }
                }

                return null;
            }
        },

        extraLoginFields: {
            bind: {
                __extraField: '{bootstrapConf.settings.extraLoginFields}'
            },
            get: function (data) {
                var ret = [];
                var classic = ABP.util.Common.getClassic();
                var saved;
                var i = 0;
                if (data.__extraField) {
                    for (i = 0; i < data.__extraField.length; ++i) {
                        if (this.checkForExistingFieldId(ret, data.__extraField[i].fieldId)) {
                            saved = this.checkForSavedValue(data.__extraField[i].fieldId);
                            if (classic) {
                                if (data.__extraField[i].type) {
                                    if (data.__extraField[i].type === 'text') {
                                        ret.push({
                                            xtype: 'textfield',
                                            cls: 'a-extraloginfield-text-' + data.__extraField[i].fieldId,
                                            width: '100%',
                                            labelAlign: 'top',
                                            fieldLabel: ABP.util.Common.geti18nString(data.__extraField[i].label),
                                            itemId: 'extraLoginFields_' + data.__extraField[i].fieldId,
                                            fieldId: data.__extraField[i].fieldId,
                                            required: data.__extraField[i].required || false,
                                            request: data.__extraField[i].request,
                                            value: saved || data.__extraField[i].value || ""
                                        });
                                    } else if (data.__extraField[i].type === 'list' && data.__extraField[i].options && data.__extraField[i].options.length > 0) {
                                        ret.push({
                                            xtype: 'combo',
                                            cls: 'launch-combo-box a-extraloginfield-list-' + data.__extraField[i].fieldId,
                                            width: '100%',
                                            labelAlign: 'top',
                                            fieldLabel: ABP.util.Common.geti18nString(data.__extraField[i].label),
                                            itemId: 'extraLoginFields_' + data.__extraField[i].fieldId,
                                            fieldId: data.__extraField[i].fieldId,
                                            store: {
                                                data: data.__extraField[i].options
                                            },
                                            displayField: 'name',
                                            value: saved || data.__extraField[i].options[0].key,
                                            valueField: 'key',
                                            triggerAction: 'all',
                                            allowBlank: false,
                                            labelWidth: 0,
                                            editable: false,
                                            autoSelect: true,
                                            required: data.__extraField[i].required || false,
                                            request: data.__extraField[i].request
                                        });
                                    } else if (data.__extraField[i].type === 'toggle') {
                                        var isActive = Ext.isBoolean(saved) ? saved : data.__extraField[i].active === "true" || data.__extraField[i].active === true;
                                        ret.push({
                                            xtype: 'button',
                                            cls: 'login-keepme',
                                            fieldId: data.__extraField[i].fieldId,
                                            itemId: 'extraLoginFields_' + data.__extraField[i].fieldId,
                                            width: '100%',
                                            focusCls: '',
                                            text: ABP.util.Common.geti18nString(data.__extraField[i].text),
                                            iconCls: isActive ? 'icon-checked-square' : 'icon-unchecked-square',
                                            active: isActive,
                                            value: isActive,
                                            handler: function () {
                                                this.active = !this.active;
                                                if (this.active) {
                                                    this.setIconCls("icon-checked-square");
                                                } else {
                                                    this.setIconCls("icon-unchecked-square");
                                                }
                                                this.value = this.active;
                                            },
                                            required: data.__extraField[i].required || false,
                                            request: data.__extraField[i].request,
                                            getRequired: function () {
                                                return this.required;
                                            }
                                        });
                                    } else if (data.__extraField[i].type === 'number') {
                                        var len = null;
                                        if (data.__extraField[i].maxVal) {
                                            len = data.__extraField[i].maxVal.length;
                                        }
                                        ret.push({
                                            xtype: 'numberfield',
                                            cls: 'a-extrasettingsfield-text-' + data.__extraField[i].fieldId,
                                            width: '100%',
                                            labelAlign: 'top',
                                            fieldLabel: ABP.util.Common.geti18nString(data.__extraField[i].label),
                                            itemId: 'extraSettingsFields' + data.__extraField[i].fieldId,
                                            fieldId: data.__extraField[i].fieldId,
                                            value: saved || "",
                                            required: data.__extraField[i].required || false,
                                            maxValue: data.__extraField[i].maxVal ? parseFloat(data.__extraField[i].maxVal) : null,
                                            minValue: data.__extraField[i].minVal ? parseFloat(data.__extraField[i].minVal) : null,
                                            maxLength: len,
                                            enforceMaxLength: true,
                                            checkValue: function () {
                                                var ret = true;
                                                var val = this.getValue();
                                                var maxVal = this.maxValue;
                                                var minVal = this.minValue;
                                                var valString;
                                                if (minVal && val < minVal) {
                                                    valString = ABP.util.Common.geti18nString('login_extraValue');
                                                    ret = false;

                                                    ABP.view.base.popUp.PopUp.showError(this.getEmptyText() + ' ' + valString + ' (' + minVal + '-' + maxVal + ')');
                                                } else if (maxVal && val > maxVal) {
                                                    valString = ABP.util.Common.geti18nString('login_extraValue');
                                                    ret = false;

                                                    ABP.view.base.popUp.PopUp.showError(this.getEmptyText() + ' ' + valString + ' (' + minVal + '-' + maxVal + ')');
                                                }
                                                return ret;
                                            }
                                        });
                                    } else if (data.__extraField[i].type === 'button') {
                                        ret.push(this.__makeClassicButton(data.__extraField[i]))
                                    }
                                }
                            } else {
                                if (data.__extraField[i].type) {
                                    if (data.__extraField[i].type === 'text') {
                                        ret.push({
                                            xtype: 'textfield',
                                            cls: ['x-unselectable', 'login-form', 'a-extraloginfield-text-' + data.__extraField[i].fieldId],
                                            width: '100%',
                                            clearable: false,
                                            allowBlank: 'false',
                                            labelAlign: 'top',
                                            label: ABP.util.Common.geti18nString(data.__extraField[i].label),
                                            itemId: 'extraLoginFields_' + data.__extraField[i].fieldId,
                                            fieldId: data.__extraField[i].fieldId,
                                            required: data.__extraField[i].required || false,
                                            request: data.__extraField[i].request,
                                            value: saved || ""
                                        });
                                    } else if (data.__extraField[i].type === 'list' && data.__extraField[i].options && data.__extraField[i].options.length > 0) {
                                        ret.push({
                                            xtype: 'selectfield',
                                            cls: ['login-form', 'a-extraloginfield-list-' + data.__extraField[i].fieldId],
                                            width: '100%',
                                            labelAlign: 'top',
                                            label: ABP.util.Common.geti18nString(data.__extraField[i].label),
                                            itemId: 'extraLoginFields_' + data.__extraField[i].fieldId,
                                            fieldId: data.__extraField[i].fieldId,
                                            store: {
                                                data: data.__extraField[i].options
                                            },
                                            displayField: 'name',
                                            value: saved || data.__extraField[i].options[0].key,
                                            valueField: 'key',
                                            triggerAction: 'all',
                                            allowBlank: false,
                                            labelWidth: 0,
                                            editable: false,
                                            autoSelect: true,
                                            required: data.__extraField[i].required || false,
                                            request: data.__extraField[i].request
                                        });
                                    } else if (data.__extraField[i].type === 'toggle') {
                                        var isActive = Ext.isBoolean(saved) ? saved : data.__extraField[i].active === "true" || data.__extraField[i].active === true;
                                        ret.push({
                                            xtype: 'button',
                                            cls: ['login-keepme', 'a-extraloginfield-button' + data.__extraField[i].fieldId],
                                            itemId: 'extraLoginFields_' + data.__extraField[i].fieldId,
                                            fieldId: data.__extraField[i].fieldId,
                                            text: ABP.util.Common.geti18nString(data.__extraField[i].text),
                                            iconCls: isActive ? 'icon-checked-square' : 'icon-unchecked-square',
                                            active: isActive,
                                            value: isActive,
                                            handler: function () {
                                                this.active = !this.active;
                                                if (this.active) {
                                                    this.setIconCls("icon-checked-square");
                                                } else {
                                                    this.setIconCls("icon-unchecked-square");
                                                }
                                                this.setValue(this.active);
                                            },
                                            width: '100%',
                                            request: data.__extraField[i].request,
                                            required: data.__extraField[i].required || false,
                                            getRequired: function () {
                                                return this.required;
                                            }
                                        });
                                    } else if (data.__extraField[i].type === 'number') {
                                        ret.push({
                                            xtype: 'abpnumberfield',
                                            cls: ['x-unselectable', 'login-form', 'a-extraloginfield-text-' + data.__extraField[i].fieldId],
                                            width: '100%',
                                            clearable: false,
                                            allowBlank: 'false',
                                            labelAlign: 'top',
                                            label: ABP.util.Common.geti18nString(data.__extraField[i].label),
                                            itemId: 'extraSettingsFields' + data.__extraField[i].fieldId,
                                            fieldId: data.__extraField[i].fieldId,
                                            required: data.__extraField[i].required || false,
                                            maxValue: data.__extraField[i].maxVal ? parseFloat(data.__extraField[i].maxVal) : null,
                                            minValue: data.__extraField[i].minVal ? parseFloat(data.__extraField[i].minVal) : null,
                                            value: saved || ""
                                        });
                                    } else if (data.__extraField[i].type === 'button') {
                                        ret.push(this.__makeModernButton(data.__extraField[i]))
                                    }
                                }
                            }
                        }
                    }
                }
                return ret;
            }
        },

        loginBtnText: {
            bind: {
                _online: '{i18n.login_signin_btn}',
                _offline: '{i18n.login_offline_signin_btn}',
                _isOffline: '{isOffline}',
                _offlineMode: '{offlineMode}'
            },
            get: function (data) {
                if (data._isOffline || data._offlineMode) {
                    return data._offline;
                } else {
                    return data._online;
                }
            }
        },

        passwordText: {
            bind: {
                _online: '{i18n.login_password}',
                _offline: '{i18n.offline_login_password}',
                _isOffline: '{isOffline}',
                _offlineMode: '{offlineMode}'
            },
            get: function (data) {
                if (data._isOffline || data._offlineMode) {
                    try {
                        var bootstrapConfig = this.get('bootstrapConf');
                        if (bootstrapConfig.offlineAuthenticationType && bootstrapConfig.offlineAuthenticationType === 1) {
                            return data._offline;
                        }
                    }
                    catch (err) {
                        return data._online;
                    }
                    return data._offline;
                } else {
                    return data._online;
                }
            }
        },

        // Do not show password button if the user was preauthenticated or they are offline and using "None" as the offline auth type.
        showPasswordField: {
            bind: {
                _isOffline: '{isOffline}',
                _offlineMode: '{offlineMode}'

            },
            get: function (data) {
                var offlineAuthType = this.get('bootstrapConf.offlineAuthenticationType');
                var preAuth = this.get('preauthenticated');
                var b2cAuth = this.get('b2cAuth');
                var offlineNoAuth = ((data._isOffline || data._offlineMode) && offlineAuthType === 0);
                if (b2cAuth || preAuth || offlineNoAuth) {
                    return false;
                } else {
                    return true;
                }
            }
        }
    },

    checkForExistingFieldId: function (where, what) {
        var i = 0;
        var ret = true;
        for (i = 0; i < where.length; ++i) {
            if (where[i].fieldId === what) {
                ret = false;
                break;
            }
        }
        return ret;
    },
    checkForSavedValue: function (fieldId) {
        var local = ABP.util.LocalStorage.get('loginextrafields');
        var json;
        var ret = null;
        var i = 0;
        if (local) {
            json = JSON.parse(local);
            for (i = 0; i < json.length; ++i) {
                if (json[i].fieldId === fieldId) {
                    ret = json[i].val;
                    break;
                }
            }
        }
        return ret;
    },
    __makeClassicButton: function (field) {
        // 3 types of buttons:
        // 1. option - provides an xtype to open in a modal window
        // 2. redirect - provides a url to redirect the browser to
        // 3. newTab - will open a new tab in the browser (not for native apps)
        var type = field.action;
        var handler;
        var popup;
        switch (type) {
            case 'popup':
                handler = function () {
                    // make popup with save and close buttons and center section for defined xtype
                    // Save - requests json data from child component for bootstrap/config
                    // Close - closes window
                    popup = Ext.create('ABP.view.base.popUp.PopUpFrame', { config: { buttonInfo: field } });
                    popup.show();
                };
                break;
            case 'redirect':
                handler = function () {
                    window.location.href = field.url;
                };
                break;
            case 'newTab':
                handler = function () {
                    window.open(field.url);
                };
                break;
        }
        return {
            xtype: 'button',
            handler: handler,
            cls: 'btn-extra a-extrasettingsfield-button-' + field.fieldId,
            itemId: 'extraSettingsFields' + field.fieldId,
            fieldId: field.fieldId,
            bind: {
                text: field.labelKey ? '{i18n.' + field.labelKey + '}' : field.label
            },
            width: '100%',
            fieldData: null,
            request: field.request,
            setFieldData: function (data) {
                this.fieldData = data;
            },
            getFieldData: function () {
                return this.fieldData;
            },
            getRequired: function () {
                return false;
            }
        };
    },

    __makeModernButton: function (field) {
        // 3 types of buttons:
        // 1. option - provides an xtype to open in a modal window
        // 2. redirect - provides a url to redirect the browser to
        // 3. newTab - will open a new tab in the browser (not for native apps)
        var type = field.action;
        var handler;
        var popup;
        switch (type) {
            case 'popup':
                handler = function () {
                    // make popup with save and close buttons and center section for defined xtype
                    // Save - requests json data from child component for bootstrap/config
                    // Close - closes window
                    popup = Ext.create({ xtype: 'popupframe', config: { buttonInfo: field } });
                    popup.show();
                };
                break;
            case 'redirect':
                handler = function () {
                    window.location.href = field.url;
                };
                break;
            case 'newTab':
                handler = function () {
                    window.open(field.url);
                };
                break;
        }
        return {
            xtype: 'button',
            handler: handler,
            cls: ['btn-login', 'login-form', 'a-extrasettingsfield-button-' + field.fieldId],
            itemId: 'extraSettingsFields' + field.fieldId,
            fieldId: field.fieldId,
            margin: '6 0 4 0',
            bind: {
                text: field.labelKey ? '{i18n.' + field.labelKey + '}' : field.label
            },
            width: '100%',
            fieldData: null,
            request: field.request,
            setFieldData: function (data) {
                this.fieldData = data;
            },
            getFieldData: function () {
                return this.fieldData;
            },
            getRequired: function () {
                return false;
            }
        };
    }
});