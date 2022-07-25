/*
    NOTE: This file is added to include the Ext JS v6.6 Modern Time Field - remove duplicate code once updated to v6.6 or greater.
*/
Ext.define('Ext.field.Time', {
    extend: 'Ext.field.Picker',
    xtype: 'timefield',

    requires: [
        'Ext.field.trigger.Time',
        'Ext.panel.Time',
        'Ext.data.validator.Time'
    ],

    config: {
        triggers: {
            expand: {
                type: 'time'
            }
        },

        format: '',

        altFormats: 'g:ia|g:iA|g:i a|g:i A|h:i|g:i|H:i|ga|ha|gA|h a|g a|g A|gi|hi|gia|hia|g|H|gi a|hi a|giA|hiA|gi A|hi A'
    },

    platformConfig: {
        'phone || tablet': {
            floatedPicker: {
                modal: true,
                centered: true
            },
            errorTarget: 'under'
        }
    },

    picker: 'floated',

    floatedPicker: {
        xtype: 'timepanel',
        floated: true,
        confirmable: true,
        listeners: {
            select: 'onPickerChange',
            collapsePanel: 'collapse',
            scope: 'owner'
        }
    },

    initDate: '1970-01-01',
    initDateFormat: 'Y-m-d',

    matchFieldWidth: false,

    createFloatedPicker: function (config) {
        var pickerConfig = this.getFloatedPicker();

        return Ext.apply(pickerConfig, config);
    },

    getAutoPickerType: function () {
        return 'floated';
    },

    onPickerChange: function (picker, value) {
        var me = this;

        me.forceInputChange = true;
        me.setValue(value);
        me.forceInputChange = false;

        me.fireEvent('select', me, value);

        me.collapse();
    },

    parseValue: function (value, errors) {
        var me = this,
            date = value,
            defaultFormat = me.getFormat(),
            altFormats = me.getAltFormats(),
            formats = [defaultFormat].concat(altFormats),
            i, len, format;

        if (date) {
            if (!Ext.isDate(date)) {

                for (i = 0, len = formats.length; i < len; i++) {
                    format = formats[i];
                    date = Ext.Date.parse(
                        me.initDate + ' ' + value,
                        me.initDateFormat + ' ' + format
                    );

                    if (date) {
                        return date;
                    }
                }
            }

            if (date) {
                return date;
            }
        }

        return this.callParent([value, errors]);
    },

    realignFloatedPicker: function (picker) {
        picker = picker || this.getPicker();

        if (picker.isCentered()) {
            picker.center();
        }
        else {
            return this.callParent([picker]);
        }
    },

    showPicker: function () {
        var me = this,
            picker;

        me.callParent();


        picker = me.getPicker();
        picker.setValue(me.getValue());

        // For modal pickers (phones and tablets) we need to move the focus
        // due to software keyboards potentially moving the content off screen
        if (picker.getModal()) {
            me.getFocusTrap().focus();
        }
    },


    transformValue: function (value) {
        if (Ext.isDate(value)) {
            if (isNaN(value.getTime())) {
                value = null;
            }
        }

        return value;
    },

    applyInputValue: function (value, oldValue) {
        if (Ext.isDate(value)) {
            return Ext.Date.format(value, this.getFormat());
        }

        return this.callParent([value, oldValue]);
    },

    applyPicker: function (picker, oldPicker) {
        var me = this;

        if (picker === 'edge') {
            //<debug>
            Ext.log.warn('Time Panel does not support "edge" picker, defaulting to "floated"');
            //</debug>
            picker = 'floated'
        }

        picker = me.callParent([picker, oldPicker]);

        if (picker) {
            picker.ownerCmp = me;
        }

        return picker;
    },

    applyAltFormats: function (altFormats) {
        if (!altFormats) {
            return [];
        } else if (!Ext.isArray(altFormats)) {
            return altFormats.split('|');
        }

        return altFormats;
    },

    applyFormat: function (format) {
        return format || Ext.Date.defaultTimeFormat;
    },

    updateFormat: function (format) {
        this.setParseValidator({
            type: 'time',
            format: format
        });
    },

    applyValue: function (value, oldValue) {
        if (!(value || value === 0)) {
            value = null;
        }

        value = this.callParent([value, oldValue]);

        if (value) {
            if (this.isConfiguring) {
                this.originalValue = value;
            }
        }

        return value;
    },

    updateValue: function (value, oldValue) {
        // Using a getter will create the picker instance if it does not exist.
        // We don't want this here.
        var picker = this._picker;

        if (picker) {
            picker.setValue(value);
        }

        this.callParent([value, oldValue]);
    }
});