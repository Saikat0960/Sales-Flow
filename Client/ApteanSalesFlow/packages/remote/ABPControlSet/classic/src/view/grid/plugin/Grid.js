/*
 * This file contains the plugin for added grid features; auto-sizing columns, height set to a specific number of rows if needed, hooks for column show/hide and width resize.
 * Also contains any logic to hook up control set events coming from a grid.
 */
Ext.define("ABPControlSet.view.grid.plugin.Grid", {
    override: "ABPControlSet.base.view.grid.plugin.Grid",

    init: function (grid) {
        if (grid.columnSizing || grid.recordsPerPageSizing) {
            // Add view listener for the itemadd event so the grid columns are sized to the content in the rows.
            var view = this.getTableView();
            grid.on({
                afterheightsizetocontent: function (grid) {
                    grid.resumeLayouts(true);
                },
                beforeheightsizetocontent: function (grid) {
                    grid.suspendLayouts();
                },
                aftercolumnsupdated: function (grid) {
                    grid.resumeLayouts(true);
                },
                beforecolumnsupdated: function (grid) {
                    grid.suspendLayouts();
                }
            })
            view.addListener({
                itemadd: this.onViewItemAdd,
                boxready: function () {
                    this.sizeColumnsToContent(false);
                },
                scope: this
            });
        }
    },

    // View itemadd event handler.
    onViewItemAdd: function (records, index, nodes) {
        Ext.suspendLayouts();
        var grid = this.cmp;
        if (grid.sizeColumnsToContent) {
            // When items are added, size the columns to the content.
            this.sizeColumnsToContent(false, nodes);
        }
        // Size to the recordsPerPage if the grid is set to do so.
        if (grid.recordsPerPageSizing) {
            this.sizeToContent();
        }
        Ext.resumeLayouts(true);
    },

    getNecessaryCells: function (viewEl, header, nodes) {
        var cells = [];
        var innerSelector = header.getCellInnerSelector();
        if (Ext.isArray(nodes)) {
            var nodesLength = nodes.length;
            for (var i = 0; i < nodesLength; i++) {
                cells.push(nodes[i].querySelector(innerSelector));
            }
        } else {
            cells = viewEl.query(innerSelector);
        }
        return cells;
    },
    // Add/override methods for classic toolkit specific logic.
    getTableView: function () {
        return this.cmp.getView();
    },
    getHeaderContainer: function () {
        return this.cmp.headerCt;
    }
});