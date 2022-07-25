Ext.define('ABPControlSet.view.grid.cell.ImageCell', {
    extend: 'Ext.grid.cell.Cell',
    xtype: 'abpimagecell',
    encodeHtml: false,

    config: {
        placeholder: null
    },
    statics: {
        onImageLoad: function (image) {
            // TODO: Can we scale the image down to grid row height?
            image.parentNode.firstChild.style.display = 'none';
            var imageNode = (image.parentNode && image.parentNode.parentNode) ? image.parentNode.parentNode.parentNode : null;
            if (imageNode) {
                imageNode.parentElement.classList.add('loaded');
                // set image maxHeight to be row height;
                // 50 is a magic number used throughout the older list views and is a good minimum
                var smallestDimension = Math.max(50, imageNode.parentElement.offsetHeight, imageNode.parentElement.offsetWidth);
                image.style.maxHeight = smallestDimension + 'px';
                image.style.maxWidth = smallestDimension + 'px';
            }
            image.style.display = 'block';
        },

        onImageError: function (image) {
            var imageNode = (image.parentNode && image.parentNode.parentNode) ? image.parentNode.parentNode.parentNode : null;
            if (imageNode) {
                imageNode.parentElement.classList.remove('loaded');
            }
        }
    },

    updatePlaceholder: function (newPlaceholder, oldPlaceholder) {
        var me = this;
        if (!Ext.isEmpty(newPlaceholder) && newPlaceholder !== oldPlaceholder) {
            // Check if element exists yet
            var placeholderCell = me.element.down('.img-placeholder')
            if (placeholderCell) {
                placeholderCell.el.dom.innerText = newPlaceholder;
            }
        }
    },

    constructor: function (config) {
        config = config || {};

        Ext.apply(config, {
            renderer: function (value, record, dataIndex, cell) {
                // Force update VM before getting placeholder.
                if (record && cell.config) {
                    var vm = cell.lookupViewModel();
                    // If the placeholder was bound - evaluate the bind instead of getting the placeholder config.
                    var placeholderBind = cell.config.bind ? cell.config.bind.placeholder : null;
                    if (placeholderBind && placeholderBind.indexOf('{') === 0) {
                        placeholderBind = placeholderBind.substr(1).slice(0, -1);
                    }
                    if (placeholderBind) {
                        placeholder = vm.get(placeholderBind);
                    }
                }
                var className = "";
                if (cell.cropStyle) {
                    className = "cropped";
                }

                var placeholder = placeholder || (cell.getPlaceholder() || "");
                return '<div class="' + className + '">'
                    + '<div class="img-placeholder">' + placeholder + '</div>'
                    + '<img style="display:none;" onload="ABPControlSet.view.grid.cell.ImageCell.onImageLoad(arguments[0].srcElement);" onerror="ABPControlSet.view.grid.cell.ImageCell.onImageError(arguments[0].srcElement)" src="' + value + '">'
                    + '</div>';
            }
        });

        this.callParent([config]);
    }
});
