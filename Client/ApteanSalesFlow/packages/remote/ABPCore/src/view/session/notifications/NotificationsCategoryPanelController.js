/*
    Notifications Category Panel Controller

    Common Controller for both Classic and Modern
*/
Ext.define('ABP.view.session.notifications.NotificationsCategoryController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.abp-notifications-category-panel',
    listen: {
        controller: {
            '*': {
                notificationCategory_handleKeyDown: 'handleCategoryKeyDown'
            }
        }
    },

    addNotification: function(notificationRecord, isNew) {
        var me = this,
            vm = me.getViewModel(),
            addToContainer,
            notificationComponent;

        notificationComponent = {
            xtype: 'abp-notification',
            justAdded: isNew,
            componentCls: 'a-abp-notification-' + notificationRecord.uniqueId,
            notificationUniqueId: notificationRecord.uniqueId,
            notificationRecord: notificationRecord,
            listeners: {
                notificationMarkReadClick: 'onNotificationMarkReadClick'
            },
            bind: {
                filterFlagged: '{showFlaggedOnly}',
                category: '{categoryName}'
            }
        }

        if (notificationRecord.new) {
            vm.incrementUnreadNotificationCount();
            addToContainer = me.lookupReference('unreadNotificationContainer');
        } else {
            vm.incrementHistoryNotificationCount();
            addToContainer = me.lookupReference('historyNotificationContainer');
        }
        vm.notify();
        addToContainer.insert(0, notificationComponent);
    },

    removeNotification: function (notification) {
        var me = this,
            vm = me.getViewModel(),
            removeFromContainer;

        // Remove From Container
        if (notification.getNotificationRecord().new) {
            vm.decrementUnreadNotificationCount();
            removeFromContainer = me.lookupReference('unreadNotificationContainer');
        } else {
            vm.decrementHistoryNotificationCount();
            removeFromContainer = me.lookupReference('historyNotificationContainer');
        }

        removeFromContainer.remove(notification);
    },

    markNotificationRead: function (notification) {
        var me = this,
            notificationRecord = notification.getNotificationRecord();

        me.removeNotification(notification);

        notificationRecord.new = false;

        me.addNotification(notificationRecord);
    },

    markNotificationUnread: function (notification) {
        var me = this,
            notificationRecord = notification.getNotificationRecord();

        me.removeNotification(notification);

        notificationRecord.new = true;

        me.addNotification(notificationRecord);
    },

    onShowHistoryClick: function () {
        var me = this,
            vm = me.getViewModel();

        vm.set('displayHistory', true);
    },

    onHideHistoryClick: function () {
        var me = this,
            vm = me.getViewModel();

        vm.set('displayHistory', false);
    },

    handleCategoryKeyDown: function(evt, cmp, args, categoryName){
        if(categoryName && categoryName != this.getView().categoryName){
            evt.stopEvent();
            return;
        }

        var me = this,
            vm = me.getViewModel(),
            navIndex = vm.get('currentNavIndex'),
            historyShown = vm.get('displayHistory'),
            unread = vm.get('unreadNotificationCount'),
            history = vm.get('historyNotificationCount'),
            total = vm.get('displayHistory') ? unread + history : unread;
        if(evt.keyCode === 40 || evt.keyCode === 38){
            evt.stopEvent();
            if(evt.keyCode === 40){ //Down Arrow
                if(navIndex + 1 < total){
                    vm.set('currentNavIndex', navIndex + 1);
                    var unreadNotifications = me.lookupReference('unreadNotificationContainer').items.items;
                    if(historyShown){
                        var historyNotifications = me.lookupReference('historyNotificationContainer').items.items;
                        if(navIndex + 1 > unreadNotifications.length){
                            historyNotifications[navIndex + 1 - unreadNotifications.length].lookupReference('notificationSpecificNavComponent').focus();
                        }
                        evt.stopEvent();
                        return;
                    }
                    evt.stopEvent();
                    unreadNotifications[navIndex + 1].lookupReference('notificationSpecificNavComponent').focus();
                }else if(!categoryName && total > 0){
                    var unreadNotifications = me.lookupReference('unreadNotificationContainer').items.items;
                    if(historyShown){
                        var historyNotifications = me.lookupReference('historyNotificationContainer').items.items;
                        historyNotifications[navIndex - unreadNotifications.length].lookupReference('notificationSpecificNavComponent').focus();
                        evt.stopEvent();
                        return;
                    }
                    evt.stopEvent();
                    unreadNotifications[navIndex].lookupReference('notificationSpecificNavComponent').focus();                    
                }else{
                    var catPanels = this.getView().up().query('abp-notifications-category-panel');
                    var currIdx = catPanels.indexOf(this.getView());
                    if(currIdx + 1 < catPanels.length){
                        catPanels[currIdx + 1].lookupReference('notificationCategoryNavComponent').focus();
                    }
                    evt.stopEvent();
                }
            }
            if(evt.keyCode === 38){ //Up Arrow
                if(navIndex > 0){
                    vm.set('currentNavIndex', navIndex - 1);
                    var unreadNotifications = me.lookupReference('unreadNotificationContainer').items.items;
                    if(historyShown){
                        var historyNotifications = me.lookupReference('historyNotificationContainer').items;
                        historyNotifications[navIndex - 1 - unreadNotifications.length].lookupReference('notificationSpecificNavComponent').focus();
                        evt.stopEvent();
                        return;
                    }
                    evt.stopEvent();
                    unreadNotifications[navIndex - 1].lookupReference('notificationSpecificNavComponent').focus();
                    
                }else{
                    var catPanels = this.getView().up().query('abp-notifications-category-panel');
                    var currIdx = catPanels.indexOf(this.getView());
                    if(currIdx - 1 >= 0){
                        catPanels[currIdx - 1].lookupReference('notificationCategoryNavComponent').focus();
                    }
                    evt.stopEvent();
                }
            }
        }
    },
    onCategoryNavFocus: function(){
        var me = this,
            vm = me.getViewModel();
        vm.set('currentNavIndex', -1);
    }
});
