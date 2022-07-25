Ext.define('ABP.view.session.notifications.NotificationsViewModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.abp-notifications',

    data: {
        notifications: [],                  // Notifications themselves
        maxHistory: null,                   // Record of max number of notifications to hold
        clearBadgeOnActivate: null        // Whether badge will be cleared when notification pane shown
    }
});
