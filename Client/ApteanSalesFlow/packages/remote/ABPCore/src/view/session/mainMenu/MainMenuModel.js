Ext.define('ABP.view.session.mainMenu.MainMenuModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.mainmenumodel',
    requires: [
        'ABP.model.SearchTreeResultsModel'
    ],

    data: {
        navMenu: {},
        sessionMenu: {},
        //micro: false,
        menuWidth: 250,
        sessHeight: 42,
        menuHeaderHeight: 60,
        menuHeaderCls: 'main-menu-top menu-top-title',
        menuFooterCls: 'menu-footer',
        navAfterCls: 'abp-nav-toggle-',
        treeIcon: 'icon-tree',
        navIcon: 'icon-signpost2',
        navToggleIcon: 'abp-nav-toggle-icon-tree',
        classicMenuExpand: true,
        hideTreeNav: true,
        hideSearch: true,
        recentPages: [],
        firstAddAfterSet: false,
        selectedSearchResult: null,
        mainMenuSingleExpand: false
    },

    stores: {
        // Default view of Navigation
        navSearch: {
            type: 'tree',
            storeId: 'navSearch',
            root: {
                expanded: true
            }
            // lazyFill: true set by config.settings.mainMenuLazyFill in this constructor.
        },
        // Treeview of navigation
        navTree: {
            type: 'tree',
            storeId: 'navTree',
            root: {
                expanded: true
            }
            // lazyFill: true set by config.settings.mainMenuLazyFill in this constructor.
        },
        // Search store
        searchTree: {
            model: 'ABP.model.SearchTreeResultsModel',
            storeId: 'searchTree',
            id: 'searchTree'
        }
    },

    formulas: {
        micro: {
            get: function () {
                var width;
                var height;
                // var ssThresh;
                var ret = false;
                var isModern = Ext.os.deviceType === "Phone";

                if (isModern) {
                    width = ABP.util.Common.getWindowWidth();
                    height = ABP.util.Common.getWindowHeight();
                    if (isModern) {
                        ret = true;
                    }
                    this.setMenu(ret);
                }
                return ret;
            }
        },
        mainMenuTopLabel: {
            bind: {
                _bootstrapConf: '{bootstrapConf.branding.companyName}'
            },
            get: function (data) {
                var ret = '';
                if (data._bootstrapConf) {
                    ret = data._bootstrapConf;
                } else {
                    ret = 'APTEAN';
                }
                return ret;
            }
        },
        mainMenuTitleImageUrl: {
            bind: {
                _mainMenuTitleImageUrl: '{conf.toolbarTitleImageUrl}'
            },

            get: function (data) {
                return Ext.isEmpty(data._mainMenuTitleImageUrl) ? null : data._mainMenuTitleImageUrl;
            }
        }
    },

    constructor: function () {
        this.callParent(arguments);
        // Constructor is used to set lazyFill by ABP setings config.
        var lazyFill = ABP.util.Config.getSessionConfig().settings.mainMenuLazyFill;
        this.getStore('navSearch').lazyFill = lazyFill;
        this.getStore('navTree').lazyFill = lazyFill;
    },

    setMenu: function (micro) {
        var me = this;
        var isClassic = Ext.os.deviceType === 'Tablet' || Ext.os.deviceType === 'Desktop';
        if (!micro) {
            if (isClassic) {
                me.set('menuWidth', 250);
                me.set('menuHeaderHeight', 60);
                me.set('menuHeaderCls', 'main-menu-top menu-top-title');
            } else {
                me.set('menuWidth', 300);
                me.set('menuHeaderHeight', 40);
                me.set('menuHeaderCls', 'main-menu-top menu-top-title-micro');
            }
            //me.set('sessHeight', 81);
            //me.set('menuFooterCls', 'menu-footer');

            //me.set('menuHeaderCls', 'main-menu-top menu-top-title');
        } else {
            me.set('menuWidth', '100%');
            //me.set('sessHeight', 42);
            //me.set('menuFooterCls', 'main-footer-micro');
            me.set('menuHeaderHeight', 40);
            me.set('menuHeaderCls', 'main-menu-top menu-top-title-micro');
        }
    },
    navSet: function (path, value) {
        var me = this;
        // set it to null to ensure the bind recognizes a change
        me.set(path, null);
        me.set(path, value);
        return me.resetNav();
    },

    resetNav: function () {
        var me = this;
        var navCt = 0;
        var i;

        //        for (i = 0; i < me.data.navMenu.length; ++i) {
        //            if (me.data.navMenu[i].xtype === 'menubutton') {
        //                me.data.navMenu[i].place = navCt;
        //                navCt++;
        //            }
        //        }
        for (i = 0; i < me.data.sessionMenu.length; ++i) {
            if (me.data.sessionMenu[i].xtype === 'menubutton') {
                me.data.sessionMenu[i].place = navCt;
                navCt++;
            }
        }
        return navCt - 1;
    },

    switchNav: function (type) {
        var me = this;
        if (type === 'tree') {
            me.set('navToggleIcon', me.get('navAfterCls') + me.get('navIcon'));
        } else {
            me.set('navToggleIcon', me.get('navAfterCls') + me.get('treeIcon'));
        }
    },
    // page will be made by controller and handed to vm
    // Array should be no larger than mainMenuRecentMaxShown
    // Never Retrurns first index (current page)
    addRecentPage: function (page) {
        var me = this;
        var recentArray = me.get('recentPages');
        var ret = {
            added: [],
            removed: []
        }
        var sizeDiff = 0;
        var i = 0;
        var firstAddAfterSet = me.get('firstAddAfterSet');
        var duplicateIndex = me.__compareNodeToExistingRecentItems(page);
        // Add one to account for the current page (that is hidden from the list)
        var maxVolume = ABP.util.Config.getSessionConfig().settings.mainMenuRecentMaxShown + 1;
        if (firstAddAfterSet) {
            me.set('firstAddAfterSet', false);
        }
        if (duplicateIndex === -1) {
            recentArray.splice(0, 0, page);
            if (recentArray.length > 1) {
                if (!firstAddAfterSet) {
                    ret.added.push(recentArray[1]);
                }
                if (recentArray.length > maxVolume) {
                    sizeDiff = recentArray.length - maxVolume;
                    if (sizeDiff > 0) {
                        recentArray.pop();
                        ret.removed.push(recentArray.length - 1);
                    }
                    me.set('recentPages', recentArray);
                    return ret;
                } else {
                    return ret;
                }
            } else {
                return null;
            }
        } else {
            // we have a duplicate
            // check to see if it is already the top of the list
            if (duplicateIndex !== 0) {
                // get node to move
                var displacedNode = recentArray[duplicateIndex];
                // remove duplicte node from list
                recentArray.splice(duplicateIndex, 1);
                // add it back to the front of the list
                recentArray.splice(0, 0, displacedNode);
                // set return value to reflect the move
                ret.removed.push(duplicateIndex);
                if (!firstAddAfterSet) {
                    ret.added.push(recentArray[1]);
                }
                return ret;
            } else {
                if (!firstAddAfterSet) {
                    // duplicate already at index 0
                    return null;
                } else {
                    ret.removed.push(0);
                    return ret;
                }
            }
        }
    },
    // Made for adding Recent Items - checks pageInfo against existing nodes to make sure it doesn't already exist
    //  returns -1 if not found in recent items
    //  returns index of duplicate if found
    __compareNodeToExistingRecentItems: function (pageInfo) {
        var ret = -1;
        var me = this;
        var recents = me.get('recentPages');
        if (recents && recents.length > 0) {
            for (var i = 0; i < recents.length; ++i) {
                if (recents[i].uniqueId === pageInfo.uniqueId) {
                    return i;
                }
            }
        }
        return ret;
    },
    setInitialRecents: function (recentsArray) {
        var me = this;
        var maxShown = ABP.util.Config.getSessionConfig().settings.mainMenuRecentMaxShown;
        if (recentsArray.length > maxShown) {
            recentsArray.splice(maxShown, recentsArray.length - maxShown);
        }
        me.set('recentPages', recentsArray);
        me.set('firstAddAfterSet', true);
        return recentsArray;
    },
    checkFirstRecentForUpdate: function (uniqueId, data) {
        var me = this;
        var recents = me.get('recentPages');
        var correctedUnId = Ext.String.startsWith(uniqueId, 'rec_') ? uniqueId : 'rec_' + uniqueId;
        if (!Ext.isEmpty(recents) && recents[0].uniqueId === correctedUnId) {
            recents[0].itemPriority = data.priority;
            recents[0].itemCount = data.count;
        }
    }
});
