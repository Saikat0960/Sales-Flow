/////////////////////////////////////////////////////////////////////////////////////
//  Name:      app/view/session/mainMenu/MainMenu.js
//  Purpose:   Navigation for application
//  Created:   7/8/2014 - Joe Blenis
//  Last Edit: 7/8/2014 - Joe Blenis - Created File
/////////////////////////////////////////////////////////////////////////////////////
Ext.define('ABP.view.session.mainMenu.MainMenu', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.mainmenu',
    requires: ['ABP.view.session.mainMenu.MainMenuController',
        'ABP.view.session.mainMenu.MainMenuModel',
        'ABP.view.session.mainMenu.MenuItem',
        'ABP.view.session.mainMenu.MenuItemUser',
        'ABP.view.session.mainMenu.MenuScroll',
        'ABP.view.session.mainMenu.MenuToggle',
        'ABP.view.session.mainMenu.ABPTreeList'
    ],
    controller: 'mainmenucontroller',
    viewModel: {
        type: 'mainmenumodel'
    },
    ariaRole: 'navigation',
    automationCls: 'main-menu',
    autoEl: 'nav',

    cls: 'main-menu',
    id: 'main-navigation-menu',
    ui: 'nav-menu',
    //hidden: ABP.util.Config._sessionConfig.settings.startMenuHidden,
    itemId: 'mainMenu',
    reference: 'mainMenu',
    focusItemsCt: 0,
    currentFocus: 0,
    startIdx: -1,
    dirtyIdx: true,
    lastInitMouseBool: true,
    //width: 175,
    componentCls: 'main-menu x-unselectable',
    layout: {
        type: 'vbox',
        align: 'begin',
        pack: 'start'
    },
    //anchor: '175 100%',
    bind: {
        width: '{menuWidth}',
        ariaLabel: '{i18n.abp_navigation_menu}'
    },

    //flex: 1,
    items: [{
        xtype: 'container',
        cls: 'nav-search-cont',
        reference: 'abpNavSearchCont',
        // height = 3 + 34 + 3
        margin: '3px 0',
        height: 34,
        layout: {
            type: 'vbox',
            align: 'middle',
            pack: 'start'
        },
        bind: {
            width: '{menuWidth}',
            hidden: '{hideSearch}'
        },
        items: [{
            xtype: 'abptext',
            cls: 'nav-search-field',
            ariaRole: 'combobox',
            inputAttrTpl: 'spellcheck="false"',
            bind: {
                emptyText: '{i18n.navMenu_navigation}',
                fieldLabel: '{i18n.toolbar_search_navigation}',
                ariaLabel: '{i18n.toolbar_search_navigation}',
                hideLabel: true,
            },
            width: '90%',
            itemId: 'navSearchField',
            automationCls: 'navMenu-search-field',
            // Ensure we supress the browser spell check
            spellcheck: false,
            triggers: {
                search: {
                    cls: 'nav-search-trigger',
                    iconCls: 'magnifying-glass',
                    automationCls: 'navMenu-search-trigger',
                    handler: 'searchNav'
                }
            },
            listeners: {
                change: 'searchNav',
                focusleave: 'onSearchLostFocus',
                el: {
                    keydown: 'onSearchKeyDown'
                }
            },
            ariaAttributes: {
                'aria-owns': 'searchResultsView',
                'aria-controls': 'searchResultsView',
                'aria-haspopup': 'listbox',
                'aria-expanded': 'false',
                'aria-autocomplete': 'list',
                'aria-activedescendant': ''
            }
        }]
    }, {
        xtype: 'container',
        cls: 'nav-toggle-cont',
        layout: { type: 'vbox', align: 'stretch' },
        bind: {
            width: '{menuWidth}'
        },
        items: [/*{
            xtype: 'menubutton',
            uniqueId: 'homeScreen',
            itemId: 'navMenuHS',
            icon: 'fa-home',
            title: 'Home Screen',
            labelKey: 'navMenu_home',
            command: 'home',
            enabled: true,
            type: 'event',
            appId: 'container',
            hidden: false
        },*/ {
                xtype: 'menutoggle',
                uniqueId: 'navToggleTree',
                itemId: 'navToggleTree',
                icon: 'icon-refresh',
                title: 'Schwap View',
                automationCls: 'navMenu-swapView',
                //cls: 'abp-nav-toggle-swap',
                labelKey: 'navMenu_swapView',
                tooltipKey: 'navMenu_swapView',
                command: 'toggleNav',
                enabled: true,
                type: 'event',
                appId: 'container',
                bind: {
                    hidden: '{hideTreeNav}',
                    cls: '{navToggleIcon}'
                }
            }]
    }, {
        xtype: 'container',
        cls: "main-menu-main-content",
        flex: 1,
        scrollable: 'y',
        bind: {
            width: '{menuWidth}'
        },
        items: [{
            xtype: 'container',
            items: [{
                xtype: 'treelistmenu',
                bind: {
                    store: '{navSearch}',
                    //micro: '{micro}',
                    width: '{menuWidth}'
                }
            }]
        }, {
            xtype: 'container',
            cls: 'menu-fade-bottom',
            itemId: 'main_menu_session',
            //width: 175,
            flex: 1,
            layout: { type: 'vbox', align: 'begin' },
            //items: []
            bind: {
                items: '{sessionMenu}',
                width: '{menuWidth}'
            },
            setItems: function (newItems) {
                Ext.suspendLayouts();
                this.removeAll();
                this.add(newItems);
                Ext.resumeLayouts(true);
            }
        }]
    }],

    /*listeners: {
        // Disabling for now.  ultimately will be moved to an appropriate level down to not interfere with seach/results key functionality
        el: {
            keydown: function (f) {
                switch (f.getKey()) {
                    case f.UP:
                        this.component.getController().moveUp();
                        break;
                    case f.DOWN:
                        this.component.getController().moveDown();
                        break;
                    case f.TAB:
                        this.component.getController().tabHit();
                        break;
                    case f.LEFT:
                        this.component.getController().moveLeft();
                        break;
                }
            }
        }
    },*/

    initComponent: function () {
        var me = this;
        var controller = me.getController();
        me.callParent();
        var nav = ABP.util.Config.getSessionConfig().navMenu;
        var tree = ABP.util.Config.getSessionConfig().treeMenu;
        var hideTree = ABP.util.Config.getSessionConfig().settings.hideTreeNavigation;
        var showTreeNav = ABP.util.Config.getSessionConfig().settings.startShowingTreeNavigation;
        var hideSearch = ABP.util.Config.getSessionConfig().settings.enableNavSearch;
        var wide = ABP.util.Config.getSessionConfig().settings.enableWideMenu;
        if (wide !== undefined) {
            wide = wide === true || wide === "true";
        } else {
            wide = false;
        }

        controller.populateMenuNav(nav);
        controller.populateMenuTree(tree);

        if (hideTree !== undefined) {
            me.getViewModel().set('hideTreeNav', hideTree);
        }
        me.getViewModel().set('hideSearch', !hideSearch);
        // me.down('#treelistmenu').addCls('main-menu-nav-modern');
        var session = ABP.util.Config.getSessionConfig();
        me.getController().populateSessionMenu(session);
        if (wide) {
            me.getViewModel().set('menuWidth', 350);
        }
        if (tree && showTreeNav) {
            me.getController().__toggleNavType();
        }
        var searchResultsView = me.down('#searchResultsView');
        if (searchResultsView) {
            Ext.on('resize', controller.onSearchResultReactWindowResize, controller, searchResultsView);
        }
    },

    toggleMicro: function (collapse) {
        var me = this;
        var menu = me.down('treelistmenu');
        menu.setMicro(collapse);
        if (collapse) {
            menu.addCls('abp-tree-micro');
        } else {
            menu.removeCls('abp-tree-micro');
        }
    }
});
