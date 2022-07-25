/*
    NOTE: This file is added to include the Ext JS v6.6 Modern Time Field - remove duplicate code once updated to v6.6 or greater.
*/
Ext.define('Ext.data.validator.Time', {
    extend: 'Ext.data.validator.AbstractDate',
    alias: 'data.validator.time',

    type: 'time',

    isTimeValidator: true,
    message: 'Is not a valid time',
    privates: {
        getDefaultFormat: function () {
            return Ext.Date.defaultTimeFormat;
        }
    }
});