/**
 * Utility to select related colors based on current theme.
 * New colors must be added to the mixin in ABPTheme\sass\var\themes\index.scss.
 * TODO Definition of secondary colors and inclusion of anything else we want i.e. 'tertiary' or 'green'
 *
 * @since ABP 3.1.0
 */
Ext.define('ABP.util.CSS.Colors', {
    singleton: true,

    themePrefixCls: '.abp-theme-colors ',
    defaultMismatchColor: 'darkred',
    selectors: {
        'base': '.abp-theme .base '
    },

    /**
     * Returns the rgb value of the color specified. If the color is included in selectors, it will be the 
     * color defined for the current theme base on the selector, otherwise it warn the user and return 'darkred'
     * 
     * @param {String} color Name of the color we want to select, current options are:
     * 
     * User preference color:
     * 
     * - abp-theme.base - This is the color chosen by the user in the ABP personalization right panel. The actual RGB value changes depending on what the user choses. Using this value ensures that the ABPForm will also change color when the user changes their personal theme.
     * 
     * Primary colors:
     * 
     * - abp-theme.yellow
     * - abp-theme.sierra
     * - abp-theme.deep-purple
     * - abp-theme.navy
     * - abp-theme.vivid-blue
     * - abp-theme.lucid-blue
     * - abp-theme.sky-blue
     * - bp-theme.background-grey
     * - abp-theme.light-grey
     * - abp-theme.grey
     * - abp-theme.nevada
     * - abp-theme.dark-grey
     * - abp-theme.deep-grey
     * - abp-theme.green
     * - abp-theme.note-grey
     *
     * Secondary colors:
     * 
     * - abp-theme.lawn-green
     * - abp-theme.teal
     * - abp-theme.purple
     * - abp-theme.vivid-orange
     * 
     * Interaction colors:
     * 
     * - abp-theme.selected-blue
     * - abp-theme.hover-blue
     * - abp-theme.highlight-blue
     * - abp-theme.selected-sierra
     * - abp-theme.hover-sierra
     * - abp-theme.highlight-sierra
     * - abp-theme.alert-red
     * - abp-theme.hover-green
     * - abp-theme.selected-green
     * - abp-theme.highlight-green
     * - abp-theme.disabled-grey
     * - abp-theme.midnight-grey
     * 
     * For example: ABP.util.CSS.getThemeColor('abp-theme.base') returns the user-preference color.
     */
    getThemeColor: function (color) {
        var result;
        var me = this;
        var selectedThemeSelector = '.' + ABP.ThemeManager.getSelectedTheme();
        var selector = me.selectors[color];
        if (Ext.isEmpty(selector)) {
            selector = '.abp-theme .' + color;
            result = this.getProperty(me.themePrefixCls + selector, 'color', me.defaultMismatchColor);
        }
        else {
            result = this.getProperty(me.themePrefixCls + selector + selectedThemeSelector, 'color', me.defaultMismatchColor);
        }
        if (result === me.defaultMismatchColor) {
            ABP.util.Logger.logWarn('The ABP theme color requested is not in the ABP theme: "' + color + '". Using the mismatch color "' + me.defaultMismatchColor + '" to highlight the problem control.');
        }
        return result;
    },
    /**
     * Returns the rgb value of the color specified. If the color is included in selectors, it will be the 
     * color defined for the current theme base on the selector, otherwise it will return the passed color string.
     * 
     * @param {String} color Name of the color we want to select, current options are 'abp-theme.base' and 'abp-theme.secondary'
     * ex. ABP.util.CSS.getThemeColor('abp-theme.secondary') returns the secondary color for the current theme
     * ... ABP.util.CSS.getThemeColor('red') returns 'red' (or any value not mapped in selectors)
     */
    getAnyColor: function (color) {
        var me = this;
        var selectedThemeSelector = '.' + ABP.ThemeManager.getSelectedTheme();
        var result = this.getProperty(me.themePrefixCls + me.selectors[color] + selectedThemeSelector, 'color', color);
    },

    /**
     * Returns the value of a css property if it is mapped or the original css value.
     * 
     * @param {String} selector A css selector string or string mapped in the selectors object.
     * @param {String} property The css property we want the value of.
     * @param {String} original The original value that was used to select the CSS rule. If it is not a mapping, returned as passed.
     */
    getProperty: function (selector, property, original) {
        var rule = Ext.util.CSS.getRule(selector);
        if (rule) {
            var value = rule.styleMap ? rule.styleMap.get(property) : rule.style.getPropertyValue(property);
            if (value) {
                return value.toString();
            }
        } else {
            return original;
        }
    }

});