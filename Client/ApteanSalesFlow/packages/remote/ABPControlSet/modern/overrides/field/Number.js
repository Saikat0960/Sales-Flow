// Allows the ExtJS numberfield to show the thousand separator, in Modern.
Ext.define('Overrides.field.Number', {
    override: 'Ext.field.Number',

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
    initialize: function () {
        // OVERRIDE change: START new code:
        var me = this;
        // If the thousand separator is allowed then use the global value if not specified for this instance.
        if (me.allowThousandSeparator) {
            me.thousandSeparator = me.thousandSeparator ? me.thousandSeparator : Ext.util.Format.thousandSeparator;
        }
        
        me.callParent(); // Call to ExtJS numberfield's initComponent.
        // OVERRIDE change: END new code.
    },

    //OVERRIDDEN METHOD
    //Need to allow formatting to reflect the use of the thousand separator
    updateDecimals: function (decimals) {
        // OVERRIDE change: START new code:
        var me = this,
            format = me.allowThousandSeparator ? '0,0' : '0',
            zeroChar = me.getTrim() ? '#' : '0',
            value;
        if (me.formatString) {
            format = me.formatString;
        } else {
            if (decimals) {
                if (me.allowThousandSeparator) {
                    format += '.' + Ext.String.repeat('0', decimals);
                } else {
                    format += '.' + Ext.String.repeat(zeroChar, decimals);
                }           
            }
        }
        // OVERRIDE change: END new code.
        me.numberFormat = format;

        if (!me.isConfiguring) {
            value = me.getValue();
            if (Ext.isDate(value)) {
                me.setInputValue(value);
            }
        }
    },


});