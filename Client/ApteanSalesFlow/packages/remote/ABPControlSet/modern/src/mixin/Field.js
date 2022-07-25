/**
 * Modern field mixin.
 */
Ext.define("ABPControlSet.mixin.Field", {
    override: "ABPControlSet.base.mixin.Field",

    constructor: function (config) {
        this.callParent([config]);
        // Overwrite the updateRequired so we can hook into it.
        this.updateRequired = this.onUpdateRequired;
    },

    onUpdateRequired: function (required) {
        var me = this;
        me.superclass.updateRequired.apply(this, arguments);
        // Update necessary styles.
        if (me.__linkedLabel) {
            // If there is a linked label
            me.__linkedLabel.toggleCls('abp-mandatory', required);
        }
        if (me.labelElement) {
            me.labelElement.toggleCls('abp-mandatory', required);
        }
    },

    updateFieldLabel: function (fieldLabel) {
        this.setLabel(fieldLabel);
    },

    getFieldLabel: function () {
        return this.getLabel();
    },

    getInputElement: function () {
        return this.inputElement; // inputElement for Modern fields.
    },

    updateSpellcheck: function (spellcheck) {
        if (Ext.isFunction(this.setAutoCorrect)) {
            this.setAutoCorrect(!!spellcheck);
        }
        if (Ext.isFunction(this.setInputAttribute)) {
            this.setInputAttribute('spellcheck', spellcheck ? "true" : "false");
        }
    },

    updateForegroundColor: function (color) {
        // If the field is rendered then use the common base updater.
        // Else set the style on the input element once this field
        // is rendered.
        var me = this;
        if (me.rendered) {
            this.callParent(arguments);
        } else {
            me.on("painted", function () {
                me.inputElement.setStyle('color', color);
            }, me);
        }
        // setForegroundColor will store the color in the config's private variable.
    },

    updateBackgroundColor: function (color) {
        // If the field is rendered then use the common base updater.
        // Else set the style on the input element once this field
        // is rendered.
        var me = this;
        if (me.rendered) {
            this.callParent(arguments);
        } else {
            me.on("painted", function () {
                me.inputElement.setStyle('background-color', color);
            }, me);
        }
        // setBackgroundColor will store the color in the config's private variable.
    },

    getLabelHidden: function () {
        var me = this;

        return me.labelElement.el.getHidden();
    },

    setLabelHidden: function (value) {
        var me = this;

        if (value) {
            me.labelElement.el.hide();
        } else {
            me.labelElement.el.show();
        }
    },

    // Used to ensure no loop occurs on setting of the formatted value when the user is not typing.
    fromSetFormattedValue: false,

    // Add/override methods for classic toolkit specific logic.
    setFieldFormattedValue: function (fieldFormatter, fieldFormat, userTyping) {
        // In the case where the control has no input value {for example textdisplay}, we take the value.
        var valueToFormat = this.getInputValue ? this.getInputValue() : this.getValue(),
            formattedValue = fieldFormatter(this, fieldFormat, (Ext.isEmpty(valueToFormat) ? '' : valueToFormat).toString(), userTyping, valueToFormat);

        if (userTyping) {
            this.setInputValue(formattedValue);
        } else if (!this.fromSetFormattedValue) {
            this.fromSetFormattedValue = true;
            this.setValue(formattedValue);
        }
        this.fromSetFormattedValue = false;
    },

    /**
     * @private @ignore
     * Hook into the afterRender. Add the readOnlyElement if the field is configured with a tag for read only.
     */
    onAfterRender: function () {
        var me = this,
            tagForReadOnly = me.getTagForReadOnly();
        if (tagForReadOnly) {
            var innerElement = me.innerElement;
            if (innerElement) {
                me.readOnlyElement = innerElement.createChild({
                    tag: me.getTagForReadOnly(),
                    reference: 'readOnlyElement',
                    tabindex: me.inputTabIndex,
                    cls: Ext.baseCSSPrefix + 'input-el abp-read-only-link'
                });
                me.doReadOnlyTagUpdate();
            }
        }
    },

    /**
     * @private @ignore
     * Determine the input width so the field label aligns against the right of the field.
     */
    doSizeToInnerContent: function () {
        var me = this,
            el = me.el,
            afterInputElement = me.afterInputElement, // Used to get width of the triggers.
            afterInputWidth = afterInputElement ? afterInputElement.getWidth() : 0,
            bodyWrapElement = me.bodyWrapElement, // The body element wrapping the input (this needs its width to be set to constrain the input)
            totalWidth = el.getWidth(),
            inputElement = me.inputElement,
            labelWidth = me.labelTextElement ? me.labelTextElement.getWidth() : 0,
            inputMetrics = me.inputTextMetrics = me.inputTextMetrics || new Ext.util.TextMetrics(inputElement),
            maxInputWidth = totalWidth - labelWidth,
            rawValue = me.getInputValue(),
            inputWidth = inputMetrics.getWidth(rawValue) + inputElement.getPadding('lr') + afterInputWidth,
            preciseWidth = inputWidth > maxInputWidth ? maxInputWidth : inputWidth;
        if (preciseWidth && bodyWrapElement) {
            bodyWrapElement.setMaxWidth(preciseWidth);
        }
    }
});
