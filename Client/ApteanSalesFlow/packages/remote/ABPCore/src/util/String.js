/**
 * Utility functions that help transform string values
 */
Ext.define('ABP.util.String', {
    singleton: true,

    requires: [
        'ABP.util.Logger'
    ],

    config: {
        seperator: ','
    },

    constructor: function (config) {
        this.initConfig(config);
    },

    /**
     * Parses the string value. seperating on the configured seperator
     *
     * @param {String} str the string to parse
     * @return {Array} An array of the seperated values
     */
    toArray: function (str) {
        var words;
        if (str) {
            words = str.split(this.config.seperator);
        }
        return words || [];
    },

    /**
    *  Split a string and capitalize first letter of each word
    * @param {String} string the words to be capitalized
    * @param {String} seperator the character to split words on
    * @param {String} joiner the character to join words back together
    *
    * @return {String} the capitalized string
    */
    makeHumanReadable: function (string, seperator, joiner) {
        var words = string.split(seperator || " ");
        words = words.map(function capitalize(word) {
            return word.slice(0, 1).toUpperCase() + word.slice(1);
        });
        return words.join(joiner || ' ');
    },

    /**
    * Capitalize the first letter of a string
    * @param {String} string the string to capitalize
    *
    * @return {String} the original string with the first letter capitalized
    */
    capitalize: function (string) {
        return string.slice(0, 1).toUpperCase() + string.slice(1);
    },

    /**
    * Adds ellipsis to strings if string is longer than desired length
    *
    * @param {String} string the string to limit the length of
    * @param {Number} length the max string length desired
    *
    * @return {String}
    */
    limitLength: function (string, length) {
        if (!length) {
            return string;
        }
        var newString = string;
        if (string.length > length) {
            newString = string.slice(0, length);
            if (newString[newString.length - 1] === " ") {
                newString = newString.slice(0, -1);
            }
            newString += "...";
        }
        return newString;
    },

    /**
    *  Returns numbers in a string.  If no numbers, returns false.
    *
    * @param {String} string The string to parse a number out of.
    * @param {Number} parser The parser type. Defaults to 10.
    */
    parseInt: function(string, radix) {
        radix = radix ? radix : 10;

        var num = parseInt(string, radix);

        if (Ext.isNumber(num)) {
            return num
        } else {
            return false;
        }
    },

    /**
    * Determines if letter is a vowel.
    *
    * @param {String} letter
    * @returns {Boolean}
    */
    isVowel: function(letter) {
        var vowels = ['a', 'A', 'e', 'E', 'i', 'I', 'o', 'O', 'u', 'U'];

        return vowels.indexOf(letter) > -1;
    }
});
