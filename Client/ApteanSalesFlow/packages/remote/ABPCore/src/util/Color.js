/**
 * Utility clas used to manipulate the colors and color values for HTML and DOM elements
 */
Ext.define('ABP.util.Color', {
    singleton: true,

    /**
     * Converts the rgb or hex color formats into an array of RGB values
     *
     *  @param {String} c the color as a HTML string for example rgb(1, 34, 54) or #121212
     *  @returns {Array} An array containing the RGB values [R, G, B]
     */
    getRGBValues: function (c) {
        if (c.substr(0, 3) == "rgb") {
            return this.getFromRGBFunction(c);
        }
        if (c.substr(0, 1) == "#") {
            return this.getFromHex(c);
        }
    },

    /**
     * Get the WCAG contrast level for the specified DOM component by checking the computed constrast ratio between the foreground and background colors
     *
     * @param {Object} cmp the DOM component to check the colors on
     * @returns {String} string containing 'AA', 'AAA' or blank for invalid
     */
    getWCAGContrast: function (cmp) {
        var style = window.getComputedStyle(cmp, null);
        var background = style.getPropertyValue("background-color");
        if (this.isTransparent(background)) {
            background = this.getParentBackground(cmp);
        }
        var foreground = style.getPropertyValue("color");
        var fontSize = parseInt(style.getPropertyValue("font-size").replace('px', ''));
        var fontWeight = style.getPropertyValue("font-weight");

        var wcag = '';
        var isLargeText = (fontSize >= 24) || (fontSize > 18 && fontWeight >= 700);
        var ratio = ABP.util.Color.getContrast(foreground, background);

        if (isLargeText) {
            if (ratio >= 3) {
                if (ratio >= 4.5) {
                    wcag = 'AAA';
                }
                else {
                    wcag = 'AA';
                }
            }
            else {
                console.log('WCAG Fail - ' + background + ' / ' + foreground + ' > ' + ratio);
            }
        }
        else {
            if (ratio >= 4.5) {
                if (ratio >= 7) {
                    wcag = 'AAA';
                }
                else {
                    wcag = 'AA';
                }
            }
            else {
                console.log('WCAG Fail - ' + background + ' / ' + foreground + ' > ' + ratio);
            }
        }

        return wcag;
    },

    /**
     * Gets the contrast ratio between the 2 colors passed in
     *
     * @param {String} c1 the first color in RGB(x,y,z) or #XXYYZZ formats
     * @param {String} c2 the first color in RGB(x,y,z) or #XXYYZZ formats
     * @returns {Number} The contrast ratio between the 2 colors
     */
    getContrast: function (c1, c2) {
        var me = this;
        var rgb1 = c1;
        if (typeof c1 == "string") {
            rgb1 = me.getRGBValues(c1);
        }

        var rgb2 = c2;
        if (typeof c2 == "string") {
            rgb2 = me.getRGBValues(c2);
        }

        var lum1 = me.getLuminanace(rgb1[0], rgb1[1], rgb1[2]) + 0.05;
        var lum2 = me.getLuminanace(rgb2[0], rgb2[1], rgb2[2]) + 0.05;
        return (lum1 > lum2) ? lum1 / lum2 : lum2 / lum1;
    },

    /**
     * Determine which color (black or white) to return based on which color has the higher contrast with the color passed in
     * @param {String} color 
     */
    getContrastingBWColor: function (color) {
        var me = this;
        var black = me.getContrast('#000000', color);
        var white = me.getContrast('#FFFFFF', color);

        return (black > white) ? '#000000' : '#FFFFFF';
    },

    privates: {
        getFromHex: function (c) {
            var arr = [0, 0, 0];
            c = c.replace("#", "");
            arr[0] = parseInt(c.substr(0, 2), 16);
            arr[1] = parseInt(c.substr(2, 2), 16);
            arr[2] = parseInt(c.substr(4, 2), 16);
            return arr;
        },

        getFromRGBFunction: function (color) {
            color = color.toUpperCase();
            var c = color.replace("(", "");
            c = c.replace(")", "");
            c = c.replace("RGBA", "");
            c = c.replace("RGB", "");
            var arr = c.split(",");

            arr[0] = Number(arr[0]);
            arr[1] = Number(arr[1]);
            arr[2] = Number(arr[2]);
            if (color.indexOf("RGBA") > -1) {
                arr[3] = Number(arr[3]);
            }

            return arr;
        },

        getLuminanace: function (r, g, b) {
            var a = [r, g, b].map(function (v) {
                v /= 255;
                return v <= 0.03928
                    ? v / 12.92
                    : Math.pow((v + 0.055) / 1.055, 2.4);
            });
            return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
        },

        isTransparent: function (color) {
            var rgb = this.getFromRGBFunction(color);
            if (rgb.length <= 3) {
                return false;
            }

            return rgb[3] === 0;
        },

        getParentBackground: function (cmp) {
            var parent = cmp.parentElement;
            if (!parent) {
                return 'rgb(255,255,255)'
            }

            var style = window.getComputedStyle(parent, null);
            var background = style.getPropertyValue("background-color");
            if (this.isTransparent(background)) {
                return this.getParentBackground(parent);
            }

            return background;
        }
    }
})