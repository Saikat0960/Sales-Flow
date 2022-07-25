/**
 * Utility functions that help transform currency values
 */
Ext.define('ABP.util.Currency', {
    singleton: true,

    requires: [
        'ABP.util.Logger'
    ],

    /**
     * Remove the fraction part of the currency
     *
     * @param {Number} amountValue the currency value to have the decimal part removed
     */
    removeCents: function (amountValue) {
        return Ext.util.Format.currency(amountValue, Ext.util.Format.currencySign, 0);
    },

    /**
     * Extract the decimal value from the currency ammount
     *
     * @param {Number} amountValue the currency value to extract the decimal part from
     */
    cents: function (amountValue) {
        var value = Ext.util.Format.currency(amountValue);
        var parts = value.split(Ext.util.Format.decimalSeparator)
        if (parts.length >= 2)
            return parts[1];
        else
            return Ext.util.Format.decimalSeparator + '00';
    },

    /**
     * Format the number value as a currency, shortening if more than 100,000 to
     *
    * @param {Number} data the currency value to format
    * @returns {String} the value formatted as an abbreivated currency
    *
     */
    abvFormat: function (data) {
        var value = Ext.util.Format.currency(data, Ext.util.Format.currencySign, 0);

        // If more than 100,000 then display as 100k
        if (value > 100000) {
            value = value.substr(0, value.length - 4) + 'k';
        }

        return value;
    }
});
