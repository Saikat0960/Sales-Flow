Ext.define('ApteanSalesFlowPackage.view.customer.CustomerSearchViewController', {
    extend : 'Ext.app.ViewController',
    alias: 'controller.getcustomer',
    listen: {
        controller: {
            '*': {
                customerUpdation: 'init'
            }
        }
    },
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
    onItemUpdate: function() {
        var me = this;
        var grid = me.getView();
        grid.getStore().load();
    },
    showEditWindow: function(grid, rowIndex, colIndex) {
        var rec = grid.getStore().getAt(rowIndex);
        Ext.create('ApteanSalesFlowPackage.view.customer.CustomerShowEditWindowView',{
            record:rec
        }).show();
    }
});