/*
*   Classic field plugin class to add a linked label when field uses this.
*/
Ext.define("ABPControlSet.view.field.plugin.LinkedLabel", {
    override: "ABPControlSet.base.view.field.plugin.LinkedLabel",

    hookIntoFieldLabel: function (component) {
        component.labelSeparator = this.labelSeparator;
        component.renderActiveError = this.renderActiveError;
        component.setFieldLabel = this.setFieldLabel;
        component.setFieldLabel(component.fieldLabel);
        component.hideLabel = true;
    },

    /*
     *
     * Overrides the method from the Ext.form.Labelable mixin to also add the invalidCls to the inputEl,
     * as that is required for proper styling in IE with nested fields (due to lack of child selector)
     */
    renderActiveError: function () {
        var me = this,
            hasError = me.hasActiveError(),
            invalidCls = me.invalidCls + '-field';

        me.superclass.superclass.renderActiveError.apply(this);
        if (me.__linkedLabel) {
            // Add/remove invalid class
            me.__linkedLabel[hasError ? 'addCls' : 'removeCls']([
                invalidCls
            ]);
        }
    },

    getLabelableRenderData: function (component) {
        return component.getLabelableRenderData ? component.getLabelableRenderData() : {};
    },

    setFieldLabel: function (label) {
        // Overwrite the setFieldLabel when the linked label is used so the linked label gets updated.
        label = label || '';

        var me = this,
            linkedLabel = me.__linkedLabel,
            separator = me.labelSeparator;

        me.fieldLabel = label;
        linkedLabel.text = label;
        if (!Ext.isEmpty(separator)) {
            label = me.trimLabelSeparator() + separator;
        }
        linkedLabel.setText(label);
        if (me.rendered) {
            me.updateLayout();
        }
    }
});