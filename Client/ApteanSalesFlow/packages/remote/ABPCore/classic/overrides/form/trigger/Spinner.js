Ext.define('ABP.overrides.form.trigger.Spinner', {
    override: 'Ext.form.trigger.Spinner',

    bodyTpl: '<tpl if="vertical">' +
        '<div class="{spinnerCls} {spinnerCls}-{ui} {spinnerUpCls} {spinnerUpCls}-{ui}' +
        ' {childElCls} {upDisabledCls} {spinnerUpAutoCls}"></div>' + '</tpl>' +
        '<div class="{spinnerCls} {spinnerCls}-{ui} {spinnerDownCls} {spinnerDownCls}-{ui}' +
        ' {childElCls} {downDisabledCls} {spinnerDownAutoCls}"></div>' +
        '<tpl if="!vertical">' +
        '<div class="{spinnerCls} {spinnerCls}-{ui} {spinnerUpCls} {spinnerUpCls}-{ui}' +
        ' {childElCls} {upDisabledCls}"></div>' + '</tpl>',

    getBodyRenderData: function () {
        var me = this;

        return {
            vertical: me.vertical,
            upDisabledCls: me.upEnabled ? '' : (me.spinnerUpCls + '-disabled'),
            downDisabledCls: me.downEnabled ? '' : (me.spinnerDownCls + '-disabled'),
            spinnerCls: me.spinnerCls,
            spinnerUpCls: me.spinnerUpCls,
            spinnerDownCls: me.spinnerDownCls,
            spinnerUpAutoCls: ABP.util.Common.getAutomationClass(me) + '-spinner-up',
            spinnerDownAutoCls: ABP.util.Common.getAutomationClass(me) + '-spinner-down',
        };
    },
})