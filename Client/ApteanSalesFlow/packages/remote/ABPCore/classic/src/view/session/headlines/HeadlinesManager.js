/**
 * Favorite Manager - Favorite tree can be manipulated and saved from here.
 */
Ext.define('ABP.view.session.headlines.HeadlinesManager', {
    extend: 'ABP.view.components.panel.HeaderPanelBase',
    alias: 'widget.headlinesManager',
    requires: [
        'ABP.view.components.panel.HeaderPanelBase',
        'ABPControlSet.view.field.DateTime',
        'ABP.view.session.headlines.HeadlinesManagerController',
        'Ext.grid.plugin.RowWidget'
    ],
    controller: 'headlinesManager',
    cls: 'headlines-manager-panel',
    scrollable: 'vertical',
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    bind: {
        title: '{i18n.headlines_title:htmlEncode}'
    },
    closable: true,
    closeEvent: 'headlinesManager_onCancelClick',
    destroyOnClose: false,

    header: {
        automationCls: 'headlines-manager-header'
    },

    items: [
        {
            xtype: 'grid',
            flex: 1,
            rootVisible: false,
            reference: 'headlinesGrid',
            ui: 'abpgridpanel',
            forceFit: true,
            plugins: {
                rowwidget: {
                    widget: {
                        xtype: "abpform",
                        layout: {
                            type: 'column'
                        },
                        bind: {
                            data: '{record}'
                        },
                        defaults: {
                            margin: 4,
                            labelAlign: "top",
                            colspan: 1
                        },
                        padding: 4,
                        items: [
                            {
                                xtype: "abptext",
                                bind: {
                                    fieldLabel: '{i18n.headlines_label_message:htmlEncode}',
                                    value: "{record.message}"
                                },
                                name: "message"
                            },
                            {
                                xtype: "abptext",
                                bind: {
                                    fieldLabel: '{i18n.headlines_label_message_key:htmlEncode}',
                                    value: "{record.messageKey}"
                                },
                                name: "messageKey"
                            },
                            {
                                xtype: "abptext",
                                bind: {
                                    fieldLabel: '{i18n.headlines_label_action:htmlEncode}',
                                    value: "{record.actionText}"
                                },
                                name: "actionText"
                            },
                            {
                                xtype: "abptext",
                                bind: {
                                    fieldLabel: '{i18n.headlines_label_action_key:htmlEncode}',
                                    value: "{record.actionTextKey}"
                                },
                                name: "actionTextKey"
                            },
                            {
                                xtype: "abpdatetime",
                                bind: {
                                    fieldLabel: '{i18n.headlines_label_starttime:htmlEncode}',
                                    value: "{record.startTime}"
                                },
                                name: "startTime"
                            },
                            {
                                xtype: "abpdatetime",
                                bind: {
                                    fieldLabel: '{i18n.headlines_label_endtime:htmlEncode}',
                                    value: "{record.endTime}"
                                },
                                name: "endTime"
                            },
                            {
                                xtype: "abpcheckbox",
                                bind: {
                                    fieldLabel: '{i18n.headlines_label_published:htmlEncode}',
                                    value: "{record.published}"
                                },
                                name: "published"
                            },
                            {
                                xtype: "abpradiogroup",
                                bind: {
                                    fieldLabel: '{i18n.headlines_label_priority:htmlEncode}',
                                    value: "{record.priority}"
                                },
                                name: "priority",
                                items: [
                                    {
                                        bind: {
                                            boxLabel: '{i18n.headlines_priority_info:htmlEncode}',
                                        },
                                        name: 'priority',
                                        inputValue: 0
                                    }, {
                                        bind: {
                                            boxLabel: '{i18n.headlines_priority_warning:htmlEncode}',
                                        },
                                        name: 'priority',
                                        inputValue: 1
                                    }, {
                                        bind: {
                                            boxLabel: '{i18n.headlines_priority_alert:htmlEncode}',
                                        },
                                        name: 'priority',
                                        inputValue: 2
                                    }
                                ]
                            }
                        ],
                        bbar: [
                            {
                                xtype: "abpbutton",
                                handler: function (button) {
                                    var form = button.up('abpform'),
                                        headlinesManager = form.up("headlinesManager"),
                                        headlinesManagerController = headlinesManager.getController(),
                                        rowContext = form._rowContext,
                                        record = rowContext.record;

                                    headlinesManagerController.fireEvent("headline_save", record);
                                    record.save();
                                },
                                bind: {
                                    text: '{i18n.button_save:htmlEncode}',
                                    disabled: '{!record.dirty}'
                                }
                            }
                        ]
                    }
                }
            },
            columns: [
                {
                    dataIndex: 'message',
                    bind: {
                        text: '{i18n.headlines_column_message:htmlEncode}',
                    },
                    text: 'Message',
                    flex: 3
                },
                {
                    dataIndex: 'messageKey',
                    bind: {
                        text: '{i18n.headlines_column_message_key:htmlEncode}',
                    },
                    text: 'Message key',
                    hidden: true,
                    flex: 1
                },
                {
                    dataIndex: 'actionText',
                    bind: {
                        text: '{i18n.headlines_column_action:htmlEncode}'
                    },
                    flex: 2
                },
                {
                    dataIndex: 'actionTextKey',
                    bind: {
                        text: '{i18n.headlines_column_action_key:htmlEncode}',
                    },
                    text: 'Action key',
                    hidden: true,
                    flex: 1
                },
                {
                    dataIndex: 'startTime',
                    bind: {
                        text: '{i18n.headlines_column_starttime:htmlEncode}'
                    },
                    flex: 2
                },
                {
                    dataIndex: 'endTime',
                    bind: {
                        text: '{i18n.headlines_column_endtime:htmlEncode}'
                    },
                    flex: 2
                },
                {
                    dataIndex: 'published',
                    bind: {
                        text: '{i18n.headlines_column_published:htmlEncode}'
                    },
                    flex: 1
                },
                {
                    dataIndex: 'priority',
                    bind: {
                        text: '{i18n.headlines_column_priority:htmlEncode}'
                    },
                    flex: 1,
                    renderer: function (priority) {
                        switch (priority) {
                            case 0:
                                return ABP.util.Common.geti18nString('headlines_priority_info');
                            case 1:
                                return ABP.util.Common.geti18nString('headlines_priority_warning');
                            case 2:
                                return ABP.util.Common.geti18nString('headlines_priority_alert');
                            default:
                        }
                    }
                },
                {
                    // Delete column
                    xtype: 'actioncolumn',
                    hideable: false,
                    width: 30,
                    items: [{
                        width: 30,
                        iconCls: 'icon-navigate-cross',
                        handler: 'removeItemClicked'
                    }]
                }
            ]
        }
    ],

    tbar: {
        reference: 'tbar',
        cls: 'headlines-tbar',
        defaults: {
            border: false
        },
        bind: {
            height: '{toolbarHeight}'
        },
        items: [{
            bind: {
                text: '{i18n.button_cancel:htmlEncode}'
            },
            cls: 'a-headlines-toolbar-cancel',
            width: 100,
            handler: 'onCancelClick'
        }, {
            bind: {
                text: '{i18n.headlines_new:htmlEncode}'
            },
            cls: 'a-headlines-toolbar-new',
            width: 100,
            handler: 'newHeadline'
        }]
    }
});
