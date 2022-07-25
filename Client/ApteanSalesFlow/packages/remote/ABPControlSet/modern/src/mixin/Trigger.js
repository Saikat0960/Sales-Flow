/**
 *  Modern trigger mixin override.
 */
Ext.define("ABPControlSet.mixin.Trigger", {
    override: "ABPControlSet.base.mixin.Trigger",

    afterSetDisabled: function () {
        var component = this.component,
            disabled = this.getDisabled();
        if (component) {
            if (component.setDisabled) {
                component.setDisabled(disabled);
                component.el.setTabIndex(disabled ? -1 : 0);
            } else {
                component.disabled = disabled;
                component.tabIndex = disabled ? -1 : 0;
            }
        }
    }
});