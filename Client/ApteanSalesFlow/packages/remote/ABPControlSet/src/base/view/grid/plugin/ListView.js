Ext.define('ABPControlSet.base.view.grid.plugin.ListView', {
    extend: 'Ext.AbstractPlugin',
    alias: 'plugin.listview',
    mixins: [
        'Ext.mixin.Observable'
    ],
    showTitle: true,
    autoFillMain: true,
    autoFillBody: false,
    allowMainDuplication: false,
    allowBodyDuplication: true,
    showHeaders: false,
    gridId: null,

    config: {
        fullRow: null,
        template: null
    },

    listTemplateClsPreface: 'abp-list-view-template-',
    /*
        ExtJS grid
            Picking up the scrollbar and dragging down sometimes has problems positioning to where I unclick.
                - DONE
            Does not always render a ListView row correctly when switching back from grid – e.g. the ListView views are pushed too far over to the left. One time the ListView rows only showed with a long line of text, and no cell+cellColumn layout.
                - (far left issue DONE) --- Unsure of long line of text - might be on error thrown break only
            The grid view sometimes does not show its rows when switching back from ListView. Need to move the scrollbar to get the rendering to happen.
                - (DONE via Refresh - scroll refresh etc - should be good)
            Editing a cell shows cell editor not quite where you’d expect it :-)
                - ? need to see video.
            Once edited, the rawValue rendered should be re-called.
                - DONE
            Memory leaks
                - unsure

        ag-Grid
            Looks like it is more CPU intensive than ExtJS Grid when scrolling around a lot.
                - Yes - embed full width rows config may be the answer as well as reduce table nesting.
            Memory leaks - detached dom elements everywhere
                - find out how to clean up - during switch back to normal view clear out the row components - reset grid somehow?

    */
    /**
    * @private
    */
    cellColumnFieldsTpl: new Ext.XTemplate([
        '<td class="abp-list-view-cellColumn abp-list-view-cellColumn-{[values.cellColumn]}">',
        '<tpl for="values.cellColumnPriorities">',
        '{%',
        'cellColumnParent=parent;',
        'priorityIndex = xindex - 1;',
        '%}',
        '<table class="abp-list-view-field abp-list-view-field-{[priorityIndex + 1]}">',
        '<tr>',
        '<tpl if=".">',
        '<tpl for=".">',
        '<tpl if=".">',
        '<tpl if="cellColumnParent.includeLabel">',
        '<td class="abp-list-view-field-label abp-list-view-field-label-{[priorityIndex + 1]}">',
        '{fieldLabel}',
        '</td>',
        '</tpl>',
        '{%',
        'values.listViewPlugin.renderCell(values, out, priorityIndex + xindex - 1, cellColumnParent)',
        '%}',
        '<tpl else>',
        '<td class="abp-list-view-field abp-list-view-field-{[priorityIndex + 1]} abp-list-view-field-value abp-list-view-field-value-{[priorityIndex + 1]}">',
        '</td>',
        '</tpl>',
        '</tpl>',
        '</tpl>',
        '</tr>',
        '</table>',
        '</tpl>',
        '</td>',
        {
            definitions: 'var priorityIndex;var cellColumnParent;',
            disableFormats: true
        }
    ]),

    namedGridAreaTpl: new Ext.XTemplate([
        '<tpl for=".">',
        '{% values.listViewPlugin.renderAreaCell(values, out) %}',
        '</tpl>'
    ]),

    gridcellColumnFieldsTpl: new Ext.XTemplate([
        '<td class="abp-list-view-cellColumn abp-list-view-cellColumn-{[values.cellColumn]} ',
        '{[values.fillColumn === 1 ? values.fillCls : values.noFillCls]} ',
        'abp-list-align-{[values.align]} ',
        'abp-list-justify-{[values.justify]}" ',
        'style="flex: {[values.flex]}">',
        '<tpl for="values.cellColumnPriorities">',
        '{%',
        'cellColumnParent=parent;',
        'priorityIndex = xindex - 1;',
        'rowsToFill = parent.rowsToFill;',
        '%}',
        '<table class="abp-list-view-field abp-list-view-field-{[rowsToFill ? rowsToFill[parseInt(priorityIndex)] : priorityIndex + 1]}',
        '">',
        '<tr>',
        '<tpl if=".">',
        '<tpl for=".">',
        '<tpl if=".">',
        '<tpl if="cellColumnParent.includeLabel">',
        '<td class="abp-list-view-field-label abp-list-view-field-label-{[rowsToFill ? rowsToFill[priorityIndex] : priorityIndex + 1]}">',
        '{fieldLabel}',
        '</td>',
        '</tpl>',
        '{%',
        'values.listViewPlugin.renderCell(values, out, priorityIndex + xindex - 1, cellColumnParent)',
        '%}',
        '<tpl else>',
        '<td class="abp-list-view-field abp-list-view-field-{[rowsToFill ? rowsToFill[priorityIndex] : "nio"]} abp-list-view-field-value abp-list-view-field-value-{[rowsToFill ? rowsToFill[priorityIndex + 1] : priorityIndex + 1]}">',
        '</td>',
        '</tpl>',
        '</tpl>',
        '</tpl>',
        '</tr>',
        '</table>',
        '</tpl>',
        '</td>',
        {
            definitions: 'var priorityIndex;var cellColumnParent; var rowsToFill;',
            disableFormats: true
        }
    ]),
    /**
    * @private
    */
    templates: {
        triData: {
            tpl: [
                '{%',
                'values.listViewPlugin.renderCellColumn(1, 1, 2, false, values.params, out, parent);',
                'values.listViewPlugin.renderCellColumn(2, 3, 6, true, values.params, out, parent);',
                'values.listViewPlugin.renderCellColumn(3, 7, 14, true, values.params, out, parent);',
                '%}',
                {

                    disableFormats: true
                }
            ],
            start: 1,
            end: 14
        },
        triImage: {
            tpl: [
                '{%',
                'values.listViewPlugin.renderCellColumn(0, 0, 0, false, values.params, out, parent);',
                'values.listViewPlugin.renderCellColumn(2, 1, 2, true, values.params, out, parent);',
                'values.listViewPlugin.renderCellColumn(3, 3, 6, true, values.params, out, parent);',
                '%}',
                {

                    disableFormats: true
                }
            ],
            start: 0,
            end: 6
        },
        duoImage: {
            tpl:
                [
                    '{%',
                    'values.listViewPlugin.renderCellColumn(0, 0, 0, false, values.params, out, parent);',
                    'values.listViewPlugin.renderCellColumn(1, 1, 2, false, values.params, out, parent);',
                    '%}',
                    {

                        disableFormats: true
                    }
                ],
            start: 0,
            end: 2
        },
        phoneNumberDisplay: {
            tpl:
                [
                    '{%',
                    'values.listViewPlugin.renderCellColumn(0, 0, 1, false, values.params, out, parent);',
                    '%}',
                    {

                        disableFormats: true
                    }
                ],
            start: 0,
            end: 1
        },
        phoneNumberDisplayInForm: {
            tpl:
                [
                    '{%',
                    'values.listViewPlugin.renderCellColumn(0, 0, 1, false, values.params, out, parent);',
                    '%}',
                    {

                        disableFormats: true
                    }
                ],
            start: 0,
            end: 1
        },
        emailDisplay: {
            tpl:
                [
                    '{%',
                    'values.listViewPlugin.renderCellColumn(0, 0, 1, false, values.params, out, parent);',
                    '%}',
                    {

                        disableFormats: true
                    }
                ],
            start: 0,
            end: 1
        },
        singleLineItem: {
            tpl:
                [
                    '{%',
                    'values.listViewPlugin.renderCellColumn(0, 0, 1, false, values.params, out, parent);',
                    '%}',
                    {

                        disableFormats: true
                    }
                ],
            start: 0,
            end: 1
        },
        singleLineItemWithTrigger: {
            tpl: [
                '{%',
                'values.listViewPlugin.renderCellColumn(0, 0, 0, false, values.params, out, parent);',
                'values.listViewPlugin.renderCellColumn(1, 1, 1, false, values.params, out, parent);',
                'values.listViewPlugin.renderCellColumn(2, 2, 2, false, values.params, out, parent);',
                '%}',
                {

                    disableFormats: true
                }
            ],
            start: 0,
            end: 2
        },
        twoLineItem: {
            tpl:
                [
                    '{%',
                    'values.listViewPlugin.renderCellColumn(0, 0, 0, false, values.params, out, parent);',
                    'values.listViewPlugin.renderCellColumn(1, 2, 2, false, values.params, out, parent);',
                    '%}',
                    {

                        disableFormats: true
                    }
                ],
            start: 0,
            end: 2
        },
        twoLineItemWithTrigger: {
            tpl: [
                '{%',
                'values.listViewPlugin.renderCellColumn(0, 0, 0, false, values.params, out, parent);',
                'values.listViewPlugin.renderCellColumn(1, 1, 1, false, values.params, out, parent);',
                'values.listViewPlugin.renderCellColumn(2, 2, 2, false, values.params, out, parent);',
                'values.listViewPlugin.renderCellColumn(3, 3, 3, false, values.params, out, parent);',
                '%}',
                {

                    disableFormats: true
                }
            ],
            start: 0,
            end: 3
        },
        threeLineItem: {
            tpl:
                [
                    '{%',
                    'values.listViewPlugin.renderCellColumn(0, 0, 0, false, values.params, out, parent);',
                    'values.listViewPlugin.renderCellColumn(1, 1, 1, false, values.params, out, parent);',
                    'values.listViewPlugin.renderCellColumn(2, 2, 2, false, values.params, out, parent);',
                    '%}',
                    {

                        disableFormats: true
                    }
                ],
            start: 0,
            end: 3
        },
        threeLineItemWithTrigger: {
            tpl: [
                '{%',
                'values.listViewPlugin.renderCellColumn(0, 0, 0, false, values.params, out, parent);',
                'values.listViewPlugin.renderCellColumn(1, 1, 1, false, values.params, out, parent);',
                'values.listViewPlugin.renderCellColumn(2, 2, 2, false, values.params, out, parent);',
                'values.listViewPlugin.renderCellColumn(3, 3, 3, false, values.params, out, parent);',
                'values.listViewPlugin.renderCellColumn(4, 4, 4, false, values.params, out, parent);',
                '%}',
                {

                    disableFormats: true
                }
            ],
            start: 0,
            end: 4
        },
        headerLineItemWithThreeFields: {
            tpl: [
                '{%',
                'values.listViewPlugin.renderCellColumn(0, 0, 0, false, values.params, out, parent);',
                'values.listViewPlugin.renderCellColumn(1, 1, 1, false, values.params, out, parent);',
                'values.listViewPlugin.renderCellColumn(2, 2, 2, false, values.params, out, parent);',
                'values.listViewPlugin.renderCellColumn(3, 3, 3, false, values.params, out, parent);',
                '%}',
                {

                    disableFormats: true
                }
            ],
            start: 0,
            end: 4
        },
        twoLineItemWithPhoneOrEmail: {
            tpl:
                [
                    '{%',
                    'values.listViewPlugin.renderCellColumn(0, 0, 0, false, values.params, out, parent);',
                    'values.listViewPlugin.renderCellColumn(1, 1, 2, false, values.params, out, parent);',
                    '%}',
                    {

                        disableFormats: true
                    }
                ],
            start: 0,
            end: 2
        },
        gridExample: {
            tpl:
                [
                    '{%',
                    'values.listViewPlugin.renderGridCellColumn(0, 0, 0, false, values.params, out, parent, true);',
                    'values.listViewPlugin.renderGridCellColumn(1, 1, 2, false, values.params, out, parent, false, [1,2]);',
                    'values.listViewPlugin.renderGridCellColumn(2, 3, 3, false, values.params, out, parent, false, [1]);',
                    '%}',
                    {

                        disableFormats: true,
                        cssGridTemplate: true,
                        cols: 3,
                        rows: 3
                    }
                ],
            start: 0,
            end: 2
        },
        gridExampleBottom: {
            tpl:
                [
                    '{%',
                    'values.listViewPlugin.renderGridCellColumn(0, 0, 0, false, values.params, out, parent, true);',
                    'values.listViewPlugin.renderGridCellColumn(1, 1, 2, false, values.params, out, parent, false, [2,3]);',
                    'values.listViewPlugin.renderGridCellColumn(2, 3, 3, false, values.params, out, parent, false, [3]);',
                    '%}',
                    {

                        disableFormats: true,
                        cssGridTemplate: true,
                        cols: 3,
                        rows: 3
                    }
                ],
            start: 0,
            end: 2
        },
        gridExampleSplit: {
            tpl:
                [
                    '{%',
                    'values.listViewPlugin.renderGridCellColumn(0, 0, 0, false, values.params, out, parent, true);',
                    'values.listViewPlugin.renderGridCellColumn(1, 1, 2, false, values.params, out, parent, false, [1,3]);',
                    'values.listViewPlugin.renderGridCellColumn(2, 3, 4, false, values.params, out, parent, false, [1,3]);',
                    '%}',
                    {

                        disableFormats: true,
                        cssGridTemplate: true,
                        cols: 3,
                        rows: 3
                    }
                ],
            start: 0,
            end: 2
        },
        gridExampleImageCenter: {
            tpl:
                [
                    '{%',
                    'values.listViewPlugin.renderGridCellColumn(1, 0, 0, false, values.params, out, parent, true, null, "center");',
                    'values.listViewPlugin.renderGridCellColumn(0, 1, 2, false, values.params, out, parent, false, [1,3], "center");',
                    'values.listViewPlugin.renderGridCellColumn(2, 3, 4, false, values.params, out, parent, false, [1,3], "center");',
                    '%}',
                    {

                        disableFormats: true,
                        cssGridTemplate: true,
                        cols: 3,
                        rows: 3
                    }
                ],
            start: 0,
            end: 2
        },
        gridExampleX: {
            tpl:
                [
                    '{%',
                    'values.listViewPlugin.renderGridCellColumn(0, 0, 1, false, values.params, out, parent, false, [1, 3], "center", "bottom");',
                    'values.listViewPlugin.renderGridCellColumn(1, 2, 2, false, values.params, out, parent, false, [2], "center", null, 3);',
                    'values.listViewPlugin.renderGridCellColumn(2, 3, 4, false, values.params, out, parent, false, [1, 3], "center", "center");',
                    '%}',
                    {

                        disableFormats: true,
                        cssGridTemplate: true,
                        cols: 3,
                        rows: 3
                    }
                ],
            start: 0,
            end: 2
        },
        gridExampleV: {
            tpl:
                [
                    '{%',
                    'values.listViewPlugin.renderGridCellColumn(0, 0, 1, false, values.params, out, parent, false, [1, 2], "center", "bottom");',
                    'values.listViewPlugin.renderGridCellColumn(1, 2, 2, false, values.params, out, parent, false, [3], "center", null, 3);',
                    'values.listViewPlugin.renderGridCellColumn(2, 3, 4, false, values.params, out, parent, false, [1, 2], "center", "center");',
                    '%}',
                    {

                        disableFormats: true,
                        cssGridTemplate: true,
                        cols: 3,
                        rows: 3
                    }
                ],
            start: 0,
            end: 2
        },

        /**
         * This is now the primary grid template. Other grids must be requested in the metadata.
         */
        namedAreaGrid: {
            tpl:
                [
                    '{%',
                    'values.listViewPlugin.renderNamedAreaGrid(values, out, parent);',
                    '%}',
                    {
                        disableFormats: true,
                        namedGridTemplate: true
                    }
                ]
        },

        gridDefinedOneColumn: {
            tpl:
                [
                    '{%',
                    'values.listViewPlugin.renderDefinedCellColumn(false, values.params, out, parent);',
                    '%}',
                    {
                        disableFormats: true,
                        cssGridTemplate: true
                    }
                ],
            start: 0,
            end: 0
        },
        gridDefinedTwoColumns: {
            tpl:
                [
                    '{%',
                    'values.listViewPlugin.renderDefinedCellColumn(false, values.params, out, parent);',
                    'values.listViewPlugin.renderDefinedCellColumn(false, values.params, out, parent);',
                    '%}',
                    {
                        disableFormats: true,
                        cssGridTemplate: true
                    }
                ],
            start: 0,
            end: 2
        },
        gridDefinedThreeColumns: {
            tpl:
                [
                    '{%',
                    'values.listViewPlugin.renderDefinedCellColumn(false, values.params, out, parent);',
                    'values.listViewPlugin.renderDefinedCellColumn(false, values.params, out, parent);',
                    'values.listViewPlugin.renderDefinedCellColumn(false, values.params, out, parent);',
                    '%}',
                    {
                        disableFormats: true,
                        cssGridTemplate: true
                    }
                ],
            start: 0,
            end: 2
        },
        gridDefinedFourColumns: {
            tpl:
                [
                    '{%',
                    'values.listViewPlugin.renderDefinedCellColumn(false, values.params, out, parent);',
                    'values.listViewPlugin.renderDefinedCellColumn(false, values.params, out, parent);',
                    'values.listViewPlugin.renderDefinedCellColumn(false, values.params, out, parent);',
                    'values.listViewPlugin.renderDefinedCellColumn(false, values.params, out, parent);',
                    '%}',
                    {

                        disableFormats: true,
                        cssGridTemplate: true
                    }
                ],
            start: 0,
            end: 3
        },
        gridDefinedFiveColumns: {
            tpl:
                [
                    '{%',
                    'values.listViewPlugin.renderDefinedCellColumn(false, values.params, out, parent);',
                    'values.listViewPlugin.renderDefinedCellColumn(false, values.params, out, parent);',
                    'values.listViewPlugin.renderDefinedCellColumn(false, values.params, out, parent);',
                    'values.listViewPlugin.renderDefinedCellColumn(false, values.params, out, parent);',
                    'values.listViewPlugin.renderDefinedCellColumn(false, values.params, out, parent);',
                    '%}',
                    {

                        disableFormats: true,
                        cssGridTemplate: true
                    }
                ],
            start: 0,
            end: 4
        },
        gridExampleFlex: {
            tpl:
                [
                    '{%',
                    'values.listViewPlugin.renderGridCellColumn(0, 0, 0, false, values.params, out, parent, true, null, "left", "bottom");',
                    'values.listViewPlugin.renderGridCellColumn(1, 1, 2, false, values.params, out, parent, false, [1,2], null, null, 3);',
                    'values.listViewPlugin.renderGridCellColumn(2, 3, 3, false, values.params, out, parent, false, [1], null, "center");',
                    '%}',
                    {

                        disableFormats: true,
                        flexGridTemplate: true,
                        cols: 3,
                        rows: 3
                    }
                ],
            start: 0,
            end: 2
        }
    },

    /**
     * @private
     */
    constructor: function (config) {
        config = config || {};
        config.fullRow = config.fullRow || false;
        this.callParent([config]);
        this.mixins.observable.constructor.call(this);
    },

    /**
     * @private
     * Initialize the plugin.
     */
    init: function (parentPanel) {
        var me = this;
        // Set the gridId which will be used for user preference getting and setting.
        me.gridId = parentPanel.controlId;
        var userTemplate = ABP.util.LocalStorage.getForLoggedInUser(me.gridId + 'listtemplate');
        if (userTemplate) {
            me.setTemplate(userTemplate);
        } else {
            // Default template to triData if no template is configured.
            var template = me.getTemplate();
            if (!template) {
                me.setTemplate('triData');
            }
        }
        // Add a toggleListView method for the owning panel to use as an API.
        me.cmp.toggleListView = me.toggleListView.bind(me);
        parentPanel.listViewPlugin = me;
    },

    /**
     * @private
     */
    toggleListSettings: function () {
        var me = this,
            listSettings = me.listSettings;

        if (listSettings) {
            var isVisible = listSettings.isVisible();
            listSettings[isVisible ? 'hide' : 'show']();
        }
    },

    /**
     * @private
     */
    onListNodeDrop: function (node, data) {
        // Iterate through all nodes and save the priorities.
        var me = this,
            gridId = me.gridId,
            template = me.getTemplate(),
            templateInfo = me.templates[template],
            endIndex = templateInfo ? templateInfo.end : 0,
            startIndex = templateInfo ? templateInfo.start : 0,
            view = data.view,
            store = view.getStore(),
            range = store.getRange(),
            record,
            length = range.length;

        // Start at the least index of the the interacted records, update all after, including the start index.
        for (var i = 0; i < length; i++) {
            record = range[i];
            if (i >= startIndex && i <= endIndex) {
                record.set('listPriority', i);
                ABP.util.LocalStorage.setForLoggedInUser(gridId + template + 'priority' + record.get('field'), i);
            } else {
                record.set('listPriority', undefined);
                ABP.util.LocalStorage.removeForLoggedInUser(gridId + template + 'priority' + record.get('field'));
            }
        }

        me.doUpdateTemplate(me.getTemplate());
    },

    /**
     * Toggle between list view and the normal grid rendering.
     */
    toggleListView: function () {
        this.setFullRow(!this.getFullRow());
    },

    /**
     * @private
     */
    templateListSorter: function (a, b) {
        // TODO: Write correct sorter.
        var aP = a.get('listPriority'),
            bP = b.get('listPriority'),
            aC = a.get('fullColumnIndex'),
            bC = b.get('fullColumnIndex');

        if (aP <= bP) {
            return -1;
        } else if (aP > bP) {
            return 1;
        } else if (aC <= bC) {
            return -1;
        } else if (aC > bC) {
            return 1;
        }
    },

    /**
     * @private
     * Configure the grid to render with the desired output.
     */
    updateFullRow: function (fullRow) {
        this.doUpdateFullRow(fullRow);
    },

    /**
     * @private
     * Update the template to be used for the list views and refresh the grid if the rendering is set to be the list view.
     */
    updateTemplate: function (name) {
        var me = this,
            gridId = me.gridId,
            templates = me.templates,
            template = templates[name];

        me.listTemplate = Ext.destroy(me.listTemplate);
        if (template) {
            template = new Ext.XTemplate(Ext.clone(template.tpl));
            me.listTemplate = template;
            if (gridId) {
                ABP.util.LocalStorage.setForLoggedInUser(gridId + 'listtemplate', name);
            }
        } else {
            ABP.util.LocalStorage.removeForLoggedInUser(gridId + 'listtemplate');
        }
        me.doUpdateTemplate(name);
    },

    /**
    * @private
    * Template render function to render the list view rows.
    */
    renderFullRow: function (params, out, parent) {
        var me = this,
            listTemplate = me.listTemplate,
            rowValues = {};

        rowValues.listViewPlugin = me;
        rowValues.params = params;
        rowValues.record = params.record;
        rowValues.recordIndex = params.recordIndex;
        rowValues.rowIndex = params.rowIndex;

        listTemplate.applyOut(rowValues, out, parent);
        // Dereference objects since cellValues is a persistent var in the XTemplate's scope chain
        rowValues.record = rowValues.params = rowValues.listViewPlugin = null;
    },

    renderNamedAreaGrid: function (values, out, parent) {
        var me = this,
            listTemplate = me.namedGridAreaTpl;
        cellValues = {};
        cellValues.listViewPlugin = values.listViewPlugin;
        cellValues.cells = values.params.cells;
        listTemplate.applyOut(cellValues, out, parent);

    },
    /**
    * @private
    * Template render function to render the list view cellColumns.
    */
    renderCellColumn: function (cellColumn, start, end, includeLabel, params, out, parent) {
        var me = this,
            cellColumnValues = {
                params: params
            },
            priorities = me.priorities || {},
            cellColumnPriorities = [],
            cellColumnTpl = me.cellColumnFieldsTpl;

        for (var i = start; i <= end; i++) {
            if (priorities[i]) {
                for (var priority in priorities[i]) {
                    priority = priorities[i][priority];
                    if (!(priority.column instanceof Ext.Base)) {
                        var len = params.columns.length;
                        for (var i = 0; i < len; i++) {
                            var col = params.columns[i];
                            if (col.dataIndex === priority.column.dataIndex) {
                                priority.column = col;
                                break;
                            }
                        }
                    }
                }
            }
            cellColumnPriorities.push(priorities[i]);
        }

        cellColumnValues.cellColumn = cellColumn;
        cellColumnValues.includeLabel = includeLabel || false;
        cellColumnValues.cellColumnPriorities = cellColumnPriorities;
        cellColumnTpl.applyOut(cellColumnValues, out, parent);
        cellColumnValues.cellColumn = cellColumnValues.cellColumnPriorities = cellColumnValues.params = null;
    },

    /**
     * @private
     * 
     * When list views are defined in template definitions (this file), we are calling this method.
     * Each row gets a css grid or flex layout.
     * In the grid definition, set cssGridTemplate: true or flexGridTemplate: true to select css grid or flex.
     * Rows can also be created dynamically in metadata.
     * The below method follows a legacy (though still useful) pattern where individual grid definitions get their own css files.
     * Individual css files will allow for more fine grained control of styling when dynamic metadata definition is not enough.
     * 
     * 
     * @param {*} cellColumn 
     * @param {*} start 
     * @param {*} end 
     * @param {*} includeLabel 
     * @param {*} params 
     * @param {*} out 
     * @param {*} parent 
     * @param {*} fillColumn 
     * @param {*} rowsToFill 
     * @param {*} justify 
     * @param {*} align 
     */
    renderGridCellColumn: function (cellColumn, start, end, includeLabel, params, out, parent, fillColumn, rowsToFill, justify, align, flex) {
        var me = this,
            cellColumnValues = {
                params: params
            },
            priorities = me.priorities || {},
            cellColumnPriorities = [],
            cellColumnTpl = me.gridcellColumnFieldsTpl;

        for (var i = start; i <= end; i++) {
            if (priorities[i]) {
                for (var priority in priorities[i]) {
                    priority = priorities[i][priority];
                    if (!(priority.column instanceof Ext.Base)) {
                        var len = params.columns.length;
                        for (var i = 0; i < len; i++) {
                            var col = params.columns[i];
                            if (col.dataIndex === priority.column.dataIndex) {
                                priority.column = col;
                                break;
                            }
                        }
                    }
                }
            }
            cellColumnPriorities.push(priorities[i]);
        }
        cellColumnValues.cellColumn = cellColumn;
        cellColumnValues.rowsToFill = rowsToFill;
        cellColumnValues.fillColumn = fillColumn ? 1 : 0;
        cellColumnValues.fillCls = 'abp-list-view-cellColumn-fill';
        cellColumnValues.noFillCls = 'abp-list-view-cellColumn-nofill';
        cellColumnValues.justify = justify || 'left';
        cellColumnValues.align = align || 'left';
        cellColumnValues.flex = flex || 1;
        cellColumnValues.includeLabel = includeLabel || false;
        cellColumnValues.cellColumnPriorities = cellColumnPriorities;

        cellColumnTpl.applyOut(cellColumnValues, out, parent);
        cellColumnValues.cellColumn = cellColumnValues.cellColumnPriorities = cellColumnValues.params = null;
    },
    /**
     * @private
     * This method is used to render cellColumns when the row is defined in json metadata.
     * 
     * 
     * @param {*} includeLabel Should we include a label
     * @param {*} params The columns for the template
     * @param {*} out Array of template values
     * @param {*} parent The ListViewRow
     */
    renderDefinedCellColumn: function (includeLabel, params, out, parent) {
        var me = this,
            cellColumnValues = {
                params: params
            },
            priorities = me.priorities || {},
            cellColumnPriorities = [],
            cellColumnTpl = me.gridcellColumnFieldsTpl,
            templateConfig = parent.getParent().config.__data.listView.template,
            // Reference the parent list view to keep track of which cellColumns / cells have been processed.
            parentListView = parent.parent;
        if (parentListView.cellColumnIndex !== 0 && !parentListView.cellColumnIndex) {
            parentListView.cellColumnIndex = 0;
        }

        var cellColumnConfig = templateConfig.cellColumns[parentListView.cellColumnIndex];
        var rowsToFill = cellColumnConfig.cells ? [] : null;
        if (rowsToFill) {
            Ext.Array.each(cellColumnConfig.cells, function (cell) { rowsToFill.push(cell.rowNumber + 1) });
        }

        if (parentListView.cellIndex !== 0 && !parentListView.cellIndex) {
            parentListView.cellIndex = 0;
        }
        var end = cellColumnConfig.cells ? cellColumnConfig.cells.length + parentListView.cellIndex : templateConfig.numRows + parentListView.cellIndex;
        for (var i = parentListView.cellIndex; i < end; i++) {
            if (priorities[i]) {
                for (var priority in priorities[i]) {
                    priority = priorities[i][priority];
                    if (!(priority.column instanceof Ext.Base)) {
                        var len = params.columns.length;
                        for (var i = 0; i < len; i++) {
                            var col = params.columns[i];
                            if (col.dataIndex === priority.column.dataIndex) {
                                priority.column = col;
                                break;
                            }
                        }
                    }
                }
                parentListView.cellIndex++;
            }

            cellColumnPriorities.push(priorities[i]);
        }

        cellColumnValues.cellColumn = parentListView.cellColumnIndex;

        parentListView.cellColumnIndex++;
        cellColumnValues.rowsToFill = rowsToFill;
        cellColumnValues.fillColumn = cellColumnConfig.fillColumn ? 1 : 0;
        cellColumnValues.fillCls = 'abp-list-view-cellColumn-fill';
        cellColumnValues.noFillCls = 'abp-list-view-cellColumn-nofill';
        cellColumnValues.justify = cellColumnConfig.horizontalAlign || 'left';
        cellColumnValues.align = cellColumnConfig.verticalAlign || 'left';
        cellColumnValues.flex = cellColumnConfig.flex || 1;
        cellColumnValues.includeLabel = includeLabel || false;
        cellColumnValues.cellColumnPriorities = cellColumnPriorities;

        cellColumnTpl.applyOut(cellColumnValues, out, parent);
        cellColumnValues.cellColumn = cellColumnValues.cellColumnPriorities = cellColumnValues.params = null;

        if (parentListView.cellIndex === parent.cells.length && parentListView.cellColumnIndex === templateConfig.cellColumns.length) {
            parentListView.cellIndex = 0;
            parentListView.cellColumnIndex = 0;
        }

    },

    /**
    * @private
    * Template render function to render the list view cells.
    */
    renderCell: function (values, out, xIndex, parent) {
        var params = parent.params;
        var origCls = values.column.tdCls;
        values.column.tdCls = (origCls || "") + " abp-list-view-field-value abp-list-view-field-value-" + xIndex;
        params.view.renderCell(values.column, params.record, params.recordIndex, params.rowIndex, values.column.fullColumnIndex - 1, out);
        values.column.tdCls = origCls;
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
                colIdx = letters[cell.colIdx],
                rowIdx = cell.rowIdx;
            out.push('<td priority="' + i + '" data-index="' + cell.name + '" class="cell-placeholder abp-list-view-field-value abp-grid-cell-type-' + cell.xtype + '" style="grid-area: ' + (colIdx + rowIdx) + '; justify-self: ' + horizontalAlign + '; align-self: ' + verticalAlign + ';"></td>');
        }
    },
    /**
    * @private
    * Template render function to render the list view cells.
    */
    onTemplateChange: function (combo, newValue) {
        var me = this;
        // Must set the template value prior to setting the new list settings which depends on the template for row styling.
        me.setTemplate(newValue);
        if (me.setListSettings) {
            me.setListSettings();
        }
    },
    /**
    * @private
    * Update the templates order of column field priorities.
    * Read in user cached information to adjust this order.
    */
    updatePriorities: function (columns) {
        var me = this,
            template = me.getTemplate(),
            columnApi = me.cmp.columnApi,
            length = columns.length,
            column,
            cell,
            text,
            listPriority,
            dataIndex,
            priority,
            noPriority = [],
            bodyPriorities = null,
            fullColumn,
            priorities = null;
        for (var i = 0; i < length; i++) {
            column = columns[i];
            column = column.colDef ? column.colDef : column;
            fullColumn = (columnApi ? columnApi.getColumn(column.field) : column) || column;
            dataIndex = column.dataIndex ? column.dataIndex : column.getDataIndex ? column.getDataIndex() : Ext.isString(column.field) ? column.field : null;
            text = column.text ? column.text : column.getText ? column.getText() : column.headerName;
            cell = column.getCell ? column.getCell() : null;
            if (cell) {
                if (cell.xtype === 'expandercell') {
                    continue;
                }
            }
            // if (Ext.isEmpty(dataIndex)) {
            //     continue;
            // }
            listPriority = parseInt(ABP.util.LocalStorage.getForLoggedInUser(me.gridId + template + 'priority' + dataIndex));
            column.listPriority = Ext.isNumber(listPriority) ? listPriority : column.listPriority;
            priority = {
                listViewPlugin: me,
                fullColumnIndex: fullColumn.fullColumnIndex,
                column: fullColumn,
                fieldName: dataIndex,
                fieldLabel: text
            };
            if (Ext.isNumber(column.listPriority) || Ext.isString(column.listPriority)) {
                if (!priorities) {
                    priorities = {};
                }
                priority.priority = column.listPriority;
                if (!priorities[column.listPriority]) {
                    priorities[column.listPriority] = [];
                }
                priorities[column.listPriority].splice(0, 0, priority);
            } else if (me.autoFillMain || me.autoFillBody) {
                noPriority.push(priority);
            }
            if (Ext.isNumber(column.bodyPriority) || Ext.isString(column.bodyPriority)) {
                if (!bodyPriorities) {
                    bodyPriorities = {};
                }
                priority.priority = column.bodyPriority;
                if (!bodyPriorities[column.bodyPriority]) {
                    bodyPriorities[column.bodyPriority] = [];
                }
                bodyPriorities[column.bodyPriority].splice(0, 0, priority);
            }
        }
        if (noPriority.length > 0) {
            var noPriorityItem;
            var noPriorityCounter = 0;
            if (me.autoFillMain) {
                // Run through again and fill any missing spots in the main priorities. Currently 15 spots with the image spot.
                for (var i = 0; i < 15; i++) {
                    if (priorities && !Ext.isEmpty(priorities[i])) {
                        continue;
                    } else {
                        noPriorityItem = noPriority[noPriorityCounter];
                        if (Ext.isEmpty(noPriorityItem)) {
                            break;
                        }
                        if (!Ext.isEmpty(noPriorityItem.bodyPriority) && !me.allowBodyDuplication) {
                            noPriorityCounter++
                            i--;
                            continue;
                        } else {
                            if (!priorities) {
                                priorities = {};
                            }
                            noPriorityItem.priority = i;
                            if (!priorities[i]) {
                                priorities[i] = [];
                            }
                            priorities[i].splice(0, 0, noPriorityItem);
                            noPriorityCounter++;
                        }
                    }
                }
            }
            if (me.autoFillBody && noPriorityCounter < noPriority.length - 1) {
                // Fill any body priorities that are open.
                // TODO: Need more defined template.
                // Temp 10 items for 2 rows.
                var noPriorityCounter = 0;
                for (var i = 0; i < 10; i++) {
                    if (bodyPriorities && !Ext.isEmpty(bodyPriorities[i])) {
                        continue;
                    } else {
                        noPriorityItem = noPriority[noPriorityCounter];
                        if (Ext.isEmpty(noPriorityItem)) {
                            break;
                        }
                        if (!Ext.isEmpty(noPriorityItem.listPriority) && !me.allowMainDuplication) {
                            noPriorityCounter++
                            i--;
                            continue;
                        } else {
                            if (!bodyPriorities) {
                                bodyPriorities = {};
                            }
                            noPriorityItem.priority = i;
                            if (!bodyPriorities[i]) {
                                bodyPriorities[i] = [];
                            }
                            bodyPriorities[i].splice(0, 0, noPriorityItem);
                            noPriorityCounter++;
                        }
                    }
                }
            }
        }

        me.priorities = priorities;
        me.bodyPriorities = bodyPriorities;
    },

    /**
    * @private
    */
    destroy: function () {
        delete this.bodyPriorities;
        delete this.priorities;
        delete this.listTemplate;
        this.callParent(arguments);
    }
});
