Ext.define('ApteanSalesFlowPackage.view.Shipment.ShipmentShowEditController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.showeditshipment',

    loadingRecord: function (window) {
        var shipmentId = window.record.data.shipment_Number;
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
                    var v = window.down('#editShipment');
                    var vm = v.getViewModel();
                    var resp = Ext.decode(response.responseText, true);
                    resp.date = resp.date.substring(0, 10);
                    vm.set('shipments', resp);
                    Ext.Ajax.request({
                        url: 'http://localhost:50619/api/SOItems/GetSO_Items/' + resp.sO_Number,
                        method: 'GET',
                        useDefaultXhrHeader: false,
                        withCredentials: true,
                        disableCaching: false,
                        waitMsg: 'Loading..',
                        success: function (response) {
                            var resp = Ext.decode(response.responseText, true);
                            var store = new ApteanSalesFlowPackage.store.ItemList();
                            store.loadData(resp);
                            var grid = window.down('#itemGrid');
                            grid.setStore(store);
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
                                    iconCls: 'icon-error'
                                });
                            }
                        }
                    });
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

    onUpdateData: function () {
        var me = this;
        var window = me.getView();
        var form = window.down('#editShipment');
        var vm = form.getViewModel();
        var Shipment = vm.get('shipments');

        delete Shipment.customer1;
        delete Shipment.sales_Order;

        if (form.isValid()) {
            Ext.Ajax.request({
                url: 'http://localhost:50619/api/Shipments/PutShipment/' + Shipment.shipment_Number,
                method: 'PUT',
                jsonData: Shipment,
                useDefaultXhrHeader: false,
                withCredentials: true,
                disableCaching: false,
                waitMsg: 'Updating..',
                success: function (form, action) {
                    Ext.Msg.show({
                        title: 'Successful',
                        message: 'Shipment data updated successfully',
                        buttons: Ext.Msg.OK,
                        iconCls: 'icon-action'
                    });
                    me.fireEvent('shipmentUpdation');
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