/**
 * Common utility functions for ABP based applications.
 *
 * Example:
 *
 *     var localString = ABP.util.Common.geti18nString('btn_OK');
 */
Ext.define('ABP.util.Common', {
    singleton: true,

    /**
     * @private
     */
    __cssClassNameInvalidChars: /[ !\"#$%&'\(\)\*\+,\.\/:;<=>\?\@\[\\\]\^`\{\|\}~]/g,
    __lastLoginAsUserDeferId: null,
    __keyNavigation: false,
    __uuidGenerator: null,

    /**
    * Return the localized string for the given i18n strings key.
    *
    * This function is available for components that do not have their own viewmodel.
    * Components with a viewmodel should be able to use checkI18n() inherited from the main viewmodel.
    *
    * @param {String} i18nKey Name of property in ABP.view.main.ABPMainModel.data.i18n
    * @param {Boolean} disableWarning true to turn off logger warning.  Use if string is acceptable to not be localized (returned from server).
    * @returns {Srting} The value of the i18n key, for the user's current language.
    * If the i18n key is not found then the problem is logged (if not disabled by disableWarning) and the key is returned as the string.
    */
    geti18nString: function (i18nKey, disableWarning) {
        // Gets the mainViewModel without a component query
        // Being a singlton util function we are not actually in the hierachy,
        //   so we can't use an up() to get the main view or corresponding vm
        var app = Ext.getApplication();
        var mainView = app.getMainView();
        var vm = mainView.getViewModel();
        var ret = null;
        if (vm) {
            ret = vm.checkI18n(i18nKey, disableWarning);
        }
        return ret;
    },

    /**
    * Check if the app is running Classic or Modern ExtJS frameworks.
    *
    * @return {Boolean} Whether the application is running using the Classic framework or not.
    */
    getClassic: function () {
        return Ext.toolkit === "classic";
    },

    /**
    * Check if the app is running Modern or Classic ExtJS frameworks.
    *
    * This method exists as a simple compliment to getClassic. Either will work.
    *
    * @return {Boolean} Whether the application is running using the Classic framework or not.
    */
    getModern: function () {
        return Ext.toolkit === "modern";
    },

    /**
     * Generic way to tell the window height rather than having to call the above functions before determining
     * which method to call.
     *
     * * @return {Number} The current height of the window
     */
    getWindowHeight: function () {
        var ret;
        if (this.getClassic()) {
            ret = Ext.getBody().getHeight();
        } else {
            ret = Ext.Viewport.getWindowHeight();
        }
        return ret;
    },

    /**
     * Generic way to tell the window width rather than having to call the above functions before determining
     * which method to call.
     *
     * @return {Number} The current width of the window
     */
    getWindowWidth: function () {
        var ret;
        if (this.getClassic()) {
            ret = Ext.getBody().getWidth();
        } else {
            ret = Ext.Viewport.getWindowWidth();
        }
        return ret;
    },
    /**
    * Check if the device is sitting in portrait orientation (modern only)
    *
    * @return {Boolean} Whether the device orientation is portrait (null for classic)
    */
    getPortrait: function () {
        var ret = null;
        if (this.getModern()) {
            ret = Ext.Viewport.determineOrientation() === "portrait";
        }
        return ret;
    },
    /**
    * Check if the device is sitting in landscape orientation (modern only)
    *
    * @return {Boolean} Whether the device orientation is landscape (null for classic)
    */
    getLandscape: function () {
        var ret = null;
        if (this.getModern()) {
            ret = Ext.Viewport.determineOrientation() === "landscape";
        }
        return ret;
    },

    /**
    * Function to detect and remove HTML tags and possible malicious injections in strings
    * that will be put directly into HTML in the DOM.
    *
    * @param {String} value The string to make safe.
    * @return {String} The string with any HTML tags removed.
    */
    inspectString: function (value) {
        var allowed = (((allowed || '') + '')
            .toLowerCase()
            .match(/<[a-z][a-z0-9]*>/g) || [])
            .join('');
        var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
            commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
        return value.replace(commentsAndPhpTags, '')
            .replace(tags, function ($0, $1) {
                return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
            }).replace('/>', '').trim();
    },

    //
    /**
    * Function for Modern to determine if either window dimention is under 700px (small screen)
    *
    * * @return {Boolean} Whether the current window is classed as small
    */
    getSmallScreen: function () {
        var width = this.getWindowWidth();
        var height = this.getWindowHeight();
        var ret = false;
        if (width < 700 || height < 700) {
            ret = true;
        }
        return ret;
    },
    //
    /**
    * Retrieves a specific toolbar button.
    *
    * @param {String} uniqueId The unique id of the button to be returned.
    * @return {Object} The button requested.
    */
    getToolBarButton: function (uniqueId) {
        var app = Ext.getApplication();
        var mainView = app.getMainView();
        var toolBar = mainView.down('toolbartop');
        var ret = null;
        if (toolBar) {
            ret = toolBar.getController().getButton(uniqueId);
        }
        return ret;
    },

    /**
     * Retrieves a specific menu item.
     *  
     * IMPORTANT: If the menu if configured for lazyFill:true using config.settings.mainMenuLazyFill then this method can return either a tree node (xt.data.TreeModel)
     * or a wrapper for the unrendered tree data (ABP.data.TreeData). Use the isNode and isData booleans to determine what was 
     * returned.
     *
     * @param {String} appId the appId associated with the menu item
     * @param {String} uniqueId The unique id of the menu item to be returned.
     * @param {Boolean} tree true for legacy navTree menu, false for main nav menu (navSearch)
     * @return {Ext.data.TreeModel/ABP.data.TreeData} If the menu item is found then either a node record is returned (Ext.data.TreeModel) because it is rendered, or an a TreeModel-like object is returned (ABP.data.TreeData) encapsulating the underlying data.
     */
    getMenuItem: function (appId, uniqueId, tree) {
        var mm = this.getMainMenu();
        var ret = null;
        if (mm) {
            ret = mm.getController().findMenuItem(appId, uniqueId, tree);
        }
        return ret;
    },

    /**
     * Returns a serialized string representing the current favorites.
     * 
     *  NOTE: This relies on the code adjusting the nodes 
     *  through setters, so that the underling data is updated.
     * @return {String} the serialized favorites.
     */
    getFavorites: function () {
        var serializedFavorites = ABP.internal.util.MainMenu.jsonSerializeFavorites();
        return serializedFavorites;

        /* Old node-based way.
        // TODO: This can be deleted once lazyFill:true has been proven to be bug free.
        var navStore = Ext.getStore('navSearch');
        var favorites = navStore.getNodeById('container_nav-favorites'); // Even if lazyFill:true for this store, the favorites node will exist.
        if (!favorites) {
            return null;
        }
        var serializedFavorites = favorites.serialize();
        return Ext.JSON.encode(serializedFavorites.children);
        */
    },

    /**
     * Returns the current theme applied to ABP
     * @return {String} theme
     */
    getCurrentTheme: function () {
        var app = Ext.getApplication();
        var mainView = app.getMainView();
        vm = mainView.getViewModel();
        return vm.get('currentTheme');
    },

    /**
     * Determines if an item is a favorite.
     *
     *      Example usage:
     *       // appId is 'kitchensink' and 'uniqueId' is 'fav_theme'.
     *       1.) var result = ABP.util.Common.isFavorite('kitchensink', 'fav_theme');
     *
     *       // uniqueId may not have been set, provide your own function to compare.
     *       // NOTE: All nodes are passed into your function including groups. Also note your appId will be prepended to the uniqueId.
     *       2.) var result2 = ABP.util.Common.isFavorite('kitchensink', function (node) {
     *           // Skip all groups.
     *           if (!node.isLeaf()) {
     *               return false;
     *           }
     *           // Check the properties which make this node unique to your product.
     *           var data = node.getData();
     *           if (data.appId === 'kitchensink' && data.event === 'ChangeView') {
     *               if (Ext.isArray(data.eventArgs)
     *               && data.eventArgs.length === 1
     *               &&  data.eventArgs[0] === 'theme') {
     *                   return true;
     *               }
     *           }
     *        });
     *
     * @param {String} appId appId for your product.
     * @param {String/Function} value If value is a string it is assumed to match a uniqueId. If value is a function all favorite nodes will be passed through that function, return true if a match is found and false if that node does not match your criteria.
     * @returns {Boolean} true if the item is a favorite, false if not.
     */
    isFavorite: function (appId, value) {
        var child;

        // Find the Favorites node first (i.e. the parent of favorited items).
        var navStore = Ext.getStore('navSearch');
        var favorites = navStore.getNodeById('container_nav-favorites'); // Even if lazyFill:true for this store, the favorites node will exist

        if (favorites) {
            // TODO: Once the new lazyFill:true code has been bedded in and known to be bug free, remove the else here, and remove the test for lazyFill. If "then" branch should be able to handle both cases.
            if (navStore.lazyFill) {
                // Found the parent. Go down looking for a child that matches the criteria.
                var mm = this.getMainMenu();
                if (typeof value === 'function') {
                    child = mm.getController().findTreeStoreItemInChildren(favorites, null, null, value);
                } else if (Ext.isString(value)) {
                    child = mm.getController().findTreeStoreItemInChildren(favorites, 'uniqueId', 'fav_' + value);
                }
            } else {
                // All nodes will be present for all the data.
                // Compare function, pass in nodes until true. Uses the Ext NodeInterface nethods because we know the store is not lazyFill:true.
                if (typeof value === 'function') {
                    child = favorites.findChildBy(value, null, true);
                }
                else if (Ext.isString(value)) {
                    child = favorites.findChild('uniqueId', 'fav_' + value, true)
                }
            }
        }

        return Ext.isEmpty(child) ? false : true;
    },

    /**
     * Returns a serialized string representing the current recents.
     * @return {String} the serialized recents.
     */
    getRecents: function () {
        var mainmenu = this.getMainMenu();
        var ret = [];
        if (mainmenu) {
            var vm = mainmenu.getViewModel();
            var recentPages = vm.get('recentPages');
            if (recentPages && !Ext.isEmpty(recentPages)) {
                var toEncode = [];
                for (var i = 0; i < recentPages.length; ++i) {
                    if (recentPages[i].serialData) {
                        toEncode.push(recentPages[i].serialData);
                    }
                }
                if (!Ext.isEmpty(toEncode)) {
                    ret = Ext.JSON.encode(toEncode);
                }
            }
        }
        return ret;
    },

    /**
     * Function to generate an automation class for an ExtJS component.
     *
     * @param {Object} extObj The Ext component to get an automation class for.
     * @return {String} The automation class string.
     */
    getAutomationClass: function (extObj) {
        var automationXtype;
        var automationName;
        var initialConfigAutoCls;
        var initialConfigLabelKey;
        var initialConfigLabel;

        if (extObj.initialConfig) {
            if (extObj.initialConfig.node) {
                if (extObj.initialConfig.node.data) {
                    initialConfigAutoCls = extObj.initialConfig.node.data.automationCls;
                    initialConfigLabelKey = extObj.initialConfig.node.data.labelKey;
                    initialConfigLabel = extObj.initialConfig.node.data.label;
                }
            }
        }

        if (this.hasAutomationClass(extObj)) {
            return "";
        }

        if (extObj.automationCls) {
            return this.getAutomationAnchorName(extObj.automationCls);
        } else if (initialConfigAutoCls) {
            return this.getAutomationAnchorName(initialConfigAutoCls);
        } else {

            if (Ext.isString(extObj.xtype)) {
                automationXtype = extObj.xtype;
            } else if (Ext.isString(extObj.defaultType)) {
                automationXtype = extObj.defaultType;
            } else {
                automationXtype = 'unknown-xtype';
            }

            if (Ext.isString(extObj.name)) {
                automationName = extObj.name;
            } else if (Ext.isString(initialConfigLabelKey)) {
                automationName = initialConfigLabelKey;
            } else if (Ext.isString(initialConfigLabel)) {
                automationName = initialConfigLabel;
            } else if (Ext.isString(extObj.itemId)) {
                automationName = extObj.itemId;
            } else {
                automationName = 'custom-unsafe';
            }

            return this.getAutomationAnchorName(automationXtype + '-' + automationName);
        }
    },

    /**
     * Function to normalize a string for CSS class name.
     *
     * A common prefix is added ('a-') and invalid characters are removed.
     *
     * @param {String} uniqueName A UID string for the CSS class.
     * @return {String} The automation class string.
     */
    getAutomationAnchorName: function (uniqueName) {
        return 'a-' + uniqueName.replace(this.__cssClassNameInvalidChars, '-');
    },

    /**
     * Check to see whether the source string contains JSON.
     * @param {String} string potential JSON string.
     * @return {Boolean} whether or not the provided string is a JSON string.
     */
    isJsonString: function (string) {
        try {
            JSON.parse(string);
        } catch (e) {
            return false;
        }
        return true;
    },

    /**
     * Attempt to set the keyboard focus to a specific element.
     */
    setKeyboardFocus: function (selector) {
        var cmps = Ext.query(selector, false)
        if (cmps && cmps.length > 0) {
            // Need to get the actual component, as there's a slight bug i sencha query.
            var extCmp = Ext.getCmp(cmps[0].id);
            Ext.getCmp(extCmp.id).focus(50);
        }
    },

    /**
    * Opens the given URL in a new browser tab. Prompts the user with a warning if the action is blocked by the browser.
    *
    * Set the useCurrentUser parameter to true to log back in as the same user, if the URL is the ABP app.
    *
    * To prevent user information persisting too long in local storage, a timeout of 60 seconds is applied to the request
    * (ABP.util.Constants.login.loginAsUserLifetime).
    *
    * @param {String} url The URL to open the new browser window to. Include the protocol, e.g. http://aptean.com
    * @param {String} [urlTarget] Optional. Browser target. For example, "_blank", "_top", etc. Leaving null results in "_blank".
    * @param {String} [urlDisplayText] Optional. If the URL has to be shown to the user (for example in a message) then if this text is supplied then it is shown instead of the URL.
    * @param {Boolean} [useCurrentUser] Set to true if you want to attempt to login as the current user in the new tab.
    * NOTE: The current session must have either a refresh token available or the user's password saved (rememberPassword configuration - not recommended).
    * Otherwise their access has not been persisted.
    */
    openBrowserTab: function (url, urlTarget, urlDisplayText, useCurrentUser) {
        // The new tab knows to try to login as the current user by using a well-known
        // variable in local storage. This contains a JSON encoded string with
        var env = ABP.util.Config.getEnvironment();
        var user = ABP.util.Config.getUsername();
        var sessionToken = ABP.util.Config.getOAuthInfo();
        var lang = ABP.util.Config.getLanguage();
        // Password is sometimes saved. If it is in the currently logged in user's local storage then use that.
        // Otherwise it might be in the global local storage, but only if the global local storage is holding
        // it for the current user and environment.
        var pass = ABP.util.LocalStorage.getForLoggedInUser('SavedPassword');
        if (!pass) {
            if (ABP.util.LocalStorage.get('SavedUsername') == user && ABP.util.LocalStorage.get('SavedEnvironment') == env) {
                pass = ABP.util.LocalStorage.get('SavedPassword')
            }
        }
        var loginAsUserObj = this.getLoginAsUserObj(env, user, sessionToken, lang, pass, !useCurrentUser);
        ABP.util.LocalStorage.set('LoginAsUser', ABP.util.Common.jsonEncode(loginAsUserObj));
        // Timeout and delete the LoginAsUser request if it is not already deleted by the receiving tab.
        // This removes from local storage user information that might hang around due to a failure
        // in the new tab.
        // But first delete any old defer. There is no point have more than one defer pending.
        if (ABP.util.Common.__lastLoginAsUserDeferId) {
            Ext.undefer(ABP.util.Common.__lastLoginAsUserDeferId);
            ABP.util.Common.__lastLoginAsUserDeferId = null;
        }
        ABP.util.Common.__lastLoginAsUserDeferId = Ext.defer(
            function (loginAsUserObj) {
                try {
                    // Check if what is in local storage is the same request as the one we deferred.
                    // If not then we assume a later request has superceded this, possibly from another tab.
                    var localLoginAsUserObj = ABP.util.Common.jsonDecode(ABP.util.LocalStorage.get('LoginAsUser'));
                    if (loginAsUserObj.created == localLoginAsUserObj.created) {
                        // Time to delete.
                        ABP.util.LocalStorage.remove('LoginAsUser');
                    }
                } catch (ex) { }
            },
            ABP.util.Constants.login.loginAsUserLifetime * 1000,
            this,
            [loginAsUserObj] // User info passed into deferred function for checking.
        );
        // Try opening new browser tab.
        urlTarget = urlTarget || '_blank';
        var result = window.open(url, urlTarget);

        // If 'result' is empty, then the browser window was not opened; probably due to the browser's pop-up blocker.
        // Display a message with a hyperlink to manually open the URL instead.
        // NOTE: A Sencha design problem causes certain click handlers to not be detected as user-initiated; thus causing the browser to block certain actions.
        //       https://www.sencha.com/forum/showthread.php?289206
        if (Ext.isEmpty(result)) {
            ABP.view.base.popUp.PopUp.showHyperlink('help_blocked_Text', url, urlTarget, urlDisplayText, 'help_blocked_Title', null, null, null);
        }
    },

    /**
     * Returns the supplied JSON string as a JavaScript object.
     * If the string fails to parse as a JSON string then null is returned.
     * @param {String} jsonString The JSON string to convert to a JavaScript object.
     * @returns {Object} The JavaScript object.
     */
    jsonDecode: function (jsonString) {
        var jsonStringObj = null;
        try {
            jsonStringObj = Ext.JSON.decode(jsonString);
        } catch (ex) {
            ABP.util.Logger.logError('Cannot JSON.decode this:' + jsonString + '. Exception:' + ex);
        }
        return jsonStringObj;
    },

    /**
     * Returns the supplied JavaScript object as a JSON srtring.
     * If the object fails to parse to a JSON string then null is returned.
     * @param {Object} object The URL to open the new browser window to. Include the protocol, e.g. http://aptean.com
     * @returns {Object} The JSON string.
     */
    jsonEncode: function (object) {
        var jsonString = null;
        try {
            jsonString = Ext.JSON.encode(object);
        } catch (ex) {
            ABP.util.Logger.logError('Cannot JSON.encode this:' + object + '. Exception:' + ex);
        }
        return jsonString;
    },

    /**
     * @private
     * Sets a value on the main view's viewmodel.
     * The intended use for this function would be modern views which exist outside the normal view inheritance (popups) which otherwise have not access to the main viewmodel.
     * This function uses a list of white listed properties, only these may be set using this function.
     * @param {String} name ViewModel property name
     * @param {String} value ViewModel property value
     */
    setViewModelProperty: function (name, value) {
        var app = Ext.getApplication(),
            mainView = app.getMainView(),
            vm = mainView.getViewModel(),
            // List of properties which are allowed to be set through this method.
            whiteListedProperties = ['switchToOnline'];

        if (whiteListedProperties.indexOf(name) === -1) {
            return;
        }

        if (vm) {
            vm.set(name, value);
        }
    },

    /**
     * Retrieves a specific viewmodel property.
     */
    getViewModelProperty: function (name) {
        var app = Ext.getApplication(),
            mainView = app.getMainView(),
            vm = mainView.getViewModel();

        return vm.get(name);
    },

    /**
     * Attempts to determine if an automation class is present on the given Ext object.
     * @param {Object} extObj the Ext object.
     * @returns {Boolean} whether or not an automation class was found.
     */
    hasAutomationClass: function (extObj) {
        var hasAutoCls;
        var cls = extObj.getCls ? extObj.getCls() : extObj.cls
        if (!cls && typeof extObj.getNode === 'function') {
            var node = extObj.getNode();
            if (node && node.data) {
                extObj = node.data;
                cls = extObj.cls;
            }
        }
        if (!cls && extObj.componentCls) {
            cls = extObj.componentCls;
        }

        hasAutoCls = this.testForAutomationClass(cls);
        // If both cls and componentCls were present and cls did not contain the automation class try one more time with the componentCls.
        if (hasAutoCls === false && (cls && extObj.componentCls)) {
            // In this case often times cls and componentCls are the same, we already tested cls so skip this case.
            if (cls !== extObj.componentCls) {
                hasAutoCls = this.testForAutomationClass(extObj.componentCls);
            }
        }
        return hasAutoCls;
    },

    /**
     * Test the given cls for the presence of an automation class "a-"
     * @param {String} cls the class.
     * @returns {Boolean} whether or not an automation class was present.
     */
    testForAutomationClass: function (cls) {
        var autoClasses;
        var hasAutoCls;
        if (Ext.isArray(cls)) {
            cls.forEach(function (val, index, array) {
                if (!hasAutoCls) {
                    // Previously ABP.util.Constants.AUTOMATION_CLASS_REGEX - the global flag can cause this to alternate between true and false.
                    hasAutoCls = /\b(a-[a-zA-Z0-9-]+)\b/m.test(val);
                }
            });
            return hasAutoCls;
        } else if (Ext.isString(cls)) {
            autoClasses = cls.match(ABP.util.Constants.AUTOMATION_CLASS_REGEX);
            if (autoClasses === null) { return false; }
            else { return autoClasses.length > 0; }
        }
    },

    /**
     * @private
     * Creates the packet of data defining who the next tab showing the ABP app should login as.
     * A timestamp is added, so stale information can be ignored and removed.
     * @param {String} env
     * @param {String} user
     * @param {String} sessionToken
     * @param {String} lang
     * @param {String} pass
     * @param {Boolean} clearSession
     */
    getLoginAsUserObj: function (env, user, sessionToken, lang, pass, clearSession) {
        var loginAsUserObj = {
            environment: env,
            logonId: user,
            sessionToken: sessionToken,
            locale: lang,
            password: pass,
            created: Date.now(), // Used to detect a stale logon request.
            clearSession: clearSession
        };
        return loginAsUserObj;
    },

    /**
     * Immediately flush all bindings between a view and its view model.
     *
     * For example. Bound values in controls are flushed synchronously to the view model.
     *
     * Example 1, in a component event listener:
     *
     *     {
     *          xtype: 'textfield',
     *          bind: {
     *              value: '{username}'
     *          },
     *          listeners: {
     *              specialkey: function (f, e) {
     *                  if (e.getKey() === e.ENTER) {
     *                      ABP.util.Common.flushAllBindings(f,'login');// Immediately flush all control values to the view model.
     *                      f.fireEvent('login_UserHit');
     *                  }
     *              },
     *              scope: this
     *          }
     *     }
     *
     * Example 2, in a view controller:
     *
     *     this.getView();
     *     ABP.util.Common.flushAllBindings(view);// Immediately flush all control values to the view model.
     *
     *
     * @param {Object} component Either the view or a child component. If the latter then
     * provide the parentViewXtype so that the parent view can be found.
     *
     * @param {String} parentViewXtype If the component parameter is not the view but a child component
     * then provide the xtype of the parent view. Otherwise not needed.
     */
    flushAllBindings: function (component, parentViewXtype) {
        var view, vm;
        if (parentViewXtype) {
            view = component.up('[xtype=' + parentViewXtype + ']');
        } else {
            view = component;
        }
        if (view) {
            var vm = view.getViewModel();
            if (vm) {
                vm.notify(); // Flushes.
            }
        }
    },

    /** @private */
    measureCache: {},
    /** @private */
    measureDiv: null,

    /**
     * @private
     * Measure the size of a text with specific font by using DOM to measure it.
     * Could be very expensive therefore should be used lazily.
     * @param {String} text
     * @param {String} font
     * @return {Object} An object with `width` and `height` properties.
     * @return {Number} return.width
     * @return {Number} return.height
     */
    actualMeasureText: function (text, font) {
        var me = this,
            measureDiv = me.measureDiv,
            FARAWAY = 100000,
            size;

        if (!measureDiv) {
            var parent = Ext.Element.create({
                //<debug>
                // Tell the spec runner to ignore this element when checking if the dom is clean.
                'data-sticky': true,
                //</debug>
                style: {
                    "overflow": "hidden",
                    "position": "relative",
                    "float": "left", // DO NOT REMOVE THE QUOTE OR IT WILL BREAK COMPRESSOR
                    "width": 0,
                    "height": 0
                }
            });
            me.measureDiv = measureDiv = Ext.Element.create({
                style: {
                    "position": 'absolute',
                    "x": FARAWAY,
                    "y": FARAWAY,
                    "z-index": -FARAWAY,
                    "white-space": "nowrap",
                    "display": 'block',
                    "padding": 0,
                    "margin": 0
                }
            });
            Ext.getBody().appendChild(parent);
            parent.appendChild(measureDiv);
        }
        if (font) {
            measureDiv.setStyle({
                font: font,
                lineHeight: 'normal'
            });
        }
        measureDiv.setText('(' + text + ')');
        size = measureDiv.getSize();
        measureDiv.setText('()');
        size.width -= measureDiv.getSize().width;
        return size;
    },
    /**
     * Measure a single-line text with specific font.
     * This will split the text into characters and add up their size.
     * That may *not* be the exact size of the text as it is displayed.
     * @param {String} text
     * @param {String} font
     * @return {Object} An object with `width` and `height` properties.
     * @return {Number} return.width
     * @return {Number} return.height
     */
    measureTextSingleLine: function (text, font) {
        text = text.toString();
        var me = this,
            cache = me.measureCache,
            chars = text.split(''),
            width = 0,
            height = 0,
            cachedItem, charactor, i, ln, size;

        if (!cache[font]) {
            cache[font] = {};
        }
        cache = cache[font];

        if (cache[text]) {
            return cache[text];
        }

        for (i = 0, ln = chars.length; i < ln; i++) {
            charactor = chars[i];
            if (!(cachedItem = cache[charactor])) {
                size = me.actualMeasureText(charactor, font);
                cachedItem = cache[charactor] = size;
            }
            width += cachedItem.width;
            height = Math.max(height, cachedItem.height);
        }
        return cache[text] = {
            width: width,
            height: height
        };
    },
    /**
     * copyright data for About page.  Only used by pluginmanager
     */
    getABPAboutData: function () {
        return {
            icon: 'aptean2018',
            name: 'Aptean Business Platform',
            version: '3.1.0.0',
            copyright: 'Aptean &copy; ' + new Date().getFullYear(),
            detail: 'Copyright (C) 2004-' + new Date().getFullYear() + ' Aptean. All rights reserved.<p>' +
                'Aptean, all other product names, service names, slogans, and related logos are registered trademarks or trademarks of Aptean, Inc in the United States and other countries.  All other company, product or service names referenced herein are used for identification purposes only and may be trademarks of their respective owners.<p>' +
                'This program is protected by copyright law and international treaties. Unauthorized reproduction and distribution is strictly prohibited.'
        };
    },
    /**
     * Takes a string reference to a singleton function and returns said function
     * @param {String} functionString The string Formatted as "Namespace.File/Object.Function" ie "MyApp.Initialize.CustomFunction"
     * @return {Function} The singleton function the param string was pointing to or null if function is not found.
     */
    getSingletonFunctionFromString: function (functionString) {
        var ret;
        var namespaces = functionString.split('.');
        var func = namespaces.pop();
        ret = window;
        for (var i = 0; i < namespaces.length; ++i) {
            ret = ret[namespaces[i]];
            if (ret === undefined) {
                return null;
            }
        }
        return ret[func];
    },
    /**
     * This function will be called and sent with the ABP bootstrap call as 'locale',
     * but can be called at any time to get the user's browser display language.
     * @return {String} the browser's display/ UI language
     */
    getBrowserLanguage: function () {
        var lang = window.navigator.language.toLowerCase();

        // Default the page language to the browser language
        this.setPageLanguage(lang, true);

        return lang;
    },

    /**
     * Set the language on the HTML element in the DOM, use ifBlank to check that a value does not already exist.
     * 
     * required to be set for WCAG
     * @param {String} lang The language to set the HTML document to i.e. en-US
     * @param {Boolean} ifBlank Whether to update only if the current value is blank
     */
    setPageLanguage: function (lang, ifBlank) {
        if (!lang) {
            // If the lang value does not exist, do not set the page local as this would 
            // conflict with the WCAG standards
            return;
        }

        if (ifBlank) {
            var current = document.documentElement.getAttribute('lang');
            if (current) {
                return;
            }
        }

        document.documentElement.setAttribute('lang', lang);
    },

    /**
     * This function can be called to determine if a javascript object is simply a prototype without any additional properties
     * @param {Object} obj javascript object to test if it is just a prototype with no additional properties
     */
    isEmptyObject: function (obj) {
        if (obj == null) return true;
        if (obj.length > 0) return false;
        if (obj.length === 0) return true;
        if (typeof obj !== "object") return true;
        for (var key in obj) {
            if (hasOwnProperty.call(obj, key)) return false;
        }
        return true;
    },

    /**
     * Safely get an object's property, including nested objects and properties.
     * 
     * Example:
     * 
     *     var o = { 
     *         a: {
     *             aa: 'hello'
     *         },
     *         b: 'world'
     *     };
     *     ABPCore.util.Common.getObjectProperty(o, 'a.aa'); // returns 'hello'.
     *     ABPCore.util.Common.getObjectProperty(o, 'b'); // returns 'world'.
     *     ABPCore.util.Common.getObjectProperty(o, 'a.aa.aaa'); // returns undefined.
     *     ABPCore.util.Common.getObjectProperty(o, 'a.b'); // returns undefined.
     *     ABPCore.util.Common.getObjectProperty(o, 'c'); // returns undefined.
     *     ABPCore.util.Common.getObjectProperty(null, 'a.b'); // returns undefined.
     * 
     * @param {Object} obj The object in which to find the property or object at the bottom of the propString hierarchy.
     * @param {String} propString Dot notated hierarchy of property and object names. Examples: 'forms.global.jsonFormat', 'myProp'
     */
    getObjectProperty: function (obj, propString) {
        if (!Ext.isString(propString) || !Ext.isObject(obj)) {
            return;
        }

        var props = propString.split('.'),
            propsLen = props.length,
            i = -1;

        while (++i < propsLen) {
            var nextObj = Ext.isObject(obj) ? obj[props[i]] : undefined;
            if (nextObj !== undefined) {
                obj = nextObj;
            } else {
                return; // Not found.
            }
        }
        if (i === propsLen) {
            // Found object or property at the very end of the propString hierarchy.
            return obj;
        }
        // Otherwise not found.
        return;
    },


    /**
     * Removes any duplicates records from a store, value checks are case insensitive.
     * @param {Ext.data.Store} store The store from which to remove duplicates.
     * @param {String} field The field which will be used to test for duplicate values. Field type must be a string.
     */
    removeCaseInsensitiveDuplicates: function (store, column) {
        var me = this;
        if (!store || !column) {
            return store;
        }
        var storeLen = store.getCount();
        for (var i = storeLen - 1; i > 0; i--) {
            var value = store.getAt(i).getData()[column];
            var duplicateIndex = me.containsCaseInsensitive(store, column, value);
            if (duplicateIndex !== i && duplicateIndex > -1) {
                store.removeAt(i);
            }
        }
    },

    getKeyboardNavigation: function () {
        return this.__keyNavigation;
    },

    getMouseNavigation: function () {
        return !this.__keyNavigation;
    },

    setKeyboardNavigation: function (bKeyInput) {
        this.__keyNavigation = bKeyInput;
    },

    /**
     * Gets a UUID's according to RFC 4122, also known as a GUID.
     * 
     * This generates a type 4 UUID, a pseudo-random UUID. It is not a tyoe 1 time-based, "sequential" UUID.
     */
    getUuid: function () {
        if (!this.__uuidGenerator) {
            this.__uuidGenerator = Ext.create('Ext.data.identifier.Uuid', {})
        }
        return this.__uuidGenerator.generate();
    },

    /**
     * Determine  if the app is running inside Chrome on iOS.
     * @returns {Boolean} true if the app is running inside Chrome on iOS.
     */
    isIOSChrome: function () {
        return !Ext.isEmpty(Ext.browser.userAgent.match('CriOS'));
    },

    privates: {
        /**
         * @private
         * Returns the 'mainmenu' view.
         * @returns {Object} Returns the 'mainmenu' view.
         */
        getMainMenu: function () {
            var app = Ext.getApplication();
            var mainView = app.getMainView();
            var mm = mainView.down('mainmenu');
            return mm;
        },

        /**        
         * Convenience function for containsCaseInsensitive. Actually tests for case-insensitive matches per record.
         * @private
         */
        compareCaseInsensitive: function (column, value) {
            var expression = new RegExp('^' + value + '$', 'i');
            return function (rec) {
                return expression.test(rec.get(column));
            }
        },

        /**
         * Searches the store for a case-insensitive match for 'value' against the given column.
         * @private
         */
        containsCaseInsensitive: function (store, column, value) {
            return store.findBy(this.compareCaseInsensitive(column, value));
        }
    }

});