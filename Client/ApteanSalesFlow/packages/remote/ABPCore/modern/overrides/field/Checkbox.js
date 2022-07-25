Ext.define('ABP.field.Checkbox', {
    override: 'Ext.field.Checkbox',
    getBoxTemplate: function () {
        return [{
            reference: 'iconElement',
            cls: Ext.baseCSSPrefix + 'font-icon ' + Ext.baseCSSPrefix + 'icon-el ' + ABP.util.Common.getAutomationClass(this),
            children: [this.getInputTemplate()]
        }];
    },
    getSameGroupFields: function () {
        return this.callParent(arguments) || [];
    }
});