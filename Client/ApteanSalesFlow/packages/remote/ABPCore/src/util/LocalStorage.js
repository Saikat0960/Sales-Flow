/**
 * This class provides a common API to local storage in the browser.
 *
 * There are two types of data stored in local storage: global and user specific.
 * User specific is data that is related to a specific login user and environment.
 * Global is data that is related to all product users and environments who are using this ABP app in this browser.
 *
 * Access global data using ABP.util.LocalStorage.get/set/remove.
 *
 * Access logged-in user specific data using ABP.util.LocalStorage.getForLoggedInUser/setForLoggedInUser/removeForLoggedInUser.
 * A user must be logged in.
 *
 * Access user specific data using ABP.util.LocalStorage.getForUser/setForUser/removeForUser.
 *
 * Note: Global data is still local to the browser. It is available pre-login and to whoever logs into the ABP app.
 *
 * The naming convention for keys is UpperCamelCase.
 *
 *      ABP.util.LocalStorage.set('LastUserId', me);
 *      ABP.util.LocalStorage.get('LastUserId');
 *
 *      ABP.util.LocalStorage.setForLoggedInUser('Preference', choice);
 *      ABP.util.LocalStorage.getForLoggedInUser('Preference');
 *
 *      ABP.util.LocalStorage.setForUser('Env1000', 'ssmith', Preference', choice);
 *      ABP.util.LocalStorage.getForUser('Env1000', 'ssmith', 'Preference');
 *      ABP.util.LocalStorage.removeAllForUser('Env1000', 'ssmith');
 *
 */
Ext.define('ABP.util.LocalStorage', {
    singleton: true,

    prefix: 'ABP_',
    userToken: '_Env-\\[(.*)]_User-\\[(.*?)]__', // IMPORTANT: If you change this then change the function getUserToken() to accomodate the new regex pattern. This is the environment id (not the name) and the returned loginId. Written as a regex so that matching is easy. Note: non-greedy at end.
    userToken3: '_Env-(.*)_User-(.*?)__', // The user token used in version 3 of local storage. Used for upgrading the local storage key format.
    usernameKey: 'Username', // The casefull version of the username - whatever the user typed in.

    storageVersion: '4', // The first ABP browser storage schema did not have a version number.
    storageVersionKey: 'LocalStorageVersion', // For  global stored items.
    storageVersionUserKey: 'LocalStorageUserVersion', // For items stored per environment and user.

    constructor: function () {
        // Because this is called during singleton construction, you cannot
        // rely on anything else to exist unless you put requires instructions into this class.
        this.upgradeStorage();
    },

    /**
     * Returns the value associated with the given 'key'.
     * **NOTE:** This method conforms to the standard HTML5 Storage interface.
     * @param {String} key The key.
     * @return {String} The value associated with the given 'key'.
     */
    get: function (key) {
        if (this.localStorageAvailable()) {
            var value = localStorage.getItem(this.prefix + key);
            return value;
        }
        return "";
    },

    /**
     * Sets the value associated with the given 'key'.
     * **NOTE:** This method conforms to the standard HTML5 Storage interface.
     * @param {String} key The key.
     * @param {String} value The new associated value for 'key'.
     */
    set: function (key, value) {
        if (this.localStorageAvailable()) {
            localStorage.setItem(this.prefix + key, value);
        }
    },

    /**
     * Removes the value associated with the given 'key'.
     * **NOTE:** This method conforms to the standard HTML5 Storage interface.
     * @param {String} key The key.
     */
    remove: function (key) {
        if (this.localStorageAvailable()) {
            localStorage.removeItem(this.prefix + key);
        }
    },

    /**
     * Tests if the given key is in local storage.
     * @param {String} key The key.
     * @returns {Boolean} true is the given key is present, else false.
     */
    contains: function (key) {
        if (this.localStorageAvailable()) {
            return (localStorage.getItem(this.prefix + key) === null ? false : true);
        }
        return false;
    },

    /**
     * Returns the value associated with the given 'key', for the currently logged in user.
     * @param {String} key The key.
     * @return {String} The value associated with the given 'key'.
     */
    getForLoggedInUser: function (key) {
        if (this.localStorageAvailable()) {
            // This key must be stored for the current user and environment.
            var value = localStorage.getItem(this.getLoggedInUserStoragePrefix() + key);
            return value;
        }
        return '';
    },

    /**
     * Sets the value associated with the given 'key', for the currently logged in user.
     * @param {String} key The key.
     * @param {String} value The new associated value for 'key'.
     */
    setForLoggedInUser: function (key, value) {
        if (this.localStorageAvailable()) {
            // This key must be stored for the current user and environment.
            localStorage.setItem(this.getLoggedInUserStoragePrefix() + key, value);
        }
    },

    /**
     * Removes the value associated with the given 'key', for the currently logged in user.
     * @param {String} key The key.
     */
    removeForLoggedInUser: function (key) {
        if (this.localStorageAvailable()) {
            // This key must be stored for the current user and environment.
            localStorage.removeItem(this.getLoggedInUserStoragePrefix() + key);
        }
    },

    /**
     * Tests if the given key is in local storage, for the currently logged in user.
     * @param {String} key The key.
     * @returns {Boolean} true is the given key is present for the currently logged in user, else false.
     */
    containsForLoggedInUser: function (key) {
        if (this.localStorageAvailable()) {
            return (localStorage.getItem(this.getLoggedInUserStoragePrefix() + key) === null ? false : true);
        }
        return false;
    },

    /**
     * Returns the value associated with the given 'key', for the specified user and environment.
     * @param {String} env The enviroment id.
     * @param {String} user The user id. Case insensitive.
     * @param {String} key The key.
     * @return {String} The value associated with the given 'key'.
     */
    getForUser: function (env, user, key) {
        if (this.localStorageAvailable()) {
            // This key must be stored for the user and environment.
            var value = localStorage.getItem(this.getUserStoragePrefix(env, user) + key);
            return value;
        }
        return '';
    },

    /**
     * Sets the value associated with the given 'key', for the specified user and environment.
     * @param {String} env The enviroment id.
     * @param {String} user The user id. Case insensitive.
     * @param {String} key The key.
     * @param {String} value The new associated value for 'key'.
     */
    setForUser: function (env, user, key, value) {
        if (this.localStorageAvailable()) {
            // This key must be stored for the user and environment.
            localStorage.setItem(this.getUserStoragePrefix(env, user) + key, value);
        }
    },

    /**
     * Removes the value associated with the given 'key', for the specified user and environment.
     * @param {String} env The enviroment id.
     * @param {String} user The user id. Case insensitive.
     * @param {String} key The key.
     */
    removeForUser: function (env, user, key) {
        if (this.localStorageAvailable()) {
            // This key must be stored for the user and environment.
            localStorage.removeItem(this.getUserStoragePrefix(env, user) + key);
        }
    },

    /**
     * Removes all the local storage data that is for the specied user and environment.
     * @param {String} env The enviroment id.
     * @param {String} user The user id.
     */
    removeAllForUser: function (env, user) {
        if (this.localStorageAvailable()) {
            // Loop through all local storage looking for keys that start with the user's prefix.
            var userPrefix = this.getUserStoragePrefix(env, user);
            for (var i = 0; i < localStorage.length; i++) {
                var key = localStorage.key(i);
                if (key && Ext.String.startsWith(key, userPrefix)) {
                    localStorage.removeItem(key);
                    i--; // Ensure we don't miss the next key, or go out of bounds.
                }
            }
        }
    },

    /**
     * Tests if the given key is in local storage, for the specified user and environment.
     * @param {String} env The enviroment id.
     * @param {String} user The user id. Case insensitive.
     * @param {String} key The key.
     * @returns {Boolean} true is the given key is present for the specified user and environment, else false.
     */
    containsForUser: function (env, user, key) {
        if (this.localStorageAvailable()) {
            // This key must be stored for the user and environment.
            return (localStorage.getItem(this.getUserStoragePrefix(env, user) + key) === null ? false : true);
        }
        return false;
    },

    /**
     * Returns all the users in local storage, and their data.
     * @param (Boolean) [includeUsersFromUnknownEnvironments] If true then also return users that have environments not in the bootstrap.
     * That is, all user in local storage.
     *
     * __Note:__ These other users are likely to be from other systems not handled by the run time configuration.
     *
     * @return {Object[]} An array of user data objects (simple JavaScript objects). If no users then null.
     * The structure is:
     *
     *     [
     *          {
     *              env: "env001",
     *              user: "jsmith",
     *              username: "JSmith" // Whatever the user actually typed for their username.
     *              data: {
     *                  a-key: "the value",
     *                  another-key: "another value"
     *              }
     *          }
     *     ]
     */
    getUserData: function (includeUsersFromUnknownEnvironments) {
        var users;
        if (this.localStorageAvailable()) {

            // Environment name added + can be used for filtering by known environments.
            var envStore = Ext.data.StoreManager.lookup("ABPEnvironmentStore");

            // Loop through every local storage entry finding entries for ABP users.
            var re = new RegExp('^' + this.prefix + this.userToken); // matches a local storage key for an ABP user.
            for (var i = 0; i < localStorage.length; i++) {

                // Ignore unless it is an ABP local user item.
                var key = localStorage.key(i);
                var matchResult = key.match(re);
                if (matchResult) {

                    // Gather the user data.
                    var env = matchResult[1];
                    var user = matchResult[2];
                    if (user) {
                        user = user.toLowerCase();
                    }
                    var itemKey = matchResult.input.replace(matchResult[0], '');
                    var itemValue = localStorage.getItem(localStorage.key(i));

                    // Find or create this user.
                    if (!users) {
                        users = [];
                    }
                    var found = false;
                    for (var j = 0; j < users.length; j++) {
                        if (users[j].env === env && users[j].user === user) {
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        // Need to create user.
                        // But first check if we need to filter by known environments.
                        if (envStore) {
                            // Get env name, to add to returned data.
                            var envRec = envStore.getById(env);
                            if (!envRec && !includeUsersFromUnknownEnvironments) {
                                // No environment match, so do not include this user.
                                continue;
                            }
                        } else {
                            // No environment store. Assume therefore we do not want user unless we want users for unknown environment.
                            if (!includeUsersFromUnknownEnvironments) {
                                // No environment match, so do not include this user.
                                continue;
                            }
                        }

                        // Create the user.
                        users.push({ env: env, user: user, username: user, data: {} }); // username starts off as the user key (i.e all lowercase) and gets updated if the Username key is present.
                    }
                    // Add the data to the user.
                    if (itemKey == this.usernameKey) {
                        // Username gets put into the top-level, ABP properties.
                        users[j].username = itemValue;
                    } else {
                        // Everything else goes under data.
                        users[j].data[itemKey] = itemValue;
                    }
                }
            }

            return users;
        }
        return users;
    },

    /**
     * @private
     * Upgrade local storage for users if necessary.
     * Must be called once a user is logged in and their loginId and the environment id are known.
     * This method only exists to handle the case where data must move between global storage and the user who first logs in.
     * Otherwise the upgrade work should happen in the private method upgradeStorage during class construction time.
     */
    upgradeUserStorage: function () {
        try {
            if (this.localStorageAvailable()) {
                var currentUserStorageVersion = this.get(this.storageVersionUserKey);
                if (!currentUserStorageVersion || currentUserStorageVersion != this.storageVersion) {
                    // Upgrade.
                    if (!currentUserStorageVersion) {
                        // Upgrading from prior to ABP3.
                        // This assumes the first login should get what were global settings.
                        // Then they are removed as global settings.

                        // Move Action Center config from being the same for every user, to being specific to each user.
                        // The first use to login with ABP3 gets what was the global Action Center config.
                        var st = this.get('ABPActionCenter_Layout');
                        if (st !== null) { // null means the key does not exist, so no need to set a user-specific one.
                            this.setForLoggedInUser('ABPActionCenter_Layout', st);
                            this.remove('ABPActionCenter_Layout');
                        }
                    }

                    // Now using latest user storage version.
                    this.set(this.storageVersionUserKey, this.storageVersion);
                }
            }
        } catch (err) {
            // Cannot assume any other part of ABP is present, so just log to console.
            console.log(err);
        };
    },

    /**
     * Return true if local storage is available and writable.
     */
    localStorageWritable: function () {
        try {
            if (this.localStorageAvailable(true)) {
                // Test writable by trying to write!
                localStorage.setItem(this.prefix + 'WriteTest', 'test');
                localStorage.removeItem(this.prefix + 'WriteTest');
                return true;
            }
        } catch (err) {
            console.log(err);
            return false;
        }
        return false;
    },

    privates: {

        /**
         * @private
         * Check whether local storage is available within the browser.
         * @param {Boolean} logError Whether or not to log an error if local storage is not available.
         */
        localStorageAvailable: function (logError) {
            try {
                // This will throw an exception if local storage is disabled.
                return (window.localStorage !== undefined && window.localStorage !== null);
            } catch (err) {
                if (logError) {
                    console.log(err);
                }
                return false;
            }
        },

        /**
         * @private
         * Return the key prefix for a local storage variable specific to the current user and environment.
         *
         * NOTE: The returned string may have spaces in it, and other characters unfriendly for property names.
         * Always use the array notation, e.g.
         *      var myObject = {};
         *      var myKey = 'my key';
         *      myObj[muyKey] = 'hello world';
         *      console.log( myObj[myKey] );
         */
        getLoggedInUserStoragePrefix: function () {
            var env = ABP.util.Config.getEnvironment() || '';
            var user = ABP.util.Config.getUsername() || '';
            return this.prefix + this.getUserToken(env, user);
        },

        /**
         * @private
         * Return the key prefix for a local storage variable specific to the current user and environment.
         *
         * NOTE: The returned string may have spaces in it, and other characters unfriendly for property names.
         * Always use the array notation, e.g.
         *      var myObject = {};
         *      var myKey = 'my key';
         *      myObj[muyKey] = 'hello world';
         *      console.log( myObj[myKey] );
         */
        getUserStoragePrefix: function (env, user) {
            return this.prefix + this.getUserToken(env, user);
        },

        /**
         * @private
         * Calculate the environment and user specific tokens for local storage data that is specific to
         * user and environment.
         *
         * NOTE: The returned string may have spaces in it, and other characters unfriendly for property names.
         * Always use the array notation, e.g.
         *      var myObject = {};
         *      var myKey = 'my key';
         *      myObj[muyKey] = 'hello world';
         *      console.log( myObj[myKey] );
         */
        getUserToken: function (env, user) {
            if (user) {
                // Username used in login may be case insensitive, so our storage key needs to be too.
                user = user.toLowerCase();
            }
            // Strip out the regex match character sequences from the userToken, and replace with the env and user.
            // If no environment or user is set then use a default token.
            var userToken = this.userToken.replace(new RegExp('\\\\', 'g'), '').replace('\\[', '[').replace('(.*)', (env ? env : '_Anonymous_')).replace('(.*?)', (user ? user : '_Anonymous_'));
            return userToken;
        },

        /**
         * @private
         * Test and upgrade local storage schema if it has changed.
         * Because this is called during singleton construction, you cannot
         * rely on anything else to exist unless you put requires instructions into this class.
         *
         * Because this is called before user login, it can handle only these cases:
         * 1. Global local storage changes.
         * 2. Changes needed for all user storage. I.e. not related to a specific currently logged in user.
         */
        upgradeStorage: function () {
            try {
                if (this.localStorageAvailable()) {
                    var currentStorageVersion = this.get(this.storageVersionKey);
                    if (!currentStorageVersion || currentStorageVersion != this.storageVersion) {
                        // Upgrade.
                        if (!currentStorageVersion) {
                            // Upgrading from prior to ABP3.

                            // Nothing to do at the moment.
                        } else if (currentStorageVersion == '3') {
                            // Upgrading from version 3.
                            // This requires converting per-user keys to the new key token format.

                            // Loop through every local storage entry finding entries for ABP users which are using the version 3 key format.
                            // Create an array of adjustments to make. If we do the adjustments immediately then those new keys
                            // can get picked up in this loop, causing more copies of the keys to be created. Instead,
                            // the adjustments are done in one go at the end.
                            var changes = [];
                            var re = new RegExp('^' + this.prefix + this.userToken3); // matches a local storage key for an ABP user (in version 3 format).
                            for (var i = 0; i < localStorage.length; i++) {

                                // Ignore unless it is an ABP local user item.
                                var key = localStorage.key(i);
                                var matchResult = key.match(re);
                                if (matchResult) {

                                    // Gather the user data.
                                    var env = matchResult[1];
                                    var user = matchResult[2];
                                    if (user) {
                                        user = user.toLowerCase();
                                    }
                                    var itemKey = matchResult.input.replace(matchResult[0], '');
                                    var itemValue = localStorage.getItem(localStorage.key(i));

                                    // Insert the changes.
                                    changes.push({ env: env, user: user, itemKey: itemKey, itemValue: itemValue, oldKey: key });
                                }
                            }

                            // Do changes.
                            for (var i = 0; i < changes.length; i++) {
                                // Insert the new key.
                                this.setForUser(changes[i].env, changes[i].user, changes[i].itemKey, changes[i].itemValue);

                                // Delete the old key
                                localStorage.removeItem(changes[i].oldKey);
                            }
                        }

                        // Now using latest storage version.
                        this.set(this.storageVersionKey, this.storageVersion);
                    }
                }
            } catch (err) {
                // Cannot assume any other part of ABP is present, so just log to console.
                console.log(err);
            };
        }
    }
});