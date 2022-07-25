/**
* Copyright © Aptean
*/
Ext.define("ABP.view.BoundList", {
    override: "Ext.view.BoundList",

    /**
     * Allow tpl to be generated programmatically to respond to changes in displayField
     * @private
     */
    generateTpl: function () {
        var me = this,
            displayField = me.displayField,
            valueField = me.pickerField ? me.pickerField.valueField : displayField,
            anchorCls = ABP.util.Common.getAutomationClass(me.pickerField || me) + "-picker"; // If there is no picker field (standalone bound lists), use the bound list for class configuration.

        /* Set the anchorCls. */
        me.toggleCls(anchorCls, true);

        me.tpl = new Ext.XTemplate(
            '<tpl for=".">',
            /* Add "&nbsp;" to end of each list item to ensure blank values are styled consistently. */
            '<li role="option" unselectable="on" class="' + me.itemCls + ' ',
            anchorCls + '-item-' + '{' + valueField + ':htmlEncode}', /* Use anchorCls-item-{value} for each item */
            '">' + me.getInnerTpl(displayField),
            '&nbsp;', /* Add "&nbsp;" to end of each list item to ensure blank values are styled consistently. */
            '</li>',
            '</tpl>'
        );
    },

    getInnerTpl: function (displayField) {
        /* Encode the value shown in the list item. */
        return '{' + displayField + ':htmlEncode}';
    }
});