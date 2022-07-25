Ext.define('ABP.Component', {
    override: 'Ext.Component',
    constructor: function () {
        var me = this;
        var eventsToAutomate = [
            'onClick',
            'onChange'
        ];
        this.callParent(arguments);
        if ((Ext.isFunction(this.toggleCls) && eventsToAutomate.some(function (element) {
            return this[element] || Boolean(this.handler)
        }.bind(me))) || Boolean(this.automationCls)) {
            this.toggleCls(ABP.util.Common.getAutomationClass(this), true);
        }
    },
    setAriaLabel: function (label) {
        var me = this;
        if (me.rendered) {
            var dom = me.el.dom;
            if (label) {
                dom.setAttribute('aria-label', label);
            }
            else {
                dom.removeAttribute('aria-label');
            }

            // If no label is being shown, set the aria-label on the input element
            if (me.hideLabel && me.inputEl){
                me.inputEl.dom.setAttribute('aria-label', label);
            }
        }
    }
});