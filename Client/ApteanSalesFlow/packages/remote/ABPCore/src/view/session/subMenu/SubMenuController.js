Ext.define('ABP.view.session.subMenu.SubMenuController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.submenucontroller',

    subOptionClick: function (button) {
        var me = this;
        var view = me.getView();
        var feature = button.eventArgs;
        if (feature) {
            me.fireEvent('featureCanvas_showSetting', feature);
            me.fireEvent('session_closeMenu');
            view.destroy();
        }
    }
});