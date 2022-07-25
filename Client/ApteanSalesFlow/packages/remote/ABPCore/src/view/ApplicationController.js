Ext.define('ABP.view.ApplicationController', {
    extend: 'Ext.app.Controller',
    alias: 'controller.abpapplicationcontroller',

    listen: {
        controller: {
            '*': {
                container_signOut: "__signout",
                container_toggleMenu: "__menuToggle",
                container_showMenu: "__menuOpen",
                container_toggleMenuShortcuts: "__menuToggleShortcuts",
                container_hideMenu: "__menuClose",
                container_toggleNav: "__navToggle",
                container_giveFocus: "__givenFocus",
                container_enableMenuOption: "__menuOptionEnable",
                container_addMenuOption: "__menuOptionAdd",
                container_removeMenuOption: "__menuOptionRemove",
                container_updateMenuCount: "__menuUpdateCount",
                container_menuAddRecent: '__menuAddRecent',
                container_menuAddFavorite: '__menuAddFavorite',
                container_menuRemoveFavorite: '__menuRemoveFavorite',
                container_menuUpdateFavorites: '__menuUpdateFavorites',
                container_menuFocusFavorites: '__menuFocusFavorite',
                container_menuReplaceSuggested: '__menuReplaceSuggested',
                container_menuAddTreeItems: '__menuAddTreeItems',
                container_menuRemoveTreeItem: '__menuRemoveTreeItem',
                container_toolbar_showBranding: '__toolbarShowBranding',
                container_toolbar_setTitle: "__toolbarSetTitle",
                container_toolbar_addButton: "__toolbarAddButton",
                container_toolbar_removeButton: "__toolbarRemoveButton",
                container_openSearch: "__openSearch",
                container_showSettings: "__showSettings",
                container_switchLanguage: "__switchLanguage",
                container_switchTheme: "__switchTheme",
                container_clean: '__cleanUp',
                container_setRoute: '__setRoute',
                container_addDefaultLanguageStrings: '__addDefaultLanguageStrings',
                container_updateLanguageStrings: '__updateLanguageStrings',
                container_pendingChanges: '__pendingChangesToggle',

                // Right Tab Panel Events
                container_rightPane_toggle: "__rightPaneToggle",
                container_rightPane_toggleTab: "__rightPaneToggleTab",
                container_rightPane_addElement: "__rightPaneAddElement",
                container_rightPane_showButton: "__rightPaneShowButton",
                container_rightPane_initTab: "__rightPaneInitTab",
                container_rightPane_updateBadge: "__rightPaneUpdateBadge",
                container_rightPane_incrementBadge: "__rightPaneIncrementBadge",
                container_rightPane_decrementBadge: "__rightPaneDecrementBadge",
                container_rightPane_clearBadge: "__rightPaneClearBadge",

                // Notification Events
                container_notifications_add: "__addNotifications",
                container_notifications_remove: "__removeNotifications",
                container_notifications_read: "__markNotificationsRead",
                container_notifications_unread: "__markNotificationsUnread",

                // Global Search Events
                container_globalsearch_suggestions: "__updateGlobalSearchSuggestions",

                // Headline Events
                container_headlines_show: "__showHeadlines",
                container_headlines_hide: "__hideHeadline",
                container_headlines_load: "__loadHeadlines",

                //Thumbbar Events
                container_thumbbar_show: "__showThumbbar",
                container_thumbbar_hide: "__hideThumbbar",

                // User Profile Events
                container_updateUserProfile: "__updateUserProfile",

                //Milestone Triggers                
                container_bootstrap_success: '__bootstrapSuccessful',
                container_authentication_success: '__authenticationSuccessful',
                container_config_processed: '__configurationProcessed'
            }
        }
    },

    __signout: function (reason, force) {
        this.fireEvent('main_DestroySession', reason, force);
    },

    __menuToggle: function () {
        this.fireEvent('session_toggleMenu');
    },
    __menuOpen: function () {
        this.fireEvent('session_openMenu');
    },
    __menuToggleShortcuts: function () {
        this.fireEvent('session_toggleMenuShortcuts');
    },
    __menuClose: function () {
        this.fireEvent('session_closeMenu');
    },
    __givenFocus: function () {
        this.fireEvent('toolbar_focus');
    },
    __menuOptionEnable: function (appId, uniqueId, isEnabled) {
        this.fireEvent('mainMenu_enableMenuOption', appId, uniqueId, isEnabled);
    },
    __menuOptionAdd: function (button, nav, parentAppId, parentId, tree) {
        this.fireEvent('mainMenu_addMenuOption', button, nav, parentAppId, parentId, tree);
    },
    __menuOptionRemove: function (appId, uniqueId) {
        this.fireEvent('mainMenu_removeMenuOption', appId, uniqueId);
    },
    __menuUpdateCount: function (appId, uniqueId, data) {
        this.fireEvent('mainMenu_updateMenuCount', appId, uniqueId, data);
    },
    __menuAddRecent: function (pageInfo) {
        this.fireEvent('mainMenu_addRecent', pageInfo);
    },
    __menuAddFavorite: function (pageInfo, saveRequest) {
        this.fireEvent('mainMenu_addFavorite', pageInfo, saveRequest);
    },
    __menuRemoveFavorite: function (appId, uniqueId, saveRequest) {
        this.fireEvent('mainMenu_removeFavorite', appId, uniqueId, saveRequest);
    },
    __menuUpdateFavorites: function (favoritesArray, saveRequest) {
        this.fireEvent('mainmenu_updateFavorites', favoritesArray, saveRequest);
    },
    __menuFocusFavorite: function () {
        this.fireEvent('mainmenu_focusFavorites');
    },
    __menuReplaceSuggested: function (pageInfoArray) {
        this.fireEvent('mainMenu_replaceSuggested', pageInfoArray);
    },
    __menuAddTreeItems: function (treeItems) {
        this.fireEvent('mainMenu_addTreeOption', treeItems);
    },
    __menuRemoveTreeItem: function (appId, uniqueId) {
        this.fireEvent('mainMenu_removeTreeOption', appId, uniqueId);
    },
    __navToggle: function (type) {
        this.fireEvent('mainMenu_toggleNav', type);
    },
    __toolbarSetTitle: function (newTitle) {
        this.fireEvent('toolbar_setTitle', newTitle);
    },
    __toolbarShowBranding: function (showBranding) {
        this.fireEvent('toolbar_showBranding', showBranding);
    },
    __toolbarAddButton: function (buttonFeatures, icon, func, uniqueId) {
        this.fireEvent('toolbar_addButton', buttonFeatures, icon, func, uniqueId);
    },
    __toolbarRemoveButton: function (button) {
        this.fireEvent('toolbar_removeButton', button);
    },
    __showSettings: function (args) {
        this.fireEvent('featureCanvas_showSetting', args);
    },
    __addDefaultLanguageStrings: function (args) {
        this.fireEvent('main_addDefaultLanguageStrings', args);
    },
    __updateLanguageStrings: function (args) {
        this.fireEvent('main_updateLanguageStrings', args);
    },
    __openSearch: function () {
        this.fireEvent('toolbar_openSearch');
    },
    __switchLanguage: function (newLang) {
        this.fireEvent('main_switchLanguage', newLang);
    },
    __switchTheme: function (newTheme) {
        ABPTheme.setTheme(newTheme);
    },
    __pendingChangesToggle: function (pendingChanges) {
        this.fireEvent('main_pendingChanges', pendingChanges);
    },
    __cleanUp: function () {
        // Sign Out
    },
    __setRoute: function (hash, force) {
        if (force === undefined) {
            force = true;
        }
        this.redirectTo(hash, Ext.coerce(force, true));
    },
    __rightPaneToggle: function () {
        this.fireEvent('rightPane_toggle');
    },
    __rightPaneAddElement: function (content) {
        this.fireEvent('rightPane_addElement', content);
    },
    __rightPaneToggleTab: function (uniqueId, open, focus) {
        this.fireEvent('rightPane_toggleTab', uniqueId, open, focus);
    },
    __rightPaneShowButton: function (uniqueId, show) {
        this.fireEvent('toolbar_setVisibilityRightPaneButton', uniqueId, show);
    },
    __rightPaneInitTab: function (uniqueId) {
        this.fireEvent('rightPane_initTab', uniqueId);
    },
    __rightPaneUpdateBadge: function (uniqueId, badgeConfig) {
        this.fireEvent('toolbar_updateBadge', uniqueId, badgeConfig);
    },
    __rightPaneIncrementBadge: function (uniqueId, number) {
        this.fireEvent('toolbar_incrementBadge', uniqueId, number);
    },
    __rightPaneDecrementBadge: function (uniqueId, number) {
        this.fireEvent('toolbar_decrementBadge', uniqueId, number);
    },
    __rightPaneClearBadge: function (uniqueId) {
        this.fireEvent('toolbar_clearBadge', uniqueId);
    },

    // Pass on to Notifications Handler
    __addNotifications: function (source, sourceKey, notifications) {
        this.fireEvent('abp_notifications_add', source, sourceKey, notifications);
    },
    __removeNotifications: function (notifications) {
        this.fireEvent('abp_notifications_remove', notifications);
    },
    __markNotificationsRead: function (notifications) {
        this.fireEvent('abp_notifications_read', notifications);
    },
    __markNotificationsUnread: function (notifications) {
        this.fireEvent('abp_notifications_unread', notifications);
    },
    __updateGlobalSearchSuggestions: function (searchId, seachTerm, suggestions, removeCaseInsensitiveDuplicates) {
        this.fireEvent('abp_search_suggestions', searchId, seachTerm, suggestions, removeCaseInsensitiveDuplicates);
    },

    // Pass on to Headlines Handler
    __showHeadlines: function (headlines) {
        this.fireEvent('abp_headlines_show', headlines);
    },

    __hideHeadline: function (uniqueId) {
        this.fireEvent('abp_headlines_hide', uniqueId)
    },

    // Allow application to hook into the headlines manager store, to load the data needed for editing.
    __loadHeadlines: function () {
        // Include store with the event.
        this.fireEvent('abp_headlines_load');
    },

    // Pass on to Thumbbar Handler
    __showThumbbar: function (config) {
        this.fireEvent("thumbbar_show", config);
    },
    __hideThumbbar: function (clear) {
        this.fireEvent("thumbbar_hide", clear);
    },

    // Update the user profile settings
    __updateUserProfile: function (profileData) {
        this.fireEvent('main_updateUserProfile', profileData);
    },

    //Milestone Events - fired when milestones are hit to alert packages that may be waiting for them
    __bootstrapSuccessful: function () {
        this.fireEvent('abp_milestone_bootstrap_success');
    },
    __authenticationSuccessful: function () {
        this.fireEvent('abp_milestone_authentication_success');
    },
    __configurationProcessed: function () {
        this.fireEvent('abp_milestone_config_processed');
    }
});