/**
 * ABPControlSet button component.
 */
Ext.define("ABPControlSet.view.button.Button", {
    extend: "Ext.button.Button",
    xtype: "abpbutton",
    requires: [
        "ABPControlSet.base.mixin.Button"
    ],
    mixins: [
        "ABPControlSet.base.mixin.Button"
    ],

    /**
     * @cfg {String} ariaLabel
     * The accessibility label to be used for the button. 
     * 
     * Need to set this when the button is rendered as an icon only
     */

    privates: {
        _hasIcon: function () {
            var hasIcon = this.callParent(arguments);
            var icons = this.getIcons();
            return hasIcon ? true : (icons && icons.length > 0 ? true : false);
        }
    },

    constructor: function (config) {
        config = config || {};
        this.mixins.abpcomponent.constructor.call(this, config);

        this.callParent([config]);

        // Check to ensure that implementation of this button have passed WAI rules.
        // If the button does not have text (label), ensure it has a tooltip or aria-label
        var text = config.bind ? config.bind.text : undefined;
        if (!text) {
            // If a tooltip has been defined but no aria label, set the aria label to the tooltip
            if (config.bind) {
                if (config.bind.tooltip && !config.bind.ariaLabel) {
                    config.bind.ariaLabel = config.bind.tooltip;
                }
            }

            // IF there is no binding and no AriaLabel report a warning
            if (!config.bind || !config.bind.ariaLabel) {
                ABP.util.Logger.logAria("The button '" + this.itemId + "' does not contain an ARIA-LABEL attribute.", "1.1.1", this);
                // ABPLogger.aria('The button ' + this.itemId + " does not contain an ARIA-LABEL attribute.", this);
            }
        }
    },

    setAriaLabel: function (label) {
        var me = this;
        if (me.rendered) {
            var dom = me.el.dom;
            if (label) {
                dom.setAttribute('aria-label', label);
            }
            else {
                dom.removeAttribute('aria-label');
            }
        }
    },

    setAriaExpanded: function (expanded) {
        var me = this;
        if (me.rendered) {
            var dom = me.el.dom;
            dom.setAttribute('aria-expanded', expanded);
        }
    },

    /**
     * Override to allow for appInsights event tracking for button taps.
     */
    onClick: function (e) {
        var me = this;
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
