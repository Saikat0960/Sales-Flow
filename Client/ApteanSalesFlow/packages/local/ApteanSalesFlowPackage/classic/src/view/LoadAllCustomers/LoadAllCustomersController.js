/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 */
Ext.define('ApteanSalesFlowPackage.view.LoadAllCustomers.LoadAllCustomersController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.loadallcustomers',

    //Loading all customer data to grid
    init: function(){
        Ext.Ajax.request({
            url: 'http://localhost:50619/api/Customers/GetCustomers',
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

    //Firing event to add customer data
    onSelectCustomer: function (gridpanel, record, item, e) {
        var me = this;
        var view = me.getView();
        me.fireEvent('customerselection', record);
        view.destroy();
    }
});