/**
 * An `{@link Ext.mixin.Observable Observable}` through which Ext fires global events.
 *
 * Ext.on() and Ext.un() are shorthand for {@link #addListener} and {@link #removeListener}
 * on this Observable.  For example, to listen for the idle event:
 *
 *     Ext.on('idle', function() {
 *         // do something
 *     });
 */
Ext.define('ABP.events.ABPEvents', {
    extend: 'Ext.mixin.Observable',
    alternateClassName: 'Ext.ABPEvents', // for compat with Ext JS 4.2 and earlier

    requires: [
        'Ext.dom.Element'
    ],

    observableType: 'abp',

    singleton: true,

    /**
     * @private
     */
    resizeBuffer: 100,

    /**
     * @event rightPaneToggled
     * Fires when the user toggles the right hand pane
     * @param {String} panelId the id of the panel being shown
     * @param {Boolean} visible Whether the panel is currently visible
     */

    /**
     * @event error
     * Fires when a a user un-follows a room
     * @param {Object} error the error info
     */

    constructor: function () {
        var me = this;

        me.callParent();
    },

    /*
     * ABP observable fireEvent method. 
     * Azure Application Insights event tracking method happens here. Tracking each ABP event fired through this.
     */
    fireEvent: function (name) {
        // App insights track event.
        if (typeof appInsights == 'object') {
            appInsights.trackEvent(name, arguments);
        }
        return this.callParent(arguments);
    }

}, function (ABPEvents) {
    /**
     * @member Ext
     * @method on
     * Shorthand for {@link Ext.ABPEvents#addListener}.
     * @inheritdoc Ext.mixin.Observable#addListener
     */
    ABP.on = function () {
        return ABPEvents.addListener.apply(ABPEvents, arguments);
    };

    /**
     * @member Ext
     * @method un
     * Shorthand for {@link Ext.ABPEvents#removeListener}.
     * @inheritdoc Ext.mixin.Observable#removeListener
     */
    ABP.un = function () {
        return ABPEvents.removeListener.apply(ABPEvents, arguments);
    };

    /**
     * @member Ext
     * @method fireEvent
     * Shorthand for {@link Ext.ABPEvents#fireEvent}.
     * @inheritdoc Ext.mixin.Observable#fireEvent
     *
     * @since 6.2.0
     */
    ABP.fireEvent = function () {
        return ABPEvents.fireEvent.apply(ABPEvents, arguments);
    };
});