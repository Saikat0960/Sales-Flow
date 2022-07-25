/**
 * Wrapper for Sha256 functionality. Provides basic SHA256 hashing on objects.
 *
 *      Example:
 *
 *          // Salt is optional but makes the hash harder to reproduce.
 *          var salt = ABP.util.Sha256.generateSaltForUser(secretString, environmentId);
 *          // Creates a hash of secretObject.
 *          var objectHash = ABP.util.Sha256.sha256(secretObject, salt);
 */
Ext.define('ABP.util.Sha256', {
    singleton: true,

    /**
    * Hash the given value using Sha256.
    * @param {String} value The value to hash.
    * @param {String} [salt] The optional salt to use when hashing value.
    * @returns true or false
    */
    sha256: function (value, salt) {
        try {
            if (salt) {
                value = salt + value;
            }
            return SHA256(value);
        }
        catch (error) {
            ABP.util.Logger.logWarn(Ext.String.format('Failed to hash value, it will be stored in plain text. Clear browser cache to remove this value. "{0}".', error));
            return value;
        }
    },

    /**
     * Generates a salt for a given user.
     * @param {String} [user] User identifier.
     * @param {String} [environmentId] environment identifier.
     */
    generateSaltForUser: function (user, environmentId) {
        // Do not generate a salt if both values are not provided, we do not want ambiguitiy when it comes to re-creating this salt.
        if (Ext.isEmpty(user) || Ext.isEmpty(environmentId)) {
            return "";
        }
        return user + environmentId;
    }
});