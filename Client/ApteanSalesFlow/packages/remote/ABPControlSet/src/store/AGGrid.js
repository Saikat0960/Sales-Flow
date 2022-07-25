Ext.define('ABPControlSet.store.AGGrid', {
    extend: 'Ext.data.Store',
    autoLoad: false,

    // State to allow 2 way flow of data without getting stuck in handling loops.
    processingAG: false,
    processingExt: false,

    config: {
        gridApi: null,
        columnApi: null
    },

    updateColumnApi: function (columnApi) {
        var me = this,
            fields = [];
        if (columnApi) {
            fields = me.transformColumnDefs(columnApi.getAllColumns());
        }
        me.setFields(fields);
    },
    updateGridApi: function (gridApi) {
        var me = this;
        if (gridApi && gridApi.rowModel && gridApi.rowModel.getType().toLowerCase() == 'inmemory') {
            gridApi.addEventListener('modelUpdated', me.__syncData.bind(me));
            me.__syncData();
        }
    },

    listeners: {
        add: 'extAdd',
        remove: 'extRemove',
        update: 'extUpdate'
    },

    /** @private @ignore */
    transformColumnDefs: function (columns) {
        columns = columns || [];
        var fields = [],
            colDef,
            length = columns.length;
        for (var i; i < length; i++) {
            colDef = columns[i] ? columns[i].colDef : null;
            if (colDef) {
                fields.push({
                    type: 'string',
                    fieldName: colDef['headerName'],
                    name: colDef['field']
                });
            }
        }
        return fields;
    },

    /** @private @ignore */
    __syncData: function () {
        var me = this,
            rows = [],
            gridApi = me.getGridApi();
        if (gridApi && !me.processingExt) {
            me.processingAG = true;
            gridApi.forEachNodeAfterFilterAndSort(function (node) {
                if (node.data) {
                    rows.push(node.data);
                }
            });
            me.loadData(rows);
            me.processingAG = false;
        }
    },

    /** @private @ignore */
    extAdd: function (store, records, index, options) {
        var me = this,
            gridApi = me.getGridApi(),
            recToAdd = {
                add: null
            };
        if (gridApi && !me.processingAG) {
            me.processingExt = true;
            recToAdd.add = records.map(function (x) { return x.data });
            me.gridApi.updateRowData(recToAdd);
            me.processingExt = false;
        }
    },

    /** @private @ignore */
    extRemove: function (store, records, index, isMove, eOpts) {
        var me = this,
            gridApi = me.getGridApi(),
            recsToRemove = {
                remove: null
            };
        if (gridApi && !me.processingAG) {
            recsToRemove.remove = records.map(function (x) { return x.data; });
            me.processingExt = true;
            me.gridApi.updateRowData(recsToRemove);
            me.processingExt = false;
        }
    },

    /** @private @ignore */
    extUpdate: function (store, record, operation, modifiedFieldNames, details, eOpts) {
        var me = this,
            gridApi = me.getGridApi(),
            recToUpdate = record;
        if (gridApi && !me.processingAG) {
            recToUpdate = record.getData();
            me.processingExt = true;
            me.gridApi.updateRowData({ update: [recToUpdate] });
            me.processingExt = false;
        }
    }
});