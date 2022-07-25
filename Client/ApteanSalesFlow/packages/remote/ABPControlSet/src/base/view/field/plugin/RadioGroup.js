/**
 * @private
*   Radio group plugin class.
*/
Ext.define("ABPControlSet.base.view.field.plugin.RadioGroup", {
    extend: "Ext.plugin.Abstract",
    requires: [
        "ABPControlSet.common.types.Events"
    ],

    alias: 'plugin.abpradiogroup',

    focusValue: null,

    init: function (component) {
        // Set up the events and handlers to use.
        component.on({
            focusleave: this.onFocusLeave,
            focusenter: this.onFocusEnter,
            scope: this
        });
    },

    // Event handling so the UserChanged event is fired properly.
    onFocusLeave: function (group) {
        var me = this,
            newValue = group.getValue();

        if (Ext.valueFrom(newValue, null) == null && Ext.valueFrom(me.focusValue, null) == null) {
            return;
        }

        if (!group.isEqual(newValue, me.focusValue)) {
            // Immediately update the view model.
            group.__flushValueViewModel();
            group.fireEvent(ABPControlSet.common.types.Events.UserChanged, group, newValue, me.focusValue);
            me.focusValue = newValue;
        }
    },

    onFocusEnter: function (group) {
        group.fireEvent(ABPControlSet.common.types.Events.RadioGroupFocus, group);
        this.focusValue = group.getValue();
    }
});