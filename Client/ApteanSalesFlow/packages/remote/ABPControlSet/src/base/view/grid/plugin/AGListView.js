/**
 * The AG Grid list view plugin extends the base list view plugin to share the templating system, so all templates originate from one core code file.
 */
Ext.define('ABPControlSet.base.view.grid.plugin.AGListView', {
    extend: 'ABPControlSet.base.view.grid.plugin.ListView',
    alias: 'plugin.aglistview',
    /**
     * @private
     * List to the beforeembed event of the ag-grid panel so the gridOptions can be adjusted.
     */
    init: function (parentPanel) {
        var me = this;
        me.callParent(arguments);

        me.mon(parentPanel, {
            beforeembed: me.onBeforeEmbed,
            scope: me
        });
    },

    /**
     * @private
     * Override the addSettings method and make it blank since we do not need one.
     */
    addSettings: Ext.emptyFn,
    /**
     * @private
     * Adjust the ag-grid gridOptions to include the logic necessary to allow the ag-grid to switch between normal and list view rendering.
     */
    onBeforeEmbed: function (panel, gridOptions) {
        if (gridOptions) {
            var me = this;
            var components = gridOptions.components || {};
            var sideBar = gridOptions.sideBar;
            if (sideBar !== false) {
                var sideBarConfig = {
                    toolPanels: Ext.isObject(sideBar) ? sideBar.toolPanels || [] : []
                };
                sideBar = sideBar === true ? 'columns' : sideBar;
                if (Ext.isString(sideBar)) {
                    sideBarConfig.defaultToolPanel = sideBar;
                    sideBarConfig.toolPanels.push(sideBar);
                }
                var userTemplate = ABP.util.LocalStorage.getForLoggedInUser(me.gridId + 'listtemplate');
                function ListViewSettingsToolPanel() { };
                ListViewSettingsToolPanel.prototype.init = function (params) {
                    me.listSettings = Ext.widget({
                        xtype: 'container',
                        padding: 4,
                        hidden: true,
                        cls: 'abp-list-view-settings',
                        layout: {
                            type: 'vbox',
                            align: 'stretch'
                        },
                        listeners: {
                            el: {
                                painted: {
                                    fn: function (el) {
                                        el.component.setSize('100%', '100%');
                                        el.component.updateLayout();
                                        el.component.down('#listOrder').setHideHeaders(true);
                                    },
                                    single: true
                                }
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
                                xtype: Ext.toolkit === 'classic' ? 'treepanel' : 'tree',
                                itemId: 'listOrder',
                                flex: 1,
                                scrollable: 'y',
                                hideHeaders: true,
                                store: Ext.create('Ext.data.TreeStore'),
                                columns: [
                                    {
                                        xtype: 'gridcolumn',
                                        dataIndex: 'text',
                                        flex: 1
                                    }
                                ],
                                listeners: {
                                    drop: me.onListNodeDrop,
                                    scope: me
                                },
                                viewConfig: Ext.toolkit === 'classic' ? {
                                    plugins: {
                                        treeviewdragdrop: {
                                            containerScroll: true
                                        }
                                    },
                                    getRowClass: me.getRowClass.bind(me)
                                } : undefined,
                                rootVisible: false
                            }
                        ],
                        renderTo: Ext.getBody()
                    });
                    params.api.addEventListener('gridColumnsChanged', me.setListSettings.bind(me));
                };

                ListViewSettingsToolPanel.prototype.getGui = function () {
                    me.listSettings.show();
                    return me.listSettings.el.dom;
                };

                sideBarConfig.toolPanels.push({
                    id: 'listViewSettings',
                    labelDefault: 'List View', // TODO localize
                    labelKey: 'listView',
                    iconKey: 'list-view',
                    toolPanel: ListViewSettingsToolPanel
                });
            }
            Ext.apply(gridOptions, {
                embedFullWidthRows: true,
                getRowStyle: me.getRowStyle.bind(me),
                sideBar: sideBarConfig,
                components: components,
                embedFullWidthRows: true,
                getRowHeight: me.getRowHeight.bind(me),
                groupUseEntireRow: true,
                groupRowRenderer: me.groupRowRenderer.bind(me),
                fullWidthCellRenderer: me.fullWidthRenderer.bind(me),
                isFullWidthCell: me.isFullWidthCell.bind(me)
            });
        }
    },
    /**
     * @private
     */
    setListSettings: function (params) {
        if (this.listSettings) {
            var me = this,
                columnApi = me.cmp.columnApi,
                store = this.listSettings.down('#listOrder').getStore(),
                columns = columnApi.getAllColumns(),
                text,
                listColumns = [];

            columns.forEach(function (column) {
                text = column.colDef.headerName;
                text = (text || '').trim();
                if (column.colDef.field) {
                    listColumns.push({
                        leaf: true,
                        text: Ext.isEmpty(text) ? column.colDef.field : text,
                        field: column.colDef.field
                    });
                }
            });
            store.setRoot({
                expanded: true,
                children: listColumns
            });
        }
    },
    /**
     * @private
     * Get whether or not the row should be rendered with the fullWidthCellRenderer.
     */
    isFullWidthCell: function (rowNode) {
        return this.getFullRow();
    },

    /**
     * @private
     */
    getRowStyle: function (params) {
        var me = this,
            fullRow = me.getFullRow();
        if (fullRow) {
            return {
                display: 'table'
            };
        }
    },
    /**
     * @private
     * Get the row height based on the fullRow config.
     */
    getRowHeight: function (node) {
        var me = this,
            template = me.getTemplate(),
            fullRow = me.getFullRow();
        if (fullRow) {
            if (template === 'duoImage') {
                return 80;
            } else {
                var el = node.api.gridPanel.getGui(),
                    width = el ? el.clientWidth : 0;
                if (width < 700) {
                    return 240;
                } else if (width < 900) {
                    return 180;
                } else {
                    return 105;
                }
            }
        } else {
            return 32;
        }
    },

    /**
     * @private
     */
    fullWidthRenderer: function (params) {
        // Build the template for the row. Inserts ag-grid cells into the divided cellColumns of the template to maintain default cell and row behavior.
        var me = this,
            out = [],
            template = me.getTemplate(),
            rowComp = params.api.rowRenderer.rowCompsByIndex[params.rowIndex];
        Ext.apply(params, {
            record: params.node,
            recordIndex: params.rowIndex,
            rowComp: rowComp
        });
        me.renderFullRow(params, out, params);
        var tr = document.createElement('tr');
        tr.className = (tr.className || '') + ' abp-full-width-list-row ' + me.listTemplateClsPreface + template;
        tr.innerHTML = out.join('');
        var cellComps = rowComp.cellComps;
        var cellCompsArray = Object.values ? Object.values(cellComps) : Object.keys(cellComps).map(function (e) {
            return cellComps[e];
        });
        rowComp.callAfterRowAttachedOnCells(cellCompsArray, tr);
        return tr;
    },

    /**
     * @private
     */
    groupRowRenderer: function (params) {
    },

    /**
     * @private
     */
    renderCell: function (values, out, xIndex, parent) {
        var column = values.column,
            params = parent.params,
            eGridCell = params.eGridCell,
            rowComp = params.rowComp;

        var cellTemplates = [];
        rowComp.createNewCell(column, eGridCell, cellTemplates, []);
        if (cellTemplates.length > 0) {
            var cellTpl = cellTemplates.join('');
            // Replace first div with a td.
            var withoutFirstDiv = cellTpl.replace('div', 'td');
            // Get the last index for the div sub string.
            var start = withoutFirstDiv.lastIndexOf('div');
            // Isolate the last div.
            var lastTd = withoutFirstDiv.substring(start);
            // replace
            lastTd = lastTd.replace('div', 'td');
            // Get entirety of the string without the ending.
            var withoutLastDiv = withoutFirstDiv.substring(0, start);
            // Add list view classes to the td.
            out.push((withoutLastDiv + lastTd).replace('class="', 'class="abp-list-view-field-value abp-list-view-field-value-' + xIndex + " "));
        }
    },

    /**
     * @private
     * When the fullRow prop is updated, reconfigure the ag-grid to render via the updated toggle.
     */
    doUpdateFullRow: function (fullRow) {
        var me = this,
            parentPanel = me.cmp;
        if (parentPanel && parentPanel.gridApi) {
            parentPanel.toggleCls('abp-ag-list-view', fullRow);
            parentPanel.gridApi.headerRootComp.setVisible(!fullRow);
            me.resetGrid(fullRow);
        }
    },

    /**
     * @private
     * Update the template to be used for the list views and refresh the grid if the rendering is set to be the list view.
     */
    doUpdateTemplate: function () {
        var me = this;
        if (me.cmp && me.cmp.rendered) {
            this.resetGrid(this.getFullRow());
        }
    },

    resetGrid: function (fullRow) {
        var me = this,
            parentPanel = me.cmp;
        if (parentPanel) {
            if (fullRow) {
                me.updatePriorities(parentPanel.columnApi.getAllColumns());
            }
            parentPanel.gridApi.resetRowHeights();
            parentPanel.gridApi.redrawRows();
        }
    }

    // https://www.ag-grid.com/javascript-grid-master-detail/#example-custom-detail-cell-renderer-with-a-form
    // Row Bodies
});