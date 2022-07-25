/**
 * @private
*   Base field plugin class.
*
*   Adds necessary listeners to fire unique ABP Control Set events for API hooks.
*   Adds the ability to provide formatting for input type fields.
*/
Ext.define("ABPControlSet.base.view.field.plugin.Field", {
    extend: "Ext.plugin.Abstract",
    requires: [
        "ABPControlSet.common.types.Events"
    ],

    alias: 'plugin.abpfield',

    // Value to keep track of for when the field becomes focused to determine if the value has changed on blur or select.
    focusValue: null,

    init: function (component) {
        // this is an override specifically for Sencha, which defaults to a 5px gap for native labels. Required star needs 14px gap.
        component.labelPad = component.labelAlign === 'top' ? 5 : 14;
        // Checkbox and radiogroups handles theirselves.
        if (component.xtype === "abpcheckbox" || component.xtype === "abpradiogroup") {
            return;
        } else {
            // Set up the events and handlers to use.
            var listeners = {
                focus: this.userChangedFocus,
                blur: this.userChangedBlur,
                select: this.userChangedSelect,
                scope: this
            };
            component.userTyping = false;
            this.registerInputListener(listeners, this.userInputFormat);
            component.on(listeners);
        }
    },

    registerInputListener: Ext.emptyFn,

    userInputFormat: function (e) {
        var field = this.cmp;
        field.userTyping = true;
        var fieldFormatter = field.getFieldFormatter();
        var fieldFormat = field.getFieldFormat();
        if (Ext.isFunction(fieldFormatter) && !field.getReadOnly() && !field.getDisabled()) {
            field.setFieldFormattedValue(fieldFormatter, fieldFormat, true);
        }
    },

    // Event handling so the UserChanged event is fired properly.
    userChangedFocus: function (field, e) {
        var me = this,
            fieldFormatter = field.getFieldFormatter(),
            fieldFormat = field.getFieldFormat();
        if (Ext.isFunction(fieldFormatter)) {
            field.setFieldFormattedValue(fieldFormatter, fieldFormat, true);
        }

        if (field instanceof Ext.form.field.ComboBox && e) {
            // Only set the focus value of the combo box field if the focus did not come from the picker bound list.
            var relatedTarget = e.relatedTarget;
            var relatedEl = relatedTarget ? Ext.fly(relatedTarget) : null;
            var relatedComponent = relatedEl ? relatedEl.component : null;
            var isPicker = relatedComponent ? Ext.toolkit === "classic" ? relatedComponent instanceof Ext.view.BoundList : false : false;
            if (isPicker) {
                var pickerOwner = relatedComponent.ownerCmp;
                if (pickerOwner && pickerOwner.id === field.id) {
                    // If the fields picker is where the focus reverted from, return and do not set the focus value.
                    return;
                }
            }
        }
        // Set the focus value.
        me.focusValue = field.getValue();
    },

    userChangedBlur: function (field) {
        var me = this;
        var value = field.getValue();
        field.userTyping = false;
        if (Ext.valueFrom(value, null) == null && Ext.valueFrom(me.focusValue, null) == null) {
            return;
        }

        if (!field.isEqual(value, me.focusValue)) {
            // Immediately update the view model.
            field.__flushValueViewModel();
            field.fireEvent(ABPControlSet.common.types.Events.UserChanged, field, value, me.focusValue);
            me.focusValue = value;
        }

        var fieldFormatter = field.getFieldFormatter();
        var fieldFormat = field.getFieldFormat();
        if (Ext.isFunction(fieldFormatter)) {
            field.setFieldFormattedValue(fieldFormatter, fieldFormat, false);
        }
    },

    userChangedSelect: function (field, record) {
        var me = this;

        var value = field.getValue();
        if (Ext.valueFrom(value, null) == null && Ext.valueFrom(field, me.focusValue, null) == null) {
            return;
        }
        if (!field.isEqual(value, me.focusValue)) {
            // Set the focus value before firing any events since the event handler may cause a field blur to occur which would then check the focus value to determine if the value has changed.
            var focusValue = me.focusValue;
            me.focusValue = value;
            // Only fire the event for form fields.  Secondary handles value changed events through its cell editing event handling.
            // Set the __inUserChangedHandler property to true so we know any setValue's for fields while this is true are set by the API.
            field.__inUserChangedHandler = true;
            // Immediately update the view model.
            field.__flushValueViewModel();
            // Fire the UserChanged event.
            field.fireEvent(ABPControlSet.common.types.Events.UserChanged, field, value, focusValue);
            // Delete temp prop __inUserChangedHandler.
            delete field.__inUserChangedHandler;
        }
    }
});