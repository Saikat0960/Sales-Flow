/**
 * ABPControlSet currency component.
 */
Ext.define('ABPControlSet.view.field.Currency', {
    extend: 'Ext.form.FieldContainer',
    xtype: 'abpcurrency',
    requires: [
        'ABPControlSet.base.mixin.Field'
    ],
    mixins: [
        'ABPControlSet.base.mixin.Field'
    ],
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    cls: 'abp-currencybox',

    //Build string up if entries begin with the same character
    searchString: '',

    // Setting showRight to true will render the combo / currency type of the right of the component
    showRight: false,

    renderConfig: {
        /**
         * @cfg {String/Number} value
         *
         * The value to be set to the number field.
         */
        value: null,

        /**
         * @cfg {String} currencyCode
         *
         * The currency code to set to the currency code selector
         */
        currencyCode: null,

        /**
         * @cfg {Ext.data.Store} store
         *
         * The store with currency values for the currency drop down.
         */
        store: null,

        /**
         * @cfg {Boolean} readOnly
         *
         * Ready Only states of the internal number and currency code fields.
         */
        readOnly: false,

        /**
         * @cfg {String} formatString
         *
         * Default format string for the number field.
         */
        formatString: '000,000.00'

    },

    constructor: function (config) {
        config = config || {};
        // Assert display and value fields prior to store building.
        config.currencyDisplayField = config.currencyDisplayField || 'display';
        config.currencyValueField = config.currencyValueField || 'value';
        config.store = config.store || this.buildStore(config);
        var showRight = config.showRight = config.showRight || false;
        // Properly build the items in the order desired.
        config.items = [showRight ? this.buildNumberField(config) : this.buildCombo(config),
        showRight ? this.buildCombo(config) : this.buildNumberField(config)];

        this.mixins.abpcomponent.constructor.call(this, config);
        this.callParent([config]);
    },

    updateReadOnly: function (readOnly) {
        var me = this,
            numberField = me.down('abpnumber'),
            codeField = me.down('abpcombobox');
        if (numberField) {
            numberField.setReadOnly(readOnly);
        }
        if (codeField) {
            codeField.setReadOnly(readOnly);
        }
    },

    updateValue: function (value) {
        var me = this,
            numberField = me.down('abpnumber');
        if (numberField) {
            numberField.setValue(value);
        }
    },

    updateStore: function (store) {
        var me = this,
            codeField = me.down('abpcombobox');
        if (codeField) {
            var noItems = store ? store.getCount() <= 1 : true;
            if (store) {
                codeField.bindStore(store);
                codeField.setSelection(store.getAt(0));
                codeField.setValue(me.config.currencyCode);
            }
            codeField.setDisabled(noItems);
            codeField.setHideTrigger(noItems);
        }
    },

    updateCurrencyCode: function (code) {
        var me = this,
            codeField = me.down('abpcombobox');
        if (codeField) {
            codeField.setValue(code);
        }
    },

    //Build combo box item
    buildCombo: function (config) {
        return {
            xtype: 'abpcombobox',
            displayField: config.currencyDisplayField || 'display',
            valueField: config.currencyValueField || 'value',
            editable: false,
            enableKeyEvents: true,
            tabIndex: -1,
            hideTrigger: !config.store || config.store.getCount() <= 1,
            disabledCls: config.showRight ? 'abp-currency-combo-single-right' : 'abp-currency-combo-single',
            cls: ['abp-currency-combo', config.showRight ? 'abp-currency-right' : 'abp-currency-left'],
            onDownArrow: Ext.emptyFn,
            listeners: {
                afterRender: this.onComboAfterRender,
                collapse: this.onComboCollapse,
                select: this.onComboSelect
            }
        };
    },

    onComboSelect: function (combobox, selection) {
        combobox.up('abpcurrency').setCurrencyCode(combobox.getValue());
    },


    onComboKeyUp: function (combobox, e) {
        var currency = combobox.up('abpcurrency');
        currency.keyupHandler(e);
    },

    //Build number input
    buildNumberField: function (config) {
        return {
            xtype: 'abpnumber',
            hideTrigger: true,
            decimalPrecision: config.decimalPrecision ? config.decimalPrecison : 2,
            allowThousandSeparator: true,
            decimalSeparator: config.decimalSeparator ? config.decimalSeparator : '.',
            thousandSeparator: config.thousandSeparator ? config.thousandSeparator : ',',
            allowDecimals: true,
            enableKeyEvents: true,
            keyNavEnabled: false,
            repsonsiveFill: true,
            inputType: null,
            minValue: config.minValue || config.minValue === 0 ? config.minValue : Number.NEGATIVE_INFINITY,
            maxValue: config.maxValue ? config.maxValue : Number.MAX_VALUE,
            step: config.step ? config.step : 1,
            value: config.value ? config.value : null,
            cls: ['abp-currency-number', config.showRight ? 'abp-currency-left' : 'abp-currency-right'],
            listeners: {
                blur: this.onNumberBlur,
                change: this.onNumberChange,
                keydown: this.onNumberKeyDown,
                afterRender: this.onNumberAfterRender
            }
        };
    },

    // Format on blur.
    onNumberBlur: function (numberField) {
        var currencyField = numberField.up('abpcurrency');
        if (currencyField) {
            currencyField.formatNumberField(numberField, numberField.getValue(), currencyField.getFormatString());
        }
    },

    onNumberChange: function (numberField, newValue, oldValue) {
        var currencyField = numberField.up('abpcurrency');
        if (Math.abs(newValue - oldValue) === 1) {
            currencyField.formatNumberField(numberField, newValue, currencyField.getFormatString());
        }
        currencyField.setValue(newValue);
    },

    formatNumberField: function (numberField, newValue, formatString) {
        // Format the number field raw value
        // Setting Ext.util.Format.thousandSeparator and Ext.util.Format.decimalSeparator worries me some...
        // This will change formatting everywhere in the app which uses Ext.util.Format.number, when this field might be configured as something quite specific
        // Maybe we should store the original and set back after the format.
        var origThousandSeparator = Ext.util.Format.thousandSeparator,
            origDecimalSeparator = Ext.util.Format.decimalSeparator;
        Ext.util.Format.thousandSeparator = numberField.thousandSeparator;
        Ext.util.Format.decimalSeparator = numberField.decimalSeparator;
        numberField.setRawValue(Ext.util.Format.number(newValue, formatString));
        Ext.util.Format.thousandSeparator = origThousandSeparator;
        Ext.util.Format.decimalSeparator = origDecimalSeparator;
    },

    //Returns provided store object or parses provided are of strings
    buildStore: function (config) {
        var storeData = [],
            displayField = config.currencyDisplayField,
            valueField = config.currencyValueField;
        if (Ext.isArray(config.availableCurrencies)) {
            config.availableCurrencies.forEach(
                function (curr) {
                    var newCurr = {};
                    newCurr[displayField] = newCurr[valueField] = curr;
                    storeData.push(newCurr);
                }
            );
        }
        return Ext.create('Ext.data.Store', {
            fields: [displayField, valueField],
            data: storeData
        });
    },

    onNumberKeyDown: function (numberField, e) {
        var currencyField = numberField.up('abpcurrency');
        if (e.ctrlKey || e.keyCode === 32 || e.altKey || /^[A-Z]$/i.test(e.browserEvent.key)) {
            // Change the combobox value if the ctrl key is held.           
            currencyField.keyupHandler(e);
            e.stopEvent();
        } else {
            var currentValue = numberField.getValue(),
                minValue = numberField.minValue,
                maxValue = numberField.maxValue,
                step = numberField.step;
            if (e.keyCode === 40) {
                if (currentValue - step > minValue) {
                    numberField.setValue(currentValue - step);
                } else {
                    numberField.setValue(minValue);
                }
            } else if (e.keyCode === 38) {
                if (currentValue + step < maxValue) {
                    numberField.setValue(currentValue + step);
                } else {
                    numberField.setValue(maxValue);
                }
            }
        }
    },

    onComboAfterRender: function (combobox) {
        //Strange behavior in update store, this is probably done better otherwise.
        combobox.setValue(combobox.lastValue);
    },

    onComboCollapse: function (combobox) {
        Ext.defer(function () { combobox.up().down('abpnumber').focus(); }, 0);
    },

    onNumberAfterRender: function (numberField) {
        var currencyField = numberField.up('abpcurrency');
        if (currencyField) {
            currencyField.formatNumberField(numberField, numberField.getValue(), currencyField.getFormatString());
        }
    },

    // Change selection on Ctrl + ArrowKey
    // Open close Alt + ArrowKey
    // Select on alpha typing
    keyupHandler: function (e) {
        var me = this,
            comboBox = me.down('abpcombobox');
        me.initialValueChanged = true;
        if (!comboBox.isDisabled()) {
            if (e.ctrlKey) {
                var store = me.getStore(), // Config get of the store.
                    selIndex = store.indexOf(comboBox.getSelection()),
                    storeCount = store.getCount();
                if (e.keyCode === 38) {
                    if (selIndex > 0) {
                        comboBox.setSelection(store.getAt(selIndex - 1));
                    } else {
                        comboBox.setSelection(store.getAt(storeCount - 1));
                    }
                } else if (e.keyCode === 40) {
                    if (selIndex < storeCount - 1) {
                        comboBox.setSelection(store.getAt(selIndex + 1));
                    } else {
                        comboBox.setSelection(store.getAt(0));
                    }
                }
            } else if (e.altKey) {
                if (e.keyCode === 38) {
                    comboBox.collapse();
                } else if (e.keyCode === 40) {
                    comboBox.expand();
                }
            } else {
                me.searchString += e.browserEvent.key;
                var selections = me.getStore().query(me.config.currencyDisplayField, me.searchString, false, false);
                if (selections.length > 0) {
                    comboBox.setSelection(selections.getAt(0));
                }
                if (selections.length <= 1) {
                    me.searchString = '';
                }
            }
        }
    }
});