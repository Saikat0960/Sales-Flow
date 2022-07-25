Ext.define('ABP.view.session.accessibility.JumpToBarController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.jumptobar',

    requires: [
        'ABP.view.session.accessibility.JumpToBarViewModel',
        'ABP.model.WCAGRegion'
    ],

    listen: {
        controller: {
            '*': {
                // Public event possibly used by applications to manaully show the jumpto bar
                abp_jumpto_show: 'showJumpTo',
                rightpane_tabadded: 'onRightPaneTabAdded',
                afteraddlanguagestrings: 'onAfterAddLangaugeStrings'
            }
        },
        store: {
            '#searchStore': {
                datachanged: 'onSearchStoreChanged'
            },
            '#navTree': {
                datachanged: 'onNavMenuChanged'
            }
        }
    },

    initViewModel: function (vm) {
        // - Navigation menu (opens menu and focuses search box or fist menu item)
        // - Main Content
        // - User Settings
        // - Visible Right Pane Buttons
        // - Favourites

        var jumpToTargets = [
            { id: 'MainContent', text: ABP.util.Common.geti18nString('abp_main_content') },
            { id: 'NavMenu', text: ABP.util.Common.geti18nString('abp_navigation_menu') }
        ];

        var config = ABP.util.Config.getSessionConfig();
        if (config.settings.enableMenuFavorites) {
            jumpToTargets.push({ id: 'NavMenu-Favourites', text: ABP.util.Common.geti18nString('navMenu_favorites') });
        }

        if (config.settings.enableMenuRecent) {
            jumpToTargets.push({ id: 'NavMenu-Recents', text: ABP.util.Common.geti18nString('navMenu_recent') });
        }

        jumpToTargets.push({ id: 'UserSettings', text: ABP.util.Common.geti18nString('sessionMenu_settings') });

        var tabs = ABP.util.Config.getRightPaneTabs();
        Ext.each(tabs, function (i) {
            if (i.hidden) {
                return;
            }

            var text = i.tooltip;
            if (i.tooltipKey) {
                text = ABP.util.Common.geti18nString(i.tooltipKey);
            }
            jumpToTargets.push({
                id: 'RightPane' + i.uniqueId,
                context: i.uniqueId,
                text: text
            });
        });

        vm.storeInfo.targets.loadData(jumpToTargets);

        Ext.data.StoreManager.on('add', function (i, s, id) {
            console.log('Store Added: ' + id);
        })
    },

    /**
     * Handle the application adding a new tab into the main container
     * @param {String} id the id of the new tab 
     * @param {*} tab The tab's config 
     */
    onRightPaneTabAdded: function (id, tab) {
        if (id === 'rightPaneTab_abp-search' || id === 'abp-settings') {
            return;
        }

        if (tab.hidden) {
            return;
        }

        var me = this,
            vm = me.getViewModel();

        var text = tab.tooltip;
        if (tab.tooltipKey) {
            text = ABP.util.Common.geti18nString(tab.tooltipKey);
        }

        var target = {
            id: 'RightPane' + id,
            context: id,
            text: text,
            textKey: tab.tooltipKey
        };

        vm.storeInfo.targets.loadData([target], true);
    },

    /** 
     * handle the applications language strings being updated
     * We need to handle this as the request from the server may return after the view model has been created
     */
    onAfterAddLangaugeStrings: function () {
        var me = this,
            vm = me.getViewModel();
        vm.storeInfo.targets.each(function (data) {
            var textKey = data.get('textKey')
            if (textKey) {
                data.set('text', ABP.util.Common.geti18nString(textKey));
            }
        });
    },

    /**
     * Handle the user selecting a region to jump to 
     * @param {Object} cmp The combo box
     * @param {Object} region The region the user has selected to jump to 
     */
    onSelection: function (cmp, region) {
        var me = this;
        var id = region.get('id');

        if (Ext.String.startsWith(id, 'GlobalSearch')) {
            me.fireEvent('abp_searchBar_toggleKey', region.get('context'));

        } else if (id == 'NavMenu') {
            me.fireEvent('container_showMenu', true);
            // Try to focus the search text box, if we can not focus it try to 
            // focus the first item in the menu
            if (ABP.util.Config.getSessionConfig().settings.enableNavSearch) {
                ABP.util.Keyboard.focus('.nav-search-field');
            } else {
                ABP.util.Keyboard.focus('.main-menu .x-abptreelistitem');
            }

        } else if (id === 'NavMenu-Favourites') {
            // Open, select and focus the 1st favorite item
            me.fireEvent('mainmenu_focusFavorites');

        } else if (id === 'NavMenu-Recents') {
            // Open, select and focus the 1st recent item
            me.fireEvent('mainmenu_focusRecents');

        } else if (id === 'MainContent') {
            // Move the keyboard focus to the first element that has tabindex specified
            ABP.util.Keyboard.focus('.feature-canvas [tabindex]');

        } else if (Ext.String.startsWith(id, 'RightPane')) {
            // Show the rightpane
            this.fireEvent('container_rightPane_toggleTab', region.get('context'), true, true);

        } else if (id === 'UserSettings') {
            // Move the keyboard focus to the first element that has tabindex specified
            this.fireEvent('container_rightPane_toggleTab', {
                name: 'abp-settings',
                uniqueId: 'abp-settings',
                xtype: 'settingscontainer',
                automationCls: 'settings-tab'
            }, true);

            ABP.util.Keyboard.focus('.settings-container .x-panel-body [tabindex]');
        }

        cmp.setValue(null);
    },

    onFocusEnter: function (cmp, e) {
        var me = this,
            v = me.getView();

        if (!e.backwards) {
            v.show();
        }
    },

    onShow: function () {
        var me = this,
            v = me.getView();
        v.down('#JumpToCombo').focus();
    },

    onFocusLeave: function () {
        var me = this,
            v = me.getView();

        v.hide();
    },

    showJumpTo: function () {
        var me = this,
            view = me.getView();

        view.show();
    },

    privates: {
        /**
         * Handle the search provider store changing, update the jump to list to reflect the new items
         * 
         * @param {Ext.data.Store} store the search store that has changed
         */
        onSearchStoreChanged: function (store) {
            var vm = this.getViewModel(),
                jumpToSearches = [];

            store.each(function (provider) {
                provider.get('name')

                jumpToSearches.push({
                    id: 'GlobalSearch' + provider.id,
                    text: provider.get('name'),
                    context: provider.id
                });
            });

            // Append the searches to the jump to store
            vm.storeInfo.targets.loadData(jumpToSearches, true);
        },

        /**
         * Handle the navigation store changing
         * 
         * @param {Ext.data.Store} store The navigation store
         */
        onNavMenuChanged: function (store) {
            var me = this;
            try {
                var navStore = Ext.getStore('navSearch');
                // Check the recents menu.
                var node = navStore.getNodeById('container_nav-recent');
                if (node && !node.get('hidden')) {
                    me.addTarget({
                        id: 'NavMenu-Recents',
                        text: ABP.util.Common.geti18nString('navMenu_recent')
                    }, 'NavMenu')
                } else {
                    me.hideTarget('NavMenu-Recents');
                }

                // Check the favourites menu
                var node = navStore.getNodeById('container_nav-favorites');
                if (node && !node.get('hidden')) {
                    me.addTarget({
                        id: 'NavMenu-Favourites',
                        text: ABP.util.Common.geti18nString('navMenu_favorites')
                    }, 'NavMenu')
                } else {
                    me.hideTarget('NavMenu-Favourites');
                }
            }
            catch (err) {
                ABPLogger.logDebug(err);
            }
        },

        addTarget: function (target, previousid) {
            var me = this,
                vm = me.getViewModel(),
                s = vm.storeInfo.targets;
            var target = s.getById(id);
            if (s) {
                // Already exists do nothing
                return;
            }

            var insertAt = s.indexOfId(previousid)
            if (insertAt > -1) {
                s.insert(insertAt, target);
            }
            else {
                s.loadData(target, true);
            }
        },

        hideTarget: function (id) {
            var me = this,
                vm = me.getViewModel(),
                s = vm.storeInfo.targets;

            var target = s.getById(id);
            if (s) {
                s.remove(target);
            }
        }
    }
});