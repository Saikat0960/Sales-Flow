/**
 * @private
 *  Base tab panel mixin class.
 *
 */
Ext.define("ABPControlSet.base.mixin.TabPanel", {
    extend: "ABPControlSet.base.mixin.Component",

    updateBackgroundColor: function (backgroundColor) {
        var me = this,
            tabBar = me.getTabBar();

        tabBar.setStyle("background-color", backgroundColor);

        this.callParent(arguments);
    }
});