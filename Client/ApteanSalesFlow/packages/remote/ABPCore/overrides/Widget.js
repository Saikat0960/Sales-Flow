Ext.define('ABP.Widget', {
    override: 'Ext.Widget',
    constructor: function () {
        var me = this;
        var eventsToAutomate = [
            'onClick',
            'onChange'
        ];
        this.callParent(arguments);
        if ((Ext.isFunction(this.toggleCls) && eventsToAutomate.some(function (element) {
            return this[element];
        }.bind(me))) || Boolean(this.automationCls)) {
            this.toggleCls(ABP.util.Common.getAutomationClass(this), true);
        }
    }
});