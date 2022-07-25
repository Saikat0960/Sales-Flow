Ext.define('ABP.view.session.SessionBanner', {
    extend: 'Ext.Container',
    requires: [
        'ABP.view.session.SessionBannerController'
    ],
    dock: 'top',
    xtype: 'sessionbanner',
    controller: 'sessionbannercontroller',
    layout: 'fit',
    cls: 'session-banner',

    ariaRole: 'banner'
});