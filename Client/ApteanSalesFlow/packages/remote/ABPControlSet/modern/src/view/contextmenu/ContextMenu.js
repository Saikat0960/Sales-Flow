/**
 * @private
 * ABPControlSet context menu component.
 */
Ext.define("ABPControlSet.view.contextmenu.ContextMenu", {
    extend: "ABPControlSet.view.tree.Tree",
    xtype: "abpcontextmenu",
    config: {
        currentCmp: null,
        currentContext: null
    },
    margin: 0
});