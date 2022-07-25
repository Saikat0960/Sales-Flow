/**
 * Utility functions that help transform date values
 */
Ext.define('ABP.util.Date', {
    singleton: true,

    requires: [
        'ABP.util.Logger'
    ],

    config: {
        formats: [
            "Y-m-d H:i:s" //ISO8601Long
            , "Y-m-d" //ISO8601Short
            , "h:i:s" //time
            , "H:i:s" //time
            , "n/j/Y" //ShortDate
            , "l, F d, Y" //LongDate
            , "l, F d, Y g:i:s A" //FullDateTime
            , "F d" //MonthDay
            , "g:i A" //ShortTime
            , "g:i:s A" //LongTime
            , "Y-m-d\\TH:i:s" //SortableDateTime
            , "Y-m-d H:i:sO" //UniversalSortableDateTime
            , "F, Y" //YearMonth
            , "c"
        ]
    },

    constructor: function (config) {
        this.initConfig(config);
    },

    /**
     * Parses the string value. Uses brute force to get the date from the string iterating through the various date formats
     *
     * @param {String} str the currency value to have the decimal part removed
     * @return {Date} The date object is the string can be parsed or false if it can not
     */
    parse: function (str) {
        if (Ext.isDate(str)) {
            return str;
        }

        if (Number.isInteger(str)) {
            return new Date(str);
        }

        if (Ext.Number.parseInt(str)) {
            return new Date(Ext.Number.parseInt(str));
        }

        var d = null;
        var formats = this.getFormats();
        for (var i = 0; i < formats.length; i++) {
            d = Ext.Date.parse(str, formats[i]);
            if (d)
                return d;
        }

        return false;
    }
});