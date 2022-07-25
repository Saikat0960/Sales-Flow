/**
 * @private
 * Base button mixin.
 */
Ext.define("ABPControlSet.base.mixin.Button", {
    extend: "ABPControlSet.base.mixin.Component",

    config: {
        /**
         * @cfg {String[]} icons
         *
         * An array of paths to image URL's. The images will show top to bottom.
         */
        icons: null,

        /**
         * @cfg {Number/String} iconFontSize
         *
         * If set, this will be set as the font-size styling of the icon element within the button.
         * Can be a number for pixels, or a string as a css style, e.g. '2em'
         */
        iconFontSize: null
    },

    // Determine whether or not to update the button icon styles.
    setIconFontSize: function (fontSize) {
        var me = this,
            previousFontSize = me.getIconFontSize();
        if ((!Ext.isEmpty(previousFontSize) && Ext.isEmpty(fontSize)) || !Ext.isEmpty(fontSize)) {
            // Update to clear only if a previous was set.
            // Or always update if the fontSize being set is not empty
            // Determine if we are prior to render or not, and update accordingly.
            me.updateButtonIconStyle({
                'font-size': Ext.isNumber(fontSize) ? (fontSize + 'px') : fontSize
            });
        }
        this.callParent(arguments);
    },

    // Overridden in toolkit specific mixin.
    updateButtonIconStyle: Ext.emptyFn
});