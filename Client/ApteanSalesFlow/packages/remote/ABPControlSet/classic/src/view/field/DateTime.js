/*
 * Based on DateTimeField @ https://github.com/gportela85/DateTimeField
 * Latest update on 3/3/2017. For Ext JS V6.2.1.167.
 */
Ext.define("ABPControlSet.view.field.DateTime", {
    extend: "Ext.form.field.Date",
    alias: "widget.abpdatetime",
    requires: [
        'ABPControlSet.view.picker.DateTime',
        'ABPControlSet.base.view.field.plugin.LinkedLabel',
        'ABPControlSet.base.view.field.plugin.Field',
        'ABPControlSet.base.view.field.plugin.RelativeDateTime',
        'ABPControlSet.base.mixin.Field'
    ],

    initTime: '',
    initTimeFormat: 'H:i',
    
    mixins: [
        "ABPControlSet.base.mixin.Field"
    ],

    config: {
        /* Whether to show the trigger that sets the date time to now
         * The trigger will only be shown if the field is empty 
         */
        showNowTrigger: true,

        triggers: {
            now: {
                handler: 'onTriggerNowClick',
                scope: 'this',
                cls: 'icon-clock',
                focusOnMousedown: true,
                weight: -1, // show defore the default
            }
        }
    },

    listeners: {
        change: function(me, newValue){
            var showTrigger = !newValue && this.editable && !this.readonly && !this.disabled && this.getShowNowTrigger();
            if (showTrigger) {
                this.triggers.now.show();
            }
            else {
                this.triggers.now.hide();
            }
        }
    },

    constructor: function (config) {
        config = config || {};

        // Ignores MaxLength
        if (config.maxLength != undefined) {
            config.maxLength = undefined;
        }

        // TODO: Is this the proper localization for time?
        // Set the localized date time format.
        config.format = Ext.form.field.Date.prototype.format + " " + Ext.form.field.Time.prototype.format;
        config.altFormats = this.altFormats + '|dmy H:i|dmy Hi|dmY H:i|dmY Hi';
        this.mixins.abpcomponent.constructor.call(this, config);
        this.callParent([config]);

        this.triggers.now.setTooltip(ABP.util.Common.geti18nString('s_picker_date_nowText'));
    },

    /*
    * Override createPicker to create the ABPControlSet DateTime picker for this field.
    */
    createPicker: function () {
        var parentPicker = this.callParent(),
            parentConfig = Ext.clone(parentPicker.initialConfig);

        var initialValue = Ext.isDate(parentPicker.pickerField.value) ? parentPicker.pickerField.value : null;

        // Avoiding duplicate ids error
        parentPicker.destroy();

        // Override - remove monthYearText.
        Ext.apply(parentConfig, {
            //monthYearText: false,
            todayText: ABP.util.Common.geti18nString('s_picker_date_nowText'),
            //value: initialValue
        });

        return Ext.create("ABPControlSet.view.picker.DateTime", parentConfig);
    },

    createInitialDate: function(value) {
        var minValue = this.minValue,
            maxValue = this.maxValue;
        
        if (!value) {
            return null;   
        }

        if (minValue && minValue > value) {
            value = minValue;
        } else if (maxValue && maxValue < value) {
            value = maxValue;
        }
        return value;
    },

    /**
     * @private
     * Sets the Date picker's value to match the current field value when expanding.
     */
    onExpand: function() {
        var value = Ext.isDate(this.rawDate) ? this.rawDate : this.createInitialDate();
        this.picker.timeValue = value;
        this.picker.setValue(value);
    },

    /*
    * Overridden method getErrors.
    */
    getErrors: function (value) {
        value = arguments.length > 0 ? value : this.formatDate(this.processRawValue(this.getRawValue()));

        var me = this,
            format = Ext.String.format,
            errors = me.superclass.superclass.getErrors.apply(this, arguments),
            disabledDays = me.disabledDays,
            disabledDatesRE = me.disabledDatesRE,
            minValue = me.minValue,
            maxValue = me.maxValue,
            len = disabledDays ? disabledDays.length : 0,
            i = 0,
            svalue,
            fvalue,
            day,
            time;

        if (value === null || value.length < 1) { // if it's blank and textfield didn't flag it then it's valid
            return errors;
        }

        svalue = value;
        value = me.parseDate(value);
        if (!value) {
            errors.push(format(me.invalidText, svalue, Ext.Date.unescapeFormat(me.format)));
            return errors;
        }

        time = value.getTime();
        if (minValue && time < minValue.getTime()) {
            errors.push(format(me.minText, me.formatDate(minValue)));
        }

        if (maxValue && time > maxValue.getTime()) {
            errors.push(format(me.maxText, me.formatDate(maxValue)));
        }

        if (disabledDays) {
            day = value.getDay();

            for (; i < len; i++) {
                if (day === disabledDays[i]) {
                    errors.push(me.disabledDaysText);
                    break;
                }
            }
        }

        fvalue = me.formatDate(value);
        if (disabledDatesRE && disabledDatesRE.test(fvalue)) {
            errors.push(format(me.disabledDatesText, fvalue));
        }

        return errors;
    },

    onTriggerNowClick: function() {
        this.setValue(new Date());
    }
});