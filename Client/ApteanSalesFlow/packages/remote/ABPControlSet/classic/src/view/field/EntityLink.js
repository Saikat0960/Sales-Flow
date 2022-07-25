/**
 * Modern link field. Single value.
 *
 * This field expects an object to be set as its value. Within this object should be the values of the displayField and the valueField configured on this component.
 * If a displayField value is not found, the valueField value will be displayed.
 */
Ext.define('ABPControlSet.view.field.EntityLink', {
    extend: 'ABPControlSet.view.field.TextArea',
    xtype: 'abpentitylinkfield',
    // Special styles for this field.
    cls: 'abp-link-field',
    // Not free text editable
    editable: false,
    // Grows to the configured growMax
    growMax: 30,
    // Grows to the configured growMax
    grow: true,
    // Single trigger to execute the configured triggerHandler method.
    triggers: {
        link: {
            xtype: 'abptrigger',
            xclass: "ABPControlSet.view.form.trigger.Trigger",
            icon: 'icon-navigate-right',
            handler: function (triggerTool, field) {
                var value = field.getValue(),
                    triggerHandler = field.getTriggerHandler();

                if (triggerHandler) {
                    triggerHandler(value, field.setValue.bind(field));
                }
            }
        }
    },

    config: {
        /**
         * @cfg {Function} triggerHandler
         * The function to execute when the link trigger is clicked/tapped.
         */
        triggerHandler: Ext.emptyFn,

        /**
         * @cfg {String/Number} valueField
         * The underlying {@link Ext.data.Field#name data value name} to bind to this
         * Select control. If configured as `null`, the {@link #cfg!displayField} is
         * used.
         * @accessor
         */
        valueField: 'value',

        /**
         * @cfg {String/Number} displayField
         * The underlying {@link Ext.data.Field#name data value name} to bind to this
         * Select control.  If configured as `null`, the {@link #cfg!valueField} is used.
         *
         * This resolved value is the visibly rendered value of the available selection
         * options.
         * @accessor
         */
        displayField: 'text'
    },

    setValue: function (value) {
        value = value || {};
        var me = this,
            df = me.getDisplayField(),
            vf = me.getValueField(),
            displayValue = value[df],
            valueValue = value[vf];

        if (Ext.isEmpty(displayValue)) {
            displayValue = valueValue;
        }

        me.setRawValue(displayValue);
    }
});