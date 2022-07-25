Ext.define('ApteanSalesFlowPackage.view.Shipment.ShipmentSearchController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.searchshipment',
    listen: {
        controller: {
            '*': {
                shipmentUpdation: 'init'
            }
        }
    },

    //Fetches all the shipments and displays it in a grid
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
                    if (resp.length) {
                        v.getStore().loadData(resp);
                    }
                    else {
                        Ext.MessageBox.confirm('Not Available', 'No data available to show. Do you want to create shipment?', confirmFunction);

                        function confirmFunction(btn) {
                            if (btn == 'yes') {
                                me.fireEvent('createShipment');
                            }
                        }
                    }
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

    //Displays the shipment show/edit window
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

    //Printing shipment report
    printReport: function (grid, rowIndex, colIndex) {
        var rec = grid.getStore().getAt(rowIndex);
        if (rec.data.status == "STARTED") {
            Ext.Msg.show({
                title: 'Access Denied',
                message: 'Shipment is not approved yet.You can show/edit details',
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