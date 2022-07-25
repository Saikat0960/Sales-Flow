/**
 * @private
 * Base combobox mixin.
 */
Ext.define("ABPControlSet.base.mixin.ComboBox", {
    extend: "ABPControlSet.base.mixin.Field",

    config: {
        /**
         * @cfg {Boolean} publishListValue
         *
         * Allows listValue to be calculated.
         * 
         * If forceSelection is false then value can be the text the user types in or the value of a record selected from the store bound to this control.
         * 
         * Setting publishListValue to true causes the listValue property to be set to the value only when it is a record selected from the store
         * and not just text the user typed in.
         */
        publishListValue: false,

        /**
         * @cfg {Object} listValue
         * @bindable
         *
         * The value of the combo box if an item in its list is selected (i.e. in its store).
         * 
         * If forceSelection is false and publishListValue is true 
         * then listValue is the value of a record selected from the store bound to this control. 
         * If the user typed in a custom value then listValue is undefined.
         */
        listValue: null
    },

    constructor: function (config) {
        config = config || {};

        // Publishing listValue causes the listValue config to update the view model when it is changed.
        // Setting this in the constructor because a mixin cannot define publishes in its config. 
        config.publishes = config.publishes || [];
        config.publishes.push('listValue')

        this.callParent([config]);
    }

});
