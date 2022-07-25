Ext.define("ABPControlSet.mixin.TextDisplay", {
    override: "ABPControlSet.base.mixin.TextDisplay",
    // Add/override methods for classic toolkit specific logic.

    requires: [
        "ABPControlSet.util.Markdown"
    ],

    // No required for text display.
    updateRequired: Ext.emptyFn,

    updateMarkupType: function (value) {
        var textValue = this.getValue();

        if (value === "markdown") {
            this.setHtml(ABPControlSet.util.Markdown.parseMarkdown(textValue));
            this.addCls('abp-markdown');
        } else {
            this.setHtml(textValue);
            this.removeCls('abp-markdown');
        }
    }

});
