Ext.define('ABPControlSet.view.grid.plugin.ListView', {
    override: 'ABPControlSet.base.view.grid.plugin.ListView',
    requires: ['Ext.view.Table'],
    rowTpl: null,
    constructor: function (config) {
        config = config || {};
        var me = this,
            cmp = config.cmp;
        // Adjust the view configs base rowTpl for non ag-grid panels for this plugin.
        if (cmp && !(cmp instanceof ABPControlSet.base.view.grid.AGGrid)) {
            cmp.viewConfig = cmp.viewConfig || {};
            cmp.viewConfig.rowTpl = this.rowTpl;
            // Adjust the variable row height check to always be true for list view being shown (fullRow)
            cmp.viewConfig.hasVariableRowHeight = function () {
                var me = this,
                    panel = me.panel,
                    listViewPlugin = panel.listViewPlugin,
                    fullRow = listViewPlugin ? listViewPlugin.getFullRow() : false;

                return fullRow || me.__proto__.hasVariableRowHeight.apply(me, arguments);
            };
            // Adjust the collectData method to return necessary values to be used in the adjusted row template.
            cmp.viewConfig.collectData = function () {
                var me = this,
                    panel = me.panel,
                    listViewPlugin = panel.listViewPlugin,
                    fullRow = listViewPlugin ? listViewPlugin.getFullRow() : false,
                    templateCls = listViewPlugin ? listViewPlugin.listTemplateClsPreface + listViewPlugin.getTemplate() : '';

                var result = me.__proto__.collectData.apply(me, arguments);

                me.rowValues.fullRow = fullRow;
                me.rowValues.templateCls = templateCls;

                return result;
            };
        }
        me.callParent([config]);
    },

    init: function (parentPanel) {
        var me = this;
        me.callParent(arguments);
        // Add settings before the list view switch.
        me.addSettings();
        if (me.showTitle) {
            me.toggleTool = Ext.widget({
                xtype: 'tool',
                iconCls: 'icon icon-list-style-bullets',
                handler: this.toggleListView,
                scope: this
            });
            me.cmp.addTool(me.toggleTool);
        }
    },

    addSettings: function () {
        var me = this,
            parentPanel = me.cmp;

        if (me.showTitle) {
            me.settingsTool = Ext.widget({
                xtype: 'tool',
                iconCls: 'icon icon-gearwheels',
                handler: this.toggleListSettings,
                hidden: true,
                scope: this
            });
            parentPanel.addTool(me.settingsTool);
        }
        var userTemplate = ABP.util.LocalStorage.getForLoggedInUser(me.gridId + 'listtemplate');
        me.listSettings = Ext.widget({
            xtype: 'container',
            dock: 'right',
            hidden: true,
            width: 200,
            padding: 4,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            cls: 'abp-list-view-settings',
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
                    xtype: 'treepanel',
                    itemId: 'listOrder',
                    flex: 1,
                    scrollable: 'y',
                    hideHeaders: true,
                    columns: [
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'text',
                            flex: 1
                        }
                    ],
                    store: Ext.create('Ext.data.TreeStore', {
                        sorters: [
                            {
                                sorterFn: me.templateListSorter.bind(me)
                            }
                        ]
                    }),
                    listeners: {
                        drop: me.onListNodeDrop,
                        scope: me
                    },
                    viewConfig: {
                        getRowClass: me.getPriorityRowClass.bind(me),
                        plugins: {
                            treeviewdragdrop: {
                                containerScroll: true
                            }
                        }
                    },
                    rootVisible: false
                }
            ]
        });
        parentPanel.on('columnschanged', me.setListSettings, me);
        parentPanel.addDocked(me.listSettings);
        me.setListSettings();
    },

    getPriorityRowClass: function (record, rowIndex, rowParams, store) {
        var me = this,
            template = me.getTemplate(),
            indexOf = store.indexOf(record),
            templateConfig = me.templates[template];

        if (templateConfig && templateConfig.start <= indexOf && templateConfig.end >= indexOf) {
            return 'abp-list-order-inside-range';
        } else {
            return 'abp-list-order-outside-range';
        }
    },

    setListSettings: function () {
        var me = this,
            listSettings = me.listSettings,
            tree = listSettings.down('#listOrder'),
            treeStore = tree.getStore(),
            parentPanel = me.cmp,
            text,
            columns = parentPanel.getColumns(),
            listColumns = [];

        columns.forEach(function (column) {
            text = column.text;
            text = (text || '').trim();
            if (column.dataIndex) {
                listColumns.push({
                    leaf: true,
                    text: Ext.isEmpty(text) ? column.dataIndex : text,
                    field: column.dataIndex,
                    listPriority: column.listPriority,
                    fullColumnIndex: column.fullColumnIndex
                });
            }
        });
        treeStore.setRoot({
            expanded: true,
            children: listColumns
        });
    },

    doUpdateFullRow: function (fullRow) {
        var me = this,
            parentPanel = me.cmp;
        if (parentPanel) {
            parentPanel.toggleCls('abp-panel-list-view', fullRow);
            // Must update priorities before setting the hide headers - this causes a refresh of the grid and without priorities set it will cause a template error.
            if (fullRow) {
                me.updatePriorities(parentPanel.rendered ? parentPanel.getColumns() : parentPanel.columns);
            }
            if (parentPanel.rendered) {
                var parentView = parentPanel.getView();
                if (parentView) {
                    parentView.toggleCls('abp-list-view', fullRow);
                }
                me.resetGrid(fullRow);
            } else if (fullRow) {
                parentPanel.viewConfig = parentPanel.viewConfig || {};
                parentPanel.viewConfig.cls = parentPanel.viewConfig.cls || '';
                parentPanel.viewConfig.cls += ' abp-list-view';
            }
            var settingsTool = me.settingsTool,
                listSettings = me.listSettings;
            if (settingsTool) {
                settingsTool.setVisible(fullRow);
            }
            if (!fullRow && listSettings) {
                listSettings.setVisible(false);
            }
            // Hide/show headers last.
            var headerCt = parentPanel.headerCt;
            if (headerCt) {
                parentPanel.setHideHeaders(fullRow);
            } else {
                parentPanel.hideHeaders = fullRow;
            }
        }
    },

    doUpdateTemplate: function (templateName) {
        var me = this,
            parentPanel = me.cmp;

        if (parentPanel) {
            var fullRow = me.getFullRow();
            if (fullRow) {
                me.updatePriorities(parentPanel.rendered ? parentPanel.getColumns() : parentPanel.columns);
            }
            me.resetGrid(fullRow);
        }
    },

    resetGrid: function (fullRow) {
        var me = this,
            parentPanel = me.cmp;
        if (parentPanel && parentPanel.rendered) {
            var parentView = parentPanel ? parentPanel.getView() : null;
            if (parentView) {
                parentView.variableRowHeight = fullRow;
                // Ensure layout system knows about new content size
                parentView.refreshSizePending = true;
                if (parentView.bufferedRenderer) {
                    var bufferedRenderer = parentView.bufferedRenderer,
                        firstVisibleIndex = bufferedRenderer.getFirstVisibleRowIndex();

                    delete bufferedRenderer.rowHeight;
                    bufferedRenderer.scroller.refresh();
                    bufferedRenderer.refreshView();
                    bufferedRenderer.scrollTo(firstVisibleIndex);
                } else {
                    parentView.refresh();
                }
            }
        }
    },

    destroy: function () {
        delete this.listSettings;
        delete this.toggleTool;
        delete this.settingsTool;
        this.callParent(arguments);
    }
}, function () {
    // Adjust the rowTpl to contain the original ext table view row tpl, but adjust it so it can switch on the fullRow property to display the list view rows.
    var baseRowTpl = [].concat(Ext.view.Table.prototype.rowTpl);
    if (baseRowTpl && Ext.isObject(baseRowTpl[baseRowTpl.length - 1])) {
        baseRowTpl.pop();
    }
    var rowTpl = [
        '<tpl if="fullRow">',
        '{%',
        'var dataRowCls = values.recordIndex === -1 ? "" : " ' + Ext.baseCSSPrefix + 'grid-row";',
        '%}',
        '<tr class="{[values.rowClasses.join(" ")]} {[dataRowCls]} {templateCls}"',
        ' role="{rowRole}" {rowAttr:attributes}>',
        '{%',
        'parent.view.panel.listViewPlugin.renderFullRow(values, out, parent)',
        '%}',
        '</tr>',
        '<tpl else>'
    ];
    rowTpl = rowTpl.concat(baseRowTpl);
    rowTpl.push('</tpl>',
        {
            disableFormats: true,
            priority: 0
        }
    );
    this.prototype.rowTpl = rowTpl;
});