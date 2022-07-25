Ext.define('ApteanSalesFlowPackage.view.Dashboard.DashboardController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.dashboard',

    //Fetches all module statistical data
    init: function(){
        Ext.Ajax.request({
            url: 'http://localhost:50619/api/Dashboard/GetApprovedData',
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
                    vm.set('completedata',resp);
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

    //To show data on hovering over pie
    onPieRender:  function (tooltip, storeItem, item) {
        tooltip.setHtml(storeItem.data.name + ":" + storeItem.data.value);
    },
    
    //To show data on hovering over graph
    onGraphRender: function (tooltip, storeItem, item) {
        tooltip.setHtml(storeItem.data.total_Value);
    },

    //Redirecting to search customer
    onProspectClick: function(){
        this.fireEvent('showCustomer');
    },

    //Redirecting to search quote
    onQuoteClick: function(){
        this.fireEvent('showQuote');
    },

    //Redirecting to search sales order
    onSalesOrderClick: function(){
        this.fireEvent('showSalesOrder');
    },

    //Redirecting to search shipment
    onShipmentClick: function(){
        this.fireEvent('showShipment');
    }
});