/**
 * @private
 * Modern column mixin.
 */
Ext.define("ABPControlSet.mixin.Column", {
    override: "ABPControlSet.base.mixin.Column",

    hookFormatRenderer: function () {
        var cell = this.getCell(),
            columnRenderer = this.getRenderer ? this.getRenderer() : this.renderer,
            cellRenderer = cell ? (cell.getRenderer ? cell.getRenderer() : cell.renderer) : null;

        if (!columnRenderer && !cellRenderer) {
            if (cell) {
                if (cell.setRenderer) {
                    cell.setRenderer(this.columnFormatRenderer);
                } else {
                    cell.renderer = this.columnFormatRenderer;
                }
            } else {
                this.setRenderer(this.columnFormatRenderer);
            }
        }
    },
    // Default renderer for the column with formatting.
    // Scope defaults to the grid, so use the column from the arguments.
    columnFormatRenderer: function (value, record, dataIndex, cell, column) {
        var fieldFormatter = column.getFieldFormatter(),
            fieldFormat = column.getFieldFormat();
        if (Ext.isFunction(fieldFormatter)) {
            return fieldFormatter(column, fieldFormat, (Ext.isEmpty(value) ? '' : value).toString(), false, value);
        } else {
            return value;
        }
    }
});