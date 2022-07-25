Ext.define('ABP.view.launch.discovery.Discovery', {
    extend: 'Ext.form.Panel',
    requires: [
        'ABP.view.launch.discovery.DiscoveryController',
        'ABP.view.launch.discovery.DiscoveryModel'
    ],
    alias: 'widget.discovery',
    controller: 'discoverycontroller',
    viewModel: {
        type: 'discoverymodel'
    },
    cls: 'login-fields main-content-wrapper',
    scrollable: 'vertical',
    items: [
        {
            xtype: 'container',
            cls: 'main-content',
            defaults: {
                labelAlign: 'top'
            },
            items: [
                {
                    type: 'component',
                    margin: '0 0 20 0',
                    bind: {
                        html: '{i18n.login_SSOHelp:htmlEncode}'
                    }
                },
                // User email
                {
                    xtype: 'abptext',
                    itemId: 'email',
                    reference: 'emailField',
                    disabledCls: 'preauth-disabled',
                    tabIndex: 1,
                    clearable: false,
                    allowBlank: 'false',
                    automationCls: 'login-email',
                    cls: 'x-unselectable login-form',
                    bind: {
                        value: '{email}',
                        label: '{i18n.login_emailOrOrganisation:htmlEncode}'
                    }
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
            defaults: {
                labelAlign: 'top'
            },
            items: [
                {
                    xtype: 'button',
                    tabIndex: 3,
                    cls: 'btn-login login-form a-login-button',
                    itemId: 'loginButton',
                    bind: {
                        text: '{i18n.login_signin_btn:htmlEncode}'
                    },
                    handler: 'loginButtonClick'
                }
            ]
        }
    ]
});
