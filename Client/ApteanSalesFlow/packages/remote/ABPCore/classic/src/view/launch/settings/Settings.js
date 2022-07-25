Ext.define('ABP.view.launch.settings.Settings', {
    extend: 'Ext.panel.Panel',
    requires: [
        'ABP.view.launch.settings.SettingsController',
        'ABP.view.launch.settings.SettingsModel',
        'ABP.view.base.popUp.PopUpFrame',
        'Ext.panel.Panel',
        'Ext.form.field.ComboBox'
    ],

    alias: 'widget.settings',

    controller: "settingscontroller",

    viewModel: {
        type: "settingsmodel"
    },

    defaultType: 'textfield',

    stores: ['SettingsLanguageStore'],
    models: ['SettingsLanguageModel'],

    //scrollable: 'vertical', // Needed so that many "extra settings" + server URLs can be shown.
    cls: 'main-content-wrapper',
    items: [{
        xtype: 'container',
        cls: 'main-content',
        layout: {
            type: 'vbox',
            align: 'middle'
        },
        height: '100%',
        width: '100%',
        items: [{
                xtype: 'abpheadercomponent',
                cls: 'settings-title',
                width: '100%',
                componentCls: 'x-unselectable',
                bind: {
                    html: '{i18n.login_settingsTitle:htmlEncode}'
                },
            },
            {
                xtype: 'component',
                itemId: 'settingsGuide',
                width: '100%',
                ariaRole: 'status',
                componentCls: 'settings-text x-unselectable',
                bind: {
                    html: '{i18n.login_settingsInstructions:htmlEncode}'
                },
            },
            {
                xtype: 'label',
                align: 'middle',
                width: '100%',
                itemId: 'settingsErrorLabel',
                cls: 'error-label error-label-hide',
                text: 'INVALID URL',
            }, {
                xtype: 'combo',
                width: '100%',
                labelAlign: 'top',
                itemId: 'url',
                bind: {
                    fieldLabel: '{i18n.login_url:htmlEncode}',
                    store: '{serverUrlStore}',
                },
                displayField: 'url',
                valueField: 'url',
                queryMode: 'local',
                listConfig: {
                    itemTpl: [
                        '<div class="server-url a-server-url" data-qtip="{url}">{url}</div>',
                        '<div class="delete-item" role="button" aria-label="Remove URL" title="Remove URL">',
                        '<span class="delete-item-icon icon-garbage-can"></span></div>',
                    ],
                    listeners: {
                        // childTap for Modern. itemclick for Classic.
                        itemclick: function (view, record, item, index, e, eOpts) {
                            if (Ext.isObject(e)) {
                                // Determine if delete was clicked
                                if (e.getTarget('.delete-item')) {
                                    view.fireEvent('delete_server_url', record);
                                    return false;
                                }
                            }
                            return true;
                        }
                        /* highlightitem: function (view, node, eOpts) {
                            // this is necessary to allow keydown events to occur
                            node.focus();
                        },
                        itemkeydown: function (view, record, item, index, e, eOpts) {
                            if (Ext.isObject(e)) {
                                // delete record if delete key pressed
                                if (e.getKeyName() == 'DELETE') {
                                    view.fireEvent('delete_server_url', record);
                                }
                            }
                        } */
                    }
                }
            },
            {
                xtype: 'container',
                layout: 'vbox',
                itemId: 'settingsExtraFieldCont',
                items: [],
                width: '100%',
                bind: {
                    items: '{extraSettingsFields}'
                },
                setItems: function (newItems) {
                    Ext.suspendLayouts();
                    this.removeAll();
                    this.add(newItems);
                    Ext.resumeLayouts(true);
                }
            }
        ]
    }, {
        xtype: 'container',
        cls: 'main-content-footer buttons',
        items: [{
                xtype: 'button',
                reference: 'backButton',
                componentCls: 'btn-login a-settings-back',
                handler: 'backButtonClick',
                width: '49%',
                bind: {
                    visible: '{bootstrapped}',
                    text: '{i18n.login_back:htmlEncode}'
                },
            },
            {
                xtype: 'button',
                itemId: 'saveButton',
                componentCls: 'btn-login a-settings-save',
                handler: 'saveButtonClick',
                bind: {
                    width: '{saveButtonWidth}',
                    text: '{i18n.login_save:htmlEncode}'
                }
            }
        ]
    }],
    initComponent: function () {
        var me = this;
        me.callParent();
        me.down('#url').setValue(ABP.util.LocalStorage.get('ServerUrl'));
    },
    afterRender: function () {
        var me = this;
        var backButton = me.lookupReference('backButton');

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