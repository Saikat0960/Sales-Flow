Ext.define('ABP.view.session.settings.SettingsContainer', {
    requires: [
        'ABP.view.session.settings.SettingsContainerModel',
        'ABP.view.session.settings.SettingsContainerController'
    ],
    extend: 'ABP.view.base.rightpane.RightPanePanel',
    alias: 'widget.settingscontainer',
    controller: 'settingscontainer',
    viewModel: {
        type: 'settingscontainer'
    },
    height: '100%',
    scrollable: 'vertical',
    layout: {
        type: 'vbox',
        pack: 'start',
        align: 'left'
    },
    ui: 'grey',

    // cls: 'rightpane-content',
    cls: 'settings-container',
    defaults: {
        xtype: 'button',
        width: '100%',
        border: false,
        menu: false,
        height: 40,
        ui: 'menuitem',
    },

    bind: {
        title: '{i18n.sessionMenu_settings}'
    },

    bbar: {
        layout: {
            type: 'hbox',
            pack: 'center',
            align: 'middle'
        },
        items: [{
            xtype: 'label',
            style: {
                fontWeight: 'normal'
            },
            bind: {
                hidden: '{!showEnv || !showEnvironment}',
                html: '{i18n.sessionMenu_environment}' + ' {environmentName}'
            }
        }, {
            xtype: 'label',
            reference: 'sessionTimeLabel',
            style: {
                fontWeight: 'normal'
            },
            bind: {
                hidden: '{!showSessionTimer}',
                html: '{i18n.sessionMenu_time}' + ' {loggedInTime}'
            }
        }]
    }
});
