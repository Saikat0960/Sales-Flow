/**
 * ABPControlSet button component.
 */
Ext.define("ABPControlSet.view.button.Button", {
    extend: "Ext.Button",
    xtype: "abpbutton",
    requires: [
        "ABPControlSet.base.mixin.Button"
    ],
    mixins: [
        "ABPControlSet.base.mixin.Button"
    ],
    config: {
        iconColor: null
    },
    constructor: function (config) {
        config = config || {};
        this.mixins.abpcomponent.constructor.call(this, config);
        this.callParent([config]);
    },
    setIconColor: function (color) {
        if (this.iconElement) {
            this.iconElement.setStyle('color', color);
        }
    },

    /**
     * Override to allow for appInsights event tracking for button taps.
     */
    doTap: function (me) {
        // Carry on default behavior.
        me.callParent(arguments);
        // App insights track event for button clicks.
        if (typeof appInsights == 'object') {
            appInsights.trackEvent({
                name: 'buttonclick',
                button: me.name || me.itemId || me.automationCls,
                text: me.getText()
            });
        }
    }
});
