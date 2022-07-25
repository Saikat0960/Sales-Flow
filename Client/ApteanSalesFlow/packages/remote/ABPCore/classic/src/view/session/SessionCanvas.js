/////////////////////////////////////////////////////////////////////////////////////
//  Name:      app/view/base/SessionCanvas.js
//  Purpose:   Canvas that will hold all functionality of container post login
//  Created:   7/3/2014 - Joe Blenis
//  Last Edit: 7/3/2014 - Joe Blenis - Created File
/////////////////////////////////////////////////////////////////////////////////////
Ext.define('ABP.view.session.SessionCanvas', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.sessioncanvas',
    requires: [
        'ABP.view.session.SessionBanner',
        'ABP.view.session.accessibility.JumpToBar',
        'ABP.view.session.feature.FeatureCanvas',
        'ABP.view.session.mainMenu.MainMenu',
        'ABP.view.session.SessionCanvasController',
        'ABP.view.session.rightPane.RightPane',
        'ABP.view.session.settings.SettingsContainer',
        'ABP.view.session.SessionCanvasModel'
    ],
    controller: 'sessioncanvascontroller',
    viewModel: {
        type: 'sessioncanvasmodel'
    },
    menuOpened: true,
    layout: 'border',
    dockedItems: [
        {
            xtype: 'jumptobar',
            dock: 'top'
        },
        {
            xtype: 'sessionbanner',
            dock: 'top'
        },
        {
            xtype: 'toolbartop',
            dock: 'top'
        }
    ],
    initComponent: function () {
        var me = this;
        var vm = me.getViewModel();
        var configSettings = vm.get('conf').settings;
        var startMenuHidden = configSettings.startMenuHidden;
        var autohide = configSettings.autoHideMenu;
        var rememberState = ABP.util.Config.getSessionConfig().settings.rememberMenuState;
        var state;
        if (rememberState) {
            state = ABP.util.LocalStorage.get('mmStateOpen');
            if (state !== null) {
                if (state === 'true') { state = true; }
                else if (state === 'false') { state = false; }
                startMenuHidden = !state;
            }
        }

        vm.set('menuOpen', !startMenuHidden);
        vm.set('rightPaneOpen', false);
        vm.set('autoHide', autohide);
        me.items = [
            {
                xtype: 'mainmenu',
                region: 'west',
                viewModel: {
                    type: 'mainmenumodel',
                    data: {
                        classicMenuExpand: !startMenuHidden,
                        //menuFooterCls: startMenuHidden ? 'main-footer-micro' : 'menu-footer',
                        //menuWidth: startMenuHidden ? 45 : 250
                    }
                }
                /*width: 175,
                hidden: startMenuHidden*/
            },
            {
                xtype: 'featurecanvas',
                region: 'center'
            },
            {
                // Right panel for "Suggested Content".
                xtype: 'rightpanecanvas',
                region: 'east',
                hidden: true,
                scrollable: false  //set to false to avoid having an omnipresent scrollbar
            }
        ];
        me.callParent();
        if (startMenuHidden) {
            //me.down('mainmenu').toggleMicro(true)
            me.closeMenu();
        }
    },

    closeMenu: function () {
        var me = this;
        var mm = me.down('mainmenu');
        mm.hide();
        //var feature = me.down('mainmenu');
        //feature.animate({ to: { x: 0} });
        //me.removeMenuMask();
        //me.closeSubMenu();
        //me.fireEvent('mainMenu_close');
        //        if (me.getViewModel().get('autoHide')) {
        //            var mm = view.down('mainmenu');
        //            mm.animate({ to: { x: -150} });
        //        } else {
        //            var app = view.down('#topContainer');
        //            app.animate({ to: { x: 0 }, callback: function () {
        //                me.autoResize(0);
        //            }
        //            });
        //        }
        //        me.down('#menuButton').removeCls('toolbar-menu-btn-active');
        //me.fireEvent('mainMenu_zeroFocus');
        //me.unselectAll();



    },

    openMenu: function (MouseInitiated) {
        var me = this;
        var mm = me.down('mainmenu');
        mm.show();
        //var feature = me.down('featurecanvas');
        //feature.animate({ to: { x: 150} });
        //        var view = me.getView();
        //        if (!view.menuOpened) {
        //            view.menuOpened = true;
        //            if (me.getViewModel().get('autoHide')) {
        //                me.addMenuMask();
        //                var mm = view.down('mainmenu');
        //                mm.animate({ to: { x: 0 }, callback: function () {
        //                    me.fireEvent('mainMenu_open', MouseInitiated);
        //                }
        //                });
        //            } else {
        //                var app = view.down('#topContainer');
        //                app.animate({ to: { x: 150 }, callback: function () {
        //                    me.fireEvent('mainMenu_open', MouseInitiated);
        //                    me.autoResize(150);
        //                }
        //                });
        //            }

        //            view.down('#menuButton').addCls('toolbar-menu-btn-active');
        //        }
    }
});
