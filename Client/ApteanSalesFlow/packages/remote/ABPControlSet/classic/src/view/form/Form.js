
/**
 * ABPControlSet form.
 */
Ext.define('ABPControlSet.view.form.Form', {
    extend: 'Ext.form.Panel',
    xtype: 'abpform',
    requires: [
        "ABPControlSet.base.mixin.Component",
        "ABPControlSet.base.plugin.Interactions"
    ],
    mixins: {
        abpcomponent: "ABPControlSet.base.mixin.Component"
    },
    plugins: {
        abpinteractions: false // Set true in your subclass if you want to see and use the interactions toolbar and right-pane with your form.
    },
    constructor: function (config) {
        config = config || {};
        this.mixins.abpcomponent.constructor.call(this, config);
        this.callParent([config]);
    },

    getFields: function () {
        var me = this;
        var items = me.items.items;
        var fields = {};
        items.forEach(function (element, index, array) {
            fields[element.name] = element.value;
        });
        return fields;
    }
});
