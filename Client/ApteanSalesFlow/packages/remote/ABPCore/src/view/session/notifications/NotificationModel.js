Ext.define('ABP.view.session.notifications.NotificationModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.abp-notification',

    data: {
        notificationTime: undefined,

        label: undefined,
        labelTemplate: undefined,
        labelArgs: undefined,

        detail: undefined,
        detailTemplate: undefined,
        detailArgs: undefined
    },

    formulas: {
        notificationLabel: function (get) {
            var label = get('label'),
                labelTemplate = get('labelTemplate'),
                labelArgs = get('labelArgs'),
                tempArguments = [];

            if (labelTemplate && labelTemplate.trim().length > 0) {
                tempArguments.push(labelTemplate);
                return Ext.String.format.apply(this, tempArguments.concat(labelArgs)); // convert arguments to parameters
            } else {
                return label;
            }
        },
        notificationDetail: function (get) {
            var detail = get('detail'),
                detailTemplate = get('detailTemplate'),
                detailArgs = get('detailArgs'),
                tempArguments = [];

            if (detailTemplate && detailTemplate.trim().length > 0) {
                tempArguments.push(detailTemplate);
                return Ext.String.format.apply(this, tempArguments.concat(detailArgs)); // convert arguments to parameters
            } else {
                return detail;
            }
        },
        notificationListOrder: function(get) {
            var index = get('currentNavIndex') + 1;
            var unread = get('unreadNotificationCount');
            var history = get('historyNotificationCount');
            var total = get('displayHistory') ? unread + history : unread;
            return index + ' of ' + total;
        },
        notificationAdditionalAriaDetail: function(get){
            var isFlagged = this.getView().config.notificationRecord.flagged;
            var additionalLabel = ' updated ' + get('notificationTime');
            if(isFlagged){
                additionalLabel += ' notification flagged use F to unflag right and left arrows to navigate available tools ';
            }else{
                additionalLabel += ' use F to flag notification right and left arrows to navigate available tools ';
            }
            return additionalLabel;
        }
    }
});
