Ext.define('ApteanSalesFlowPackage.view.Shipment.ShipmentSearchController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.searchshipment',
    listen: {
        controller: {
            '*': {
                shipmentUpdation: 'onItemUpdate'
            }
        }
    },
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
                    v.getStore().loadData(resp);
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
    onItemUpdate: function () {
        var me = this;
        var grid = this.getView();
        grid.getStore().load();
    },
    showEditWindow: function (grid, rowIndex, colIndex) {
        var rec = grid.getStore().getAt(rowIndex);
        if (rec.data.invoiced == 1) {
            Ext.Msg.show({
                title: 'Access Denied',
                message: 'Invoice is already created for this shipment.<br/>You can check the report for your reference',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.WARNING
            });
        }
        else {
            Ext.create('ApteanSalesFlowPackage.view.Shipment.ShipmentShowEditWindowView', {
                record: rec
            }).show();
        }
    },
    printReport: function (grid, rowIndex, colIndex) {
        var rec = grid.getStore().getAt(rowIndex);
        if (rec.data.status == "STARTED") {
            Ext.Msg.show({
                title: 'Access Denied',
                message: 'Shipment is not approved yet.<br/>You can show/edit details',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.WARNING
            });
        }
        else {
            var Shipment_Number = grid.getStore().getAt(rowIndex).data.shipment_Number;
            var report_url = "http://localhost/ReportServer/Pages/ReportViewer.aspx?%2fApteanSalesReport%2fShipmentReport&rs:Command=Render&Shipment_Number=" + Shipment_Number;
            window.open(report_url, '_blank');
        }
    }
});