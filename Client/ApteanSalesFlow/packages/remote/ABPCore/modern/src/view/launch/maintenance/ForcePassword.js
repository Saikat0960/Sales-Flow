Ext.define('ABP.view.launch.maintenance.ForcePassword', {
    extend: 'Ext.Container',
    alias: 'widget.forcepassword',
    requires: [
        'ABP.view.launch.maintenance.ForcePasswordController',
        'ABP.view.launch.maintenance.ForcePasswordModel'
    ],
    controller: 'forcepassword',
    viewmodel: {
        type: 'forcepassword'
    },
    layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'start'
    },
    defaults: {
        labelAlign: 'top'
    },
    cls: 'maintenance-modern main-content-wrapper',
    height: '100%',
    items: [{
        xtype: 'container',
        cls: 'main-content',
        items: [{
            xtype: 'component',
            cls: 'settings-title',
            bind: {
                html: '{i18n.login_forcepw_title:htmlEncode}'
            }
        }, {
            xtype: 'component',
            itemId: 'forcepwGuide',
            cls: 'settings-text x-unselectable',
            bind: {
                html: '{i18n.login_forcepw_instructions:>htmlEncode}'
            }
        }, {
            xtype: 'textfield',
            inputType: 'password',
            bind: {
                value: '{newPassword}',
                label: '{i18n.login_forcepw_newPassword:htmlEncode}'
            },
            itemId: 'newPassword',
            cls: 'x-unselectable login-required-field a-forcechange-newpassword login-form'
        }, {
            xtype: 'textfield',
            inputType: 'password',
            bind: {
                value: '{confirmPassword}',
                label: '{i18n.login_forcepw_confirmPassword:htmlEncode}'
            },
            itemId: 'confirmPassword',
            cls: 'x-unselectable login-required-field a-forcechange-confirmpassword login-form'
        }]
    }, {
        xtype: 'container',
        cls: 'main-content-footer buttons',
        items: [{
            xtype: 'button',
            itemId: 'forceBackButton',
            cls: 'btn-login a-forcechange-back login-form',
            handler: 'backButtonClick',
            bind: {
                text: '{i18n.login_forcepw_back:htmlEncode}'
            },
            width: '49%'
        }, {
            xtype: 'button',
            itemId: 'forceSignInButton',
            cls: 'btn-login a-forcechange-signin login-form',
            handler: 'signInButtonClick',
            bind: {
                text: '{i18n.login_forcepw_signIn:htmlEncode}'
            },
            width: '49%'
        }]
    }]
});
