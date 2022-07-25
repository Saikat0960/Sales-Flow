Ext.define('ABP.view.control.ABPLoggingPopup', {
    extend: 'Ext.panel.Panel',
    requires: [
        'ABP.view.control.ABPLoggingPopupController',
        'ABP.util.Logger'
    ],

    alias: 'widget.loggingpopup',
    controller: 'loggingpopup',

    cls: 'loggingpanel',
    bodyCls: 'loggingpanel-body x-unselectable',

    floating: true,
    modal: true,

    maxHeight: Ext.getBody().getViewSize().height - 10,
    maxWidth: Ext.getBody().getViewSize().width - 10,

    title: 'Log Viewer',

    config: {
        closeKeymap: undefined
    },

    tools: [{
        type: 'mytool',
        cls: 'loggingpanel-close-tool',
        renderTpl: function () {
            return '<i class="icon-delete"></i>';
        },
        handler: 'onCloseClick'
    }],

    dockedItems: [{
        xtype: 'toolbar',
        cls: 'loggingpanel-toolbar',
        dock: 'bottom',
        defaults: {
            cls: 'loggingpanel-button'
        },
        items: ['->', {
            xtype: 'container',
            itemId: 'clearLogsButtonContainer',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [{
                xtype: 'component',
                cls: 'loggingpanel-button-icon',
                html: '<i class="icon-garbage-can"></i>'
            }],
            listeners: {
                el: {
                    click: 'onClickClearLogs'
                }
            }
        }, {
                xtype: 'container',
                itemId: 'saveWidgetButtonContainer',
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                items: [{
                    xtype: 'component',
                    cls: 'loggingpanel-button-icon',
                    html: '<i class="icon-check"></i>'
                }],
                listeners: {
                    el: {
                        click: 'onClickSave'
                    }
                }
            }]
    }],


    initComponent: function () {
        var me = this;
        var myWidth = Ext.getBody().getViewSize().width;

        //        if (myWidth >= 610) {
        //            myWidth = 600;
        //        } else {
        myWidth = myWidth - 20;
        //        }

        me.items = [{
            xtype: 'abptextarea',
            value: ABP.util.Logger.getLogs(),
            spellcheck: false,
            inputAttrTpl: ['autocomplete="off" wrap="off"'],
            height: Ext.getBody().getViewSize().height - 110,
            width: myWidth
        }];

        me.callParent();

        me.show();
        me.setCloseKeymap(Ext.getBody().addKeyListener(Ext.event.Event.ESC, me.onESC, me));
    },

    onESC: function () {
        var me = this;
        Ext.destroy(me.getCloseKeymap());
        me.closePanel();
    },

    closePanel: function () {
        var me = this;

        me.close();
    }
});