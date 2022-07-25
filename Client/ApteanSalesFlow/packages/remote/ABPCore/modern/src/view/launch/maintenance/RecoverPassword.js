Ext.define('ABP.view.launch.maintenance.RecoverPassword', {
    extend: 'Ext.Container',
    alias: 'widget.recoverpassword',
    requires: [
        'ABP.view.launch.maintenance.RecoverPasswordController',
        'ABP.view.launch.maintenance.RecoverPasswordModel'
    ],
    controller: 'recoverpassword',
    viewmodel: {
        type: 'recoverpassword'
    },
    cls: 'maintenance-modern main-content-wrapper',
    height: '100%',
    items: [{
        xtype: 'container',
        cls: 'main-content',
        defaults: {
            labelAlign: 'top'
        },
        items: [{
            xtype: 'component',
            cls: 'settings-title',
            bind: {
                html: '{i18n.login_recoverTitle:htmlEncode}'
            }
        }, {
            xtype: 'component',
            itemId: 'settingsGuide',
            cls: 'settings-text x-unselectable',
            bind: {
                html: '{i18n.login_recoverInstructions:htmlEncode}'
            }
        }, {
            xtype: 'textfield',
            bind: {
                value: '{recover_id}',
                label: '{i18n.login_recover_id:htmlEncode}'
            },
            itemId: 'recUrl',
            reference: 'recoverPasswordId',
            cls: 'x-unselectable login-form login-required-field a-recoverpw-userid',
            listeners: {
                specialkey: function (f, e) {
                    if (e.getKey() === e.ENTER) {
                        this.up().down('#saveButton').fireEvent("click");
                    }
                }
            }
        }, {
            xtype: 'selectfield',
            itemId: 'rec-environment-combo',
            bind: {
                store: '{main_environmentStore}',
                value: '{environment}',
                selection: '{env_selection}',
                label: '{i18n.login_environment:htmlEncode}'
            },
            queryMode: 'local',
            labelWidth: 0,
            cls: 'login-form launch-combo-box login-required-field a-recoverpw-environment',
            editable: false,
            forceSelection: true,
            autoSelect: true,
            displayField: 'name',
            valueField: 'id',
            listeners: {
                change: function (me, newVal) {
                    me.fireEvent('login_environmentChanged', newVal);
                },
                scope: this
            }
        }]
    },
    {
        xtype: 'container',
        cls: 'main-content-footer buttons',
        items: [{
            xtype: 'button',
            itemId: 'recBackButton',
            cls: 'btn-login a-recoverpw-back login-form',
            handler: 'backButtonClick',
            bind: {
                text: '{i18n.login_recover_back:htmlEncode}'
            },
            width: '49%'
        }, {
            xtype: 'button',
            itemId: 'recSendButton',
            cls: 'btn-login a-recoverpw-send login-form',
            handler: 'sendButtonClick',
            bind: {
                text: '{i18n.login_recover_send:htmlEncode}'
            },
            width: '49%'
        }]
    }]
});
