Ext.define('ABP.view.session.thumbbar.ThumbbarTray', {
    extend: 'Ext.Container',
    alias: 'widget.thumbbartray',
    requires: ['ABP.view.session.thumbbar.ThumbbarTrayController'],
    controller: 'thumbbartray',
    layout: {
        type: 'vbox'
    },
    width: '100%',
    cls: 'abpthumbbar-tray-noshadow',
    items:[
        {
            xtype: 'button',
            iconCls: 'icon-navigate-up',
            automationCls: 'thumbbartrayopen',
            handler: '__triggerClick',
            cls: 'thumbbar-trigger',
            itemId: 'closeTrayButton',
            height: 14,
            width: 60
        }, {
            // thumbbar
            xtype: 'container',
            cls: 'abp-thumbbar',
            width: '100%',
            height: 55,
            itemId: 'abpThumbbarTrayBar',
            layout: {
                type: 'hbox',
                pack: 'space-around'
            },
            defaults: {
                xtype: 'button'
            }
        }, {
            // bottom tray (button overflow)
            xtype: 'container',
            cls: 'abp-thumbbar-lower-tray',
            width: '100%',
            maxHeight: 220,
            itemId: 'abpThumbbarTrayBottom',
            layout: {
                type: 'vbox',
                pack: 'space-around'
            }
        }
    ]
});