Ext.define('ABP.view.launch.maintenance.RecoverPassword', {
    extend: 'Ext.panel.Panel',
    requires: [
        'Ext.form.field.ComboBox',
        'ABP.view.launch.maintenance.RecoverPasswordController',
        'ABP.view.launch.maintenance.RecoverPasswordModel'
    ],
    alias: 'widget.recoverpassword',

    controller: 'recoverpassword',
    viewModel: {
        type: 'recoverpassword'
    },
    cls: 'main-content-wrapper',
    items: [{
        xtype: 'container',
        cls: 'main-content',
        defaults: {
            align: 'middle',
            labelAlign: 'top',
        },
        layout: {
            type: 'vbox',
            pack: 'start'
        },
        height: '100%',
        width: '100%',
        items: [{
            xtype: 'abpheadercomponent',
            width: '100%',
            cls: 'settings-title',
            bind: {
                html: '{i18n.login_recoverTitle:htmlEncode}'
            }
            //tabIndex: -1
        }, {
            xtype: 'component',
            width: '100%',
            itemId: 'settingsGuide',
            ariaRole: 'status',
            componentCls: 'settings-text x-unselectable',
            bind: {
                html: '{i18n.login_recoverInstructions:htmlEncode}'
            }
            //tabIndex: -1
        }, {
            xtype: 'textfield',
            align: 'middle',
            width: '100%',
            bind: {
                value: '{recover_id}',
                fieldLabel: '{i18n.login_recover_id:htmlEncode}'
            },
            itemId: 'recUrl',
            reference: 'recoverPasswordId',
            value: "",
            requiredCls: 'login-required-field',
            msgTarget: 'side',
            cls: 'x-unselectable a-recoverpw-userid',
            //tabIndex: 1,
            listeners: {
                specialkey: function (f, e) {
                    if (e.getKey() === e.ENTER) {
                        f.blur();
                        f.fireEvent('recoverpw_Send');
                    }
                }
            }
        }, {
            xtype: 'combo',
            itemId: 'rec-environment-combo',
            width: '100%',
            bind: {
                store: '{main_environmentStore}',
                value: '{environment}',
                selection: '{env_selection}',
                fieldLabel: '{i18n.login_environment:htmlEncode}'
            },
            triggerAction: 'all',
            requiredCls: 'login-required-field',
            cls: 'launch-combo-box top-combo-box a-recoverpw-environment',
            listConfig: {
                cls: 'abp-login-combo a-recoverpassword-options',
                shadow: false
            },
            queryMode: 'local',
            editable: false,
            forceSelection: true,
            displayField: 'name',
            valueField: 'id',
            autoSelect: true,
            focusable: true,
            listeners: {
                change: function (me, newVal) {
                    me.fireEvent('login_environmentChanged', newVal);
                },
                scope: this
            }
        }]
    }, {
        xtype: 'container',
        cls: 'main-content-footer buttons',
        items: [{
            xtype: 'button',
            reference: 'recBackButton',
            componentCls: 'btn-login a-recoverpw-back',
            handler: 'backButtonClick',
            width: '49%',
            bind: {
                text: '{i18n.login_recover_back:htmlEncode}'
            }
        }, {
            xtype: 'button',
            itemId: 'recSendButton',
            componentCls: 'btn-login a-recoverpw-send',
            handler: 'sendButtonClick',
            width: '49%',
            bind: {
                text: '{i18n.login_recover_send:htmlEncode}'
            }
        }]
    }],

    afterRender: function () {
        var me = this;
        var backButton = me.lookupReference('recBackButton');

        me.callParent();

        me.el.on({
            keydown: function (e) {
                if (e.keyCode === e.ESC) {
                    if (backButton.isVisible()) {
                        backButton.click();
                    }
                }
            }
        });
    }
});
