/**
* Copyright © Aptean
*
* Class: Ext.form.field.Checkbox
*/
Ext.define("ABP.form.field.Checkbox", {
    override: "Ext.form.field.Checkbox",

    overCls: Ext.baseCSSPrefix + 'check-over',

    /*
    * Extended properties and methods.
    */
    getSubTplData: function (fieldData) {
        // Adjust the checkboxCls data property to add the anchor css class.
        var me = this,
            data = me.callParent(arguments),
            anchorCls = data.type === "checkbox" ? ABP.util.Common.getAutomationClass(me) + "-check" : ABP.util.Common.getAutomationClass(me) + "-" + me.inputValue;

        data["checkboxCls"] = data["checkboxCls"] + " " + anchorCls;
        return data;
    }
});