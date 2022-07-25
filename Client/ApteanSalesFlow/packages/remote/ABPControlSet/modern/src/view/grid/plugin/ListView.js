Ext.define('ABPControlSet.view.grid.plugin.ListView', {
    override: 'ABPControlSet.base.view.grid.plugin.ListView',
    requires: [
        'ABPControlSet.view.listview.ListViewRow'
    ],
    cellPlaceholderSelector: 'cell-placeholder',
    originalItemConfig: null,
    constructor: function (config) {
        config = config || {};
        var me = this,
            cmp = config.cmp;
        // Adjust the view configs base rowTpl for non ag-grid panels for this plugin.
        if (cmp && !(cmp instanceof ABPControlSet.base.view.grid.AGGrid)) {
            // Store the original item config (item is the component to create for each row)
            me.originalItemConfig = cmp.getItemConfig();
        }
        me.callParent([config]);
    },

    init: function () {
        var me = this;
        me.callParent(arguments);
        // Add settings before the list view switch.
        me.addSettings();
        if (me.showTitle) {
            me.toggleTool = Ext.widget({
                xtype: 'tool',
                padding: "4px 8px 4px 8px",
                align: 'right',
                iconCls: 'icon icon-list-style-bullets',
                handler: this.toggleListView,
                scope: this
            });
            if (me.cmp.getTitleBar) {
                me.cmp.getTitleBar().add(me.toggleTool);
            } else {
                me.cmp.addTool(me.toggleTool);
            }
        }
    },

    addSettings: function () {
        var me = this,
            fullRow = me.getFullRow(),
            parentPanel = me.cmp;
        if (me.showTitle) {
            me.settingsTool = Ext.widget({
                xtype: 'tool',
                align: 'right',
                padding: "4px 8px 4px 8px",
                iconCls: 'icon icon-gearwheels',
                handler: this.toggleListSettings,
                hidden: !fullRow,
                scope: this
            });
            if (parentPanel.getTitleBar) {
                parentPanel.getTitleBar().add(me.settingsTool);
            } else {
                parentPanel.addTool(me.settingsTool);
            }
        }
        var userTemplate = ABP.util.LocalStorage.getForLoggedInUser(me.gridId + 'listtemplate');
        me.listSettings = Ext.widget({
            xtype: 'container',
            docked: 'right',
            hidden: true,
            width: '100%',
            padding: 4,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            cls: 'abp-list-view-settings',
            listeners: {
                show: function (container) {
                    container.down('#listOrder').setHideHeaders(true);
                }
            },
            items: [
                {
                    xtype: 'abpcombobox',
                    fieldLabel: 'Template',
                    labelAlign: 'top',
                    displayField: 'display',
                    valueField: 'value',
                    itemId: 'templateCombo',
                    forceSelection: true,
                    listeners: {
                        change: me.onTemplateChange,
                        scope: me
                    },
                    store: Ext.create('ABPControlSet.store.ListViewTemplates'),
                    value: userTemplate || 'triData'
                },
                {
                    xtype: 'tree',
                    itemId: 'listOrder',
                    flex: 1,
                    scrollable: 'y',
                    store: Ext.create('Ext.data.TreeStore'),
                    columns: [
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'text',
                            flex: 1
                        }
                    ],
                    rootVisible: false
                }
            ]
        });

        if (parentPanel.getHeaderContainer) {
            var header = parentPanel.getHeaderContainer();
            if (header.endColumnUpdate) {
                Ext.Function.interceptAfter(header, 'endColumnUpdate', me.setListSettings, me);
            }
        }
        parentPanel.insert(2, me.listSettings);
        me.setListSettings();
    },

    setListSettings: function () {
        var me = this,
            listSettings = me.listSettings,
            tree = listSettings.down('#listOrder'),
            treeStore = tree.getStore(),
            parentPanel = me.cmp,
            columns = parentPanel.getColumns(),
            text,
            field,
            listColumns = [];

        columns.forEach(function (column) {
            text = column.getText();
            text = (text || '').trim();
            field = column.getDataIndex();
            if (field) {
                listColumns.push({
                    leaf: true,
                    text: Ext.isEmpty(text) || text !== '&nbsp' ? field : text,
                    field: field
                });
            }
        });

        treeStore.setRoot({
            expanded: true,
            children: listColumns
        });
    },

    /**
    * @private
    * Template render function to render the list view cells.
    */
    renderCell: function (values, out, xIndex, parent) {
        out.push('<td priority="' + values.priority + '" data-index="' + values.fieldName + '" class="cell-placeholder abp-list-view-field-value abp-list-view-field-value-' + xIndex + '"></td>');
    },

    renderAreaCell: function (values, out) {
        var cells = values.cells,
            cLength = cells.length;

        var letters = ['a', 'b', 'c', 'd', 'e'];
        for (var i = 0; i < cLength; i++) {
            var cell = cells[i],
                cellConfig = cell.config,
                horizontalAlign = cellConfig.horizontalAlign,
                verticalAlign = cellConfig.verticalAlign,
                spacing = cellConfig.spacing,
                colIdx = letters[cell.colIdx],
                rowIdx = cell.rowIdx;
            out.push('<td priority="' + i + '" data-index="' + cell.name + '" class="cell-placeholder abp-list-view-field-value abp-grid-cell-type-' + cell.xtype + '" style="grid-area: ' + (colIdx + rowIdx) + '; justify-self: ' + horizontalAlign + '; align-self: ' + verticalAlign + (Ext.isEmpty(spacing) ? ';"></td>' : '; padding: ' + spacing + ';"></td>'));
        }
    },

    doUpdateFullRow: function (fullRow) {
        var me = this,
            parentPanel = me.cmp;
        if (parentPanel) {
            var bodyEl = parentPanel.bodyElement,
                settingsTool = me.settingsTool,
                listSettings = me.listSettings,
                parentListViewTpl = parentPanel.config.__data.listView.template;

            parentPanel.setHideHeaders(fullRow);
            if (fullRow) {
                var columns = parentPanel.getColumns();
                me.updatePriorities(columns);
                var listTpl = me.listTemplate;

                var listItemConfig = {
                    xtype: 'listviewrow',
                    //cls: me.listTemplateClsPreface + me.getTemplate() + (listTpl.cssGridTemplate ? ' abp-list-view-template-grid-rows-' + listTpl.rows + '-columns-' + listTpl.cols : ''),
                    cls: me.makeListViewClasses(me, listTpl, parentListViewTpl),
                    style: me.makeListViewStyles(parentListViewTpl, columns),
                    cellPlaceholderSelector: me.cellPlaceholderSelector,
                    template: me.listTemplate,
                    cellsElementStyle: listTpl.namedGridTemplate ? me.makeListViewStyles(parentListViewTpl, columns, true) : null
                };
                Ext.applyIf(listItemConfig, me.originalItemConfig);
                parentPanel.setItemConfig(listItemConfig);
            } else {
                if (listSettings) {
                    listSettings.hide();
                }
                parentPanel.setItemConfig(me.originalItemConfig);
            }
            if (settingsTool) {
                settingsTool[fullRow ? 'show' : 'hide']();
            }
            parentPanel.toggleCls('abp-panel-list-view', fullRow);
            if (bodyEl) {
                bodyEl.toggleCls('abp-list-view', fullRow);
            }
            me.resetGrid(fullRow, false);
        }
    },

    makeListViewClasses: function (listView, listTpl, parentListViewTpl) {
        var baseCls = listView.listTemplateClsPreface + listView.getTemplate();
        if (!parentListViewTpl) {
            if (listTpl.cssGridTemplate || listTpl.namedGridTemplate) {
                baseCls += ' abp-list-view-template-grid-rows-' + (listTpl.rows ? listTpl.rows : 1) + '-columns-' + (listTpl.cols ? listTpl.cols : 1);
            }

            if (listTpl.flexGridTemplate) {
                baseCls += ' abp-list-view-template-grid-rows-' + (listTpl.rows ? listTpl.rows : 1) + '-columns-' + (listTpl.cols ? listTpl.cols : 1) + ' abp-flex-grid';
            }
        } else if (listTpl.namedGridTemplate) {
            baseCls += ' abp-list-view-template-grid-rows-' + (parentListViewTpl.numRows ? parentListViewTpl.numRows : 1) + '-columns-' + (parentListViewTpl.cellColumns.length || 1);
        } else {
            if (listTpl.cssGridTemplate) {
                baseCls += ' abp-list-view-template-grid-rows-' + (parentListViewTpl.numRows ? parentListViewTpl.numRows : 1) + '-columns-' + parentListViewTpl.cellColumns.length;
            }

            if (listTpl.flexGridTemplate) {
                baseCls += ' abp-list-view-template-grid-rows-' + (parentListViewTpl.numRows ? parentListViewTpl.numRows : 1) + '-columns-' + parentListViewTpl.cellColumns.length + ' abp-flex-grid';
            }
        }
        return baseCls;
    },

    makeListViewStyles: function (parentListViewTpl, columns, usingNamedGridAreas) {
        var me = this;

        if (!parentListViewTpl) {
            return null;
        } else {
            var styleObj = {};
            var cellColumns = parentListViewTpl.cellColumns;
            if (cellColumns) {
                var specifiedColumnWidths = [];
                var specifiedColumnCount = 0;
                var hasSpecifiedColumnWidth = false;
                var calculatedColString = '';
                var len = cellColumns.length;
                for (var cellColumnIdx = 0; cellColumnIdx < len; cellColumnIdx++) {
                    if (cellColumns[cellColumnIdx].columnWidth) {
                        if (cellColumns[cellColumnIdx].columnWidth === '100%') {
                            cellColumns[cellColumnIdx].columnWidth = '1fr';
                        }
                        hasSpecifiedColumnWidth = true;
                        specifiedColumnWidths.push(cellColumns[cellColumnIdx].columnWidth)
                        specifiedColumnCount++;
                        calculatedColString += cellColumns[cellColumnIdx].columnWidth + ' ';
                    } else {
                        specifiedColumnWidths.push('auto');
                    }
                }
                if (hasSpecifiedColumnWidth) {
                    var templateColumns = me.calculateColumnWidths(specifiedColumnWidths, calculatedColString, specifiedColumnCount);
                    if (templateColumns) {
                        if (!styleObj) {
                            styleObj = {};
                        }
                        styleObj['grid-template-columns'] = templateColumns;
                        //styleObj['grid-template-areas'] = '"a1 b1 c1 d1 e1" "a2 b2 c2 d2 e2" "a3 b3 c3 d3 e3" "a4 b4 c4 d4 e4" "a5 b5 c5 d5 e5"';
                    }
                }
                styleObj['grid-template-areas'] = me.calculateGridTemplateAreas(cellColumns, parentListViewTpl);
                if (!Ext.isEmpty(parentListViewTpl.rowSpacing)) {
                    me.setCellRowSpacing(styleObj, parentListViewTpl.rowSpacing);
                }
                if (!Ext.isEmpty(parentListViewTpl.dataRowSpacing)) {
                    me.setDataRowSpacing(styleObj, parentListViewTpl.dataRowSpacing);
                }
                //if (cellColumns[cellColumnIdx].cells || cellColumns[cellColumnIdx].columnWidth) {
                me.makeColumnCellStyles(cellColumns, columns, specifiedColumnWidths, cellColumns.length, parentListViewTpl.numRows);
                return styleObj ? styleObj : null;
            } else {
                return null;
            }
        }
    },

    setDataRowSpacing: function (styleObj, spacing) {
        var sides = spacing.split(" ");
        var top, bottom, left, right;
        switch (sides.length) {
            case 1:
                top = sides[0];
                right = sides[0];
                bottom = sides[0];
                left = sides[0];
                break;
            case 2:
                top = sides[0];
                right = sides[1];
                bottom = sides[0];
                left = sides[1];
                break;
            case 3:
                top = sides[0];
                right = sides[1];
                bottom = sides[2];
                left = sides[1];
                break;
            case 4:
                top = sides[0];
                right = sides[1];
                bottom = sides[2];
                left = sides[3];
                break;
        }
        styleObj['margin-left'] = left + 'px';
        styleObj['margin-right'] = right + 'px';
        styleObj['margin-top'] = top + 'px';
        styleObj['margin-bottom'] = bottom + 'px';
    },

    // TODO? CSS Grid only supports row spacing so row-gap is the total of top and bottom.
    setCellRowSpacing: function (styleObj, spacing) {
        var sides = spacing.split(" ");
        var top, bottom, left, right;
        switch (sides.length) {
            case 1:
                top = sides[0];
                right = sides[0];
                bottom = sides[0];
                left = sides[0];
                break;
            case 2:
                top = sides[0];
                right = sides[1];
                bottom = sides[0];
                left = sides[1];
                break;
            case 3:
                top = sides[0];
                right = sides[1];
                bottom = sides[2];
                left = sides[1];
                break;
            case 4:
                top = sides[0];
                right = sides[1];
                bottom = sides[2];
                left = sides[3];
                break;
        }
        styleObj['padding-left'] = left + 'px';
        styleObj['padding-right'] = right + 'px';
        styleObj['padding-top'] = top + 'px';
        styleObj['padding-bottom'] = bottom + 'px';
        styleObj['row-gap'] = (parseInt(top) + parseInt(bottom)) + 'px';
    },


    /**
     * Metadata defined list views are using grid-template-areas https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-areas
     * Columns are specified with the lowercase letters a through e and number 1 through 5. 
     * So, a grid with 3 cellColumns and two rows would have these grid areas.
     * "a1 b1 c1"
     * "a2 b2 c2"
     * 
     * We can specify rowSpan and colSpan at the cell level or fillColumn at the cellColumn level.
     * The result will be extending the corresponding named areas, so if the first cell in the grid above has rowSpan: 2 the result will be...
     * "a1 a1 c1"
     * "a2 b2 c2"
     * 
     * If we had a 2 cellColumn grid with 4 rows and the 2nd column had fillColumn: true the result would be...
     * "a1 b1"
     * "a2 b1"
     * "a3 b1"
     * "a4 b1" 
     * @param {*} cellColumns Definitions of the cellColumns with the cells they contain
     * @param {*} parentListViewTpl The parent definition which specifes the number of rows.
     */
    calculateGridTemplateAreas: function (cellColumns, parentListViewTpl) {
        var me = this;
        var templateRowString = '';

        var sLength = cellColumns.length;
        var cLength = parentListViewTpl.numRows;
        var grid = [];
        var toOverwrite = {};

        var letters = ['a', 'b', 'c', 'd', 'e'];
        for (var i = 0; i < sLength; i++) {
            var cellColumn = cellColumns[i];
            var cells = cellColumn.cells;
            if (cellColumn.fillColumn === true) {
                for (var rowIdx = 1; rowIdx <= cLength; rowIdx++) {
                    toOverwrite[letters[i] + rowIdx] = letters[i] + 1;
                }
            }
            for (var j = 0; j < cLength; j++) {
                var row;
                if (i === 0) {
                    row = [];
                    grid.push(row);
                } else {
                    row = grid[j];
                }
                if (cells) {
                    cell = Ext.Array.findBy(cells, function (c) { return c.rowNumber === j });
                    if (!Ext.isEmpty(cell)) {
                        if (!Ext.isEmpty(cell.colSpan)) {
                            for (var k = 1; k <= cell.colSpan; k++) {
                                if (Ext.isEmpty(toOverwrite[letters[i + k - 1] + ((j + 1))])) {
                                    toOverwrite[letters[i + k - 1] + ((j + 1))] = letters[i] + (j + 1);
                                }
                            }
                        }
                        if (!Ext.isEmpty(cell.rowSpan)) {
                            for (var k = 1; k <= cell.rowSpan; k++) {
                                if (Ext.isEmpty(toOverwrite[letters[i] + ((j + 1) + k - 1)])) {
                                    toOverwrite[letters[i] + ((j + 1) + k - 1)] = letters[i] + (j + 1);
                                }
                            }
                        }
                    }
                }
                if (!toOverwrite[letters[i] + (j + 1)]) {
                    row.push(letters[i] + (j + 1));
                } else {
                    row.push(toOverwrite[letters[i] + (j + 1)]);
                }
            }

        }
        for (var i = 0; i < grid.length; i++) {
            templateRowString += me.joinTemplateRowArrayToString(grid[i]);
        }
        return templateRowString;
    },

    joinTemplateRowArrayToString: function (row) {
        return '"' + row.join(' ') + '"';
    },

    calculateColumnWidths: function (specifiedColumnWidths, calculatedColString, specifiedColumnCount) {
        var me = this;
        var templateColumnString = "";
        var contentSpecified = false;

        if (calculatedColString.indexOf('content') > -1) {
            contentSpecified = true;
            if (calculatedColString.indexOf('px') > -1 || calculatedColString.indexOf('%') > -1) {
                ABP.util.Logger.logError('Cannot specify both match content ("max-content" or "min-content" for width) and numeric column widths in list view row');
                return false;
            }
        }
        var len = specifiedColumnWidths.length;
        for (var colIdx = 0; colIdx < len; colIdx++) {
            if (contentSpecified) {
                templateColumnString += specifiedColumnWidths[colIdx] + ' ';
            } else if (specifiedColumnWidths[colIdx] === 'auto') {

                var columnWidthString = '1fr ';
                specifiedColumnWidths[colIdx] = columnWidthString;
                templateColumnString += columnWidthString;
            } else {
                templateColumnString += specifiedColumnWidths[colIdx] + ' ';
            }

        }
        return templateColumnString;
    },

    makeColumnCellStyles: function (cellColumns, cells, columnWidths, numColumns, numRows) {
        var me = this,
            cellIdx = 0;

        for (var i = 0; i < numColumns; i++) {
            var len = 0;
            if (cellColumns[i].cells) {
                len = cellColumns[i].cells.length
            } else {
                len = numRows;
            }
            for (var j = 0; j < len; j++) {

                var cellConfig = null;
                if (cellColumns[i].cells) {
                    cellConfig = cellColumns[i].cells[j];
                }
                if (cellConfig) {
                    if (cellConfig.stretch) {
                        if (!cells[cellIdx].config.cell.cls) {
                            cells[cellIdx].config.cell.cls = "abp-forms-width-inherit";
                        } else {
                            cells[cellIdx].config.cell.cls += " abp-forms-width-inherit";
                        }
                    }
                }

                // We want a minimum of 2rems for icons and text. Images will have a minheight of 3rems.
                if (cellColumns[i].fillColumn === true) {
                    cells[cellIdx].config.cell.minHeight = Math.max(numRows * 1.1, 2) + 'rem';
                }
                if (!Ext.isEmpty(cellColumns[i].columnWidth) && cellColumns[i].columnWidth.indexOf('px') > -1) {
                    cells[cellIdx].config.cell.width = cellColumns[i].columnWidth;
                } else {
                    cells[cellIdx].config.cell.width = null;
                }

                if (!Ext.isEmpty(cellColumns[i].horizontalAlign)) {
                    cells[cellIdx].config.cell.horizontalAlign = cellColumns[i].horizontalAlign;
                } else {
                    cells[cellIdx].config.cell.horizontalAlign = "left";
                }

                if (!Ext.isEmpty(cellColumns[i].verticalAlign)) {
                    cells[cellIdx].config.cell.verticalAlign = cellColumns[i].verticalAlign;
                } else {
                    cells[cellIdx].config.cell.verticalAlign = "center";
                }

                if (!Ext.isEmpty(cellConfig) && !Ext.isEmpty(cellConfig.spacing)) {
                    cells[cellIdx].config.cell.spacing = me.calculateCellSpacing(cellConfig.spacing);
                }

                if (!Ext.isEmpty(cellConfig) && !Ext.isEmpty(cellConfig.rowNumber)) {
                    cells[cellIdx].config.cell.rowIdx = cellConfig.rowNumber + 1;
                } else {
                    cells[cellIdx].config.cell.rowIdx = j + 1;
                }
                // Set grid index for cell
                cells[cellIdx].config.cell.colIdx = i;

                cellIdx++;
                if (cellIdx >= cells.length) {
                    break;
                }
            }
            if (cellIdx >= cells.length) {
                break;
            }
        }
    },

    calculateCellSpacing: function (spacing) {
        var parts = spacing.split(' ');
        var ret = ''
        for (var i in parts) {
            ret += parts[i] + 'px ';
        }
        return ret;
    },

    doUpdateTemplate: function () {
        var me = this,
            parentPanel = me.cmp,
            fullRow = me.getFullRow();

        if (parentPanel && parentPanel.rendered) {
            if (fullRow) {
                var columns = parentPanel.getColumns();
                me.updatePriorities(columns);
            }
            me.resetGrid(fullRow, true);
        }
    },

    resetGrid: function (fullRow, refresh) {
        var me = this,
            parentPanel = me.cmp;
        if (parentPanel) {
            parentPanel.setVariableHeights(fullRow);
            parentPanel.refresh();
        }
    },

    destroy: function () {
        delete this.listSettings;
        delete this.toggleTool;
        delete this.settingsTool;
        this.callParent(arguments);
    }
});
