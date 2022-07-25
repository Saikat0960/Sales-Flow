Ext.define('ABP.view.session.notifications.NotificationsSourcePanelViewModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.abp-notifications-source-panel',

    data: {
        unreadNotificationCount: 0,
        historyNotificationCount: 0,

        flaggedNotificationCount: 0,
        showFlaggedOnly: false
    },

    formulas: {
        hidePanel: function (get) {
            return ((get('unreadNotificationCount') + get('historyNotificationCount')) === 0);
        },

        sourceNotificationCountDisplay: function (get) {
            var notificationCount = get('unreadNotificationCount');
            if (notificationCount > 0) {
                if (notificationCount > 99) {
                    notificationCount = '99+';
                }
                return '<span class="abp-notification-panel-badge">' + notificationCount + '</span>';
            }

            return '';
        },

        sourceNotificationFlagDisplay: function (get) {
            var flagCount = get('flaggedNotificationCount');
            var flaggedOnly = get('showFlaggedOnly');

            if (flagCount === 0) {
                this.set('showFlaggedOnly', false);
                return '';
            }

            var html = '<span class="abp-notification-panel-flag ';
            if (flaggedOnly){
                html += 'abp-notification-flagged-only';
            }
            html += '">' + flagCount + '</span>';

            return html;
        },
        ariaMainNotificationLabel: function (get) {
            return 'Notifications unread ' + get('unreadNotificationCount') + ' flagged ' + get('flaggedNotificationCount');
        }
    },

    incrementUnreadNotificationCount: function () {
        var me = this;

        me.set('unreadNotificationCount', me.get('unreadNotificationCount') + 1);
    },
    decrementUnreadNotificationCount: function () {
        var me = this;

        me.set('unreadNotificationCount', me.get('unreadNotificationCount') - 1);
    },

    incrementHistoryNotificationCount: function () {
        var me = this;

        me.set('historyNotificationCount', me.get('historyNotificationCount') + 1);
    },

    decrementHistoryNotificationCount: function () {
        var me = this;

        me.set('historyNotificationCount', me.get('historyNotificationCount') - 1);
    },

    incrementFlaggedNotificationCount: function () {
        var me = this;

        me.set('flaggedNotificationCount', me.get('flaggedNotificationCount') + 1);
    },
    decrementFlaggedNotificationCount: function () {
        var me = this;

        me.set('flaggedNotificationCount', me.get('flaggedNotificationCount') - 1);
    },
});
