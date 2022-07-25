/**
 * 
 *  Can be used as a horizontal separator. Extends the built in ExtJS menu separator.
 * 
 */
Ext.define('ABPControlSet.view.visual.Separator', {
    extend: 'Ext.menu.Separator',
    xtype: 'abpseparator',
    cls: 'abp-horizontal-separator',
    requires: [
        'ABPControlSet.base.mixin.Separator'
    ],
    mixins: [
        'ABPControlSet.base.mixin.Separator'
    ],
    // The mixin afterRender method will not be applied unless this method is defined here.
    afterRender: Ext.EmptyFn,
    constructor: function (config) {
        config = config || {};
        this.mixins.abpcomponent.constructor.call(this, config);
        this.callParent([config]);
    },

    setForegroundColor: function (color) {
        this.setStyle('border-top-color', color);
    }
});