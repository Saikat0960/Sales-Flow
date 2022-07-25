/**
 * @private
*   Base linked label plugin class.
*/
Ext.define("ABPControlSet.base.view.field.plugin.LinkedLabel", {
    extend: "Ext.plugin.Abstract",

    alias: 'plugin.abplinkedlabel',

    init: function (component) {
        var inputId = component.inputId = component.inputId || Ext.id();
        // Data will consist of extra cls information (abp-mandatory cls if the field is required || !allowBlank)
        var data = this.getLabelableRenderData(component);
        // Keep track of the original hideLabel value for 'show' event handler logic.
        component.__hideLabel = component.hideLabel;
        // Construct the linked label.
        component.__linkedLabel = Ext.widget({
            forId: inputId,
            xtype: 'abplabel',
            required: Ext.isBoolean(component.required) ? component.required : Ext.isBoolean(component.allowBlank) ? !component.allowBlank : undefined,
            disabled: component.disabled,
            hidden: component.hidden === true ? true : component.hideLabel === true ? true : false,
            responsiveCol: (component.responsiveCol || 1) - 1,
            width: component.labelWidth,
            disabledCls: 'x-form-item-default x-item-disabled',
            cls: data.labelCls + ' abp-linked-label',
            responsiveWidth: component.labelWidth,
            responsiveColSpan: 1,
            responsiveRow: component.responsiveRow,
            responsiveRowSpan: 1,
            field: component
        });
        var listeners = {};
        var container = component.up('container');
        if (!container) {
            listeners.added = this.onComponentAdded;
        } else {
            var itemCollection = container.items;
            var cmpPos = itemCollection.indexOf(component);
            this.insertLabel(component, container, cmpPos);
        }

        this.hookIntoFieldLabel(component);

        // Hook up the label to the fields events to keep a consistent state.
        Ext.apply(listeners, {
            disable: function (component) {
                component.__linkedLabel.disable(true);
            },
            enable: function (component) {
                component.__linkedLabel.enable(true);
            },
            hide: function (component) {
                component.__linkedLabel.hide();
            },
            show: function (component) {
                // Only show if the configuration for the label is allowed to show with the field.
                if (!component.__hideLabel) {
                    component.__linkedLabel.show();
                }
            },
            // We hoped that by listening to hide and show above that any change to the hidden state of the parent componment 
            // would be caught and handled, but there is a case when the component is on a tab and the tab is not rendered yet.
            // In that case because the DOM element is not yet rendered the hide and show do not happen. So to catch that case
            // we must listen to the render and set the linked label's hidden state at this point.
            beforerender: function (component) {
                if (!component.__hideLabel && !component.hidden) {
                    component.__linkedLabel.show();
                } else {
                    component.__linkedLabel.hide();
                }
            },
            removed: function (component, owner) {
                owner.remove(component.__linkedLabel);
            },
            destroy: function (component) {
                Ext.destroy(component.__linkedLabel);
            }
        });
        component.on(listeners);
    },

    getLabelableRenderData: Ext.emptyFn,

    onComponentAdded: function (component, container, cmpPos) {
        this.insertLabel(component, container, cmpPos);
    },

    insertLabel: function (component, container, cmpPos) {
        container.insert((cmpPos || 1) - 1, component.__linkedLabel);
    }
});