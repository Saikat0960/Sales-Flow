Ext.define('ApteanSalesFlowPackage.view.LoadQuote.LoadQuoteController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.loadquote',

    //Loading all quote data to grid
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

    //Firing event to add quote data
    onSelectQuote: function (gridpanel, record, item, e) {
        var me = this;
        var view = me.getView();
        me.fireEvent('quoteselection', record);
        view.destroy();
    }
});