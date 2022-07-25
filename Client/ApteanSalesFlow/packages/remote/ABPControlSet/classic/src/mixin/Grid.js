Ext.define("ABPControlSet.mixin.Grid", {
    override: "ABPControlSet.base.mixin.Grid",

    // Add/override methods for classic toolkit specific logic.

    updateBackgroundColor: function (backgroundColor) {
        var me = this,
            header = me.getHeader();

        if (header) {
            header.setStyle("background-color", backgroundColor);
        } else {
            me.header = me.header || {};
            me.header.style = me.header.style || {};
            me.header.style.backgroundColor = backgroundColor;
        }

        this.callParent(arguments);
    }
});