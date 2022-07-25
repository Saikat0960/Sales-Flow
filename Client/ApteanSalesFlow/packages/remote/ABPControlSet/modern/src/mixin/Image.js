
/**
 *  Base image mixin class.
 *
 */
Ext.define("ABPControlSet.mixin.Image", {
    override: "ABPControlSet.base.mixin.Image",

    config: {
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

    updateFieldLabel: function (fieldLabel) {
        this.setLabel(fieldLabel);
    },

    getFieldLabel: function () {
        return this.getLabel();
    },

    updateSrc: function (source) {
        var me = this;
        var imageCmp = me.down("image");
        if (imageCmp) {
            imageCmp.setSrc(source);
        } else {
            me.items[0].src = source;
        }
    },

    updateReadOnly: function (newReadOnly) {
        if (newReadOnly) {
            //this.setLayout(Ext.layout.fit);
            this.addCls('abp-image-upload-readonly');
        } else {

        }
        this.setLayout(Ext.layout.vbox);
        this.addCls('abp-image-upload');
        return this;
    }
});
