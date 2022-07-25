/*
    Notifications Base Controller

    Common methods for both Classic and Modern (to be extended)
*/
Ext.define('ABP.view.session.notifications.NotificationsBaseController', {
    extend: 'ABP.controllers.base.rightPane.RightPanePanelController',

    requires: [
        'ABP.view.session.notifications.Notification'
    ],

    listen: {
        controller: {
            '*': {
                abp_notifications_add: '__addNotifications',            // Called from Application Controller
                abp_notifications_remove: '__removeNotifications',      // Called from Application Controller
                abp_notifications_read: '__markNotificationsRead',      // Called from Application Controller
                abp_notifications_unread: '__markNotificationsUnread'  // Called from Application Controller

                /* TODO?
                                abp_notifications_flag: '__flagNotifications',          // Called from Application Controller
                                abp_notifications_unflag: '__flagNotifications'         // Called from Application Controller
                */
            }
        },
        component: {
            'abp-notification': {
                notificationRead: '__markNotificationRead',         // Called from Notification to mark as read
                notificationUnread: '__markNotificationUnread',     // Called from Notification to mark as unread
                notificationFlag: '__flagNotification',             // Called from Notification to mark as flagged
                notificationUnflag: '__unflagNotification',         // Called from Notification to mark as unflagged
                notificationRemove: '__removeNotification',
                notificationKeyNav: 'handleNavKeyDown'         // Called from Notification to remove
            }
        }
    },

    firstLoad: true,

    init: function() {
        var me = this,
            vm = me.getViewModel(),
            notificationSettings = ABP.util.Config.getSessionConfig().settings.notifications;

        // Set View Model Items from session config
        vm.set('maxHistory', notificationSettings.maxHistory);
        vm.set('clearBadgeOnActivate', notificationSettings.clearBadgeOnActivate);
        vm.set('ariaNotificationsLabel', 'No new notifications');

        // Set initial badge count at 0
        me.fireEvent('container_rightPane_updateBadge', 'abp-notifications', {
            value: 0,
            priority: ABP.util.Constants.badgePriority.Info
        });

        // Start the time updater (used by each unread notification to display time ago)
        ABP.util.RelativeTime.start();
    },

    __addNotifications: function (source, sourceKey, newNotifications) {
        var me = this,
            vm = me.getViewModel(),
            maxHistory = vm.get('maxHistory'),
            notifications = vm.get('notifications'),
            notificationRecordToRemove = null;

        Ext.Array.each(newNotifications, function (notification) {
            if (notifications.length === maxHistory) {
                notificationRecordToRemove = notifications.pop();   // Take from the end
                me.__removeNotificationFromDisplay(me.__getNotificationComponentForRecord(notificationRecordToRemove));
            }

            // Track the source for History
            notification.source = source;
            notification.sourceKey = sourceKey;

            // place new item at the front
            notifications.unshift(notification);

            me.__addNotificationToDisplay(notification, !me.firstLoad);
        });

        me.firstLoad = false;

        // Save to data model
        vm.set('notifications', notifications);

        if (notifications.length > 0) {
            me.__setActiveCardItem(2);  // Show notifications
        }
    },

    __addNotificationToDisplay: function(notification, isNew) {
        var me = this,
            notificationContainer = me.lookupReference('notificationContainer'),
            sourcePanel = notificationContainer.down('panel[sourcePanelName="sourcepanel-' + notification.source + '"]'),
            sourcePanelViewModel,
            categoryPanel = null,
            collapseConfig;

        // Check if the source panel has been created yet
        if (!sourcePanel) {

            if (ABP.util.Common.getModern()) {
                collapseConfig = {
                    collapsible: {
                        collapseToolText: null, // No tooltip
                        expandToolText: null,    // No tooltip
                        titleCollapse: true,
                        collapsed: false,
                        tool: {
                            automationCls: 'notifications-' + notification.source + '-collapse-tool'
                        }
                    },
                }
            } else {
                collapseConfig = {
                    collapsible: true,
                    collapsed: false,
                    collapseToolText: null, // No tooltip
                    expandToolText: null,   // No tooltip
                    titleCollapse: true
                }
            }

            sourcePanel = notificationContainer.add({
                xtype: 'panel',
                sourcePanelName: 'sourcepanel-' + notification.source,
                id: 'notificationSourcePanel',
                tabIndex: -1,
                header: {
                    cls: 'abp-notifications-source-panel-header',
                    listeners: {
                        click: me.handleHeaderClick,
                        tap: {
                            element: 'element',
                            scope: me,
                            fn: me.handleHeaderClick
                        }
                    },
                },
                viewModel: {
                    type: 'abp-notifications-source-panel'
                },
                cls: 'abp-notifications-source-panel a-abp-notifications-source-panel',
                bind: {
                    title: '<span class="abp-notification-panel-title">' + (notification.sourceKey ?  '{i18n.' + notification.sourceKey + ':htmlEncode}' : Ext.String.htmlEncode(notification.source)) + '</span>{sourceNotificationCountDisplay}{sourceNotificationFlagDisplay}',
                    hidden: '{hidePanel}'
                },
                items: [
                    {
                        xtype: 'container',
                        reference: 'notificationNavComponent',
                        items: [
                            {
                                xtype: 'label',
                                id: 'notificationsNavLabel',
                                bind: {
                                    ariaLabel: '{ariaMainNotificationLabel:ariaEncode}'
                                }
                            }
                        ],
                        tabIndex: 0,
                        focusable: true,
                        listeners: {
                            keydown: {
                                element: Ext.isModern ? 'element' : 'el',
                                scope: me,
                                fn: me.handleNavKeyDown
                            }
                        }
                    }
                ]
            });
        }
        sourcePanelViewModel = sourcePanel.getViewModel();

        if (notification.new) {
            sourcePanelViewModel.incrementUnreadNotificationCount();
            me.fireEvent('container_rightPane_incrementBadge', 'abp-notifications');
        } else {
            sourcePanelViewModel.incrementHistoryNotificationCount();
        }

        if (notification.flagged) {
            sourcePanelViewModel.incrementFlaggedNotificationCount();
        }

        // Check if the category panel has been created yet
        categoryPanel = sourcePanel.down('panel[categoryPanelName="categorypanel-' + notification.category + '"]');
        if (!categoryPanel) {
            categoryPanel = sourcePanel.add({
                xtype: 'abp-notifications-category-panel',
                categoryPanelName: 'categorypanel-' + notification.category,
                categoryName: notification.category,
                categoryNameKey: notification.categoryKey
            });
        }

        // Now add the notification to the category panel
        categoryPanel.addNotification(notification, isNew);
    },


    // Remove array of notifications
    __removeNotifications: function (removeNotifications) {
        var me = this,
            vm = me.getViewModel(),
            notifications = vm.get('notifications');

        Ext.Array.each(removeNotifications, function (removeNotification) {
            Ext.Array.each(notifications, function (notification) {
                if (notification.uniqueId === removeNotification.uniqueId) {
                    // Found it, now remove it from the display
                    me.__removeNotificationFromDisplay(me.__getNotificationComponentForRecord({ uniqueId: notification.uniqueId }));

                    // break here
                    return false;
                }
            });

            // Remove it from the notification list
            notifications = notifications.filter(function (el) {
                return el.uniqueId !== removeNotification.uniqueId;
            });
        });

        // Save to data model
        vm.set('notifications', notifications);

        if (notifications.length === 0) {
            me.__setActiveCardItem(1);  // Show notifications
        }
    },

    // Remove single notification from the display
    __removeNotificationFromDisplay: function (notificationComponent) {
        var me = this,
            view = me.getView(),
            record = notificationComponent.getNotificationRecord(),
            sourcePanel = view.down('panel[sourcePanelName="sourcepanel-' + record.source + '"]'),
            sourcePanelViewModel = sourcePanel.getViewModel(),
            categoryPanel = sourcePanel.down('panel[categoryPanelName="categorypanel-' + record.category + '"]');

        if (record.new) {
            sourcePanelViewModel.decrementUnreadNotificationCount();
            me.fireEvent('container_rightPane_decrementBadge', 'abp-notifications');
        } else {
            sourcePanelViewModel.decrementHistoryNotificationCount();
        }

        if (record.flagged) {
            sourcePanelViewModel.decrementFlaggedNotificationCount();
        }

        categoryPanel.removeNotification(notificationComponent);
    },


    // Mark single notification read
    __markNotificationRead: function (notificationComponent) {
        var me = this,
            vm = me.getViewModel(),
            readNotification = notificationComponent.getNotificationRecord(),
            notifications = vm.get('notifications'),
            notificationContainer = me.lookupReference('notificationContainer'),
            sourcePanel = notificationContainer.down('panel[sourcePanelName="sourcepanel-' + readNotification.source + '"]'),
            sourcePanelViewModel = sourcePanel.getViewModel(),
            categoryPanel = sourcePanel.down('panel[categoryPanelName="categorypanel-' + readNotification.category + '"]');

        // First, update the main list of notifications
        Ext.Array.each(notifications, function (notification) {
            if (notification.uniqueId === readNotification.uniqueId) {
                if (notification.new) {
                    notification.new = false;

                    // Incremement history, decrement unread count for the source panel
                    sourcePanelViewModel.incrementHistoryNotificationCount();
                    sourcePanelViewModel.decrementUnreadNotificationCount();

                    // Now, move from categoryPanel's unread to history
                    categoryPanel.markNotificationRead(notificationComponent);

                    // Decrement by badge by 1
                    me.fireEvent('container_rightPane_decrementBadge', 'abp-notifications');
                }

                // break here
                return false;
            }
        });
        vm.set('notifications', notifications);
    },

    // Mark array of notifications as read
    __markNotificationsRead: function (clearNotifications) {
        var me = this;

        Ext.Array.each(clearNotifications, function (clearNotification) {
            // Mark it as read
            me.__markNotificationRead(me.__getNotificationComponentForRecord({ uniqueId: clearNotification.uniqueId }));
        });
    },


    __markNotificationUnread: function (notificationComponent) {
        var me = this,
            vm = me.getViewModel(),
            readNotification = notificationComponent.getNotificationRecord(),
            notifications = vm.get('notifications'),
            notificationContainer = me.lookupReference('notificationContainer'),
            sourcePanel = notificationContainer.down('panel[sourcePanelName="sourcepanel-' + readNotification.source + '"]'),
            sourcePanelViewModel = sourcePanel.getViewModel(),
            categoryPanel = sourcePanel.down('panel[categoryPanelName="categorypanel-' + readNotification.category + '"]');

        // First, update the main list of notifications
        Ext.Array.each(notifications, function (notification) {
            if (notification.uniqueId === readNotification.uniqueId) {
                if (!notification.new) {
                    notification.new = true;

                    // Incremement unread, decrement history count for the source panel
                    sourcePanelViewModel.incrementUnreadNotificationCount();
                    sourcePanelViewModel.decrementHistoryNotificationCount();

                    // Now, move from categoryPanel's unread to history
                    categoryPanel.markNotificationUnread(notificationComponent);

                    // Increment by badge by 1
                    me.fireEvent('container_rightPane_incrementBadge', 'abp-notifications');
                }
                // break here
                return false;
            }
        });
        vm.set('notifications', notifications);
    },

    // Mark array of notifications as unread
    __markNotificationsUnread: function (newNotifications) {
        var me = this;

        Ext.Array.each(newNotifications, function (newNotification) {
            // Mark it as read
            me.__markNotificationUnread(me.__getNotificationComponentForRecord({ uniqueId: newNotification.uniqueId }));
        });
    },


    // Helper utility
    __getNotificationComponentForRecord: function (notification) {
        var me = this,
            notificationContainer = me.lookupReference('notificationContainer')

        return notificationContainer.down('abp-notification[notificationUniqueId="' + notification.uniqueId + '"]');
    },

    __flagNotification: function (notificationComponent) {
        var me = this,
            vm = me.getViewModel(),
            view = me.getView(),
            record = notificationComponent.getNotificationRecord(),
            notifications = vm.get('notifications'),
            sourcePanel = view.down('panel[sourcePanelName="sourcepanel-' + record.source + '"]');

        // First, update the main list of notifications
        Ext.Array.each(notifications, function (notification) {
            if (notification.uniqueId === record.uniqueId) {
                notification.flagged = true;
                // break here
                return false;
            }
        });
        vm.set('notifications', notifications);

        sourcePanel.getViewModel().incrementFlaggedNotificationCount();
    },

    __unflagNotification: function (notificationComponent) {
        var me = this,
            vm = me.getViewModel(),
            view = me.getView(),
            record = notificationComponent.getNotificationRecord(),
            notifications = vm.get('notifications'),
            sourcePanel = view.down('panel[sourcePanelName="sourcepanel-' + record.source + '"]');

        // First, update the main list of notifications
        Ext.Array.each(notifications, function (notification) {
            if (notification.uniqueId === record.uniqueId) {
                notification.flagged = false;
                // break here
                return false;
            }
        });
        vm.set('notifications', notifications);

        sourcePanel.getViewModel().decrementFlaggedNotificationCount();
    },

    __removeNotification: function (notificationComponent) {
        var me = this,
            record = notificationComponent.getNotificationRecord();

        // Use same method to remove as the global event
        me.__removeNotifications([record]);
    },

    privates: {
        handleHeaderClick: function(cmp, e){
            if (e.target && e.target.matches('.abp-notification-panel-flag')){
                var vm = this.lookupViewModel();
                vm.set('showFlaggedOnly', !vm.data.showFlaggedOnly);
            }
            //Modern Events
            else if (e.matches('.abp-notification-panel-flag')){
                var vm = this.getViewModel();
                vm.set('showFlaggedOnly', !vm.data.showFlaggedOnly);
            }
        },

        handleNavKeyDown: function(evt, cmp){
            var me = this
            evt.stopEvent();
            var categoryNavs = Ext.ComponentQuery.query('#notificationCategoryNavComponent');
            if(categoryNavs && categoryNavs.length > 0){
                categoryNavs[0].focus();
            }
        }
    }
});
