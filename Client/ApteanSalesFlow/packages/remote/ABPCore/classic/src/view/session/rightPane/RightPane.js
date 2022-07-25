Ext.define('ABP.view.session.rightPane.RightPane', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.rightpanecanvas',
    itemId: 'rightPane',
    requires: [
        'ABP.view.session.rightPane.RightPaneController',
        'ABP.view.session.rightPane.RightPaneModel'
    ],
    controller: 'rightpanecontroller',
    viewModel: {
        type: 'rightpanemodel'
    },
    width: 250,
    height: '100%',
    scrollable: 'vertical',
    cls: 'rightpane',
    autoEl: 'aside',

    closeAction: 'hide',
    border: true,
    focusable: true,
    tabIndex: 0,

    tools: [],
    items: [],
    listeners: {
        hide: function (tab) {
            if (tab && tab.getActiveTab()) {
                var buttonId = tab.getActiveTab().itemId.substring(tab.getActiveTab().itemId.indexOf('_') + 1);
                var button = tab.up('sessioncanvas').down('#' + buttonId);
                if (button) {
                    button.el.set({ 'aria-expanded': false });
                }
            }
            this.removeFocus();
        }
    },
    /**
     * Escape key should be a default global -close- (hide) key for right panel when right panel has a focused element.
     */
    keyMap: {
        scope: 'this',
        ESC: function () {
            var buttonId = this.getActiveTab().itemId.substring(this.getActiveTab().itemId.indexOf('_') + 1);
            Ext.ComponentQuery.query('#' + buttonId)[0].focus();

            this.getController().fireEvent('rightPane_toggle');
        }
    },

    initComponent: function () {
        var me = this;
        me.callParent();
        if (me.tabBar) {
            me.tabBar.hide();
        }
    },

    applyFocus: function (tab) {
        var panel;
        if (tab) {
            panel = tab.down();
        } else {
            var activeTab = this.getActiveTab();
            if (activeTab) {
                // actual object should be the first child
                panel = activeTab.down();
            }
        }
        if (panel && panel.applyFocus) {
            panel.applyFocus();
        }
    },
    removeFocus: function () {
        var panel = this.getActiveTab();
        if (panel) {
            var container = panel.down('container');
            if (container && container.removeFocus) {
                container.removeFocus();
            }
        }
    }
});
