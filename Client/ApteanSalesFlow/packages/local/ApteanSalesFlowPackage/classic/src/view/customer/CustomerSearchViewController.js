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

    //fetches the customers details and displays it in a grid
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
                    if (resp.length) {
                        v.getStore().loadData(resp);
                    }
                    else {
                        Ext.MessageBox.confirm('Not Available', 'No data available to show. Do you want to create customer?', confirmFunction);

                        function confirmFunction(btn) {
                            if (btn == 'yes') {
                                me.fireEvent('createCustomer');
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

    //displays the customer show/edit window
    showEditWindow: function(grid, rowIndex, colIndex) {
        var rec = grid.getStore().getAt(rowIndex);
        Ext.create('ApteanSalesFlowPackage.view.customer.CustomerShowEditWindowView',{
            record:rec
        }).show();
    }
});