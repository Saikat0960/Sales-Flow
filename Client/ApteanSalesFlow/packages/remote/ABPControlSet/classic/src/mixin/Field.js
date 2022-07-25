/**
 *  Classic field mixin.
 */
Ext.define("ABPControlSet.mixin.Field", {
    override: "ABPControlSet.base.mixin.Field",
    // Add/override methods for classic toolkit specific logic.

    constructor: function (config) {
        config = config || {};
        if (config.required === true) {
            // Sync allowBlank when required is true.
            config.allowBlank = false;
        }

        this.callParent([config]);
    },

    getTooltipEl: function () {
        return this.inputEl;
    },

    /**
     *  Required property config. Needs support in classic. Hooks into allowBlank; more of a convenience.
     */
    getRequired: function () {
        return !this.allowBlank;
    },

    updateRequired: function (required) {
        var me = this;
        me.required = required === true ? true : false;
        me.allowBlank = !required;
        // Update necessary styles.
        if (me.__linkedLabel) {
            // If there is a linked label
            me.__linkedLabel.toggleCls('abp-mandatory', !me.allowBlank);
        }
        if (!me.hideLabel && me.labelEl) {
            me.labelEl.toggleCls('abp-mandatory', !me.allowBlank);
        }
    },

    /**
     * Support for readOnly config - getReadOnly is not available in classic toolkit.
     */
    getReadOnly: function () {
        return this.readOnly;
    },

    getInputElement: function () {
        return this.inputEl; // inputEl for Classic fields.
    },

    updateSpellcheck: function (spellcheck) {
        var me = this;
        if (me.rendered) {
            var inputEl = this.getInputElement();
            if (inputEl) {
                inputEl.set({
                    spellcheck: spellcheck.toString(),
                    autocorrect: spellcheck ? "on" : "off"
                });
            }
        } else {
            // Include the original configured inputAttrTpl.
            var inputAttrTpl = Ext.Template.create(me.inputAttrTpl);
            // Do specifc non rendered classic spellcheck.
            me.inputAttrTpl = [inputAttrTpl.html + ' spellcheck="' + spellcheck.toString() + '" autocorrect="' + (spellcheck ? 'on' : 'off') + '"'];
        }
    },

    updateBackgroundColor: function (color) {
        var me = this;
        if (me.rendered) {
            // Call code common to Classic and Modern.
            this.callParent(arguments);
        } else {
            // If not rendered then set the field's fieldStyle.
            // This is used by ExtJS when the field is rendered later.
            // fieldStyle is applied to the input element of a Classic field.
            // Ext.dom.Helper.generateStyles converts a property like fieldStyle.backgroundColor = 'red'
            // to 'background-color:red'.
            me.fieldStyle = me.fieldStyle || {};
            me.fieldStyle.backgroundColor = color;
        }
        // setBackgroundColor will store the color in the config's private variable.
    },

    updateForegroundColor: function (color) {
        var me = this;
        if (me.rendered) {
            this.callParent(arguments);
        } else {
            // If not rendered then set the field's fieldStyle.
            // This is used by ExtJS when the field is rendered later.
            // fieldStyle is applied to the input element of a Classic field.
            // Ext.dom.Helper.generateStyles converts a property like fieldStyle.backgroundColor = 'red'
            // to 'background-color:red'.
            me.fieldStyle = me.fieldStyle || {};
            me.fieldStyle.color = color;
        }
        // setBackgroundColor will store the color in the config's private variable.
    },

    getBackgroundColor: function () {
        var me = this;
        // Work directy on the input element, rather than the component itself.
        // The input element is the thing we want to color.
        // The commmon base field mixin only deals with the rendered case.
        // The unrendered cases must be handled by specific code in the Class and Modern overrides.
        var inputEl = me.getInputElement();
        if (inputEl) {
            return inputEl.getStyle("background-color");
        } else {
            // Fallback if no el.
            // fieldStyle is available in Classic.
            if (Ext.isObject(me.fieldStyle)) {
                return me.fieldStyle.backgroundColor;
            } else {
                // Otherwise best we can do is return the backgroundColor's config value.
                return me._backgroundColor; // Not calling callParent because the Component's getBackgroundColor does Component-specific things.
            }
        }
    },

    getForegroundColor: function () {
        var me = this;
        // Work directy on the input element, rather than the component itself.
        // The input element is the thing we want to color.
        // The commmon base field mixin only deals with the rendered case.
        // The unrendered cases must be handled by specific code in the Class and Modern overrides.
        var inputEl = me.getInputElement();
        if (inputEl) {
            return inputEl.getStyle("color");
        } else {
            // Fallback if no el.
            // fieldStyle is available in Classic.
            if (Ext.isObject(me.fieldStyle)) {
                return me.fieldStyle.color;
            } else {
                // Otherwise best we can do is return the foregroundColor's config value.
                return me._foregroundColor; // Not calling callParent because the Component's getForegroundColor does Component-specific things.
            }
        }
    },

    /**
     * @private @ignore
     * Hook into the afterRender. Add the readOnlyElement if the field is configured with a tag for read only.
     */
    onAfterRender: function () {
        var me = this,
            tagForReadOnly = me.getTagForReadOnly();
        if (tagForReadOnly) {
            var bodyEl = me.bodyEl;
            if (bodyEl) {
                me.readOnlyElement = bodyEl.createChild({
                    tag: me.getTagForReadOnly(),
                    reference: 'readOnlyElement',
                    tabindex: me.inputTabIndex,
                    cls: Ext.baseCSSPrefix + 'form-text-default abp-read-only-link'
                });
                me.doReadOnlyTagUpdate();
            }
        }
    },

    getLabelHidden: function () {
        var me = this;

        return me.getHideLabel();
    },

    setLabelHidden: function (value) {
        var me = this;

        me.setHideLabel(value);
    },

    // Add/override methods for classic toolkit specific logic.
    setFieldFormattedValue: function (fieldFormatter, fieldFormat, userTyping) {
        var rawValue = this.getRawValue(),
            formattedValue = fieldFormatter(this, fieldFormat, (Ext.isEmpty(rawValue) ? '' : rawValue).toString(), userTyping, rawValue);
        this.setRawValue(formattedValue);
    }
});
