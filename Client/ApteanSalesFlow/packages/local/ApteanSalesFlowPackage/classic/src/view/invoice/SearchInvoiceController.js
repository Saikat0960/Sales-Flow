Ext.define('ApteanSalesFlowPackage.view.invoice.SearchInvoiceController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.searchinvoice',
    
    //fetches the customers details and displays it in a grid
    init: function () {
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
                    if (resp.length) {
                        v.getStore().loadData(resp);
                    }
                    else {
                        Ext.MessageBox.confirm('Not Available', 'No data available to show. Do you want to create invoice?', confirmFunction);

                        function confirmFunction(btn) {
                            if (btn == 'yes') {
                                me.fireEvent('createInvoice');
                            }
                        }
                    }
                }
            },
            failure: function (resp, opts) {
                if (resp.status == 401) {
                    this.redirectTo('Logout')
                }
                else {
                    Ext.Msg.alert('Failed', 'Error. Please try after sometime.');
                }
            }
        });
    },

    //Print selected invoice
    printReport: function (grid, rowIndex, colIndex) {
        var Invoice_Number = grid.getStore().getAt(rowIndex).data.invoiceID;
        var report_url = "http://localhost/ReportServer/Pages/ReportViewer.aspx?%2fApteanSalesReport%2fInvoiceReport&rs:Command=Render&Invoice_Number=" + Invoice_Number;
        window.open(report_url, '_blank');
    }

});