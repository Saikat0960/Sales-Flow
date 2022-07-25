Ext.define('ABP.view.session.rightPane.RightPaneController', {
    extend: 'ABP.view.session.rightPane.RightPaneBaseController',
    alias: 'controller.rightpanecontroller',

    // Force creates the tab which initializes the panel's xtype.
    __initTab: function (uniqueId, tabConfig) {
        var me = this,
            view = me.getView(),
            viewModel = view.getViewModel(),
            tabPrefix = viewModel.get('tabPrefix');

        if (!tabConfig) {
            tabConfig = me.__getPanelConfig(uniqueId);
        }
        if (uniqueId.indexOf(tabPrefix) !== 0) {
            uniqueId = tabPrefix + uniqueId;
        }
        var newTab = me.__createTab(tabConfig, uniqueId);
        view.add(newTab);
    },

    //We want to open or focus the panel on down key
    handleKeyPress: function(event, button){
        var me = this,
            view = me.getView(),
            viewModel = view.getViewModel(),
            tabItemId, tab, activeTab,
            panelConfig = button.panelConfig,
            tabPrefix = viewModel.get('tabPrefix'),
            rightPaneOpen = viewModel.get('rightPaneOpen');
        switch(event.keyCode){
            case 40: //Down Arrow
                activeTab = view.getActiveTab();
                tabItemId = panelConfig.uniqueId;

                if (tabItemId.indexOf(tabPrefix) !== 0) {
                    tabItemId = tabPrefix + tabItemId;
                }
                if(!rightPaneOpen || (rightPaneOpen && tabItemId != activeTab.itemId)){
                    me.toggleTab(button.panelConfig, true);
                } else {
                    me.applyFocus(activeTab);
                }
                break;
        }
    },
    toggleTab: function (panelConfig, open, focus) {
        var me = this,
            view = me.getView(),
            viewModel = view.getViewModel(),
            tabItemId, tab, activeTab,
            tabPrefix = viewModel.get('tabPrefix'),
            rightPaneOpen = viewModel.get('rightPaneOpen');

        if (!rightPaneOpen && open === false) {
            // The right pane is clsoed and the request is to close the pane, do nothing.
            return;
        }

        if (Ext.isString(panelConfig)) {
            tabItemId = panelConfig;
            panelConfig = me.__getPanelConfig(panelConfig);
            if (!panelConfig.uniqueId) {
                ABP.util.Logger.logWarn(Ext.String.format('No configuration exists for tab "{0}".', tabItemId));
                return;
            }
        }
        tabItemId = panelConfig.uniqueId;

        if (tabItemId.indexOf(tabPrefix) !== 0) {
            tabItemId = tabPrefix + tabItemId;
        }

        tab = view.down('#' + tabItemId);

        // if the tab does not exist create it first.
        if (!tab) {
            view.add(me.__createTab(panelConfig, tabItemId));
        }

        activeTab = view.getActiveTab();
        //set aria collapsed for previous button
        if(activeTab){
            var buttonId = activeTab.itemId.substring(activeTab.itemId.indexOf('_') + 1);
            var button = Ext.ComponentQuery.query('#' + buttonId)[0];
            button.el.set({'aria-expanded' : false});
        }
        // If the right pane was closed, open it.
        if (rightPaneOpen === false && open !== false) {
            me.togglePane();
            // Force visibility on the button as well.
            me.fireEvent('toolbar_setVisibilityRightPaneButton', panelConfig.uniqueId, true);
        }
        // If the pane was open and the tab is the same, close it.
        else if (rightPaneOpen === true && activeTab.itemId === tabItemId && open !== true) {
            // The same tab was clicked again - close the panel.
            me.togglePane();
            return;
        }
        // Explicit request to close a tab that is no longer active - do nothing.
        else if (rightPaneOpen === true && activeTab.itemId !== tabItemId && open === false) {
            return;
        }

        // Set the new active tab
        var tab = view.setActiveTab(tabItemId);
        if (focus) {
            var task = new Ext.util.DelayedTask(function(){
                ABP.util.Keyboard.focus('#' + tab.id + ' .x-panel-body .x-component [tabindex]');
            });
            task.delay(200);
        }

        //Set aria expanded for related button.
        var buttonId = tab.itemId.substring(tab.itemId.indexOf('_') + 1);
        var button = Ext.ComponentQuery.query('#' + buttonId)[0];
        button.el.set({'aria-expanded' : true});

        if (panelConfig.clearBadgeOnActivate) {
            me.fireEvent('toolbar_clearBadge', panelConfig.uniqueId);
        }
        me.fireEvent('toolbar_addPressedCls', panelConfig.uniqueId);
    },
    applyFocus: function(activeTab){
        var tab = activeTab.down();
        if(tab && tab.applyFocus){
            tab.applyFocus();
        } else if(activeTab) {
            var task = new Ext.util.DelayedTask(function(){
                ABP.util.Keyboard.focus('#' + activeTab.id + ' .x-panel-body .x-component [tabindex]');
            });
            task.delay(200);
        }
    }
});
