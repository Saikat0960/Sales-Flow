/**
 * ABPControlSet number component.
 * 
 * The underlying Ext.field.Number cannot show thousands separators if the HTML input element's type attribute is 'number' (an HTML/browser restriction). 
 * Nor can it show 0's padding on the right side of decimals.
 * 
 * So inputType: 'number' is really only useful for non-currency amounts that do not show
 * thousands separators. Otherwise use inputType: 'text'.
 * 
 * Use "inputMode" (a relatively new HTML attribute) to show a numeric keypad.
 * 
 * ExtJS does a good job of formatting and controlling the input of abpnumber
 * when inputType:text and inputMode:decimal (or numeric).
 */
Ext.define("ABPControlSet.view.field.Number", {
    extend: "Ext.field.Number",
    xtype: "abpnumber",
    requires: [
        "ABPControlSet.base.view.field.plugin.LinkedLabel",
        "ABPControlSet.base.view.field.plugin.Field",
        "ABPControlSet.base.mixin.Field"
    ],

    mixins: [
        "ABPControlSet.base.mixin.Field"
    ],

    /**
     * @cfg {String} allowThousandSeparator
     * If set true during config, then a thousand separator will be allowed,
     * and also shown when not editing if a custom fieldFormatter is not already defined.
     * {@link Ext.form.field.Number#thousandSeparator Ext.form.field.Number.thousandSeparator}
     * is used if specified, otherwise {@link Ext.util.Format.thousandSeparator Ext.util.Format.thousandSeparator}
     * is used (the default).
     *
     * IMPORTANT: Set inputType: 'text', otherwise thousands separators cannot be shown (an HTML/browser restriction).
     * 
     * Note: implementation is in an override of Ext.form.field.Number.
     */
    allowThousandSeparator: false,
    /**
     * @cfg {String} thousandSeparator
     * The character to show as the thousand separator. Defaults to {@link Ext.util.Format#thousandSeparator thousandSeparator}.
     * @locale
     *
     * Note: implementation is in an override of Ext.form.field.Number.
     */
    thousandSeparator: null,
    /**
     * @cfg {String} inputType
     * The "type" attribute for HTML input fields -- e.g. number, text.
     *
     * If the corresponding inputMode attribute is not set (see config after this one)
     * then this affects what soft keyboard is shown on devices.config
     * 
     * NOTE: The underlying Ext.field.Number cannot show thousands separators if the HTML 
     * input element's type attribute is 'number' (an HTML/browser restriction). 
     * Nor can it show 0's padding on the right side of decimals
     * 
     * So inputType: 'number' is really only useful for non-currency amounts that do not show
     * thousands separators. Otherwise use inputType: 'text'.
     * 
     * Use "inputMode" (a relatively new HTML attribute) to show a numeric keypad.
     * 
     * ExtJS does a good job of formatting and controlling the input of abpnumber
     * when inputType:text and inputMode:decimal (or numeric).
     * 
     */
    inputType: 'number',
    /**
     * @cfg {String} inputMode
     * The "inputmode" attribute for input fields -- e.g. decimal, numeric, text, etc.
     *
     * This affects what soft keyboard is shown on devices.
     * 
     * Using 'numeric' is not good enough for iOS because it will show a soft keyboard
     * with only numbers and no decimal point. So by default 'decimal' is used
     * because iOS shows the '.' key in that case.
     * 
     * Code using abpnumber can override this if its wants only integers entered.
     */
    inputMode: 'decimal', // Show decimal soft keyboard for numbers.

    constructor: function (config) {
        config = config || {};
        this.mixins.abpcomponent.constructor.call(this, config);
        this.callParent([config]);
    },

    // Ext.field.Number has an initialize function which overrides any configured inputMode.
    // So we need this code below to prevent Ext from doing that.
    initialize: function () {
        this.callParent(arguments);

        if (this.inputMode && this.inputElement && this.inputElement.dom) {
            this.inputElement.dom.setAttribute('inputmode', this.inputMode);
        }
    }

});
