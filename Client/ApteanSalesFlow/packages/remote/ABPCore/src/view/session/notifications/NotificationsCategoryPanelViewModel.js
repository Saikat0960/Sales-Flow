Ext.define('ABP.view.session.notifications.NotificationsCategoryPanelViewModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.abp-notifications-category-panel',

    data: {
        unreadNotificationCount: 0,
        historyNotificationCount: 0,

        displayHistory: false,
        categoryName: '',
        currentNavIndex: 0
    },

    formulas: {
        hidePanel: function (get) {
            return ((get('unreadNotificationCount') + get('historyNotificationCount')) === 0);
        },

        hideShowHistoryComponent: function (get) {
            return (get('historyNotificationCount') === 0 || get('displayHistory'));
        },

        hideHideHistoryComponent: function (get) {
            return (get('historyNotificationCount') === 0 || !get('displayHistory'));
        },

        categoryNotificationCountDisplay: function (get) {
            var notificationCount = get('unreadNotificationCount');
            if (notificationCount > 0) {
                if (notificationCount > 99) {
                    notificationCount = '99+';
                } 
                return '<span class="abp-notification-panel-badge">' + notificationCount + '</span>';
            }

            return '';
        },
        ariaCategoryNotificationLabel: function(get){
            var unreadCount = get('unreadNotificationCount');
            var historyCount = get('historyNotificationCount');
            //Maybe no 'unread' if there are no unread notifications
            var label = get('categoryName');
            label += ' unread '+ unreadCount;
            label += historyCount > 0 ? ' history ' + historyCount : '';
            //label += historyCount > 0 ? ' toggle history shown alt + H' : '';
            return label;
        },
        totalNotificationCount: function(get){
            var unreadCount = get('unreadNotificationCount');
            var historyCount = get('historyNotificationCount');
            var total = get('displayHistory') ? unreadCount + historyCount : unreadCount;
            var idx = get('currentNavIndex') + 1;
            return ' list item ' + idx + ' of ' + total;
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
        var me = this,
            historyNotificationCount = me.get('historyNotificationCount');

        historyNotificationCount--;

        me.set('historyNotificationCount', historyNotificationCount);

        if (historyNotificationCount === 0) {
            me.set('displayHistory', false);
        }
    }
});
