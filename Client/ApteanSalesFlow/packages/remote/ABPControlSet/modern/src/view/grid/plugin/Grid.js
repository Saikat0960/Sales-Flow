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

            view.addListener({
                painted: function () {
                    if (!this.destroyed) {
                        this.sizeColumnsToContent(false);
                    }
                },
                refresh: function () {
                    if (!this.destroyed) {
                        this.sizeColumnsToContent(false);
                    }
                },
                scope: this
            });
        }
    },

    getNecessaryCells: function (viewEl, header, nodes) {
        return header.getCells();
    },
    // Add/override methods for classic toolkit specific logic.
    getTableView: function () {
        return this.cmp;
    },

    getHeaderContainer: function () {
        if (!this.destroyed) {
            return this.cmp.getHeaderContainer();
        }
    }
});