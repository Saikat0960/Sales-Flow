/*
    Individual Notification Implementation (Classic)
*/
Ext.define('ABP.view.session.notifications.Notification', {
    extend: 'Ext.container.Container',
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
    tabIndex: -1,
    config: {
        notificationRecord: null,
        justAdded: false,
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

    layout: 'card',
    listeners: {
        keydown: {
            element: Ext.isModern ? 'element' : 'el',
            fn: 'handleNotificationKeyDown'
        }
    },
    items: [
        {
        xtype: 'container',
        reference: 'notificationDisplayContainer',
        frame: false,
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        items:[
            {
                xtype: 'component',
                itemId: 'notificationSpecificNavComponent',
                reference: 'notificationSpecificNavComponent',
                bind: {
                    ariaLabel: '{totalNotificationCount} {notificationLabel:ariaEncode} {notificationDetail} {notificationAdditionalAriaDetail}'
                },
                tabIndex: -1,
                focusable: true
            },
            {
                xtype: 'container',
                frame: false,
                cls: 'abp-notification-header',
                layout: {
                    type: 'hbox'
                },
                items: [
                    {
                        xtype: 'button',
                        reference: 'notificationLinkButton',
                        cls: 'abp-notification-link a-abp-notification-link',
                        uiCls: 'abp-link',
                        textAlign: 'left',
                        flex: 1,
                        tabIndex: 0,
                        bind: {
                            text: '{notificationLabel:htmlEncode}',
                            ariaLabel: '{notificationLabel:ariaEncode}',
                        },
                        handler: 'onNotificationLinkClick'
                    },
                    {
                        xtype: 'button',
                        reference: 'notificationReadButton',
                        cls: 'abp-notification-read-button a-abp-notification-read-button',
                        iconCls: 'icon-navigate-cross',
                        ariaLabel: 'Mark Read',
                        handler: 'onNotificationMarkReadClick'
                    }
                ]
            },
            {
                xtype: 'component',
                cls: 'abp-notification-detail x-unselectable',
                bind: {
                    html: '{notificationDetail:htmlEncode}',
                }
            },
            {
                xtype: 'toolbar',
                cls: 'abp-notification-toolbar',
                items: [
                    {
                        xtype: 'component',
                        reference: 'notificationToolbarLabel',
                        cls: 'abp-notification-toolbar-label'
                    }, '->',
                    {
                        xtype: 'container',
                        cls: 'abp-notification-toolbar-buttons-wrapper',
                        items: [
                            {
                                xtype: 'button',
                                reference: 'notificationDownloadButton',
                                cls: 'abp-notification-download-button a-abp-notification-download-button',
                                iconCls: 'icon-cloud-download',
                                ariaLabel: 'Download',
                                handler: 'onNotificationDownloadClick',
                                hidden: true
                            }, {
                                xtype: 'button',
                                reference: 'notificationFlagButton',
                                cls: 'abp-notification-flag-button a-abp-notification-flag-button',
                                iconCls: 'icon-signal-flag',
                                ariaLabel: 'Flag',
                                enableToggle: true,
                                handler: 'onNotificationFlagClick'
                            },  {
                                xtype: 'button',
                                reference: 'notificationUnreadButton',
                                cls: 'abp-notification-unread-button a-abp-notification-unread-button',
                                iconCls: 'icon-nav-undo',
                                ariaLabel: 'Mark Unread',
                                handler: 'onNotificationMarkUnreadClick'
                            }, {
                                xtype: 'button',
                                reference: 'notificationRemoveButton',
                                cls: 'abp-notification-remove-button a-abp-notification-remove-button',
                                iconCls: 'icon-garbage-can',
                                ariaLabel: 'Delete',
                                handler: 'onNotificationRemoveClick'
                            }
                        ]
                    }
                ]
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
        }]
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
        }]
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
            cls: 'abp-notification-action-label icon-garbage-can',
            bind: {
                html: '{i18n.abp_notifications_label_removed:htmlEncode}'
            }
        }]
    }],

    /**
     * @event notification_read
     * @param {Object} record Alert/Notification record as passed to container_notifications_add (with source property added)
     * Fires after a alert/notification has had it's checkmark clicked.  This can be used by the source application if they need to record that
     * an alert/notification has been marked as read.  Note ABP marks the event/notification as read locally so there is no need for the source
     * application to also send a container_notifications_read event.
     */

    /**
    * @event notification_unread
    * @param {Object} record Alert/Notification record as passed to container_notifications_add (with source property added)
    * Fires after a alert/notification has had it's undo clicked.  This can be used by the source application if they need to record that
    * an alert/notification has been marked as unread (undo mark as read).  Note ABP marks the event/notification as unread locally so there
    * is no need for the source application to also send a container_notifications_unread event.
    */

    /**
    * @event notification_flag_change
    * @param {Object} record Alert/Notification record as passed to container_notifications_add (with source property added)
    * Fires after a alert/notification has had it's flag clicked.  This can be used by the source application if they need to record that
    * an alert/notification has been marked as flagged/unflagged.  Note whether the record is flagged or not can be read in the boolean
    * record.flagged.  Again, ABP marks the event/notification as flagged/unflagged so there is no need for the source application to also
    * send any additional events.
    */

    /**
    * @event notification_removed
    * @param {Object} record Alert/Notification record as passed to container_notifications_add (with source property added)
    * Fires after a alert/notification has had it's remove clicked.  This can be used by the source application if they need to record that
    * an alert/notification has been removed.  Note ABP removes the event/notification as unread locally so there
    * is no need for the source application to also send a container_notifications_remove event.
    */
    initComponent: function () {
        var me = this,
            vm = me.getViewModel(),
            record = me.getNotificationRecord(),        // Set in config of Notification
            notificationToolbarLabel = null,
            notificationFlagButton = null;

        me.callParent(arguments);

        // Set the VM for label
        vm.set('label', record.label ? record.label : '');
        vm.set('uniqueId', record.uniqueId);
        vm.set('currentBtnIdx', -1);
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
            me.lookupReference('notificationUnreadButton').setVisible(false);

            // Hide remove button
            me.lookupReference('notificationRemoveButton').setVisible(false);
        } else {
            // Set label to "Read" indicator
            notificationToolbarLabel.setBind({
                html: '{i18n.abp_notifications_label_read:htmlEncode} <span class="icon-check"></span>'
            });

            // Hide the "Read" button
            me.lookupReference('notificationReadButton').setVisible(false);

            // Hide download button
            me.lookupReference('notificationDownloadButton').setVisible(false);
        }

        // Are we already flagged?
        if (record.flagged) {
            me.addCls('abp-notification-flagged');
            vm.set('flagged', true);
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
            me.lookupReference('notificationDownloadButton').setVisible(true);
        }
        vm.notify();
        //me.updateJustAdded(me.getJustAdded());
    },

    updateJustAdded: function(isNew){
        var me = this,
            vm = me.getViewModel();
        vm.notify();
        if (isNew){
            this.addCls('abp-notification-new');
        }
        else{
            this.removeCls('abp-notification-new');
        }
    }
});
