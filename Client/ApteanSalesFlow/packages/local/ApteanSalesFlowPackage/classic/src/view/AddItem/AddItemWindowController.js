Ext.define('ApteanSalesFlowPackage.view.AddItem.AddItemWindowController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.addItem',
    listen: {
        controller: {
            '*': {
                itemselection: 'addPart'
            }
        }
    },

    //Firing event to add item to grid
    addItemToGrid: function(){
        var me = this;
        var form = me.getView().down('#itemDetails');
        var formData = form.getForm().getValues();
        me.fireEvent('addNewItem',formData);
        me.getView().close();
    },

    //Creating load item window to add item data
    loadPartWindow: function(){
        Ext.create('ApteanSalesFlowPackage.view.LoadAllItems.LoadAllItems');
    },

    //Loading selected item data to form
    addPart: function(record){
        var me = this;
        var form = me.getView().down('#itemDetails');
        form.getForm().loadRecord(record);
    }
});