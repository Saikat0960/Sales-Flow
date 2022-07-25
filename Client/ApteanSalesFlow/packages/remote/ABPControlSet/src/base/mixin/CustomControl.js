/**
 * @private
 *  Base custom control mixin.
 */
Ext.define('ABPControlSet.base.mixin.CustomControl', {
    extend: 'ABPControlSet.base.mixin.Component',

    /** @private  */
    beginEmbed: function () {
        var me = this,
            hidden = me.getHidden(),
            embeddedEl = me.embeddedEl;

        if (hidden) {
            me.on({
                show: me.beginEmbed,
                single: true,
                scope: this,
                priority: 999
            });
            return;
        }
        if (embeddedEl) {
            // Hook up the destroy event handler to destroy the extra references.
            me.on("destroy", me.destroyEmbedded);

            // Call the hook method.
            me.embed(me.embeddedEl);
        }
    },

    /**
     * @template
     * This method can be overriden by subclasses. This is executed once the element is ready for embedding.
     *
     * @param {Ext.dom.Element} embeddedEl The inner element which can be used for embedding.
     */
    embed: Ext.emptyFn,

    /**
     * @property {Ext.dom.Element}
     * The element which can be embedded into.
     */
    embeddedEl: null,

    /** @private  */
    destroyEmbedded: function () {
        // Remove the reference property.
        delete this.embeddedEl;
    }
});