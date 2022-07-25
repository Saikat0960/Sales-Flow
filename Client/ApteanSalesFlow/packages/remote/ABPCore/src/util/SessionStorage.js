/**
 * This class provides a common API to session storage in the browser.
 *
 * Examples:
 *
 *     ABP.util.SessionStorage.set('ActivityState', 'open')
 *     ABP.util.SessionStorage.get('ActivityState')
 *
 * The naming convention for keys is UpperCamelCase.
 */
Ext.define('ABP.util.SessionStorage', {
    singleton: true,

    prefix: "ABP_",

    /**
     * Returns the value associated with the given 'key'.
     * **NOTE:** This method conforms to the standard HTML5 Storage interface.
     * @param {String} key The key.
     * @return {String} The value associated with the given 'key'.
     */
    get: function (key) {
        if (this.sessionStorageAvailable()) {
            var value = sessionStorage.getItem(this.prefix + key);
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
        if (this.sessionStorageAvailable()) {
            sessionStorage.setItem(this.prefix + key, value);
        }
    },

    /**
     * Removes the value associated with the given 'key'.
     * **NOTE:** This method conforms to the standard HTML5 Storage interface.
     * @param {String} key The key.
     */
    remove: function (key) {
        if (this.sessionStorageAvailable()) {
            sessionStorage.removeItem(this.prefix + key);
        }
    },

    /**
     * Tests if the given key is in session storage.
     * @param {String} key The key.
     * @returns {Boolean} true is the given key is present, else false.
     */
    contains: function (key) {
        if (this.sessionStorageAvailable()) {
            return (sessionStorage.getItem(this.prefix + key) === null ? false : true);
        }
        return false;
    },

    privates: {
        /**
         * @private
         * Check whether session storage is available within the browser.
         * @param {Boolean} logError Whether or not to log an error if session storage is not available.
         */
        sessionStorageAvailable: function (logError) {
            try {
                // This will throw an exception if session storage is disabled.
                return (window.sessionStorage !== undefined && window.sessionStorage !== null);
            } catch (err) {
                if (logError) {
                    console.log(err);
                }
                return false;
            }
        }
    }
});