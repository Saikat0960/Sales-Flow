/**
 * ABPControlSet segmentedbutton component.
 */
Ext.define('ABPControlSet.view.button.Segmented', {
    extend: 'Ext.SegmentedButton',
    xtype: 'abpsegmentedbutton',
    mixins: [
        'ABPControlSet.base.mixin.SegmentedButton'
    ],

    lastChangeEventFromUser: false,

    constructor: function (config) {
        config = config || {};
        this.mixins.abpcomponent.constructor.call(this, config);
        this.callParent([config]);
    },

    initialize: function () {
        // Add the listener for the change event so the platform can fire the UserChanged event for the API hooks.
        this.on({
            'change': this.fireUserChanged,
        });
        this.callParent(arguments);
    },

    privates: {

        /**
         * SUBCLASS the Ext Modern onPressedChange method so that the
         * ABPControlSet version maintains whether the origin of the pressed change 
         * came from user or from an API set.
         * When the user clicks a button, Ext Modern nests calls to onPressedChange:
         * first for the user change (this.settingValue == false) and then within that,
         * a call for the setter (this.settingValue == true). Then wirthint that the change 
         * event happens. The trick is to remember about the top-level call to onPressedChange.
         * @param {Object} button 
         * @param {Boolean} pressed 
         */
        onPressedChange: function (button, pressed) {
            var localSettingValue = this.settingValue;
            if (localSettingValue === false || this.lastChangeEventTrusted) {
                // First time into onPressedChange with user-originated event,
                // Or second time into onPressedChange with API setting value, but we already know 
                // this second time is because of a user-originated event.
                this.lastChangeEventTrusted = true;
            }
            // Call the original Ext method.
            this.callParent(arguments);
            if (localSettingValue === false && this.lastChangeEventTrusted) {
                // Reset back to waiting for some new onPressedChange.
                this.lastChangeEventTrusted = false;
            }
        },

        fireUserChanged: function (field, newValue, oldValue) {
            // Only fire if the change came from the user.
            if (this.lastChangeEventTrusted) {
                field.__flushValueViewModel();
                field.fireEvent(ABPControlSet.common.types.Events.UserChanged, field, newValue, oldValue);
            }
            return;
        }

    }
});