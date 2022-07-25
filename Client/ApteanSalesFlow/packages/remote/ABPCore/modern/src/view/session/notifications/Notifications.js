/*
    Notification Right Pane Container (Modern)
*/
Ext.define('ABP.view.session.notifications.Notifications', {
    extend: 'ABP.view.base.rightpane.RightPanePanel',
    requires: [
        'ABP.view.session.notifications.NotificationsController',
        'ABP.view.session.notifications.NotificationsViewModel'
    ],

    alias: 'widget.abp-notifications',
    reference: 'abp-notifications',

    controller: 'abp-notifications',

    viewModel: {
        type: 'abp-notifications'
    },
    ui: 'grey',
    bind: {
        title: '{i18n.abp_notifications_rightpane_title:htmlEncode}'
    },

    cls: 'abp-notifications',

    layout: 'card',

    items: [{
        xtype: 'label',
        cls: 'notifications-no-notifications',
        bind: {
            html: '{i18n.abp_notifications_label_no_notifications:htmlEncode}'
        }
    }, {
        xtype: 'label',
        cls: 'notifications-no-notifications',
        bind: {
            html: '{i18n.abp_notifications_label_no_new_notifications:htmlEncode}'
        }
    }, {
        xtype: 'container',
        cls: 'notification-display',
        reference: 'notificationContainer',
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        scrollable: 'y'
    }]
});
