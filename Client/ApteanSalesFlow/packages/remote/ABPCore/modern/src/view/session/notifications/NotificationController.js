/*
    Notification Controller (Modern)
*/
Ext.define('ABP.view.session.notifications.NotificationController', {
    extend: 'ABP.view.session.notifications.NotificationBaseController',

    requires: [
        'Ext.Anim'
    ],

    alias: 'controller.abp-notification',

    __checkBtnPressed: function (btn) {
        return btn.isPressed();
    },

    __setActiveCardItem: function (newContainer, newActiveItem) {
        var me = this,
            notificationDisplayContainer = me.lookupReference('notificationDisplayContainer');

        notificationDisplayContainer.setHidden(true);

        newContainer.setHidden(false);
    },

    __animateFade: function (container, afterAnimateFunc) {
        Ext.Anim.run(container, 'fade', {
            duration: 1000,
            after: afterAnimateFunc
        });
    }
});
