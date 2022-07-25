// Allows the ExtJS numberfield to show the thousand separator.
// Loosely based on https://www.sencha.com/forum/showthread.php?469629-Numberfield-with-currency-and-thousand-seperator
// with fixes, less code needed for inclusion with ABP, and it working with the ABPControlSet fieldFormatter.
Ext.define('Overrides.form.field.Number', {
    override: 'Ext.form.field.Number',

    // OVERRIDE change: START new code:
    /**
     * @cfg {String} allowThousandSeparator
     * If set true during config, then a thousand separator will be allowed,
     * and also shown when not editing if a custom fieldFormatter is not already defined.
     * {@link Ext.form.field.Number#thousandSeparator Ext.form.field.Number.thousandSeparator}
     * is used if specified, otherwise {@link Ext.util.Format.thousandSeparator Ext.util.Format.thousandSeparator}
     * is used (the default).
     */
    allowThousandSeparator: false,
    /**
     * @cfg {String} thousandSeparator
     * The character to show as the thousand separator. Defaults to {@link Ext.util.Format#thousandSeparator thousandSeparator}.
     * @locale
     */
    thousandSeparator: null,
    // OVERRIDE change: END new code.


    // OVERRIDDEN METHOD
    // Adds in set up for thousand separator and focus/edit handling to remove thousands formatting.
    initComponent: function () {
        // OVERRIDE change: START new code:
        var me = this;

        // If the thousand separator is allowed then use the global value if not specified for this instance.
        if (me.allowThousandSeparator) {
            me.thousandSeparator = me.thousandSeparator ? me.thousandSeparator : Ext.util.Format.thousandSeparator;
        }

        // If ABPControlSet fieldFormatter is not in play then
        // get focus to remove formatting on editing. Using directly the onFocus will result in a disfunction of the Mousewheeel...
        if (!me.fieldFormatter) {
            me.mon(me, 'focus', me._onFocus, me);
        }

        me.callParent(); // Call to ExtJS numberfield's initComponent.
        // OVERRIDE change: END new code.
    },


    // OVERRIDDEN METHOD
    // Converts whatever text is showing in the number field to a JavaScript number.
    // nuill is returned if it is determined that the field does not contain a number.
    parseValue: function (value) {
        //console.log ("parseValue: value(1)=" + value)
        var me = this;

        // OVERRIDE change: START new code:
        // Strip formatting of the thousand seperator and return a 'clean' number.
        if (me.allowThousandSeparator) {
            value = String(value).replace(new RegExp('\\' + me.thousandSeparator, 'g'), '') // Replace all instances of the thousand separator.
        }
        //console.log ("parseValue: value(2)=" + value)
        // OVERRIDE change: END new code.

        // Original base code for parseValue:
        value = parseFloat(String(value).replace(me.decimalSeparator, '.'));
        //console.log ("parseValue: value(3)=" + value)
        return isNaN(value) ? null : value;
    },


    // OVERRIDDEN METHOD
    // Format a number string to how the number is configured,
    // with decimal spaces, thousands separators, etc.
    valueToRaw: function (value) {
        //console.log ("valueToRaw: value(0)=" + value)
        var me = this;

        // OVERRIDE change: START new code:
        // Use override code if thousands separator allowed and there is no another special formatter defined in ABPControlSet.
        if (me.allowThousandSeparator && !me.fieldFormatter) {
            //console.log ("valueToRaw: value(1)=" + value)

            // Extend current routine with formatting the output
            var decimalSeparator = me.decimalSeparator,
                thousandSeparator = me.thousandSeparator;
            //value = me.parseValue(value);
            value = me.fixPrecision(value);
            value = Ext.isNumber(value) ? value : parseFloat(String(value).replace(decimalSeparator, '.'));
            value = isNaN(value) ? '' : String(value).replace('.', decimalSeparator);
            //console.log ("valueToRaw: value(2)=" + value)

            // Add formatting
            if (me.thousandSeparator) {
                var regX = /(\d+)(\d{3})/,
                    value = String(value).replace(/^\d+/, function (val) {
                        while (regX.test(val)) {
                            val = val.replace(regX, '$1' + thousandSeparator + '$2');
                        }
                        return val;
                    });
            }
            //console.log ("valueToRaw: value(3)=" + value)

            return value;

        } else {
            // Original base code:
            var me = this,
                decimalSeparator = me.decimalSeparator;
            value = me.parseValue(value);
            value = me.fixPrecision(value);
            value = Ext.isNumber(value) ? value : parseFloat(String(value).replace(decimalSeparator, '.'));
            value = isNaN(value) ? '' : String(value).replace('.', decimalSeparator);
            //console.log ("valueToRaw: orginal base code value(4)=" + value)
            return value;
        }
        // OVERRIDE change: END new code.
    },


    // OVERRIDDEN METHOD - to ensure the thousands separator is removed before testing isNaN.
    /**
     * Runs all of Number's validations and returns an array of any errors. Note that this first runs Text's
     * validations, so the returned array is an amalgamation of all field errors. The additional validations run test
     * that the value is a number, and that it is within the configured min and max values.
     * @param {Object} [value] The value to get errors for (defaults to the current field value)
     * @return {String[]} All validation errors for this field
     */
    getErrors: function (value) {
        value = arguments.length > 0 ? value : this.processRawValue(this.getRawValue());

        /* OVERRIDE change: START original code:
        var me = this,
            errors = me.callParent([value]),
            format = Ext.String.format,
            num;
        OVERRIDE change: END original code. */

        // OVERRIDE change: START new code:
        var me = this,
            errors = me.callSuper([value]),
            format = Ext.String.format,
            num;
        // OVERRIDE change: END new code:

        if (value.length < 1) { // if it's blank and textfield didn't flag it then it's valid
            return errors;
        }

        // OVERRIDE change: START new code:
        if (me.allowThousandSeparator) {
            value = String(value).replace(new RegExp('\\' + me.thousandSeparator, 'g'), '') // Replace all instances of the thousand separator.
        }
        // OVERRIDE change: END new code.

        value = String(value).replace(me.decimalSeparator, '.');

        if (isNaN(value)) {
            errors.push(format(me.nanText, value));
        }

        num = me.parseValue(value);

        if (me.minValue === 0 && num < 0) {
            errors.push(this.negativeText);
        }
        else if (num < me.minValue) {
            errors.push(format(me.minText, me.minValue));
        }

        if (num > me.maxValue) {
            errors.push(format(me.maxText, me.maxValue));
        }


        return errors;
    },


    // NEW METHOD
    // On focus, remove the formatting to editing (if NOT readOnly)
    _onFocus: function () {
        var me = this;

        // On focus, remove the formatting to editing (if NOT readOnly)
        if (me.readOnly) {
            return;
        }

        // Get the actual value which is shown in the field
        var value = me.getRawValue();

        // Remove extra formatting including leading and trailing spaces
        // original override code: if (this.currencySymbol || this.thousandSeparator) value = String(value).replace(this.currencySymbol, '').replace(this.thousandSeparator, '').trim();    //.replace('.', this.decimalSeparator);
        if (me.allowThousandSeparator) {
            value = String(value).replace(new RegExp('\\' + me.thousandSeparator, 'g'), '').trim();    //.replace('.', this.decimalSeparator);
        }

        // Show Rawvalue in field
        //console.log ("_onFocus: value(1)=" + value)
        me.setRawValue(Ext.isEmpty(value) ? null : value);
    }

});