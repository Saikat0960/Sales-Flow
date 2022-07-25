/**
 * Simple card container for the applications to use to help with history of items within their application center view.
 */
Ext.define("ABPControlSet.view.CardContainer", {
    extend: "Ext.Container",
    xtype: "abpcardcontainer",
    requires: [
        "ABPControlSet.base.mixin.CardContainer"
    ],
    mixins: [
        "ABPControlSet.base.mixin.CardContainer"
    ],
    layout: {
        type: "card"
    },
    constructor: function (config) {
        config = config || {};
        this.mixins.abpcardcontainer.constructor.call(this, config);
        this.callParent([config]);
    }
});
