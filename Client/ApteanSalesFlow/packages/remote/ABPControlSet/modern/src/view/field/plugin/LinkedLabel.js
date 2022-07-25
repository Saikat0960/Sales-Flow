/**
*   Modern linked label plugin class.
*/
Ext.define("ABPControlSet.base.view.field.plugin.LinkedLabel", {
    extend: "Ext.plugin.Abstract",

    alias: 'plugin.abplinkedlabel',

    getLabelableRenderData: function (component) {
        return {};
    },

    hookIntoFieldLabel: function (component) {
        // Get the current label
        var label = component.getLabel();
        // CLear the label.
        component.setLabel(undefined);
        // Override the update function.
        component.updateLabel = this.updateLabel;
        // Set the original label through the overidden workflow.
        component.setLabel(label);
    },

    updateLabel: function (label) {
        var labelCmp = this.__linkedLabel;
        if (labelCmp) {
            labelCmp.setHtml(Ext.String.htmlEncode(label));
        }
    }
});