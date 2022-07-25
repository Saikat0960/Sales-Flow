/**
 * @private
 *  Base trigger mixin.
 */
Ext.define("ABPControlSet.base.mixin.Trigger", {
    extend: "Ext.Mixin",

    /**
     * Configuration props for the trigger.
     */
    config: {
        /**
         * @cfg {String} tooltip
         *
         * The tooltip to display for the trigger.
         */
        tooltip: null,
        /**
         * @cfg {Boolean} disabled
         *
         * Whether or not the trigger is disabled.
         */
        disabled: null,
        /**
         * @cfg {String} icon
         *
         * The icon of the trigger.
         */
        icon: null,
        /**
         * @cfg {Boolean} hidden
         *
         * Whether or not the trigger is hidden.
         */
        hidden: null
    },

    mixinConfig: {
        after: {
            setDisabled: 'afterSetDisabled'
        }
    },

    // Override in toolkit specific class.
    afterSetDisabled: Ext.emptyFn,

    // Updater for the hidden config.
    updateHidden: function (hidden) {
        this.hidden = hidden;
        if (hidden) {
            this.hide();
            if (this.component) {
                this.component.hidden = hidden;
                this.component.hide();
            }
        } else {
            this.show();
            if (this.component) {
                this.component.hidden = hidden;
                this.component.show();
            }
        }
    },

    // Updater for the hidden config.
    updateTooltip: function (tooltip) {
        if (this.component) {
            if (this.component.setTooltip) {
                this.component.setTooltip(tooltip);
            } else {
                this.component.tooltip = tooltip;
            }
        }
    },

    // Update for the icon config.
    updateIcon: function (icon) {
        // Override the trigger method of updating the iconCls.
        // Instead update the icon cls of the tool component.
        if (this.component) {
            if (this.component.setIconCls) {
                this.component.setIconCls(icon);
            } else {
                this.component.iconCls = icon;
            }
        }
    }
});