/**
 * @private
 * Classic column mixin.
 */
Ext.define("ABPControlSet.mixin.Column", {
    override: "ABPControlSet.base.mixin.Column",

    // Set the renderer to use the format renderer for the column.
    hookFormatRenderer: function () {
        if (!this.renderer) {
            this.renderer = this.columnFormatRenderer;
        }
    },

    // Default renderer for the column with formatting.
    // Scope defaults to the grid, so use the column from the metadata.
    columnFormatRenderer: function (value, metadata) {
        var column = metadata.column,
            fieldFormatter = column.getFieldFormatter(),
            fieldFormat = column.getFieldFormat();
        if (Ext.isFunction(fieldFormatter)) {
            return fieldFormatter(column, fieldFormat, (Ext.isEmpty(value) ? '' : value).toString(), false, value);
        } else {
            return value;
        }
    }
});