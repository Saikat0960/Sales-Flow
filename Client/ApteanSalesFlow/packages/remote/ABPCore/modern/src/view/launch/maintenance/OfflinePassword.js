/**
 * Additional login screen - Set offline password.
 */
Ext.define('ABP.view.launch.maintenance.OfflinePassword', {
    extend: 'Ext.Container',
    requires: [
        'ABP.view.launch.settings.OfflinePasswordController'
    ],
    alias: 'widget.offlinepassword',
    controller: 'offlinepasswordcontroller',
    layout: {
        type: 'vbox',
        align: 'middle',
        pack: 'center'
    },
    cls: 'main-content-wrapper',

    items: [{
        xtype: 'container',
        cls: 'main-content',
        items: [{
            xtype: 'component',
            bind: {
                html: '{i18n.offline_login_instructions:htmlEncode}'
            }
        }, {
            xtype: 'textfield',
            labelAlign: 'top',
            reference: 'offlinepassword',
            inputType: 'password',
            allowBlank: false,
            tabIndex: 2,
            bind: {
                label: '{i18n.offline_login_password:htmlEncode}'
            },
            automationCls: 'offline-login-password',
            inputAttrTpl: [
                'automationId="offlineLoginPassword"'
            ],
            focusable: true
        }, {
            xtype: 'textfield',
            labelAlign: 'top',
            reference: 'confirmofflinepassword',
            inputType: 'password',
            allowBlank: false,
            tabIndex: 2,
            bind: {
                label: '{i18n.offline_login_confirmpassword:htmlEncode}'
            },
            automationCls: 'offline-login-confirmpassword',
            inputAttrTpl: [
                'automationId="confirmofflineLoginPassword"'
            ],
            listeners: {
                specialkey: function (f, e) {
                    if (e.getKey() === e.ENTER) {
                        f.fireEvent('savepassword');
                    }
                },
                scope: this
            },
            focusable: true
        }]
    }, {
        xtype: 'container',
        cls: 'main-content-footer buttons',
        items: [{
            xtype: 'button',
            reference: 'backButton',
            cls: 'btn-login a-extrastep-back',
            width: '49%',
            handler: 'cancelButtonClick',
            bind: {
                text: '{i18n.button_cancel:htmlEncode}'
            }
        },
        {
            xtype: 'button',
            reference: 'saveButton',
            width: '49%',
            cls: 'btn-login a-extrastep-save',
            handler: 'saveButtonClick',
            bind: {
                text: '{i18n.button_save:htmlEncode}'
            }
        }]
    }]
});
