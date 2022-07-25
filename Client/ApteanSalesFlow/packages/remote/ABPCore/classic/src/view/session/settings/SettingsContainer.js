Ext.define('ABP.view.session.settings.SettingsContainer', {
    requires: [
        'ABP.view.session.settings.SettingsContainerModel',
        'ABP.view.session.settings.SettingsContainerController',
        'Ext.Img',
        'Ext.layout.container.Table'
    ],
    extend: 'ABP.view.base.rightpane.RightPanePanel',
    alias: 'widget.settingscontainer',
    controller: 'settingscontainer',
    viewModel: {
        type: 'settingscontainer'
    },
    cls: 'settings-container',
    ui: 'lightgrey',
    height: '100%',
    scrollable: 'vertical',
    layout: {
        type: 'vbox',
        pack: 'start',
        align: 'left'
    },
    bind: {
        title: '{i18n.sessionMenu_settings}'
    },
    defaults: {
        xtype: 'button',
        width: '100%',
        cls: 'settings-container-button',
        ui: 'menuitem',
        uiCls: 'light',
        textAlign: 'left',
        toggleGroup: 'settingsGroup',
        height: 40
    },

    dockedItems: [{
        xtype: 'toolbar',
        dock: 'bottom',
        padding: '10 10 10 15',
        cls: 'settings-container-session-labels',
        ui: 'lightgrey',
        layout: {
            type: "vbox",
            align: "stretch"
        },
        items: [{
            xtype: 'label',
            bind: {
                hidden: '{!showEnv || !showEnvironment}',
                text: '{i18n.sessionMenu_environment}' + ' {environmentName}'
            }
        }, {
            xtype: 'label',
            reference: 'sessionTimeLabel',
            bind: {
                hidden: '{!showSessionTimer}',
                text: '{i18n.sessionMenu_time}' + ' {loggedInTime}'
            }
        }]
    }],
    applyFocus: function () {
        var items = this.items.items;
        var itemsLength = items.length;
        var i = 0;
        for (i; i < itemsLength; ++i) {
            if (items[i] && items[i].canFocus && items[i].canFocus()) {
                var task = new Ext.util.DelayedTask(function(){
                    ABP.util.Keyboard.focus('#' + items[i].id);
                });
                task.delay(50);
                break;
            }
        }
    }, 
    removeFocus: function(){
        var items = this.query('button');
        var itemsLength = items.length;
        var i = 0;
        for (i; i < itemsLength; ++i) {
            if (items[i] && items[i].setPressed) {
                items[i].setPressed(false);
            }
        }
    }
});
