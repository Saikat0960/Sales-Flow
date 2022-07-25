Ext.define('ABP.view.launch.maintenance.ForcePassword', {
    extend: 'Ext.panel.Panel',
    requires: [
        'Ext.panel.Panel',
        'Ext.form.field.ComboBox',
        'ABP.view.launch.maintenance.ForcePasswordController',
        'ABP.view.launch.maintenance.ForcePasswordModel'
    ],
    alias: 'widget.forcepassword',
    defaultType: 'textfield',

    controller: 'forcepassword',
    viewModel: {
        type: 'forcepassword'
    },

    tabIndex: -1,
    cls: 'main-content-wrapper',
    items: [{
        xtype: 'container',
        cls: 'main-content',
        layout: {
            type: 'vbox',
            align: 'middle',
            pack: 'start'
        },
        defaults: {
            labelAlign: 'top',
        },
        height: '100%',
        width: '100%',
        items: [{
            xtype: 'component',
            cls: 'settings-title',
            width: '100%',
            bind: {
                html: '{i18n.login_forcepw_title:htmlEncode}'
            },
            tabIndex: -1
        },
        {
            xtype: 'component',
            itemId: 'forcepwGuide',
            width: '100%',
            componentCls: 'settings-text x-unselectable',
            bind: {
                html: '{i18n.login_forcepw_instructions:htmlEncode}'
            },
            tabIndex: -1
        },
        {
            xtype: 'textfield',
            align: 'middle',
            width: '100%',
            bind: {
                value: '{newPassword}',
                fieldLabel: '{i18n.login_forcepw_newPassword:htmlEncode}'
            },
            inputType: 'password',
            itemId: 'newPassword',
            labelWidth: 0,
            value: "",
            cls: 'x-unselectable login-required-field a-forcechange-newpassword',
            tabIndex: 1
        },
        {
            xtype: 'textfield',
            align: 'middle',
            width: '100%',
            bind: {
                value: '{confirmPassword}',
                fieldLabel: '{i18n.login_forcepw_confirmPassword:htmlEncode}'
            },
            inputType: 'password',
            itemId: 'confirmPassword',
            labelWidth: 0,
            value: "",
            cls: 'x-unselectable login-required-field a-forcechange-confirmpassword',
            tabIndex: 2,
            listeners: {
                specialkey: function (f, e) {
                    if (e.getKey() === e.ENTER) {
                        f.blur();
                        f.fireEvent('forcepw_Signin');
                    }
                }
            }
        }]
    }, {
        xtype: 'container',
        cls: 'main-content-footer buttons',
        items: [{
            xtype: 'button',
            itemId: 'forceBackButton',
            componentCls: 'btn-login a-forcechange-back',
            width: '49%',
            handler: 'backButtonClick',
            bind: {
                text: '{i18n.login_forcepw_back:htmlEncode}'
            }
        }, {
            xtype: 'button',
            itemId: 'forceSignInButton',
            componentCls: 'btn-login a-forcechange-signin',
            handler: 'signInButtonClick',
            width: '49%',
            bind: {
                text: '{i18n.login_forcepw_signIn:htmlEncode}'
            }
        }]
    }]

});
