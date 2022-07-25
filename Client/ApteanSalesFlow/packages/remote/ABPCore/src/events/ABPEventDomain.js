/**
 * This class implements the global ABP event domain. This domain represents events fired from
 * {@link Ext.ABPEvents} Observable instance. No selectors are supported for this domain.
 *
 * The events raised within the ABP event domain are:
 * - tbcontroller_openTab
 * - tbcontroller_activateTab
 * - tbcontroller_removeTab
 * - favorites_updated
 * @private
 */
Ext.define('ABP.events.ABPEventDomain', {
    extend: 'Ext.app.EventDomain',
    requires: ['Ext.ABPEvents'],
    singleton: true,

    type: 'abp',

    constructor: function () {
        var me = this;

        me.callParent();
        me.monitor(Ext.ABPEvents);
    },

    /**
     * This method adds listeners on behalf of a controller. Since ABP domain does not
     * support selectors, we skip this layer and just accept an object keyed by events.
     * For example:
     *
     *      domain.listen({
     *          messagesLoaded: function() { ... },
     *          error: {
     *              fn: function() { ... }
     *          }
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