Ext.define('ApteanSalesFlowPackage.view.SalesPerson.SalesPersonController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.SalesPerson',

    init: function(){
        Ext.Ajax.request({
            url: 'http://localhost:50619/api/SalesPerson',
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
                    debugger
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

    onSelectSalesPerson: function (gridpanel, record, item, e) {
        var me = this;
        var view = me.getView();
        me.fireEvent('salesPersonSelection', record);
        view.destroy();
    }
});