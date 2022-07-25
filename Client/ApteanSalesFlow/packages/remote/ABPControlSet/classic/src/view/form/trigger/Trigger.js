/**
 * ABPControlSet field trigger.
 */
Ext.define('ABPControlSet.view.form.trigger.Trigger', {
    extend: 'Ext.form.trigger.Trigger',
    alias: 'trigger.abptrigger',

    cls: Ext.baseCSSPrefix + 'form-trigger-cmp',
    extraCls: "mixin-trigger",

    requires: [
        "ABPControlSet.base.mixin.Trigger"
    ],

    mixins: [
        "ABPControlSet.base.mixin.Trigger"
    ],

    // Default a disabled config onto the base class, so the mixin configs can hook into the disabled methods.
    config: {
        disabled: false
    },

    // The internal handler to be set so the control set controls when the handler gets executed.
    __handler: null,

    constructor: function (config) {
        config = config || {};
        config.component = {
            xtype: "tool",
            callback: this.triggerClick.bind(this),
            cls: "mixin-trigger-tool",
            maskOnDisable: false,
            iconCls: config.icon,
            listeners: {
                focus: this.onTriggerFocus,
                scope: this
            }
        };
        // Remove the handler config since the tool will take care of click handlers.
        config.__handler = config.__handler || config.handler;
        config.handler = null;
        this.callParent([config]);
    },

    onTriggerFocus: function (e) {
        // Focus handler for the tool.
        // Fire the triggerfocus event from the field.
        var field = this.field;
        if (field) {
            field.fireEvent(ABPControlSet.common.types.Events.TriggerFocus, this.id);
        }
    },

    triggerClick: function () {
        // Click handler of the tool.
        // Fire the triggerclick event from the field.
        var field = this.field;
        if (field && !this.getDisabled() && !field.getDisabled()) {
            if (field.fireEvent(ABPControlSet.common.types.Events.TriggerClick, this, field) !== false) {
                var handler = this.__handler;
                if (handler) {
                    Ext.callback(handler, null, [this, field], 0, field);
                }
            }
        }
    },

    // Override the mouse down event handler of the trigger to instead focus the tool component.
    onMouseDown: function (e) {
        this.component.focus();
    },

    /**
     * Copied cls, onFieldRender, and destroy from Ext.form.trigger.Component
     * That class is a private class from Ext with only a small amount of code.
     * So rather than worry about a break on framework upgrade, I have copied the code here and extended the public Ext.form.trigger.Trigger instead.
     */
    onFieldRender: function () {
        var me = this,
            component = me.component;

        me.callParent();

        if (!component.isComponent && !component.isWidget) {
            component = Ext.widget(component);
        }

        me.component = component;

        component.render(me.el);
    },

    destroy: function () {
        var component = this.component;

        if (component.isComponent || component.isWidget) {
            component.destroy();
        }

        this.component = null;
        this.callParent();
    }
});