Ext.define('ABP.view.launch.loading.LoadingScreen', {
    extend: 'Ext.LoadMask',
    alias: 'widget.apteanloadingscreen',

    layout: {
        type: 'vbox',
        align: 'center',
        pack: 'center'
    },

    initComponent: function () {
        this.items = [
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
                        componentCls: 'bootstrap-loading',
                        flex: 1,
                        html: 'Connecting<div class="bootstrap-loading-dot1">.</div><div class="bootstrap-loading-dot2">.</div><div class="bootstrap-loading-dot3">.</div>'
                    }
                ]
            }];
    }
});
