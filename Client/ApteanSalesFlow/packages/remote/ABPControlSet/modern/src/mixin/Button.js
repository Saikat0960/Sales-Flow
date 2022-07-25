/**
 * Modern button mixin.
 */
Ext.define('ABPControlSet.mixin.Button', {
    override: 'ABPControlSet.base.mixin.Button',

    // Add/override methods for modern toolkit specific logic.
    updateIcons: function (icons) {
        var me = this,
            element = me.iconElement,
            hasIconCls = me.hasIconCls;

        if (Ext.isString(icons)) {
            icons = icons.split(',');
        }

        if (icons && icons.length > 0) {
            me.addCls(hasIconCls);
            var iconUrls = '';
            var length = icons.length;
            for (var i = 0; i < length; i++) {
                iconUrls += 'url(' + icons[i] + ')' + (length === i + 1 ? '' : ',');
            }
            element.setStyle('background-image', iconUrls);
        } else {
            element.setStyle('background-image', '');
            if (!me.getIconCls()) {
                me.removeCls(hasIconCls);
            }
        }
    },

    updateForegroundColor: function (color) {
        var me = this;

        // Do the parent's foreground update (which sets color on the input elment),
        // but also set the foreground color on an innnerEl, if it exists. This will
        // be where text is shown in the button.
        this.callParent(arguments);

        // Set the text of the button (if exists) to this color too.
        // This is in the inner.
        if (me.rendered) {
            var el = me.textElement; // The text is in the textElement for buttons.
            if (el) {
                el.setStyle('color', color);
            }
        } else {
            me.on('painted', function () {
                me.textElement.setStyle('color', color);
            }, me);
        }
    },

    updateBackgroundColor: function (color) {
        var me = this;
        this.callParent(arguments);

        if (me.rendered) {
            var el = me.element;
            if (el) {
                el.setStyle('background-color', color);
                el.setStyle('border-color', color);
            }
        } else {
            me.on('painted', function () {
                var el = me.element;
                el.setStyle('background-color', color);
                el.setStyle('border-color', color);
            }, me);
        }
    },

    updateButtonIconStyle: function (style) {
        var me = this;

        // Set the styles to the element when the element is available.
        if (me.rendered) {
            if (me.iconElement) {
                me.iconElement.setStyle(style);
            }
        } else {
            me.on('painted', function () {
                if (me.iconElement) {
                    me.iconElement.setStyle(style);
                }
            });
        }
    }
});