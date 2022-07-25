/*
    Prompt for user password.
*/
Ext.define('ABP.view.session.offline.PasswordPrompt', {
    extend: 'Ext.panel.Panel',
    requires: [
        'ABP.view.session.offline.PasswordPromptController'
    ],
    alias: 'widget.passwordprompt',
    controller: 'passwordprompt',
    layout: {
        type: 'vbox',
        align: 'center',
        pack: 'center'
    },
    floating: true,
    cls: 'favoriteseditpanel',
    bodyCls: 'x-unselectable',
    floating: true,
    modal: true,
    bind: {
        title: '{i18n.offline_promptpassword_title:htmlEncode}'
    },
    width: 275,
    shadow: false,

    items: [{
        xtype: 'textfield',
        width: 250,
        allowBlank: false,
        itemId: 'password',
        inputType: 'password',
        labelAlign: 'top',
        bind: {
            fieldLabel: '{i18n.offline_password_prompt:htmlEncode}'
        },
        keyMap: {
            'ENTER': {
                handler: 'onOkClicked'
            }
        }
    }],

    bbar: {
        defaults: {
            border: false
        },
        items: ['->', {
            bind: {
                text: '{i18n.button_cancel:htmlEncode}'
            },
            automationCls: 'offline-passwordPrompt-cancel',
            width: 100,
            handler: 'onCancelClicked'
        }, {
                bind: {
                    text: '{i18n.button_OK:htmlEncode}'
                },
                automationCls: 'offline-passwordPrompt-ok',
                width: 100,
                handler: 'onOkClicked'
            }]
    }
});
