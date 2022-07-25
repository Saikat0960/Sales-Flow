/**
 * @private
 *  Base field mixin.
 */
Ext.define("ABPControlSet.base.mixin.Field", {
    extend: "ABPControlSet.base.mixin.Component",

    config: {
        /**
         * @cfg {String} fieldLabel
         *
         * A string to be shown as the label. This is for modern support of the fieldLabel property - original property for modern is label.
         */
        fieldLabel: null,
        /**
         * @cfg {Function} fieldFormatter
         *
         * A method to be executed when the user in inputting as well as when the user blurs from the field to determine the value to display.
         */
        fieldFormatter: null,
        /**
         * @cfg {String} fieldFormat
         *
         * A format string for the field input.
         */
        fieldFormat: null,
        /**
         * @cfg {Boolean} fieldFormatOnLoad
         *
         * Whether or not to format the initial value when the field is first loaded with it's bound value.
         */
        fieldFormatOnLoad: true,
        /**
         * @cfg {Boolean} required
         *
         * Specify true to validate that the value's length must be > 0. If false, then a blank value is always taken to be valid regardless of any vtype validation that may be applied.
         */
        required: null,
        /**
         * @cfg {Boolean} spellcheck
         *
         * Whether or not the field uses the browser spellcheck and/or autocorrect.
         */
        spellcheck: true,

        /**
         * @cfg {String} labelForegroundColor
         *
         * A valid color value in css to set as the label color.
         */
        labelForegroundColor: null,

        /**
         * @cfg {Boolean} labelHidden
         *
         * Whether or not the field shows it's label.
         */
        labelHidden: null,
        /**
         * @cfg {String} blankText
         *
         * The text to display within the field when it is empty.
         */
        blankText: null,
        /**
         * @cfg {Boolean} sizeToInnerContent
         *
         * Allow the inner context of the field to size to its text values.
         */
        sizeToInnerContent: null,
        /**
         * @cfg {String} tagForReadOnly
         *
         * If set, when the field is read only the value will be shown within the specified tag type.
         */
        tagForReadOnly: null
    },

    // TODO: Triggers - when the field is disabled, it's triggers might want to be enabled. Config property?
    // TODO: If a field is disabled, the triggers shouldn't be able to be tabbed into? (Hooked into above TODO?)

    mixinConfig: {
        after: {
            setValue: 'onValueUpdate',
            destroy: 'doCleanup',
            setReadOnly: 'onReadOnlyUpdate',
            afterRender: 'onAfterRender'
        }
    },

    /**
     * @private
     * The internal storage of the linked label component.
     */
    __linkedLabel: null,

    constructor: function (config) {
        config = config || {};

        /*
            Note: Plugins added during construction will wipe out any plugins defined on a class prototype definition.
            In order for multiple plugins to be used on a component, add them through the addCSPlugin method.
        */
        this.addCSPlugin(config, "abpfield");
        if (config.linkedLabel) {
            this.addCSPlugin(config, "abplinkedlabel");
        }
        this.callParent([config]);
    },

    // Handle the after 'setValue' process. Format and field sizing.
    onValueUpdate: function (value) {
        var me = this,
            fieldFormatOnLoad = me.getFieldFormatOnLoad();
        if (fieldFormatOnLoad && !me.userTyping && !me.containsFocus) {
            // If the user is not typing, apply formatting during the update.
            var fieldFormatter = me.getFieldFormatter();
            var fieldFormat = me.getFieldFormat();
            if (Ext.isFunction(fieldFormatter)) {
                me.setFieldFormattedValue(fieldFormatter, fieldFormat, false);
            }
        }
        if (me.getSizeToInnerContent()) {
            me.doSizeToInnerContent();
        }
        if (me.getTagForReadOnly()) {
            me.doReadOnlyTagUpdate();
        }
    },

    /** @private @ignore
    */
    updateSizeToInnerContent: function (sizeToInnerContent) {
        // Toggle the css class which allows the shrinking to content to occur.
        this.toggleCls('abp-size-to-content-input', sizeToInnerContent);
        if (sizeToInnerContent) {
            // If true, perform the sizing.
            this.doSizeToInnerContent();
        }
    },

    /** @private @ignore
     * Overriden in toolkit specific class.
    */
    onAfterRender: Ext.emptyFn,

    /** @private @ignore
     * Overriden in toolkit specific class if needed.
    */
    doReadOnlyTagUpdate: function () {
        var me = this,
            readOnly = me.getReadOnly(),
            readOnlyElement = me.readOnlyElement,
            value = me.getValue();
        if (readOnlyElement) {
            me.toggleCls('abp-read-only-link-field', readOnly);
            if (Ext.isModern) {
                readOnlyElement.setHtml(Ext.String.htmlEncode(me.getInputValue()));
            } else {
                readOnlyElement.setHtml(Ext.String.htmlEncode(me.getRawValue()));
            }

            // If the tag is a then ensure the href property is set,
            // along with target and rel attributes if usage is url or address.
            if (me.getTagForReadOnly() === 'a') {
                readOnlyElement.set({
                    'href': me.formatUsageUrl(value)
                });

                if (me.usage === "url" || me.usage === "address") {
                    readOnlyElement.set({
                        'target': '_blank',
                        'rel': 'noopener noreferrer'
                    });
                }
            }
        }
    },

    formatUsageUrl: function (value) {
        var me = this,
            formatStr;

        switch (me.usage) {
            case 'phone':
                formatStr = "tel:{0}";
                break;
            case 'email':
                formatStr = "mailto:{0}";
                break;
            case 'address':
                formatStr = ABPControlSet.common.Constants.MAP_URL_FORMAT_STRING;
                break;
            default:
                formatStr = "{0}";
                break;
        }

        return Ext.String.format(formatStr, value);
    },

    // Handle the after of 'setReadOnly' - used to update the visibility state of the input element or read only tag element.
    onReadOnlyUpdate: function () {
        var me = this;
        if (me.getTagForReadOnly()) {
            var readOnly = me.getReadOnly(),
                readOnlyElement = me.readOnlyElement;
            if (readOnlyElement) {
                me.toggleCls('abp-read-only-link-field', readOnly);
            }
        }
    },

    /** @private @ignore
     * Overriden in toolkit specific class.
    */
    doSizeToInnerContent: Ext.emptyFn,

    // Must be supplied in both Modern and Classic.
    // setFieldLabel: null,
    // Must be supplied in both Modern and Classic.
    // updateSpellcheck: null,
    // Must be supplied in both Modern and Classic.
    // getInputElement: null,

    getBackgroundColor: function () {
        // Work directy on the input element, rather than the component itself.
        // The input element is the thing we want to color.
        // The commmon base field mixin only deals with the rendered case.
        // The unrendered cases must be handled by specific code in the Class and Modern overrides.
        var inputEl = this.getInputElement();
        if (inputEl) {
            return inputEl.getStyle("background-color");
        } else {
            // Otherwise best we can do is return the backgroundColor's config value.
            return this._backgroundColor; // Not calling callParent because the Component's getBackgroundColor does Component-specific things.
        }
    },

    getForegroundColor: function () {
        // Work directy on the input element, rather than the component itself.
        // The input element is the thing we want to color.
        // The commmon base field mixin only deals with the rendered case.
        // The unrendered cases must be handled by specific code in the Class and Modern overrides.
        var inputEl = this.getInputElement();
        if (inputEl) {
            return inputEl.getStyle("color");
        } else {
            // Otherwise best we can do is return the foregroundColor's config value.
            return this._foregroundColor; // Not calling callParent because the Component's getForegroundColor does Component-specific things.
        }
    },

    updateBackgroundColor: function (color) {
        // Work directy on the input element, rather than the component itself.
        // The input element is the thing we want to color.
        // The commmon base field mixin only deals with the rendered case.
        // The unrendered cases must be handled by specific code in the Class and Modern overrides.
        var inputEl = this.getInputElement();
        if (inputEl && this.rendered) {
            inputEl.setStyle("background-color", color);
        }
        // setBackgroundColor will store the color in the config's private variable.
    },

    updateForegroundColor: function (color) {
        // Work directy on the input element, rather than the component itself.
        // The input element is the thing we want to color.
        // The commmon base field mixin only deals with the rendered case.
        // The unrendered cases must be handled by specific code in the Class and Modern overrides.
        var inputEl = this.getInputElement();
        if (inputEl && this.rendered) {
            inputEl.setStyle("color", color);
        }
        // setBackgroundColor will store the color in the config's private variable.
    },

    getLabelForegroundColor: function () {
        var me = this;

        // Fallback if no el.
        // style is available in Classic and Modern.
        var label = me.getLabel();
        if (Ext.isObject(label.style)) {
            return label.style.color;
        } else {
            // Otherwise best we can do is return the forewgroundColor's config value.
            return me.callParent();
        }
    },

    updateLabelForegroundColor: function (color) {
        var me = this;
        var label = me.labelElement;
        if (label) {
            label.setStyle('color', color);
        }
    },

    /**
     * Allow getting of the blank text.
     */
    getBlankText: function (blankText) {
        return this.blankText;
    },

    /**
     * Allow setting of the blank text.
     */
    setBlankText: function (blankText) {
        this.blankText = blankText;
    },

    /**
     * Overidden in toolkit specific classes.
     */
    setFieldFormattedValue: Ext.emptyFn,

    /**
     * Post destroy cleanup.
     */
    doCleanup: function () {
        if (this.inputTextMetrics) {
            this.inputTextMetrics = this.inputTextMetrics.destroy();
        }
        if (this.readOnlyElement) {
            this.readOnlyElement = this.readOnlyElement.destroy();
        }
    }
});
