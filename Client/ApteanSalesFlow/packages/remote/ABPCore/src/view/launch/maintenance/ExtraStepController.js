/*
    Controller for ExtraStep (Additional Maintenance Screen for a custom 2 step Login)

    Will handle the clicking of the buttons we provide back & login/continue/ok
*/
Ext.define('ABP.view.launch.settings.ExtraStepController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.extrastepcontroller',

    backButtonClick: function () {
        this.fireEvent('launchCarousel_Login', this);
    },

    continueButtonClick: function () {
        var me = this;
        var view = me.getView();
        var inner = view.down('#ABPExtraStepCustomContainer');
        var ret;
        if (inner) {
            inner = inner.down();
            if (inner && inner.getController() && inner.getController().getSaveData) {
                ret = inner.getController().getSaveData();
                if (ret) {
                    me.fireEvent('main_secondAuthStep', ret, view.config.additionalInfo.path);
                }
            }
        }

    }
});