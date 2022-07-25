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
Ext.define('ABP.events.ThemeEvents', {
    extend: 'Ext.mixin.Observable',
    alternateClassName: 'Ext.ABPThemeEvents', // for compat with Ext JS 4.2 and earlier

    requires: [
        'Ext.dom.Element'
    ],

    observableType: 'theme',

    singleton: true,

    /**
     * @private
     */
    resizeBuffer: 100,

    /**
     * @event changed
     * Fires when the ABP theme is changed
     * @param {String} themeName the name of the new theme to apply
     */

    constructor: function () {
        var me = this;

        me.callParent();
    }

}, function (ABPThemeEvents) {
    ABPTheme = typeof ABPTheme == "undefined" ? {} : ABPTheme;

    /**
     * @member Ext
     * @method on
     * Shorthand for {@link Ext.ABPThemeEvents#addListener}.
     * @inheritdoc Ext.mixin.Observable#addListener
     */
    ABPTheme.on = function () {
        return ABPThemeEvents.addListener.apply(ABPThemeEvents, arguments);
    };

    /**
     * @member Ext
     * @method un
     * Shorthand for {@link Ext.ABPThemeEvents#removeListener}.
     * @inheritdoc Ext.mixin.Observable#removeListener
     */
    ABPTheme.un = function () {
        return ABPThemeEvents.removeListener.apply(ABPThemeEvents, arguments);
    };

    /**
     * @member Ext
     * @method fireEvent
     * Shorthand for {@link Ext.ABPThemeEvents#fireEvent}.
     * @inheritdoc Ext.mixin.Observable#fireEvent
     *
     * @since 6.2.0
     */
    ABPTheme.fireEvent = function () {
        return ABPThemeEvents.fireEvent.apply(ABPThemeEvents, arguments);
    };
});