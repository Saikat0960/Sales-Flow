Ext.define('ApteanSalesFlowPackage.view.invoice.InvoiceController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.invoice',
    listen: {
        controller: {
            '*': {
                onShipmentSelect: 'onShipmentLoad'
            }
        }
    },

    onShipmentLoad: function (shipment) {
        if (shipment.data.status == 'STARTED') {
            Ext.Msg.show({
                title: 'Status',
                message: 'Shipment is not approved yet',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO
            });
        }
        else {
            if (shipment.data.invoiced != 0) {
                Ext.Msg.show({
                    title: 'Status',
                    message: 'Invoice is already created for this shipment',
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR
                });
            }
            else {
                shipmentId = shipment.data.shipment_Number;
                Ext.Ajax.request({
                    url: 'http://localhost:50619/api/Shipments/GetShipment/' + shipmentId,
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
                            resp.sales_Order.date_Required = resp.sales_Order.date_Required.substring(0, 10);
                            vm.set('shipment', resp);
                            Ext.Ajax.request({
                                url: 'http://localhost:50619/api/SOItems/GetSO_Items/' + resp.sO_Number,
                                useDefaultXhrHeader: false,
                                withCredentials: true,
                                disableCaching: false,
                                method: 'GET',
                                waitMsg: 'Loading..',
                                success: function (response) {
                                    var resp = Ext.decode(response.responseText, true);
                                    var store = new ApteanSalesFlowPackage.store.ItemList();
                                    store.loadData(resp);
                                    var grid = v.down('#tab').down('#itemDetails').down('#itemGrid');
                                    grid.setStore(store);
                                },
                                failure: function (resp) {
                                    if (resp.status == 401) {
                                        this.redirectTo('Logout');
                                    }
                                    else {
                                        Ext.Msg.show({
                                            title: 'Error',
                                            message: 'Error while loading Data. Try after sometime.',
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

    onInvoiceResetButton: function () {
        var form = this.getView();
        var vm = form.lookupViewModel();
        vm.set('shipment', null);
        var grid = v.down('#tab').down('#itemDetails').down('#itemGrid');
        var store = grid.getStore();
        store.removeAll();
    },

    onShipmentLoadButton: function () {
        Ext.create('ApteanSalesFlowPackage.view.LoadShipment.LoadShipment')
    },
    onInvoiceSubmitButton: function (sender, record) {
        //console.log(this.getView().down('CustomerView').down('form').getForm().getValues());
        var me = this;
        var v = me.getView();
        var vm = v.lookupViewModel();
        var shipment = vm.get('shipment');
        let Invoice = {
            "date": new Date(),
            "shipment_Number": shipment.shipment_Number,
            "sO_Number": shipment.sales_Order.sO_Number,
            "customer_Id": shipment.customer1.id,
            "billing_Address": shipment.customer1.billing_Address,
            "total_Price": shipment.totalAmout,
            "due_date": shipment.sales_Order.date_Required,
            "billing_Country_Id": shipment.customer1.billing_Country_Id,
            "billing_City": shipment.customer1.billing_City,
            "billing_Zipcode": shipment.customer1.billing_ZipCode,
            "billing_State": shipment.customer1.billing_State
        };
        Ext.Ajax.request({
            url: 'http://localhost:50619/api/ARInvoices/PostAR_Invoice',
            method: 'POST',
            useDefaultXhrHeader: false,
            withCredentials: true,
            disableCaching: false,
            headers:
            {
                'Content-Type': 'application/json'
            },
            jsonData: Invoice,
            useDefaultXhrHeader: false,
            withCredentials: true,
            disableCaching: false,
            waitMsg: 'Saving..',
            success: function (response) {
                var Invoice_No = JSON.parse(response.responseText);
                Ext.Msg.show({
                    title: 'Invoice created succesfully',
                    message: 'For your reference, the Invoice Number is: ' + Invoice_No,
                    buttons: Ext.Msg.OK,
                    iconCls: 'icon-action'
                });
                vm.set('shipment', null);
                var grid = v.down('#tab').down('#itemDetails').down('#itemGrid');
                var store = grid.getStore();
                store.removeAll();
                //this.onInvoiceResetButton();
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
    }
});