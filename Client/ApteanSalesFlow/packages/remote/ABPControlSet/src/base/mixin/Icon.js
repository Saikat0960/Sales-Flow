/**
 * @Icon 'abpicon' Just a div that takes the value as the icon (css class in the ABP Icons)
 */
Ext.define('ABPControlSet.base.mixin.Icon', {
    extend: 'Ext.Component',

    config: {
        value: null
    },

    setValue: function (iconCls) {
        var currentIconCls = this.currentIconCls;
        if (iconCls !== currentIconCls) {
            this.removeCls(currentIconCls);
            this.currentIconCls = iconCls;
            this.addCls(iconCls)
        }
    }
});