
/**
 * ABPControlSet form.
 */
Ext.define('ABPControlSet.view.form.Form', {
    extend: 'Ext.form.Panel',
    xtype: 'abpform',
    requires: [
        "ABPControlSet.base.mixin.Panel",
        "ABPControlSet.base.plugin.Interactions"
    ],

    mixins: [
        "ABPControlSet.base.mixin.Panel"
    ],

    plugins: {
        abpinteractions: false // Set true in your subclass if you want to see and use the interactions toolbar and right-pane with your form.
    },
    constructor: function (config) {
        config = config || {};
        this.mixins.abpcomponent.constructor.call(this, config);
        this.callParent([config]);
    }
});
