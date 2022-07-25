/*
    Notifications Controller (Modern)

    Modern-specific Controller as Setting Card Item differs
*/
Ext.define('ABP.view.session.notifications.NotificationsController', {
    extend: 'ABP.view.session.notifications.NotificationsBaseController',

    alias: 'controller.abp-notifications',

    __setActiveCardItem: function (newActiveItem) {
        var me = this,
            view = me.getView();

        view.setActiveItem(newActiveItem);
    },

    closeRightPane: function () {
        this.fireEvent('rightPane_toggle');
    }
});
