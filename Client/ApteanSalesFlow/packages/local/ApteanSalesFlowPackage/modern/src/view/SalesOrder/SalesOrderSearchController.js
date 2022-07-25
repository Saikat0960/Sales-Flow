Ext.define('ApteanSalesFlowPackage.view.SalesOrder.SalesOrderSearchController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.salesordersearch',
    listen: {
        controller: {
            '*': {
                salesOrderStatusUpdation: 'onSalesOrderStatusUpdate',
            }
        }
    },
    init: function(){
        Ext.Ajax.request({
            url: 'http://localhost:50619/api/SalesOrder/GetSales_Order',
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
    onSalesOrderStatusUpdate: function () {
        var me = this;
        var grid = this.getView();
        grid.getStore().load();
    },
    showEditWindow: function (grid, rowIndex, colIndex) {
        var rec = grid.getStore().getAt(rowIndex);
        if (rec.data.shipped == 1) {
            Ext.Msg.show({
                title: 'Access Denied',
                message: 'Sales Order is already shipped.<br/>You can check the report for your reference.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.WARNING
            });
        }
        else {
            Ext.create('ApteanSalesFlowPackage.view.SalesOrder.SalesOrderShowEditWindowView', {
                record: rec
            }).show();
        }
    },
    printReport: function (grid, rowIndex, colIndex) {
        var rec = grid.getStore().getAt(rowIndex);
        if (rec.data.status == "STARTED") {
            Ext.Msg.show({
                title: 'Access Denied',
                message: 'Sales Order is not approved yet.<br/>You can show/edit details.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.WARNING
            });
        }
        else {
            var SO_Number = grid.getStore().getAt(rowIndex).data.sO_Number;
            var report_url = "http://localhost/ReportServer/Pages/ReportViewer.aspx?%2fApteanSalesReport%2fSalesOrderReport&rs:Command=Render&SO_Number=" + SO_Number;
            window.open(report_url, '_blank');   
        }
    }
});