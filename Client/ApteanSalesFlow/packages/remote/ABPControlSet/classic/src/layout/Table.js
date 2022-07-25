/**
 * @ignore
 * Table layout for abp
 */
Ext.define("ABPControlSet.layout.Table", {
    // Ext JS Table Layout Configuration
    extend: "Ext.layout.container.Table",

    alias: "layout.abptable",
    type: "abptable",
    columns: 2,

    determineItemsWithColumnRowSorting: function (items) {
        return items.sort(this.columnAndRowSort);
    },

    columnAndRowSort: function (itemA, itemB) {
        if (itemA.row === itemB.row) {
            if (itemA.col < itemB.col) {
                return -1;
            } else {
                return 1;
            }
        } else if (itemA.row < itemB.row) {
            return -1;
        } else {
            return 1;
        }
    },

    getLayoutItems: function () {
        var me = this,
            result = [],
            items = me.callParent(),
            len = items.length,
            item, i;

        for (i = 0; i < len; i++) {
            item = items[i];
            item.width = item.responsiveWidth;
            item.row = item.row || item.responsiveRow;
            item.col = item.col || item.responsiveCol;
            item.rowspan = item.rowspan || item.responsiveRowSpan;
            item.colspan = item.colspan || item.responsiveColSpan;
            if (!item.hidden) {
                result.push(item);
            }
        }
        return me.determineItemsWithColumnRowSorting(result);
    },

    /**
     * @private
     * Iterates over all passed items, ensuring they are rendered in a cell in the proper
     * location in the table structure.
     */
    renderChildren: function () {
        var me = this,
            items = me.getLayoutItems(),
            item,
            tbody = me.tbody.dom,
            rows = tbody.rows,
            len = items.length,
            hiddenItems = me.getHiddenItems(),
            rowIdx, cellIdx, item, trEl, tdEl, i;

        // Loop over each cell and compare to the current cells in the table, inserting/
        // removing/moving cells as needed, and making sure each item is rendered into
        // the correct cell.
        for (i = 0; i < len; i++) {
            item = items[i];
            rowIdx = item.row;
            cellIdx = item.col;

            // Must have rows up to this one.
            if (rowIdx > 0) {
                me.createRowsUpTo(tbody, rowIdx);
                rows = tbody.rows;
            }
            // If no row present, create and insert one
            trEl = rows[rowIdx];
            if (!trEl) {
                trEl = tbody.insertRow(rowIdx);
                if (me.trAttrs) {
                    trEl.set(me.trAttrs);
                }
            }

            // If no cell present, create and insert one
            // Must have cells up to this one.
            if (cellIdx > 0) {
                me.createCellsUpTo(trEl, cellIdx);
            }
            tdEl = Ext.get(trEl.cells[cellIdx] || trEl.insertCell(cellIdx));

            // Render or move the component into the cell
            if (!item.rendered) {
                me.renderItem(item, tdEl, 0);
            } else if (!me.isValidParent(item, tdEl, rowIdx, cellIdx, tbody)) {
                me.moveItem(item, tdEl, 0);
            }

            // Set the cell properties
            if (me.tdAttrs) {
                tdEl.set(me.tdAttrs);
            }
            if (item.tdAttrs) {
                tdEl.set(item.tdAttrs);
            }
            tdEl.set({
                colSpan: item.colspan || 1,
                rowSpan: item.rowspan || 1,
                cls: me.cellCls + ' ' + (item.cellCls || '')
            });
        }
        // Go through and delete any empty cells and rows.
        var length = rows.length,
            rowsToDelete = [],
            cdLength,
            rdLength,
            cellsToDelete,
            row,
            cell,
            cLength,
            cells,
            rowEmpty;
        for (var i = 0; i < length; i++) {
            row = rows[i];
            cells = row ? row.cells : [];
            cLength = cells.length;
            rowEmpty = true;
            if (cLength > 0) {
                cellsToDelete = [];
                for (var j = 0; j < cLength; j++) {
                    cell = cells[j];
                    if (cell && cell.childElementCount === 0) {
                        cellsToDelete.push(cell.cellIndex);
                    }
                }
                cellsToDelete.sort(function (a, b) {
                    return a - b;
                });
                cdLength = cellsToDelete.length;
                for (var j = cdLength - 1; j >= 0; j--) {
                    row.deleteCell(cellsToDelete[j]);
                }
            } else {
                rowsToDelete.push(row.rowIndex);
            }
        }
        rowsToDelete.sort(function (a, b) {
            return a - b;
        });
        rdLength = rowsToDelete.length;
        for (var j = rdLength - 1; j >= 0; j--) {
            tbody.deleteRow(rowsToDelete[j]);
        }

        // Check if we've removed any cells that contain a component, we need to move
        // them so they don't get cleaned up by the gc
        for (i = 0, len = hiddenItems.length; i < len; ++i) {
            me.ensureInDocument(hiddenItems[i].getEl());
        }
    },

    createRowsUpTo: function (tbody, rowIdx) {
        for (var i = 0; i < rowIdx; i++) {
            if (!tbody.rows[i]) {
                tbody.insertRow(i);
            }
        }
    },

    createCellsUpTo: function (trEl, cellIdx) {
        for (var i = 0; i < cellIdx; i++) {
            if (!trEl.cells[i]) {
                trEl.insertCell(i);
            }
        }
    }
});