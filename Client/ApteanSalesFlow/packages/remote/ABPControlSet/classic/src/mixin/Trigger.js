/**
 *  Classic trigger mixin override.
 */
Ext.define("ABPControlSet.mixin.Trigger", {
    override: "ABPControlSet.base.mixin.Trigger",

    afterSetDisabled: function () {
        var component = this.component,
            disabled = this.getDisabled();
        if (component) {
            if (component.setDisabled) {
                component.setDisabled(disabled);
                var focusEl = component.focusEl;
                if (focusEl) {
                    focusEl.setTabIndex(disabled ? -1 : 0);
                }
            } else {
                component.disabled = disabled;
                component.tabIndex = disabled ? -1 : 0;
            }
        }
    }
});