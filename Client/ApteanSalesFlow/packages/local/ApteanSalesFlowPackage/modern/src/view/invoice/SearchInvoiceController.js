Ext.define('ApteanSalesFlowPackage.view.invoice.SearchInvoiceController', {
    extend : 'Ext.app.ViewController',
    alias: 'controller.searchinvoice',
    listen: {
        controller: {
            '*': {
                
            }
        }
    },
    init: function(){
        Ext.Ajax.request({
            url: 'http://localhost:50619/api/ARInvoices/GetAR_Invoices',
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
    onItemUpdate: function() {
        var me = this;
        var grid = this.getView();
        grid.getStore().load();
    },

    loadShipment: function(shipmentId){
        Ext.Ajax.request({
            url: 'http://localhost:50619/api/Shipments/GetShipment/' + shipmentId,
            useDefaultXhrHeader: false,
            withCredentials: true,
            disableCaching: false,
            method: 'GET',
            scope: this,
            success: function (response) {
                if (response) {
                    var me = this;
                    var v = me.getView();
                    var vm = v.getViewModel();
                    var resp = Ext.decode(response.responseText, true);
                    vm.set('shipment', resp);
 
                }
            },
            failure: function (resp, opts) {
            }
        });
    },
    showWindow: function(grid, rowIndex, colIndex) {
        var rec = grid.getStore().getAt(rowIndex);
        Ext.create('ApteanSalesFlowPackage.view.invoice.ShowInvoice',{
            record:rec
        }).show();
    },
    printReport: function(grid, rowIndex, colIndex) {
        var Invoice_Number = grid.getStore().getAt(rowIndex).data.invoiceID;
        var report_url = "http://localhost/ReportServer/Pages/ReportViewer.aspx?%2fApteanSalesReport%2fInvoiceReport&rs:Command=Render&Invoice_Number=" + Invoice_Number;
        window.open(report_url, '_blank');
    }

});