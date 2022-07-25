/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 */
Ext.define('ApteanSalesFlowPackage.view.SalesOrder.SalesOrderController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.salesorder',

    requires: [
        'ApteanSalesFlowPackage.view.LoadQuote.LoadQuote',
        'ApteanSalesFlowPackage.view.LoadQuote.LoadQuoteController'
    ],

    listen: {
        controller: {
            '*': {
                itemselection: 'onItemSelect',
                customerselection: 'onCustomerSelect',
                quoteselection: 'onQuoteSelect',
                taxSelection: 'onTaxSelect'
            }
        }
    },

    //Loads the selected item in to item form
    onItemSelect: function (record) {
        var v = this.getView();
        var form = v.down('#item-form').getForm();
        form.loadRecord(record);
    },

    //Checking the customer is valid or not for creating sales order
    checkCustomer: function (customer) {
        var status;
        return new Ext.Promise((resolve, reject) => {
            if (customer.status !== 'PROSPECT') {
                resolve(true);
                return;
            }
            Ext.Msg.show({
                title: 'Status',
                message: "Can't create sales order for prospect.<br />Would you like to change the status to confirmed?",
                buttons: Ext.MessageBox.YESNOCANCEL,
                icon: Ext.MessageBox.QUESTION,
                scope: this,
                fn: function (btn) {
                    if (btn == 'yes') {
                        customer.status = 'CONFIRMED';
                        Ext.Ajax.request({
                            url: 'http://localhost:50619/api/Customers/PutCustomer/' + customer.id,
                            headers:
                            {
                                'Content-Type': 'application/json'
                            },
                            method: 'PUT',
                            useDefaultXhrHeader: false,
                            withCredentials: true,
                            disableCaching: false,
                            jsonData: customer,
                            scope: this,
                            waitMsg: 'Updating..',
                            success: function (response) {
                                resolve(true);
                            },
                            failure: function (resp, opts) {
                                if (resp.status == 401) {
                                    this.redirectTo('Logout');
                                }
                                else {
                                    resolve(false);
                                    Ext.Msg.show({
                                        title: 'Failed',
                                        message: 'Failed while updating customer. Try after sometime.',
                                        buttons: Ext.Msg.OK,
                                        iconCls: 'icon-error'
                                    });
                                }
                            }
                        });
                    }
                    else {
                        resolve(false);
                        return;
                    }
                },
            });
        })
    },

    //Fetches the customer data and set it to viewmodels
    onCustomerSelect: function (customer) {
        customerId = customer.id;
        Ext.Ajax.request({
            url: 'http://localhost:50619/api/Customers/GetCustomer/' + customerId,
            headers:
            {
                'Content-Type': 'application/json'
            },
            useDefaultXhrHeader: false,
            withCredentials: true,
            disableCaching: false,
            method: 'GET',
            scope: this,
            waitMsg: 'Loading..',
            success: function (response) {
                var resp = Ext.decode(response.responseText, true);
                this.checkCustomer(resp).then(validUser => {
                    if (validUser) {
                        var me = this;
                        var v = me.getView();
                        var vm = v.getViewModel();
                        var resp = Ext.decode(response.responseText, true);
                        vm.set('customers', resp);
                        vm.set('quotes', null);
                        vm.set('address', resp);
                        vm.set('tax', resp.tax1);
                        vm.set('totalAmount', 0);
                        vm.storeInfo['_items'].removeAll();
                        taxCountryId = resp.billing_Country_Id;
                    }
                })
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
                        iconCls: 'icon-error',
                        icon: Ext.MessageBox.ERROR
                    });
                }
            }
        });
    },

    //Fetches the quote and quote items data and set it to viewmodels
    onQuoteSelect: function (quote) {
        if (quote.data.status == 'STARTED') {
            Ext.Msg.show({
                title: 'Status',
                message: 'Quote is not approved yet',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO
            });
        }
        else {
            quoteNumber = quote.data.quote_Number;
            Ext.Ajax.request({
                url: 'http://localhost:50619/api/Quotes/GetQuote/' + quoteNumber,
                headers:
                {
                    'Content-Type': 'application/json'
                },
                useDefaultXhrHeader: false,
                withCredentials: true,
                disableCaching: false,
                method: 'GET',
                scope: this,
                waitMsg: 'Loading..',
                success: function (response) {
                    var resp = Ext.decode(response.responseText, true);
                    this.checkCustomer(resp.customer1).then(validUser => {
                        if (validUser) {
                            var me = this;
                            var v = me.getView();
                            var vm = v.getViewModel();
                            resp.date_Requested = resp.date_Requested.substring(0, 10);
                            resp.date_Required = resp.date_Required.substring(0, 10);
                            vm.set('quotes', resp);
                            vm.set('address', resp);
                            vm.set('tax', resp.customer1.tax1);
                            vm.set('customers', resp.customer1);
                            taxCountryId = resp.customer1.billing_Country_Id;
                            Ext.Ajax.request({
                                url: 'http://localhost:50619/api/QuoteItems/GetQuote_Items/' + quoteNumber,
                                method: 'GET',
                                useDefaultXhrHeader: false,
                                withCredentials: true,
                                disableCaching: false,
                                waitMsg: 'Loading..',
                                success: function (response) {
                                    var resp = Ext.decode(response.responseText, true);
                                    vm.storeInfo['_items'].loadData(resp);
                                    vm.set('totalAmount', vm.storeInfo['_items'].sum('total'))
                                },
                                failure: function (resp) {
                                    if (resp.status == 401) {
                                        this.redirectTo('Logout');
                                    }
                                    else {
                                        Ext.Msg.show({
                                            title: 'Error',
                                            message: 'Error while loading data. Try after sometime.',
                                            buttons: Ext.Msg.OK,
                                            iconCls: 'icon-error',
                                            icon: Ext.MessageBox.ERROR
                                        });
                                    }
                                }
                            });
                        }
                    })
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
                            iconCls: 'icon-error',
                            icon: Ext.MessageBox.ERROR
                        });
                    }
                }
            });
        }
    },

    //Loads the selected tax data to form
    onTaxSelect: function (record) {
        var me = this;
        var v = me.getView();
        var vm = v.getViewModel();
        vm.set('tax', record.data);
    },

    //Adding item data to itemlist grid
    onItemAddButton: function (sender, record) {
        var v = this.getView();
        var form = v.down('#item-form').getForm();
        var values = form.getValues();
        var vm = v.getViewModel();
        if (form.isValid()) {
            if (values.quantity > 0 && values.price > 0 && values.part_Id > 0) {
                vm.storeInfo['_items'].loadData([values], true);
                vm.set('totalAmount', vm.storeInfo['_items'].sum('total'));
                form.reset();
            }
            else {
                Ext.Msg.show({
                    title: 'Invalid',
                    message: 'Please fill valid details',
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.WARNING
                });
            }
        }
        else {
            Ext.Msg.show({
                title: 'Invalid',
                message: 'Please fill all the required fields',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.WARNING
            });
        }
    },

    //Displays the load item window to add items
    onItemLoadButton: function (sender, record) {
        Ext.create('ApteanSalesFlowPackage.view.LoadAllItems.LoadAllItems');
    },

    //Displays the load customer window
    onCustomerLoadButton: function (sender, record) {
        Ext.create('ApteanSalesFlowPackage.view.LoadAllCustomers.LoadAllCustomers');
    },

    //Displays the load quote window
    onQuoteLoadButton: function (sender, record) {
        Ext.create('ApteanSalesFlowPackage.view.LoadQuote.LoadQuote')
    },

    //Displays the load tax window
    onTaxLoad: function (sender, record) {
        Ext.create('ApteanSalesFlowPackage.view.Tax.LoadTax')
    },

    //reset the create sales order form
    onSalesOrderResetButton: function (sender, record) {
        var me = this;
        var v = me.getView();
        var vm = v.getViewModel();
        var form = v.getForm();
        form.reset();
        vm.set('quotes', null);
        vm.set('address', null);
        vm.set('tax', null);
        vm.set('customers', null);
        vm.set('salesOrder', null);
        vm.set('totalAmount', 0);
        vm.storeInfo['_items'].removeAll();
    },

    //Deleting item data directly from item grid
    onItemDelete: function (grid, rowIndex, colIndex) {
        var rec = grid.getStore().getAt(rowIndex);
        grid.getStore().remove(rec);
        var v = this.getView();
        var vm = v.lookupViewModel();
        vm.set('totalAmount', vm.storeInfo['_items'].sum('total'));
    },

    //Updating total amount after editing data in grid
    onQuantityEdit: async function (f, e) {
        await (2000);
        if (e.getKey() == e.ENTER) {
            var v = this.getView();
            var vm = v.lookupViewModel();
            vm.set('totalAmount', vm.storeInfo['_items'].sum('total'));
        }
    },

    //Submit sales order details and stores it in database
    onSalesOrderSubmitButton: function (sender, record) {
        var me = this;
        var v = me.getView();
        var vm = v.lookupViewModel();
        var customers = vm.get('customers');
        var quotes = vm.get('quotes');
        var address = vm.get('address');
        var tax = vm.get('tax');
        var salesOrder = vm.get('salesOrder');
        vm.set('totalAmount', vm.storeInfo['_items'].sum('total'))
        var totalValue = vm.get('totalAmount');

        //Creating sales order object
        let SalesOrder = {
            "company_Id": 1,
            "date_Required": quotes.date_Required,
            "date_Requested": quotes.date_Requested,
            "shipping_Address": address.shipping_Address,
            "customer": customers.id,
            "status": 'STARTED',
            "pO_Number": salesOrder.pO_Number,
            "tax": tax.id,
            "total_Value": totalValue,
            "sales_Person": customers.sales_Person.id,
            "quote_Number": quotes.quote_Number,
            "shipping_Country_Id": address.shipping_Country_Id,
            "shipping_City": address.shipping_City,
            "shipping_State": address.shipping_State,
            "shipping_ZipCode": address.shipping_ZipCode,
            "shipped": 0
        };

        var grid = v.down('#tab').down('#itemDetails').down('#itemGrid');
        var store = grid.getStore();
        var items = store.getData().items;

        //Creating sales order items object
        var SO_Items = [];
        for (var i = 0; i < items.length; i++) {
            var temp = {};
            temp.quantity = items[i].data.quantity;
            temp.part_Id = items[i].data.part_Id;
            temp.price = items[i].data.price;
            temp.sO_Id = 0;
            SO_Items.push(temp);
        };

        //Creating custom viewmodel to send sales order and sales order items object simultaneously
        var data = {
            sales_Order: SalesOrder,
            items: SO_Items
        };

        Ext.Ajax.request({
            url: 'http://localhost:50619/api/SalesOrder/PostSales_Order',
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
                var sO_Number = JSON.parse(response.responseText);
                Ext.Msg.show({
                    title: 'Sales Order created succesfully',
                    message: 'For your reference, the Sales Order Number is: ' + sO_Number,
                    buttons: Ext.Msg.OK,
                    iconCls: 'icon-action',
                    icon: Ext.MessageBox.INFO
                });
                var form = v.getForm();
                form.reset();
                vm.set('quotes', null);
                vm.set('address', null);
                vm.set('tax', null);
                vm.set('customers', null);
                vm.set('salesOrder', null);
                vm.set('totalAmount', 0);
                vm.storeInfo['_items'].removeAll();
            },
            failure: function (response) {
                if (response.status == 401) {
                    this.redirectTo('Logout');
                }
                else {
                    Ext.Msg.show({
                        title: 'Failed',
                        message: 'Failed while saving data. Try after sometime.',
                        buttons: Ext.Msg.OK,
                        iconCls: 'icon-error',
                        icon: Ext.MessageBox.ERROR
                    });
                }
            }
        })
    }
});