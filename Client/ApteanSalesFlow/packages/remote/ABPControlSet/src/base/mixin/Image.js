/**
 * @private
 *  Base image mixin class.
 *
 */
Ext.define("ABPControlSet.base.mixin.Image", {
    extend: "ABPControlSet.base.mixin.Component",

    config: {
        /**
         * @cfg {String} fieldLabel
         *
         * A string to be shown as the label. This is for modern support of the fieldLabel property - original property for modern is label.
         */
        fieldLabel: null,
        /**
        * @cfg {String} src
        *
        * A string pointing to the path of an image.
        */
        src: null,

        /**
         * @cfg {String} cropStyle
         *
         * A string determining shape of image crop (border-radius) - "none", "oval", "circle".  The default is "none".
         */
        cropStyle: null,

        /**
         * @removed
         * @cfg {String} backgroundColor
         *
         * Not available for abpimage.
         */

        /**
         * @removed
         * @cfg {String} foregroundColor
         *
         * Not available for abpimage.
         */
    },

    /**
     * @removed
     * Not available for abpimage.
     */
    getBackgroundColor: function () {
        console.log("getBackgroundColor unsupported for abpimage.");
    },

    /**
     * @removed
     * Not available for abpimage.
     */
    getForegroundColor: function () {
        console.log("getForegroundColor unsupported for abpimage.");
    },

    /**
     * @removed
     * Not available for abpimage.
     */
    setBackgroundColor: function () {
        console.log("setBackgroundColor unsupported for abpimage.");
    },

    /**
     * @removed
     * Not available for abpimage.
     */
    setForegroundColor: function () {
        console.log("setForegroundColor unsupported for abpimage.");
    },

    /**
     * @removed
     * Not available for abpimage.
     */
    updateBackgroundColor: function (color) {
        console.log("setBackgroundColor unsupported for abpimage.");
    },

    /**
     * @removed
     * Not available for abpimage.
     */
    updateForegroundColor: function (color) {
        console.log("setForegroundColor unsupported for abpimage.");
    },

    getTooltipEl: function () {
        var me = this;

        if (me.rendered) {
            var image = me.down("#user-image");
            return image ? image.el : me.el;
        }
    },

    /**
    * Update the placholder text component value.
    */
    updatePlaceholder: function (placeholderValue) {
        var placeholder = this.down('#placeholder');

        if (placeholder && !Ext.isString(placeholderValue)) {
            placeholderValue = "";
        }

        placeholder.setHtml(placeholderValue);
    },

    /**
    * On image load,
    *   unhide the loaded user image container,
    *   hide the placeholder text container,
    *   hide the placeholder image container.
    */
    onImageLoaded: function () {
        var me = this;

        me.showLoadedImage();
        me.hidePlaceHolderText();
        me.hidePlaceHolderImage();
    },

    privates: {
        /**
        * @private
        * Show User Image.
        */
        showLoadedImage: function() {
            var image = this.down('#user-image');

            if (image) {
                image.show();
                image.addCls('loaded');
            }
        },

        /**
        * @private
        * Hide Placeholder Text.
        */
        hidePlaceHolderText: function() {
            var placeholder = this.down('#placeholder');

            if (placeholder) {
                placeholder.hide();
            }
        },

        /**
        * @private
        * Hide Placeholder Image.
        */
        hidePlaceHolderImage: function() {
            if (this.getSrc() !== "") {
                var placeholderImage = this.down('#placeholder-image');

                placeholderImage.hide();
            }
        },

        /**
        * @private
        * Add a class name for image cropStyle.
        */
        configureImageClassName: function (cropStyle, dimensions) {
            var className = "";

            if (cropStyle && cropStyle !== 'none') {
                className = "cropped";
                if (cropStyle === "oval") {
                    className += " oval";
                }
            }

            return className;
        },

        /**
        * @private
        * Determine what size the image should be based on the cropStyle.
        */
        configureDimensions: function (config) {
            if (config.cropStyle === 'circle') {
                var height = config.height || 0,
                    width = config.width || 0,
                    smaller = height < width ? height : width;

                return {
                    height: smaller,
                    width: smaller
                }
            } else {
                return {
                    height: config.height,
                    width: config.width
                }
            }
        }
    }
});
