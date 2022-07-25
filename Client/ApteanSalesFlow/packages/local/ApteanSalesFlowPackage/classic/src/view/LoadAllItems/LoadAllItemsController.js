/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 */
Ext.define('ApteanSalesFlowPackage.view.LoadAllItems.LoadAllItemsController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.items',

    //Loading all items data to grid
    init: function () {
        Ext.Ajax.request({
            url: 'http://localhost:50619/api/Items',
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
                    var grid = v.down('grid');
                    grid.getStore().loadData(resp);
                }
            },
            failure: function (resp, opts) {
                if (resp.status == 401) {
                    this.redirectTo('Logout')
                }
                else {
                    Ext.Msg.alert('Failed', 'Error. Please try after sometime.');
                }
            }
        });
    },

    //Checking item is already present or not
    onCheckPresence: function (id) {
        var items = Ext.data.StoreManager.lookup('itemStore').getData().items;
        for (var i = 0; i < items.length; i++) {
            if (items[i].data.part_Id == id) {
                return true;
            }
        };
        return false;
    },

    //Firing event to add item data
    onSelectItem: function (gridpanel, record, item, e) {
        var me = this;
        var view = me.getView();
        if (this.onCheckPresence(record.data.part_Id)) {
            Ext.Msg.show({
                title: 'Invalid',
                message: 'Item is already been added to list.</br>You can edit the quantity.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.ERROR
            });
        }
        else {
            me.fireEvent('itemselection', record);
            view.destroy();
        }
    }
});