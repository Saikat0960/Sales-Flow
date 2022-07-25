Ext.define('ABP.view.base.popUp.PopUpController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.abppopupcontroller',

    listen: {
        controller: {
            '*': {
                popup_showPopUp: 'showMe',
                popup_hidePopUp: 'hideMe'
            }
        }
    },

    // text:        lableKey or a string object to display
    // buttonArray: array of buttons to display (optional) - defaults to 'OK' and closes popUp
    //    {
    //      text:   lableKey or a string object to display
    //      event:  event to fire (optional) - if none provided button will close popUp
    //      args:   arguments for event (optional)
    //    }
    showMe: function (text, buttonArray) {
        var me = this;
        var view = me.getView();
        view.setLabel(text);
        view.setButtons(buttonArray);
        view.show();
    },
    hideMe: function () {
        this.getView().hide();
    }
});