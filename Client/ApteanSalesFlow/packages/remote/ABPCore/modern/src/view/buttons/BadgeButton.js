Ext.define('ABP.view.buttons.BadgeButton', {
    extend: 'Ext.Button',
    xtype: 'abpbadgebutton',

    config: {
        badgePriorityCls: null
    },

    setBadgeValue: function (badgeValue) {
        var me = this;

        me.setBadgeText(badgeValue);
    },

    setBadgePriority: function (badgePriority) {
        var me = this,
            oldBadgePriorityCls = me.getBadgePriorityCls(),
            newBadgePriorityCls = null;

        // Remove the old class, if any
        if (oldBadgePriorityCls) {
            me.removeCls(oldBadgePriorityCls);
        }

        // Add the new class
        if (badgePriority === ABP.util.Constants.badgePriority.Alert) {
            newBadgePriorityCls = 'abp-badge-priority-alert';
        } else if (badgePriority === ABP.util.Constants.badgePriority.Warning) {
            newBadgePriorityCls = 'abp-badge-priority-warning';
        } else if (badgePriority === ABP.util.Constants.badgePriority.Success) {
            newBadgePriorityCls = 'abp-badge-priority-success';
        } else if (badgePriority === ABP.util.Constants.badgePriority.Info) {
            newBadgePriorityCls = 'abp-badge-priority-info';
        }

        me.setBadgePriorityCls(newBadgePriorityCls);
        me.addCls(newBadgePriorityCls);
    },

    incrementBadge: function (number) {
        var me = this,
            badgeValue = me.getBadgeText();

        if (badgeValue === null && !number) {
            me.setBadgeText(1);
        }
        if (Ext.isNumber(number)) {
            // Make sure number is an integer.
            number = parseInt(number);
            if (number < 0) {
                return;
            }
            me.setBadgeText(badgeValue + number);
        } else {
            me.setBadgeText(++badgeValue);
        }
    },

    decrementBadge: function (number) {
        var me = this,
            badgeValue = me.getBadgeText();

        if (badgeValue === null) {
            return;
        }
        if (Ext.isNumber(number)) {
            // Make sure number is an integer.
            number = parseInt(number);
            if (number < 0) {
                return;
            } else if (number >= badgeValue) {
                me.setBadgeText(null);
            }
            else {
                me.setBadgeText(badgeValue - number);
            }
        }
        else {
            if (badgeValue === 1) {
                me.setBadgeText(null)
            } else {
                me.setBadgeText(--badgeValue);
            }
        }
    },

    clearBadge: function () {
        var me = this;
        me.setBadgeText(null);
    },
});
