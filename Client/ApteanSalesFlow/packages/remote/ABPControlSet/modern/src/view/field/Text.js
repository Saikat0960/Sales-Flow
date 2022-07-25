/**
 * ABPControlSet text component.
 *
 * ## Commonly used APIs
 *
 * abptext is based on Ext.field.Text, so it has many inherited configs, properties, methods and events. ABPControlSet adds further ones on top. A starting point for useful APIs is below.
 *
 * ### Configs
 *
 * #minLength - Minimum characters allowed. Use with and #minLengthText
 * #maxLength - Maximum characters allowed. Use with #enforceMaxLength and #maxLengthText
 * #inputType - Determines the keyboard shown on a touch device for this field.
 * #spellcheck (ABP) - Determines both spellcheck and autocorrect in the DOM element (different browsers use one or the other). #autoComplete is different.
 *
 *
 * ### Properties
 *
 * ### Methods
 *
 * ### Events
 *
 * ### Other
 *
 * Tooltips
 *
 */
Ext.define("ABPControlSet.view.field.Text", {
    extend: "Ext.field.Text",
    xtype: "abptext",
    requires: [
        "ABPControlSet.base.view.field.plugin.LinkedLabel",
        "ABPControlSet.view.form.trigger.Trigger",
        "ABPControlSet.base.view.field.plugin.Field",
        "ABPControlSet.base.mixin.Text"
    ],
    mixins: [
        "ABPControlSet.base.mixin.Text"
    ],
    constructor: function (config) {
        config = config || {};
        this.mixins.abpcomponent.constructor.call(this, config);
        this.callParent([config]);
    }
});