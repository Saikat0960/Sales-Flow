/**
 * Classic radio group mixin.
 */
Ext.define("ABPControlSet.mixin.RadioGroup", {
    override: "ABPControlSet.base.mixin.RadioGroup",

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
        return this.el;
    },

    updateRequired: function (required) {
        var me = this;
        required = required === true ? true : false;
        me.allowBlank = !required;
        // If not rendered, the initialization of the field will take care of properly styling the element based on the allowBlank property.
        if (me.rendered) {
            me.validate();
        }
    },

    updateForegroundColor: function (color) {
        var me = this;
        // For radiogroup, it is the children that are colored, so the render check
        // needs to an afterrender of the radiogroup, otherwise the radiogroup can be
        // beign rendered, but the displayEls do not exist yet.
        if (me.rendered) {
            me.__renderedRadioGroupUpdateForegroundColor(color);
        } else {
            // Using the render event is too soon - the child displayEls are still not rendered.
            // So using afterrender.
            me.on("afterrender", function () {
                me.__renderedRadioGroupUpdateForegroundColor(color);
            }, me);
        }
    },

    __renderedRadioGroupUpdateForegroundColor: function (color) {
        var me = this;
        // For radiogroup, it is the children that are colored.
        // This can only happen once the radiogroup is rendered.
        var items = me.items && me.items.getRange ? me.items.getRange() : me.items || [],
            length = items.length;
        var displayEls = Ext.Array.pluck(items, "displayEl");
        for (var i = 0; i < length; i++) {
            displayEls[i].setStyle("color", color);
        }
    },

    updateBackgroundColor: function (color) {
        var me = this;
        // For radiogroup, it is the children that are colored, so the render check
        // needs to an afterrender of the radiogroup, otherwise the radiogroup can be
        // beign rendered, but the displayEls do not exist yet.
        if (me.rendered) {
            me.__renderedRagioGroupUpdateBackgroundColor(color);
        } else {
            // Using the render event is too soon - the child displayEls are still not rendered.
            // So using afterrender.
            me.on("afterrender", function () {
                me.__renderedRagioGroupUpdateBackgroundColor(color);
            }, me);
        }
    },

    __renderedRagioGroupUpdateBackgroundColor: function (color) {
        var me = this;
        // For radiogroup, it is the children that are colored.
        // This can only happen once the radiogroup is rendered.
        var items = me.items && me.items.getRange ? me.items.getRange() : me.items || [],
            length = items.length;
        var displayEls = Ext.Array.pluck(items, "displayEl");
        for (var i = 0; i < length; i++) {
            displayEls[i].setStyle("background-color", color);
        }
    }

    // For getBackgroundColor and getForegroundColor, going to assume the value of the
    // associated config will be sufficient.
});