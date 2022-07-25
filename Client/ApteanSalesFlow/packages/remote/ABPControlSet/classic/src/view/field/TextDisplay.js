/**
 * ABPControlSet text display component.
 */
Ext.define("ABPControlSet.view.field.TextDisplay", {
    extend: "Ext.form.field.Display",
    xtype: "abptextdisplay",
    classCls: 'abp-textdisplay',
    requires: [
        "ABPControlSet.base.view.field.plugin.LinkedLabel",
        "ABPControlSet.base.view.field.plugin.Field",
        "ABPControlSet.base.mixin.TextDisplay",
        "ABPControlSet.util.Markdown"
    ],

    mixins: [
        "ABPControlSet.base.mixin.TextDisplay"
    ],

    constructor: function (config) {
        config = config || {};
        this.mixins.abpcomponent.constructor.call(this, config);
        this.callParent([config]);
    },

    setRawValue: function (newValue, oldValue) {
        var markupType = this.getMarkupType(),
            value = Ext.valueFrom(newValue, '');
        // TODO: look at getDisplayValue function of the Ext.form.field.Display and integrate markdown parsing with that in mind.
        if (markupType === "markdown") {
            this.setHtml(ABPControlSet.util.Markdown.parseMarkdown(newValue));
            return this.callParent([value, oldValue]);
        } else {
            return this.callParent([value, oldValue]);
        }
    }
});
