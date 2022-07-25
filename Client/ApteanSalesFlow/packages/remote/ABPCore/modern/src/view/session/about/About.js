Ext.define('ABP.view.session.about.About', {
    extend: 'ABP.view.components.panel.HeaderPanelBase',
    alias: 'widget.about',
    requires: [
        'ABP.view.session.about.AboutItem',
        'ABP.view.session.about.AboutController',
        'ABP.view.session.about.AboutViewModel'
    ],
    controller: 'about',
    viewModel: {
        type: 'about'
    },
    layout: { type: 'vbox' },
    cls: 'x-unselectable',
    height: '100%',
    width: '100%',
    scrollable: 'y',
    bind: {
        title: '{i18n.about_title}'
    },
    closable: true,
    items: [
        {
            xtype: 'container',
            layout: { type: 'hbox', pack: 'center' },
            width: '100%',
            cls: 'about-section-header-container',
            items: [
                {
                    xtype: 'component',
                    bind: {
                        html: '{i18n.about_applications:htmlEncode}'
                    },
                    cls: 'about-section-header'
                }
            ]
        },
        {
            xtype: 'container',
            width: '100%',
            cls: 'about-section',
            layout: { type: 'vbox', align: 'center' },
            items: [
                {
                    xtype: 'component',
                    bind: {
                        html: '{i18n.about_info:htmlEncode}'
                    },
                    cls: 'about-section-info',
                    width: '100%'
                },
                {
                    xtype: 'container',
                    cls: 'about-tile-container',
                    cls: Ext.os.deviceType === "Phone" ? "about-tile-container about-tile-container_phone" : "about-tile-container about-tile-container_tablet",
                    innerCls: 'about-tile-container-inner',
                    width: '100%',
                    itemId: 'aboutAppsList',
                    items: []
                }
            ]
        },
        {
            xtype: 'container',
            layout: { type: 'hbox', pack: 'center' },
            width: '100%',
            cls: 'about-section-header-container',
            items: [
                {
                    xtype: 'component',
                    bind: {
                        html: '{i18n.about_thirdparty:htmlEncode}'
                    },
                    cls: 'about-section-header'
                }
            ]
        },
        {
            xtype: 'container',
            width: '100%',
            cls: 'about-section',
            itemId: 'aboutThirdPartySection',
            layout: { type: 'vbox', align: 'center' },
            items: [
                {
                    xtype: 'container',
                    cls: Ext.os.deviceType === "Phone" ? "about-tile-container about-tile-container_phone" : "about-tile-container about-tile-container_tablet",
                    innerCls: 'about-tile-container-inner',
                    width: '100%',
                    itemId: 'aboutThirdPartyList',
                    items: []
                }]
        }
    ]
});
