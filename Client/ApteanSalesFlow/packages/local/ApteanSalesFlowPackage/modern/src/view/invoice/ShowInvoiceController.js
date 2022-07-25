Ext.define('ApteanSalesFlowPackage.view.invoice.ShowInvoiceController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.showinvoice',

    loadingRecord: function (window) {
        var invoiceID = window.record.data.invoiceID;
        Ext.Ajax.request({
            url: 'http://localhost:50619/api/ARInvoices/GetAR_Invoice/' + invoiceID,
            useDefaultXhrHeader: false,
            withCredentials: true,
            disableCaching: false,
            method: 'GET',
            scope: this,
            success: function (response) {
                if (response) {
                    var me = this;
                    var v = me.getView().down('#showInvoice');
                    var vm = v.getViewModel();
                    var resp = Ext.decode(response.responseText, true);
                    vm.set('invoice', resp);
                }
            },
            failure: function (resp, opts) {
            }
        });
    }
});
