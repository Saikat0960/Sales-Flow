/**
 * @private
 * This file contains the plugin for added grid features; auto-sizing columns, height set to a specific number of rows if needed, hooks for column show/hide and width resize.
 * Also contains any logic to hook up control set events coming from a grid.
 */
Ext.define("ABPControlSet.base.view.grid.plugin.Grid", {
    extend: "Ext.plugin.Abstract",
    requires: [
        "ABPControlSet.common.Constants"
    ],
    id: "abpgrid",
    alias: 'plugin.abpgrid',

    // These methods are meant to overridden to return the correct component.
    getTableView: Ext.emptyFn,
    getHeaderContainer: Ext.emptyFn,
    getNecessaryCells: Ext.emptyFn,

    sizeToContent: function () {
        // Common function between secondary and srl grids.  In toolkit there is a property "Records per page" for secondary and srl grids.
        // Executing this method will size the grid to the height of the total count of the records in the grid's store if it is below the records per page configured.
        // If the total count is greater than the records per page, it will size to a max height of the records per page.
        // *Note: recordsPerPage property must contain a number value in order for this method to perform it's logic. If it is not, it will not calculate the height.
        // Size the grid to the context after an attempt to load a data source into the grid.
        var grid = this.cmp;
        var recordsPerPage = grid.recordsPerPage;
        // Only set the correct height if the recordsPerPage is a number.
        if (grid.recordsPerPageSizing && Ext.isNumber(recordsPerPage) && !grid.hidden && !grid.destroyed && !grid.destroying) {
            var store = grid.getStore();
            var tableView = this.getTableView();
            if (store && tableView) {
                var total = store.isBufferedStore ? store.getTotalCount() : store.getCount();
                var currentCount = store.isBufferedStore ? store.data.getCount() : store.getCount();
                // Determine the total count of records in the store. Sometimes the total count will return 0 for non buffered stores.
                var currentRecords = total < currentCount ? currentCount : total;
                var scrollReserve = 0;
                var recordCalc = recordsPerPage;
                var currentRecordCalc = grid.currentRecordsPerPageCalc;
                // If the recordsPerPage is greater than the current total records in the store,
                // the calculation of total row view height is determined by the total record count.
                if (recordsPerPage > currentRecords) {
                    recordCalc = currentRecords;
                }
                // Do not calculate if we are already at the right height.
                if (recordCalc === currentRecordCalc) {
                    return;
                }
                if (grid.fireEvent("beforesizetocontent", grid) !== false) {
                    // Always get the scrollbar height to add to the height calc. It will be 0 on devices without a scrollbar showing.
                    // Add the height of the scrollbar element to the height of the grid.
                    var scrollbarSize = Ext.getScrollbarSize(true);
                    if (scrollbarSize) {
                        scrollReserve = scrollbarSize.height || 0;
                    }
                    grid.fireEvent("beforeheightsizetocontent", grid);
                    // Set height of grid to null.
                    grid.setHeight(null);

                    var rowHeight = 22;
                    // If the grid has rowLines set to true, add 1px to the rowHeight to allow for a 1px border the rowLines config adds to each row.
                    if (grid.rowLines) {
                        rowHeight += 1;
                    }
                    // Calculate height.
                    var height = (Math.max(recordCalc, 1) * rowHeight) + scrollReserve;

                    // Set the min height of the table view within the grid.
                    tableView.setMinHeight(scrollReserve + rowHeight);
                    // Set the height of the table view within the grid.
                    tableView.setHeight(height);
                    // Set the currentRecordsPerPageCalc so we know whether or not to update the grid.
                    grid.currentRecordsPerPageCalc = recordCalc;
                }
            }
        }
    },

    sizeColumnsToContent: function (defer, nodes) {
        var grid = this.cmp;
        if (grid.columnSizing) {
            defer = defer || false;
            if (!defer) {
                // If the grid table view has nothing rendered in the grid item container, defer the request.
                var view = this.getTableView();
                if (view) {
                    var viewBody = view.body;
                    var viewBodyDom = viewBody ? viewBody.dom : null;
                    if (!viewBodyDom || (viewBodyDom.children && viewBodyDom.children.length === 0)) {
                        defer = true;
                    } else {
                        // Also check and see if the headers are currently available for analysis in the dom.
                        var headerCt = view.headerCt;
                        var headerCtEl = headerCt ? headerCt.el : null;
                        var targeEl = headerCtEl ? headerCtEl.query(".x-box-target")[0] : null;
                        if (!targeEl || (targeEl.children && targeEl.children.length === 0)) {
                            defer = true;
                        }
                    }
                }
            }
            if (defer) {
                // Defer by 1 ms to ensure the rows render so the autoSize can determine cell content widths.
                Ext.defer(this.doSizeColumnsToContent, 1, this, [nodes]);
            } else {
                this.doSizeColumnsToContent(nodes);
            }
        }
    },

    doSizeColumnsToContent: function (nodes) {
        var grid = this.cmp;
        var headerCt = this.getHeaderContainer();
        // Make sure the grid is visible and not destroyed or destroying.
        if (headerCt && !grid.hidden && (!grid.destroyed && !grid.destroying)) {
            var view = this.getTableView();
            if (grid.fireEvent("beforesizecolumnstocontent", grid) !== false) {
                // Query the header container for a column with the visible index (can only be edited if visible)
                var columns = headerCt.query("gridcolumn");
                var length = columns.length;
                var column;
                var width;
                var nearestGrid;
                var nearestView;
                var calculatedColumns = [];
                var previousMaxContentWidth;
                columns.reverse();
                for (var i = 0; i < length; i++) {
                    column = columns[i];
                    // Only size the column if it is allowed to be resized.
                    if (column.isVisible() && !column.flex) {
                        // Resize to contents and get new width.
                        if (view.isLockingView) {
                            // If the view is locking, it will have multiple views within itself. Use the view of the grid which owns the columns.
                            nearestGrid = column.up("grid");
                            nearestView = nearestGrid ? (nearestGrid.getView ? nearestGrid.getView() : nearestGrid) : null;
                        } else {
                            nearestView = view;
                        }
                        if (nearestView) {
                            previousMaxContentWidth = column.__maxContentWidth;
                            column.__maxContentWidth = this.getContentWidth(nearestView.el, column, nodes);
                            if (column.__maxContentWidth === false) {
                                // If getMaxContentWidth is a function of the view, get the max content width of the column.
                                if (Ext.isFunction(nearestView.getMaxContentWidth)) {
                                    column.__maxContentWidth = nearestView.getMaxContentWidth(column);
                                }
                            }
                            // Column will be adjusted.
                            if (previousMaxContentWidth != column.__maxContentWidth) {
                                calculatedColumns.push(column);
                            }
                        }
                    }
                }
                var calculatedLength = calculatedColumns.length;
                var columnsUpdated = false;
                for (var i = 0; i < calculatedLength; i++) {
                    column = calculatedColumns[i];
                    if (column.isVisible() && !column.flex) {
                        // Resize to contents and get new width
                        width = column.__maxContentWidth;
                        // Ensure any min and max column widths take precedence
                        if (Ext.isNumber(column.minColWidth) && width < column.minColWidth) {
                            width = column.minColWidth;
                        } else if (Ext.isNumber(column.maxColWidth) && width > column.maxColWidth) {
                            width = column.maxColWidth;
                        }
                        column.greatestWidth = column.greatestWidth || 0;
                        // Only set the new width if it is greater than the greatest width.
                        if (width > column.greatestWidth) {
                            if (columnsUpdated === false) {
                                grid.fireEvent("beforecolumnsupdated", grid);
                                columnsUpdated = true;
                            }
                            column.greatestWidth = width;
                            column.setWidth(width);
                        }
                    }
                }
                if (columnsUpdated === true) {
                    grid.fireEvent("aftercolumnsupdated", grid);
                }
            }
        }
    },

    getContentWidth: function (viewEl, header, nodes) {
        // If the table row nodes are provided, select the cells from these.
        var cells = this.getNecessaryCells(viewEl, header, nodes);
        // var localSettingsStore = Ext.data.StoreManager.lookup("LocalSettingsStore");
        // If no setting is found, determine what to use based on whether or not the client is desktop.
        // var usePrecise = localSettingsStore.preciseColumnWidths;
        var usePrecise;
        if (Ext.isEmpty(usePrecise)) {
            usePrecise = Ext.os.deviceType === "Desktop";
        }
        var maxWidth = 0,
            constants = ABPControlSet.common.Constants,
            pixelPerChar = 8, // Default, will be set by one cells text metric.
            firstCell = cells[0];
        if (firstCell) {
            if (Ext.isEmpty(firstCell.innerText) && firstCell.innerHTML) {
                return false;
            } else {
                var cellEl = Ext.fly(firstCell);
                if (cellEl) {
                    var textMetric = new Ext.util.TextMetrics(firstCell);
                    var paddingLeft = parseInt(cellEl.getStyle("padding-left"), 10) || 0;
                    var paddingRight = parseInt(cellEl.getStyle("padding-right"), 10) || 0;
                    var paddingWidth = paddingRight + paddingLeft;
                    var widestCellTexts = [];
                    var leastGreatestCharLength = 0;
                    var charLength;
                    var length = cells.length;
                    var string;
                    var maxSampleCells = Math.ceil(length * constants.COLUMN_WIDTH_SAMPLE_PERCENTAGE);
                    for (var i = 0; i < length; i++) {
                        string = cells[i].innerText;
                        charLength = string.length;
                        if (charLength > leastGreatestCharLength) {
                            // If the amount we need it still less than the length of top cell texts we have gathered, push it into the top cells array.
                            if (maxSampleCells > widestCellTexts.length) {
                                widestCellTexts.push(string);
                            } else {
                                var indexToReplace;
                                // Determine the index of the least greatest to replace.
                                for (var j = 0; j < widestCellTexts.length; j++) {
                                    if (leastGreatestCharLength === 0 || widestCellTexts[j].length === leastGreatestCharLength) {
                                        indexToReplace = j;
                                    }
                                }
                                widestCellTexts[indexToReplace] = string;
                            }
                            // Determine the current least greatest.
                            leastGreatestCharLength = 0;
                            for (var j = 0; j < widestCellTexts.length; j++) {
                                if (leastGreatestCharLength === 0 || widestCellTexts[j].length < leastGreatestCharLength) {
                                    leastGreatestCharLength = widestCellTexts[j].length;
                                }
                            }
                        }
                    }
                    var max = Math.max;
                    var cellWidth;
                    var maxSampleLength = widestCellTexts.length > maxSampleCells ? maxSampleCells : widestCellTexts.length;
                    if (!usePrecise) {
                        // Only use the text metric once to get the 1 char pixel width for 'A'.
                        pixelPerChar = textMetric.getWidth('A');
                        for (var i = 0; i < maxSampleLength; i++) {
                            cellWidth = (widestCellTexts[i].length * pixelPerChar) + paddingWidth;
                            maxWidth = max(maxWidth, cellWidth);
                        }
                    } else {
                        // Use the text metric for each string.
                        for (var i = 0; i < maxSampleLength; i++) {
                            // textMetric.getWidth ends up setting the HTML directly on the cell. Therefore it is necessary to HTML encode the value.
                            cellWidth = textMetric.getWidth(Ext.htmlEncode(widestCellTexts[i])) + paddingWidth
                            maxWidth = max(maxWidth, cellWidth);
                        }
                    }
                    Ext.destroy(textMetric);
                }
            }
        }
        // Get the width of the header and its text.
        // If the maxWidth is less than the header text width, set the width to be the header text width.
        if (header.el) {
            var headerWidth = header.allowBlank === false ? constants.COLUMN_HEADER_REQUIRED_PADDING : constants.COLUMN_HEADER_EXTRA_PADDING;
            // Add the width of the text in the header.
            var headerTextMetric = new Ext.util.TextMetrics(header.el);
            headerWidth += headerTextMetric.getWidth(header.text) || 0;
            Ext.destroy(headerTextMetric);

            if (header.align === "right") {
                // If the header align is right, we need to add an extra right align padding to ensure right aligned text does not show ellipses.
                headerWidth += constants.COLUMN_HEADER_RIGHT_ALIGN_PADDING;
            }
            if (header.allowFilter) {
                // If the column header allows filtering, check to see if it has a filter value. If it does, add extra width for the filter icon.
                var filterValue = header.getFilterValue();
                if (!Ext.isEmpty(filterValue)) {
                    headerWidth += constants.COLUMN_FILTER_ICON_PADDING;
                }
            }
            if (!Ext.isEmpty(header.sortState)) {
                headerWidth += constants.COLUMN_SORT_ARROW_PADDING;
            }
            var maxWidthWithTriggerBuffer = header.triggerBuffer ? maxWidth + header.triggerBuffer : maxWidth;
            if (!header.menuDisabled) {
                // Add the menu trigger padding if the menu is not disabled.
                headerWidth += constants.COLUMN_MENU_TRIGGER_PADDING;
            }
            maxWidth = maxWidthWithTriggerBuffer < headerWidth ? headerWidth : maxWidthWithTriggerBuffer;
        }
        // Do not allow the column size to go below the minimum column width.
        return maxWidth < constants.MINIMUM_COLUMN_WIDTH ? constants.MINIMUM_COLUMN_WIDTH : maxWidth;
    }
});