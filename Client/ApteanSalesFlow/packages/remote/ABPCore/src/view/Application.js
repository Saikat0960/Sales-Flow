/**
 * The application is the main entry point for ABP based applications. The product specific applications should be derived from this class.
 *
 * Listeners as defined below represent the events that can fired from an application to ABP from a controller to interact with the compnents of ABP
 */
Ext.define('ABP.view.Application', {
    extend: 'Ext.app.Application',

    name: 'ABP',

    requires: [
        'ABP.util.Common',
        'ABP.util.Constants',
        'ABP.util.Config',
        'ABP.util.CSS.Colors',
        'ABP.util.Events',
        'ABP.util.Jwt',
        'ABP.util.Logger',
        'ABP.util.Msal',
        'ABP.view.Root',
        'ABP.view.ApplicationController',
        'ABP.view.base.popUp.PopUp',
        'ABP.view.base.toast.ABPToast',
        'ABP.view.base.automation.AutomationHintOverlay',
        'ABP.store.ABPEnvironmentStore',
        'ABP.store.ABPPreBootstrapConfigStore',
        'ABP.view.base.PackageViewController',

        'ABP.events.ABPEventDomain',
        'ABP.events.ABPEvents'
    ],

    stores: [
        'ABP.store.ABPApplicationServicesStore',
        'ABP.store.ApplicationAuthenticationStore',
        'ABP.store.ABPEnvironmentStore',
        'ABP.store.ABPServerUrlStore',
        'ABP.store.ABPPreBootstrapConfigStore'
    ],

    controllers: [
        'ABP.view.Root',
        'ABP.view.ApplicationController'
    ],

    listen: {
        controller: {
            '#': {
                unmatchedroute: 'onUnmatchedRoute'
            }
        }
    },

    // ***********************************************************************************
    // Begin Events
    // ***********************************************************************************
    /**
     * @event toolbartop_logoclick
     * This global event fires from the ToolbarTopController (classic) or MainMenuController
     * (modern) when the custom title image has been clicked
     * @param element
     */

    /**
     * @event afterSwitchLanguage
     * Fires after the language is switched post Configuration.  The event is fired after the new strings have replaced the old in the view model.
    */

    /**
     * @event headline_read
     * @param {String} uniqueId The uniqueId of the headline. This event is fired whenever a headline's OK (read) button has been clicked by a user.
     */

    /**
     * @event headline_action
     * @param {String} uniqueId The uniqueId of the headline. This event is fired whenever a headline's action button is clicked by a user.
     */

    /**
     * @event headline_save
     * @param {Ext.data.Model} headline The record of a headline. This event is fired whenever a headline is saved in the headlines manager.
     */

    /**
     * @event headline_delete
     * @param {Ext.data.Model} headline The record of a headline. This event is fired whenever a headline is deleted in the headlines manager.
     */

    /**
     * @event headline_manager_initialize
     * @param {Ext.data.Store} headlinesStore The store used within the headlines manager grid. Objects with the below structure can be loaded into the store via the loadData([objects]) method.
     *
     *          var headline = {
     *              // String message - the message to display in the headline. Accepts a string value, including html.
     *              message: 'New updates available. Read more <a target="_blank" href="http://url">here</a>!',
     *              // String messageKey - i18n string for the message, if available (Optional). If specified, message is ignored
     *              messageKey: 'custom_headline_text',
     *              // String actionText - If provided, a button will appear on the the headline with this text. The "headline_action" event is fired for this button being clicked
     *              actionText: 'Custom text',
     *              // String actionTextKey - i18n string for the actionText, if available (Optional). If specified, actionText is ignored
     *              actionTextKey: 'custom_action_text',
     *              // String uniqueId - identifier to uniquely identify this headline
     *              uniqueId: '572c784f-e4db-4f2c-aedb-9566426fe74b',
     *              // Integer priority - this headlines priority; either 0 - Info, 1 - Warning, 2 - Alert. Each will be styled accordingly
     *              priority: 0,
     *              // Boolean single - if true, no information of the headline will be stored locally. Show, close, and forget.
     *              single: true,
     *              // String startTime - An ISO8601 string representing the headline's starting datetime.
     *              startTime: '2018-08-01T08:00:00Z',
     *              // String endTime - An ISO8601 string representing the headline's ending datetime.
     *              endTime: '2018-08-01T12:00:00Z',
     *              // Boolean published - Whether or not the headline is desired to be active.
     *              published: false
     *          };
     *
     * This event is only fired if the headlines manager is enabled. After this event is fired, the store can be obtained at any point using Ext.getStore('ABPHeadlines').
     */

    onUnmatchedRoute: function (hash) {
        if (!ABP.util.Config.getLoggedIn()) {
            if (hash.indexOf("/") > 0) {
                ABP.util.SessionStorage.set("AfterLoginRedirect", hash);
            }
        }
    },

    launch: function () {
        ABP.util.Config.setApplication(this);

        // Start logging utility
        ABP.util.Logger.enable();
        Ext.Ajax.setDefaultHeaders({
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        });
    }
    // ***********************************************************************************
    // Begin Listeners
    // ***********************************************************************************

    /**
    * @listener container_addDefaultLanguageStrings
    * Fire to add default language strings to the main viewmodel.
    * @param {Object} strings Object containing key value pairs of default language strings
    *
    *       // Example:
    *       strings: {
    *           example_string: 'My Example String'
    *           buttonChangePassword_label: 'Change Password'
    *       }
    */

    /**
    * @listener container_updateLanguageStrings
    * Fire to update default language strings in the main viewmodel.
    * @param {Object} strings Object containing key value pairs of language strings
    *
    *       // Example:
    *       strings: {
    *           example_string: 'Mon exemple de chaîne'
    *           buttonChangePassword_label: 'Changer le mot de passe'
    *       }
    */

    /**
    * @listener container_addMenuOption
    * Fire to add a button to the NavMenu.(button, nav, parentAppId, parentId)
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
    * @param {String} parentAppId (optional) appId of parent Node. If provided then this button is to be a child of an existing navigation button. 
    * If the parentId is specified then parentAppId + "_" is prepended to the parentId. If not specified then just the parentId is used.
    * @param {String} parentId (optional) unique id of parent Node. If provided then this button is to be a child of an existing navigation button. 
    * parentAppId + "_" is prepended to parentId is parentAppId is specified. Otherwise just parentId is used to identify which parent node to add to.
    * @param {Boolean} tree true to add this item to the legacy tree menu and not the nav menu. Default is false.
    *
    *  __NOTE__: if parentAppId and parentId are not provided the button will be added to the root and appear at the top level of the menu.
    */

    /**
    * @listener container_enableMenuOption
    * Fire to enable/disable a navMenu Button
    * @param {String} appId the appId of the menu option
    * @param {String} uniqueId uniqueId that was given to this menu option at creation
    * @param {Boolean} isEnabled true to enable the menu option / false to disable
    */

    /**
    * @listener container_hideMenu
    * Fire to close the Navigation Menu (collapse into left side of application).
    */

    /**
    * @listener container_menuAddFavorite
    * Fire to Add a page to the Favorites Section of the Navigation Menu.
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
    * @param {Boolean} saveRequest whether or not to make the server request to update favorites (PUT: abp/favorites). Defaults to true.
    */

    /**
    * @listener container_menuRemoveFavorite
    * Fire to remove a specific favorite item.
    * @param {String} appId the appId associated with this favorite item.
    * @param {String} uniqueId the uniqueId associated with this favorite item.
    * @param {Boolean} saveRequest whether or not to make the server request to update favorites (PUT: abp/favorites). Defaults to true.
    */

    /**
    * @listener container_menuAddRecent
    * Fire to add the most recent visited page to the Recent section of the Navigation Menu.
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

    /**
    * @listener container_menuAddTreeItems
    * Fire to add a Button(s) to the Tree Navigation and the search store.
    * @param {Object/Object[]} treeItems Button config to add or Array of Button Configs
    *
    *       If added as a child to an existing menu item, include parentAppId and parentId as properties of the object(s)
    *       If no parentAppId and parentId is supplied, object(s) will be added to the root of the menu.
    */

    /**
    * @listener container_menuRemoveTreeItem
    * Fire to remove a Buttonfrom the Tree Navigation and the search store.
    * @param {String} appId appId associated with button to remove
    * @param {String} uniqueId uniqueId of button to be removed
    */

    /**
    * @listener container_menuReplaceSuggested
    * Fire to remove what is in suggested section of Navigation Menu and populate with what is passed in (or just empty it if an empty array is passed).
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

    /**
    * @listener container_menuUpdateFavorites
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
    * @param {Boolean} saveRequest whether or not to make the server request to update favorites (PUT: abp/favorites). Defaults to true.
    */

    /**
    * @listener container_openSearch
    * Fire to open the search bar (if search has been enabled by configuration settings).
    */

    /**
    * @listener container_removeMenuOption
    * Fire to delete a menu option from the navigation menu.
    * @param {String} appId the appId of the menu option
    * @param {String} uniqueId  the uniqueId that was given to this menu option at creation
    */

    /**
    * @listener container_setRoute
    * Fire to change the route hash and navigates to the appropriate destination
    * @param {String} hash the new hash to use in the url (must be a handled route)
    * @param {Boolean} force (optional) true to force the update of the hash regardless of the current token (Default)
    */

    /**
    * @listener container_showMenu
    * Fire to ​​open the navigation menu.
    */

    /**
    * @listener container_showSettings
    * Fire to open the defined setting page for the user.
    * @param {String} page page to open
    *
    *       Valid pages:
    *           - 'helpview' - opens the help page.
    *           - 'about' - opens the about page.
    *           - 'loggerpage' - opens the logger page.
    *           - 'settingspage' (modern only) - opens the settings page.
    */

    /**
    * @listener container_signOut
    * Fire to signout of session and reload page to login.
    * @param {String} reason Reason for signing out (can be an i18n key)
    * @param {Boolean} force true to shutdown without waiting for responses
    */

    /**
    * @listener container_switchLanguage
    * Fire to request configuration from server with new language strings
    * @param {String} languageKey language to get new strings for ('es' - spanish)
    */

    /**
    * @listener container_toggleMenu
    * Fire to switch the menu state open/close
    */

    /**
    * @listener container_toggleNav
    * Fire to toggle Navigation Menu between Nav and Tree (if TreeMenu is enabled).
    */

    /**
    * @listener container_toolbar_addButton
    * Fire to add a button to the toolbar
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
    *       }
    *
    *   __NOTE__: the parameters 'icon', 'func' and  'uniqueId' have been depricated in favor of the single button config object.
    */

    /**
    * @listener container_toolbar_removeButton
    * Fire to remove a button from the toolbar.
    * @param {String} uniqueId  the uniqueId that was given to this menu option at creation
    */

    /**
    * @listener container_toolbar_setTitle
    * Fire to change the title of the toolbar to the specified string.
    * @param {String} newTitle new title for the toolbar
    */

    /**
    * @listener container_toolbar_showBranding
    * Fire to change the visibility of the branding text or logo, shown next to the left navigation menu button in the toolbar.
    * @param {Boolean} showBranding Whether to show (true) or hide (false) the branding area.
    */

    /**
    * @listener container_rightPane_toggle
    * Fire to toggle the right pane.
    */

    /**
    *  @listener container_rightPane_toggleTab
    *  Fire to toggle and activate a specific tab - showing a tab will also force the button to show. Hiding a tab will not hide the button (for that use container_rightPane_showButton).
    *  @param {String} uniqueId The tab to toggle. Use the uniqueId not the name.
    *  @param {Boolean} [open] true to force the tab to open and false to close, regardless of the current state.
    */

    /**
    *  @listener container_rightPane_showButton
    *  Fire to toggle visibility of a tab button. The tab will still exist but the button will not be shown in the UI.
    *  @param {String} uniqueId The tab button to show or hide.
    *  @param {Boolean} show true to show the button, false to hide.
    */

    /**
    *  @listener container_rightPane_initTab
    *  @param {String} uniqueId Since tabs are lazily created in Classic (Tabs are not created until the first time opening them) this listener is available to force the tab, and therefore your specified xtype, to be initialized without showing the tab.
    */

    /**
    * @listener container_rightPane_addElement
    * Fire to add an item to the right pane. This will show the right pane if it was empty and hidden.
    * @param {Object[]} content An item or array of items to add to the right pane. These should be actual components (eg. panels, buttons etc) __NOTE__: if content is a string it will be converted into an xtype.
    */

    /**
    * @listener container_rightPane_updateBadge
    * Fire to update the badge for the specified button. The badge's display value and priority (color) can be changed.
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

    /**
    * @listener container_rightPane_incrementBadge
    * Fire to increase the count on the badge of the button specified.
    * @param {String} uniqueId The uniqueId for the right pane button.
    * @param {Number} [number] Increase the badge count by this number, defaults to 1.
    */

    /**
    * @listener container_rightPane_decrementBadge
    * Fire to decrease the count on the badge of the button specified.
    * @param {String} uniqueId The uniqueId for the right pane button.
    * @param {Number} [number] Decreases the badge count by this number, defaults to one. Count cannot be reduced below zero.
    */

    /**
    * @listener container_rightPane_clearBadge
    * Fire to clear the badge on the specified button.
    * @param {String} uniqueId The uniqueId for the right pane button.
    */

    /**
     * @listener container_headlines_show
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

    /**
     * @listener container_headlines_hide
     * Fire to hide the specified headline if it is showing.
     * @param {String} uniqueId the headline uniqueId.
     */

    /**
     * @listener container_notifications_add
     * Fire to add notifications. Notification badge will update according to number of new notifications.
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

    /**
     * @listener container_notifications_remove
     * Fire to remove notifications from the held records. Notification badge will update according to notifications removed
     * @param {Array} notifications the list of notifications to remove, like so:
     *
     *          var notifications = [{
     *              // String uniqueId - identifier to uniquely identify this notification
     *              uniqueId: '572c784f-e4db-4f2c-aedb-9566426fe74b'
     *          }, {
     *              // more notifications
     *          }];
     */

    /**
     * @listener container_notifications_read
     * Fire to mark notifications as read. Notification badge will update according to notifications marked read
     * @param {Array} notifications the list of notifications to mark as read, each object looks like so:
     *
     *          var notifications = [{
     *              // String uniqueId - identifier to uniquely identify this notification
     *              uniqueId: '572c784f-e4db-4f2c-aedb-9566426fe74b'
     *          }, {
     *              // more notifications
     *          }];
     */

    /**
     * @listener container_notifications_unread
     * Fire to mark notifications as unread. Notification badge will update according to notifications marked unread
     * @param {Array} notifications the list of notifications to mark as unread, each object looks like so:
     *
     *          var notifications = [{
     *              // String uniqueId - identifier to uniquely identify this notification
     *              uniqueId: '572c784f-e4db-4f2c-aedb-9566426fe74b'
     *          }, {
     *              // more notifications
     *          }];
     */

    /**
    * @listener container_go_online
    * Prompts the user to go online.
    * @param {Boolean} force Skips the prompt. User will still need to enter their password again.
    */

    /**
    * @listener container_go_offline
    * Prompts the user to go offline.
    * @param {Boolean} force Skips the prompt.
    */

    /**
     * @listener container_thumbbar_show
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

    /**
     * @listener container_thumbbar_hide
     * Hides the Thumbbar (thumbbar only available in modern toolkit only)
     * @param {Boolean} clear removes all content from the thumbbar when it hides
     */

    /**
     * @listener container_pendingChanges
     * Fire to toggle the pendingChanges flag. The website reload warning will not be displayed unless pendingChanges is set to true. This is a global viewmodel property so it can also be inspected and bound to.
     * @param {Boolean} pendingChanges whether or not there are pending changes.
     */
});
