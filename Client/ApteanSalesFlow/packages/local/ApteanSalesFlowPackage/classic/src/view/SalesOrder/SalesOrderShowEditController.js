Ext.define('ApteanSalesFlowPackage.view.SalesOrder.SalesOrderShowEditController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.showeditsalesorder',
    listen: {
        controller: {
            '*': {
                taxSelection: 'onTaxSelect',
                addNewItem: 'addSOItem'
            }
        }
    },

    //Loading selected sales order and sales order items data to show/edit window
    loadingRecord: function (window) {
        var me = this;
        var view = me.getView();
        var SO_Number = view.record.get('sO_Number');
        ABP.util.Ajax.request({
            url: 'http://localhost:50619/api/SalesOrder/GetSales_Order/' + SO_Number,
            method: 'GET',
            useDefaultXhrHeader: false,
            withCredentials: true,
            disableCaching: false,
            waitMsg: 'Loading..',
            success: function (response) {
                var vm = view.down('#salesOrderDetails').getViewModel()
                var resp = Ext.decode(response.responseText, true);
                resp.date_Requested = resp.date_Requested.substring(0, 10);
                resp.date_Required = resp.date_Required.substring(0, 10);
                vm.set('salesOrder', resp);
                vm.set('customer', resp.customer1);
                vm.set('salesPerson', resp.sales_Person1);
                vm.set('tax', resp.tax1);
                taxCountryId = resp.customer1.billing_Country_Id;
                ABP.util.Ajax.request({
                    url: 'http://localhost:50619/api/SOItems/GetSO_Items/' + SO_Number,
                    method: 'GET',
                    useDefaultXhrHeader: false,
                    withCredentials: true,
                    disableCaching: false,
                    waitMsg: 'Loading..',
                    success: function (response) {
                        var resp = Ext.decode(response.responseText, true);
                        vm.storeInfo['_items'].loadData(resp);
                        vm.set('total_Amount', vm.storeInfo['_items'].sum('total'));
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

    //Updating sales order data and saving to database
    onUpdateData: function () {
        var me = this;
        var window = me.getView();
        var form = window.down('#salesOrderDetails');
        var vm = form.getViewModel();
        vm.set('total_Amount', vm.storeInfo['_items'].sum('total'));
        var salesOrder = vm.data.salesOrder;
        var tax = vm.get('tax');
        
        delete salesOrder.company;
        delete salesOrder.country;
        delete salesOrder.sales_Person1;
        delete salesOrder.customer1;
        delete salesOrder.quote;
        delete salesOrder.sO_Items;
        delete salesOrder.shipments;
        delete salesOrder.tax1;

        salesOrder.total_Value = vm.get('total_Amount');
        salesOrder.tax = tax.id;
        var items = window.down('grid').getStore().getData().items;
        var SO_Items = [];
        for (var i = 0; i < items.length; i++) {
            var temp = {};
            temp.quantity = items[i].data.quantity;
            temp.part_Id = items[i].data.part_Id;
            temp.price = items[i].data.price;
            temp.sO_Id = salesOrder.sO_Number;
            if (items[i].data.Id) {
                temp.id = items[i].data.Id;
            } else {
                temp.id = 0;
            }
            SO_Items.push(temp);
        }
        var data = {
            sales_Order: salesOrder,
            items: SO_Items
        }
        if (form.isValid()) {
            ABP.util.Ajax.request({
                url: 'http://localhost:50619/api/SalesOrder/PutSales_Order/' + salesOrder.sO_Number,
                method: 'PUT',
                jsonData: data,
                useDefaultXhrHeader: false,
                withCredentials: true,
                disableCaching: false,
                waitMsg: 'Updating..',
                success: function (form, action) {
                    Ext.Msg.show({
                        title: 'Successful',
                        width: 300,
                        height: 140,
                        message: 'Sales Order data updated successfully',
                        buttons: Ext.Msg.OK,
                        iconCls: 'icon-action'
                    });
                    me.fireEvent('salesOrderStatusUpdation');
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
        var vm = view.down('#salesOrderDetails').getViewModel();
        vm.set('total_Amount', vm.storeInfo['_items'].sum('total'));
    },

    //Creating add item window
    onAddClick: function () {
        Ext.create('ApteanSalesFlowPackage.view.AddItem.AddItemWindowView');
    },

    //Adding item data to sales order item grid
    addSOItem: function (record) {
        var me = this;
        var view = me.getView();
        var vm = view.down('#salesOrderDetails').getViewModel();
        vm.storeInfo['_items'].loadData([record], true);
        vm.set('total_Amount', vm.storeInfo['_items'].sum('total'));
    },

    //Creating load tax window to edit tax data
    onTaxLoad: function (sender, record) {
        Ext.create('ApteanSalesFlowPackage.view.Tax.LoadTax')
    },

    //Updating selected tax data
    onTaxSelect: function (record) {
        var me = this;
        var v = me.getView();
        var vm = v.down('#salesOrderDetails').getViewModel();
        vm.set('tax', record.data);
    },

    //Updating total value on editing quantity of item
    onQuantityEdit: async function (f, e) {
        await (2000);
        if (e.getKey() == e.ENTER) {
            var v = this.getView();
            var vm = v.down('#salesOrderDetails').getViewModel();
            vm.set('total_Amount', vm.storeInfo['_items'].sum('total'));
        }
    },
});