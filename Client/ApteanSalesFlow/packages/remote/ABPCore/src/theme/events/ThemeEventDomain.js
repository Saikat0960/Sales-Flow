/**
 * This class implements the global theme event domain. This domain represents events fired from
 * {@link Ext.ABPThemeEvents} Observable instance. No selectors are supported for this domain.
 *
 * @private
 */
Ext.define('ABP.events.ThemeEventDomain', {
    extend: 'Ext.app.EventDomain',
    requires: ['Ext.ABPThemeEvents'],
    singleton: true,

    type: 'theme',

    constructor: function () {
        var me = this;

        me.callParent();
        me.monitor(Ext.ABPThemeEvents);
    },

    /**
     * This method adds listeners on behalf of a controller. Since ABP Theme domain does not
     * support selectors, we skip this layer and just accept an object keyed by events.
     * For example:
     *
     *      domain.listen({
     *          themeChanged: function() { ... },
     *      });
     *
     * @param {Object} listeners Config object containing listeners.
     * @param {Object} controller A controller to force execution scope on
     *
     * @private
     */
    listen: function (listeners, controller) {
        this.callParent([{ global: listeners }, controller]);
    },

    match: Ext.returnTrue
});