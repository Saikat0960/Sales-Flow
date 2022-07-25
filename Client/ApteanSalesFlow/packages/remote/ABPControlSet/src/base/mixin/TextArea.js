/**
 * @private
 *  Base text area mixin.
 */
Ext.define("ABPControlSet.base.mixin.TextArea", {
    extend: "ABPControlSet.base.mixin.Field",

    config: {
        /**
         * @cfg {Boolean} spellcheck
         *
         * Whether or not the text area uses the browser spellcheck and/or autocorrect.
         * Defaults to false.
         */
        spellcheck: false
    }
});