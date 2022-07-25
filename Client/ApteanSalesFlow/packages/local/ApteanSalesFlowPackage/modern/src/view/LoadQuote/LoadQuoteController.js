Ext.define('ApteanSalesFlowPackage.view.LoadQuote.LoadQuoteController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.loadquote',

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

    onSelectQuote: function (gridpanel, record, item, e) {
        debugger
        var me = this;
        var view = me.getView();
        //var quoteNumber = record.get("quote_Number");
        me.fireEvent('quoteselection', record);
        view.destroy();
    }
});