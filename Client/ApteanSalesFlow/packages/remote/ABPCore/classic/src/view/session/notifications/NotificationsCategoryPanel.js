/*
    Notification Right Pane Container (Classic)
*/
Ext.define('ABP.view.session.notifications.NotificationsCategoryPanel', {
    extend: 'Ext.panel.Panel',

    alias: 'widget.abp-notifications-category-panel',

    controller: 'abp-notifications-category-panel',

    viewModel: {
        type: 'abp-notifications-category-panel'
    },

    config: {
        categoryName: null,
        categoryNameKey: null
    },

    cls: 'abp-notifications-category-panel a-abp-notifications-category-panel',

    collapsible: true,
    collapsed: false,
    collapseToolText: null, // No tooltip
    expandToolText: null,    // No tooltip
    titleCollapse: true,
    tabIndex: -1,
    bind: {
        hidden: '{hidePanel}'
    },
    header: {
        cls: 'abp-notification-panel-header'
    },

    items:[{
        xtype: 'container',
        layout: 'hbox',
        frame: false,
        items: [{
            xtype: 'component',
            itemId: 'notificationCategoryNavComponent',
            reference: 'notificationCategoryNavComponent',
            bind: {
                ariaLabel: '{ariaCategoryNotificationLabel:ariaEncode}'
            },
            tabIndex: -1,
            focusable: true,
            listeners: {
                keydown: {
                    element: Ext.isModern ? 'element' : 'el',  
                    fn: 'handleCategoryKeyDown'
                },
                focus: {
                    element: Ext.isModern ? 'element' : 'el',
                    fn: 'onCategoryNavFocus'
                }
            }
        },
        {
            xtype: 'component',
            reference: 'categoryShowHistoryComponent',
            cls: 'notifications-hideshow-history x-unselectable',
            ariaLabel: 'Show History',
            bind: {
                html: '{i18n.abp_notifications_label_show_history:htmlEncode}',
                hidden: '{hideShowHistoryComponent}'
            },
            listeners: {    // For just the "Show History" link
                el: {
                    click: 'onShowHistoryClick'
                }
            }
        }, {
            xtype: 'component',
            reference: 'categoryHideHistoryComponent',
            cls: 'notifications-hideshow-history x-unselectable',
            ariaLabel: 'Hide History',
            bind: {
                html: '{i18n.abp_notifications_label_hide_history:htmlEncode}',
                hidden: '{hideHideHistoryComponent}'
            },
            listeners: {    // For just the "See History" link
                el: {
                    click: 'onHideHistoryClick'
                }
            },
        }]
    }, {
        xtype: 'container',
        reference: 'unreadNotificationContainer',
        cls: 'abp-notifications-unread-container',
    }, {
        xtype: 'container',
        reference: 'historyNotificationContainer',
        cls: 'abp-notifications-history-container',
        bind: {
            hidden: '{!displayHistory}'
        }
    }],

    initComponent: function () {
        var me = this,
            categoryNameKey = this.getCategoryNameKey(),
            categoryName = this.getCategoryName(),
            vm = me.getViewModel();

        vm.set('categoryName', categoryName);
        if (this.tools) {
            this.tools.forEach(function (val) {
                val.automationCls = this.automationCls + '-' + val.type;
            })
        }
        this.setBind({
            hidden: '{hidePanel}',
            title: '<span class="abp-notification-panel-title" tabindex="0" aria-label="' + (categoryNameKey ? '{i18n.' + categoryNameKey + ':htmlEncode}' : Ext.String.htmlEncode(categoryName))  + ' {unreadNotificationCount}">'
                + (categoryNameKey ? '{i18n.' + categoryNameKey + ':htmlEncode}' : Ext.String.htmlEncode(categoryName))
                + '</span>{categoryNotificationCountDisplay}'
        });

        me.callParent();
    },

    addNotification: function(notificationRecord, isNew) {
        var me = this,
            controller = me.getController();

        controller.addNotification(notificationRecord, isNew);
    },

    removeNotification: function (notification) {
        var me = this,
            controller = me.getController();

        controller.removeNotification(notification);
    },

    markNotificationRead: function (notification) {
        var me = this,
            controller = me.getController();

        controller.markNotificationRead(notification);
    },

    markNotificationUnread: function (notification) {
        var me = this,
            controller = me.getController();

        controller.markNotificationUnread(notification);
    }
});
