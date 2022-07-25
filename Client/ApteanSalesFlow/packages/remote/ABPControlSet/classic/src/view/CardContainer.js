/**
 * Simple card container for the applications to use to help with history of items within their application center view.
 *
 * When a card is added, a cardId property and value is expected to be on the component.
 * This is used when showView is executed with a cardId to see if one already exists to show.
 *
 *
 * For more information, read the [Layouts: Card Container Guide](#!/guide/abpcontrolset_layouts-section-card-container).
 */
Ext.define("ABPControlSet.view.CardContainer", {
    extend: "Ext.container.Container",
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
