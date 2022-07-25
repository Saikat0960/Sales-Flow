Ext.define('ABP.view.launch.LaunchCanvas', {
    extend: 'Ext.Container',
    alias: 'widget.launchcanvas',
    requires: [
        'ABP.view.launch.LaunchCarousel',
        'ABP.view.launch.login.Login',
        'ABP.view.launch.settings.Settings',
        'ABP.view.launch.maintenance.Maintenance',
        'ABP.view.launch.selectuser.SelectUser',
        'ABP.view.launch.discovery.Discovery'
    ],
    itemId: 'launch-canvas',
    cls: 'launch-canvas',
    layout: {
        type: 'vbox',
        align: 'center',
        pack: 'center'
    },
    items: [
        {
            xtype: 'sessionbanner',
            docked: 'top'
        },
        {
            xtype: 'container',
            userCls: 'login-form',
            layout: {
                type: 'vbox',
                align: 'stretch',
                pack: 'center'
            },
            itemId: 'login-form-wrapper',
            cls: 'login-form-wrapper',
            // Hidden set true here to allow bootstrap process to finish deciding which login step to show before then showing the correct login step
            hidden: true,
            items: [
                {
                    xtype: 'component',
                    cls: 'login-hdr-wrapper',
                    itemId: "login-title",
                    html: '<div class="login-hdr"></div>',
                    tabIndex: -1,
                    focusable: false
                },
                {
                    xtype: 'launchcarousel',
                    flex: 1,
                    items: [
                        {
                            title: 'settings',
                            xtype: 'settings',
                            itemId: 'settings-tab'
                        },
                        {
                            title: 'selectuser',
                            xtype: 'selectuser',
                            itemId: 'selectuser-tab'
                        },
                        {
                            title: 'discovery',
                            xtype: 'discovery',
                            itemId: 'discovery-tab'
                        },
                        {
                            title: 'login',
                            xtype: 'login',
                            itemId: 'login-tab'
                        },
                        {
                            title: 'maintenance',
                            xtype: 'maintenance',
                            itemId: 'maintenance-tab'
                        }
                    ]
                }
            ]
        }]
});
