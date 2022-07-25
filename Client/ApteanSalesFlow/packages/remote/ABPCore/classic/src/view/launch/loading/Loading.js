Ext.define('ABP.view.launch.loading.Loading', {
    extend: 'Ext.container.Container',
    alias: 'widget.loadingscreen',
    componentCls: 'launch-canvas',

    layout: {
        type: 'vbox',
        align: 'center',
        pack: 'center'
    },

    height: '100%',
    width: '100%',

    cls: 'ABP-preauth-loading',

    items: [
        {
            xtype: 'container',
            height: 140,
            layout: {
                type: 'vbox',
                align: 'center'
            },
            items: [
                {
                    xtype: 'component',
                    html: '<div class="login-hdr"></div>',
                    focusable: false
                },
                {
                    xtype: 'component',
                    cls: 'bootstrap-loading',
                    flex: 1,
                    hidden: '{hidePreAuthMessage}',
                    html: 'Connecting<div class="bootstrap-loading-dot1">.</div><div class="bootstrap-loading-dot2">.</div><div class="bootstrap-loading-dot3">.</div>'
                }
            ]
        }
    ]
});