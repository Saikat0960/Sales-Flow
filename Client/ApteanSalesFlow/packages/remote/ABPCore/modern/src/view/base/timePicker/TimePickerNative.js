/**
*
*/
Ext.define('ABP.view.base.timePicker.TimePickerNative', {
    extend: 'ABP.view.base.timePicker.TimePicker',
    xtype: 'timepickernativefield',

    initialize: function () {

        this.callParent();

    },

    onFocus: function (e) {
        var me = this;

        if (!(navigator.plugins && navigator.plugins.dateTimePicker)) {

            me.callParent();
            return;
        }

        var success = function (res) {
            me.setValue(res);
        };

        var fail = function (e) {
            console.log("DateTimePicker: error occurred or cancelled: " + e);
        };

        try {

            var dateTimePickerFunc = navigator.plugins.dateTimePicker.selectTime; //me.getName() == 'date' ? navigator.plugins.dateTimePicker.selectDate : navigator.plugins.dateTimePicker.selectTime;

            dateTimePickerFunc(success, fail, { value: me.getValue() });

        } catch (ex) {
            fail(ex);
        }
    }
});
