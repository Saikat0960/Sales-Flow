/**
* Copyright © Aptean
* Override to place an automation tag as part of the row being rendered.
*/
Ext.define("ABP.grid.Row", {
    override: "Ext.grid.Row",
    requires: ["ABP.util.String"],

    /*
    *   Apply the automation class to the row.
    */
    privates: {
        beginRefresh: function (context) {
            var me = this;
            // Call parent to maintain default behavior.
            context = me.callParent(arguments);
            if (context) {
                var row = context.row;
                if (row) {
                    var grid = me.getParent();
                    // Apply the parent automation cls with the extra -row-index# appended to it.
                    var gridAutomationCls = grid.automationCls || (grid.automationCls = ABP.util.Common.getAutomationClass(grid));

                    row.toggleCls(gridAutomationCls + '-row-' + row.getRecordIndex(), true);
                }
            }
            return context;
        }
    }
});
