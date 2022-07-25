/**
 * ABPControlSet image component.
 */
Ext.define("ABPControlSet.view.field.Image", {
    extend: "Ext.field.Container",
    xtype: "abpimage",
    requires: [
        "ABPControlSet.base.mixin.Image"
    ],

    mixins: [
        "ABPControlSet.base.mixin.Image"
    ],

    layout: "fit",
    statics: {
        defaultDimension: 128
    },

    viewModel: {
        data: {
            pickerImageHasChanged: true,
            pickerImageIsRemovedOrNeverAdded: true,
            editorReadOnly: true
        },
        formulas: {
            addOrChangeButtonText: function (get) {
                return get('pickerImageIsRemovedOrNeverAdded') ? 'Add' : 'Change';
            }
        }
    },

    config: {
        src: null,
        labelHidden: false
    },
    placeholderOpacity: 0.3,
    enabledOpacity: 1,
    originalPickerSrc: '',
    pickerShowing: false,
    publishes: ['src'],
    cls: 'abp-image',

    defaultPlaceholder: Ext.getResourcePath('img/temp_abpimage-empty-placeholder.png', null, 'ABPControlSet'),
    defaultEmptyPlaceHolder: Ext.getResourcePath('img/temp_abpimage-empty-placeholder.png', null, 'ABPControlSet'),
    defaultPopupPlaceholder: Ext.getResourcePath('img/temp_abpimage-edit-placeholder.png', null, 'ABPControlSet'),
    // Not required for image field container.
    updateRequired: Ext.emptyFn,
    constructor: function (config) {
        config = config || {};
        var me = this;
        var height = parseInt(config.height || config.minHeight || config.maxHeight || 100);
        var readOnly = config.readOnly = config.readOnly === false ? false : true;
        var dimensions = this.configureDimensions(config);
        var imageClassName = this.configureImageClassName(config.cropStyle, dimensions);

        config.height = dimensions.height;
        config.width = dimensions.width;

        if (!config.readOnly && !config.src) {
            // if can edit and no src provided, show default camera place holder image.
            config.src = "";

            if (config.bind && config.bind.src) {
                // When image is coming from ABPForms, it might be found on config.bind.src
                // TODO: Think about how we can know if ABPForms bind has value or is null - is this a first upload or an edit?
            } else {
                // add new-image class so we can change the position of the file picker focus trigger to include entire placeholder image.
                config.cls = ('new-image ' + (this.config.cls || '') + ' ' + (config.cls || '')).trim();
            }
        }

        config.items = [
            {
                xtype: 'component',
                itemId: 'placeholder',
                cls: 'abp-image-placeholder',
                html: config.placeholder || '',
                style: {
                    'text-align': 'center',
                    'font-size': '2em',
                    'opacity': me.placeholderOpacity
                }
            },
            {
                // Default Image Picker Placeholder
                xtype: 'container',
                cls: ('placeholder-img-wrapper ' + imageClassName).trim() + ' abp-image-upload',
                itemId: 'defaultImage',
                hidden: false,
                style: {
                    'opacity': me.placeholderOpacity
                },
                items: [{
                    xtype: "image",
                    itemId: 'placeholder-image',
                    cls: imageClassName,
                    context: me,
                    scope: me,
                    style: {
                        'opacity': me.placeholderOpacity
                    },
                    listeners: {
                        tap: this.onPlaceholderImageTap,
                        show: this.onPlaceholderShow,
                        hide: this.onPlaceholderHide
                    },
                    src: this.defaultPlaceholder
                }]
            },
            {
                // Default Image Picker Placeholder
                xtype: 'container',
                cls: ('empty-placeholder-img-wrapper ' + imageClassName).trim() + ' abp-image-upload',
                itemId: 'defaultEmptyImage',
                hidden: false,
                items: [{
                    xtype: "image",
                    itemId: 'empty-placeholder-image',
                    cls: imageClassName + ' empty-abp-image',
                    context: me,
                    scope: me,
                    src: me.defaultEmptyPlaceHolder,
                    style: {
                        'opacity': me.placeholderOpacity
                    }
                }]
            },
            {
                xtype: "image",
                itemId: 'user-image',
                hidden: true,
                src: config.src,
                cls: imageClassName,
                listeners: {
                    tap: this.onImageTap,
                    load: this.onImageLoaded, // Base image mixin function.
                    scope: this,
                    el: {
                        doubletap: this.onImageDoubleTap,
                        taphold: this.onImageTapHold,
                        scope: this
                    }
                }
            },
            {
                xtype: 'abpicon',
                itemId: 'editButton',
                value: 'icon-pencil',
                cls: 'abp-image-icon-edit',
                bind: {
                    hidden: '{editorReadOnly}'
                }
            },
            {
                xtype: 'abpdialogform',
                itemId: 'imageEditorPopup',
                minHeight: 100,
                context: me,
                cls: 'abp-image-editor',
                listeners: {
                    beforeshow: me.onPopupPickerBeforeShow,
                    hide: me.onPopupPickerHide,
                    resize: me.onPopupPickerResize
                },
                items: [
                    {
                        xtype: 'titlebar',
                        docked: 'top',
                        title: 'Edit Photo',
                        titleAlign: 'left',
                        items: [
                            {
                                iconCls: 'icon-navigate-cross',
                                handler: function () {
                                    this.up('#imageEditorPopup').hide();
                                },
                                cls: 'abp-image-editor-close',
                                align: 'right'
                            }
                        ]
                    },
                    {
                        xtype: 'image',
                        itemId: 'user-popup-image',
                        context: me,
                        cls: 'abp-image-editor-image',
                        src: me.defaultPopupPlaceholder,
                        listeners: {
                            beforeshow: me.onPopupPickerBeforeShow,
                            load: me.onPopupPickerLoad,
                            tap: me.onChangeButtonTap
                        }
                    }/*,
                    {
                        xtype: 'abptextdisplay',
                        itemId: 'user-popup-no-image',
                        cls: 'abp-image-editor-no-image',
                        bind: {
                            value: '{missingImageMessage}'
                        },
                        foregroundColor: 'white'
                    }*/,
                    {
                        xtype: 'titlebar',
                        docked: 'bottom',
                        items: [
                            {
                                xtype: 'button',
                                text: 'Delete',
                                align: 'left',
                                context: me,
                                bind: {
                                    hidden: '{pickerImageIsRemovedOrNeverAdded}'
                                },
                                handler: function () {
                                    this.context.clearImage();
                                }
                            },
                            {
                                xtype: 'button',
                                text: 'Save Changes',
                                align: 'right',
                                context: me,
                                cls: 'abp-image-editor-save-btn',
                                bind: {
                                    hidden: '{pickerImageHasChanged}'
                                },
                                handler: me.onSaveButtonTap
                            },
                            /**
                             * This button triggers the hidden file field.
                             */
                            {
                                xtype: 'button',
                                bind: {
                                    text: '{addOrChangeButtonText}',
                                },
                                align: 'right',
                                context: me,
                                minWidth: 64,
                                handler: me.onChangeButtonTap
                            },
                            /**
                             * The modern toolkit as of 6.* did not provide style options for the file picker.
                             * It is hidden by design and triggered by the button above.
                             */
                            {
                                xtype: 'filefield',
                                name: config.name || 'abp-popup-image-upload-form',
                                accept: 'image/*',
                                text: 'Change',
                                hidden: true,
                                align: 'right',
                                listeners: {
                                    change: {
                                        element: 'element',
                                        fn: me.onFileChange,
                                        scope: this
                                    }
                                }
                            }
                        ]
                    }
                ],
            }
        ];

        this.mixins.abpcomponent.constructor.call(this, config);
        this.callParent([config]);
        this.down('#editButton').el.on('tap', function () { me.onImageTap() });
        this.down('filefield').setInputAttribute('type', 'file');
        this.down('filefield').setInputAttribute('oninput', '');
        this.down('filefield').setInputAttribute('accept', Ext.isEmpty(config.accept) ? "image/*" : config.accept);
    },

    onImageTapHold: function (image) {
        this.fireEvent(ABPControlSet.common.types.Events.ImageLongPress, image);
    },

    onImageDoubleTap: function (image) {
        this.fireEvent(ABPControlSet.common.types.Events.ImageDoubleClick, image);
    },

    updateOpacity: function (readOnly) {
        if (readOnly === true) {
            this.down('#editButton').setStyle({ 'opacity': this.placeholderOpacity });
        }

        else {
            this.down('#editButton').setStyle({ 'opacity': this.enabledOpacity });
        }
    },

    onPlaceholderShow: function () {
        this.context.down('#editButton').setStyle({ 'opacity': this.context.placeholderOpacity });
    },

    onPlaceholderHide: function () {
        this.context.down('#editButton').setStyle({ 'opacity': this.context.enabledOpacity });
    },

    // We want rounded or squared images to fit in to the general swing of layouts.
    // If we don't have a square, we can't easily calculate border radius.
    // We may want to revisit this for non cropped images...
    onResize: function (x, y, z, a) {
        if (x !== y) {
            var squareDim = Math.min(x, y);
            this.setHeight(squareDim);
            this.setWidth(squareDim);
            this.setMinHeight(squareDim);
            this.setMinWidth(squareDim);
            this.setMaxHeight(squareDim);
            this.setMaxWidth(squareDim);
            this.setStyle({ 'padding': '0px 0px 0px 0px', 'margin': '0px 0px 0px 0px' });
        }
    },
    /**
     * We want to set up the style of the picker
     * @param {*} cmp 
     * @param {*} event 
     */
    onPopupPickerLoad: function (cmp, event) {
        var maxWidth = this.context.query('#imageEditorPopup')[0].el.getWidth(),
            maxHeight = ABPControlSet.view.field.Image.defaultDimension;

        var dimensions = this.context.getPopupImageDimensions(maxWidth, maxHeight, event.target);
        this.el.removeCls('x-hidden x-hidden-display');
        this.el.setHeight(ABPControlSet.view.field.Image.defaultDimension);
        this.el.setWidth(dimensions.width);
        this.el.setStyle('background-size', dimensions.backgroundSize);
    },

    /**
     * Limits the height and width of the image to be displayed and resizes based on the limits and aspect ratio of the loaded image.
     * @param {*} maxWidth tallest allowable width for the image 
     * @param {*} maxHeight tallest allowable width for the image (defaults to 128)
     * @param {*} target the event.target which is the uprocessed image from the loading.
     */
    getPopupImageDimensions: function (maxWidth, maxHeight, target) {
        var width = target.width,
            height = target.height,
            retWidth = ABPControlSet.view.field.Image.defaultDimension,
            retHeight = ABPControlSet.view.field.Image.defaultDimension,
            widthToHeightRatio = width / height;

        if (width > maxWidth && height > maxHeight) {
            if (height > width) {
                retHeight = maxHeight;
                retWidth = retHeight * widthToHeightRatio;
            } else {
                retWidth = maxWidth;
                retHeight = retWidth / widthToHeightRatio;
            }
        } else {
            retHeight = ABPControlSet.view.field.Image.defaultDimension;
            retWidth = retHeight * widthToHeightRatio;
        }

        var dimString = retWidth + 'px ' + retHeight + 'px';
        return { height: retHeight, width: retWidth, backgroundSize: dimString };
    },

    /**
     * Set the image for the picker based on the currently selected image. 
     */
    onPopupPickerBeforeShow: function () {
        var imageContext = this.context,
            vm = imageContext.getViewModel();

        imageContext.pickerShowing = true;

        imageContext.originalPickerSrc = imageContext.getSrc();
        imageContext.setPopupImagePickerSrc(imageContext.getSrc());

        vm.set('pickerImageIsRemovedOrNeverAdded', Ext.isEmpty(imageContext.originalPickerSrc));

    },

    setLabelHidden: function (hideLabel) {
        if (!Ext.isEmpty(this.labelElement)) {
            if (hideLabel === true) {
                this.labelElement.hide();
            } else {
                this.labelElement.show();
            }
        }
    },

    /**
     * Reset the picker prior to hide if the image has not been saved.
     * Reset picker state.
     */
    onPopupPickerHide: function () {
        var imageContext = this.context,
            vm = imageContext.getViewModel();

        if (!imageContext.saveRequested) {
            imageContext.setPopupImagePickerSrc(imageContext.originalPickerSrc);
        }
        //vm.set('missingImageMessage', 'No image has been selected.');
        imageContext.saveRequested = false;
        imageContext.pickerShowing = false;
    },

    /**
* On image load,
*   unhide the loaded user image container,
*   hide the placeholder text container,
*   hide the placeholder image container.
*/
    onImageLoaded: function () {
        var me = this;
        if (!Ext.isEmpty(me.getSrc())) {
            me.setStyle({ 'padding': '0px 0px 0px 0px', 'margin': '0px 5px 0px 10px' });
        }
        me.showLoadedImage();
        me.hidePlaceHolderText();
        me.hidePlaceHolderImage();
    },

    /**
     * Recenter.
     */
    onPopupPickerResize: function () {
        this.center();
    },

    /**
     * Show the picker. The event is legacy, doesn't seem to be used, but may be helpful anyway.
     * @param {*} image 
     */
    onImageTap: function (image) {
        if (!this.getReadOnly()) {
            this.down("#imageEditorPopup").show();
            this.fireEvent(ABPControlSet.common.types.Events.ImageClick, image);
        }
    },

    onSaveButtonTap: function () {
        var me = this,
            context = me.context,
            pickerContext = context.query('#imageEditorPopup')[0];

        var pickerSrc = pickerContext.down("#user-popup-image").getSrc();
        if (pickerSrc === context.defaultPopupPlaceholder) {
            context.setSrc('');
        } else {
            context.setSrc(pickerSrc);
        }
        pickerContext.saveRequested = true;
        pickerContext.originalPickerSrc = pickerSrc;
        pickerContext.hide();
    },

    onChangeButtonTap: function () {
        var fileTarget = this.context.query('filefield')[0].el;

        if (!Ext.isEmpty(fileTarget)) {
            fileTarget.query('input[type=file]')[0].click();
        }
    },

    onPlaceholderImageTap: function (image) {
        this.context.query("#imageEditorPopup")[0].show();
    },
    /**
    * Look at the id: user-image image component to get the ABPImage.src.
    */
    getSrc: function () {
        var imageCmp = this.down("#user-image");

        if (imageCmp) {
            return imageCmp.getSrc();
        }
    },

    updateReadOnly: function (readOnly) {
        var me = this,
            vm = me.getViewModel();
        vm.set('editorReadOnly', readOnly);
        this.showDefaultPlaceholder();
        me.updateOpacity(readOnly);
    },

    /**
    * If new source is "", reset ABPImage.
    * If new source is not "", apply the new source to the id: "user-image" component of ABPImage.
    * @param {String} value An image src.
    */
    setSrc: function (value) {
        var me = this;
        if (Ext.isEmpty(value)) {
            me.resetABPImage();
        } else {
            me.setUserImageSrc(value);
        }
        me.callParent(arguments);
    },

    /**
    * Reset the file picker value to null.
    */
    clearImage: function () {
        this.onFileChange({ target: { files: [] } });
    },

    validateFileType: function (accept, fileType) {
        if (Ext.isEmpty(accept)) {
            return true;
        } else if (accept === 'image/*') {
            if (fileType.toLowerCase().indexOf('image') > -1) {
                return true;
            }
        } else {
            var acceptedTypes = accept.split(',');
            for (var type in acceptedTypes) {
                if (fileType.toLowerCase() === acceptedTypes[type].toLowerCase()) {
                    return true;
                }
            }
        }
        return false;
    },

    /**
    * Handle file picker change.
    */
    onFileChange: function (event) {
        var me = this,
            vm = me.getViewModel(),
            file = event.target.files[0],
            reader = new FileReader();

        if (!file && !event.event) { // !event.event to make sure this is not a file picker browser window cancel click.
            me.resetImagePicker();
            return;
        }
        if (file && me.validateFileType(event.target.accept, file.type) === false) {
            ABP.view.base.toast.ABPToast.show({
                message: '[The file type specified is not supported]',
                level: 'Warning'
            });
            return;
        }

        reader.onload = function (e) {
            me.setPopupImagePickerSrc(e.target.result);
        };

        if (file) {
            reader.readAsDataURL(file);
        }

    },

    privates: {
        /**
        * @private
        * Re-appply editable ABPImage initial state.
        */
        resetABPImage: function () {
            var me = this;
            me.hideActualImage();
            me.showDefaultPlaceholder();
            var placeholder = this.down('#placeholder');
            me.addCls('new-image');
            me.removeCls('loaded');
        },

        /**
        * @private
        * Find image component with id "user-image"
        * and set it's source to the new source value.
        * Remove new image classNames.
        *
        * @param {String} src An image src.
        */
        setUserImageSrc: function (src) {
            var me = this,
                placeholderImage = me.down('#placeholder-image'),
                actualImage = me.down("#user-image");
            placeholderImage.hide();
            me.removeCls('new-image');
            me.setPopupImagePickerSrc(src);
            actualImage.setSrc(src);
            me.hideAllPlaceholders();
        },

        setPopupImagePickerSrc: function (src) {
            var me = this,
                vm = me.getViewModel(),
                popupPickerImage = me.down("#user-popup-image");

            if (me.pickerShowing) {
                vm.set('pickerImageIsRemovedOrNeverAdded', Ext.isEmpty(src));
                vm.set('pickerImageHasChanged', me.originalPickerSrc === src);
            }
            if (Ext.isEmpty(src)) {
                popupPickerImage.setSrc(me.defaultPopupPlaceholder);
            }
            else {
                popupPickerImage.setSrc(src);
            }
        },

        hidePopupImagePickerImage: function () {
            var me = this,
                vm = me.getViewModel(),
                popupPickerImage = me.down("#user-popup-image");//,

            me.setPopupImagePickerSrc("");
            popupPickerImage.setHidden(true);
        },

        /**
        * @private
        * Resets the image filePicker values.
        * Sets default placeholder as picker value.
        */
        resetImagePicker: function () {
            var me = this,
                filePicker = me.down('filefield');

            filePicker.reset();
            me.hidePopupImagePickerImage();

        },

        /**
        * @private
        * Hide the user selected Image component.
        */
        hideActualImage: function () {
            var me = this,
                actualImage = me.down("#user-image");

            me.hidePopupImagePickerImage();
            actualImage.setSrc("");
            actualImage.setHidden(true);
        },

        setShownItemDimensions: function (shownItem, squareDim) {
            shownItem.setHeight(squareDim);
            shownItem.setWidth(squareDim);
            shownItem.setMinHeight(squareDim);
            shownItem.setMinWidth(squareDim);
            shownItem.setMaxHeight(squareDim);
            shownItem.setMaxWidth(squareDim);
            shownItem.setStyle({ 'padding': '0px 0px 0px 0px' });
        },

        hideAllPlaceholders: function () {
            var me = this,
                placeholderImage = me.down('#placeholder-image'),
                emptyImageWrapper = me.down('#defaultEmptyImage'),
                emptyPlaceholder = me.down('#empty-placeholder-image'),
                placeholder = me.down('#placeholder'),
                defaultImage = me.down('#defaultImage');

            placeholderImage.hide();
            emptyImageWrapper.hide();
            emptyPlaceholder.hide();
            placeholder.hide();
            defaultImage.hide();
        },

        /**
        * @private
        * Show the placeholder image.
        */
        showDefaultPlaceholder: function () {
            var me = this,
                placeholderImage = me.down('#placeholder-image'),
                emptyImageWrapper = me.down('#defaultEmptyImage'),
                emptyPlaceholder = me.down('#empty-placeholder-image'),
                placeholder = me.down('#placeholder'),

                defaultImage = me.down('#defaultImage');
            var squareDim = Math.min(me.getHeight(), me.getWidth());
            if (squareDim === 0) {
                squareDim = me.getContainer().element.getWidth();
            }
            if (Ext.isEmpty(me.getSrc())) {
                //Resize the placeholder to match the dimensions of the image.
                if (me.getReadOnly() !== true) {
                    me.setShownItemDimensions(placeholderImage, squareDim);
                    me.setShownItemDimensions(defaultImage, squareDim);

                    emptyImageWrapper.hide();
                    emptyPlaceholder.hide();
                    placeholder.hide();
                    placeholderImage.show();
                    defaultImage.show();
                } else {
                    if (!Ext.isEmpty(me.getPlaceholder())) {
                        me.setShownItemDimensions(placeholder, squareDim);
                        placeholderImage.hide();
                        emptyPlaceholder.hide();
                        defaultImage.hide();
                        placeholder.show();
                    } else {
                        me.setShownItemDimensions(emptyImageWrapper, squareDim);
                        me.setShownItemDimensions(emptyPlaceholder, squareDim);
                        placeholderImage.hide();
                        defaultImage.hide();
                        placeholder.hide();
                        emptyImageWrapper.show();
                        emptyPlaceholder.show();
                    }

                }
            } else {
                placeholder.hide();
                placeholderImage.hide();
            }

        }
    }
});
