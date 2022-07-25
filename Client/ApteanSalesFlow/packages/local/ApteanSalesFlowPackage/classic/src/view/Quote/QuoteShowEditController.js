Ext.define('ApteanSalesFlowPackage.view.Quote.QuoteShowEditController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.showquote',

    listen: {
        controller: {
            '*': {
                addNewItem: 'addQuoteItem'
            }
        }
    },

    //Loading selected quote and quote items data to show/edit window
    loadingRecord: function (window) {
        var me = this;
        var view = me.getView();
        var quoteId = view.record.get('quote_Number');
        ABP.util.Ajax.request({
            url: 'http://localhost:50619/api/Quotes/GetQuote/' + quoteId,
            method: 'GET',
            useDefaultXhrHeader: false,
            withCredentials: true,
            disableCaching: false,
            waitMsg: 'Loading..',
            success: function (response) {
                var vm = view.down('#quoteDetails').getViewModel()
                var resp = Ext.decode(response.responseText, true);
                resp.date_Requested = resp.date_Requested.substring(0, 10);
                resp.date_Required = resp.date_Required.substring(0, 10);
                vm.set('quote', resp);
                vm.set('salesPerson', view.record.get('sales_Person'))

                ABP.util.Ajax.request({
                    url: 'http://localhost:50619/api/QuoteItems/GetQuote_Items/' + quoteId,
                    method: 'GET',
                    useDefaultXhrHeader: false,
                    withCredentials: true,
                    disableCaching: false,
                    waitMsg: 'Loading..',
                    success: function (response) {
                        var resp = Ext.decode(response.responseText, true);
                        vm.storeInfo['_items'].loadData(resp);
                        vm.set('totalAmount', vm.storeInfo['_items'].sum('total'));
                    },
                    failure: function (response) {
                        if (response.status == 401) {
                            window.close();
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
            failure: function (response) {
                if (response.status == 401) {
                    window.close();
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

    //Updating quote data and saving to database
    onUpdateData: function () {
        var me = this;
        var window = me.getView();
        var form = window.down('#quoteDetails');
        var vm = form.getViewModel();
        vm.set('totalAmount', vm.storeInfo['_items'].sum('total'));
        var quote = vm.data.quote;
        delete quote.company;
        delete quote.country;
        delete quote.sales_Person1;
        delete quote.customer1;
        delete quote.sales_Order;
        delete quote.quote_Items;

        quote.total_Value = vm.get('totalAmount');
        var items = vm.storeInfo['_items'].getData().items;
        var quote_Items = [];
        for (var i = 0; i < items.length; i++) {
            var temp = {};
            temp.quantity = items[i].data.quantity;
            temp.part_Id = items[i].data.part_Id;
            temp.price = items[i].data.price;
            temp.quote_Id = quote.quote_Number;
            if (items[i].data.Id) {
                temp.id = items[i].data.Id;
            } else {
                temp.id = 0;
            }

            quote_Items.push(temp);
        }
        var data = {
            quote: quote,
            items: quote_Items
        }
        if (form.isValid()) {
            ABP.util.Ajax.request({
                url: 'http://localhost:50619/api/Quotes/PutQuote/' + quote.quote_Number,
                method: 'PUT',
                useDefaultXhrHeader: false,
                withCredentials: true,
                disableCaching: false,
                jsonData: data,
                waitMsg: 'Updating..',
                success: function (form, action) {
                    Ext.Msg.show({
                        title: 'Successful',
                        width: 300,
                        height: 140,
                        message: 'Quote data updated successfully',
                        buttons: Ext.Msg.OK,
                        iconCls: 'icon-action'
                    });
                    me.fireEvent('quoteStatusUpdation');
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
                            message: 'Failed while updating data. Try after sometime.',
                            buttons: Ext.Msg.OK,
                            iconCls: 'icon-error',
                            icon: Ext.MessageBox.ERROR
                        });
                    }
                }
            });
        }
        else {
            Ext.Msg.show({
                title: 'Invalid',
                message: 'Please fill valid details.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.WARNING
            });
        }
    },

    //Removing item from grid 
    onRemoveClick: function (view, recIndex, cellIndex, item, e, record) {
        record.drop();
        var me = this;
        var view = me.getView();
        var vm = view.down('#quoteDetails').getViewModel();
        vm.set('totalAmount', vm.storeInfo['_items'].sum('total'));
    },

    //Creating add item window
    onAddClick: function () {
        Ext.create('ApteanSalesFlowPackage.view.AddItem.AddItemWindowView');
    },

    //Adding item data to quote item grid
    addQuoteItem: function (record) {
        var me = this;
        var view = me.getView();
        var vm = view.down('#quoteDetails').getViewModel();
        vm.storeInfo['_items'].loadData([record], true);
        vm.set('totalAmount', vm.storeInfo['_items'].sum('total'));
    },

    //Updating total value on editing quantity of item
    onQuantityEdit: async function (f, e) {
        await (2000);
        if (e.getKey() == e.ENTER) {
            var v = this.getView();
            var vm = v.down('#quoteDetails').getViewModel();
            vm.set('totalAmount', vm.storeInfo['_items'].sum('total'));
        }
    },
});