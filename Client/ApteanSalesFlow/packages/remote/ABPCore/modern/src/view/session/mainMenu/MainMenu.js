Ext.define('ABP.view.session.mainMenu.MainMenu', {
    extend: 'Ext.Container',
    alias: 'widget.mainmenu',
    itemId: 'mainMenu',
    reference: 'mainMenu',
    requires: [
        'ABP.view.session.mainMenu.MainMenuController',
        'ABP.view.session.mainMenu.MainMenuModel',
        'ABP.view.session.mainMenu.MenuSeperator',
        'ABP.view.session.mainMenu.ABPTreeList'
    ],
    controller: 'mainmenucontroller',
    viewModel: {
        type: 'mainmenumodel'
    },
    ui: 'abpmainmenu',
    hidden: 'true',
    bind: {
        width: '{menuWidth}'
    },
    height: '100%',
    layout: 'vbox',
    flex: 1,
    automationCls: 'main-menu',
    cls: 'main-menu',
    items: [{
        xtype: 'menubutton',
        uniqueId: 'navToggleTree',
        itemId: 'navToggleTree',
        automationCls: 'swap-to-button',
        icon: '{navToggleIcon}',
        title: '{navToggleText}',
        // labelKey: 'sessionMenu_settings',
        command: 'toggleNav',
        enabled: true,
        type: 'event',
        appId: 'container',
        bind: {
            hidden: '{hideTreeNav}'
        }
    }, {
        xtype: 'container',
        flex: 1,
        items: [{
            xtype: 'treelistmenu',
            scrollable: true,
            width: '100%',
            bind: {
                store: '{navSearch}'
            }
        }]
    }, {
        xtype: 'container',
        cls: 'menu-fade-bottom',
        itemId: 'main_menu_session',
        dock: 'bottom',
        width: '100%',
        layout: { type: 'vbox', align: 'stretch' },
        bind: {
            items: '{sessionMenu}'
        }
    }],
    hideAnimation: 'slideOut',
    showAnimation: {
        type: 'slide',
        out: false,
        direction: 'right'
    },

    initialize: function () {
        var me = this;
        me.callParent();
        var nav = ABP.util.Config.getSessionConfig().navMenu;
        var tree = ABP.util.Config.getSessionConfig().treeMenu;
        var hideTree = ABP.util.Config.getSessionConfig().settings.hideTreeNavigation;
        var controller = me.getController();

        controller.populateMenuNav(nav);
        controller.populateMenuTree(tree);
        if (!tree || hideTree) {
            me.getViewModel().set('hideTreeNav', true);
        }

        var session = ABP.util.Config.getSessionConfig();
        controller.populateSessionMenu(session);
        me.down('#treelistmenu').addCls('main-menu-nav-modern');
        if (!ABP.util.Common.getSmallScreen()) {
            me.onAfter('show', me.afterShow);
        }
    },

    afterShow: function () {
        this.fireEvent('session_maskSession');        
        var focusFirst = ABP.util.Config.getSessionConfig().settings.mainMenuModernFocusFirstOption;
        if (focusFirst) {
            var treelist = this.down('#treelistmenu')
            treelist.getController().focusFirstMenuOption();
        }
    },

    setMicro: function () {

    }
});
