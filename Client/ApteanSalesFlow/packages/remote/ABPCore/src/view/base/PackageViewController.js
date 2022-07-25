/**
 * Base Controller for packages.  Includes ABP Interaction helper functions.
 *
 * This controller is meant to be extended and used as the main controller for packages.
 *
 * example usage from an extended controller
 *
 *      exampleFunction: function (newTitle) {
 *          this.toolbarSetTitle(newTitle)
 *      }
 *
 * example usage from an extended controller overriding the method to add extra functionailty
 *
 *      toolbarSetTitle: function (newTitle) {
 *          newTitle = newTitle + " demo";
 *          this.callParent(newTitle);
 *      }
 */

Ext.define('ABP.view.base.PackageViewController', {
    extend: 'Ext.app.ViewController',
    alternateClassName: 'basepackagecontroller',
    alias: 'controller.abppackageviewcontroller',

    /**
     * Update the toolbar title.
     * @param {String} title The text to show at the top of the app. 
     */
    updateTitle: function (title) {
        this.fireEvent('container_toolbar_setTitle', title);
    },

    /**
     * Show or hide the branding text or image to the right of the toolbar navigation menu button (Classic only).
     * @param {Boolean} show Whether to show (true) or hide (false) the branding area.
     */
    showBranding: function (show) {
        this.fireEvent('container_toolbar_showBranding', show);
    },

    // ABP Container Functions
    /**
    * signout of session and reload page to login.
    * @param {String} reason Reason for signing out (can be an i18n key)
    * @param {Boolean} force true to shutdown without waiting for responses
    */
    signOut: function (reason, force) {
        this.fireEvent(ABP.Events.signOut, reason, force);
    },

    /**
    * open the defined setting page for the user.
    * @param {String} page page to open
    *
    *       Valid pages:
    *           - 'helpview' - opens the help page.
    *           - 'about' - opens the about page.
    *           - 'loggerpage' - opens the logger page.
    */
    showSettings: function (page) {
        this.fireEvent(ABP.Events.showSettings, page);
    },
    /**
     * request configuration from server with new language strings
     * @param {String} languageKey language to get new strings for ('es' - spanish)
     */
    switchLanguage: function (languageKey) {
        this.fireEvent(ABP.Events.switchLanguage, languageKey);
    },
    /**
    * change the theme applied to ABP
    * @param {String} theme theme to apply to ABP
    */
    switchTheme: function (theme) {
        this.fireEvent(ABP.Events.switchTheme, theme);
    },
    /**
    * change the route hash and navigates to the appropriate destination
    * @param {String} hash the new hash to use in the url (must be a handled route)
    * @param {Boolean} force (optional) true to force the update of the hash regardless of the current token (Default)
    */
    setRoute: function (hash, force) {
        this.fireEvent(ABP.Events.setRoute, hash, force);
    },
    /**
    * add default language strings to to main viewmodel.
    * @param {Object} strings Object containing key value pairs of default language strings
    *
    *       // Example:
    *       strings: {
    *           example_string: 'My Example String'
    *           buttonChangePassword_label: 'Change Password'
    *       }
    */
    addDefaultLanguageStrings: function (strings) {
        this.fireEvent(ABP.Events.addDefaultLanguageStrings, strings);
    },
    /**
    * toggle the pendingChanges flag. The website reload warning will not be displayed unless pendingChanges is set to true. This is a global viewmodel property so it can also be inspected and bound to.
    * @param {Boolean} pendingChanges whether or not there are pending changes.
    */
    pendingChanges: function (pendingChanges) {
        this.fireEvent(ABP.Events.pendingChanges, pendingChanges);
    },

    // Menu Events
    /**
    * switch the menu state open/close
    */
    menuToggle: function () {
        this.fireEvent(ABP.Events.menuToggle);
    },
    /**
     * ​​open the navigation menu.
     */
    menuShow: function () {
        this.fireEvent(ABP.Events.menuShow);
    },
    /**
     * close the Navigation Menu (collapse into left side of application).
     */
    menuHide: function () {
        this.fireEvent(ABP.Events.menuHide);
    },
    /**
     * toggle Navigation Menu between Nav and Tree (if TreeMenu is enabled).
     */
    menuToggleNav: function () {
        this.fireEvent(ABP.Events.menuToggleNav);
    },
    /**
     * enable/disable a navMenu Button
     * @param {String} appId the appId of the menu option
     * @param {String} uniqueId uniqueId that was given to this menu option at creation
     * @param {Boolean} isEnabled true to enable the menu option / false to disable
     */
    menuEnableOption: function (appId, uniqueId, isEnabled) {
        this.fireEvent(ABP.Events.menuEnableOption, appId, uniqueId, isEnabled);
    },
    /**
     * add a button to the NavMenu
     * @param {Object} button Button Configuration
     *
     *       var button = {
     *           activateApp: true,
     *           appId: '',
     *           uniqueId: '',
     *           // 'route' or 'event'. If 'route' provide a value for hash, if 'event' provide a value for event.
     *           type: 'event',
     *           // children are also pageInfo objects.
     *           children : [],
     *           enabled: true,
     *           // Event which is fired upon click, event from ABP is fired with appId prepended like 'appId_event'.
     *           event: 'myEvent',
     *           // event arguments to be passed along to the event handler.
     *           eventArgs: [],
     *           // On click, updates current URL with this hash, your application must use routing for this to work.
     *           hash: '',
     *           // (optional) use apteanico-mini icons (eg. 'icon-user').
     *           icon: 'icon-user',
     *           // (optional) item href to attach to this menu item. Allows user to right click -> open url in new tab.
     *           itemHref: '',
     *           label: '',
     *           // i18n string to bind to this menu item. Replaces label.
     *           labelKey: 'i18n_string'
     *       };
     *
     * @param {Boolean} nav true to add to Nav Menu, false to add to Session Menu
     * @param {String} parentAppId (optional) appId of parent Node, if provided this button is to be a child of an existing navigation button
     * @param {String} parentId (optional) unique id of parent Node, if provided this button is to be a child of an existing navigation button
     * @param {Boolean} tree true to add this item to the tree menu and not the nav menu
     *
     *  __NOTE__: if parentAppId and parentId are not provided the button will be added to the root and appear at the top level of the menu.
     */
    menuAddOption: function (nav, parentAppId, parentId, tree) {
        this.fireEvent(ABP.Events.menuAddOption, nav, parentAppId, parentId, tree);
    },
    /**
     * delete a menu option from the navigation menu.
     * @param {String} appId the appId of the menu option
     * @param {String} uniqueId  the uniqueId that was given to this menu option at creation
     */
    menuRemoveOption: function (appId, uniqueId) {
        this.fireEvent(ABP.Events.menuRemoveOption, appId, uniqueId);
    },
    /**
     * update the badge info of a menu item
     * @param {String} appId the appId of the menu option
     * @param {String} uniqueId  the uniqueId that was given to this menu option at creation
     * @param {Object} config the new button badge configuration
     *
     *       config: {
     *           priority: priority level of the badge
     *           count: number to show on badge
     *       }
     */
    menuUpdateCount: function (appId, uniqueId, config) {
        this.fireEvent(ABP.Events.menuUpdateCount, appId, uniqueId, config);
    },
    /**
     * add the most recent visited page to the Recent section of the Navigation Menu.
     * @param {Object} pageInfo Button Configuration
     *
     *       // add a page to recents. By default the recents menu item will not display the current page,
     *       // the pageInfo object is added to recents but not shown until the next recent is added.
     *       // Recents shows up to five pages.
     *
     *       var pageInfo = {
     *           activateApp: true,
     *           appId: '',
     *           uniqueId: '',
     *           // 'route' or 'event'. If 'route' provide a value for hash, if 'event' provide a value for event.
     *           type: 'event',
     *           // children are also pageInfo objects.
     *           children : [],
     *           enabled: true,
     *           // Event which is fired upon click, event from ABP is fired with appId prepended like 'appId_event'.
     *           event: 'myEvent',
     *           // event arguments to be passed along to the event handler.
     *           eventArgs: [],
     *           // On click, updates current URL with this hash, your application must use routing for this to work.
     *           hash: '',
     *           // (optional) use apteanico-mini icons (eg. 'icon-user').
     *           icon: 'icon-user',
     *           // (optional) item href to attach to this menu item. Allows user to right click -> open url in new tab.
     *           itemHref: '',
     *           label: '',
     *           // i18n string to bind to this menu item. Replaces label.
     *           labelKey: 'i18n_string'
     *       };
     */
    menuAddRecent: function (pageInfo) {
        this.fireEvent(ABP.Events.menuAddRecent, pageInfo);
    },
    /**
     * Add a page to the Favorites Section of the Navigation Menu.
     * @param {Object} pageInfo Button Configuration
     *
     *       var pageInfo = {
     *           activateApp: true,
     *           appId: '',
     *           uniqueId: '',
     *           // 'route' or 'event'. If 'route' provide a value for hash, if 'event' provide a value for event.
     *           type: 'event',
     *           // children are also pageInfo objects.
     *           children : [],
     *           enabled: true,
     *           // Event which is fired upon click, event from ABP is fired with appId prepended like 'appId_event'.
     *           event: 'myEvent',
     *           // event arguments to be passed along to the event handler.
     *           eventArgs: [],
     *           // On click, updates current URL with this hash, your application must use routing for this to work.
     *           hash: '',
     *           // (optional) use apteanico-mini icons (eg. 'icon-user').
     *           icon: 'icon-user',
     *           // (optional) item href to attach to this menu item. Allows user to right click -> open url in new tab.
     *           itemHref: '',
     *           label: '',
     *           // i18n string to bind to this menu item. Replaces label.
     *           labelKey: 'i18n_string'
     *       };
     */
    menuAddFavorite: function (pageInfo) {
        this.fireEvent(ABP.Events.menuAddFavorite, pageInfo);
    },
    /**
     * remove a specific favorite item.
     * @param {String} appId the appId associated with this favorite item.
     * @param {String} uniqueId the uniqueId associated with this favorite item.
     */
    menuRemoveFavorite: function (appId, uniqueId) {
        this.fireEvent(ABP.Events.menuRemoveFavorite, appId, uniqueId);
    },
    /**
     * Fired by Favorites Manager after an update/save to favorites structure.  Clears Favorites and adds passed in array in it's place.
     *
     *   Favorites should be loaded per user on the main configuration object (ie. configuration.favorites). For now this event is intended to be fired only by the favorites manager.
     *
     * @param {Array/String} favoritesArray The new Favorites structure to be shown in the nav Menu. Can be an array of favorites or a JSON string representing this array.
     *
     *
     *       var favorites = [{
     *           activateApp: true,
     *           appId: '',
     *           uniqueId: '',
     *           // 'route' or 'event'. If 'route' provide a value for hash, if 'event' provide a value for event.
     *           type: 'event',
     *           // children are also pageInfo objects.
     *           children : [],
     *           enabled: true,
     *           // Event which is fired upon click, event from ABP is fired with appId prepended like 'appId_event'.
     *           event: 'myEvent',
     *           // event arguments to be passed along to the event handler.
     *           eventArgs: [],
     *           // On click, updates current URL with this hash, your application must use routing for this to work.
     *           hash: '',
     *           // (optional) use apteanico-mini icons (eg. 'icon-user').
     *           icon: 'icon-user',
     *           // (optional) item href to attach to this menu item. Allows user to right click -> open url in new tab.
     *           itemHref: '',
     *           label: '',
     *           // i18n string to bind to this menu item. Replaces label.
     *           labelKey: 'i18n_string'
     *       }, {
     *           // more favorite objects
     *       }];
     *
     */
    menuUpdateFavorites: function (favoritesArray) {
        this.fireEvent(ABP.Events.menuUpdateFavorites, favoritesArray);
    },
    /**
     * Attempt to keyboard focus the first favorite menu items
     */
    menuFocusFavorites: function () {
        this.fireEvent(ABP.Events.menuFocusFavorites);
    },
    /**
     * remove what is in suggested section of Navigation Menu and populate with what is passed in (or just empty it if an empty array is passed).
     * @param {Array} pageInfoArray Array of pageInfo Objects (Button Configurations) to be placed into suggested section of Navigation Menu
     *
     *       var pageInfoArray = [{
     *           activateApp: true,
     *           appId: '',
     *           uniqueId: '',
     *           // 'route' or 'event'. If 'route' provide a value for hash, if 'event' provide a value for event.
     *           type: 'event',
     *           // children are also pageInfo objects.
     *           children : [],
     *           enabled: true,
     *           // Event which is fired upon click, event from ABP is fired with appId prepended like 'appId_event'.
     *           event: 'myEvent',
     *           // event arguments to be passed along to the event handler.
     *           eventArgs: [],
     *           // On click, updates current URL with this hash, your application must use routing for this to work.
     *           hash: '',
     *           // (optional) use apteanico-mini icons (eg. 'icon-user').
     *           icon: 'icon-user',
     *           // (optional) item href to attach to this menu item. Allows user to right click -> open url in new tab.
     *           itemHref: '',
     *           label: '',
     *           // i18n string to bind to this menu item. Replaces label.
     *           labelKey: 'i18n_string'
     *       }, {
     *           // another pageInfo object, up to 5 in the array.
     *       }];
     */
    menuReplaceSuggested: function (pageInfoArray) {
        this.fireEvent(ABP.Events.menuReplaceSuggested, pageInfoArray);
    },
    /**
     * add a Button(s) to the Tree Navigation and the search store.
     * @param {Object/Object[]} treeItems Button config to add or Array of Button Configs
     *
     *       var treeItems = {
     *           activateApp: true,
     *           appId: '',
     *           uniqueId: '',
     *           // 'route' or 'event'. If 'route' provide a value for hash, if 'event' provide a value for event.
     *           type: 'event',
     *           // children are also pageInfo objects.
     *           children : [],
     *           enabled: true,
     *           // Event which is fired upon click, event from ABP is fired with appId prepended like 'appId_event'.
     *           event: 'myEvent',
     *           // event arguments to be passed along to the event handler.
     *           eventArgs: [],
     *           // On click, updates current URL with this hash, your application must use routing for this to work.
     *           hash: '',
     *           // (optional) use apteanico-mini icons (eg. 'icon-user').
     *           icon: 'icon-user',
     *           // (optional) item href to attach to this menu item. Allows user to right click -> open url in new tab.
     *           itemHref: '',
     *           label: '',
     *           // i18n string to bind to this menu item. Replaces label.
     *           labelKey: 'i18n_string'
     *       };
     *
     *
     *       If added as a child to an existing menu item, include parentAppId and parentId as properties of the object(s)
     *       If no parentAppId and parentId is supplied, object(s) will be added to the root of the menu.
     */
    menuAddTreeItems: function (treeItems) {
        this.fireEvent(ABP.Events.menuAddTreeItems, treeItems);
    },
    /**
     * remove a Button from the Tree Navigation and the search store.
     * @param {String} appId appId associated with button to remove
     * @param {String} uniqueId uniqueId of button to be removed
     */
    menuRemoveTreeItem: function (appId, uniqueId) {
        this.fireEvent(ABP.Events.menuRemoveTreeItem, appId, uniqueId);
    },

    // ToolBar Events
    /**
    * change the title of the toolbar to the specified string.
    * @param {String} newTitle new title for the toolbar
    */
    toolbarSetTitle: function (newTitle) {
        this.fireEvent(ABP.Events.toolbarSetTitle, newTitle);
    },
    /**
     * add a button to the toolbar
     * @param {Object} buttonConfig toolbar button config as defined in the configuration
     *
     *       var buttonConfig = {
     *           // String - unique Id for this button.
     *           uniqueId: 'buttonUniqueId',
     *           // Event which is fired by ABP upon click of this button. Listen for your event with appId prepended eg. 'appId_event'.
     *           event: 'myEvent',
     *           // Array of event args, passed to the event handler.
     *           eventArgs: [],
     *           // Declare Type
     *           type: 'event'
     *           // String - appId is  mandatory for adding button.
    *           appId: 'kitchensink'
     *       }
     *
     *   __NOTE__: the parameters 'icon', 'func' and  'uniqueId' have been depricated in favor of the single button config object.
     */
    toolbarAddButton: function (buttonConfig) {
        this.fireEvent(ABP.Events.toolbarAddButton, buttonConfig);
    },
    /**
     * remove a button from the toolbar.
     * @param {String} uniqueId  the uniqueId that was given to this menu option at creation
     */
    toolbarRemoveButton: function (uniqueId) {
        this.fireEvent(ABP.Events.toolbarRemoveButton, uniqueId);
    },
    /**
     * open the search bar (if search has been enabled by configuration settings).
     */
    toolbarOpenSearch: function () {
        this.fireEvent(ABP.Events.toolbarOpenSearch);
    },

    // Right Tab Panel Events
    /**
    * toggle the right pane.
    */
    rightPaneToggle: function () {
        this.fireEvent(ABP.Events.rightPaneToggle);
    },
    /**
     * toggle and activate a specific tab - showing a tab will also force the button to show. Hiding a tab will not hide the button (for that use rightPaneShowButton).
     * @param {String} uniqueId The tab to toggle. Use the uniqueId not the name.
     * @param {Boolean} [open] true to force the tab to open and false to close, regardless of the current state.
     */
    rightPaneToggleTab: function (uniqueId, open) {
        this.fireEvent(ABP.Events.rightPaneToggleTab, uniqueId, open);
    },
    /**
     * add an item to the right pane. This will show the right pane if it was empty and hidden.
     * @param {Object[]} content An item or array of items to add to the right pane. These should be actual components (eg. panels, buttons etc) __NOTE__: if content is a string it will be converted into an xtype.
     */
    rightPaneAddElement: function (content) {
        this.fireEvent(ABP.Events.rightPaneAddElement, content);
    },
    /**
     * toggle visibility of a tab button. The tab will still exist but the button will not be shown in the UI.
     * @param {String} uniqueId The tab button to show or hide.
     * @param {Boolean} show true to show the button, false to hide.
     */
    rightPaneShowButton: function (uniqueId, show) {
        this.fireEvent(ABP.Events.rightPaneShowButton, uniqueId, show);
    },
    /**
     * @param {String} uniqueId Since tabs are lazily created in Classic (Tabs are not created until the first time opening them) this listener is available to force the tab, and therefore your specified xtype, to be initialized without showing the tab.
     */
    rightPaneInitTab: function (uniqueId) {
        this.fireEvent(ABP.Events.rightPaneInitTab, uniqueId);
    },
    /**
     * update the badge for the specified button. The badge's display value and priority (color) can be changed.
     * @param {String} uniqueId The uniqueId for the right pane button.
     * @param {Object} badgeConfig the configuration for the badge, the object looks like so:
     *
     *       var badgeConfig = {
     *           // Integer value - number displayed in the badge.
     *           value: 10
     *           // Use one of the enumerated values ABP.util.Constants.badgePriority - specifies urgency and color.
     *           priority: ABP.util.Constants.badgePriority.Info
     *       }
     */
    rightPaneUpdateBadge: function (uniqueId, badgeConfig) {
        this.fireEvent(ABP.Events.rightPaneUpdateBadge, uniqueId, badgeConfig);
    },
    /**
     * increase the count on the badge of the button specified.
     * @param {String} uniqueId The uniqueId for the right pane button.
     * @param {Number} [number] Increase the badge count by this number, defaults to 1.
     */
    rightPaneIncrementBadge: function (uniqueId, number) {
        this.fireEvent(ABP.Events.rightPaneIncrementBadge, uniqueId, number);
    },
    /**
     * decrease the count on the badge of the button specified.
     * @param {String} uniqueId The uniqueId for the right pane button.
     * @param {Number} [number] Decreases the badge count by this number, defaults to one. Count cannot be reduced below zero.
     */
    rightPaneDecrementBadge: function (uniqueId, number) {
        this.fireEvent(ABP.Events.rightPaneDecrementBadge, uniqueId, number);
    },
    /**
     * clear the badge on the specified button.
     * @param {String} uniqueId The uniqueId for the right pane button.
     */
    rightPaneClearBadge: function (uniqueId) {
        this.fireEvent(ABP.Events.rightPaneClearBadge, uniqueId);
    },

    // Notification Events
    /**
    * add notifications. Notification badge will update according to number of new notifications.
    * @param {String} source The source which is generating the notification (must match source.name in notification settings configuration)
    * @param {String} sourceKey i18n string for the source
    * @param {Array} notifications the list of notifications to add, each object looks like so:
    *
    *       var notifications = [{
    *           // String uniqueId - identifier to uniquely identify this notification
    *           uniqueId: '572c784f-e4db-4f2c-aedb-9566426fe74b',
    *           // String time - an ISO1801 string representing notification time
    *           time: '2018-05-24T07:10:00-03:00',
    *           // Boolean new - indication of whether this is a new alert (false indicates notification has been acknowledged)
    *           new: true,
    *           // Boolean flagged - indication of whether this alert should have an indication of being flagged
    *           flagged: false,
    *           // String category - Category name for notification (all notifications with same name will be grouped)
    *           category: 'Orders',
    *           // String categoryKey - i18n string for the category name, if available (Optional).  If specified, category is ignored
    *           categoryKey: 'product_notifications_category_orders',
    *           // String label - Name for the notification
    *           label: 'Order Alert',
    *           // String labelKey - i18n string for the label, if available (Optional). If specified, label is ignored
    *           labelKey: 'product_notifications_label_order_alert',
    *           // Array labelArgs - array of arguments to pass to fill tokens in labelKey (Optional).  Only used if labelKey specified
    *           labelArgs: [1235],
    *           // String detail - details for the notification
    *           detail: 'Please note that an order was entered for over 1000 &#163;',
    *           // String detailKey - i18n string for the detail string, if available (Optional). If specified, detail is ignored
    *           detailKey: 'product_notifications_label_order_order_entered',
    *           // Array detailArgs - array of arguments to pass to fill tokens in detailKey (Optional). Only used if detailKey specified
    *           detailArgs: [1000, '&#163;'],
    *           // String event - event to fire when this notification link is selected (Optional)
    *           event: 'product_notification_selected',
    *           // Array eventArgs - array of arguments to pass along with the fired event (Optional)
    *           eventArgs: ['572c784f-e4db-4f2c-aedb-9566426fe74b', 'Orders'],
    *           // String downloadEvent - event to fire when this notification download link is selected (Optional)
    *           downloadEvent: 'product_notification_download',
    *           // Array downloadEventArgs - array of arguments to pass along with the fired event (Optional)
    *           downloadEventArgs: ['572c784f-e4db-4f2c-aedb-9566426fe74b', 'Orders']
    *       }, {
    *           ...
    *       }]
    */
    notificationsAdd: function (source, sourceKey, notifications) {
        this.fireEvent(ABP.Events.notificationsAdd, source, sourceKey, notifications);
    },
    /**
     * remove notifications from the held records. Notification badge will update according to notifications removed
     * @param {Array} notifications the list of notifications to remove, like so:
     *
     *          var notifications = [{
     *              // String uniqueId - identifier to uniquely identify this notification
     *              uniqueId: '572c784f-e4db-4f2c-aedb-9566426fe74b'
     *          }, {
     *              // more notifications
     *          }];
     */
    notificationsRemove: function (notifications) {
        this.fireEvent(ABP.Events.notificationsRemove, notifications);
    },
    /**
     * mark notifications as read. Notification badge will update according to notifications marked read
     * @param {Array} notifications the list of notifications to mark as read, each object looks like so:
     *
     *          var notifications = [{
     *              // String uniqueId - identifier to uniquely identify this notification
     *              uniqueId: '572c784f-e4db-4f2c-aedb-9566426fe74b'
     *          }, {
     *              // more notifications
     *          }];
     */
    notificationsRead: function (notifications) {
        this.fireEvent(ABP.Events.notificationsRead, notifications);
    },
    /**
     * mark notifications as unread. Notification badge will update according to notifications marked unread
     * @param {Array} notifications the list of notifications to mark as unread, each object looks like so:
     *
     *          var notifications = [{
     *              // String uniqueId - identifier to uniquely identify this notification
     *              uniqueId: '572c784f-e4db-4f2c-aedb-9566426fe74b'
     *          }, {
     *              // more notifications
     *          }];
     */
    notificationsUnread: function (notifications) {
        this.fireEvent(ABP.Events.notificationsUnread, notifications);
    },

    // Global Search Events
    /**
    * Handle any suggestions being passed from the application
    * @param {String} searchId the searchId of the applicable search store
    * @param {String} searchTerm (optional) term that was searched
    * @param {String[]} suggestions suggestions to be added
    */
    globalSearchSuggestions: function (searchId, searchTerm, suggestions) {
        this.fireEvent(ABP.Events.globalSearchSuggestions, searchId, searchTerm, suggestions);
    },

    // Headline Events
    /**
     * @param {Array} headlines the list of headlines to show, each object looks like so:
     *
     *       var headlines = [{
     *           // String message - the message to display in the headline. Accepts a string value, including html.
     *           message: 'New updates available. Read more <a target="_blank" href="http://url">here</a>!',
     *           // String messageKey - i18n string for the message, if available (Optional). If specified, message is ignored
     *           messageKey: 'custom_headline_text',
     *           // String actionText - If provided, a button will appear on the the headline with this text. The "headline_action" event is fired for this button being clicked
     *           actionText: 'Custom text',
     *           // String actionTextKey - i18n string for the actionText, if available (Optional). If specified, actionText is ignored
     *           actionTextKey: 'custom_action_text',
     *           // String uniqueId - identifier to uniquely identify this headline
     *           uniqueId: '572c784f-e4db-4f2c-aedb-9566426fe74b'
     *           // Integer priority - this headlines priority; either 0 - Info, 1 - Warning, 2 - Alert. Each will be styled accordingly
     *           priority: 0,
     *           // Boolean single - if true, no information of the headline will be stored locally. Show, close, and forget.
     *           single: true
     *       }, {
     *           ...
     *       }]
     */
    headlinesShow: function (headlines) {
        this.fireEvent(ABP.Events.headlinesShow, headlines);
    },
    /**
     * hide the specified headline if it is showing.
     * @param {String} uniqueId the headline uniqueId.
     */
    headlinesHide: function (uniqueId) {
        this.fireEvent(ABP.Events.headlinesHide, uniqueId);
    },

    //Thumbbar Events
    /**
     * Shows the Thumbbar (thumbbar only available in modern toolkit only)
     * @param {Object} config configuration for the thumbbar when it shows
     *
     *      var config = {
     *          // Object searchTool - object with search properties.  If present in config, search Icon will appear on tumbbar.
     *          searchTool: {
     *              Todo: define searchtool properties
     *          },
     *          // Object favoriteTool - object with favorite property
     *          favoriteTool: {
     *              // Boolean isFavorite - true if current page is already favorited
     *              isFavorite: 'true'
     *          },
     *          // Object Array buttons - array of custom buttons to place on thumbbar
     *          buttons: [
     *              {
     *                  // String iconCls - icon to display
     *                  iconCls: 'icon-hand-card',
     *                  // String type - button action ('event' or 'route')
     *                  type: 'event',
     *                  // String event - event to fire when button is clicked (type 'event')
     *                  event: 'appId_event',
     *                  // Array eventArgs - arguments to pass along with event (type 'event')
     *                  eventArgs: ['additional', 'details']
     *              },{
     *                  // String iconCls - icon to display
     *                  iconCls: 'icon-security-agent',
     *                  // String type - button action ('event' or 'route')
     *                  type: 'route',
     *                  // String hash - hash to append to url for redirect (type 'route')
     *                  hash: 'security'
     *              }
     *          ]
     *      }
     */
    thumbbarShow: function (config) {
        this.fireEvent(ABP.Events.thumbbarShow, config);
    },
    /**
     * Hides the Thumbbar (thumbbar only available in modern toolkit only)
     * @param {Boolean} clear removes all content from the thumbbar when it hides
     */
    thumbbarHide: function (clear) {
        this.fireEvent(ABP.Events.thumbbarHide, clear);
    }
});
