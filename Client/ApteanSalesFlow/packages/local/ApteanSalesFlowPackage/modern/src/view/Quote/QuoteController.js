Ext.define('ApteanSalesFlowPackage.view.Quote.QuoteController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.quote',

    listen: {
        controller: {
            '*': {
                customerselection: 'onCustomerSelect',
                itemselection: 'onItemSelect'
            }
        }
    },

    onCustomerSelect: function (customer) {
        debugger;
        customerId = customer.id;
        Ext.Ajax.request({
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
                    var v = me.getView();
                    var vm = v.getViewModel();
                    var resp = Ext.decode(response.responseText, true);
                    vm.set('customers', resp);

                }
            },
            failure: function (resp, opts) {
                if (resp.status == 401) {
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

    onItemSelect: function (record) {
        var v = this.getView();
        var form = v.down('#item-form').getForm();
        form.loadRecord(record);
    },

    onItemLoadButton: function (sender, record) {
        Ext.create('ApteanSalesFlowPackage.view.LoadAllItems.LoadAllItems');
    },

    onQuoteResetButton: function (sender, record) {
        debugger
        var v = this.getView();
        var vm = v.lookupViewModel();
        var form = v.down('#item-form').getForm();
        form.reset();
        vm.set('customers', null);
        vm.set('quote', null);
        vm.set('totalAmount', 0);
        vm.storeInfo['_items'].removeAll();
    },

    onQuoteSubmitButton: function (sender, record) {
        //var form = this.getView().getForm();
        var me = this;
        var v = me.getView();
        var vm = v.lookupViewModel();
        var customers = vm.get('customers');
        var quote = vm.get('quote');
        vm.set('totalAmount', vm.storeInfo['_items'].sum('total'));
        var totalAmount = vm.get('totalAmount');

        let Quote = {
            "companyId": 1,
            "date_Required": quote.date_Required,
            "date_Requested": quote.date_Requested,
            "shipping_Address": customers.shipping_Address,
            "customer": customers.id,
            "status": quote.status,
            "total_Value": totalAmount,
            "sales_Person": customers.sales_Person.id,
            "shipping_City": customers.shipping_City,
            "shipping_State": customers.shipping_State,
            "shipping_Country_Id": customers.shipping_Country_Id,
            "shipping_ZipCode": customers.shipping_ZipCode
        };

        var items = vm.storeInfo['_items'].getData().items;
        debugger

        var Quote_Items = [];
        for (var i = 0; i < items.length; i++) {
            var temp = {};
            temp.quantity = items[i].data.quantity;
            temp.part_Id = items[i].data.part_Id;
            temp.price = items[i].data.price;
            temp.quote_Id = 0;
            Quote_Items.push(temp);
        };

        var data = {
            quote: Quote,
            items: Quote_Items
        };

        Ext.Ajax.request({
            url: 'http://localhost:50619/api/Quotes/PostQuote',
            method: 'POST',
            headers:
            {
                'Content-Type': 'application/json'
            },
            jsonData: data,
            useDefaultXhrHeader: false,
            withCredentials: true,
            disableCaching: false,
            waitMsg: 'Saving..',
            success: function (response) {
                var quote_Number = JSON.parse(response.responseText);
                Ext.Msg.show({
                    title: 'Sales Order created succesfully',
                    message: 'For your reference, the Quote Number is: ' + quote_Number,
                    buttons: Ext.Msg.OK,
                    iconCls: 'icon-action'
                });
                var form = v.down('#item-form').getForm();
                form.reset();
                vm.set('customers', null);
                vm.set('quote', null);
                vm.set('totalAmount', 0);
                vm.storeInfo['_items'].removeAll();
                //this.onQuoteResetButton();
            },
            failure: function (response) {
                if (response.status == 401) {
                    this.redirectTo('Logout');
                }
                else {
                    Ext.Msg.show({
                        title: 'Failed',
                        message: 'Failed while saving Data. Try after sometime.',
                        buttons: Ext.Msg.OK,
                        iconCls: 'icon-error'
                    });
                }
            }
        })
    },

    onItemAddButton: function (sender, record) {
        var v = this.getView();
        var form = v.down('#item-form').getForm();
        var values = form.getValues();
        var vm = v.lookupViewModel();
        // load data dynamically.
        // store.load({
        //     scope: this,
        //     callback: function (records, operation, success) {
        //         // the operation object
        //         // contains all of the details of the load operation
        //         console.log(records);
        //     }
        // })
        if (form.isValid()) {
            if (values.quantity > 0 && values.price > 0 && values.part_Id > 0) {
                vm.storeInfo['_items'].loadData([values], true);
                vm.set('totalAmount', vm.storeInfo['_items'].sum('total'));
                form.reset();
            }
            else {
                Ext.Msg.show({
                    title: 'ERROR',
                    message: 'Please fill valid details',
                    buttons: Ext.Msg.OK,
                    iconCls: 'icon-error'
                });
            }
        }
        else {
            Ext.Msg.show({
                title: 'ERROR',
                message: 'Please fill all the required fields',
                buttons: Ext.Msg.OK,
                iconCls: 'icon-error'
            });
        }
    },

    onItemDelete: function (grid, rowIndex, colIndex) {
        var rec = grid.getStore().getAt(rowIndex);
        grid.getStore().remove(rec);
        var v = this.getView();
        var vm = v.lookupViewModel();
        vm.set('totalAmount', vm.storeInfo['_items'].sum('total'));
    },

    onQuantityEdit: async function (f, e) {
        await (2000);
        // var rec = f.getStore().getAt(rowIndex);
        if (e.getKey() == e.ENTER) {
            var v = this.getView();
            var vm = v.lookupViewModel();
            //var items = vm.storeInfo['_items'].getData().items;
            vm.set('totalAmount', vm.storeInfo['_items'].sum('total'));
        }
    },

    onCustomerLoadButton: function (sender, record) {
        Ext.create('ApteanSalesFlowPackage.view.LoadAllCustomers.LoadAllCustomers');
    }
});