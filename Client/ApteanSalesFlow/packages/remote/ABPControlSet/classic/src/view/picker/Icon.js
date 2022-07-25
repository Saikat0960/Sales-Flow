/**
 * Icon picker provides a view for choosing apteanico icons. The picker can be rendered to any container. The
 * available default to the apteanico-mini icon set; this can be customized with the {@link #iconPrefix} config.
 */
Ext.define('ABPControlSet.view.picker.Icon', {
    extend: 'Ext.view.BoundList',
    xtype: 'abpiconpicker',

    focusable: true,

    /**
     * @cfg {String} [componentCls='abp-icon-picker']
     * The CSS class to apply to the containing element.
     */
    componentCls: 'abp-icon-picker',

    /**
     * @cfg {String} [selectedCls='x-icon-picker-selected']
     * The CSS class to apply to the selected element
     */
    selectedItemCls: 'abp-icon-picker-selected',

    /**
     * @cfg {String} itemCls
     * The CSS class to apply to the icon picker's items
     */
    itemCls: 'abp-icon-picker-item',

    itemSelector: 'abp-icon-picker-item',

    getInnerTpl: function (displayField) {
        return '<span class="' + this.itemCls + '-inner {' + displayField + '}"/>';
    }
});
