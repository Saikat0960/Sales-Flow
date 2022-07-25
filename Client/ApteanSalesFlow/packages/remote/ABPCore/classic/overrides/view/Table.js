/**
* Copyright © Aptean
* Override the table view to provide an automation class to the rows.
*/
Ext.define("ABP.view.Table", {
    override: "Ext.view.Table",

    /**
     * Override the renderRow function to apply the automation cls to each row - gridautomationcls-row-index#.
     */
    renderRow: function (record, rowIdx, out) {
        var me = this,
            grid = me.grid,
            origItemCls = me.itemCls;

        /*
        * Override: apply the parent automation cls with the extra -row-index# appended to it.
        */
        var gridAutomationCls = grid.automationCls || (grid.automationCls = ABP.util.Common.getAutomationClass(grid));
        me.itemCls = origItemCls + ' ' + gridAutomationCls + '-row-' + rowIdx;
        // Call parent to maintain default behavior.
        var returnVal = this.callParent(arguments);
        me.itemCls = origItemCls;
        if (out) {
            return returnVal;
        }
    }
});