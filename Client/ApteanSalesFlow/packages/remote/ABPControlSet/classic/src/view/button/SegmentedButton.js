/**
 * ABPControlSet segmentedbutton.
 */
Ext.define("ABPControlSet.view.button.Segmented", {
    extend: "Ext.button.Segmented",
    xtype: "abpsegmentedbutton",
    mixins: [
        'ABPControlSet.base.mixin.SegmentedButton'
    ],

    constructor: function (config) {
        config = config || {};
        this.mixins.abpcomponent.constructor.call(this, config);
        this.callParent([config]);
    },

    initComponent: function () {
        // Add the listener for the change event so the platform can fire the UserChanged event for the API hooks.
        this.on({
            "change": this.fireUserChanged,
        });
        this.callParent(arguments);
    },

    privates: {

        fireUserChanged: function (field, newValue, oldValue) {
            // Delay a task to fire the UserChanged event so if this component is on a form the view model has
            // a chance to update prior to application code execution.
            // A click on the field (or tabbed into) will focus the field and therefore we know (more probable) that this was clicked by the user for a change.
            Ext.defer(function () {
                if (field.containsFocus || field.hasFocus) {
                    // Immediately update the view model.
                    field.__flushValueViewModel();
                    field.fireEvent(ABPControlSet.common.types.Events.UserChanged, field, newValue, oldValue);
                }
            }, 1);
        }

    }
});
