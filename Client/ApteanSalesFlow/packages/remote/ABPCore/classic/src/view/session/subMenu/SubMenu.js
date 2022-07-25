/////////////////////////////////////////////////////////////////////////////////////
//  Name:      app/view/session/subMenu/SubMenu.js
//  Purpose:   Secondary Navigation for application
//  Created:   7/9/2014 - Joe Blenis
//  Last Edit: 7/9/2014 - Joe Blenis - Created File
/////////////////////////////////////////////////////////////////////////////////////
Ext.define('ABP.view.session.subMenu.SubMenu', {
    extend: 'Ext.container.Container',
    alias: 'widget.submenu',
    requires: ['ABP.view.session.subMenu.SubMenuController',
        'ABP.view.session.subMenu.SubMenuModel',
        'ABP.view.session.subMenu.SubMenuItem',
        'ABP.view.session.subMenu.TriMenuItem',
        'ABP.view.session.subMenu.SubScroll'],
    controller: 'submenucontroller',
    viewModel: {
        type: 'submenumodel'
    },

    focusItemsCt: 0,
    currentFocus: -1,
    startIdx: -1,
    dirtyIdx: true,
    lastInitMouseBool: true,

    componentCls: 'sub-menu x-unselectable',
    layout: 'vbox',
    width: 300,
    height: '100%',
    items: [{
        xtype: 'container',//ABP.util.Config.isDesktop() ? 'subscroll' : 'container',
        layout: { type: 'vbox', align: 'stretch' },
        cls: ABP.util.Config.isDesktop() ? 'noshowScroll' : '',
        width: 300,
        itemId: 'sub_menu_cont',
        enabledItemCount: 0,
        autoScroll: !ABP.util.Config.isDesktop(),
        bind: { items: '{shownItems}' },
        setItems: function (newItems) {
            Ext.suspendLayouts();
            this.removeAll(true);
            this.add(newItems);
            Ext.resumeLayouts(true);
            this.recalcNavItems();
        },
        recalcNavItems: function () {
            var me = this;
            var buttons = me.items.items;
            var i = 0;
            me.enabledItemCount = 0;
            for (i; i < buttons.length; ++i) {
                if (buttons[i].config.enabled && !buttons[i].config.hidden) {
                    me.enabledItemCount++;
                }
            }
        }
    }],
    afterLayout: function () {
        if (!this.lastInitMouseBool) {
            var cont = this.getController();
            if (cont && cont !== undefined) {
                cont.firstFocus();
            }
        }
    },
    listeners: {
        el: {
            keydown: function (f) {
                switch (f.getKey()) {
                    case f.UP:
                        this.component.getController().moveUp();
                        break;
                    case f.DOWN:
                        this.component.getController().moveDown();
                        break;
                    case f.TAB:
                        this.component.getController().tabHit();
                        break;
                    case f.LEFT:
                        this.component.getController().moveLeft();
                        break;

                }
            }
        }
    }

    //,

    //    initComponent: function () {
    //        var me = this;
    //        me.callParent(arguments);
    //        Ext.FocusManager.enabled = true;
    //        me.nav = Ext.create('Ext.util.KeyNav', Ext.getBody(), {
    //            "right": function () {
    //                me.getController().moveRight();
    //            },
    //            "left": function () {
    //                me.getController().moveLeft();
    //            },
    //            "up": function () {
    //                me.getController().moveUp();
    //            },
    //            "down": function () {
    //                me.getController().moveDown();
    //            },
    //            "tab": function () {
    //                me.getController().tabHit();
    //            },
    //            "enter": function () {
    //                me.getController().enterHit();
    //            }
    //        });
    //        me.nav.map.disable();
    //    }
});