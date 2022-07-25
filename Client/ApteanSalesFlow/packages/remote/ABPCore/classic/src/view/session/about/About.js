Ext.define('ABP.view.session.about.About', {
    extend: 'ABP.view.components.panel.HeaderPanelBase',
    alias: 'widget.about',
    requires: [
        'ABP.view.session.about.AboutViewModel',
        'ABP.view.session.about.AboutController',
        'ABP.view.session.about.AboutItem',
        'ABP.view.control.ABPLoggingPopup'
    ],
    controller: 'about',
    viewModel: {
        type: 'about'
    },
    bind: {
        title: '{i18n.about_title:htmlEncode}'
    },
    layout: { type: 'vbox' },
    cls: 'x-unselectable about-container',
    closable: true,
    minWidth: 300,
    items: [
        {
            xtype: 'container',
            layout: { type: 'hbox' },
            width: '100%',
            cls: 'about-section-header-container',
            items: [
                {
                    xtype: 'component',
                    flex: 1,
                    cls: 'about-section-header-side'
                },
                {
                    xtype: 'component',
                    bind: {
                        html: '{i18n.about_applications:htmlEncode}'
                    },
                    cls: 'about-section-header'
                },
                {
                    xtype: 'component',
                    flex: 1,
                    cls: 'about-section-header-side'
                }
            ]
        },
        {
            xtype: 'container',
            width: '100%',
            cls: 'about-section about-section-top',
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
                    width: '100%',
                    itemId: 'aboutAppsList',
                    items: []
                }
            ]
        },
        {
            xtype: 'container',
            layout: { type: 'hbox' },
            width: '100%',
            cls: 'about-section-header-container',
            items: [
                {
                    xtype: 'component',
                    flex: 1,
                    cls: 'about-section-header-side'
                },
                {
                    xtype: 'component',
                    bind: {
                        html: '{i18n.about_thirdparty:htmlEncode}'
                    },
                    cls: 'about-section-header'
                },
                {
                    xtype: 'component',
                    flex: 1,
                    cls: 'about-section-header-side'
                }
            ]
        },
        {
            xtype: 'container',
            width: '100%',
            cls: 'about-section about-section-bottom',
            itemId: 'aboutThirdPartySection',
            layout: { type: 'vbox', align: 'center' },
            items: [
                {
                    xtype: 'container',
                    cls: 'about-tile-container',
                    width: '100%',
                    itemId: 'aboutThirdPartyList',
                    items: []
                }]
        }
    ]
});
