/**
 * @private
 * Base ag-grid. Extends the Ext.Panel
 *
 * In order to use this grid component, the proper files must be included in the package js files.
 * To do this, in the application package created, there is a package.json file.  Within this file, there is an allowed property "js", which accepts an array of objects.
 * Each object can have two properties; path and remote.  The path is a URL or local path to the file. Remote is a boolean for whether or not the path is to be remotely loaded.
 *
 * Example ag-grid inclusion using the free version.
 *
 *      "js": [
 *          {
 *            "path": "https://unpkg.com/ag-grid/dist/ag-grid.min.js",
 *            "remote": true
 *          }
 *      ]
 */
Ext.define("ABPControlSet.base.view.grid.AGGrid", {
    extend: "Ext.Panel",
    requires: [
        'ABPControlSet.base.view.grid.plugin.AGListView'
    ],
    layout: 'fit',
    // The ag-grid
    agGrid: null,
    // The ag-grid column definitions.
    columnDefs: null,
    // The data to pass to the ag-grid.
    rowData: null,
    // The ag-grid api.
    gridApi: null,
    // Flag for a Sencha store.
    isUsingSenchaStore: false,
    /**
     * @cfg {Boolean} listOnTop
     * If the listView config is true, this determines whether or not the listView is shown initially.
     */
    listOnTop: false,
    /**
     * @cfg {Boolean} listView
     * If true, the grid will have the list view option enabled.
     */
    listView: false,
    /**
     * @cfg {Number/String} gridHeight
     * The number (pixels) or css value string for the height of the embedded ag-grid.
     */
    gridHeight: null,

    cls: ['ag-theme-balham'],

    bodyCls: 'abp-ag-grid-body',

    border: true,

    config: { store: null },

    constructor: function (config) {
        config = config || {};
        config.items = [
            {
                xtype: "component",
                itemId: "agGrid",
                style: {
                    // Fix for an issue where the parent panel gets a non whole number width (i.e. 456.43) due to the css grid algorithm, and the ag-grid width itself is 457, causing the right border to be hidden.
                    maxWidth: "calc(100% - 1px)",
                    height: "100%",
                    minHeight: Ext.isNumber(config.gridHeight) ? config.gridHeight + 'px' : Ext.isString(config.gridHeight) ? config.gridHeight : '100%'
                }
            }
        ];
        config.listView = Ext.isBoolean(config.listView) ? config.listView : this.listView === false ? false : true;
        if (config.listView) {
            config.plugins = config.plugins || {};
            config.plugins.aglistview = config.plugins.aglistview || true;
        }
        // TODO: Buffered store switch?
        config.store = Ext.create('ABPControlSet.store.AGGrid');
        this.callParent([config]);
    },
    /**
     * @event beforeembed
     * Fires before the ag grid is embedded
     * @param {Ext.Panel} this
     */

    /**
     * @event embed
     * Fires once the ag-grid has been embedded.
     * @param {Ext.Panel} this
     * @param {Object} agGrid The ag-grid instance.
     * @param {Object} gridApi The ag-grid api.
     * @param {Object} columnApi The ag-grid's column api.
     */

    /**
     * @private
     */
    beginEmbed: function () {
        var me = this,
            agGridComponent = me.down('#agGrid'),
            hidden = me.getHidden(),
            embeddableEl = agGridComponent.getEl ? agGridComponent.getEl() : agGridComponent.el || agGridComponent.element;

        if (hidden) {
            me.on({
                show: me.beginEmbed,
                single: true
            });
            return;
        }
        if (embeddableEl) {
            // Hook up the destroy event handler to destroy the extra references.
            me.on("destroy", me.destroyAGGrid);

            // Set the embeddedEl prop.
            me.embeddedEl = embeddableEl;
            // Only attempt the embed if the agGrid object exists.
            if (typeof agGrid === 'object') {
                var eGridDiv = document.querySelector('#' + embeddableEl.id);
                var gridOptions = me.getOptions() || {};
                gridOptions.parentComponent = me;
                gridOptions.onCellValueChanged = me.changeCellValue;
                gridOptions.suppressLoadingOverlay = true;
                gridOptions.suppressNoRowsOverlay = true;

                if (me.fireEvent('beforeembed', me, gridOptions) !== false) {
                    // create the grid passing in the div to use together with the columns & data we want to use
                    me.agGrid = new agGrid.Grid(eGridDiv, gridOptions);
                    me.gridApi = gridOptions.api;
                    me.columnApi = gridOptions.columnApi;

                    var store = me.getStore();
                    if (store instanceof ABPControlSet.store.AGGrid) {
                        store.setColumnApi(me.columnApi);
                        store.setGridApi(me.gridApi);
                    }
                    me.fireEvent('embed', me, me.agGrid, me.gridApi, me.columnApi);
                }
            } else {
                // If it doesn't exist, set a message in place of where the grid would be.
                embeddableEl.setHtml('Necessary files to use the ag-grid were not initialized properly. Please review the AGGrid component documentation for details on how to include the proper files.')
            }

            // Call the hook method.
            me.afterEmbed(me.agGrid, me.gridApi, me.columnApi);
        }
    },
    /**
     * This method can be overriden by subclasses. This is executed after the ag-grid is embedded into the ext component's inner element.
     */
    afterEmbed: Ext.emptyFn,

    /**
     * The element which the ag-grid is embedded into. This is only available once the embed occurs; afterEmbed.
     */
    embeddedEl: null,

    /** @private @ignore */
    copyDataFromStore: function () {
        var me = this;
        var store = me.getStore();
        var rowData = store.getData().items.map(function (x) { return x.data; });
        var copyOfRowData = [];
        var i = 0;

        for (; i < rowData.length; i++) {
            copyOfRowData[i] = JSON.parse(JSON.stringify(rowData[i])); // stringify then parse to copy object instead of reference it
        }

        return copyOfRowData;
    },

    /**
     * @method changeCellValue
     * Changes the value of an ABP ag-grid cell. Fires {@link ABPControlSet.common.types.Events#AGGridUpdate AGGridUpdate} event.
     * @param {Object} cellToChange
     * The data to be changed in the ag-grid. Values are wrapped in a data property.
     */
    changeCellValue: function (rowToChange) {
        var me = this.parentComponent;
        var store = me.getStore();
        if (store) {
            var record = store.findRecord('id', rowToChange.data.id);
            if (record) {
                record.set(rowToChange.data);
                me.fireEvent(ABPControlSet.common.types.Events.AGGridUpdate, me, record);
            }
        }
        else { me._update(null, rowToChange.data, null, null, null, null) }

    },

    /**
     * @method addRowValue
     * Adds a row to the ABP ag-grid. Fires {@link ABPControlSet.common.types.Events#AGGridAdd AGGridAdd} event.
     * @param {Object} rowToAdd
     * The data to be added to the ag-grid. Values are wrapped in a data property.
     */
    addRowValue: function (rowToAdd) {
        var me = this;
        var store = me.getStore();
        var record = Ext.create('Ext.data.Model', rowToAdd.data);
        if (store) {
            store.add(record);
            me.fireEvent(ABPControlSet.common.types.Events.AGGridAdd, me, me.up('container'), store.indexOf(record));
        }
        else { me._add(null, record, null, null); }
    },

    /**
     * @method removeRowValue
     * Remove a row or range of rows from the ABP ag-grid. Fires {@link ABPControlSet.common.types.Events#AGGridRemove AGGridRemove} event.
     * @param {Object} cellsToRemove
     * The cell or range of cells to remove from the ag-grid. Values are wrapped in a data property.
     */
    removeRowValue: function (rowsToRemove) {
        var me = this;
        var store = me.getStore();
        var data = rowsToRemove.data.map(function (x) { return x.id; });
        var i = 0;
        var record;
        if (store) {
            for (; i < data.length; i++) {
                record = store.findRecord('id', data[i]);
                store.remove(record);
            }
            me.fireEvent(ABPControlSet.common.types.Events.AGGridRemove, me, me.up('container'), store.indexOf(record));
        }
        else { me._remove(null, rowsToRemove, null, null, null); }
    },

    /**
     * @method getOptions
     * Override this method to set the ag-grid options.
     * @returns {Object} gridOpts
     * The options to render the ag-grid with. See [This link](https://www.ag-grid.com/javascript-grid-properties/) for more information.
     */
    getOptions: Ext.emptyFn,

    /**@private @ignore This is just to make sure a function is present so the automatonCls string gets built. */
    onChange: Ext.emptyFn,

    /**@private @ignore*/
    destroyAGGrid: function () {
        var me = this;

        delete me.embeddedEl;
        // Use the ag-grid destroy method to properly destroy the grid.
        me.agGrid.destroy();
        delete me.agGrid;
        delete me.gridApi;
        delete me.columnApi;
    }
});