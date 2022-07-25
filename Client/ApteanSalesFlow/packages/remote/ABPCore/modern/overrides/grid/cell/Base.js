/**
* Copyright © Aptean
* Override to place an automation tag as part of the cell being rendered for the column.
*/
Ext.define("ABP.grid.cell.Base", {
    override: "Ext.grid.cell.Base",

    /*
    *   Apply the automation class to the cell cls.
    */
    constructor: function (config) {
        config = config || {};
        // Ensure a name is defaulted on the column - assert to the dataIndex if no name is set.
        config.name = config.name || (config.column ? config.column.getDataIndex ? config.column.getDataIndex() : config.column.dataIndex : '');
        // Call parent to maintain default behavior.
        this.callParent([config]);
        // Append to the tdCls the automation class.
        this.setCellCls(this.getCellCls() + ' ' + ABP.util.Common.getAutomationClass(this));
    }
});
