Ext.define('ApteanSalesFlowPackage.view.LoadShipment.LoadShipmentController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.loadshipment',

    init: function(){
        Ext.Ajax.request({
            url: 'http://localhost:50619/api/Shipments/GetShipments',
            useDefaultXhrHeader: false,
            withCredentials: true,
            disableCaching: false,
            method: 'GET',
            scope: this,
            success: function (response) {
                if (response) {
                    var me = this;
                    var v = me.getView();
                    var resp = Ext.decode(response.responseText, true);
                    var grid = v.down('grid');
                    grid.getStore().loadData(resp);
                }
            },
            failure: function (resp, opts) {
                if(resp.status == 401){
                    this.redirectTo('Logout')
                }
                else{
                    Ext.Msg.alert('Failed','Error. Please try after sometime.');
                }
            }
        });
    },

    onSelectShipment: function (gridpanel, record, item, e) {
        var me = this;
        var view = me.getView();
        me.fireEvent('onShipmentSelect', record);
        view.destroy();
    }
});