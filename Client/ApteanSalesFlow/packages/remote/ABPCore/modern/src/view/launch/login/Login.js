Ext.define('ABP.view.launch.login.Login', {
    extend: 'Ext.form.Panel',
    requires: [
        'ABP.view.launch.login.LoginController',
        'ABP.view.launch.login.LoginModel'
    ],
    alias: 'widget.login',
    controller: 'logincontroller',
    viewModel: {
        type: 'loginmodel'
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
            items: [{
                xtype: 'abptext',
                itemId: 'username',
                reference: 'usernameField',
                disabledCls: 'preauth-disabled',
                clearable: false,
                allowBlank: 'false',
                tabIndex: 1,
                automationCls: 'login-username',
                cls: 'x-unselectable login-form',
                bind: {
                    value: '{username}',
                    //placeholder: '{i18n.login_username}',
                    disabled: '{preauthenticated}',
                    label: '{i18n.login_username:htmlEncode}',
                    hidden: '{!showUsernameField}'
                },
                listeners: {
                    action: function (t, e, eOpts) {
                        t.fireEvent('login_UserHit');
                    },
                    scope: this
                }
            }, {
                xtype: 'abptext',
                itemId: 'password',
                reference: 'passwordField',
                disabledCls: 'preauth-disabled',
                clearable: false,
                tabIndex: 2,
                allowBlank: 'false',
                inputType: 'password',
                automationCls: 'login-password',
                cls: 'x-unselectable login-form',
                bind: {
                    value: '{password}',
                    //placeholder: '{i18n.login_password}',
                    hidden: '{!showPasswordField}',
                    label: '{passwordText:htmlEncode}'
                },
                listeners: {
                    action: function (t, e, eOpts) {
                        t.fireEvent('login_PassHit');
                    },
                    scope: this
                }
            }, {
                xtype: 'selectfield',
                itemId: 'login-environment',
                tabIndex: 3,
                cls: 'login-form launch-combo-box a-environment-combo',
                bind: {
                    store: '{main_environmentStore}',
                    value: '{environment}',
                    selection: '{env_selection}',
                    label: '{i18n.login_environment:htmlEncode}',
                    hidden: '{hideEnvironment}'
                },
                queryMode: 'local',
                clearable: false,
                labelWidth: 0,
                editable: false,
                forceSelection: true,
                displayField: 'name',
                valueField: 'id',
                listeners: {
                    change: function (me, newVal) {
                        me.fireEvent('login_environmentChanged', newVal);
                    },
                    scope: this
                }
            }, {
                xtype: 'selectfield',
                itemId: 'login-language',
                tabIndex: 4,
                bind: {
                    store: '{login_settingsStore}',
                    value: '{language}',
                    selection: '{lan_selection}',
                    label: '{i18n.login_language:htmlEncode}',
                    hidden: '{hideLanguage}'
                },
                queryMode: 'local',
                clearable: false,
                cls: 'login-form launch-combo-box a-language-combo',
                displayField: 'name',
                valueField: 'key',
                labelWidth: 0,
                editable: false
            }, {
                xtype: 'container',
                layout: 'vbox',
                itemId: 'loginExtraFieldCont',
                bind: {
                    items: '{extraLoginFields}'
                }
            }]
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
                    tabIndex: 5,
                    cls: 'btn-login login-form a-login-button',
                    itemId: 'loginButton',
                    bind: {
                        text: '{loginBtnText:htmlEncode}'
                    },
                    handler: 'loginButtonClick'
                }, {
                    xtype: 'button',
                    tabIndex: 6,
                    cls: 'login-keepme a-keepme-button',
                    itemId: 'loginKeepMe',
                    bind: {
                        text: '{i18n.login_keepMeSignedIn:htmlEncode}',
                        iconCls: '{keepMeSignedInIcon}',
                        hidden: '{!canKeepMeSignedIn}'
                    },
                    handler: 'keepMeSignedInClicked'
                }, {
                    xtype: 'button',
                    tabIndex: 7,
                    cls: 'login-forgotpassword login-form a-forgot-button',
                    itemId: 'loginForgot',
                    hidden: true,
                    bind: {
                        text: '{i18n.login_forgotpassword:htmlEncode}',
                        hidden: '{!canRecoverPassword}'
                    },
                    handler: 'onForgotPasswordClick'
                }, {
                    xtype: 'button',
                    tabIndex: 8,
                    cls: 'btn-settings login-form a-login-settings',
                    itemId: 'settingsButton',
                    iconCls: 'icon-gearwheel',
                    handler: 'onSettingsClick',
                    bind: {
                        hidden: '{!allowServiceChange}'
                    }
                }]
        }
    ],
    listeners: {
        initialize: 'checkForSignoutReason'
    }
});
