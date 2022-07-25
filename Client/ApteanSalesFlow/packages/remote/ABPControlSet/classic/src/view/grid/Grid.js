/**
 * ABPControlSet grid.
 */
Ext.define("ABPControlSet.view.grid.Grid", {
    extend: "Ext.grid.Panel",
    xtype: "abpgrid",
    border: true,
    requires: [
        "ABPControlSet.base.view.grid.plugin.Grid",
        "ABPControlSet.base.mixin.Grid"
    ],
    mixins: [
        "ABPControlSet.base.mixin.Grid"
    ],
    /**
     * @cfg {Boolean} listOnTop
     * If the listView config is true, this determines whether or not the listView is shown initially.
     */
    listOnTop: false,
    /**
     * @cfg {Boolean} listView
     * If true, the grid will have the list view option enabled.
     */
    listView: false,
    /**
     * @private
     */
    constructor: function (config) {
        config = config || {};
        config.listView = Ext.isBoolean(config.listView) ? config.listView : this.listView === false ? false : true;
        if (config.listView) {
            config.plugins = config.plugins || {};
            config.plugins.listview = config.plugins.listview === true ? {} : config.plugins.listview;
            if (!Ext.isObject(config.plugins.listview)) {
                config.plugins.listview = {};
            };
            config.plugins.listview.fullRow = config.listOnTop || this.listOnTop;
            config.plugins.listview.template = config.listTemplate || this.listTemplate;
        }
        this.mixins.abpcomponent.constructor.call(this, config);
        this.callParent([config]);
    }
});