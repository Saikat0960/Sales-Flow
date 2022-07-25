/**
 * ABPControlSet checkbox component.
 */
Ext.define("ABPControlSet.view.field.Checkbox", {
    extend: "Ext.field.Checkbox",
    xtype: "abpcheckbox",
    requires: [
        "ABPControlSet.base.mixin.Checkbox"
    ],

    mixins: [
        "ABPControlSet.base.mixin.Checkbox"
    ],

    constructor: function (config) {
        config = config || {};
        this.mixins.abpcomponent.constructor.call(this, config);
        this.callParent([config]);
    },

    initialize: function () {
        // Add the listener for the change event so the platform can fire the UserChanged event for the API hooks.
        this.on({
            'change': this.fireUserChanged,
            'painted': this.afterRenderInit
        });
        this.callParent(arguments);
    },

    // No required for text display.
    updateRequired: Ext.emptyFn,

    privates: {

        afterRenderInit: function () {
            if (Ext.isiOS) {
                // On iOS register an after-click handler because checkboxes do not receive focus.
                // We have to correlate the user click with the data change instead.
                this.element.onAfter('click', this.afterClickiOS, this);
            }
        },

        fireUserChanged: function (field, newValue, oldValue) {
            var me = this,
                changeTime = Date.now();

            // Delay a task to fire the UserChanged event so if this checkbox is on a form the view model has
            // a chance to update prior to application code execution.
            // A click on the field (or tabbed into) will focus the field and therefore we know (more probable) that this was clicked by the user for a change.
            // Safari (on iOS or iPad), does not accept focus on its checkboxes. So instead of using focus, we use the after-click event
            // to know when a user click has happened, and then correlate that against time as best we can to know if the change was because of the user click, and not by API.            
            Ext.defer(function () {
                // Either focus can be used to determine if the change happened because of user input,
                // or on iOS we have to correlate the user click with the change, within a reasonable time frame, because
                // checkboxes cannot get focus.
                if (field.containsFocus || field.hasFocus || (Ext.isiOS && me.lastClickTime && ((changeTime - me.lastClickTime) < me.IOS_USER_CLICK_IS_CHANGE_SOURCE_TIMEOUT))) {
                    me.lastClickTime = null;
                    // Immediately update the view model.
                    field.__flushValueViewModel();
                    field.fireEvent(ABPControlSet.common.types.Events.UserChanged, field, newValue, oldValue);
                }
            }, 1);
        },

        afterClickiOS: function (a, b, c, d, e, f) {
            var me = this;
            me.lastClickTime = Date.now();
        }

    }
});