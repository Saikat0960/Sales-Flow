Ext.define('ApteanSalesFlowPackage.view.Tax.TaxController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.Tax',

    //Loading all tax data to grid
    init: function(){
        Ext.Ajax.request({
            url: 'http://localhost:50619/api/Tax/'+ taxCountryId,
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
                    var vm = v.getViewModel();
                    vm.storeInfo['taxStore'].loadData(resp);
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

    //Firing event to add tax data
    onSelectTax: function (gridpanel, record, item, e) {
        var me = this;
        var view = me.getView();
        me.fireEvent('taxSelection', record);
        view.destroy();
    }
});