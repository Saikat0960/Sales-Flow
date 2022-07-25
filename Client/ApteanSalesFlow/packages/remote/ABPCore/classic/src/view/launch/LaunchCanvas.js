/////////////////////////////////////////////////////////////////////////////////////
//  Name:      app/view/base/LaunchCanvas.js
//  Purpose:   First Canvas that is displayed.  Contains Login/Settings functionality
//  Created:   7/3/2014 - Joe Blenis
//  Last Edit: 7/3/2014 - Joe Blenis - Created File
/////////////////////////////////////////////////////////////////////////////////////
Ext.define('ABP.view.launch.LaunchCanvas', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.launchcanvas',
    requires: [
        'ABP.view.session.SessionBanner',
        'ABP.view.launch.login.Login',
        'ABP.view.launch.settings.Settings',
        'ABP.view.launch.maintenance.Maintenance',
        'ABP.view.launch.selectuser.SelectUser',
        'ABP.view.launch.LaunchCarousel',
        'ABP.view.launch.discovery.Discovery'
    ],
    itemId: 'launch-canvas',
    componentCls: 'launch-canvas',
    cls: 'launch-canvas',
    tbar: {
        xtype: 'sessionbanner',
        ariaAttributes: {
            'aria-label': 'Headline Message'
        },
        dock: 'top'
    },
    layout: {
        type: 'vbox',
        align: 'center',
        pack: 'center'
    },
    initComponent: function () {
        this.items = [{
            xtype: 'container',
            componentCls: 'login-form',
            width: 380,
            minHeight: 600,
            maxHeight: 600,
            layout: {
                type: 'vbox',
                align: 'stretch',
                pack: 'start'
            },
            items: [{
                xtype: 'abpheadercomponent',
                cls: 'login-hdr-wrapper',
                itemId: "login-title",
                ariaAttributes: {
                    'aria-level': '1'
                },
                bind: {
                    html: '<div class="login-hdr">{i18n.login_login_header:htmlEncode}</div>'
                },
                width: 380,
                tabIndex: -1,
                focusable: false
            }, {
                xtype: 'launchcarousel',
                padding: '0 0 24 0',
                minHeight: 350,
                flex: 1,
                items: [{
                    title: 'settings',
                    xtype: 'settings',
                    itemId: 'settings-tab',
                    defaults: {
                        padding: '0 24 0 24'
                    }
                }, {
                    title: 'login',
                    xtype: 'login',
                    itemId: 'login-tab',
                    defaults: {
                        padding: '0 44 0 44'
                    }
                }, {
                    title: 'maintenance',
                    xtype: 'maintenance',
                    itemId: 'maintenance-tab',
                    defaults: {
                        padding: '0 24 0 24'
                    }
                }, {
                    title: 'selectuser',
                    xtype: 'selectuser',
                    itemId: 'selectuser-tab'
                }, {
                    title: 'discovery',
                    xtype: 'discovery',
                    itemId: 'discovery-tab',
                    defaults: {
                        padding: '0 44 0 44'
                    }
                }]
            }]
        }];

        this.callParent();
    }
});
