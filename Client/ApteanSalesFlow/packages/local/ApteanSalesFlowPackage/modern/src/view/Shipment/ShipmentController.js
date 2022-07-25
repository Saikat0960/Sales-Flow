Ext.define('ApteanSalesFlowPackage.view.Shipment.ShipmentController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.shipment',

    requires: [
        'ApteanSalesFlowPackage.view.LoadSalesOrder.LoadSalesOrder',
        'ApteanSalesFlowPackage.view.LoadSalesOrder.LoadSalesOrderController'
    ],

    listen: {
        controller: {
            '*': {
                salesOrderselection: 'onSalesOrderSelect',
            }
        }
    },

    onSalesOrderSelect: function (salesorder) {
        if (salesorder.data.status == 'STARTED') {
            Ext.Msg.show({
                title: 'Status',
                message: 'Sales Order is not approved yet',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO
            });
        }
        else {
            if (salesorder.data.shipped != 0) {
                Ext.Msg.show({
                    title: 'Status',
                    message: 'Shipment is already created for this Sales Order',
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR
                });
            }
            else {
                SO_Number = salesorder.data.sO_Number;
                Ext.Ajax.request({
                    url: 'http://localhost:50619/api/SalesOrder/GetSales_Order/' + SO_Number,
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
                            vm.set('salesOrder', resp);
                            Ext.Ajax.request({
                                url: 'http://localhost:50619/api/SOItems/GetSO_Items/' + SO_Number,
                                method: 'GET',
                                useDefaultXhrHeader: false,
                                withCredentials: true,
                                disableCaching: false,
                                waitMsg: 'Loading..',
                                success: function (response) {
                                    var resp = Ext.decode(response.responseText, true);
                                    var store = new ApteanSalesFlowPackage.store.ItemList();
                                    store.loadData(resp);
                                    var grid = v.down('#tab').down('#itemDetails').down('#itemGrid');
                                    grid.setStore(store);
                                },
                                failure: function (response) {
                                    if (response.status == 401) {
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
            }
        }
    },

    onShipmentResetButton: function (sender, record) {
        var form = this.getView();
        var vm = form.lookupViewModel();
        vm.set('salesOrder', null);
        vm.set('shipment', null);
        var grid = v.down('#tab').down('#itemDetails').down('#itemGrid');
        var store = grid.getStore();
        store.removeAll();
    },

    onShipmentSubmitButton: function (sender, record) {
        var me = this;
        var v = me.getView();
        var vm = v.lookupViewModel();
        var salesOrder = vm.get('salesOrder');
        var shipment = vm.get('shipment');
        let Shipment = {
            "sO_Number": salesOrder.sO_Number,
            "date": shipment.date,
            "shipping_Address": salesOrder.shipping_Address,
            "tracking_Number": shipment.tracking_No,
            "customer": salesOrder.customer,
            "remark": shipment.remark,
            "shipping_City": salesOrder.shipping_City,
            "shipping_State": salesOrder.shipping_State,
            "shipping_Country_Id": salesOrder.shipping_Country_Id,
            "shipping_Zipcode": salesOrder.shipping_ZipCode,
            "status": shipment.status,
            "invoiced": 0
        };
        Ext.Ajax.request(
            {
                url: 'http://localhost:50619//api/Shipments/PostShipment/',
                method: 'POST',
                headers:
                {
                    'Content-Type': 'application/json'
                },
                jsonData: Shipment,
                useDefaultXhrHeader: false,
                withCredentials: true,
                disableCaching: false,
                waitMsg: 'Saving..',
                success: function (response) {
                    var Shipment_No = JSON.parse(response.responseText);
                    Ext.Msg.show({
                        title: 'Sales Order created succesfully',
                        message: 'For your reference, the Shipment Number is: ' + Shipment_No,
                        buttons: Ext.Msg.OK,
                        iconCls: 'icon-action'
                    });
                    vm.set('salesOrder', null);
                    vm.set('shipment', null);
                    var grid = v.down('#tab').down('#itemDetails').down('#itemGrid');
                    var store = grid.getStore();
                    store.removeAll();
                    //this.onShipmentResetButton();
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
                            iconCls: 'icon-error'
                        });
                    }
                }
            })
    },


    onSalesOrderLoadButton: function (sender, record) {
        Ext.create('ApteanSalesFlowPackage.view.LoadSalesOrder.LoadSalesOrder');
    },
});