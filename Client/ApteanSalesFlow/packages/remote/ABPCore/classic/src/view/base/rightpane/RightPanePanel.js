/**
 * The base component to extend to create right pane content.  Will force the close button
 * but allow custom content from extending this component.
 */
Ext.define('ABP.view.base.rightpane.RightPanePanel', {
    extend: 'Ext.panel.Panel',

    alias: 'widget.baserightpanepanel',

    cls: 'abp-right-panel',

    header: {
        title: {
            ariaRole: 'header',
            ariaAttributes: {
                'aria-level': '3'
            },
        }
    },

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

    initComponent: function () {
        var me = this;

        var closeTooltip = ABP.util.Common.geti18nString('button_close');
        me.tools = (me.tools || []).concat([{
            type: 'close',
            automationCls: 'rightpanel-btn-close',
            handler: 'baseRightPanePanel_toggleRightPane',
            tooltip: closeTooltip
        }]);

        this.callParent();
    },

    /**
     * Add a scroll shadow under the panels header
     */
    showScrollShadow: function () {
        this.addCls('abp-scrolled');
    },

    /**
     * Remove the scroll shadow from under the panels header
     */
    hideScrollShadow: function () {
        this.removeCls('abp-scrolled');
    }

});
