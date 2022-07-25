/**
* Copyright © Aptean
* Override to place an automation tag as part of the cell being rendered for the column.
*/
Ext.define("ABP.grid.column.Column", {
    override: "Ext.grid.column.Column",

    /*
    *   Apply the automation class to the tdCls of the column.
    */
    constructor: function (config) {
        config = config || {};
        // Ensure a name is defaulted on the column - assert to the dataIndex if no name is set.
        config.name = config.name || config.dataIndex;
        // Call parent to maintain default behavior.
        this.callParent([config]);
        // Append to the tdCls the automation class.
        this.tdCls = this.tdCls + ' ' + ABP.util.Common.getAutomationClass(this);
    }
});