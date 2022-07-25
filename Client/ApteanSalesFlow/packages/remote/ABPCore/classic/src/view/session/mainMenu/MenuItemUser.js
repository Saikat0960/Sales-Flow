/////////////////////////////////////////////////////////////////////////////////////
//  Name:      app/view/session/mainMenu/MenuItemUser.js
//  Purpose:   Basic structure for a Menu item
//  Created:   10/17/2014 - Rob Munn
//  Last Edit: 10/17/2014 - Rob Munn - Created File
/////////////////////////////////////////////////////////////////////////////////////
Ext.define('ABP.view.session.mainMenu.MenuItemUser', {
    extend: 'Ext.container.Container',
    alias: 'widget.menuitemuser',
    requires: ['ABP.view.session.mainMenu.MenuItemUserModel',
        'ABP.view.session.mainMenu.MenuItemUserController'],

    controller: 'menuitemusercontroller',
    viewModel: {
        type: 'menuitemusermodel'
    },
    config: {
        icon: '',
        title: '',
        header: '',
        value: '&nbsp;',
        tabId: '',
        command: '',
        clickOnRender: false
    },
    cls: 'Menu_User',
    layout: { type: 'hbox', align: 'center', pack: 'center' },
    height: 25,
    width: 'auto',

    initComponent: function () {
        var me = this;
        var vm = me.getViewModel();
        var width = 'auto';
        var user = ABP.util.Config.getUsername();
        user = me.getController().inspectUser(user);
        vm.set('userDisplay', user);
        user = user.split("\\").pop();

        if (user.length > 14) {
            width = 100;
        }

        me.items = [{
            xtype: 'component',
            html: '<i class="' + me.icon + '"></i>',
            cls: 'mi-icon-user'
        }, {
            xtype: 'component',
            html: user,
            width: width,
            cls: 'mi-title-user'
        }];

        me.callParent(arguments);
    },

    listeners: {
        render: 'onRenderUser'
    }

});
