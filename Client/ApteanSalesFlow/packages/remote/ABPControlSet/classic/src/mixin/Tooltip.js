Ext.define("ABPControlSet.mixin.Tooltip", {
    extend: "Ext.Mixin",

    config: {
        tooltip: null // Placeholder tooltip property. Button already has a tooltip configuration, but this will not override its implementation.
    },

    constructor: function (config) {
        // Overwrite the onRender so we can hook into it.
        config.onRender = this.onRenderComponent;

        this.callParent([config]);
    },

    onRenderComponent: function () {
        var me = this;
        // Call original onRender.
        var tooltip = me.getTooltip();
        if (tooltip) {
            me.setTooltip(tooltip, true);
        }
        this.superclass.onRender.apply(this, arguments);
    },

    /**
     * Support for tooltip config - tooltip is not available in classic toolkit for fields.
     */
    getTooltipEl: function () {
        return this.el;
    },

    getTooltip: function () {
        var tooltip = this.callParent();
        if (Ext.isObject(tooltip)) {
            return tooltip.getText ? tooltip.getText : tooltip.getHtml ? tooltip.getHtml() : tooltip.text || tooltip.html;
        }
        return tooltip;
    },

    clearTip: function () {
        var me = this,
            el = this.getTooltipEl();

        if (el) {
            if (Ext.quickTipsActive && Ext.isObject(me.getTooltip())) {
                Ext.tip.QuickTipManager.unregister(el);
            } else if (el.dom) {
                el.dom.removeAttribute('qtip');
            }
        }
    },

    setTooltip: function (tooltip, initial) {
        var me = this,
            el = me.rendered ? this.getTooltipEl() : null;

        if (el) {
            if (!initial || !tooltip) {
                me.clearTip();
            }
            if (tooltip) {
                if (!Ext.isObject(tooltip)) {
                    tooltip = {
                        text: tooltip
                    };
                }
                if (Ext.quickTipsActive && Ext.isObject(tooltip)) {
                    Ext.tip.QuickTipManager.register(Ext.apply({
                        target: el.id
                    },
                        tooltip));
                } else {
                    el.dom.setAttribute('qtip', tooltip);
                }
            }
        }
        this.callParent([tooltip]);
    }
});