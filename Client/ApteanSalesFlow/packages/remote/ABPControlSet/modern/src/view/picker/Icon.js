/**
 * Icon picker provides a view for choosing apteanico icons. The picker can be rendered to any container. The
 * available default to the apteanico-mini icon set; this can be customized with the {@link #iconPrefix} config.
 */
Ext.define('ABPControlSet.view.picker.Icon', {
    extend: 'Ext.dataview.List',
    xtype: 'abpiconpicker',

    /**
     * @cfg {String} [componentCls='abp-icon-picker']
     * The CSS class to apply to the containing element.
     */
    cls: ['abp-icon-picker', 'abp-icon-picker-modern'],

    /**
     * @cfg {String} itemCls
     * The CSS class to apply to the icon picker's items
     */
    itemCls: 'abp-icon-picker-item',

    constructor: function (config) {
        config = config || {};
        config.store = config.store || ABPControlSet.common.Common.getIconStore();
        this.callParent([config]);
    },

    applyItemTpl: function () {
        return '<div class="' + this.itemCls + ' {icon}"></div>';
    }
});
