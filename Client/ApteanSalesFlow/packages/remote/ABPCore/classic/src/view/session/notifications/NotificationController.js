/*
    Notification Controller (Classic)
*/
Ext.define('ABP.view.session.notifications.NotificationController', {
    extend: 'ABP.view.session.notifications.NotificationBaseController',

    alias: 'controller.abp-notification',

    handleNotificationKeyDown: function(evt, cmp){
        //Pass up or down arrow events to the category panel
        if(evt.keyCode === 40 || evt.keyCode === 38){
            evt.stopEvent();
            this.fireEvent('notificationCategory_handleKeyDown', evt, cmp, null, this.getView().category);           
        }
        if(evt.keyCode === 39){ //Right Arrow
            var me = this,
                vm = me.getViewModel();
            var buttons = this.getView().query('button');
            var buttonIdx = vm.get('currentBtnIdx');
            
            if(buttonIdx + 1 < buttons.length){
                vm.set('currentBtnIdx', buttonIdx + 1);
                buttons[buttonIdx + 1].focus();
            }
            evt.stopEvent();
        }
        if(evt.keyCode === 37){ //Left Arrow
            var me = this,
                vm = me.getViewModel();
            var buttons = this.getView().query('button');
            var buttonIdx = vm.get('currentBtnIdx');
            
            if(buttonIdx - 1 >= 0){
                vm.set('currentBtnIdx', buttonIdx - 1);
                buttons[buttonIdx - 1].focus();
            }
            evt.stopEvent();
        }
        if(evt.keyCode === 70){ // Letter 'f'
            this.lookupReference('notificationFlagButton').click();
            evt.stopEvent();
        }
        if(evt.keyCode === 32){ // Space Bar
            console.log('space bar');
            this.lookupReference('notificationLinkButton').click();
            evt.stopEvent();
        }
    },
    __checkBtnPressed: function (btn) {
        return btn.pressed;
    },

    __setActiveCardItem: function (newContainer, newActiveItem) {
        var me = this,
            view = me.getView();

        view.getLayout().setActiveItem(newActiveItem);
    },

    __animateFade: function (container, afterAnimateFunc) {
        container.animate({
            duration: 1000,
            to: {
                opacity: 0.25
            },
            listeners: {
                afteranimate: afterAnimateFunc
            }
        });
    }
});
