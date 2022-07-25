Ext.define("ABPControlSet.mixin.TextDisplay", {
    override: "ABPControlSet.base.mixin.TextDisplay",
    // Add/override methods for modern toolkit specific logic.

    requires: [
        "ABPControlSet.util.Markdown"
    ],

    updateMarkupType: function (value) {
        var innerHTML = this.getInnerHtmlElement();
        var textValue = this.getValue();

        if (value === "markdown") {
            this.setHtml(ABPControlSet.util.Markdown.parseMarkdown(textValue));
            this.inputElement.addCls("x-hidden-display");
            innerHTML.removeCls("x-hidden-display");
            this.addCls('abp-markdown');
        } else {
            this.inputElement.removeCls("x-hidden-display");
            innerHTML.addCls("x-hidden-display");
            this.removeCls('abp-markdown');
        }
    },

    /**
     * @private @ignore
     * Remove the special logic in ABPControlSet.mixin.Field that adds a readOnlyElement if the field is configured with a tag for read only.
     */
    onAfterRender: function () {
    },

});
