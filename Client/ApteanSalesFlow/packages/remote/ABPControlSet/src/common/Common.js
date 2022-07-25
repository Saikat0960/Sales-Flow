/**
 * @private
 * Control Set common helpers.
 */
Ext.define("ABPControlSet.common.Common", {
    singleton: true,
    config: {
        iconStore: null
    },

    /**
     * @property {String} iconPrefix
     * A string indicating the CSS class prefix used by the fonts to be displayed.  Note this will require no other CSS
     * classes have this prefix.  The Aptean ICO fonts are all prefixed with "icon-" and this is used by the font CSS to
     * specify the font-family and other style defaults for the font.
     */
    iconPrefix: "icon-",

    iconRe: /(?:^|\s)pickericon-(\S*)(?:\s|$)/,

    getComponentFromElement: function (element) {
        var cmp = Ext.Viewport,
            possibleCmp;
        if (element) {
            cmp = null;
            while (cmp === null) {
                possibleCmp = Ext.getCmp(element.id);
                if (possibleCmp instanceof Ext.Widget || possibleCmp instanceof Ext.Component) {
                    cmp = possibleCmp
                } else {
                    element = element.offsetParent;
                    if (!element) {
                        break;
                    }
                }
            }
        }
        return cmp;
    },

    getIconStore: function () {
        var iconStore = this.callParent(arguments);
        if (!iconStore) {
            var me = this,
                iconRegex = new RegExp("^\\.(" + me.iconPrefix + ".*)::before$"),
                match = null;

            // Populate the Icon Picker Store with icons defined in CSS
            var icons = [];
            Ext.iterate(Ext.util.CSS.getRules(), function (key, value) {
                match = iconRegex.exec(value.selectorText);
                if (match) {
                    icons.push({
                        icon: match[1]
                    });
                }
            });
            iconStore = new Ext.data.Store({
                data: icons
            });
            this.setIconStore(iconStore);
        }

        return iconStore;
    }
});
