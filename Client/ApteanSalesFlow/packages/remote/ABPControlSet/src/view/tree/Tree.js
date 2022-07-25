/**
 * ABPControlSet tree list view. Tree lists are common to both modern and classic toolkits from the core ext package.
 */
Ext.define("ABPControlSet.view.tree.Tree", {
    extend: "Ext.list.Tree",
    xtype: "abptree",
    requires: [
        "ABPControlSet.base.mixin.Component",
        'ABPControlSet.view.tree.CheckboxTreeItem'
    ],
    mixins: [
        "ABPControlSet.base.mixin.Component"
    ],
    constructor: function (config) {
        config = config || {};
        this.mixins.abpcomponent.constructor.call(this, config);
        this.callParent([config]);
    },

    /**
     * This method is called to populate and return a config object for new nodes. This
     * can be overridden by derived classes to manipulate properties or `xtype` of the
     * returned object. Upon return, the object is passed to `{@link Ext#method!create}` and the
     * reference is stored as part of this tree.
     *
     * The base class implementation will apply any configured `{@link #defaults}` to the
     * object it returns.
     *
     * @param {Ext.data.TreeModel} node The node backing the item.
     * @param {Ext.list.AbstractTreeItem} parent The parent item. This is never `null` but
     * may be an instance of `{@link Ext.list.RootTreeItem}`.
     * @return {Object} The config object to pass to `{@link Ext#method!create}` for the item.
     * @template
     */
    getItemConfig: function (node, parent) {
        var config = this.callParent(arguments);
        if (node.get("checkbox") === true) {
            config.xtype = "checkboxtreelistitem";
            config.checked = !!node.get("checked");
        }
        return config;
    }
});