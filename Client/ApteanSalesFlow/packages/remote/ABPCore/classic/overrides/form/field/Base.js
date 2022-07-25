/**
 * @private
 * @ignore
 * Base field override - Include "anchorName" to the template data.
 */
Ext.define('ABP.form.field.Base', {
    override: 'Ext.form.field.Base',

    getSubTplData: function (fieldData) {
        var me = this,
            data = me.callParent(arguments),
            anchorName = ABP.util.Common.getAutomationClass(me); // OVERRIDE: Compose the anchor tag.

        Ext.apply(data, {
            anchorName: anchorName // OVERRIDE: Include "anchorName" to the template data.
        });

        return data;
    },
});
