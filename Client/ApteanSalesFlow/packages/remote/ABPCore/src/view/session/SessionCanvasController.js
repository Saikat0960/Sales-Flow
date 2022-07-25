Ext.define('ABP.view.session.SessionCanvasController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.sessioncanvascontroller',

    requires: [
        'ABP.util.Logger',
        'ABP.view.session.mainMenu.MenuMask'
    ],

    listen: {
        controller: {
            '*': {
                session_configurationUpdated: 'syncConfig',
                session_toggleMenu: 'toggleMenu',
                session_closeMenu: 'closeMenu',
                session_openMenu: 'openMenu',
                session_toggleRightPane: 'toggleRightPane',
                session_closeRightPane: 'closeRightPane',
                searchDrop_storeLoad: '__loadStore'
            }
        },
        component: {
            '#searchbarTypeButton': {
                searchDrop_setSearch: '__setSearch'
            },
        }
    },

    init: function () {
        if (Ext.toolkit === 'modern') {
            var me = this;
            var view = me.getView();
            view.el.dom.onclick = me.onClick.bind(this);
        }
    },

    onClick: function (e) {
        var me = this;

        me.fireEvent('session_click', e);
    },

    syncConfig: function () {
        ABP.util.Logger.logInfo("Configuration updated! Syncing with model...");
    },

    toggleMenu: function () {
        var me = this;
        var vm = me.getViewModel();
        var view = me.getView();
        var rightPane = view.down('#rightPane');
        var menuButton = view.down('#toolbar-button-menu');
        var open = vm.get('menuOpen');
        var classic = ABP.util.Common.getClassic();
        var rememberState = ABP.util.Config.getSessionConfig().settings.rememberMenuState;
        var classicMenuExpand = view.up().down('mainmenu').getViewModel().get('classicMenuExpand');

        if (classic) {
            me.fireEvent('mainMenu_classicToggle');
            if (menuButton) {
                if (classicMenuExpand) {
                    menuButton.removeCls('toolbar-toggled');
                } else {
                    menuButton.addCls('toolbar-toggled');
                    me.focusSearch();
                }
            }
            menuButton.setAriaExpanded(!classicMenuExpand);
        } else {
            if (open) {
                vm.set('menuOpen', !open);
                if (rememberState) {
                    ABP.util.LocalStorage.set('mmStateOpen', !open);
                }
                view.closeMenu();
            } else {
                vm.set('menuOpen', !open);
                if (rememberState) {
                    ABP.util.LocalStorage.set('mmStateOpen', !open);
                }
                view.openMenu();
                if (ABP.util.Common.getSmallScreen() === true && Ext.toolkit === "modern") {
                    this.closeRightPane();
                }
            }
        }
    },

    focusSearch: function () {
        var focusConfig = ABP.util.Config.getSessionConfig().settings.enableSearch;
        if (focusConfig === true) {
            var me = this;
            var menu = me.lookupReference('mainMenu');
            var container = menu.lookupReference('abpNavSearchCont');
            var textfield = container.getComponent('navSearchField');
            textfield.focus();
        }
    },


    openMenu: function () {
        var me = this;
        var view = me.getView();
        var vm = me.getViewModel();
        var menu = view.down('#mainMenu');
        var menuButton = view.down('#toolbar-button-menu');
        var classic = ABP.util.Common.getClassic();
        if (classic) {
            me.fireEvent('mainMenu_classicOpen');
        } else {
            if (menu && vm) {
                menu.show();
                vm.set('menuOpen', true);
                if (menuButton) {
                    menuButton.addCls('toolbar-toggled');
                }
                view.setMasked({ xtype: 'menumask' });
            }
        }
    },

    maskForMenu: function () {
        this.getView().setMasked({ xtype: 'menumask' });
    },

    closeMenu: function () {
        var me = this;
        var view = me.getView();
        var vm = me.getViewModel();
        var menu = view.down('#mainMenu');
        var menuButton = view.down('#toolbar-button-menu');
        var classic = ABP.util.Common.getClassic();
        var rememberState = ABP.util.Config.getSessionConfig().settings.rememberMenuState;

        if (menuButton) {
            menuButton.removeCls('toolbar-toggled');
        }

        if (classic) {
            me.fireEvent('mainMenu_classicClose');
        } else {
            if (menu && vm) {
                menu.hide();
                vm.set('menuOpen', false);
                view.setMasked(false);
            }
        }
    },

    toggleRightPane: function () {
        var me = this;
        var vm = me.getViewModel();
        var open = vm.get('rightPaneOpen');
        if (open) {
            me.closeRightPane();
        } else {
            me.openRightPane();
        }
    },

    openRightPane: function () {
        if (ABP.util.Common.getSmallScreen() === true && Ext.toolkit === "modern") {
            this.closeMenu();
        }
        var me = this;
        var view = me.getView();
        var vm = me.getViewModel();
        var rightPane = view.down('#rightPane');
        var menuButton = view.down('#rpButton');
        if (rightPane && vm) {
            rightPane.show();
            vm.set('rightPaneOpen', true);
            if (menuButton) {
                menuButton.addCls('toolbar-toggled');
                menuButton.addCls('toolbar-button-pressed'); // extra modern class
            } else {
                if (Ext.toolkit === 'classic') {
                    var activeTab = rightPane.getActiveTab();
                    if (activeTab) {
                        me.fireEvent('toolbar_addPressedCls', activeTab.unqiueId);
                    }
                }
            }
            if (ABP.util.Common.getKeyboardNavigation()) {
                rightPane.applyFocus();
            }
        }
    },

    closeRightPane: function () {
        var me = this;
        var view = me.getView();
        var vm = me.getViewModel();
        var rightPane = view.down('#rightPane');
        var menuButton = view.down('#rpButton');
        var rightPaneButtons = view.lookupReference('rightpaneButtons') || view.down("#rightpaneButtons");

        if (rightPane && vm) {
            rightPane.hide();
            // me.fireEvent('toolbar_setOverrideTitle', null);
            vm.set('rightPaneOpen', false);
            if (menuButton) {
                menuButton.removeCls('toolbar-toggled');
                menuButton.removeCls('toolbar-button-pressed'); // extra modern class
            }
            // Fix the issue where closing the menu without pressing the button doesn't remove styles.
            if (rightPaneButtons) {
                rightPaneButtons = rightPaneButtons.items.items;
                rightPaneButtons.forEach(function (value) {
                    if (value.pressed) {
                        value.setPressed(false);
                    }
                });
            }
        }
    },
    __loadStore: function (settings) {
        var me = this;
        var view = me.getView();
        var searchDrop;
        var topContainer;
        var vm;
        var store;

        if (settings.enableSearch && settings.searchInfo) {
            vm = me.getViewModel();
            store = vm.getStore('searchProviders');
            try {
                store.loadData(settings.searchInfo);
                if (ABP.util.Common.getClassic()) {
                    me.__constructSearchOptionsMenu(settings.searchInfo, settings.defaultSearch);
                } else {
                    //me.__constructSearchOptions(settings.searchInfo, settings.defaultSearch);
                    me.fireEvent('searchPane_setupSearch', settings);
                }
            } catch (e) {
                ABP.util.Logger.logError('search info failed to load into searchProviders store', e)
            }
        } else {
            searchDrop = view.down('#searchbarContainer');
            if (searchDrop) {
                topContainer = view.down('#topContainer');
                if (topContainer) {
                    topContainer.remove(searchDrop);
                }
            }
        }
    },
    __constructSearchOptionsMenu: function (searchInfo, defaultSearch) {
        var me = this;
        var menu = [];
        var i = 0;
        var iconString = '';
        var found = false;
        for (i = 0; i < searchInfo.length; ++i) {
            if (searchInfo[i].icon) {
                iconString = me.__makeIconString(searchInfo[i].icon);
            } else {
                iconString = null;
            }
            menu.push({
                text: searchInfo[i].name,
                iconCls: iconString,
                cls: 'a-searchtype-' + searchInfo[i].id,
                searchId: searchInfo[i].id,
                listeners: {
                    click: 'onProviderClick'
                    // click: function (clicked) {
                    //     this.__setSearch(clicked);

                    //     // Store the search the user last clicked on
                    //     ABP.util.LocalStorage.setForLoggedInUser('DefaultSearch', clicked.searchId);
                    // },
                    // scope: me
                }
            });
        }
        me.getViewModel().set('searchBar.menuOptions', menu);
        if (defaultSearch && defaultSearch !== "") {
            for (i = 0; i < menu.length; i++) {
                if (defaultSearch === menu[i].searchId || defaultSearch === menu[i].text) {
                    me.__setSearch(menu[i]);
                    found = true;
                    break;
                }
            }
        }
        if (!found && Ext.isArray(menu) && menu.length > 0) {
            me.__setSearch(menu[0]);
        }
    },
    __constructSearchOptions: function (searchInfo, defaultSearch) {
        var me = this;
        var i = 0;
        var found = false;
        if (defaultSearch && defaultSearch !== "") {
            for (i = 0; i < searchInfo.length; ++i) {
                if (defaultSearch === searchInfo[i].id || defaultSearch === searchInfo[i].name) {
                    me.__setSearch({
                        searchId: searchInfo[i].id,
                        iconCls: me.__makeIconString(searchInfo[i].icon)
                    });
                    found = true;
                    break;
                }
            }
            if (!found) {
                me.__setSearch({
                    searchId: searchInfo[0].id,
                    iconCls: me.__makeIconString(searchInfo[0].icon)
                });
            }
        } else {
            me.__setSearch({
                searchId: searchInfo[0].id,
                iconCls: me.__makeIconString(searchInfo[0].icon)
            });
        }
    },
    __makeIconString: function (icon) {
        var ret = icon;
        var font = icon;
        font = font.split('-');
        ret = font[0] === 'fa' ? 'x-fa ' + icon : icon;
        return ret;
    },
    __setSearch: function (search) {
        var me = this;
        var vm = me.getViewModel();
        vm.set('searchBar.selectedSearch', search.searchId);
        vm.set('searchBar.selectedSearchCls', search.iconCls);
    }


});
