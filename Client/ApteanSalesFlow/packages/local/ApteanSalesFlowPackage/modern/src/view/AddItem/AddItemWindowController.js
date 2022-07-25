Ext.define('ApteanSalesFlowPackage.view.AddItem.AddItemWindowController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.addQuoteItem',
    listen: {
        controller: {
            '*': {
                itemselection: 'addPart'
            }
        }
    },
    addItemToQuoteGrid: function(){
        var me = this;
        var form = me.getView().down('#itemDetails');
        var formData = form.getForm().getValues();
        me.fireEvent('addNewQuoteItem',formData);
        me.getView().close();
    },
    loadPartWindow: function(){
        Ext.create('ApteanSalesFlowPackage.view.LoadAllItems.LoadAllItems');
    },
    addPart: function(record){
        var me = this;
        var form = me.getView().down('#itemDetails');
        form.getForm().loadRecord(record);
    }
});