Ext.define('ABP.view.session.mainMenu.MainMenuController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.mainmenucontroller',
    requires: [
        'ABP.util.filters.misc.DuplicateFilter',
        'ABP.events.ABPEvents'
    ],

    /**
     * Whether to force the default selection when showing a filtered set of results
     * When this is true, the first item in the filter list will for selected. If the user
     * starts to navigate the list of results their current selection will be maintained if they
     * try and change the filter text.
     */
    useDefaultSelection: true,
    __favoriteBroadcastChannel: 'abp-core-favorite',

    listen: {
        controller: {
            '*': {
                mainMenu_Populate: 'populateMainMenu',
                container_mobileSessionToggle: 'mobileSessionToggle',
                mainMenu_classicToggle: 'classicToggle',
                mainMenu_classicClose: 'classicClose',
                mainMenu_classicOpen: 'classicOpen',
                mainMenu_enableMenuOption: 'enableMenuItem', // Note: This event has been left in for legacy. Although it manages the "enabled" property of a menu item, the CSS class it adds as part of its logic does not exist in the ABP SCSS any more.
                mainMenu_addMenuOption: 'addMenuItem',
                mainMenu_removeMenuOption: 'removeMenuItem',
                mainMenu_updateMenuCount: 'onUpdateMenuCount',
                mainMenu_toggleNav: '__toggleNavType',
                mainMenu_addRecent: '__addRecent',
                mainMenu_addFavorite: '__addFavorite',
                mainMenu_removeFavorite: '__removeFavorite',
                mainmenu_updateFavorites: '__updateFavorites',
                mainmenu_focusFavorites: 'focusFavorites',
                mainmenu_focusRecents: 'focusRecents',
                mainMenu_replaceSuggested: '__replaceSuggested',
                mainMenu_addTreeOption: '__addTreeOption',
                mainMenu_removeTreeOption: '__removeTreeOption',
                mainMenu_setSingleExpand: '__setSingleExpand',
                mainMeun_setRecents: '__setRecents',

                afterSwitchLanguage: '__updateTreeStrings',
                session_click: '__handleSessionClick',
                session_toggleMenuShortcuts: '__toggleMenuShortcuts'
            }
        },
        component: {
            '*': {
                miItemClick: 'menuButtonClick',
                seperatorClick: 'mobileSessionToggle'
            }
        }
    },

    init: function() {
        ABP.util.BroadcastChannel.create('abp-core-favorite', this.onFavoriteMessageRecieved, this)
    },

    destroy: function() {
        ABP.util.BroadcastChannel.remove('abp-core-favorite');
    },

    /**
     * @event abp_updatedRecents
     * This event fires after the recents menu object has been updated and saved in local storage.
     *
     * This is meant to be listened to if a product would like to capture and save the recent data server side.
     *
     * ABP.util.Common.getRecents() can be called to get a serialized array of theses items.
     */

    //Private
    setMicro: function () {
        var me = this;
        var vm = me.getViewModel();
        var micro = vm.get('micro');
        if (micro) {
            vm.set('micro', false);
            vm.set('menuWidth', 175);
            vm.set('sessHeight', 81);
            vm.set('menuFooterCls', 'menu-footer');
        } else {
            vm.set('micro', true);
            vm.set('menuWidth', 40);
            vm.set('sessHeight', 52);
            vm.set('menuFooterCls', 'main-footer-micro');
        }
    },

    /**
     * Initialize the navSearch tree with menu items.
     * @param {Object[]} navItems 
     */
    populateMenuNav: function (navItems) {
        var me = this;
        var vm = me.getViewModel();
        var navStore = vm.getStore('navSearch');
        var navButtons = [];
        var searchNav, menuItemType;
        var i = 0;
        var config = ABP.util.Config.getSessionConfig();
        var navMenuOrder = config.navMenuOrder;
        var menuItemCount = Object.keys(navMenuOrder).length;
        for (i = 0; i < menuItemCount; i++) {
            menuItemType = null; // Reset type between loops.
            // Find the type of node to build.
            for (var property in navMenuOrder) {
                if (navMenuOrder[property] === i) {
                    menuItemType = property;
                    break;
                }
            }
            // Build the node.
            switch (menuItemType) {
                case 'favorites':
                    if (config.settings.enableMenuFavorites) {
                        navButtons.push(me.buildFavoriteNode(config));
                    }
                    break;
                case 'recents':
                    if (config.settings.enableMenuRecent) {
                        navButtons.push(me.buildRecentsNode());
                    }
                    break;
                case 'suggested':
                    if (config.settings.enableMenuSuggested) {
                        navButtons.push(me.buildSuggestedNode());
                    }
                    break;
                case 'navigation':
                    var navItemsLen = navItems.length;
                    for (var j = 0; j < navItemsLen; ++j) {
                        var menu = me.makeMenuTreeItem(navItems[j], 0);
                        if (config.firstMenuAtTop && j === 0) {
                            navButtons.unshift(menu);
                        }
                        else if (navItems[j].isTop) {
                            navButtons.unshift(menu);
                        }
                        else {
                            navButtons.push(menu);
                        }

                        // Since navigation lives directly under the root, track the Id of the last added navigation item.
                        // If a menu item is injected via 'container_addMenuOption' it must be inserted directly after this node.
                        if (j === navItemsLen - 1) {
                            var navLength = navButtons.length - 1;
                            vm.set('mainMenu_lastAddedNavItemId', {
                                uniqueId: navButtons[navLength].uniqueId,
                                appId: navButtons[navLength].appId,
                                index: navLength
                            });
                        }
                    }
                    break;
            }
        }
        searchNav = {
            expanded: true,
            children: navButtons
        };
        navStore.setRoot(searchNav);

        // Update the strings that the user can search for, for menu items.
        me.setSearchStore();
    },

    /**
     * Builds and returns favorite node for nav menu.
     */
    buildFavoriteNode: function (config) {
        var favoriteChildren = [];
        var startFavoritesOpen = false;
        var favorites = config.settings.favorites.favoriteItems;
        if (Ext.isString(favorites)) {
            favorites = Ext.JSON.decode(favorites);
        }
        // Favorites may be 1 element if there is actually only one favorite, otherwise it may be an object with a string.
        if (Ext.isArray(favorites) && favorites.length === 1 && Ext.isString(favorites[0])) {
            favorites = Ext.JSON.decode(favorites[0]);
        }
        if (favorites && !Ext.isEmpty(favorites)) {
            favoriteChildren = favorites;
        }
        if (config.settings.mainMenuStartFavoritesOpen) {
            startFavoritesOpen = true;
        }

        return this.makeMenuTreeItem({
            activateApp: false,
            enabled: true,
            children: favoriteChildren,
            hidden: favoriteChildren.length === 0,
            expanded: startFavoritesOpen,
            showManageTool: config.settings.enableMenuFavorite,
            itemId: 'NavFavorites',
            appId: 'container',
            uniqueId: 'container_nav-favorites',
            label: 'Favorites',
            labelKey: 'navMenu_favorites',
            tooltip: 'Favorites',
            tooltipKey: 'navMenu_favorites',
            icon: 'icon-favorite'
        }, 0, false, 'favorite');
    },

    /**
     * Builds and returns recents node for nav menu.
     */
    buildRecentsNode: function () {
        var recents = [];
        return this.makeMenuTreeItem({
            activateApp: false,
            enabled: true,
            children: recents,
            hidden: recents.length === 0,
            itemId: 'NavRecent',
            appId: 'container',
            uniqueId: 'container_nav-recent',
            label: 'Recent',
            labelKey: 'navMenu_recent',
            tooltip: 'Recent',
            tooltipKey: 'navMenu_recent',
            icon: 'icon-clock'
        }, 0);
    },

    /**
     * Builds and returns suggested node for nav menu.
     */
    buildSuggestedNode: function () {
        var suggestions = [];
        return this.makeMenuTreeItem({
            activateApp: false,
            enabled: true,
            children: suggestions,
            hidden: suggestions.length === 0,
            itemId: 'NavSuggested',
            appId: 'container',
            uniqueId: 'container_nav-suggested',
            label: 'Suggested',
            labelKey: 'navMenu_suggested',
            tooltip: 'Suggested',
            tooltipKey: 'navMenu_suggested',
            icon: 'icon-lightbulb-off'
        }, 0);
    },

    populateMenuTree: function (config) {
        var me = this;
        var vm = me.getViewModel();
        var navTreeStore = vm.getStore('navTree');
        var navTreeButtons = [];
        var treeNav;
        var i = 0;
        if (config) {
            for (i = 0; i < config.length; ++i) {
                navTreeButtons.push(me.makeMenuTreeItem(config[i], 0));
            }
        }

        treeNav = {
            expanded: true,
            children: navTreeButtons
        };

        navTreeStore.setRoot(treeNav);

        // Update the strings that the user can search for, for menu items.
        me.setSearchStore();
    },

    /**
     * @param {Object} config to map to node, like so:
     *
     *          pageInfo = {
     *              activateApp: true,
     *              appId: '',
     *              uniqueId: '',
     *              children : [],
     *              enabled: true,
     *              event: 'myEvent',
     *              eventArgs: [],
     *              icon: '',
     *              itemHref: '',
     *              hash: '',
     *              label: '',
     *              labelKey: 'i18n_string',
     *              tooltip: '',
     *              tooltipKey: 'i18n_string',
     *              type: 'event'
     *          }
     *
     * @param {Number} level Determines the UI of this menu item (how deeply nested into tree).
     * @param {Boolean} saveConfig Whether or not to store the unmodified config for later use.
     * @param {String} type The type of menu item. Currently 'favorite' is the only value of interest.
     */
    makeMenuTreeItem: function (config, level, saveConfig, type) {
        var me = this;
        var vm = me.getViewModel();
        var retItem, uniqueId, text;
        var children = [];
        var iconString = '';
        var font = config.icon;
        var i = 0;
        var automationCls = '';
        var autocls = '';
        var menuCls = '';
        var finalCls = '';
        if (config.data && config.data.serialData) {
            config = config.data.serialData;
            font = config.icon;
        }
        if (config.uniqueId === null || config.uniqueId === undefined || config.uniqueId === "") {
            uniqueId = (type === 'favorite' ? 'fav_' : '') + ABP.util.IdCreator.getId(config); // The prepend of "fav_" is needed when a product specifies a favorite without a uniqueId.
        } else {
            uniqueId = config.uniqueId;
        }
        if (config.children && config.children.length > 0) {
            for (i; i < config.children.length; i++) {
                children.push(me.makeMenuTreeItem(config.children[i], level + 1, saveConfig, type));
            }
        } else {
            children = undefined;
        }
        // iconCls is set by favorites manager and the iconCls should already be correct.
        if (config.config) {
            iconString = config.config.icon;
            config.label = config.config.text;
        }
        // Set current text to either the configured text property or determine text based on labelKey or label.
        text = config.text ? config.text : me.i18nLookup(config.label, config.labelKey);

        if (font) {
            font = font.split('-');
            iconString = font[0] === 'fa' ? 'x-fa ' + config.icon : config.icon;
            iconString = me.__inspectIconString(iconString);
        }
        if (config.labelKey) {
            automationCls = menuCls + 'a-menu-' + config.labelKey.replace(/_/g, '-');
        } else {
            automationCls = menuCls + 'a-menu-unsafe-' + config.label.replace(/[^A-Za-z]/g, '');
        }

        autocls += "treeMenu-level-" + level % 5;
        indentCls = 'treeMenu-indent-' + level;
        finalCls = [automationCls, autocls, indentCls];
        if (!config.enabled) {
            finalCls.push('treeMenu-disabled');
        }
        if (type === 'favorite') {
            // Hide favorite item icons. Exception is the actual favorites root.
            if (vm.get('conf.settings.favorites.hideIcons') === true && config.uniqueId !== 'container_nav-favorites') {
                iconString = '';
            }
        }
        if (iconString === '') {
            finalCls.push('abp-no-icon');
        }

        retItem = {
            text: Ext.String.htmlEncode(text),
            // Persistent (non-custom) properties.
            config: {
                text: text,
                icon: iconString
            },
            itemId: config.itemId,
            iconCls: iconString, //level !== 0 ? iconString : '',
            itemCount: config.itemCount,
            itemPriority: config.itemPriority,
            showManageTool: config.showManageTool,
            manageEvent: config.manageEvent,
            itemHref: config.itemHref,
            cls: finalCls,//config.enabled ? [automationCls, autocls ] : [automationCls, autocls, 'treeMenu-disabled'],
            activateApp: config.activateApp,
            appId: config.appId,
            expanded: config.expanded ? config.expanded : false,
            hash: config.hash,
            contextMenu: config.contextMenu || false,
            hidden: config.hidden,
            enabled: config.enabled,
            event: config.event,
            eventArgs: config.eventArgs,
            //bind: config.labelKey ? { text: '{i18n.' + config.labelKey + ':htmlEncode}'} : {},
            labelKey: config.labelKey,
            tooltip: config.tooltip,
            tooltipKey: config.tooltipKey,
            shorthand: config.shorthand,
            type: config.type,
            id: uniqueId,
            uniqueId: uniqueId
        };
        if (saveConfig || saveConfig === undefined) {
            config.uniqueId = uniqueId;
            retItem['serialData'] = config;
        }
        if (children) {
            retItem['children'] = children;
        } else {
            retItem['leaf'] = true;
        }
        return retItem;
    },
    makeSessionMenuItem: function (config) {
        //var me = this;
        var uniqueid = (config.uniqueId === null || config.uniqueId === undefined || config.uniqueId === "") ? ABP.util.IdCreator.getId(config) : config.appId + '_' + config.uniqueId;
        return {
            xtype: 'menubutton',
            activateApp: config.activateApp,
            appId: config.appId,
            enabled: config.enabled,
            command: config.event,
            args: config.eventArgs,
            icon: config.icon,
            title: config.label,
            labelKey: config.labelKey,
            tooltip: config.tooltip,
            tooltipKey: config.tooltipKey,
            type: config.type,
            uniqueId: uniqueid,
            hidden: !config.enabled,
            bind: {
                width: '{menuWidth}'
            }
        };
    },
    __inspectIconString: function (iconString) {
        var allowed = (((allowed || '') + '')
            .toLowerCase()
            .match(/<[a-z][a-z0-9]*>/g) || [])
            .join('');
        var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
            commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
        return iconString.replace(commentsAndPhpTags, '')
            .replace(tags, function (x, y) {
                return allowed.indexOf('<' + y.toLowerCase() + '>') > -1 ? x : '';
            }).replace('/>', '').trim();
    },

    i18nLookup: function (labelVal, labelKey) {
        var me = this;
        var vm = me.getViewModel();
        var ret = labelVal;
        var look = '';
        if (labelKey) {
            look = vm.get('i18n.' + labelKey);
            if (look) {
                ret = look;
            }
        }
        return ret;
    },

    onManageToolClick: function (e, cmp) {
        e.stopPropagation();
        var item = this.getView().getOverItem();
        if (item._node.get('manageEvent')) {
            this.fireEvent(item._node.get('appId') + '_showSettings', item._node.get('manageEvent'));
        }
    },

    populateMainMenu: function (config) {
        var me = this;
        var view = me.getView();
        var docked = me.getViewModel().data.menuDocked;
        var autoHide = me.getViewModel().get('autoHide');
        var firstEnabled = -1;
        // for each navMenu create a menuitem
        var menuItems = [];
        var i, Enabled, unId;
        var focus, button;

        for (i = 0; i < config.length; ++i) {
            Enabled = config[i].enabled ? false : true; // It lives again!
            unId = (config[i].uniqueId === null || config[i].uniqueId === undefined || config[i].uniqueId === "") ? ABP.util.IdCreator.getId(config[i]) : config[i].uniqueId;
            if (config[i].enabled && firstEnabled === -1) {
                firstEnabled = i;
            }
            focus = !autoHide && config[i].enabled;
            // if check for type group - switch to our event for button click
            button = {
                xtype: 'menubutton',
                uniqueId: unId,
                icon: config[i].icon,
                title: config[i].label,
                labelKey: config[i].labelKey,
                bind: { labelVal: '{i18n.' + config[i].labelKey + '}' },
                command: config[i].event,
                args: config[i].eventArgs,
                enabled: config[i].enabled,
                tooltip: config[i].tooltip,
                tooltipKey: config[i].tooltipKey,
                shorthand: config[i].shorthand,
                type: config[i].type,
                children: config[i].children,
                appId: config[i].appId,
                hidden: config[i].hidden && Enabled,
                focusable: focus,
                activateApp: config[i].activateApp,
                tabIndex: -1
            };
            if (config[i].children && config[i].children.length > 0) {
                me.fireEvent('submenu_populate', config[i].children, button.uniqueId, button.title);
            }
            menuItems.push(button);
        }
        menuItems.push({
            flex: 1
        });
        if (!autoHide) {
            menuItems[firstEnabled].tabIndex = 2;
        }
        view.focusItemsCt = me.getViewModel().navSet('navMenu', menuItems);
    },

    populateSessionMenu: function (config) {
        var me = this;
        var view = me.getView();
        var menuItems = [];
        var logo;

        if (ABP.util.Common.getModern()) {
            logo = {
                xtype: 'component',
                uniqueId: 'apteanLogo',
                bind: {
                    cls: '{menuFooterCls}'
                }
            };
        } else {
            logo = {
                xtype: 'component',
                itemId: 'apteanLogo',
                uniqueId: 'apteanLogo',
                cls: 'menu-footer',
                bind: {
                    cls: '{menuFooterCls}',
                    width: '{menuWidth}'
                },
                setCls: function (cls) {
                    if (cls === 'menu-footer') {
                        this.removeCls('main-footer-micro');
                        this.addCls(cls);
                    } else {
                        this.removeCls('menu-footer');
                        this.addCls(cls);
                    }
                }
            };
        }
        menuItems.push(logo);
        view.focusItemsCt = me.getViewModel().navSet('sessionMenu', menuItems);
    },

    languageSubMenu: function (languages) {
        var retArray = [];
        var currLang = this.getViewModel().get('selected.language');
        if (currLang === "") {
            currLang = "en";
            this.getViewModel().set('selected.language', 'en');
        }
        var i;
        for (i = 0; i < languages.length; ++i) {
            if (languages[i].key !== currLang) {
                retArray.push({
                    label: languages[i].name,
                    labelKey: 'languages_' + languages[i].key,
                    event: 'switchLanguage',
                    eventArgs: languages[i].key,
                    appId: 'container',
                    enabled: true,
                    tooltip: languages[i].name,
                    tooltipKey: 'languages_' + languages[i].key,
                    children: undefined,
                    type: 'event'
                });
            }
        }
        return retArray;
    },

    refreshMainMenu: function () {
        var me = this;
        var config = ABP.util.Config.getSessionConfig();
        me.populateMainMenu(config.navMenu);
        me.populateSessionMenu(config);
    },

    /** 
     * Note: This event has been left in for legacy. Although it manages the "enabled" property of a menu item, the CSS class it adds as part of its logic does not exist in the ABP SCSS any more.
     */
    enableMenuItem: function (appId, uniqueId, isenabled) {
        var me = this;
        var changeMenuItem = me.findMenuItem(appId, uniqueId);
        if (changeMenuItem) {
            // The found item is either a node or underlying data wrapped in an ABP.data.TreeData.
            if (changeMenuItem.isNode) {
                // The item is a real node, so it must have a corresponding DOM component that can be adjusted.
                var view = me.getView();
                var menu = view.down('treelistmenu');
                var row = menu.getItem(changeMenuItem);
                if (row) {
                    if (isenabled) {
                        changeMenuItem.data.enabled = true;
                        row.removeCls('treeMenu-disabled'); // Note that treeMenu-disabled does not exist in the ABP SCSS. 
                    } else {
                        changeMenuItem.data.enabled = false;
                        row.addCls('treeMenu-disabled'); // Note that treeMenu-disabled does not exist in the ABP SCSS.
                    }
                }
            } else {
                // The item is only data. It is not rendered. Best we can do is adjust its data.

                // Change item's data ready for rendering later.
                changeMenuItem.data.enabled = isenabled;
                // Also the cls property might need to be adjusted since this can contain an array element of 'treeMenu-disabled'.
                if (!Ext.isArray(changeMenuItem.data.cls)) {
                    changeMenuItem.data.cls = [];
                }
                if (isenabled && Ext.Array.contains(changeMenuItem.data.cls, 'treeMenu-disabled')) {
                    // Remove it.
                    Ext.Array.remove(changeMenuItem.data.cls, 'treeMenu-disabled');
                } else if (!isenabled && !Ext.Array.contains(changeMenuItem.data.cls, 'treeMenu-disabled')) {
                    // Add it.
                    Ext.Array.push(changeMenuItem.data.cls, 'treeMenu-disabled');
                }
            }
        } else {
            // session menu

            var sesIndex = me.findSessionMenuItem(appId, uniqueId);
            if (sesIndex) {
                var vm = me.getViewModel();
                var sessionMenu = vm.get('sessionMenu');
                sessionMenu[sesIndex].hidden = !isenabled;
                sessionMenu[sesIndex].enabled = isenabled;
                vm.navSet('sessionMenu', sessionMenu);
            }
        }
    },

    /**
     * Returns a node or data from a menu TreeStore.
     *
     * The Ext.data.TreeStore is limited in its ability to search only for rendered nodes.
     * It does not find unrendered (i.e. no node) nodes. Nodes will only exist if the TreeStore has lazyFill: false, or the user has shown those items. 
     * 
     * This method finds an item within both the node and data heirarchies, which covers all tree items whether they are rendered or not. 
     * 
     * If the item is found then either a node record is returned (Ext.data.TreeModel) because it is rendered,
     * or an a TreeModel-like object is returned (ABP.data.TreeData) encapsulating the underlying data.
     * Note: ABP.data.TreeData is simple and does not try to be a functionally complete copy of Ext.data.TreeModel.
     * 
     * If the result object has isData (a boolean property) then it is an ABP.data.TreeData. If the result object has isNode (a boolean property) then it is an Ext.data.TreeModel object.
     *
     * The propertyName and value can be provided or a comparitorFn.
     * @param {String} appId Not used at the moment. You can pass null.
     * @param {String} id A string that will match an id property of a menu item.
     * @param {Boolean} tree true if navigation is using the old navTree else the new navSearch tree is used.
     * @return {Ext.data.TreeModel/ABP.data.TreeData} If the item is found then either a node record is returned (Ext.data.TreeModel) because it is rendered, or an a TreeModel-like object is returned (ABP.data.TreeData) encapsulating the underlying data.
     */
    findMenuItem: function (appId, id, tree) {
        var me = this;
        var vm = me.getViewModel();
        var store;
        var node;

        // There are two navigation menus. navTree is old and will be deprecated at some point. navSearch is new.
        if (tree) {
            store = vm.getStore('navTree');
        } else {
            store = vm.getStore('navSearch');
        }

        // Try and find the menu item by looking at the TreeStore's nodes first. 
        node = store.getNodeById(id);
        if (node == null) {
            // Not found in the nodes. 
            // If this store is lazyFill:true then it is possible that the nodes have child data that has not been loaded as a node yet.
            // So search the data next.
            // TODO: Once the new lazyFill:true code has been bedded in and known to be bug free, it should be possible to have just the code below cover both cases.
            if (store.lazyFill) {
                node = me.findTreeStoreItem(store, 'id', id);
            }
        }

        return node;
    },

    findSessionMenuItem: function (appId, uniqueId) {
        var me = this;
        var vm = me.getViewModel();
        var ses = vm.get('sessionMenu');
        var ret = false;
        for (var i = 0; i < ses.length; ++i) {
            if (appId + '_' + uniqueId === ses[i].uniqueId) {
                ret = i;
            }
        }
        return ret;
    },

    /**
     * Add a menu item somewhere into the nav (left) menu or session (right menu).
     * 
     * @param {Object} menuItem The config of the menu item to add.
     * @param {Boolean} nav true to add to the left navigation menu. false to the session menu on the right pane.
     * @param {String} parentAppId If the parentId is specified then parentAppId + "_" is prepended to the parentId. If not specified then just the parentId is used.
     * @param {String} parentId Id of the parent to add the child to. parentAppId + "_" is prepended to parentId is parentAppId is specified. Otherwise just parentId is used to identify which parent node to add to.
     * @param {Boolean} tree true for legacy navTree menu, false for main nav menu (navSearch)
     */
    addMenuItem: function (menuItem, nav, parentAppId, parentId, tree) {
        var me = this;
        var vm = me.getViewModel();
        var store;
        var pNode;
        var testnode;
        var level = 0;
        var sesIndex;
        var sessionMenu;

        if (tree) {
            store = vm.getStore('navTree');
        } else {
            store = vm.getStore('navSearch');
        }

        // Left nav tree or right session menu?
        if (nav) {
            if (parentId) {
                var actualParentId = (parentAppId ? parentAppId + '_' : '') + parentId;
                pNode = this.findMenuItem(null, actualParentId, tree);
                //pNode = store.getNodeById(actualParentId); 
                if (pNode) {
                    // Parent is found.
                    if (pNode.isNode) {
                        // Need to calculate the level of where this new node will be. Gets used to determine its styling.
                        testnode = pNode;
                        // There is a parent so the parent is not the root. 
                        for (; ;) {
                            if (testnode.parentNode.isRoot()) {
                                level += 1;
                                break;
                            } else {
                                testnode = testnode.parentNode;
                                level += 1;
                            }
                        }
                    } else {
                        // It is an ABP.data.TreeData, which should have the level already calculated.
                        level = pNode.level;
                    }
                } else {
                    // Parent node could not be found. Nothing to do in this case other than log a warning.
                    ABP.util.Logger.logWarn('Cannot add menu node. Could not find parent menu node id "' + actualParentId + '"');
                }
            }
            if (pNode) {
                // Put the child in parent.
                if (pNode.isNode) {
                    // Easy case. The parent is a proper tree node, so can add with ExtJS API.
                    pNode.appendChild(me.makeMenuTreeItem(menuItem, level));
                } else {
                    // Trickier case. The parent is just a child data element of an array, with no ExtJS API surrounding it.
                    // It resides somewhere down a heirarchy of other child data that eventually has a real node somwhere
                    // up above.
                    // This happens with the tree store has lazyFull:true.
                    // The answer is to add a new element to the parent's children property, but also the change the parent from being 
                    // defined as a leaf.
                    // At some point later in time the user may drill down to its parent, at which point
                    // the nodes will be created from the child data.
                    if (!Ext.isArray(pNode.data.children)) {
                        pNode.data.children = [];
                    }
                    pNode.data.children.push(me.makeMenuTreeItem(menuItem, level));
                    pNode.data.leaf = false;
                }
            }
            else {
                // Adding the menu item to the root.
                var lastAddedNodeInfo = vm.get('mainMenu_lastAddedNavItemId');
                if (lastAddedNodeInfo) {
                    var newIndex = lastAddedNodeInfo.index + 1;
                    var menuItemToAdd = me.makeMenuTreeItem(menuItem, level);
                    vm.set('mainMenu_lastAddedNavItemId', {
                        uniqueId: menuItemToAdd.uniqueId,
                        appId: menuItemToAdd.appId,
                        index: newIndex
                    });
                    store.getRoot().insertChild(newIndex, menuItemToAdd)
                }
                // put the child in the root
                else if (store.getRoot()) {
                    store.getRoot().appendChild(me.makeMenuTreeItem(menuItem, level));
                } else {
                    store.setRoot({
                        expanded: true
                    });
                    store.getRoot().appendChild(me.makeMenuTreeItem(menuItem, level));
                }
            }
        } else {
            // session menu
            sesIndex = me.findSessionMenuItem(menuItem.appId, menuItem.uniqueId);
            if (!sesIndex) {
                // menuItem not found - if found we wont register a duplicate
                pNode = me.makeSessionMenuItem(menuItem);
                sessionMenu = vm.get('sessionMenu');
                // level will preserve signout(if enabled) and footer at bottom of menu
                level = ABP.util.Config.getSessionConfig().settings.enableSignOff ? 2 : 1;
                sessionMenu.splice(sessionMenu.length - level, 0, pNode);
                vm.navSet('sessionMenu', sessionMenu);
            }
        }

        // Update the strings that the user can search for, for menu items.
        me.setSearchStore();
    },

    removeMenuItem: function (appId, uniqueId, tree) {
        var me = this;
        var changeMenuItem = me.findMenuItem(appId, uniqueId, tree);
        if (changeMenuItem) {
            if (changeMenuItem.isNode) {
                // Rendered node has been found.
                changeMenuItem.parentNode.removeChild(changeMenuItem);
            } else {
                // The unrendered menu item has been found.
                // Assumed this is ABP.data.TreeData.
                changeMenuItem.remove();
            }
        } else {
            // session menu stuff
            var sesIndex = me.findSessionMenuItem(appId, uniqueId);
            if (sesIndex) {
                var vm = me.getViewModel();
                var sessionMenu = vm.get('sessionMenu');
                sessionMenu.splice(sesIndex, 1);
                vm.navSet('sessionMenu', sessionMenu);
            }
        }
    },

    onUpdateMenuCount: function (appId, uniqueId, data) {
        var me = this;
        var vm = me.getViewModel();

        // Attemnpt to find and update the menu item in the navigation sub-menu - navSearch tree first.
        if (!me.__updateMenuCountForTree(appId, uniqueId, false, data)) {
            // The menu item was not found in navSearch tree. Try the legacy navMenu tree.
            me.__updateMenuCountForTree(appId, uniqueId, true, data);
        }

        // Attemnpt to update the menu item in the favorites sub-menu.
        me.__updateMenuCountForTree(appId, 'fav_' + uniqueId, false, data);

        // Attemnpt to update the menu item in the recommemdeds sub-menu.
        me.__updateMenuCountForTree(appId, 'rec_' + uniqueId, false, data);

        // Attemnpt to update the menu item in the suggesteds sub-menu.
        me.__updateMenuCountForTree(appId, 'sug_' + uniqueId, false, data);

        vm.checkFirstRecentForUpdate(uniqueId, data);
    },
    __updateMenuCountForTree: function (appId, uniqueId, tree, data) {
        var me = this;
        var menuItem = me.findMenuItem(appId, uniqueId, tree);
        if (menuItem) {
            me.__updateMenuCount(menuItem, data);
            return true; // Found.
        }
        return false; // Not found.
    },
    __updateMenuCount: function (menuItem, data) {
        if (menuItem.isNode) {
            // Only want to use a real record's batch changes mechanism, because an underlying data node item not have that.
            menuItem.beginEdit();
        }
        menuItem.set('itemPriority', data.priority);
        menuItem.set('itemCount', data.count);
        if (menuItem.isNode) {
            // Only want to use a real record's batch changes mechanism, because an underlying data node item not have that.
            menuItem.endEdit();
        }
    },

    setSelected: function (button) {
        var mButtons = Ext.ComponentQuery.query('menubutton');
        var i;

        for (i = 0; i < mButtons.length; ++i) {
            if (mButtons[i] !== button) {
                mButtons[i].setSelected(false);
            } else {
                mButtons[i].setSelected(true);
            }
        }
    },

    moveLeft: function () {
        this.fireEvent("featureCanvas_closeAllMenus");
    },
    moveUp: function () {
        var me = this;
        var view = me.getView();
        if (view.currentFocus === -1) {
            view.currentFocus = 0;
            me.focusByPlace(view.currentFocus);
        } else {
            me.move(true, view.currentFocus);
        }
    },
    moveDown: function () {
        var me = this;
        var view = me.getView();
        if (view.currentFocus === -1) {
            view.currentFocus = 0;
            me.focusByPlace(view.currentFocus);
        } else {
            me.move(false, view.currentFocus);
        }
    },
    move: function (up, focus) {
        var me = this;
        var view = me.getView();
        var newFocus;
        var ret;
        if (up) {
            if (focus - 1 >= 0) {
                focus--;
                newFocus = me.findByPlace(focus);
                if (!newFocus.config.enabled) {
                    me.move(true, focus);
                } else {
                    view.currentFocus = focus;
                    me.focusByPlace(view.currentFocus);
                }
            } else {
                view.currentFocus = view.focusItemsCt;
                me.focusByPlace(view.currentFocus);
            }
        } else {
            if (focus + 1 > view.focusItemsCt) {
                view.currentFocus = 0;
                me.focusByPlace(view.currentFocus);
            } else {
                focus++;
                newFocus = me.findByPlace(focus);
                if (!newFocus.config.enabled) {
                    me.move(false, focus);
                } else {
                    view.currentFocus = focus;
                    me.focusByPlace(view.currentFocus);
                }
            }
        }
    },
    tabHit: function () {
        var me = this;
        if (me.getViewModel().get('autohide')) {
            me.getView().currentFocus = 0;
        }
        me.fireEvent('featureCanvas_focusToToolbar');
    },
    enterHit: function () {
        var me = this;
        var view = me.getView();
        var currFocus = view.currentFocus;
        if (currFocus !== -1) {
            me.selectByPlace(currFocus);
        }
    },
    focusByPlace: function (place) {
        var me = this;
        var t = me.findByPlace(place);
        if (t !== null) {
            t.focus();
        }
    },
    selectByPlace: function (place) {
        var me = this;
        var t = me.findByPlace(place);
        if (t !== undefined) {
            t.clickItem();
        }
    },
    findByPlace: function (place) {
        var me = this;
        var view = me.getView();
        var nav = view.down('#main_menu_nav');
        var sess = view.down('#main_menu_session');
        var ret = null;
        for (var i = 0, len = nav.items.items.length; i < len; ++i) {
            if (nav.items.items[i].place === place) {
                ret = nav.items.items[i];
                break;
            }
        }
        for (var i = 0, len = sess.items.items.length; i < len; ++i) {
            if (sess.items.items[i].place === place) {
                ret = sess.items.items[i];
                break;
            }
        }
        return ret;
    },
    UpdateTabIndex: function (startIdx) {
        this.getView().startIdx = startIdx;
        this.getView().dirtyIdx = true;
    },
    preOpen: function (MouseInitiated) {
        var me = this;
        var view = me.getView();
        view.lastInitMouseBool = MouseInitiated;
        if (me.getViewModel().get('autoHide')) {
            view.addCls('main-menu-open');
        } else {
            view.addCls('main-menu-ah');
        }
        me.assignTabs(true);
        if (!MouseInitiated) {
            me.firstFocus();
        }
    },
    ahOpen: function () {
        var me = this;
        me.getView().addCls('main-menu-ahOpen');
    },
    ahClose: function () {
        var me = this;
        me.getView().removeCls('main-menu-ahOpen');
    },
    assignTabs: function (on) {
        var me = this;
        var view = me.getView();
        var nav = view.down('#main_menu_nav');
        var session = view.down('#main_menu_session');

        for (var i = 0, len = nav.items.items.length; i < len - 1; ++i) {
            nav.items.items[i].focusable = on;
            if (!on && document.activeElement.id === nav.items.items[i].id) {
                document.activeElement.blur();
            }
        }
        if (me.getViewModel().data.dockedMenu) {
            nav.items.items[0].tabIndex = 2;
        }
        for (var i = 0, len = session.items.items.length; i < len; ++i) {
            session.items.items[i].focusable = on;
            if (!on && document.activeElement.id === session.items.items[i].id) {
                document.activeElement.blur();
            }
        }
    },
    postClose: function () {
        var me = this;
        var view = me.getView();
        if (me.getViewModel().get('autoHide')) {
            view.removeCls('main-menu-open');
        } else {
            view.removeCls('main-menu-ah');
        }
        me.assignTabs(false);
        me.zeroFocus();
    },
    zeroFocus: function () {
        var view = this.getView();
        view.currentFocus = -1;
    },
    firstFocus: function () {
        var me = this;
        var view = me.getView();
        view.currentFocus = 0;
        me.focusByPlace(0);
    },
    reFocus: function () {
        var me = this;
        var view = me.getView();
        me.focusByPlace(view.currentFocus);
    },
    menuButtonClick: function (Button) {
        var me = this;
        var i;
        var task;
        var trueButton = Button;
        if (trueButton.type === undefined) {
            if (trueButton.config.type) {
                trueButton = trueButton.config;
            }
        }
        switch (trueButton.type) {
            case 'event':
                me.setSelected(Button);
                if (trueButton.children && trueButton.children.length > 0) {
                    if (ABP.util.Common.getModern()) {
                        me.makeSubMenu(Button);
                    } else {
                        me.fireEvent('submenu_lineChange', trueButton.uniqueId);
                        me.fireEvent('featureCanvas_openSubMenu');
                    }
                } else {
                    if (ABP.util.Common.getClassic()) {
                        if (me.getViewModel().get('autoHide') && Button.xtype !== "menutoggle") {
                            me.fireEvent('session_closeMenu');
                        } /*else {
                            me.fireEvent('featureCanvas_closeSubMenu');
                            task = new Ext.util.DelayedTask();
                            task.delay(75, function (me) { this.setSelected(null); }, me, null);

                        }*/
                    } else {
                        me.fireEvent('session_closeMenu');
                    }

                }
                if ((trueButton.command !== undefined) && (trueButton.command !== '') && (trueButton.command !== null)) {
                    if (trueButton.appId instanceof Array) {
                        for (i = 0; i < trueButton.appId.length; ++i) {
                            me.fireEvent('main_fireAppEvent', trueButton.appId[i], trueButton.command[i], trueButton.args[i], trueButton.activateApp);
                        }
                    } else {
                        me.fireEvent('main_fireAppEvent', trueButton.appId, trueButton.command, trueButton.args, trueButton.activateApp);
                    }
                }
                break;
            default:
                me.setSelected(trueButton);
                me.fireEvent('submenu_lineChange', trueButton);
                me.fireEvent('featureCanvas_openSubMenu');
                break;
        }
    },

    makeSubMenu: function (button) {
        var sub = Ext.widget('submenu', { menuButtons: button.getChildren() });
        sub.showBy(button, 'bl-br');
    },

    mobileSessionToggle: function () {
        var me = this;
        var view = me.getView();
        var sessMenu = view.down('#main_menu_session');
        var sessItems;
        var seperator;
        if (sessMenu) {
            sessItems = sessMenu.innerItems;
            seperator = sessItems[0];
            // if (seperator.getCls().indexOf('fa-caret-up') > -1) {
            if (seperator.hasCls('fa-caret-up')) {
                for (var i = 1, len = sessItems.length; i < len; ++i) {
                    sessItems[i].show();
                }
                seperator.removeCls('fa-caret-up');
                seperator.addCls('fa-caret-down');
            } else {
                for (var i = 1, len = sessItems.length; i < len; ++i) {
                    sessItems[i].hide();
                }
                seperator.removeCls('fa-caret-down');
                seperator.addCls('fa-caret-up');
            }
        }
    },

    __toggleNavType: function () {
        var me = this;
        var view = me.getView();
        var menu = view.down('treelistmenu');
        var store = menu.getBind().store.getValue().getStoreId();
        if (store === 'navSearch') {
            me.setMenuNavTree();
        } else {
            me.setMenuNavSearch();
        }
    },
    setMenuNavTree: function () {
        var me = this;
        var view = me.getView();
        var vm = me.getViewModel();
        var menu = view.down('treelistmenu');
        menu.setBind({
            store: null
        });
        menu.setBind({
            store: '{navTree}'
        });
        vm.switchNav('tree');
    },
    setMenuNavSearch: function () {
        var me = this;
        var view = me.getView();
        var vm = me.getViewModel();
        var menu = view.down('treelistmenu');
        menu.setBind({
            store: null
        });
        menu.setBind({
            store: '{navSearch}'
        });
        vm.switchNav('search');
    },
    __sanitizeUniqueId: function (uniqueId) {
        return uniqueId.replace('fav_', '').replace('sug_', '').replace('rec_', '');
    },
    __prepareObjectForABPAreas: function (object, toPrepend) {
        if (object.data && object.data.serialData) {
            var copy = Ext.clone(object.data.serialData);
            copy.uniqueId = toPrepend + this.__sanitizeUniqueId(copy.uniqueId);
            return copy;
        } else if (object.uniqueId) {
            var copy = Ext.clone(object);
            copy.uniqueId = toPrepend + this.__sanitizeUniqueId(copy.uniqueId);
            return copy;
        } else {
            object.uniqueId = toPrepend + ABP.util.IdCreator.getId(object);
            return object;
        }
    },
    __addRecent: function (pageInfo) {
        //push, limit (configurable)), first is hidden
        // first would be current page
        var me = this;
        var vm = me.getViewModel();
        var navStore = vm.getStore('navSearch');
        var node = navStore.getNodeById('container_nav-recent');
        var nodeToAdd = {};
        var changes = {};
        if (node) {
            pageInfo = me.__prepareObjectForABPAreas(pageInfo, 'rec_');
            nodeToAdd = me.makeMenuTreeItem(pageInfo, 1, true);
            changes = vm.addRecentPage(nodeToAdd);
            if (changes) {
                if (!Ext.isEmpty(changes.added)) {
                    node.insertChild(0, changes.added[0]);
                }
                if (!Ext.isEmpty(changes.removed)) {
                    node.removeChild(node.getChildAt(changes.removed[0]));
                }
                me.__checkNodeForChildren(node);
            }
            // Fire Event that recents have updated for anyone listening
            me.fireEvent('abp_updatedRecents');
            // Update Local Storage
            me.__saveRecentsToLocalStorage();
        }
    },

    __saveRecentsToLocalStorage: function () {
        var me = this;
        var vm = me.getViewModel();
        var recentPages = vm.get('recentPages');
        //save in local storage
        if (!Ext.isEmpty(recentPages)) {
            var toEncode = [];
            for (var i = 0; i < recentPages.length; ++i) {
                if (recentPages[i].serialData) {
                    toEncode.push(recentPages[i].serialData);
                }
            }
            if (!Ext.isEmpty(toEncode)) {
                var jsonEncode = Ext.JSON.encode(recentPages);
                // Store is user-specific local storage.
                ABP.util.LocalStorage.setForLoggedInUser('ABPCore_recentPages', jsonEncode);
            }
        }
    },

    __setRecents: function (recentsArray) {
        if (Ext.isArray(recentsArray) && !Ext.isEmpty(recentsArray)) {
            var me = this;
            var vm = me.getViewModel();
            var recentsToPassToModel = [];
            for (var recentsItter = 0; recentsItter < recentsArray.length; recentsItter++) {
                recentsToPassToModel.push(me.makeMenuTreeItem(recentsArray[recentsItter], 1, true));
            }
            var toAdd = vm.setInitialRecents(recentsToPassToModel);
            if (Ext.isArray(toAdd) && !Ext.isEmpty(toAdd)) {
                var navStore = vm.getStore('navSearch');
                var node = navStore.getNodeById('container_nav-recent');
                for (var toAddItter = 0; toAddItter < toAdd.length; toAddItter++) {
                    node.appendChild(toAdd[toAddItter]);
                }
                me.__checkNodeForChildren(node);
            }
        }
    },

    __addFavorite: function (pageInfo, saveRequest) {
        var me = this;
        var vm = me.getViewModel();
        var navStore = vm.getStore('navSearch');
        var node = navStore.getNodeById('container_nav-favorites');
        if (node) {
            var id = pageInfo.data.id;
            pageInfo = me.__prepareObjectForABPAreas(pageInfo, 'fav_');
            // Adding a favorite is always under the top-level 'favorite' node, so there is no chance 
            // that lazyFill:true will cause the top-level 'favorite' node to not exist. Therefore appendChild is safe.
            node.appendChild(me.makeMenuTreeItem(pageInfo, 1, false, 'favorite'));
            
            var args = {
                isFavorite: true,
                appId: pageInfo.appId,
                nodeId: id
            };

            if (saveRequest !== false) {
                me.saveFavorites();

                ABP.util.BroadcastChannel.send('abp-core-favorite', args);
            }

            Ext.ABPEvents.fireEvent(ABP.Events.favoritesUpdated, args);

            if (ABP.util.Common.getClassic()) {
                // Toggle the animation.
                var tree = me.getView().down('treelistmenu');
                var favItem = tree.getItem(node);
                // If null, we are showing the other side of the menu and don't need to animate.
                if (favItem) {
                    favItem.addCls('animate-starburst');
                    setTimeout(function () {
                        favItem.removeCls('animate-starburst');
                    }, 750);
                }
            }
        }
        me.__checkNodeForChildren(node);
    },

    __removeFavorite: function (appId, uniqueId, saveRequest) {
        var me = this,
            nodeToRemove;
        var vm = me.getViewModel();
        var navStore = vm.getStore('navSearch');
        var favNode = navStore.getNodeById('container_nav-favorites');

        // TODO: Once the new lazyFill:true code has been bedded in and known to be bug free, remove the else here, and remove the test for lazyFill. If "then" branch should be able to handle both cases.
        if (navStore.lazyFill) {
            // Found the parent. Go down looking for a child node or data that matches the criteria.
            nodeToRemove = me.findTreeStoreItemInChildren(favNode, 'id', 'fav_' + uniqueId);
        } else {
            // All nodes will be present for all the data. Can use Ext NodeInterface method.
            nodeToRemove = favNode.findChild('id', 'fav_' + uniqueId, true);
        }

        if (nodeToRemove) {
            /* TODO:
            *   This logic may change depending on design input.
            *   For now, if a node is removed and it was the only node within a folder, remove the folder.
            *   Move up to the parent and do the same until we arrive at the root.
            *   In the future it may be the case that these folders are simply hidden in nav but are shown in the favorite's manager.
            */
            this.__removeEmptyParent(nodeToRemove, navStore);
            nodeToRemove.remove();

            var args = {
                isFavorite: false,
                appId: appId,
                nodeId: uniqueId
            };

            if (saveRequest !== false) {
                me.saveFavorites();

                ABP.util.BroadcastChannel.send('abp-core-favorite', args);
            }

            Ext.ABPEvents.fireEvent(ABP.Events.favoritesUpdated, args);
        }
        if (ABP.util.Common.getClassic() && favNode && favNode.childNodes.length) {
            // toggle the animation
            var tree = me.getView().down('treelistmenu');
            var favItem = tree.getItem(favNode); // It is ok if this fails because lazyFill:true, because there is no visual node to animate in that case.
            // if null, we are showing the other side of the menu and don't need to animate
            if (favItem) {
                favItem.addCls('animate-starburst-min');
                setTimeout(function () {
                    favItem.removeCls('animate-starburst-min');
                }, 750);
            }
        }
    },

    onFavoriteMessageRecieved: function(msg){
        var data = msg.data;
        if (data.isFavorite) {
            var node = ABP.util.Common.getMenuItem(data.appId, data.nodeId, false);
            this.__addFavorite(node, false);
        } else {
            this.__removeFavorite(data.appId, data.nodeId, false);
        }
    },

    __removeEmptyParent: function (node, store) {
        var me = this;
        var favNodeId = 'container_nav-favorites';
        // When the store is lazyFill:true, then things are more complex because there are a combination of nodes and unrendered data.
        // TODO: Once the new lazyFill:true code has been bedded in amd known to be bug free, remove the else here, and remove the test for lazyFill. If "then" branch should be able to handle both cases.
        if (store.lazyFill) {
            // Stop if we are about to remove the top-level favorites node. Ext.data.TreeModel and ABP.data.TreeData have their parent ids in a different place.
            var parentId = node.isNode ? (node.parentNode ? node.parentNode.id : null) : node.parentId;
            if (parentId === favNodeId) {
                return;
            }
            // Find the parent and see if it has only 1 child.
            // Unfortunately, there isn't a way to climb back up a data hierarchy,
            // so we have to find the parent item by id each time.
            var parentNode = me.findTreeStoreItem(store, 'id', parentId);
            if (parentNode) {
                var numChildren = 0;
                if (parentNode.isNode) {
                    // A node can have both childNodes and its data can have children.
                    numChildren += parentNode.childNodes ? parentNode.childNodes.length : 0;
                } else {
                    // A data node 
                    parentNodeData = parentNode;
                }
                // Add in data children data.
                // TODO: Do we need to not count data child duplicates if they are already nodes? Is this even possible to be showing some children and not all? I assume not.
                var parentNodeData = parentNode.data ? parentNode.data : parentNode;
                if (parentNodeData && Ext.isArray(parentNodeData.children)) {
                    numChildren += parentNodeData.children.length;
                }
                // If exactly one child, the current node, then remove this parent.
                if (numChildren === 1) {
                    // Have to work up the hierarchy, because grandparents may have only 1 node too.
                    me.__removeEmptyParent(parentNode, store);
                    // Now remove the parent.
                    if (parentNode.parentNode && parentNode.parentNode.id === favNodeId) {
                        // About to remove an empty group which is hanging directly off the root favorite node.
                        // Since this store is lazy filled, we should also update the favorite node's data object.
                        // If we do not it may wind up in the serialized data and mess up CRUD operations.
                        var favoriteRootNode = parentNode.parentNode;
                        var favoriteRootNodeChildren = favoriteRootNode.data.children;
                        var length = Ext.isArray(favoriteRootNodeChildren) ? favoriteRootNodeChildren.length : 0;
                        for (var i = 0; i < length; i++) {
                            var currentChild = favoriteRootNodeChildren[i];
                            if (currentChild.id === parentNode.id) {
                                Ext.Array.removeAt(favoriteRootNodeChildren, i);
                            }
                        }
                    }
                    parentNode.remove();
                }
            }
        } else {
            // Stop if we are about to remove the top-level favorites node.
            if (!node.parentNode || node.parentNode.id === favNodeId) {
                return;
            }
            // If exactly one child, the current node, then remove this parent.
            if (node.parentNode.childNodes && node.parentNode.childNodes.length === 1) {
                // Have to work up the hierarchy, because grandparents may have only 1 node too.
                me.__removeEmptyParent(node.parentNode, store);
                // Now remove the parent.
                node.parentNode.remove();
            }
        }
    },

    __updateFavorites: function (favoritesArray, saveRequest) {
        var me = this;
        var vm = me.getViewModel();
        var navStore = vm.getStore('navSearch');
        var node = navStore.getNodeById('container_nav-favorites');
        var i = 0;

        if (favoritesArray) {
            if (!Ext.isArray(favoritesArray)) {
                if (ABP.util.Common.isJsonString(favoritesArray)) {
                    favoritesArray = Ext.JSON.decode(favoritesArray);
                }
                else {
                    favoritesArray = [favoritesArray];
                }
            }
            if (node) {
                node.removeAll();
                // It is not good enough to just remove the node's child nodes. The underlying data may still be in the data.children.
                node.data.children = [];
            }
            for (i = 0; i < favoritesArray.length; ++i) {
                var copy = me.__prepareObjectForABPAreas(favoritesArray[i], 'fav_');
                node.appendChild(me.makeMenuTreeItem(copy, 1, false, 'favorite'));
            }
            if (saveRequest !== false) {
                me.saveFavorites();
            }
            me.__checkNodeForChildren(node);
            if (ABP.util.Common.getClassic() && node && node.childNodes.length) {
                // toggle the animation
                var tree = me.getView().down('treelistmenu');
                var favItem = tree.getItem(node);
                // if null, we are showing the other side of the menu and don't need to animate
                if (favItem) {
                    favItem.addCls('animate-fav-update');
                    setTimeout(function () {
                        favItem.removeCls('animate-fav-update');
                    }, 750);
                }
            }
        }
    },

    __replaceSuggested: function (pageInfoArray) {
        //clear and replace
        //limit 5
        var me = this;
        var vm = me.getViewModel();
        var navStore = vm.getStore('navSearch');
        var node = navStore.getNodeById('container_nav-suggested');
        var i = 0;
        if (node) {
            node.removeAll();
            // It is not good enough to just remove the node's child nodes. The underlying data may still be in the data.children.
            node.data.children = [];
            if (Ext.isArray(pageInfoArray)) {
                for (i; i < pageInfoArray.length; ++i) {
                    var copy = me.__prepareObjectForABPAreas(pageInfoArray[i], 'sug_');
                    node.appendChild(me.makeMenuTreeItem(copy, 1));
                }
            } else {
                var copy = me.__prepareObjectForABPAreas(pageInfoArray, 'sug_');
                node.appendChild(me.makeMenuTreeItem(copy, 1));
            }
            if (ABP.util.Config.getSessionConfig().settings.mainMenuSuggestedAutoExpand) {
                if (!node.isExpanded()) {
                    node.expand();
                }
            }
            me.__checkNodeForChildren(node);
        }
    },
    __addTreeOption: function (treeObject) {
        var me = this;
        var i = 0;
        if (!Ext.isArray(treeObject)) {
            me.addMenuItem(treeObject, true, treeObject.parentAppId, treeObject.parentId, true);
        } else {
            for (i; i < treeObject.length; ++i) {
                me.addMenuItem(treeObject[i], true, treeObject[i].parentAppId, treeObject[i].parentId, true)
            }
        }
        me.setSearchStore();
    },
    __removeTreeOption: function (appId, uniqueId) {
        var me = this;
        me.removeMenuItem(appId, uniqueId, true);
        me.setSearchStore();
    },
    __checkNodeForChildren: function (node) {
        if (node.childNodes && node.childNodes.length > 0) {
            node.set('hidden', false);
        } else {
            node.set('hidden', true);
        }
    },
    /** Monitor the user pressing keys within the searh textbox.
     *
     * Up / Down ... cycle through the search results items
     * Esc ... close / cancel the search
     * Tab ... move the focus to the search results
     */
    onSearchKeyDown: function (e) {
        var me = this;
        var keyCode = e.getKey();

        if (keyCode === e.DOWN) {
            me.moveSelectedSearchResult(1);
            e.stopEvent();
        }
        else if (keyCode === e.UP) {
            me.moveSelectedSearchResult(-1);
            e.stopEvent();
        }
        else if (keyCode === e.ENTER) {
            if (!me.isSearchResultsVisible()) {
                me.searchNav();
            }
            else {
                var vm = me.getViewModel();
                var record = vm.get('selectedSearchResult');
                me.fireSearchResultSelected(record);
            }
        }
        else if (keyCode === e.TAB) {
            if (me.focusSearchResults()) {
                e.stopEvent();
            }
        }
        else if (keyCode === e.ESC) {
            me.resetSearchField();
        }
        else if (keyCode === 191 && e.altKey) {
            this.fireEvent('abp_jumpto_show');
            e.stopEvent();
        }
        else if (keyCode === e.ALT) {
            me.__toggleMenuShortcuts();
            e.stopEvent();
        }
    },

    /** Monitor the user pressing keys within the searh results list.
     *
     * Esc ... close / cancel the search
     * shift+Tab ... move the focus to the search textbox
     * ALT+ENTER ... open in a new tab if new tab functionality is present
     */
    onSearchResultsKeyDown: function (e) {
        var me = this;
        var keyCode = e.getKey();

        if (keyCode === e.TAB) {
            var view = this.getView();
            var searchText = view.down('#navSearchField');
            if (searchText) {
                searchText.focus();
            }
            e.stopEvent();
        }
        else if (keyCode === e.ESC) {
            var view = this.getView();

            //me.resetSearchField();
            me.closeSearchResults();

            var searchText = view.down('#navSearchField');
            if (searchText) {
                searchText.selectText();
                searchText.focus();
            }
        } else if (e.altKey && keyCode === e.ENTER) {
            if (e.record.data.href) {
                e.item.firstElementChild.lastElementChild.click();
            }
        }
    },

    onSearchResultHighlighted: function (view, node) {
        var me = this;
        var vm = me.getViewModel(),
            v = me.getView();

        var store = vm.getStore("searchTree");

        var recordIndex = node.dataset['recordindex'];
        var selected = store.getAt(recordIndex);
        vm.set('selectedSearchResult', selected);

        // if (selected) {
        //     ABP.util.Aria.setActiveDecendant(v.down('#navSearchField'),  selected.id);
        // }
        // else {
        //     ABP.util.Aria.setActiveDecendant(v.down('#navSearchField'),  '');
        // }
    },

    searchNav: function () {
        var me = this;
        var view = me.getView();
        var vm = me.getViewModel();
        var searchField = view.down('#navSearchField');
        var searchText = searchField.getValue();
        var searchStore = vm.getStore("searchTree");
        var currentRecordId = me.getSelectedSearchId();
        var useSoundEx = true;

        if (searchText.trim() != "") {
            me.removeSearchFilters(searchStore, false);

            //console.log("filtering by: " + searchText.trim());
            var settings = ABP.util.Config.getSessionConfig().settings;
            if (settings.mainMenuNavSearchDisableSoundex !== undefined) {
                useSoundEx = !settings.mainMenuNavSearchDisableSoundex;
            }

            // Get the text filter object based on the selection
            var filters = [];
            var filterFunction = ABP.util.filters.Factory.createStringFilter(searchText.trim(), [{ name: 'shorthand', useSoundex: false }, { name: 'text', useSoundEx: useSoundEx }], true);
            filters.push({ id: 'TextFilter', filterFn: filterFunction });

            // Get the de-duplication filter
            if (settings.mainMenuNavSearchDuplicateFields) {
                var dupFilterFunction = ABP.util.filters.Factory.createDuplicationFilter(settings.mainMenuNavSearchDuplicateFields);
                filters.push({ id: 'DupFilter', filterFn: dupFilterFunction });
            }

            ABP.util.Stopwatch.start();

            // filter the store passing the bound filter function
            searchStore.filter(filters);

            ABP.util.Stopwatch.lap('Filter Applied');

            searchStore.sort('text', 'ASC');
            if (!settings.mainMenuNavSearchDisableRelevance) {
                searchStore.sort('_relevance', 'DESC');
            }

            ABP.util.Stopwatch.lap('Store Sorted');
            ABP.util.Stopwatch.stop();

            if (searchStore.getCount() > 0) {
                me.setSelectedSearchId(currentRecordId);

                var searchResults = view.down('#searchResultsView');
                if (searchResults) {
                    searchResults.showBy(searchField, 'bl');
                } else {
                    me.addNavSearchResultsElement();
                    searchResults = view.down('#searchResultsView');
                    searchResults.showBy(searchField, 'bl');
                }

                ABP.util.Aria.setExpanded(searchField, true);
                searchField.focus();
            } else {
                me.removeSearchFilters(searchStore, true);
                ABP.util.Aria.setExpanded(searchField, false);
            }
        } else {
            // empty clear filters
            me.removeSearchFilters(searchStore, true);
            ABP.util.Aria.setExpanded(searchField, false);
        }
    },

    removeSearchFilters: function (store, closePopup) {
        store.removeFilter('TextFilter');
        store.removeFilter('DupFilter');

        if (closePopup) {
            this.closeSearchResults();
        }
    },

    /**
     * Populates the searchTree store with seachable text from all the menu items that are not simple branches.
     */
    setSearchStore: function () {
        var me = this;
        var vm = me.getViewModel();
        var searchStore = vm.getStore("searchTree");

        // Clear any existing search data.
        searchStore.removeAll();

        // Process the two nav stores, adding searchable items to the flat search store.
        var items = me.buildSearchItemsForStore(vm.getStore('navTree'));
        if (!Ext.isEmpty(items)) {
            searchStore.add(items);
        }
        var items = me.buildSearchItemsForStore(vm.getStore('navSearch'));
        if (!Ext.isEmpty(items)) {
            searchStore.add(items);
        }
    },

    /**
     * Creates a flat array of tree store items ready for inclusion to the search store.
     * Starts at the supplied store and works down through its top-level nodes.
     * @param {Ext.data.TreeStore} store The store to process.
     * @result {Object[]} Flattened array of search items.
     */
    buildSearchItemsForStore: function (store) {
        var me = this,
            ret = [];

        var root = store.getRoot();
        Ext.Array.push(ret, me.buildSearchItems(root));

        return ret;
    },

    /**
     * Creates a flat array of tree store items ready for inclusion to the search store.
     * Used to text match the names of menu items as the user enters them.
     * Starts at the supplied node and works down, being careful to both include
     * child node and unrendered child data (when lazyFill:true), while ensuring 
     * there are no duplicates between the child nodes and the child data.
     * @param {Ext.data.TreeModel/Object} item The node or data to serialize.
     * @result {Object[]} Flattened array of search items.
     */
    buildSearchItems: function (item, hierarchyString) {
        var me = this,
            ret = [],
            hierarchyString = hierarchyString ? hierarchyString : "";

        // The item can be either a node or an underlying data object.
        var itemData = item.isNode ? item.data : item;

        // Ignore the topmost root item - this is not a item that appears in the tree, just a parent to everything.
        if (!item.isRoot || !item.isRoot()) {
            // Process the item. The children have to be done separately to prevent duplicates.
            me.buildSearchData(itemData, hierarchyString, ret);

            // The hierarchyString reflects all nodes above this one in the tree, regardless of whether they are searchable nav items or not. 
            if (hierarchyString) {
                hierarchyString += ' / ' + itemData.text;
            } else {
                hierarchyString = itemData.text;
            }
        }

        // Get child nodes, if any.
        var childNodes = item.childNodes;
        var len = Ext.isArray(childNodes) ? childNodes.length : 0;
        for (var i = 0; i < len; i++) {
            // Recurse down through the child nodes.
            Ext.Array.push(ret, me.buildSearchItems(childNodes[i], hierarchyString));
        }

        // Get child data, but don't duplicate any items from the child nodes.
        var childData = itemData.children;
        var len = Ext.isArray(childData) ? childData.length : 0;
        for (var i = 0; i < len; i++) {
            // Only add this data item if its id is not already been added because it is a child node.
            // Test for "findChild" method because the item may not be a node, only data.
            if (!item.findChild || !item.findChild('id', childData[i].id, false)) {
                // Recurse down through the data nodes.
                Ext.Array.push(ret, me.buildSearchItems(childData[i], hierarchyString));
            }
        }

        return ret;
    },

    buildSearchData: function (data, hierarchyString, ret) {
        var me = this;
        if (!data) {
            return;
        }
        if (data.event || data.hash || data.itemHref) {
            // This is a searchable nav item so add it to the search store.
            var item = {
                appId: data.appId,
                itemId: data.itemId,
                text: data.text,
                hierarchy: hierarchyString,
                activateApp: data.activateApp,
                iconCls: data.iconCls,
                shorthand: data.shorthand,
                href: data.itemHref
            }
            if (data.hash) {
                item.hash = data.hash;
            }
            if (data.event) {
                item.event = data.event;
                item.eventArgs = data.eventArgs;
            }
            ret.push(item);
        }
    },

    /**
     * The Ext.data.TreeStore.find function does not work down the heirarchy of tree data, it only works down the heirarchy of nodes. 
     * It also does not find unrendered (i.e. no node) children of nodes. Nodes will only exist if the TreeStore has lazyFill: false, or the user has shown those items. 
     * 
     * This method finds an item within both the node and data heirarchies, which covers all tree items whether they are rendered or not. 
     * 
     * If the item is found then either a node record is returned (Ext.data.TreeModel) because it is rendered,
     * or an a TreeModel-like object is return (ABP.data.TreeData) encapsulating the underlying data.
     * Note: ABP.data.TreeData is simple and does not try to be a functionally complete copy of Ext.data.TreeModel.
     * 
     * If the result object has isData (a boolean property) then it is an ABP.data.TreeData. If the result object has isNode (a boolean property) then it is an Ext.data.TreeModel object.
     *
     * The propertyName and value can be provided or a comparitorFn.
     * @param {Ext.data.TreeStore} store The Ext.data.TreeStore
     * @param {String} propertyName (Optional) The name of the property to compare. Defaults to 'id'. Used if the value parameter is provided.
     * @param {String} value (Optional) The value to search propertyName for. Used in conjunction with the propertyName parameter. If not specified then supply the comparitorFn function parameter.
     * @param {Function} comparitorFn (Optional) A function to call as the comparitor. The first parameter passed to this function is either an Ext.data.TreeModel or an ABP.data.TreeData. Return true if it is a match, else false. If not specified then provide a value, and optionally a propertyName.
     * @param {Object} scope (Optional) The scope ("this" reference) in which the comparitorFn function is executed.
     * @param {Number} level The level in the tree node or data hierarchy. Pass in null and let the recursion work that out.
     * @return {Ext.data.TreeModel/ABP.data.TreeData} If the item is found then either a node record is returned (Ext.data.TreeModel) because it is rendered, or an a TreeModel-like object is returned (ABP.data.TreeData) encapsulating the underlying data.
     */
    findTreeStoreItem: function (store, propertyName, value, comparitorFn, scope, level) {
        var me = this;
        var found = false;

        var root = store.getRoot();
        if (!root) {
            return;
        }
        level = level || 0; // 0 == root.
        propertyName = propertyName || 'id';
        var result = me.findTreeStoreItemInChildren(root, propertyName, value, comparitorFn, scope, level);

        return result;
    },

    /**
     * Recursive child function of findTreeStoreItem.
     * See findTreeStoreItem for description and arguments.
     * @param {*} items Must be an array of Ext.data.TreeModel or a simple array of data elements.
     * @param {*} propertyName See findTreeStoreItem.
     * @param {*} value See findTreeStoreItem.
     * @param {*} comparitorFn See findTreeStoreItem.
     * @param {*} scope See findTreeStoreItem.
     * @param {*} level See findTreeStoreItem.
     * @param {*} parentItem See findTreeStoreItem.
     * @results {*} See findTreeStoreItem.
     */
    findTreeStoreItemInArray: function (items, propertyName, value, comparitorFn, scope, level, parentItem) {
        var me = this;
        var found = false;
        var result;

        if (Ext.isArray(items)) {
            for (var i = 0, len = items.length; i < len && !result; i++) {
                var item = items[i];
                var itemData = item.isNode ? item.data : item; // The item can be either a node or an underlying data object.
                var resultCandidate; // A node-like object used to encapsulate an underlying data object.

                // Check if this item is a match.
                if (comparitorFn) {
                    // comparitor always gets a node or node-like-object (ABP.data.TreeData)
                    // So if this item is just underlying data, then create a ABP.data.TreeData object before passing to the comparitorFn.
                    if (!item.isNode) {
                        resultCandidate = Ext.create('ABP.data.TreeData', {
                            data: itemData,
                            parentDataArray: items,
                            index: i,
                            level: level,
                            parentId: parentItem ? parentItem.id : null
                        });
                        found = comparitorFn.call(scope || me, resultCandidate);
                    } else {
                        found = comparitorFn.call(scope || me, item);
                    }
                } else if (itemData[propertyName] === value) {
                    found = true;
                }

                // If found then return a node or node-like-object.
                if (found) {
                    if (item.isNode) {
                        result = item; // item is already a proper node.
                    } else {
                        // item is an underlying data object. 
                        // Create a ABP.data.TreeData object before returning it, unless a ABP.data.TreeData has already been created as part of the comparison logic above.
                        if (resultCandidate) {
                            result = resultCandidate;
                        } else {
                            result = Ext.create('ABP.data.TreeData', {
                                data: itemData,
                                parentDataArray: items,
                                index: i,
                                level: level,
                                parentId: parentItem ? parentItem.id : null
                            });
                        }
                    }
                } else {
                    // Otherwise go down into the childNode data and then the data children recursively. 
                    result = me.findTreeStoreItemInChildren(item, propertyName, value, comparitorFn, scope, level + 1);
                }
            }
        }
        return result;
    },

    /**
     * Search the provided item's children - both child nodes and children data.
     * 
     * The provided item can be:
     * 1. An Ext.data.TreeModel.
     * 2. An ABP.data.TreeData.
     * 3. A simple data object that has a "children" property.
     * 
     * See findTreeStoreItem for description and arguments.
     * @param {Ext.data.TreeModel/ABP.data.TreeData/Object} item The object to search down from.
     * @param {*} propertyName See findTreeStoreItem.
     * @param {*} value See findTreeStoreItem.
     * @param {*} comparitorFn See findTreeStoreItem.
     * @param {*} scope See findTreeStoreItem.
     * @param {*} level See findTreeStoreItem.
     * @return {*} See findTreeStoreItem.
     */
    findTreeStoreItemInChildren: function (item, propertyName, value, comparitorFn, scope, level) {
        var me = this;
        var result;

        if (Ext.isEmpty(item)) {
            return;
        }

        // Go down into the childNode data and then the data children recursively. 
        // Although a node might exist, its child data may not be a node yet. So have go down all the node trees
        if (Ext.isArray(item.childNodes) && item.childNodes.length > 0) {
            // The node tree first.
            result = me.findTreeStoreItemInArray(item.childNodes, propertyName, value, comparitorFn, scope, level + 1, item);
        }
        if (!result) {
            // Still not found. Try the data tree next.
            var itemData = item.data ? item.data : item; // The item can be either a node or an underlying data object.
            if (Ext.isArray(itemData.children) && itemData.children.length > 0) {
                result = me.findTreeStoreItemInArray(itemData.children, propertyName, value, comparitorFn, scope, level + 1, item);
            }
        }

        return result;
    },

    // Note: Original setSearchStore. Left in case of problems with lazyFill:true and the new setSearchStore.
    setSearchStoreOrig: function () {
        var me = this;
        var vm = me.getViewModel();
        var searchStore = vm.getStore("searchTree");
        var navTreeStore = vm.getStore('navTree');
        var navRoot = navTreeStore.getRoot();
        // Cascade through root of Tree and flat add items to searchTree
        searchStore.removeAll();
        if (navRoot) {
            navRoot.cascade(function (node) {
                var parentNode = node;
                var hierarchy = [];
                var text = '';
                var hierarchyString = '';
                var i = 0;
                if (node.data.event || node.data.hash || node.data.itemHref) {
                    for (; ;) {
                        if (!parentNode.isRoot()) {
                            hierarchy.splice(0, 0, parentNode.data.text);
                            parentNode = parentNode.parentNode;
                        } else {
                            break;
                        }
                    }
                    if (!Ext.isEmpty(hierarchy)) {
                        // make hierarchy into a single '/' separated string
                        // -1 - the last index is the searchable text
                        for (i = 0; i < hierarchy.length - 1; ++i) {
                            if (i !== 0) {
                                hierarchyString += ' / ';
                            }
                            hierarchyString += hierarchy[i];
                        }
                        text = hierarchy[hierarchy.length - 1];
                    }

                    var searchMenuItem = {
                        appId: node.data.appId,
                        itemId: node.data.itemId,
                        shorthand: node.data.shorthand,
                        text: text,
                        hierarchy: hierarchyString,
                        activateApp: node.data.activateApp,
                        iconCls: node.data.iconCls
                    };
                    if (node.data.hash) {
                        searchMenuItem.hash = node.data.hash;
                    } else {
                        searchMenuItem.event = node.data.event;
                        searchMenuItem.eventArgs = node.data.eventArgs;
                    }

                    searchStore.add(searchMenuItem);
                }
            });
        }

        var x = me.getNavMenuSearchItems();
        if (!Ext.isEmpty(x)) {
            searchStore.add(x);
        }
    },
    getNavMenuSearchItems: function () {
        var me = this;
        var vm = me.getViewModel();
        var mainNavStore = vm.getStore("navSearch");
        var mainNavRoot = mainNavStore.getRoot();
        var ret = [];
        mainNavRoot.cascade(function (node) {
            var parentNode = node;
            var hierarchy = [];
            var text = '';
            var hierarchyString = '';
            var i = 0;
            if (node.data.event) {
                for (; ;) {
                    if (!parentNode.isRoot()) {
                        hierarchy.splice(0, 0, parentNode.data.text);
                        parentNode = parentNode.parentNode;
                    } else {
                        break;
                    }
                }
                if (!Ext.isEmpty(hierarchy)) {
                    // make hierarchy into a single '/' separated string
                    // -1 - the last index is the searchable text
                    for (i = 0; i < hierarchy.length - 1; ++i) {
                        if (i !== 0) {
                            hierarchyString += ' / ';
                        }
                        hierarchyString += hierarchy[i];
                    }
                    text = hierarchy[hierarchy.length - 1];
                }
                ret.push({
                    appId: node.data.appId,
                    itemId: node.data.itemId,
                    event: node.data.event,
                    eventArgs: node.data.eventArgs,
                    text: text,
                    hierarchy: hierarchyString,
                    activateApp: node.data.activateApp,
                    iconCls: node.data.iconCls,
                    shorthand: node.data.shorthand
                });
            }
        });
        return ret;
    },

    onSearchLostFocus: function (lost, event, eOpts) {
        var me = this;
        var view = me.getView();
        var searchResults = view.down('#searchResultsView');
        var toComp, toId;
        if (event && event.toComponent) {
            toComp = event.toComponent;
            toId = (toComp.itemId) ? toComp.itemId : toComp.id;
            if (toId && (toId === "navSearchField" || toId === "searchResultsView")) {
                // Focus moving to the search results, do not close popup.
                return;
            }
        }

        me.closeSearchResults()
    },

    /**
     * Handler for window resizing - potentially sets a new maxHeight on the search results view.
     */
    onSearchResultReactWindowResize: function (width, height, searchResultsView) {
        this.onSearchResultResize(searchResultsView);
    },

    /**
     * Search results view resizing - set a maxHeight if necessary so that it becomes scrollable.
     */
    onSearchResultResize: function (searchResultsView, width, height) {
        // Not yet rendered.
        if (!searchResultsView || searchResultsView.isHidden() || height === 1) {
            return;
        }
        var calcMaxHeight = Ext.getViewportHeight() - searchResultsView.getY();
        if (searchResultsView.getMaxHeight() !== calcMaxHeight) {
            searchResultsView.setMaxHeight(calcMaxHeight);
        }
    },

    onSearchResultSelectionChanged: function (cmp, selected) {
        var v = this.getView();
        if (selected.length > 0) {
            ABP.util.Aria.setActiveDecendant(v.down('#navSearchField'), selected[0].id);
            // Performs an opening icon flip if href is present
            if (selected[0].data.href) {
                var currentElement = cmp.view.getNodeByRecord(selected[0]);
                if (currentElement) {
                    this.onIconHover(null, currentElement);
                }
            }
        }
        else {
            ABP.util.Aria.setActiveDecendant(v.down('#navSearchField'), '');
        }
    },

    onSearchResultClick: function (clicked) {
        var me = this;
        var targetClassList = clicked.target.className;
        if (targetClassList.indexOf('nav-search-results-new-tab') >= 0) {
            return;
        } else {
            var record = me.getSearchResultRecord(clicked);
            me.fireSearchResultSelected(record);
        }
    },
    focusResultsFromSearch: function () {
        var me = this;
        var view = me.getView();
        var searchResults = view.down('#searchResultsView');
        if (!searchResults.isHidden()) {
            searchResults.focus();
        }
    },

    mainmenuTitleImageClick: function (event, element) {
        var me = this;

        me.fireEvent("toolbartop_logoclick", element);
    },

    mainMenuTitleImageContainerBeforeRender: function (container) {
        var me = this,
            vm = me.getViewModel(),
            toolbarTitleImageUrl = vm.get('conf.toolbarTitleImageUrl')

        if (toolbarTitleImageUrl) {
            container.setHtml('<img class="mainmenu-title-image" src="' + Ext.String.htmlEncode(Ext.resolveResource(toolbarTitleImageUrl)) + '" alt="">');
        }
        // Otherwise, don't bother
    },

    __updateTreeStrings: function () {
        var me = this;
        var vm = me.getViewModel();
        var navStore = vm.getStore('navSearch');
        var treeStore = vm.getStore('navTree');
        var navRoot = navStore.getRoot();
        var treeRoot = treeStore.getRoot();
        var textSetFn = function (node) {
            if (node.data.labelKey) {
                node.set('text', ABP.util.Common.geti18nString(node.data.labelKey));
            }
        };

        if (navRoot) {
            // TODO: Once the new lazyFill:true code has been bedded in and known to be bug free, remove the else here, and remove the test for lazyFill. If "then" branch should be able to handle both cases.
            if (navStore.lazyFill) {
                // When lazyFill:true then some nodes will exist, and others will be unrendered data still.
                me.eachMenuItemFromStore(navStore, textSetFn, null);
            } else {
                // When lazyFill:false then all child nodes will exist.
                navRoot.cascade(textSetFn);
            }
        }
        if (treeRoot) {
            // TODO: Once the new lazyFill:true code has been bedded in and known to be bug free, remove the else here, and remove the test for lazyFill. If "then" branch should be able to handle both cases.
            if (treeStore.lazyFill) {
                // When lazyFill:true then some nodes will exist, and others will be unrendered data still.
                me.eachMenuItemFromStore(treeStore, textSetFn, null);
            } else {
                treeRoot.cascade(textSetFn);
            }
        }
        // Update the search strings.
        me.setSearchStore();
    },

    /**
     * Starts at the supplied store and works down through all its nodes and data.
     * @param {Ext.data.TreeStore} store The store to process.
     * @param {Function} fn The function to call. An Ext.data.TreeModel or an ABP.data.TreeData is passed as the first parameter.
     * @param {Object} scope The scope (this reference) in which the function is executed.
     * @param {Boolean} noDuplicates true if the fn should not be called for duplicate data.
     * @result {Object[]} Flattened array of search items.
     */
    eachMenuItemFromStore: function (store, fn, scope, noDuplicates) {
        var me = this;
        var root = store.getRoot();
        me.eachMenuItem(root, fn, scope, noDuplicates, 0);
    },

    /**
     * Starts at the supplied node and works down, being careful to both include
     * child node and unrendered child data (when lazyFill:true), while optionally ensuring 
     * there are no duplicates between the child nodes and the child data.
     * @param {Ext.data.TreeModel/Object} item The node or data to serialize.
     * @param {Function} fn The function to call. An Ext.data.TreeModel or an ABP.data.TreeData is passed as the first parameter.
     * @param {Object} scope The scope (this reference) in which the function is executed.
     * @param {Boolean} noDuplicates true if the fn should not be called for duplicate data.
     * @param {Number} level The level in the tree node or data hierarchy. 
     */
    eachMenuItem: function (item, fn, scope, noDuplicates, level) {
        var me = this;

        // Ignore the topmost root item - this is not a item that appears in the tree, just a parent to everything.
        if (!item.isRoot || !item.isRoot()) {
            // Process the item. The children have to be done separately to prevent duplicates.
            fn.call(scope || me, item);
        }

        // Process child nodes, if any.
        var childNodes = item.childNodes;
        var len = Ext.isArray(childNodes) ? childNodes.length : 0;
        for (var i = 0; i < len; i++) {
            // Recurse down through the child nodes.
            me.eachMenuItem(childNodes[i], fn, scope, noDuplicates, level + 1);
        }

        // Process child data, if any.
        var childData = item.data ? item.data.children : null;
        var len = Ext.isArray(childData) ? childData.length : 0;
        for (var i = 0; i < len; i++) {
            // Filter if duplicates should be ignored.
            // Test for "findChild" method because the item may not be a node, only data.
            if ((noDuplicates && item.findChild && !item.findChild('id', childData[i].id, false)) ||
                (noDuplicates && !item.findChild) ||
                !noDuplicates) {
                // Recurse down through the data nodes, but first create an ABP.data.TreeData for consistent processing of the child data.
                var treeData = Ext.create('ABP.data.TreeData', {
                    data: childData[i],
                    parentDataArray: childData,
                    index: i,
                    level: level,
                    parentId: item.id
                });
                me.eachMenuItem(treeData, fn, scope, noDuplicates, level + 1);
            }
        }
    },

    __setSingleExpand: function (expandBool) {
        this.getViewModel().set('mainMenuSingleExpand', expandBool);
    },

    privates: {
        /**
         * @private
         * Toggle the state of the classic nav menu
         */
        classicToggle: function () {
            var me = this;
            var vm = me.getViewModel();
            var expanded = vm.get('classicMenuExpand');

            this.setClassicMenuVisibility(!expanded);
        },

        /**
         * @private
         * Close the classic navigation menu
         */
        classicClose: function () {
            this.setClassicMenuVisibility(false);
        },

        /**
         * @private
         * Open the classic navigation menu
         */
        classicOpen: function () {
            this.setClassicMenuVisibility(true);
        },

        /**
        * Checks click event target location
        * then conditionally closes the main menu
     
        * If user clicks...
        *   outside of the main menu,
        *   outside of the main menu toolbar button,
        *   outside of the right pane,
        *   outside of the right pane toolbar button
        * close the main menu
        *
        * @param {Object} e the click event
        */
        __handleSessionClick: function (e) {
            var me = this;
            var view = me.getView();
            var vm = view.getViewModel();
            var isExpanded = vm.get('classicMenuExpand');

            var sessionCanvas = view.up().up();

            var mainMenu = view.el.dom;
            var mainMenuClicked = e.target == mainMenu || mainMenu.contains(e.target);

            var rightPane = sessionCanvas.down('#rightPane').el.dom;
            var rightPaneClicked = e.target == rightPane || rightPane.contains(e.target);

            var menuButton = sessionCanvas.down('#toolbar-button-menu');
            var menuButtonEl;
            if (menuButton) {
                menuButtonEl = menuButton.el.dom;
            }
            var menuButtonClicked = e.target == menuButtonEl || menuButtonEl.contains(e.target);

            var settingsButton = sessionCanvas.down('#rpButton').el.dom;
            var settingsButtonClicked = e.target == settingsButton || settingsButton.contains(e.target);

            if (!rightPaneClicked && !mainMenuClicked && !menuButtonClicked && !settingsButtonClicked && isExpanded) {
                if (Ext.toolkit === 'classic') {
                    me.classicClose()
                } else {
                    this.fireEvent('session_closeMenu');
                }
            }
        },

        /**
         * @private
         * Attempt to keyboard focus the first favorite menu items
         */
        focusFavorites: function () {
            var me = this;
            me.focusItemInGroup('container_nav-favorites');
        },

        /**
 * @private
 * Attempt to keyboard focus the first recent menu items
 */
        focusRecents: function () {
            var me = this;
            me.focusItemInGroup('container_nav-recent');
        },

        focusItemInGroup: function (id) {
            var me = this;
            me.setClassicMenuVisibility(true);

            var navTree = me.getNavTree();
            if (navTree) {
                var node = navTree.getStore().getNodeById(id);
                if (node) {
                    navTree.setSelection(node);
                    if (!node.isExpanded()) {
                        node.expand();
                    }
                    me.focusSelected();
                    navTree.controller.navigateDownPress()
                }
            }
        },

        focusSelected: function () {
            var me = this,
                navTree = me.getNavTree();

            var sel = navTree.getSelection();
            if (!sel) {
                return;
            }

            var el = Ext.query('.x-treelist-item[data-recordid="' + sel.internalId + '"]');
            if (el && el.length > 0) {
                el[0].focus();
            }
        },

        getNavTree: function () {
            return this.getView().down('#treelistmenu');
        },

        /**
         * @private
         * Update the state of the classic navigation menu
         */
        setClassicMenuVisibility: function (show) {
            var me = this;
            var vm = me.getViewModel();
            var expanded = vm.get('classicMenuExpand');

            // If the menu is already in the desired state, nothing more to do.
            if (show === expanded) {
                return;
            }

            vm.set('classicMenuExpand', show);

            var v = me.getView();
            if (show) {
                v.show();
            } else {
                v.hide();
            }

            var rememberState = ABP.util.Config.getSessionConfig().settings.rememberMenuState;
            if (rememberState) {
                ABP.util.LocalStorage.set('mmStateOpen', show);
            }
        },

        /**
         * Save the favorites back to the server
         */
        saveFavorites: function () {
            ABP.util.Ajax.request({
                url: ABP.util.LocalStorage.get('ServerUrl') + '/abp/favorites',
                method: 'PUT',
                withCredentials: true,
                cors: (Ext.browser.name !== 'IE' || Ext.browser.version > 9.0),
                jsonData: ABP.util.Common.getFavorites(),
                success: function (response) {
                    // TODO: Consider removing this success handler. It does not add much value and the expected return is empty.
                    if (response.responseText) {
                        var r = Ext.JSON.decode(response.responseText);
                        if (!(r.resultCode === 0)) {
                            ABP.util.Logger.logError('ERROR: Could not save favorites: ' + r.errorDetail);
                        }
                    }
                    // If there was no response don't worry about it.
                },
                failure: function () {
                    ABP.util.Logger.logError('ERROR: Could not save favorites');
                }
            });
        },

        /**
         * Clear and reset the search result field
         */
        resetSearchField: function () {
            var me = this;

            me.closeSearchResults();

            var view = me.getView();
            var searchField = view.down('#navSearchField');
            if (searchField) {
                searchField.reset();
            }
        },

        /**
         * Get the currently highlighted item
         */
        getHightlightedItem: function () {
            var me = this;
            var view = me.getView();
            var searchResults = view.down('#searchResultsView');
            if (searchResults) {
                return searchResults.getSelection();
            }

            return null;
        },

        /**
         * Close the search results popup
         */
        closeSearchResults: function () {
            var me = this;
            var v = me.getView();
            var searchResults = v.down('#searchResultsView');
            if (searchResults) {
                searchResults.hide();
            }

            var vm = me.getViewModel();
            vm.set('selectedSearchResult', null);

            //ABP.util.Aria.setActiveDecendant(v.down('#navSearchField'),  '');

            // Next time the user uses the search use the default selection
            me.useDefaultSelection = true;
        },

        /**
         * Check whether the search results are curently visible
         */
        isSearchResultsVisible: function () {
            var me = this;
            var view = me.getView();
            var searchResults = view.down('#searchResultsView');
            if (searchResults) {
                return searchResults.isVisible();
            }
            else {
                return false;
            }
        },

        /**
         * Check whether the search results are curently visible if they are set the focus to the panel
         */
        focusSearchResults: function () {
            var me = this;
            var view = me.getView();
            var searchResults = view.down('#searchResultsView');
            if (searchResults) {
                if (searchResults.isVisible()) {
                    return searchResults.focus();
                }
            }

            return false;
        },

        /**
         * Fire the app event that will enable the packages to respond to the user clicking / selecting one of the
         * search results.
         */
        fireSearchResultSelected: function (record) {
            var me = this;
            if (record && record.data) {
                me.fireEvent('navigation_searchresultselected', record);
                if (record.data.event && record.data.appId) {
                    me.fireEvent('main_fireAppEvent', record.data.appId, record.data.event, record.data.eventArgs, record.data.activateApp);
                } else if (record.data.hash) {
                    me.redirectTo(record.data.hash);
                }
                me.resetSearchField();
            }
        },

        /**
         * Move the selected search result by a specific number of items.
         * typically used to move forward and back one space
         */
        moveSelectedSearchResult: function (increment) {
            var me = this;
            var view = me.getView();
            var vm = me.getViewModel();
            var scrollToTop = false;
            var scrollToBottom = false;
            var currentSelection = vm.get('selectedSearchResult');
            if (!currentSelection) {
                return;
            }

            // The user is changing selection, ignore the default in preference for the users selection
            me.useDefaultSelection = false;

            var store = currentSelection.store;
            var currentIndex = store.indexOf(currentSelection);

            currentIndex = currentIndex + increment;

            if (currentIndex < 0) {
                currentIndex = store.getCount() - 1;
                scrollToBottom = true;
            }
            else if (currentIndex >= store.getCount()) {
                currentIndex = 0;
                scrollToTop = true;
            }

            var selected = store.getAt(currentIndex);
            vm.set('selectedSearchResult', selected);
            //ABP.util.Aria.setActiveDecendant(view.down('#navSearchField'),  selected.id);

            // Determine if we need to scroll.
            var resultsView = view.down('#searchResultsView');

            // Determine if we need to perform an icon flip
            if (resultsView) {
                me.onIconKeyNav(resultsView, currentSelection);
            }

            // Scrollbar does not exist.
            if (!resultsView || !resultsView.getMaxHeight() || resultsView.getHeight() < resultsView.getMaxHeight()) {
                return;
            }
            if (scrollToTop) {
                resultsView.scrollTo(0, 0);
                return;
            }
            else if (scrollToBottom) {
                resultsView.scrollTo(0, resultsView.getScrollableClientRegion().bottom);
                return;
            }

            var currentItem = resultsView.getNodeByRecord(currentSelection);
            if (!currentItem) {
                return;
            }

            // Scrolling down
            if (increment === 1) {
                if (currentItem.getBoundingClientRect().bottom + currentItem.scrollHeight >= resultsView.getBox().bottom) {
                    resultsView.scrollBy(0, currentItem.scrollHeight);
                }
            }
            // Scrolling up.
            else if (increment === -1) {
                if (resultsView.getBox().top >= currentItem.getBoundingClientRect().top - currentItem.scrollHeight) {
                    resultsView.scrollBy(0, -currentItem.scrollHeight);
                }
            }
        },

        getSelectedSearchId: function () {
            var me = this;
            var vm = me.getViewModel();
            var currentSelection = vm.get('selectedSearchResult');
            if (currentSelection) {
                return currentSelection.id;
            }
            return null;
        },

        setSelectedSearchId: function (id) {
            var me = this,
                v = me.getView(),
                vm = me.getViewModel();
            var store = vm.getStore("searchTree");
            if (store.count() === 0) {
                ABP.util.Aria.setActiveDecendant(v.down('#navSearchField'), '');
                return;
            }

            var i = store.find('id', id);
            var selected = store.getAt(0);
            if (i !== -1 && !me.useDefaultSelection) {
                vm.set('selectedSearchResult', store.getAt(i));
            }

            vm.set('selectedSearchResult', selected);

            // ABP.util.Aria.setActiveDecendant(v.down('#navSearchField'),  selected.id);
        },
        /**
        * @private
        * Adds the search results panel to the mainmenu (should only be called once)
        */
        addNavSearchResultsElement: function () {
            var me = this;
            var searchCont = me.lookupReference('abpNavSearchCont');
            var showPath = ABP.util.Config.getSessionConfig().settings.navSearchShowPath;
            var tpl = [];
            if (showPath) {
                tpl = [
                    '<tpl for=".">',
                    '<tpl if="this.isUnder(xindex)">',
                    '<div id="{id}" class="nav-search-results-outer">',
                    '<tpl if="this.hasNewTab(href)">',
                    '<div class="icon-holder">',
                    '<div class="nav-search-results-icon {iconCls}"></div>',
                    '<a class = "nav-search-results-new-tab icon-windows" href="{href}" target="_blank" title="Open in a new tab"></a>',
                    '</div>',
                    '<tpl else>',
                    '<div class="nav-search-results-icon {iconCls}"></div>',
                    '</tpl>',
                    '<div class="nav-search-results-searched">{text}</div>',
                    '<div class="nav-search-results-hierarchy">{hierarchy}</div>',
                    '</div>',
                    '</tpl>',
                    '</tpl>',
                    {
                        isUnder: function (number) {
                            return number <= ABP.util.Config.getSessionConfig().settings.mainMenuNavSearchResultsMax;
                        },
                        hasNewTab: function (href) {
                            return Ext.isString(href);
                        }
                    }
                ];
            } else {
                tpl = [
                    '<tpl for=".">',
                    '<tpl if="this.isUnder(xindex)">',
                    '<div id="{id}" class="nav-search-results-outer">',
                    '<div class="nav-search-results-searched">{text}</div>',
                    '</div>',
                    '</tpl>',
                    '</tpl>',
                    {
                        isUnder: function (number) {
                            return number <= ABP.util.Config.getSessionConfig().settings.mainMenuNavSearchResultsMax;
                        }
                    }
                ];
            }
            var dataview = {
                xtype: 'dataview',
                floating: true,
                scrollable: 'y',
                id: 'searchResultsView',
                // itemId: 'searchResultsView',
                hidden: true,
                tabIndex: 0,
                cls: 'nav-search-results',
                overItemCls: 'nav-search-highlight',
                bind: {
                    store: '{searchTree}',
                    selection: '{selectedSearchResult}',
                    minWidth: '{menuWidth*.9}',
                    maxWidth: '{menuWidth*.9*2}'
                },
                tpl: tpl,
                itemSelector: 'div.nav-search-results-outer',
                listeners: {
                    focusleave: 'onSearchLostFocus',
                    highlightitem: 'onSearchResultHighlighted',
                    el: {
                        keydown: 'onSearchResultsKeyDown'
                    },
                    resize: 'onSearchResultResize',
                    selectionchange: 'onSearchResultSelectionChanged',
                    click: {
                        element: 'el',
                        fn: 'onSearchResultClick'
                    },
                    mouseover: {
                        element: 'el',
                        delegate: 'div.nav-search-results-outer',
                        fn: 'onIconHover'
                    },
                    mouseout: {
                        element: 'el',
                        delegate: 'div.nav-search-results-outer',
                        fn: 'onIconHoverExit'
                    }
                }
            };
            searchCont.add(dataview);
        },

        __toggleMenuShortcuts: function () {
            var me = this;
            var v = me.getView();
            var menu = v.down('#treelistmenu');
            if (menu) {
                menu.toggleCls('show-shortcuts');
            }
        },
        /**
        * Triggered by mouseover on the search result. Applies the classes that perform the flip animations,
        * and makes sure the icons display properly
        * @private
        * @param {Ext.event.event} event 
        * @param {HTMLElement} domElement // The outer div of the search result
        */
        onIconHover: function (event, domElement) {
            var firstChildClass = domElement.firstElementChild.className;
            if (firstChildClass.indexOf('icon-holder') >= 0) {
                var iconHolder = domElement.firstElementChild;
                var normalIcon = iconHolder.firstElementChild;
                var newTabIcon = iconHolder.lastElementChild;
                normalIcon.classList.add('spin-out');
                newTabIcon.classList.add('spin-in');
                Ext.defer(function () {
                    normalIcon.style.display = "none";
                    newTabIcon.style.display = "block";
                }, 75); // timed to the spin animation.
            }
        },
        /**
         * Triggered by mouseout on the search result. Removes the classes that perform the flip animation and reapplies them in reverse,
         * so that they flip back the other way. Makes sure the icons are displaying properly, then removes the animation
         * classes altogether.
         * @private
         * @param {Ext.event.event} event 
         * @param {HTMLElement} domElement // The outer div of the search result
         */
        onIconHoverExit: function (event, domElement) {
            var firstChildClass = domElement.firstElementChild.className;
            if (firstChildClass.indexOf('icon-holder') >= 0) {
                var iconHolder = domElement.firstElementChild;
                var normalIcon = iconHolder.firstElementChild;
                var newTabIcon = iconHolder.lastElementChild;
                newTabIcon.classList.remove('spin-in');
                newTabIcon.classList.add('spin-out');
                normalIcon.classList.remove('spin-out');
                normalIcon.classList.add('spin-in');
                Ext.defer(function () {
                    newTabIcon.style.display = "none";
                    normalIcon.style.display = "block";
                }, 75); // timed to the spin animation.
                Ext.defer(function () {
                    newTabIcon.classList.remove('spin-out');
                    normalIcon.classList.remove('spin-in');
                }, 250); // Total spin animation time + an extra 100 for safe padding
            }
        },

        /**
         * Determines whether we need to perform a closing icon flip during key nav.
         * @private
         * @param {Ext.view.View} resultsView // the search results dataview
         * @param {Ext.data.Model} currentSelection // The current selected model
         */
        onIconKeyNav: function (resultsView, currentSelection) {
            var me = this;
            var currentElement = resultsView.getNodeByRecord(currentSelection);
            if (currentElement) {
                if (currentElement.firstElementChild.className.indexOf('icon-holder') >= 0) {
                    me.onIconHoverExit(null, currentElement);
                }
            }
        },

        /**
         * Retrieves the Store record associated with a search result click/tap.
         * @param {Object} event 
         */
        getSearchResultRecord: function (event) {
            var me = this;
            if (Ext.isEmpty(event)) {
                return null;
            }
            // Normal Classic Click events will have a record right on the event.
            if (!Ext.isEmpty(event.record)) {
                return event.record;
            }
            // Presence of parent event might indicate this was originally a tap event (Classic on a phone or some edge case).
            else if (event.parentEvent && event.target) {
                var target = event.target;
                var targetParent = target.parentElement;
                if (!targetParent) {
                    return;
                }
                var vm = me.getViewModel();
                var store = vm.getStore('searchTree');
                return store.getById(targetParent.id)
            }
        }
    }
});
