/**
 * ABPControlSet text display component.
 */
Ext.define("ABPControlSet.view.field.Display", {
    extend: "Ext.field.Display",
    xtype: "abptextdisplay",
    classCls: 'abp-textdisplay',
    requires: [
        "ABPControlSet.base.mixin.TextDisplay",
        "ABPControlSet.util.Markdown"
    ],

    mixins: [
        "ABPControlSet.base.mixin.TextDisplay"
    ],

    // No required for text display.
    updateRequired: Ext.emptyFn,

    constructor: function (config) {
        config = config || {};

        this.mixins.abpcomponent.constructor.call(this, config);
        this.callParent([config]);
    },

    updateValue: function (newValue, oldValue) {
        // TODO: look at getDisplayValue abd syncDom functions of the Ext.field.Display and integrate markdown parsing with that in mind.
        var markupType = this.getMarkupType();
        if (markupType === "markdown" && newValue && newValue.length) {
            if (this.usage === 'address') {
                newValue = this.getAddressMarkdownValue(newValue, oldValue);
            }
            this.setHtml(ABPControlSet.util.Markdown.parseMarkdown(newValue));
        } else {
            this.callParent([newValue, oldValue]);
        }
    },

    getAddressMarkdownValue: function (newValue, oldValue) {
        // An address is formatted as a bold first line, and normal other lines.
        // Wrap that in markdown link syntax so a click will go to a map provider.

        // Convert basic address text with newlines into a Markdown formatted string.
        var urlFriendlyAddr = encodeURIComponent(newValue.replace(/\n/g, ','));
        var addrLines = newValue.split('\n'); // Get all the lines.

        // Bold first address line.
        var formattedAddr = '[**' + (('-' + addrLines[0]).trim()).substr(1) + "**"; // Just trim whitespace from right.
        var lines = addrLines.length;
        for (var i = 1; i < lines; i++) {
            // Add rest of the lines.
            formattedAddr += '  \n' + (('-' + addrLines[i]).trim()).substr(1);
        }
        // Close off with the link specification.
        formattedAddr += '](' + Ext.String.format(ABPControlSet.common.Constants.MAP_URL_FORMAT_STRING, urlFriendlyAddr) + ')';

        return formattedAddr;
    }
});
