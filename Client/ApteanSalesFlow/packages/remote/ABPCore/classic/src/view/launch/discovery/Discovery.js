/**
 * Classic toolkit discovery landing card.
 */
Ext.define('ABP.view.launch.discovery.Discovery', {
    extend: 'Ext.panel.Panel',
    requires: [
        'ABP.view.launch.discovery.DiscoveryController',
        'ABP.view.launch.discovery.DiscoveryModel'
    ],
    alias: 'widget.discovery',
    controller: "discoverycontroller",
    viewModel: {
        type: "discoverymodel"
    },
    scrollable: {
        y: true,
        x: false
    },
    flex: 1,
    listeners: {
        scope: 'controller',
        boxready: 'onBoxready'
    },
    cls: 'main-content-wrapper',
    items: [{
        xtype: 'container',
        cls: 'main-content',
        width: '100%',
        layout: {
            type: 'vbox',
            align: 'middle',
            pack: 'start'
        },
        defaults: {
            labelAlign: 'top',
            msgTarget: 'none'
        },
        defaultType: 'abptext',
        items: [
            {
                type: 'component',
                margin: '0 0 20 0',
                bind: {
                    html: '{i18n.login_SSOHelp:htmlEncode}'
                }
            },
            // User Email or Organisation
            {
                width: '100%',
                itemId: 'email',
                reference: 'emailField',
                tabIndex: 1,
                bind: {
                    value: '{email}',
                    fieldLabel: '{i18n.login_emailOrOrganisation:htmlEncode}'
                },
                listeners: {
                    specialkey: 'handleSpecialKeys'
                },
                automationCls: 'login-email',
                allowBlank: false,
                spellcheck: false,
                focusable: true,
                inputAttrTpl: [
                    'autocapitalize="off" automationId="loginEmail"'
                ]
            },
            {
                xtype: 'label',
                itemId: 'errorText',
                padding: 4,
                bind: {
                    html: '{errorText}'
                }
            }
        ]
    },
    {
        xtype: 'container',
        cls: 'main-content-footer',
        width: '100%',
        layout: {
            type: 'vbox',
            align: 'middle',
            pack: 'start'
        },
        items: [
            {
                xtype: 'button',
                itemId: 'loginButton',
                width: '100%',
                bind: {
                    text: '{i18n.button_next:htmlEncode}'
                },
                cls: 'btn-login a-login-button',
                flex: 1,
                tabIndex: 5,
                height: 40,
                frame: false,
                handler: 'loginButtonClick',
                focusable: true
            }
        ]
    }]
});
