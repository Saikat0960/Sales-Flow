Ext.define('ApteanSalesFlowPackage.view.customer.CustomerShowEditController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.showedit',

    listen: {
        controller: {
            '*': {
                salesPersonSelection: 'onSelectSalesPerson',
                taxSelection: 'onSelectTax'
            }
        }
    },

    loadingRecord: function (window) {
        // here, you load window.record into the form!
        //if (window.record) window.down('#editUser').loadRecord(window.record);
        customerId = window.record.id;
        ABP.util.Ajax.request({
            url: 'http://localhost:50619/api/Customers/GetCustomer/' + customerId,
            useDefaultXhrHeader: false,
            withCredentials: true,
            disableCaching: false,
            method: 'GET',
            scope: this,
            waitMsg: 'Loading..',
            success: function (response) {
                if (response) {
                    var me = this;
                    var v = me.getView().down('#editUser');
                    var vm = v.getViewModel();
                    var resp = Ext.decode(response.responseText, true);
                    vm.set('customers', resp);
                    vm.set('tax', resp.tax1);
                    vm.set('salesperson', resp.sales_Person);
                }
            },
            failure: function (resp, opts) {
                if (resp.status == 401) {
                    window.close();
                    this.redirectTo('Logout');
                }
                else {
                    Ext.Msg.show({
                        title: 'Error',
                        message: 'Error while loading data. Try after sometime.',
                        buttons: Ext.Msg.OK,
                        iconCls: 'icon-error'
                    });
                }
            }
        });
    },

    onSelectTax: function (record) {
        var me = this;
        var v = me.getView().down('#editUser');
        var vm = v.getViewModel();
        vm.set('tax', record.data);
    },
    onSelectSalesPerson: function (record) {
        var me = this;
        var v = me.getView().down('#editUser');
        var vm = v.getViewModel();
        vm.set('salesperson', record.data);
    },

    onTaxLoad: function () {
        Ext.create('ApteanSalesFlowPackage.view.Tax.LoadTax');
    },
    onSalesPersonLoad: function () {
        Ext.create('ApteanSalesFlowPackage.view.SalesPerson.LoadSalesPerson');
    },

    onUpdateData: function () {
        var me = this;
        var window = me.getView()
        var form = window.down('#editUser');
        var vm = form.getViewModel();
        var customer = vm.get('customers');
        var tax = vm.get('tax');
        var salesPerson = vm.get('salesperson');

        customer.sales_Person_Id = salesPerson.id;
        customer.tax = tax.id;
        delete customer.sales_Person;
        delete customer.tax1;
        if (form.isValid()) { // make sure the form contains valid data before submitting
            ABP.util.Ajax.request({
                url: 'http://localhost:50619/api/Customers/PutCustomer/' + customer.id,
                useDefaultXhrHeader: false,
                withCredentials: true,
                disableCaching: false,
                method: 'PUT',
                jsonData: customer,
                waitMsg: 'Updating..',
                success: function (form, action) {
                    Ext.Msg.show({
                        title: 'Successful',
                        width: 300,
                        height: 140,
                        message: 'Customer data updated successfully',
                        buttons: Ext.Msg.OK,
                        iconCls: 'icon-action'
                    });
                    me.fireEvent('customerUpdation');
                    window.close();
                },
                failure: function (form, action) {
                    if (form.status == 401) {
                        window.close();
                        this.redirectTo('Logout');
                    }
                    else {
                        Ext.Msg.show({
                            title: 'Failed',
                            message: 'Failed while updating Data. Try after sometime.',
                            buttons: Ext.Msg.OK,
                            iconCls: 'icon-error'
                        });
                    }
                }

            });
        } else {
            Ext.Msg.alert('Invalid', 'Please fill valid details.')
        }
    }
});