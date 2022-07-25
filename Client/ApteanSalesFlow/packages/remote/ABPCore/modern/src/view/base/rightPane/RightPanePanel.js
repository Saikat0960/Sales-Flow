/**
 * The base component to extend to create right pane content.  Will force the close button
 * but allow custom content from extending this component.
 */
Ext.define('ABP.view.base.rightpane.RightPanePanel', {
    extend: 'Ext.Panel',

    alias: 'widget.baserightpanepanel',

    /**
     * Scroll by default
     */
    scrollable: 'vertical',

    /**
     * We need to ensure that the child components can recieve the focus
     */
    focusableContainer: true,

    /**
     * The currently expanded / active menu button. null if nothing is expanded
     */
    activeMenuButton: null,

    initialize: function () {
        var me = this;

        me.setTools((me.config.tools || []).concat([{
            type: 'close',
            automationCls: 'rightpanel-btn-close',
            handler: 'baseRightPanePanel_toggleRightPane'
        }]));

        this.callParent();
    }
});
