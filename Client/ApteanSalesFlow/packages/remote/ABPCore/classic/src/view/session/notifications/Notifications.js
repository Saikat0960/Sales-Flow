/*
    Notification Right Pane Container (Classic)
*/
Ext.define('ABP.view.session.notifications.Notifications', {
    extend: 'ABP.view.base.rightpane.RightPanePanel',
    requires: [
        'ABP.view.session.notifications.NotificationsController',
        'ABP.view.session.notifications.NotificationsViewModel'
    ],

    alias: 'widget.abp-notifications',

    controller: 'abp-notifications',

    viewModel: {
        type: 'abp-notifications'
    },

    ui: 'lightgrey',
    bodyCls: 'abp-notifications',

    layout: 'card',
    ariaRole: 'application',
    bind: {
        title: '{i18n.abp_notifications_rightpane_title}'
    },

    items: [{
        xtype: 'label',
        cls: 'notifications-no-notifications',
        bind: {
            text: '{i18n.abp_notifications_label_no_notifications:htmlEncode}'
        }
    }, {
        xtype: 'label',
        cls: 'notifications-no-notifications',
        bind: {
            text: '{i18n.abp_notifications_label_no_new_notifications:htmlEncode}'
        }
    }, {
        xtype: 'container',
        reference: 'notificationContainer',
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        scrollable: 'y'
    }],
    applyFocus: function(){
        this.lookupReference('notificationNavComponent').focus();
    }
});
