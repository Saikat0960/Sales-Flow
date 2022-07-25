// TODO: Can this class be removed?
Ext.define('ABP.view.session.toolbarTop.ToolbarUser', {
    extend: 'Ext.button.Button',
    alias: 'widget.toolbaruser',

    cls: 'toolbar-menu-user a-toolbar-menu-user',
    height: 50,
    iconCls: 'icon-user toolbar-menu-user-icon',
    bind: {
        text: '{username:htmlEncode}',
        menu: '{userMenu}',
        height: '{toolbarHeight}'
    },
    iconAlign: 'left',
    overCls: 'toolbar-menu-btn-over',
    focusCls: '',
    menuAlign: 'tr-br',
    handler: function () {
        this.up('toolbartop').getViewModel().set('now', Date.now())
    }
});