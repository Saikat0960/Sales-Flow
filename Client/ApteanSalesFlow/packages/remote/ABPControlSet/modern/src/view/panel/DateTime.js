/**
 * @private
 * Month calendar with a time field included below it.
 */
Ext.define('ABPControlSet.view.panel.DateTime', {
    extend: 'Ext.panel.Date',
    xtype: 'abpdatetimepanel',

    requires: [
        'Ext.layout.Carousel',
        'Ext.panel.DateView',
        'Ext.panel.DateTitle',
        'Ext.panel.YearPicker'
    ],
    bbar: {
        xtype: 'container',
        items: [
            {
                padding: "0px 2px 0px 2px",
                xtype: 'abptime',
                itemId: "timeField"
            }
        ]
    },
    config: {
        format: {
            $value: Ext.Date.defaultFormat + ' ' + Ext.Date.defaultTimeFormat,
            cached: true
        }
    },

    applyValue: function (date) {
        if (typeof date === 'string') {
            date = Ext.Date.parse(date, this.getFormat());
        }
        // This is to make sure the default value doesn't get stale
        // in long running apps
        else if (!date) {
            date = new Date();
        }

        return Ext.isDate(date) ? date : null;
    },

    onTodayButtonClick: function () {
        var me = this,
            timeField = me.down("#timeField"),
            timeDateValue = timeField ? timeField.getValue() : null,
            offset;

        offset = me.getLayout().getFrontItem().getMonthOffset();

        if (offset !== 0) {
            // This looks smoother if switchPane is used
            if (Math.abs(offset) === 1) {
                me.switchPanes(-offset);
            } else {
                me.replacePanes(-offset);
            }
        }
        var today = new Date();
        if (timeDateValue) {
            today.setHours(timeDateValue.getHours());
            today.setMinutes(timeDateValue.getMinutes());
        }
        me.setValue(today);
    },

    // ABP - set the time field value.
    updateValue: function (value, oldValue) {
        var me = this,
            time = Ext.isDate(value) ? Ext.Date.format(value, Ext.Date.defaultTimeFormat) : null,
            timeField = me.down("#timeField");

        if (timeField) {
            timeField.setValue(time);
        }

        me.callParent(arguments);
    },

    // When the date is clicked to set the final value, get the time field value.
    onDateClick: function (e) {
        var me = this,
            cell = e.getTarget(me.cellSelector, me.bodyElement),
            date = cell && cell.date,
            focus = true,
            disabled = cell && cell.disabled,
            timeField = me.down("#timeField"),
            timeDateValue = timeField ? timeField.getValue() : null;

        // Need to create a new date to use for manipulating so the same date reference is not used throughout the value updates - or else comparisons of change won't work for times.
        date = new Date(date.getTime());
        // Click could land on element other than date cell
        if (!date || me.getDisabled()) {
            return;
        }
        if (date && timeDateValue) {
            date.setHours(timeDateValue.getHours());
            date.setMinutes(timeDateValue.getMinutes());
        }
        if (!disabled) {
            me.setValue(date);

            if (me.getAutoConfirm()) {
                // Touch events change focus on tap.
                // Prevent this as we are just about to hide.
                // PickerFields revert focus to themselves in a beforehide handler.
                if (e.pointerType === 'touch') {
                    e.preventDefault();
                }
                focus = false;
                me.fireEvent('select', me, date);
            }
        }

        if (focus) {
            // Even though setValue might focus the date, we may
            // either be in a position where the date is disabled
            // or already set.
            me.focusDate(date);
        }
    },

    privates: {
        applyFocusableDate: function (date) {
            var me = this,
                boundary;

            // Null is a valid value to set onFocusLeave in order to clear the focused cell
            // and allow the value to be set the next time the panel is displayed.
            if (date) {
                if ((boundary = me.getMinDate()) && !me.getShowBeforeMinDate() &&
                    date.getTime() < boundary.getTime()) {
                    date = boundary;
                }
                else if ((boundary = me.getMaxDate()) && !me.getShowAfterMaxDate() &&
                    date.getTime() > boundary.getTime()) {
                    date = boundary;
                }
            }

            return date;
        }
    },

    getPaneByDate: function (date) {
        var me = this,
            findDate = Ext.Date.clearTime(new Date(date), true),
            panes = me.getInnerItems(),
            month, pane, i, len;
        month = Ext.Date.getFirstDateOfMonth(findDate);
        for (i = 0, len = panes.length; i < len; i++) {
            pane = panes[i];
            if (Ext.Date.isEqual(pane.getMonth(), month)) {
                return pane;
            }
        }
        return null;
    },

    getCellByDate: function (date) {
        var findDate = Ext.Date.clearTime(new Date(date), true);
        var pane = this.getPaneByDate(findDate);
        return pane ? pane.getCellByDate(findDate) : null;
    }
});