Ext.define('ABP.view.session.SessionCanvas', {
    extend: 'Ext.Container',
    alias: 'widget.sessioncanvas',
    requires: [
        'ABP.view.session.SessionBanner',
        'ABP.view.session.SessionCanvasController',
        'ABP.view.session.SessionCanvasModel',
        'ABP.view.session.feature.FeatureCanvas',
        'ABP.view.session.rightPane.RightPane',
        'ABP.view.session.mainMenu.MainMenu',
        'ABP.view.session.settings.SettingsContainer',
        'ABP.view.session.searchPane.SearchPane'
    ],
    controller: 'sessioncanvascontroller',
    viewModel: {
        type: 'sessioncanvasmodel'
    },
    layout: 'vbox',
    items: [
        {
            xtype: 'sessionbanner',
            ariaAttributes: {
                'aria-label': 'Headline Message'
            },
            docked: 'top'
        },
        {
            xtype: 'toolbartop'
        },
        {
            xtype: 'mainmenu'
        },
        {
            xtype: 'featurecanvas'
        },
        {
            xtype: 'rightpanecanvas'
        }
    ],

    openMenu: function () {
        var me = this;
        var menu = me.down('#mainMenu');
        var disabled = ABP.util.Config.getSessionConfig().settings.disableNavMenu;
        var menuButton = me.down('#toolbar-button-menu');
        if (menu && !disabled) {
            menu.show();
            if (menuButton) {
                menuButton.addCls('toolbar-toggled');
            }
        }
    },
    closeMenu: function () {
        var me = this;
        var menu = me.down('#mainMenu');
        var disabled = ABP.util.Config.getSessionConfig().settings.disableNavMenu;
        var menuButton = me.down('#toolbar-button-menu');
        if (menu && !disabled) {
            menu.hide();
            if (menuButton) {
                menuButton.removeCls('toolbar-toggled');
            }
            me.setMasked(false);
        }
    }
});
