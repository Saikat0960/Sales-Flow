Ext.define('ABPControlSet.store.BufferedAGGrid', {
    extend: 'ABPControlSet.store.AGGrid',
    requires: [
        'ABPControlSet.store.AGGrid'
    ],

    updateGridApi: function (gridApi) {
        this.callParent(arguments);
    }
});