/**
 * Simple component which can embed 3rd party controls.
 */
Ext.define("ABPControlSet.view.CustomControl", {
    extend: "Ext.Component",
    xtype: "abpcustomcontrol",
    requires: [
        "ABPControlSet.base.mixin.CustomControl"
    ],
    mixins: [
        "ABPControlSet.base.mixin.CustomControl"
    ],

    element: {
        reference: 'element',
        children: [{
            reference: 'embeddedEl',
            style: "height: 100%; width: 100%;"
        }]
    },
    /** @private @ignore */
    constructor: function (config) {
        config = config || {};
        this.mixins.abpcomponent.constructor.call(this, config);
        this.callParent([config]);
    },
    /** @private @ignore */
    initialize: function () {
        this.callParent(arguments);
        if (this.rendered) {
            this.beginEmbed();
        } else {
            // Add the "painted" listener so we can embed HTML, and know when to allow the subclass to hook into embedding process.
            this.on({
                painted: {
                    fn: this.beginEmbed,
                    scope: this,
                    priority: 999
                }
            });
        }
    }
});