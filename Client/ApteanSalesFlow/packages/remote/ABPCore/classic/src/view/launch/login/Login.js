Ext.define('ABP.view.launch.login.Login', {
    extend: 'Ext.panel.Panel',
    requires: [
        'ABP.view.launch.login.LoginController',
        'ABP.view.launch.login.LoginModel'
    ],
    alias: 'widget.login',
    controller: "logincontroller",
    viewModel: {
        type: "loginmodel"
    },
    scrollable: {
        y: true,
        x: false
    },
    flex: 1,
    listeners: {
        scope: 'controller',
        boxready: 'onBoxready',
        tabchanged: 'onTabChanged'
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
        items: [{
            width: '100%',
            itemId: 'username',
            reference: 'usernameField',
            allowBlank: false,
            bind: {
                value: '{username}',
                disabled: '{preauthenticated}',
                fieldLabel: '{i18n.login_username:htmlEncode}',
                hidden: '{!showUsernameField}',
            },
            tabIndex: 1,
            listeners: {
                specialkey: function (f, e) {
                    if (e.getKey() === e.ENTER) {
                        f.fireEvent('login_UserHit');
                    }
                },
                scope: this
            },
            automationCls: 'login-username',
            spellcheck: false,
            inputAttrTpl: [
                'autocapitalize="off" automationId="loginUsername"'
            ]
        }, {
            width: '100%',
            itemId: 'password',
            reference: 'passwordField',
            inputType: 'password',
            tabIndex: 2,
            allowBlank: false,
            bind: {
                value: '{password}',
                hidden: '{!showPasswordField}',
                fieldLabel: '{passwordText:htmlEncode}'
            },
            automationCls: 'login-password',
            inputAttrTpl: [
                'automationId="loginPassword"'
            ],
            listeners: {
                specialkey: function (f, e) {
                    if (e.getKey() === e.ENTER) {
                        f.blur();
                        f.fireEvent('login_PassHit');
                    }
                },
                scope: this
            },
            focusable: true
        }, {
            xtype: 'combo',
            width: '100%',
            itemId: 'login-environment',
            listConfig: {
                cls: 'abp-login-combo a-environment-options a-combo-' + Ext.os.deviceType
            },
            bind: {
                store: '{main_environmentStore}',
                value: '{environment}',
                selection: '{env_selection}',
                fieldLabel: '{i18n.login_environment:htmlEncode}',
                hidden: '{hideEnvironment}'
            },
            triggerAction: 'all',
            cls: 'launch-combo-box top-combo-box a-environment-combo',
            queryMode: 'local',
            editable: false,
            forceSelection: true,
            displayField: 'name',
            valueField: 'id',
            tabIndex: 3,
            autoSelect: true,
            focusable: true,
            listeners: {
                change: function (me, newVal) {
                    me.fireEvent('login_environmentChanged', newVal);
                },
                scope: this
            },
            shadow: 'sides'
        }, {
            xtype: 'combo',
            width: '100%',
            itemId: 'login-language',
            bind: {
                store: '{login_settingsStore}',
                selection: '{lan_selection}',
                fieldLabel: '{i18n.login_language:htmlEncode}',
                value: '{language}',
                hidden: '{hideLanguage}'
            },
            listConfig: {
                cls: 'abp-login-combo a-language-options a-combo-' + Ext.os.deviceType
            },
            triggerAction: 'all',
            cls: 'launch-combo-box a-language-combo',
            queryMode: 'local',
            editable: false,
            forceSelection: true,
            displayField: 'name',
            valueField: 'key',
            tabIndex: 4,
            autoSelect: true,
            visible: false
        }, {
            xtype: 'container',
            width: '100%',
            layout: 'vbox',
            itemId: 'loginExtraFieldCont',
            items: [],
            bind: {
                items: '{extraLoginFields}'
            },
            setItems: function (newItems) {
                Ext.suspendLayouts();
                this.removeAll();
                this.add(newItems);
                Ext.resumeLayouts(true);
            }
        }]
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
        items: [{
            xtype: 'button',
            itemId: 'loginButton',
            width: '100%',
            bind: {
                text: '{loginBtnText:htmlEncode}'
            },
            cls: 'btn-login a-login-button',
            flex: 1,
            tabIndex: 5,
            height: 40,
            frame: false,
            handler: 'loginButtonClick',
            focusable: true
        }, {
            xtype: 'button',
            cls: 'login-keepme a-keepme-button',
            itemId: 'loginKeepMe',
            bind: {
                text: '{i18n.login_keepMeSignedIn:htmlEncode}',
                iconCls: '{keepMeSignedInIcon}',
                hidden: '{!canKeepMeSignedIn}'
            },
            handler: 'keepMeSignedInClicked',
            tabIndex: 6
        }, {
            xtype: 'button',
            cls: 'login-forgotpassword a-forgot-password',
            itemId: 'forgotpassword-label',
            bind: {
                html: '{i18n.login_forgotpassword:htmlEncode}',
                visible: '{canRecoverPassword}',
                focusable: '{canRecoverPassword}'
            },
            tabIndex: 7,
            frame: false,
            textAlign: 'center',
            listeners: {
                click: 'onForgotPasswordClick'
            },
            setFocusable: function (setVal) {
                this.focusable = setVal;
            }
        }, {
            xtype: 'button',
            itemId: 'settingsButton',
            cls: 'login-settings a-login-settings',
            iconCls: 'icon-gearwheel',
            tabIndex: 8,
            frame: false,
            ariaLabel: 'settings',
            handler: 'onSettingsClick',
            focusable: true,
            bind: {
                visible: '{allowServiceChange}'
            }
        }]
    }]
});
