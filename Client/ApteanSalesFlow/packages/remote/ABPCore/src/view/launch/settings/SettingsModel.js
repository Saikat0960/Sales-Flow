Ext.define('ABP.view.launch.settings.SettingsModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.settingsmodel',
    requires: [
        'ABP.store.ABPServerUrlStore'
    ],

    data: {
        url: {},
        language: {}
    },

    stores: {
        serverUrlStore: 'ABPServerUrlStore'
    },


    formulas: {
        saveButtonWidth: {
            bind: {
                _bootstrapped: '{bootstrapped}'
            },
            get: function (data) {
                if (data._bootstrapped) {
                    return '49%';
                }
                return '100%';
            }
        },
        extraSettingsFields: {
            bind: {
                __injectedFields: '{injectedSettingsFields}',
                __extraFields: '{bootstrapConf.settings.extraSettingsFields}',
                __filledFields: '{prebootstrapExtraSettingsFilled}'
            },
            get: function (data) {
                var ret = [];
                var classic = ABP.util.Common.getClassic();
                var i = 0;
                var matchedVal, savedVal;
                if (data.__injectedFields) {
                    if (classic) {
                        for (i = 0; i < data.__injectedFields.length; i++) {
                            if (this.__checkForExistingFieldId(ret, data.__injectedFields[i].fieldId)) {
                                if (!Ext.isEmpty(data.__filledFields)) {
                                    matchedVal = this.__matchField(data.__injectedFields[i], data.__filledFields);
                                } else {
                                    savedVal = this.__checkForSavedValue(data.__injectedFields[i].fieldId);
                                    if (!Ext.isEmpty(savedVal)) {
                                        matchedVal = savedVal;
                                    }
                                }
                                if (data.__injectedFields[i].type) {
                                    if (data.__injectedFields[i].type === 'text') {
                                        ret.push(this.__makeClassicTextField(data.__injectedFields[i], matchedVal));
                                    } else if (data.__injectedFields[i].type === 'list' && data.__injectedFields[i].options && data.__injectedFields[i].options.length > 0) {
                                        ret.push(this.__makeClassicListField(data.__injectedFields[i], matchedVal));
                                    } else if (data.__injectedFields[i].type === 'toggle') {
                                        ret.push(this.__makeClassicToggleField(data.__injectedFields[i], matchedVal));
                                    } else if (data.__injectedFields[i].type === 'number') {
                                        ret.push(this.__makeClassicNumericField(data.__injectedFields[i], matchedVal));
                                    } else if (data.__injectedFields[i].type === 'button') {
                                        ret.push(this.__makeClassicButton(data.__injectedFields[i], matchedVal));
                                    }
                                }
                            }
                        }
                    } else {
                        for (i = 0; i < data.__injectedFields.length; i++) {
                            if (this.__checkForExistingFieldId(ret, data.__injectedFields[i].fieldId)) {
                                if (!Ext.isEmpty(data.__filledFields)) {
                                    matchedVal = this.__matchField(data.__injectedFields[i], data.__filledFields);
                                } else {
                                    savedVal = this.__checkForSavedValue(data.__injectedFields[i].fieldId);
                                    if (!Ext.isEmpty(savedVal)) {
                                        matchedVal = savedVal;
                                    }
                                }
                                if (data.__injectedFields[i].type) {
                                    if (data.__injectedFields[i].type === 'text') {
                                        ret.push(this.__makeModernTextField(data.__injectedFields[i], matchedVal));
                                    } else if (data.__injectedFields[i].type === 'list' && data.__injectedFields[i].options && data.__injectedFields[i].options.length > 0) {
                                        ret.push(this.__makeModernListField(data.__injectedFields[i], matchedVal));
                                    } else if (data.__injectedFields[i].type === 'toggle') {
                                        ret.push(this.__makeModernToggleField(data.__injectedFields[i], matchedVal));
                                    } else if (data.__injectedFields[i].type === 'number') {
                                        ret.push(this.__makeModernNumericField(data.__injectedFields[i], matchedVal));
                                    } else if (data.__injectedFields[i].type === 'button') {
                                        ret.push(this.__makeModernButton(data.__injectedFields[i], matchedVal));
                                    }
                                }
                            }
                        }
                    }
                }
                if (data.__extraFields) {
                    if (classic) {
                        if (Ext.isArray(data.__extraFields)) {
                            for (i = 0; i < data.__extraFields.length; i++) {
                                if (this.__checkForExistingFieldId(ret, data.__extraFields[i].fieldId)) {
                                    if (!Ext.isEmpty(data.__filledFields)) {
                                        matchedVal = this.__matchField(data.__extraFields[i], data.__filledFields);
                                    } else {
                                        savedVal = this.__checkForSavedValue(data.__extraFields[i].fieldId);
                                        if (!Ext.isEmpty(savedVal)) {
                                            matchedVal = savedVal;
                                        }
                                    }
                                    if (data.__extraFields[i].type) {
                                        if (data.__extraFields[i].type === 'text') {
                                            ret.push(this.__makeClassicTextField(data.__extraFields[i], matchedVal));
                                        } else if (data.__extraFields[i].type === 'list' && data.__extraFields[i].options && data.__extraFields[i].options.length > 0) {
                                            ret.push(this.__makeClassicListField(data.__extraFields[i], matchedVal));
                                        } else if (data.__extraFields[i].type === 'toggle') {
                                            ret.push(this.__makeClassicToggleField(data.__extraFields[i], matchedVal));
                                        } else if (data.__extraFields[i].type === 'number') {
                                            ret.push(this.__makeClassicNumericField(data.__extraFields[i], matchedVal));
                                        } else if (data.__extraFields[i].type === 'button') {
                                            ret.push(this.__makeClassicButton(data.__extraFields[i], matchedVal));
                                        }
                                    }
                                }
                            }
                        } else {
                            if (this.__checkForExistingFieldId(ret, data.__extraFields.fieldId)) {
                                if (!Ext.isEmpty(data.__filledFields)) {
                                    matchedVal = this.__matchField(data.__extraFields, data.__filledFields);
                                } else {
                                    savevdVal = this.__checkForSavedValue(data.__extraFields.fieldId);
                                    if (!Ext.isEmpty(savedVal)) {
                                        matchedVal = savedVal;
                                    }
                                }
                                if (data.__extraFields.type) {
                                    if (data.__extraFields.type === 'text') {
                                        ret.push(this.__makeClassicTextField(data.__extraFields, matchedVal));
                                    } else if (data.__extraFields.type === 'list' && data.__extraFields.options && data.__extraFields.options.length > 0) {
                                        ret.push(this.__makeClassicListField(data.__extraFields, matchedVal));
                                    } else if (data.__extraFields.type === 'toggle') {
                                        ret.push(this.__makeClassicToggleField(data.__extraFields, matchedVal));
                                    } else if (data.__extraFields.type === 'button') {
                                        ret.push(this.__makeClassicButton(data.__extraFields, matchedVal));
                                    }
                                }
                            }
                        }
                    } else {
                        if (Ext.isArray(data.__extraFields)) {
                            for (i = 0; i < data.__extraFields.length; i++) {
                                if (this.__checkForExistingFieldId(ret, data.__extraFields[i].fieldId)) {
                                    if (!Ext.isEmpty(data.__filledFields)) {
                                        matchedVal = this.__matchField(data.__extraFields[i], data.__filledFields);
                                    } else {
                                        savedVal = this.__checkForSavedValue(data.__extraFields[i].fieldId);
                                        if (!Ext.isEmpty(savedVal)) {
                                            matchedVal = savedVal;
                                        }
                                    }
                                    if (data.__extraFields[i].type) {
                                        if (data.__extraFields[i].type === 'text') {
                                            ret.push(this.__makeModernTextField(data.__extraFields[i], matchedVal));
                                        } else if (data.__extraFields[i].type === 'list' && data.__extraFields[i].options && data.__extraFields[i].options.length > 0) {
                                            ret.push(this.__makeModernListField(data.__extraFields[i], matchedVal));
                                        } else if (data.__extraFields[i].type === 'toggle') {
                                            ret.push(this.__makeModernToggleField(data.__extraFields[i], matchedVal));
                                        } else if (data.__extraFields[i].type === 'number') {
                                            ret.push(this.__makeModernNumericField(data.__extraFields[i], matchedVal));
                                        } else if (data.__extraFields[i].type === 'button') {
                                            ret.push(this.__makeModernButton(data.__extraFields[i], matchedVal));
                                        }
                                    }
                                }
                            }
                        } else {
                            if (this.__checkForExistingFieldId(ret, data.__extraFields.fieldId)) {
                                if (!Ext.isEmpty(data.__filledFields)) {
                                    matchedVal = this.__matchField(data.__extraFields, data.__filledFields);
                                } else {
                                    savedVal = this.__checkForSavedValue(data.__extraFields.fieldId);
                                    if (!Ext.isEmpty(savedVal)) {
                                        matchedVal = savedVal;
                                    }
                                }
                                if (data.__extraFields.type) {
                                    if (data.__extraFields.type === 'text') {
                                        ret.push(this.__makeModernTextField(data.__extraFields, matchedVal));
                                    } else if (data.__extraFields.type === 'list' && data.__extraFields.options && data.__extraFields.options.length > 0) {
                                        ret.push(this.__makeModernListField(data.__extraFields, matchedVal));
                                    } else if (data.__extraFields.type === 'toggle') {
                                        ret.push(this.__makeModernToggleField(data.__extraFields, matchedVal));
                                    } else if (data.__extraFields.type === 'number') {
                                        ret.push(this.__makeModernNumericField(data.__extraFields, matchedVal));
                                    } else if (data.__extraFields.type === 'button') {
                                        ret.push(this.__makeModernButton(data.__extraFields, matchedVal));
                                    }
                                }
                            }
                        }
                    }
                }
                return ret;
            }
        }
    },
    __makeClassicTextField: function (field, matchedVal) {
        return {
            xtype: 'textfield',
            cls: 'a-extrasettingsfield-text-' + field.fieldId,
            width: '100%',
            labelAlign: 'top',
            fieldLabel: ABP.util.Common.geti18nString(field.label),
            itemId: 'extraSettingsFields' + field.fieldId,
            fieldId: field.fieldId,
            value: matchedVal || field.value,
            listeners: {
                specialkey: function (f, e) {
                    if (e.getKey() === e.ENTER) {
                        f.fireEvent("settings_save");
                    }
                }
            }
        };
    },
    __makeClassicListField: function (field, matchedVal) {
        return {
            xtype: 'combo',
            cls: 'launch-combo-box a-extrasettingsfield-list-' + field.fieldId,
            width: '100%',
            labelAlign: 'top',
            fieldLabel: ABP.util.Common.geti18nString(field.label),
            itemId: 'extraSettingsFields' + field.fieldId,
            fieldId: field.fieldId,
            store: {
                data: field.options
            },
            displayField: 'name',
            value: matchedVal !== null ? matchedVal : field.options[0].key,
            valueField: 'key',
            triggerAction: 'all',
            allowBlank: false,
            labelWidth: 0,
            editable: false,
            autoSelect: true
        };
    },
    __makeClassicToggleField: function (field, matchedVal) {
        var activeVal = field.active === "true" || field.active === true;
        if (!Ext.isEmpty(matchedVal)) {
            activeVal = matchedVal;
        }
        return {
            xtype: 'button',
            width: '100%',
            cls: 'login-keepme a-extrasettingsfield-button-' + field.fieldId,
            itemId: 'extraSettingsFields' + field.fieldId,
            text: ABP.util.Common.geti18nString(field.text),
            iconCls: activeVal ? 'icon-checked-square' : 'icon-unchecked-square',
            active: activeVal,
            value: activeVal,
            handler: function () {
                this.active = !this.active;
                if (this.active) {
                    this.setIconCls('icon-checked-square');
                } else {
                    this.setIconCls('icon-unchecked-square');
                }
                this.value = this.active;
            }
        };
    },
    __makeClassicNumericField: function (field, matchedVal) {
        var len = null;
        if (field.maxVal) {
            len = field.maxVal.toString().length;
        }
        return {
            xtype: 'numberfield',
            cls: 'a-extrasettingsfield-text-' + field.fieldId,
            width: '100%',
            labelAlign: 'top',
            fieldLabel: ABP.util.Common.geti18nString(field.label),
            itemId: 'extraSettingsFields' + field.fieldId,
            fieldId: field.fieldId,
            value: matchedVal,
            maxValue: field.maxVal ? parseFloat(field.maxVal) : null,
            minValue: field.minVal ? parseFloat(field.minVal) : null,
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
        };
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
                    popup = Ext.create('ABP.view.base.popUp.PopUpFrame', {
                        config: {
                            buttonInfo: field
                        }
                    });
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
            setFieldData: function (data) {
                this.fieldData = data;
            },
            getFieldData: function () {
                return this.fieldData;
            }
        };
    },
    __makeModernTextField: function (field, matchedVal) {
        return {
            xtype: 'textfield',
            cls: 'x-unselectable login-form a-extraloginfield-text-' + field.fieldId,
            width: '100%',
            clearable: false,
            allowBlank: 'false',
            labelAlign: 'top',
            label: ABP.util.Common.geti18nString(field.label),
            itemId: 'extraSettingsFields' + field.fieldId,
            fieldId: field.fieldId,
            value: matchedVal ? matchedVal : ""
        };
    },
    __makeModernListField: function (field, matchedVal) {
        return {
            xtype: 'selectfield',
            cls: 'login-form a-extraloginfield-list-' + field.fieldId,
            width: '100%',
            labelAlign: 'top',
            label: ABP.util.Common.geti18nString(field.label),
            itemId: 'extraSettingsFields' + field.fieldId,
            fieldId: field.fieldId,
            store: {
                data: field.options
            },
            displayField: 'name',
            value: matchedVal !== null ? matchedVal : field.options[0].key,
            valueField: 'key',
            triggerAction: 'all',
            allowBlank: false,
            labelWidth: 0,
            editable: false,
            autoSelect: true
        };
    },
    __makeModernToggleField: function (field, matchedVal) {
        var activeVal = field.active === "true" || field.active === true;
        if (!Ext.isEmpty(matchedVal)) {
            activeVal = matchedVal;
        }
        return {
            xtype: 'button',
            cls: 'login-keepme a-keepme-button',
            width: '100%',
            itemId: 'extraSettingsFields' + field.fieldId,
            focusCls: '',
            text: ABP.util.Common.geti18nString(field.text),
            iconCls: activeVal ? 'icon-checked-square' : 'icon-unchecked-square',
            active: activeVal,
            value: activeVal,
            handler: function () {
                this.active = !this.active;
                if (this.active) {
                    this.setIconCls('icon-checked-square');
                } else {
                    this.setIconCls('icon-unchecked-square');
                }
                this.setValue(this.active);
            }
        };
    },
    __makeModernNumericField: function (field, matchedVal) {
        var len = null;
        if (field.maxVal) {
            len = field.maxVal.toString().length;
        }
        return {
            xtype: 'abpnumberfield',
            cls: 'x-unselectable login-form a-extraloginfield-text-' + field.fieldId,
            width: '100%',
            clearable: false,
            allowBlank: 'false',
            labelAlign: 'top',
            label: ABP.util.Common.geti18nString(field.label),
            itemId: 'extraSettingsFields' + field.fieldId,
            fieldId: field.fieldId,
            maxValue: field.maxVal ? parseFloat(field.maxVal) : null,
            minValue: field.minVal ? parseFloat(field.minVal) : null,
            value: matchedVal ? matchedVal : "",
            maxLength: len
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
                    popup = Ext.create({
                        xtype: 'popupframe',
                        config: {
                            buttonInfo: field
                        }
                    });
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
            setFieldData: function (data) {
                this.fieldData = data;
            },
            getFieldData: function () {
                return this.fieldData;
            }
        };
    },
    __matchField: function (lookFor, lookIn) {
        var ret = null;
        var savedVal;
        var i = 0;
        for (i; i < lookIn.length; i++) {
            if (lookIn[i].fieldId === lookFor.fieldId) {
                ret = lookIn[i].val;
                break;
            }
        }
        if (ret === null) {
            savedVal = this.__checkForSavedValue(lookFor);
            if (savedVal) {
                ret = savedVal;
            }
        }
        return ret;
    },

    __checkForExistingFieldId: function (where, what) {
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
    __checkForSavedValue: function (fieldId) {
        var local = ABP.util.LocalStorage.get('settingsextrafields');
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
    }
});