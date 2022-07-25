Ext.define("ABPControlSet.mixin.Checkbox", {
    override: "ABPControlSet.base.mixin.Checkbox",

    // Add/override methods for classic toolkit specific logic.
    updateFieldLabel: function (fieldLabel) {
        this.setLabel(fieldLabel);
    },

    getFieldLabel: function () {
        return this.getLabel();
    },

    updateForegroundColor: function (color) {
        var me = this;
        if (me.rendered) {
            var el = me.iconElement; // The font icon is in the iconElement for checkboxes.
            if (el) {
                el.setStyle("color", color);
            }
        } else {
            me.on("painted", function () {
                me.iconElement.setStyle("color", color);
            }, me);
        }
    },

    updateBackgroundColor: function (color) {
        var me = this;
        if (me.rendered) {
            var el = me.iconElement; // The font icon is in the iconElement for checkboxes.
            if (el) {
                el.setStyle("background-color", color);
            }
        } else {
            me.on("painted", function () {
                me.iconElement.setStyle("background-color", color);
            }, me);
        }
    },

    getBackgroundColor: function () {
        var me = this;
        if (me.rendered) {
            var el = me.iconElement; // The font icon is in the iconElement for checkboxes.
            if (el) {
                return el.getStyle("background-color");
            }
        } else {
            // Otherwise best we can do is return the backgroundColor's config value.
            return this._backgroundColor; // Not calling callParent because the Component's getBackgroundColor does Component-specific things.
        }
    },

    getForegroundColor: function () {
        var me = this;
        if (me.rendered) {
            var el = me.iconElement; // The font icon is in the iconElement for checkboxes.
            if (el) {
                return el.getStyle("color");
            }
        } else {
            // Otherwise best we can do is return the foregroundColor's config value.
            return this._foregroundColor; // Not calling callParent because the Component's getForegroundColor does Component-specific things.
        }
    }
});