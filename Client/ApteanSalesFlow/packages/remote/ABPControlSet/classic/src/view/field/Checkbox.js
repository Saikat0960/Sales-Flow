/**
 * ABPControlSet checkbox component.
 * 
 * This fixes the problem with iPad iOS 13 checkboxes changing on user click but without userchanged getting called.
 *
 * OVERRIDE: This re-implements the ExtJS onChangeEvent to record the fact that the control is being changed 
 * by the user (isTrusted) or by API (!isTrusted).
 * If the code in ExtJS checkbox onChangeEvent changes then this OVERRIDE code needs to change too.
 * We decided not to override the Ext JS because we only wanted to alter how the ABPControlSet checkbox 
 * worked, which supports the 'userchanged' event.
 * 
 */
Ext.define("ABPControlSet.view.field.Checkbox", {
    extend: "Ext.form.field.Checkbox",
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

    /**
     * @private
     * Handle the change event from the DOM.
     * 
     * OVERRIDE: This is an augmentation of the underlying ExtJS checkbox onChangeEvent.
     * It records if the change event was from the user (isTrusted) or from the API (!isTrusted).
     * This is used to determine if the ABPControlSet userchanged event is fired or not.
     */
    onChangeEvent: function (e) {
        this.lastChangeEventTrusted = e.browserEvent.isTrusted; // APTEAN OVERRIDE
        this.updateValueFromDom();
        this.lastChangeEventTrusted = null;  // APTEAN OVERRIDE
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
            // NOTE: Might impact automation testing?
            if (this.lastChangeEventTrusted) {
                field.__flushValueViewModel();
                field.fireEvent(ABPControlSet.common.types.Events.UserChanged, field, newValue, oldValue);
            }
            return;
        }

    }
});