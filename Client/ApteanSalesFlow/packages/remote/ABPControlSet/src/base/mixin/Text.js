/**
 * @private
 * Base text field mixin.
 */
Ext.define("ABPControlSet.base.mixin.Text", {
    extend: "ABPControlSet.base.mixin.Field",
    config: {
        /**
         * @cfg {Object} triggers
         * {@link ABPControlSet.view.form.trigger.Trigger Triggers} to use in this field.  The keys in
         * this object are unique identifiers for the triggers. The values in this object
         * are {@link ABPControlSet.view.form.trigger.Trigger Trigger} configuration objects.
         *
         *     Ext.widget({
         *         xtype: "abptext",
         *         renderTo: document.body,
         *         fieldLabel: 'My Custom Field',
         *         triggers: {
         *             customTrigger: {
         *                 xclass: 'ABPControlSet.view.form.trigger.Trigger',
         *                 icon: 'icon-atom',
         *                 tooltip: 'Trigger',
         *                 disabled: false,
         *                 hidden: false,
         *                 handler: function() {
         *                     console.log('foo trigger clicked');
         *                 }
         *             }
         *         }
         *     });
         *
         *  In order to adjust the trigger, the trigger can be obtained and the set methods for the avialable configurations of the {@link ABPControlSet.view.form.trigger.Trigger Trigger} can be used.
         *
         *     textField.getTriggers()["customTrigger"].setIcon("new-icon-cls");
         *
         */
    }
});