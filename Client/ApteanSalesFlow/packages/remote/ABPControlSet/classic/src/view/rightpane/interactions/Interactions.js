/**
 * Interactions right pane panel.
 */
Ext.define('ABPControlSet.view.rightpane.interactions.Interactions', {
    extend: 'Ext.panel.Panel',
    requires: [
        'ABPControlSet.view.rightpane.interactions.InteractionsController'
    ],
    alias: 'widget.interactionspane',
    controller: 'interactionspane',
    /**
     * Scroll by default
     */
    scrollable: 'vertical',

    /**
     * We need to ensure that the child components can recieve the focus
     */
    focusableContainer: true,

    initComponent: function () {
        var me = this;

        me.tools = (me.tools || []).concat([{
            type: 'close',
            automationCls: 'rightpanel-btn-close',
            handler: 'baseRightPanePanel_toggleRightPane'
        }]);

        this.callParent();
    },
    title: 'Interactions',
    items: []
});