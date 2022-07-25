/**
 * ABPControlSet image component.
 */
Ext.define("ABPControlSet.view.field.Image", {
    extend: "Ext.form.FieldContainer",
    xtype: "abpimage",
    requires: [
        "ABPControlSet.base.view.field.plugin.LinkedLabel",
        "ABPControlSet.base.view.field.plugin.Field",
        "ABPControlSet.base.mixin.Image"
    ],

    mixins: [
        "ABPControlSet.base.mixin.Image"
    ],

    layout: "fit",

    cls: 'abp-image',

    publishes: ['src'],
    defaultPlaceHolder:  Ext.getResourcePath('img/temp_abpimage-placeholder.png', null, 'ABPControlSet'),

    renderConfig: {
        readOnly: null
    },

    constructor: function (config) {
        config = config || {};
        var height = parseInt(config.height || config.minHeight || config.maxHeight || 100);

        var readOnly = config.readOnly = config.readOnly === false ? false : true;

        var dimensions = this.configureDimensions(config);
        var imageClassName = this.configureImageClassName(config.cropStyle, dimensions);

        config.height = dimensions.height;
        config.width = dimensions.width;

        if (!config.readOnly && !config.src) {
            // if can edit and no src provided, show default camera place holder image.
            config.src = "";
            // add new-image class so we can change the position of the file picker focus trigger to include entire placeholder image.
            config.cls = ('new-image ' + (this.cls || '') + ' ' + (config.cls || '')).trim()
        }

        config.items = [
            {
                // Text Placeholder
                xtype: 'component',
                itemId: 'placeholder',
                html: config.placeholder || '',
                style: {
                    'text-align': 'center',
                    'font-size': (height / 20) + 'em'
                }
            },
            {
                // Default Image Picker Placeholder
                xtype: 'container',
                cls: ('placeholder-img-wrapper ' + imageClassName).trim(),
                itemId: 'defaultImage',
                hidden: readOnly,
                items: [{
                    xtype: "image",
                    itemId: 'placeholder-image',
                    src: this.defaultPlaceHolder
                }]
            },
            {
                // Selected Image
                xtype: 'container',
                cls: ('img-wrapper ' + imageClassName).trim(),
                items: [{
                    xtype: "image",
                    itemId: 'user-image',
                    hidden: true,
                    src: config.src,
                    listeners: {
                        el: {
                            click: this.onImageClick,
                            dblclick: this.onImageDblClick,
                            longpress: this.onImageLongPress,
                            load: this.onImageLoaded,
                            scope: this
                        }
                    }
                }]
            },
            {
                // Image File Picker
                xtype: 'filefield',
                itemId: 'image-picker',
                name: config.name || 'abp-image-upload-form',
                accept: 'image/*',
                cls: Ext.toolkit === "modern" ? 'x-icon icon-pencil' : "",
                buttonConfig: Ext.toolkit === "classic" ? {
                    iconCls: 'icon-pencil',
                    text: '',
                    scale: 'large',
                    userCls: 'large'
                } : null,
                inline: true,
                hidden: readOnly,
                listeners: {
                    change: {
                        element: 'el',
                        fn: this.onFileChange,
                        scope: this
                    }
                }
            },
            {
                xtype: 'abpbutton',
                cls: 'image-clear',
                iconCls: 'icon-garbage-can',
                handler: function() {
                    var abpImage = this.up();
                    abpImage.clearImage();
                }
            }
        ];

        this.mixins.abpcomponent.constructor.call(this, config);
        this.callParent([config]);
    },

    onImageLongPress: function (image) {
        this.fireEvent(ABPControlSet.common.types.Events.ImageLongPress, image);
    },

    onImageDblClick: function (image) {
        this.fireEvent(ABPControlSet.common.types.Events.ImageDoubleClick, image);
    },

    onImageClick: function (image) {
        this.fireEvent(ABPControlSet.common.types.Events.ImageClick, image);
    },

    /**
    * Reset the file picker value to null.
    */
    clearImage: function() {
        this.onFileChange({target: {files: []}});
    },

    /**
    * Handle file picker change.
    */
    onFileChange: function (event) {
        var me = this,
            file = event.target.files[0],
            reader = new FileReader();

        if (!file && !event.event) { // !event.event to make sure this is not a file picker browser window cancel click. (Provided through this.clearImage.)
            me.resetImagePicker();
            return;
        }

        reader.onload = function (e) {
            me.setSrc(e.target.result);
            me.removeCls('new-image');
        };

        if (file) {
            reader.readAsDataURL(file);
        }

    },

    privates: {
        /**
        * @private
        * Resets the image filePicker values.
        * Sets default placeholder as picker value.
        */
        resetImagePicker: function() {
            var me = this,
                filePicker = me.down('filefield');

            filePicker.reset();
            me.setSrc("");

            me.showDefaultPlaceholder();

            me.addCls('new-image');
            me.removeCls('loaded');
        },

        /**
        * @private
        *
        * Set placeholder image src to defaultPlaceHolder.
        * Show the placeholder image.
        */
        showDefaultPlaceholder: function() {
            var me = this,
                placeholderImage = me.down('#placeholder-image');

            placeholderImage.setSrc(this.defaultPlaceHolder);
            placeholderImage.show();
        }
    }

});
