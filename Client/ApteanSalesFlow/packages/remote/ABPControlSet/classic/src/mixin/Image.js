/**
 *  Base image mixin class.
 *
 */
Ext.define("ABPControlSet.mixin.Image", {
    override: "ABPControlSet.base.mixin.Image",

    renderConfig: {
        /**
         * @cfg {Boolean} placeholder
         *
         * The text to show while the image is being loaded.
         */
        placeholder: null,

        /**
        * @cfg {Boolean} src
        *
        * A boolean determining if image is readOnly.
        */
        readOnly: null
    },

    updateSrc: function (source) {
        var me = this;

        if (me.rendered) {
            var imageCmp = me.down("image");
            if (imageCmp) {
                imageCmp.setSrc(source);
            } else {
                me.items[0].src = source;
            }
        } else {
            me.items[0].src = source;
        }
    },

    updateReadOnly: function (newReadOnly) {
        var imagePicker = this.down('#image-picker');

        if (newReadOnly) {
            this.removeCls('abp-image-upload');
        } else {
            this.addCls('abp-image-upload');
        }

        imagePicker.setReadOnly(newReadOnly);
        imagePicker.setHidden(newReadOnly);

        return this;
    }

});
