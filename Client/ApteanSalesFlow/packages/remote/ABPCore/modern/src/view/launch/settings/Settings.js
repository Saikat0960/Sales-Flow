Ext.define('ABP.view.launch.settings.Settings', {
    extend: 'Ext.Container',
    requires: [
        'ABP.view.launch.settings.SettingsController',
        'ABP.view.launch.settings.SettingsModel',
        'ABP.view.base.popUp.PopUpFrame'
    ],

    alias: 'widget.settings',

    controller: 'settingscontroller',

    viewModel: {
        type: 'settingsmodel'
    },

    cls: 'settings-modern main-content-wrapper',

    height: '100%',

    scrollable: 'vertical', // Needed so that many "extra settings" + server URLs can be shown.

    items: [
        {
            xtype: 'container',
            cls: 'main-content',
            items: [{
                xtype: 'component',
                cls: 'settings-title',
                bind: {
                    html: '{i18n.login_settingsTitle:htmlEncode}'
                }
            },
            {
                xtype: 'component',
                cls: 'settings-text',
                bind: {
                    html: '{i18n.login_settingsInstructions:htmlEncode}'
                }
            }, {
                xtype: 'textfield',
                align: 'middle',
                clearable: false,
                itemId: 'url',
                labelWidth: 0,
                value: '',
                cls: 'x-unselectable a-settings-url login-required-field login-form',
                labelAlign: 'top',
                required: true,
                bind: {
                    label: '{i18n.login_url:htmlEncode}'
                },
                listeners: {
                    action: function (t, e, eOpts) {
                        t.fireEvent('settings_save');
                    }
                    // TODO: Fields can expand/shrink to give the users more real estate to enter a URL.
                    // With the current design there is no room to expand this field. In the future perhaps create a new modal component to provide this space.
                    // focus: function (t, e, eOpts) {
                    //     var inner = t.innerElement.down('input');
                    //     var width = t.getFocusWidth();
                    //     t.setWidth(width);
                    //     if (inner) {
                    //         inner.setWidth(width);
                    //     }
                    // },
                    // blur: function (t, e, eOpts) {
                    //     var inner = t.innerElement.down('input');
                    //     t.setWidth(287);
                    //     if (inner) {
                    //         inner.setWidth(287);
                    //     }
                    // },
                    // scope: this
                },
                // getFocusWidth: function () {
                //     var windowwidth = ABP.util.Common.getWindowWidth();
                //     var ret;
                //     if (windowwidth < 600) {
                //         ret = windowwidth;
                //     } else {
                //         ret = 600;
                //     }
                //     return ret;
                // }
            }, {
                // Expand/contract button for previously used URLs.
                xtype: 'abpbutton',
                cls: 'settings-moreServerUrls-button',
                ui: '(none)', // Remove default styling for buttons, because this one will be styled more like a label or hyperlink.
                itemId: 'moreServerUrls-label',
                automationCls: 'settings-moreurlsbutton',
                bind: {
                    text: '{i18n.login_previousUrls:htmlEncode}', // Do not set html - a layout failure will happen after some clicking on this component.
                    hidden: '{!bootstrapConf.settings.rememberPreviousServerUrls}' // hidden is available in ABPControlSet for both Classic and Modern.
                },
                iconCls: 'icon-navigate-close', // Down arrow, showing something is expandable.
                iconAlign: 'right',
                textAlign: 'left',
                margin: 0,
                listeners: {
                    tap: 'onMoreServerUrlsClick'
                }
            }, {
                // Panel showing a list of previously used URLs. Initially collapsed and invisible.
                xtype: 'abppanel',
                itemId: 'moreServerUrls',
                cls: 'settings-moreServerUrls',
                collapsible: true,
                collapsed: true,
                header: { hidden: true },
                layout: 'fit',
                items: [
                    {
                        // List of URLs.
                        xtype: 'dataview',
                        itemId: 'moreServerUrlsList',
                        cls: 'settings-moreServerUrlsList a-settings-moreServerUrlsList',
                        //overItemCls: Ext.baseCSSPrefix + 'grid-item-over',
                        //selectedItemCls: Ext.baseCSSPrefix + 'grid-item-selected',
                        bind: {
                            store: '{serverUrlStore}',
                        },
                        focusCls: Ext.baseCSSPrefix + 'focused ' + Ext.baseCSSPrefix + 'selected',
                        height: 130,
                        scrollable: true,
                        itemTpl: [
                            '<div class="server-url-item">',
                            '<div class="server-url a-server-url">{url}</div>',
                            '<div class="delete-item" role="button" aria-label="Remove URL" title="Remove URL"><span class="delete-item-icon icon-garbage-can a-delete-item-icon"></span></div>',
                            '</div>'
                        ],
                        keyMap: {
                            'ENTER':
                                function (eventObj, dataview) {
                                    this.__handleKeyEvent(eventObj, dataview, 'server_url_select');
                                },
                            'SPACE':
                                function (eventObj, dataview) {
                                    this.__handleKeyEvent(eventObj, dataview, 'server_url_select');
                                },
                            'DELETE':
                                function (eventObj, dataview) {
                                    this.__handleKeyEvent(eventObj, dataview, 'delete_server_url');
                                },
                            'BACKSPACE':
                                function (eventObj, dataview) {
                                    this.__handleKeyEvent(eventObj, dataview, 'delete_server_url');
                                },
                        },
                        // Common function for processing key events in server URL list.
                        __handleKeyEvent: function (eventObj, dataview, recordEvent) {
                            if (eventObj && eventObj.currentTarget && dataview) {
                                var currentTarget = eventObj.currentTarget;
                                var recordId = currentTarget.getAttribute('data-recordid');
                                if (recordId) {
                                    var record = dataview.store.getByInternalId(recordId);
                                    if (Ext.isObject(record)) {
                                        dataview.fireEvent(recordEvent, record);
                                    }
                                }
                            }
                        },
                        listeners: {
                            // childTap for Modern. itemClick for Classic.
                            childTap: function (dataview, location, eOpts) {
                                if (Ext.isObject(location) && Ext.isObject(location.record) && location.event) {
                                    // Determine which part of the item line has been clicked.
                                    if (location.event.getTarget('.delete-item-icon')) {
                                        dataview.fireEvent('delete_server_url', location.record);
                                    } else if (location.event.getTarget('.server-url')) {
                                        dataview.fireEvent('server_url_select', location.record);
                                    }
                                }
                                return true;
                            }
                        }
                    }

                ]
            }, {
                xtype: 'container',
                layout: 'vbox',
                itemId: 'settingsExtraFieldCont',
                bind: {
                    items: '{extraSettingsFields}'
                }
            }]
        }, {
            xtype: 'container',
            cls: 'main-content-footer buttons',
            items: [{
                xtype: 'button',
                itemId: 'backBtn',
                cls: 'btn-login a-settings-back login-form',
                bind: {
                    text: '{i18n.login_back:htmlEncode}',
                    hidden: '{!bootstrapped}'
                },
                handler: 'backButtonClick',
                width: '49%'
            }, {
                xtype: 'button',
                itemId: 'saveButton',
                cls: 'btn-login a-settings-save login-form',
                bind: {
                    text: '{i18n.login_save:htmlEncode}',
                    width: '{saveButtonWidth}'
                },
                handler: 'saveButtonClick',
            }]
        }],

    initialize: function () {
        var me = this;
        me.callParent();
        me.down('#url').setValue(ABP.util.LocalStorage.get('ServerUrl'));
    }

});
