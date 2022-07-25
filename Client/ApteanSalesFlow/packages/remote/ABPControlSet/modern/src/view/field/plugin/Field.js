/*
*   Modern field plugin class.
*/
Ext.define("ABPControlSet.view.field.plugin.Field", {
    override: "ABPControlSet.base.view.field.plugin.Field",

    registerInputListener: function (listeners, inputHandler) {
        Ext.apply(listeners, {
            keyup: {
                element: this.cmp.inputElement ? 'inputElement' : 'element',
                fn: inputHandler,
                scope: this
            }
        });
        return listeners;
    }
});