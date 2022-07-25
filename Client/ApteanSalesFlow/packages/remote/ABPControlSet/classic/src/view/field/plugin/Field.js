/*
*   Classic field plugin class.
*/
Ext.define("ABPControlSet.view.field.plugin.Field", {
    override: "ABPControlSet.base.view.field.plugin.Field",

    registerInputListener: function (listeners, inputHandler) {
        Ext.apply(listeners, {
            inputEl: {
                keyup: inputHandler,
                scope: this
            }
        });
        return listeners;
    }
});