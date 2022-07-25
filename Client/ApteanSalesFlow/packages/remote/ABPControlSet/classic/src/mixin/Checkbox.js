Ext.define("ABPControlSet.mixin.Checkbox", {
    override: "ABPControlSet.base.mixin.Checkbox",

    // Add/override methods for classic toolkit specific logic.

    updateForegroundColor: function (color) {
        // Can't use getInputElement because Checkbox is not a child of Field in ABPControlSet.
        var me = this;
        if (me.rendered) {
            var el = me.displayEl; // The font icon is in the displayEl for checkboxes.
            if (el) {
                el.setStyle("color", color);
            }
        } else {
            me.on("render", function () {
                me.displayEl.setStyle("color", color);
            }, me);
        }
    },

    updateBackgroundColor: function (color) {
        // Can't use getInputElement because Checkbox is not a child of Field in ABPControlSet.
        var me = this;
        if (me.rendered) {
            var el = me.displayEl; // The font icon is in the displayEl for checkboxes.
            if (el) {
                el.setStyle("background-color", color);
            }
        } else {
            me.on("render", function () {
                me.displayEl.setStyle("background-color", color);
            }, me);
        }
    },

    getBackgroundColor: function () {
        var me = this;
        if (me.rendered) {
            var el = me.displayEl; // The font icon is in the displayEl for checkboxes.
            if (el) {
                el.getStyle("background-color");
            }
        } else {
            // Otherwise best we can do is return the backgroundColor's config value.
            return me._backgroundColor; // Not calling callParent because the Component's getBackgroundColor does Component-specific things.
        }
    },

    getForegroundColor: function () {
        var me = this;
        if (me.rendered) {
            var el = me.displayEl; // The font icon is in the displayEl for checkboxes.
            if (el) {
                el.getStyle("color");
            }
        } else {
            // Otherwise best we can do is return the foregroundColor's config value.
            return me._foregroundColor; // Not calling callParent because the Component's getForegroundColor does Component-specific things.
        }
    }

});