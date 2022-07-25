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
    /** @private @ignore */
    constructor: function (config) {
        config = config || {};
        // Add the embeddedEl childEl so the element can be obtained easily later on.
        config.childEls = [
            "embeddedEl"
        ];
        // Custom renderTpl.
        config.renderTpl = [
            // Instead of '{%this.renderContent(out,values)%}', in its place we will put the embeddedEl div.
            '<div id="{id}-embeddedEl" data-ref="embeddedEl" style="height:100%;width:100%;"></div>'
        ];
        this.mixins.abpcomponent.constructor.call(this, config);
        this.callParent([config]);
    },
    /** @private @ignore */
    initComponent: function () {
        this.callParent(arguments);

        // Add the "afterrender" listener so we can embed HTML, and know when to allow the subclass to hook into embedding process.
        this.on({
            afterrender: {
                fn: this.beginEmbed,
                scope: this,
                priority: 999
            }
        });
    }
});