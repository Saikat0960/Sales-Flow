/**
 * Classic button mixin.
 */
Ext.define("ABPControlSet.mixin.Button", {
    override: "ABPControlSet.base.mixin.Button",

    // Add/override methods for classic toolkit specific logic.

    /**
     * Sets the background image's (inline style) of the button.
     */
    setIcons: function (icons) {
        icons = icons || [];
        var me = this,
            oldIcons = me.getIcons(),
            btnIconEl = me.btnIconEl;

        if (Ext.isString(icons)) {
            icons = icons.split(',');
        }
        // If setIcon is called when we are configured with a glyph, clear the glyph
        if (me.glyph) {
            me.setGlyph(null);
        }

        me.icons = icons;

        if (btnIconEl) {
            btnIconEl.removeCls(me.iconCls);
            var iconUrls = "";
            var length = icons.length;
            for (var i = 0; i < length; i++) {
                iconUrls += 'url(' + icons[i] + ')' + (length === i + 1 ? "" : ",");
            }

            btnIconEl.setStyle('background-image', iconUrls);
            // Currently just contain the images to the default size of the element.
            btnIconEl.setStyle('background-size', "contain");
            me._syncHasIconCls();
            // Icons updated, update layout.
            me.updateLayout();
        }
    },

    updateForegroundColor: function (color) {
        var me = this;

        // Do the parent's foreground update (which sets color on the main component element)
        me.callParent(arguments);

        // But also set the foreground color on an innnerEl, if it exists. This will
        // be where text is shown in the button.
        if (me.rendered) {
            var el = me.btnInnerEl; // The is in the btnInnerEl for buttons.
            if (el) {
                el.setStyle("color", color);
            }
        } else {
            me.on("render", function () {
                me.btnInnerEl.setStyle("color", color);
            }, me);
        }
    },

    updateButtonIconStyle: function (style) {
        var me = this;

        // Set the styles to the element when the element is available.
        if (me.rendered) {
            if (me.btnIconEl) {
                me.btnIconEl.setStyle(style);
            }
        } else {
            me.on("render", function () {
                if (me.btnIconEl) {
                    me.btnIconEl.setStyle(style);
                }
            });
        }
    }

});