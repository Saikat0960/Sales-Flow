
/**
 * ABPControlSet label.
 */
Ext.define('ABPControlSet.view.form.Label', {
    extend: 'Ext.Label',

    xtype: 'abplabel',

    labelSeparator: '',

    constructor: function (config) {
        config = config || {};
        config.cls = config.cls || "";
        config.cls += ' ' + Ext.baseCSSPrefix + 'form-item-label ' + Ext.baseCSSPrefix + 'form-item-label-default ' + Ext.baseCSSPrefix + 'form-item-label-right ' + Ext.baseCSSPrefix + 'form-item-label-inner ' + Ext.baseCSSPrefix + 'form-item-label-text';

        this.callParent([config]);
    },

    /**
     * Returns the trimmed label by slicing off the label separator character. Can be overridden.
     * @return {String} The trimmed field label, or empty string if not defined
     */
    trimLabelSeparator: function () {
        var me = this,
            separator = me.labelSeparator,
            label = me.text || '',
            lastChar = label.substr(label.length - 1);

        // if the last char is the same as the label separator then slice it off otherwise just return label value
        return lastChar === separator ? label.slice(0, -1) : label;
    },

    getElConfig: function () {
        var me = this,
            text = me.text,
            separator = me.labelSeparator;

        if (!Ext.isEmpty(separator)) {
            text = me.trimLabelSeparator() + separator;
        }
        me.html = text ? Ext.util.Format.htmlEncode(text) : (me.html || '');

        return Ext.apply(me.superclass.superclass.getElConfig.apply(this), {
            htmlFor: me.forId || ''
        });
    },

    setText: function (text, encode) {
        var me = this,
            separator = me.labelSeparator;

        me.text = text;
        // Always encode.
        encode = true;

        if (!Ext.isEmpty(separator)) {
            text = me.trimLabelSeparator() + separator;
        }
        me.setHtml(text);
    }
});
