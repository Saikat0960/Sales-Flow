/**
 * JSON web token (JWT) methods.
 *
 * Uses the AuthO jwt_decode library: https://github.com/auth0/jwt-decode
 */
Ext.define('ABP.util.Jwt', {
    singleton: true,

    /**
    * Tests if the supplied token string is a JWT token or not.
    * @returns true or false
    */
    isJwt: function (tokenString) {
        try {
            jwt_decode(tokenString);
        } catch (ex) {
            return false;
        }
        return true;
    },

    /**
     * Returns the payload part of a JWT token string.
     */
    getPayload: function (tokenString) {
        return jwt_decode(tokenString);
    },

        /**
     * Generate a one time use, random string
     */
    getNonce: function() {
        var nonce = this.randomString(16);
        ABP.util.LocalStorage.set('nonce', nonce);
        return nonce;
    },

    /**
     * validate that the single use value is the same as the requested
     * 
     * @param {String} nonce the single use value returned from the server
     */
    validateNonce: function(nonce){
        var isValid = false;
        if (ABP.util.LocalStorage.get('nonce') === nonce){
            isValid = true;
        }

        // Clear the value - it can only be used once
        ABP.util.LocalStorage.set('nonce', '');

        return isValid;
    },

    privates: {
        randomString: function(length) {
            var charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz-._'
            result = ''
        
            while (length > 0) {
                var bytes = new Uint8Array(16);
                var random = window.crypto.getRandomValues(bytes);
        
                random.forEach(function(c) {
                    if (length == 0) {
                        return;
                    }
                    if (c < charset.length) {
                        result += charset[c];
                        length--;
                    }
                });
            }
            return result;
        }
    }
});