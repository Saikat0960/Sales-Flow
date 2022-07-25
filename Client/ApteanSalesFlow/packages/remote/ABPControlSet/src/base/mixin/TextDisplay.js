/**
 * @private
 *  Base text display mixin.
 */
Ext.define("ABPControlSet.base.mixin.TextDisplay", {
    extend: "ABPControlSet.base.mixin.Field",

    config: {
        /**
         * @cfg {String} markupType
         *
         * A string determining the markupType.
         * Options are "pre" and "markdown".
         * "pre" is the default.
         */
        markupType: null
    }

});
