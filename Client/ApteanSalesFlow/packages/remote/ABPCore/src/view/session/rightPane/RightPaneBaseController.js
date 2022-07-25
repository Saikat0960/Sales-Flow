Ext.define('ABP.view.session.rightPane.RightPaneBaseController', {
    extend: 'Ext.app.ViewController',

    listen: {
        controller: {
            '*': {
                rightPane_addElement: 'addElement',
                rightPane_toggle: 'togglePane',
                rightPane_toggleTab: 'toggleTab',
                rightPane_initTab: '__initTab',
                rightPane_handleKeyPress: 'handleKeyPress',
                session_click: '__handleSessionClick',
            }
        }
    },

    togglePane: function () {
        this.fireEvent('session_toggleRightPane');
    },

    addElement: function (pane) {
        var me = this;
        var view = me.getView();
        var viewModel = me.getViewModel();

        if (viewModel.get('rightPaneOpen') === false) {
            me.togglePane();
        }
        var activeTab = view.getActiveTab();
        if (Ext.isString(pane)) {
            pane = { xtype: pane };
        }
        if (pane) {
            activeTab.add(pane);
        }
    },

    /**
    * Checks click event target location
    * then conditionally closes the right pane

    * If user clicks...
    *   outside of the main menu,
    *   outside of the main menu toolbar button,
    *   outside of the right pane,
    *   outside of the right pane toolbar button
    * close the main menu
    *
    * @param {Object} e the click event
    */
    __handleSessionClick: function (e) {
        var me = this;
        var view = me.getView();
        var sessionCanvas = view.up();

        var sessionCanvasVM = sessionCanvas.getViewModel();
        var isExpanded = sessionCanvasVM.get('rightPaneOpen');

        var mainMenu = sessionCanvas.down('#mainMenu').el.dom;
        var mainMenuClicked = e.target == mainMenu || mainMenu.contains(e.target);

        var rightPane = sessionCanvas.down('#rightPane').el.dom;
        var rightPaneClicked = e.target == rightPane || rightPane.contains(e.target);

        var settingsButton = sessionCanvas.down('#rpButton').el.dom;
        var settingsButtonClicked = e.target == settingsButton || settingsButton.contains(e.target);

        var menuButton = sessionCanvas.down('#toolbar-button-menu');
        var menuButtonEl;
        if (menuButton) {
            menuButtonEl = menuButton.el.dom;
        }
        var menuButtonClicked = e.target == menuButtonEl || menuButtonEl.contains(e.target);

        if (!mainMenuClicked && !rightPaneClicked && !settingsButtonClicked && !menuButtonClicked && isExpanded) {
            me.fireEvent('session_closeRightPane');
        }
    },

    // toggleTab() found in classic/modern specific extension

    // __initTab() found in classic/modern specific extension

    __createTab: function (config, tabItemId) {
        var ariaLabel = null;
        var ret = {
            itemId: tabItemId,
            title: config.title,
            titleKey: config.titleKey,
            unqiueId: config.uniqueId,
            layout: 'fit',
            scrollable: 'vertical',
            items: [{
                xtype: config.xtype
            }]
        };
        if (config.tooltipKey) {
            ret.bind = {
                'ariaLabel': '{i18n.' + config.tooltipKey + ':htmlEncode}'
            }
        } else if (config.tooltip) {
            ret.ariaLabel = config.tooltip;
        }
        return ret;
    },

    // Retrieve the config object for the specified tab.
    __getPanelConfig: function (panelItemId) {
        var me = this;
        var view = me.getView();
        var viewModel = view.getViewModel();
        var rightPaneTabs = viewModel.get('rightPaneTabs');
        var config = {};
        var i;

        for (i = 0; i < rightPaneTabs.length; i++) {
            if (rightPaneTabs[i].uniqueId === panelItemId) {
                config = rightPaneTabs[i];
                break;
            }
        }
        return config;
    }
});
