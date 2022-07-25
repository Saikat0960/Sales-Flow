/**
 * @private
 * Base grid mixin class.
 */
Ext.define("ABPControlSet.base.mixin.Grid", {
    extend: "ABPControlSet.base.mixin.Component",

    config: {
        /**
         * @cfg {Boolean} readOnly
         *
         * `true` to prevent the user from changing the field, and hide all triggers.
         */
        readOnly: null,
        /**
         * @cfg {Boolean} required
         *
         * Specify true to validate that the value's length must be > 0. If false, then a blank value is always taken to be valid regardless of any vtype validation that may be applied.
         */
        required: null
    },

    constructor: function (config) {
        config = config || {};

        /*
            Note: Plugins added during construction will wipe out any plugins defined on a class prototype definition.
            In order for multiple plugins to be used on a component, add them through the addCSPlugin method.
        */
        this.addCSPlugin(config, "abpgrid");

        this.callParent([config]);
    },

    getContextMenuData: function (event, element) {
        var position = event.position || {},
            column = position.column || {},
            cmp = ABPControlSet.common.Common.getComponentFromElement(element);
        return {
            component: cmp,
            record: position.record,
            rowIdx: position.rowIdx,
            colIdx: position.colIdx,
            dataIndex: column.dataIndex
        };
    }
});