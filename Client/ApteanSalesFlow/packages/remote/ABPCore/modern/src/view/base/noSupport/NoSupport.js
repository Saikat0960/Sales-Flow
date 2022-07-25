Ext.define('ABP.view.base.noSupport.NoSupport', {
    extend: 'Ext.Container',
    alias: 'widget.nosupportpage',
    layout: {
        type: 'vbox',
        align: 'center',
        pack: 'center'
    },
    cls: 'launch-canvas',
    fullscreen: true,
    height: '100%',
    width: '100%',
    items: [
        {
            xtype: 'component',
            html: 'This product does not support desktop browsers.<br>Please open this website on a mobile device.',
            style: {
                'color': 'white',
                'font-size': '1.75em',
                'text-align': 'center'
            }
        }

    ]
});