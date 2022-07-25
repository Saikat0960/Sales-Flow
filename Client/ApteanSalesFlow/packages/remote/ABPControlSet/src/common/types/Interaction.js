/**
 * Interaction helper config file.
 * The properties supplied to an interaction config can be anything accepted to the component which will be created.
 * If the interaction is a panel or buttongroup, any of those configuration can be added as well.
 * If the interaction is desired to be a button/tool, any button of tool configs can be added.
 *
 * Interactions carry the parent view model of the form. So any data supplied into the forms view model can be used as binding configuration for the interactions.
 *
 * By default interactions are always added into the right pane, in order to stop them from being added here, rightPane config must be set to false.
 *
 * In order to have interactions be added into either the header of the form (classic/tablets) or the thumbbar the headerPriority or thumbbarPriority MUST be set on these items. This priority integer is also used to sort the order in which they are shown.
 * For the thumbbar, only the top 4 items will be shown since it is limited to only contain 4 items.
 */
Ext.define('ABPControlSet.common.types.Interaction', {
    /**
     * @cfg {ABPControlSet.common.types.Interaction[]} items
     * An interaction can have an items array which contain its children. When items are supplied, it is assumed that this is a panel type component, and is defaulted as such.
     * When in the header in classic, the xtype is defaults to buttongroup. When in the rightpane, it is defaulted to a panel.
     */
    items: null,

    /**
     * @cfg {ABPControlSet.common.types.Interaction[]} fields
     * An interaction can have a fields array which contain its field children. When items are supplied, it is assumed that this is a panel type component, and is defaulted as such.
     * Supply a placement config property which can be 'top', 'bottom', 'left', 'right'
     *
     * Only valid for header and right pane groups.
     * An expected header group with a fields array will only put the first item in the fields array which is expected to be placed on the bottom. This is due to space constraints.
     */
    fields: null,

    /**
     * @cfg {String} dock
     * The placement desired; 'top', 'bottom', 'left', 'right'
     */
    placement: null,

    /**
     * @cfg {Boolean} rightPane
     * An interaction can have an items array which contain its children. When items are supplied, it is assumed that this is a panel type component, and is defaulted as such.
     * When in the header in classic, the xtype is defaults to buttongroup. When in the rightpane, it is defaulted to a panel.
     */
    rightPane: true,

    /**
     * @cfg {String} rightPaneTitle
     * When added to the right pane, if this item is a panel, this is the title to be used, else title is used.
     */
    rightPaneTitle: null,

    /**
     * @cfg {String} title
     * When added either to the right pane or the header, this is the title to be used.
     */
    title: null,

    /**
     * @cfg {String} text
     * The text of the tool or button. The text is removed when being added as a thumbar item.
     */
    text: null,

    /**
     * @cfg {Integer} headerPriority
     * If set to an integer, it will be shown in the header. It is also the priority in which to display the items in the header
     */
    headerPriority: null,

    /**
     * @cfg {Integer} thumbbarPriority
     * If set to an integer, it will be shown in the thumbbar (phones). It is also the priority in which to display the items in the thumbbar.
     * Only the top 4 are shown.
     */
    thumbbarPriority: null,

    /**
     * @cfg {Object} bind
     * A bind configuration which can be used to help manipulate the items via the data of the form's view model.
     */
    bind: null,

    /**
     * @cfg {Object/Function/String} handler
     * The desired way to handle the interaction from the user.
     * For buttons, this will be executed when the button is clicked by the user.
     * For fields, this will be executed when the user changes the fields value. Must be an ABP Control Set field or subclass.
     *
     * Object = { fn: function () { }, scope: scope }
     * Function = function () { }.
     * String = the name of the function on the form's view controller to execute.
     */
    handler: null
});