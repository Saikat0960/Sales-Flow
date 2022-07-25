/*
    Individual Notification Implementation (Modern)
*/
Ext.define('ABP.view.session.notifications.Notification', {
    extend: 'Ext.Container',
    requires: [
        'ABP.view.session.notifications.NotificationController',
        'ABP.view.session.notifications.NotificationModel',
        'ABP.util.RelativeTime'
    ],

    alias: 'widget.abp-notification',

    controller: 'abp-notification',

    viewModel: {
        type: 'abp-notification'
    },

    config: {
        notificationRecord: null,
        filterFlagged: false,
        category: ''
    },
    
    updateFilterFlagged: function(showFlaggedOnly){
        var me = this;
        if (!me.notificationRecord) {
            return;
        }

        if (showFlaggedOnly) {
            me.setHidden(!me.notificationRecord.flagged);
        }
        else {
            me.setHidden(false);
        }
    },
    
    cls: 'abp-notification',

    layout: 'vbox',

    items: [{
        xtype: 'container',
        reference: 'notificationDisplayContainer',
        frame: false,
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        items: [{
            xtype: 'container',
            cls: 'abp-notification-header',
            layout: {
                type: 'hbox'
            },
            width: '100%',
            items: [
                {
                    xtype: 'button',
                    reference: 'notificationLinkButton',
                    cls: 'abp-notification-link',
                    ui: 'abp-link',
                    automationCls: 'notification-link',
                    flex: 1,
                    textAlign: 'left',
                    bind: {
                        text: '{notificationLabel:htmlEncode}'
                    },
                    handler: 'onNotificationLinkClick',
                },
                {
                    xtype: 'button',
                    reference: 'notificationReadButton',
                    cls: 'a-abp-notification-read-button',
                    iconCls: 'icon-navigate-cross',
                    handler: 'onNotificationMarkReadClick'
                }
            ]
        }, {
            xtype: 'component',
            reference: 'notificationDetail',
            cls: 'abp-notification-detail',
            bind: {
                html: '{notificationDetail:htmlEncode}'
            }
        }, {
            xtype: 'toolbar',
            cls: 'abp-notification-toolbar',
            items: [{
                xtype: 'component',
                reference: 'notificationToolbarLabel',
                cls: 'abp-notification-toolbar-label'
            }, '->', {
                xtype: 'button',
                reference: 'notificationDownloadButton',
                cls: 'a-abp-notification-download-button',
                iconCls: 'icon-cloud-download',
                handler: 'onNotificationDownloadClick',
                hidden: true
            }, {
                xtype: 'button',
                reference: 'notificationFlagButton',
                cls: 'a-abp-notification-flag-button',
                iconCls: 'icon-signal-flag',
                enableToggle: true,
                handler: 'onNotificationFlagClick'
            }, {
                xtype: 'button',
                reference: 'notificationUnreadButton',
                cls: 'a-abp-notification-unread-button',
                iconCls: 'icon-nav-undo',
                handler: 'onNotificationMarkUnreadClick'
            }, {
                xtype: 'button',
                reference: 'notificationRemoveButton',
                cls: 'a-abp-notification-remove-button',
                iconCls: 'icon-directional-arrows-14',
                handler: 'onNotificationRemoveClick'
            }]
        }]
    }, {
        xtype: 'container',
        reference: 'notificationMarkedAsReadContainer',
        layout: {
            type: 'vbox',
            align: 'center',
            pack: 'center'
        },
        items: [{
            xtype: 'component',
            cls: 'abp-notification-action-label icon-fa-check-circle-o-01',
            bind: {
                html: '{i18n.abp_notifications_label_marked_as_read:htmlEncode}'
            }
        }],
        hidden: true
    }, {
        xtype: 'container',
        reference: 'notificationMarkedAsUnreadContainer',
        layout: {
            type: 'vbox',
            align: 'center',
            pack: 'center'
        },
        items: [{
            xtype: 'component',
            cls: 'abp-notification-action-label icon-nav-undo',
            bind: {
                html: '{i18n.abp_notifications_label_marked_as_unread:htmlEncode}'
            }
        }],
        hidden: true
    }, {
        xtype: 'container',
        reference: 'notificationRemovedContainer',
        layout: {
            type: 'vbox',
            align: 'center',
            pack: 'center'
        },
        items: [{
            xtype: 'component',
            cls: 'abp-notification-action-label icon-directional-arrows-14',
            bind: {
                html: '{i18n.abp_notifications_label_removed:htmlEncode}'
            }
        }],
        hidden: true
    }],

    initialize: function () {
        var me = this,
            vm = me.getViewModel(),
            record = me.getNotificationRecord(),        // Set in config of Notification
            notificationToolbarLabel = null,
            notificationFlagButton = null;

        me.callParent(arguments);

        // Set the VM for label
        vm.set('label', record.label ? record.label : '');
        if (record.labelKey) {
            vm.bind('{i18n.' + record.labelKey + '}', function (v) {
                vm.set('labelTemplate', v);
            });
        } else {
            vm.set('labelTemplate', '');
        }
        vm.set('labelArgs', record.labelArgs ? record.labelArgs : []);

        // Set the VM for details
        vm.set('detail', record.detail ? record.detail : '');
        if (record.detailKey) {
            vm.bind('{i18n.' + record.detailKey + '}', function (v) {
                vm.set('detailTemplate', v);
            });
        } else {
            vm.set('detailTemplate', '');
        }
        vm.set('detailArgs', record.detailArgs ? record.detailArgs : []);

        notificationToolbarLabel = me.lookupReference('notificationToolbarLabel');
        if (record.new) {
            // Set label to date
            if (record.time) {
                vm.set('notificationTime', record.time);
            }

            notificationToolbarLabel.setBind({
                html: '<div class="time abp-time-ago" data-time="{notificationTime:htmlEncode}">{notificationTime:formatRelativeTime}</div>'
            });

            // Hide the "unread" button
            me.lookupReference('notificationUnreadButton').setHidden(true);

            // Hide remove button
            me.lookupReference('notificationRemoveButton').setHidden(true);
        } else {
            // Set label to "Read" indicator
            notificationToolbarLabel.setBind({
                html: '{i18n.abp_notifications_label_read:htmlEncode} <span class="icon-check"></span>'
            });

            // Hide the "Read" button
            me.lookupReference('notificationReadButton').setHidden(true);

            // Hide download button
            me.lookupReference('notificationDownloadButton').setHidden(true);
        }

        // Are we already flagged?
        if (record.flagged) {
            me.addCls('abp-notification-flagged');

            notificationFlagButton = me.lookupReference('notificationFlagButton');
            notificationFlagButton.setPressed(true);
            notificationFlagButton.setIconCls('icon-flag-filled');
        }

        // Enable Link
        if (record.event) {
            me.lookupReference('notificationLinkButton').addCls('has-link');
        }
        else {
            me.lookupReference('notificationLinkButton').disable();
        }

        // Enable Download
        if (record.downloadEvent) {
            me.lookupReference('notificationDownloadButton').setHidden(false);
        }
    }
});
