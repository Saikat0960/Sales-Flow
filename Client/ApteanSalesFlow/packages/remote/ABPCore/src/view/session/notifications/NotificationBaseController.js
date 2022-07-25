/*
    Notifications Controller

    Common Controller methods for both Classic and Modern
*/
Ext.define('ABP.view.session.notifications.NotificationBaseController', {
    extend: 'Ext.app.ViewController',

    onNotificationLinkClick: function () {
        var me = this,
            view = me.getView(),
            record = view.getNotificationRecord();

        if (record.event) {
            me.fireEvent(record.event, record.eventArgs);
        }
    },

    onNotificationDownloadClick: function () {
        var me = this,
            view = me.getView(),
            record = view.getNotificationRecord();

        if (record.downloadEvent) {
            me.fireEvent(record.downloadEvent, record.downloadEventArgs);
        }
    },

    onNotificationFlagClick: function (btn, eOpts) {
        var me = this,
            view = me.getView(),
            record = view.getNotificationRecord(),
            btnPressed = me.__checkBtnPressed(btn);

        // Set the left border flag indication
        if (btnPressed) {
            btn.setIconCls('icon-flag-filled');

            view.addCls('abp-notification-flagged');
        } else {
            btn.setIconCls('icon-signal-flag');

            view.removeCls('abp-notification-flagged');
        }

        // Fire event to indicate flag change
        record.flagged = btnPressed;
        me.fireEvent('notification_flag_change', record);

        // Fire event for the notification container
        view.setNotificationRecord(record);
        if (btnPressed) {
            me.fireViewEvent('notificationFlag');
        } else {
            me.fireViewEvent('notificationUnflag');
        }
    },

    __switchToContainer: function (view, newContainer, newContainerCls, activeItem) {
        var me = this,
            notificationDisplayContainer = me.lookupReference('notificationDisplayContainer');

        // Remove potential flagged Cls
        view.removeCls('abp-notification-flagged');

        // Add switched to cls
        view.addCls(newContainerCls);

        // Adjust height to match notification display
        newContainer.setHeight(notificationDisplayContainer.el.getHeight());

        me.__setActiveCardItem(newContainer, activeItem);
    },

    onNotificationMarkReadClick: function () {
        var me = this,
            view = me.getView(),
            record = view.getNotificationRecord(),
            markedAsReadContainer = me.lookupReference('notificationMarkedAsReadContainer');

        // Switch to Marked Read Display, then fire view event to move to history
        me.__switchToContainer(view, markedAsReadContainer, 'abp-notification-markasread', 1);

        me.__animateFade(markedAsReadContainer, function () {
            // Send notification to application listener
            me.fireEvent('notification_read', record);

            // Fire event for the notification container
            me.fireViewEvent('notificationRead');
        });
    },

    onNotificationMarkUnreadClick: function () {
        var me = this,
            view = me.getView(),
            record = view.getNotificationRecord(),
            markedAsUnreadContainer = me.lookupReference('notificationMarkedAsUnreadContainer');

        // Switch to Marked Unread Display, then fire view event to move to history
        me.__switchToContainer(view, markedAsUnreadContainer, 'abp-notification-markasunread', 2);

        me.__animateFade(markedAsUnreadContainer, function () {
            // Send notification to application listener
            me.fireEvent('notification_unread', record);

            // Fire event for the notification container
            me.fireViewEvent('notificationUnread');
        });
    },

    onNotificationRemoveClick: function () {
        var me = this,
            view = me.getView(),
            record = view.getNotificationRecord(),
            removedContainer = me.lookupReference('notificationRemovedContainer');

        // Switch to Removed Display (Blue?), then fire view event to remove
        me.__switchToContainer(view, removedContainer, 'abp-notification-removed', 3);

        me.__animateFade(removedContainer, function () {
            // Send notification to application listener
            me.fireEvent('notification_removed', record);

            // Fire event for the notification container
            me.fireViewEvent('notificationRemove');
        });
    }
});
