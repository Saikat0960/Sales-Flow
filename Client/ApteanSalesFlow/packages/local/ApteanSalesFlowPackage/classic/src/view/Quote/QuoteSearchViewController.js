Ext.define('ApteanSalesFlowPackage.view.Quote.QuoteSearchViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.quotesearchview',
    listen: {
        controller: {
            '*': {
                quoteStatusUpdation: 'init'
            }
        }
    },

    //Fetches all the quotes and displays it in a grid
    init: function(){
        Ext.Ajax.request({
            url: 'http://localhost:50619/api/Quotes/GetQuotes',
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
                        Ext.MessageBox.confirm('Not Available', 'No data available to show. Do you want to create quote?', confirmFunction);

                        function confirmFunction(btn) {
                            if (btn == 'yes') {
                                me.fireEvent('createQuote');
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

    //Displays the quote show/edit window
    showDetailsWindow: function (grid, rowIndex, colIndex) {
        var rec = grid.getStore().getAt(rowIndex);
        Ext.create('ApteanSalesFlowPackage.view.Quote.QuoteShowEditWindowView', {
            record: rec
        }).show();
    },

    //Printing quote report
    printReport: function (grid, rowIndex, colIndex) {
        var rec = grid.getStore().getAt(rowIndex);
        if (rec.data.status == "STARTED") {
            Ext.Msg.show({
                title: 'Access Denied',
                message: 'Quote is not approved yet.You can show/edit details.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.WARNING
            });
        }
        else {
            var Quote_Number = grid.getStore().getAt(rowIndex).data.quote_Number;
            var report_url = "http://localhost/ReportServer/Pages/ReportViewer.aspx?%2fApteanSalesReport%2fQuoteReport&rs:Command=Render&Quote_Number=" + Quote_Number;
            window.open(report_url, '_blank');
        }
    }
});