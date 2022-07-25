Ext.define("ABPControlSet.util.Markdown", {
    singleton: true,

    parseMarkdown: function (text) {

        this.initializeCustomMarked(); // Ensure marked has our custom rendering enabled.

        if (text && text.length) {
            marked.setOptions({
                sanitize: true
            });

            return marked(text);
        } else {
            return text;
        }
    },

    privates: {
        customRenderingInitialized: false,

        /**
         * @private
         * Initialize once the custom rendering we need.
         */
        initializeCustomMarked: function () {
            if (!this.customRenderingInitialized) {
                var renderer = new marked.Renderer();
                renderer.link = function (href, title, text) {
                    var link = marked.Renderer.prototype.link.call(this, href, title, text);
                    return link.replace("<a", "<a target='_blank' ");
                };
                marked.setOptions({
                    renderer: renderer
                });
                this.customRenderingInitialized = true;
            }
        },

    }

});
