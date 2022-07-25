Ext.define('ABP.view.session.mainMenu.MenuSeperator', {
    extend: 'Ext.Container',
    alias: 'widget.menuseperator',

    height: 25,
    width: '100%',
    cls: ['sessmenu-mobile-seperator', 'fa', 'fa-caret-down'],

    initialize: function () {
        this.el.dom.onclick = this.onItemClick;
    },

    onItemClick: function () {
        var me = Ext.getCmp(this.id);
        me.fireEvent('seperatorClick');
    }

});