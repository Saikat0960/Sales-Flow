/*
    Notification Right Pane Container (Modern)
*/
Ext.define('ABP.view.session.notifications.NotificationsCategoryPanel', {
    extend: 'Ext.Panel',

    alias: 'widget.abp-notifications-category-panel',

    controller: 'abp-notifications-category-panel',

    viewModel: {
        type: 'abp-notifications-category-panel'
    },

    config: {
        categoryName: null,
        categoryNameKey: null
    },

    cls: 'abp-notifications-category-panel a-abp-notifications-category-panel',

    showAnimation: {
        type: 'fadeIn',
        element: this.element
    },
    hideAnimation: {
        type: 'fadeOut',
        element: this.element
    },

    collapsible: {
        collapseToolText: null, // No tooltip
        expandToolText: null,    // No tooltip
        collapsed: false,
        tool: {
            automationCls: 'notifications-category-panel-collapse-tool'
        }
    },

    bind: {
        hidden: '{hidePanel}'
    },

    items: [{
        xtype: 'container',
        layout: 'hbox',
        frame: false,
        items: [{
            xtype: 'component',
            reference: 'categoryShowHistoryComponent',
            cls: 'notifications-hideshow-history x-unselectable',
            bind: {
                html: '{i18n.abp_notifications_label_show_history:htmlEncode}',
                hidden: '{hideShowHistoryComponent}'
            },
            listeners: { // For just the "Show History" link
                click: {
                    element: 'element',
                    fn: 'onShowHistoryClick'
                }
            }
        }, {
            xtype: 'component',
            reference: 'categoryHideHistoryComponent',
            cls: 'notifications-hideshow-history x-unselectable',
            bind: {
                html: '{i18n.abp_notifications_label_hide_history:htmlEncode}',
                hidden: '{hideHideHistoryComponent}'
            },
            listeners: { // For just the "Hide History" link
                click: {
                    element: 'element',
                    fn: 'onHideHistoryClick'
                }
            }
        }]
    }, {
        xtype: 'container',
        reference: 'unreadNotificationContainer',
        cls: 'abp-notifications-unread-container',
    }, {
        xtype: 'container',
        reference: 'historyNotificationContainer',
        cls: 'abp-notifications-history-container',
        bind: {
            hidden: '{!displayHistory}'
        }
    }],

    initialize: function () {
        var me = this,
            categoryNameKey = this.getCategoryNameKey(),
            categoryName = this.getCategoryName();

        this.setBind({
            hidden: '{hidePanel}',
            title: '<span class="abp-notification-panel-title">' + (categoryNameKey ? '{i18n.' + categoryNameKey + ':htmlEncode}' : Ext.String.htmlEncode(categoryName)) + '</span>{categoryNotificationCountDisplay}'
        });

        me.callParent();
    },

    addNotification: function(notificationRecord, isNew) {
        var me = this,
            controller = me.getController();

        controller.addNotification(notificationRecord, isNew);
    },

    removeNotification: function (notification) {
        var me = this,
            controller = me.getController();

        controller.removeNotification(notification);
    },

    markNotificationRead: function (notification) {
        var me = this,
            controller = me.getController();

        controller.markNotificationRead(notification);
    },

    markNotificationUnread: function (notification) {
        var me = this,
            controller = me.getController();

        controller.markNotificationUnread(notification);
    }
});
