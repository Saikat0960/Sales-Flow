/*
    Prompt for user password.
*/
Ext.define('ABP.view.session.offline.PasswordPrompt', {
    extend: 'Ext.Panel',
    requires: [
        'ABP.view.session.offline.PasswordPromptController'
    ],
    alias: 'widget.passwordprompt',
    controller: 'passwordprompt',
    viewModel: {
        type: 'abp-passwordprompt'
    },
    layout: {
        type: 'vbox',
        align: 'center',
        pack: 'center'
    },
    bind: {
        title: '{i18n.offline_promptpassword_title:htmlEncode}'
    },
    floated: true,
    centered: true,
    modal: true,
    width: 300,
    minHeight: 200,
    shadow: false,

    items: [{
        xtype: 'textfield',
        width: 250,
        itemId: 'password',
        inputType: 'password',
        labelAlign: 'top',
        bind: {
            label: '{passwordLabel:htmlEncode}'
        },
    }],

    bbar: {
        items: [{
            border: false,
            text: 'cancel',
            bind: {
                text: '{cancelBtnlabel:htmlEncode}'
            },
            width: 100,
            handler: 'onCancelClicked'
        }, {
            border: false,
            text: 'ok',
            bind: {
                text: '{okBtnLabel:htmlEncode}'
            },
            width: 100,
            handler: 'onOkClicked'
        }]
    }
});
