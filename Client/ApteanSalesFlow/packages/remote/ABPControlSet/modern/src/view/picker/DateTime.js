/**
 * @private
 * ABPControlSet date time edge picker.
 */
Ext.define('ABPControlSet.view.picker.DateTime', {
    extend: 'Ext.picker.Date',
    xtype: 'abpdatetimepicker',

    config: {
        /**
         * @cfg {String} hourText
         * The label to show for the hour column.
         * @accessor
         */
        hourText: 'Hour',
        /**
         * @cfg {String} minuteText
         * The label to show for the hour column.
         * @accessor
         */
        minuteText: 'Minute',
        /**
         * @cfg {String} hourText
         * The label to show for the hour column.
         * @accessor
         */
        meridiemText: 'AM/PM',

        /**
         * @cfg {Array} slotOrder
         * An array of strings that specifies the order of the slots.
         * @accessor
         */
        slotOrder: ['month', 'day', 'year', 'hour', 'minute', "meridiem"]
    },

    setValue: function (value, animated) {
        var me = this;

        if (Ext.isDate(value)) {
            value = {
                day: value.getDate(),
                month: value.getMonth() + 1,
                year: value.getFullYear(),
                hour: value.getHours(),
                minute: value.getMinutes()
            };
        }

        me.callParent([value, animated]);
        if (me.rendered) {
            me.onSlotPick();
        }

        return me;
    },

    getValue: function (useDom) {
        var values = {},
            items = this.getItems().items,
            ln = items.length,
            daysInMonth, day, month, year, hour, minute, meridiem, item, i;

        for (i = 0; i < ln; i++) {
            item = items[i];
            if (item.isSlot) {
                values[item.getName()] = item.getValue(useDom);
            }
        }

        var localeIs24 = false;
        var format = Ext.Date.defaultTimeFormat;
        try {
            if (format && format.indexOf('H') > -1) {
                localeIs24 = true;
            }
        } catch (error) { }
        //if all the slots return null, we should not return a date
        if (values.year === null && values.month === null && values.day === null) {
            return null;
        }

        meridiem = Ext.isNumber(values.meridiem) ? values.meridiem : 0; // 0 === AM, 1 === PM
        year = Ext.isNumber(values.year) ? values.year : 1;
        month = Ext.isNumber(values.month) ? values.month : 1;
        day = Ext.isNumber(values.day) ? values.day : 1;
        hour = Ext.isNumber(values.hour) ? (localeIs24 ? values.hour : values.hour + (meridiem === 1 ? 12 : 0)) : localeIs24 ? 0 : 12;
        minute = Ext.isNumber(values.minute) ? values.minute : 0;

        if (month && year && month && day) {
            daysInMonth = this.getDaysInMonth(month, year);
        }
        day = (daysInMonth) ? Math.min(day, daysInMonth) : day;

        return new Date(year, month - 1, day, hour, minute);
    },

    /**
     * Generates all slots for all years specified by this component, and then sets them on the component
     * @private
     */
    createSlots: function () {
        var me = this,
            slotOrder = me.getSlotOrder(),
            yearsFrom = me.getYearFrom(),
            yearsTo = me.getYearTo(),
            years = [],
            days = [],
            months = [],
            hours = [],
            minutes = [],
            meridiems = [{
                text: 'AM',
                value: 0
            }, {
                text: 'PM',
                value: 1
            }],
            slots = [],
            reverse = yearsFrom > yearsTo,
            ln, i, daysInMonth;

        while (yearsFrom) {
            years.push({
                text: yearsFrom,
                value: yearsFrom
            });

            if (yearsFrom === yearsTo) {
                break;
            }

            if (reverse) {
                yearsFrom--;
            } else {
                yearsFrom++;
            }
        }

        // Set hours.
        var localeIs24 = false;
        var format = Ext.Date.defaultTimeFormat;
        try {
            if (format && format.indexOf('H') > -1) {
                localeIs24 = true;
            }
        } catch (error) { }
        var hoursLength = localeIs24 ? 24 : 12;
        for (i = 0; i < hoursLength; i++) {
            hours.push({
                text: localeIs24 ? i : i + 1,
                value: localeIs24 ? i : i + 1
            });
        }
        // Set minutes
        for (i = 0; i < 60; i++) {
            minutes.push({
                text: i < 10 ? '0' + i : i,
                value: i
            });
        }

        daysInMonth = me.getDaysInMonth(1, new Date().getFullYear());

        for (i = 0; i < daysInMonth; i++) {
            days.push({
                text: i + 1,
                value: i + 1
            });
        }

        for (i = 0, ln = Ext.Date.monthNames.length; i < ln; i++) {
            months.push({
                text: Ext.Date.monthNames[i],
                value: i + 1
            });
        }

        slotOrder.forEach(function (item) {
            // Only include meridiems if locale is not 24 hour
            if (item !== 'meridiem' || (item === 'meridiem' && !localeIs24)) {
                slots.push(me.createSlot(item, days, months, years, hours, minutes, meridiems));
            }
        });

        me.setSlots(slots);
    },

    /**
     * Returns a slot config for a specified date.
     * @private
     */
    createSlot: function (name, days, months, years, hours, minutes, meridiems) {
        var me = this,
            result;

        switch (name) {
            case 'year':
                result = {
                    name: 'year',
                    align: 'center',
                    data: years,
                    title: me.getYearText(),
                    flex: 3
                };
                break;
            case 'month':
                result = {
                    name: name,
                    align: 'right',
                    data: months,
                    title: me.getMonthText(),
                    flex: 4
                };
                break;
            case 'day':
                result = {
                    name: 'day',
                    align: 'center',
                    data: days,
                    title: me.getDayText(),
                    flex: 2
                };
                break;
            case 'hour':
                result = {
                    name: 'hour',
                    align: 'center',
                    data: hours,
                    title: me.getHourText(),
                    flex: 2
                };
                break;
            case 'minute':
                result = {
                    name: 'minute',
                    align: 'center',
                    data: minutes,
                    title: me.getDayText(),
                    flex: 2
                };
                break;
            case 'meridiem':
                result = {
                    name: 'meridiem',
                    align: 'center',
                    data: meridiems,
                    title: me.getMeridiemText(),
                    flex: 2
                };
                break;
        }
        if (me._value) {
            result.value = me._value[name];
        }
        return result;
    }
});