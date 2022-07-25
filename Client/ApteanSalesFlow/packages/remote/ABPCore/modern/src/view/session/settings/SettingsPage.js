Ext.define('ABP.view.session.settings.SettingsPage', {
    extend: 'Ext.Panel',
    alias: 'widget.settingspage',
    requires: [
        'ABP.view.session.settings.SettingsPageController',
        'ABP.view.session.settings.SettingsPageModel'
    ],
    controller: 'settingspage',
    viewModel: {
        type: 'settingspage'
    },

    layout: { type: 'vbox', align: 'stretch' },
    cls: 'x-unselectable settings-container',
    height: '100%',
    width: '100%',
    scrollable: 'y',

    items: [

    ]
});
