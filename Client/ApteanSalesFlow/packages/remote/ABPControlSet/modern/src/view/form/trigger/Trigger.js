/**
 * ABPControlSet field trigger.
 */
Ext.define('ABPControlSet.view.form.trigger.Trigger', {
    extend: 'Ext.field.trigger.Trigger',
    alias: 'trigger.abptrigger',
    xtype: "abptrigger",
    requires: [
        "ABPControlSet.base.mixin.Trigger"
    ],

    mixins: [
        "ABPControlSet.base.mixin.Trigger"
    ],

    tabIndex: -1,
    template: [{
        // Div tag.
        tag: 'div',
        reference: 'iconElement',
        // Use mixin-trigger rather than the default ext classes.
        classList: [
            'mixin-trigger'
        ]
    }],

    constructor: function (config) {
        config = config || {};
        // Add the tool as the component of the trigger.
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
        // Remove the handler since the tool will take care of click handlers.
        config.__handler = config.__handler || config.handler;
        config.handler = null;
        this.callParent([config]);
        // Listen for the pained event of the field so we can render in the component.
        this.mon(this.field, "painted", this.onFieldRender, this);
    },

    onTriggerFocus: function (e) {
        // Focus handler for the tool.
        // Fire the triggerfocus event from the field.
        var field = this.field;
        if (field) {
            field.fireEvent(ABPControlSet.common.types.Events.TriggerFocus, this);
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

    // Override the onCick method of the trigger to instead focus the tool component.
    onClick: function (e) {
        var me = this,
            handler = !me.getDisabled() && me.getHandler(),
            field = me.getField();

        if (field) {
            this.component.focus();
            if (handler) {
                Ext.callback(handler, me.getScope(), [field, me, e], null, field);
            }
        }
    },

    // Override the mouse down event handler of the trigger to instead focus the tool component.
    onMouseDown: function (e) {
        this.component.focus();
    },

    /*
    * Copied onFieldRender and destroy from Ext.form.trigger.Component (Classic)
    * That class is a private class from Ext with only a small amount of code.
    * So rather than worry about a break on framework upgrade, I have copied the code here and extended the public Ext.field.trigger.Trigger (modern) instead.
    */
    onFieldRender: function () {
        var me = this,
            component = me.component;

        if (!component.isComponent && !component.isWidget) {
            component = Ext.widget(component);
        }

        me.component = component;

        // Get rid of the default icon styling so a custom one can be used.
        component.iconElement.removeCls(Ext.baseCSSPrefix + 'icon-el ' + Ext.baseCSSPrefix + 'font-icon');
        component.render(me.iconElement);
    },

    // Need to clean up the trigger to rid of the component reference and destroy it as well.
    destroy: function () {
        var component = this.component;

        if (component.isComponent || component.isWidget) {
            component.destroy();
        }

        this.component = null;
        this.callParent();
    }
});