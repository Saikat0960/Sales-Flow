/**
 * Singleton object with ABP events
 *
 * Warning: As long as the functionality for the following properties exist in ABP, they will return accurately the intended underlying events.  However those underlying events may change for little to no reason at any time.  We highly advise relying on these properties and not the underlying mapped events.
 *
 * example usage from a view Controller:
 *
 *           this.fireEvent(ABP.Events.toolbarSetTitle, 'New Form');
 *
 *  formerly:
 *
 *           this.fireEvent('container_toolbar_setTitle', 'New Form');
 *
 */
Ext.define('ABP.util.Events', {
    singleton: true,
    alternateClassName: 'ABP.Events',

    // ABP Container Events
    /**
    * @property signOut
    * Fire to signout of session and reload page to login.
    * @readonly
    * @param {String} reason Reason for signing out (can be an i18n key)
    * @param {Boolean} force true to shutdown without waiting for responses
    */
    signOut: 'main_DestroySession',
    /**
    * @property showSettings
    * Fire to open the defined setting page for the user.
    * @readonly
    * @param {String} page page to open
    *
    *       Valid pages:
    *           - 'helpview' - opens the help page.
    *           - 'about' - opens the about page.
    *           - 'loggerpage' - opens the logger page.
    */
    showSettings: 'featureCanvas_showSetting',
    /**
    * @property switchLanguage
    * Fire to request configuration from server with new language strings
    * @readonly
    * @param {String} languageKey language to get new strings for ('es' - spanish)
    */
    switchLanguage: 'main_switchLanguage',

    /**
    * @property setRoute
    * Fire to change the route hash and navigates to the appropriate destination
    * @readonly
    * @param {String} hash the new hash to use in the url (must be a handled route)
    * @param {Boolean} force (optional) true to force the update of the hash regardless of the current token (Default)
    */
    setRoute: 'container_setRoute',
    /**
    * @property addDefaultLanguageStrings
    * Fire to add default language strings to the main viewmodel.
    * @readonly
    * @param {Object} strings Object containing key value pairs of default language strings
    *
    *       // Example:
    *       strings: {
    *           example_string: 'My Example String'
    *           buttonChangePassword_label: 'Change Password'
    *       }
    */
    addDefaultLanguageStrings: 'main_addDefaultLanguageStrings',
    /**
    * @property updateLanguageStrings
    * Fire to update exsiting default language strings in the main viewmodel.
    * @readonly
    * @param {Object} strings Object containing key value pairs of language strings
    *
    *       // Example:
    *       strings: {
    *           example_string: 'Mon exemple de chaîne'
    *           buttonChangePassword_label: 'Changer le mot de passe'
    *       }
    */
    updateLanguageStrings: 'main_updateLanguageStrings',
    /**
    * @property pendingChanges
    * Fire to toggle the pendingChanges flag. The website reload warning will not be displayed unless pendingChanges is set to true. This is a global viewmodel property so it can also be inspected and bound to.
    * @readonly
    * @param {Boolean} pendingChanges whether or not there are pending changes.
    */
    pendingChanges: 'main_pendingChanges',

    // Menu Events
    /**
    * @property menuToggle
    * Fire to switch the menu state open/close
    * @readonly
    */
    menuToggle: 'session_toggleMenu',
    /**
    * @property menuShow
    * Fire to ​​open the navigation menu.
    * @readonly
    */
    menuShow: 'session_openMenu',
    /**
    * @property menuHide
    * Fire to close the Navigation Menu (collapse into left side of application).
    * @readonly
    */
    menuHide: 'session_closeMenu',
    /**
    * @property menuToggleNav
    * Fire to toggle Navigation Menu between Nav and Tree (if TreeMenu is enabled).
    * @readonly
    */
    menuToggleNav: 'mainMenu_toggleNav',
    /**
    * @property menuEnableOption
    * Fire to set the enable property of a navMenu Button.
    * This may be used as data but has no visual effect.
    * @readonly
    * @param {String} appId the appId of the menu option
    * @param {String} uniqueId uniqueId that was given to this menu option at creation
    * @param {Boolean} isEnabled true to enable the menu option / false to disable
    */
    menuEnableOption: 'mainMenu_enableMenuOption',
    /**
    * @property menuAddOption
     * Fire to add a button to the NavMenu
     * @readonly
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
    menuAddOption: 'mainMenu_addMenuOption',
    /**
    * @property menuRemoveOption
    * Fire to delete a menu option from the navigation menu.
    * @readonly
    * @param {String} appId the appId of the menu option
    * @param {String} uniqueId  the uniqueId that was given to this menu option at creation
    */
    menuRemoveOption: 'mainMenu_removeMenuOption',
    /**
    * @property menuUpdateCount
    * Fire to update the badge info of a menu item
    * @readonly
    * @param {String} appId the appId of the menu option
    * @param {String} uniqueId  the uniqueId that was given to this menu option at creation
    * @param {Object} config the new button badge configuration
    *
    *       config: {
    *           priority: priority level of the badge
    *           count: number to show on badge
    *       }
    */
    menuUpdateCount: 'mainMenu_updateMenuCount',
    /**
    * @property menuAddRecent
    * Fire to add the most recent visited page to the Recent section of the Navigation Menu.
    * @readonly
    * @param {Object} pageInfo Button Configuration
    *
    *       // Fire to add a page to recents. By default the recents menu item will not display the current page,
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
    menuAddRecent: 'mainMenu_addRecent',
    /**
    * @property menuAddFavorite
    * Fire to Add a page to the Favorites Section of the Navigation Menu.
    * @readonly
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
    menuAddFavorite: 'mainMenu_addFavorite',
    /**
    * @property menuRemoveFavorite
    * Fire to remove a specific favorite item.
    * @readonly
    * @param {String} appId the appId associated with this favorite item.
    * @param {String} uniqueId the uniqueId associated with this favorite item.
    */
    menuRemoveFavorite: 'mainMenu_removeFavorite',
    /**
    * @property menuUpdateFavorites
    * Fired by Favorites Manager after an update/save to favorites structure.  Clears Favorites and adds passed in array in it's place.
    * @readonly
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
    menuUpdateFavorites: 'mainmenu_updateFavorites',
    /**
    * @property favoritesUpdated
    * @readonly
    * Fire when the favorites are updated
    */
   favoritesUpdated: 'favorites_updated',
    /**
    * @property menuFocusFavorites
    * @readonly
    * Attempt to keyboard focus the first favorite menu items
    */
    menuFocusFavorites: 'mainmenu_focusFavorites',
    /**
    * @property menuReplaceSuggested
    * Fire to remove what is in suggested section of Navigation Menu and populate with what is passed in (or just empty it if an empty array is passed).
    * @readonly
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
    menuReplaceSuggested: 'mainMenu_replaceSuggested',
    /**
    * @property menuAddTreeItems
    * Fire to add a Button(s) to the Tree Navigation and the search store.
    * @readonly
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
    menuAddTreeItems: 'mainMenu_addTreeOption',
    /**
    * @property menuRemoveTreeItem
    * Fire to remove a Buttonfrom the Tree Navigation and the search store.
    * @readonly
    * @param {String} appId appId associated with button to remove
    * @param {String} uniqueId uniqueId of button to be removed
    */
    menuRemoveTreeItem: 'mainMenu_removeTreeOption',

    // ToolBar Events
    /**
    * @property toolbarSetTitle
    * Fire to change the title of the toolbar to the specified string.
    * @readonly
    * @param {String} newTitle new title for the toolbar
    */
    toolbarSetTitle: 'toolbar_setTitle',
    /**
    * @property toolbarAddButton
    * Fire to add a button to the toolbar
    * @readonly
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
    *           // String - appId is mandatory for adding button.
    *           appId: 'kitchensink'
    *       }
    *
    *   __NOTE__: the parameters 'icon', 'func' and  'uniqueId' have been depricated in favor of the single button config object.
    */
    toolbarAddButton: 'toolbar_addButton',
    /**
    * @property toolbarRemoveButton
    * Fire to remove a button from the toolbar.
    * @readonly
    * @param {String} uniqueId  the uniqueId that was given to this menu option at creation
    */
    toolbarRemoveButton: 'toolbar_removeButton',
    /**
    * @property toolbarOpenSearch
    * Fire to open the search bar (if search has been enabled by configuration settings).
    * @readonly
    */
    toolbarOpenSearch: 'toolbar_openSearch',

    // Right Tab Panel Events
    /**
    * @property rightPaneToggle
    * Fire to toggle the right pane.
    * @readonly
    */
    rightPaneToggle: 'rightPane_toggle',
    /**
    * @property rightPaneToggleTab
    * Fire to toggle and activate a specific tab - showing a tab will also force the button to show. Hiding a tab will not hide the button (for that use rightPaneShowButton).
    * @readonly
    * @param {String} uniqueId The tab to toggle. Use the uniqueId not the name.
    * @param {Boolean} [open] true to force the tab to open and false to close, regardless of the current state.
    */
    rightPaneToggleTab: 'rightPane_toggleTab',
    /**
    * @property rightPaneAddElement
    * Fire to add an item to the right pane. This will show the right pane if it was empty and hidden.
    * @readonly
    * @param {Object[]} content An item or array of items to add to the right pane. These should be actual components (eg. panels, buttons etc) __NOTE__: if content is a string it will be converted into an xtype.
    */
    rightPaneAddElement: 'rightPane_addElement',
    /**
    * @property rightPaneShowButton
    * Fire to toggle visibility of a tab button. The tab will still exist but the button will not be shown in the UI.
    * @readonly
    * @param {String} uniqueId The tab button to show or hide.
    * @param {Boolean} show true to show the button, false to hide.
    */
    rightPaneShowButton: 'toolbar_setVisibilityRightPaneButton',
    /**
    * @property rightPaneInitTab
    * @readonly
    * @param {String} uniqueId Since tabs are lazily created in Classic (Tabs are not created until the first time opening them) this listener is available to force the tab, and therefore your specified xtype, to be initialized without showing the tab.
    */
    rightPaneInitTab: 'rightPane_initTab',
    /**
    * @property rightPaneUpdateBadge
    * Fire to update the badge for the specified button. The badge's display value and priority (color) can be changed.
    * @readonly
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
    rightPaneUpdateBadge: 'toolbar_updateBadge',
    /**
    * @property rightPaneIncrementBadge
    * Fire to increase the count on the badge of the button specified.
    * @readonly
    * @param {String} uniqueId The uniqueId for the right pane button.
    * @param {Number} [number] Increase the badge count by this number, defaults to 1.
    */
    rightPaneIncrementBadge: 'toolbar_incrementBadge',
    /**
    * @property rightPaneDecrementBadge
    * Fire to decrease the count on the badge of the button specified.
    * @readonly
    * @param {String} uniqueId The uniqueId for the right pane button.
    * @param {Number} [number] Decreases the badge count by this number, defaults to one. Count cannot be reduced below zero.
    */
    rightPaneDecrementBadge: 'toolbar_decrementBadge',
    /**
    * @property rightPaneClearBadge
    * Fire to clear the badge on the specified button.
    * @readonly
    * @param {String} uniqueId The uniqueId for the right pane button.
    */
    rightPaneClearBadge: 'toolbar_clearBadge',

    // Notification Events
    /**
    * @property notificationsAdd
    * Fire to add notifications. Notification badge will update according to number of new notifications.
    * @readonly
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
    notificationsAdd: 'abp_notifications_add',
    /**
    * @property notificationsRemove
    * Fire to remove notifications from the held records. Notification badge will update according to notifications removed
    * @readonly
    * @param {Array} notifications the list of notifications to remove, like so:
    *
    *          var notifications = [{
    *              // String uniqueId - identifier to uniquely identify this notification
    *              uniqueId: '572c784f-e4db-4f2c-aedb-9566426fe74b'
    *          }, {
    *              // more notifications
    *          }];
    */
    notificationsRemove: 'abp_notifications_remove',
    /**
    * @property notificationsRead
    * Fire to mark notifications as read. Notification badge will update according to notifications marked read
    * @readonly
    * @param {Array} notifications the list of notifications to mark as read, each object looks like so:
    *
    *          var notifications = [{
    *              // String uniqueId - identifier to uniquely identify this notification
    *              uniqueId: '572c784f-e4db-4f2c-aedb-9566426fe74b'
    *          }, {
    *              // more notifications
    *          }];
    */
    notificationsRead: 'abp_notifications_read',
    /**
    * @property notificationsUnread
    * Fire to mark notifications as unread. Notification badge will update according to notifications marked unread
    * @readonly
    * @param {Array} notifications the list of notifications to mark as unread, each object looks like so:
    *
    *          var notifications = [{
    *              // String uniqueId - identifier to uniquely identify this notification
    *              uniqueId: '572c784f-e4db-4f2c-aedb-9566426fe74b'
    *          }, {
    *              // more notifications
    *          }];
    */
    notificationsUnread: 'abp_notifications_unread',

    // Global Search Events
    /**
    * @property globalSearchSuggestions
    * Handle any suggestions being passed from the application
    * @readonly
    * @param {String} searchId the searchId of the applicable search store
    * @param {String} searchTerm (optional) term that was searched
    * @param {String[]} suggestions suggestions to be added
    */
    globalSearchSuggestions: 'abp_search_suggestions',

    // Headline Events
    /**
    * @property headlinesShow
    * @readonly
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
    headlinesShow: 'abp_headlines_show',
    /**
    * @property headlinesHide
    * Fire to hide the specified headline if it is showing.
    * @readonly
    * @param {String} uniqueId the headline uniqueId.
    */
    headlinesHide: 'abp_headlines_hide',

    //Thumbbar Events
    /**
    * @property thumbbarShow
    * Shows the Thumbbar (thumbbar only available in modern toolkit only)
    * @readonly
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
    thumbbarShow: 'thumbbar_show',
    /**
    * @property thumbbarHide
    * Hides the Thumbbar (thumbbar only available in modern toolkit only)
    * @readonly
    * @param {Boolean} clear removes all content from the thumbbar when it hides
    */
    thumbbarHide: 'thumbbar_hide',

    /**
    * @property userProfileEdit
    * Triggers a request to show the user profile edit view
    * @readonly
    * @param {Boolean} clear removes all content from the thumbbar when it hides
    */
    userProfileEdit: 'user_profile_edit'

});