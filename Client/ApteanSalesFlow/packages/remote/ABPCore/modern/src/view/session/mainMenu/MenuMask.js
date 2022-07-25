Ext.define('ABP.view.session.mainMenu.MenuMask', {
    extend: 'Ext.Component',
    alias: 'widget.menumask',
    itemId: 'menu-mask',

    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    fullScreen: true,
    cls: 'menumask',
    hidden: true,

    initialize: function () {
        this.el.dom.onclick = this.clickHandler;
    },

    clickHandler: function (mEvent) {
        var me = Ext.getCmp(this.id);
        me.up('sessioncanvas').getController().closeMenu();
    }
});