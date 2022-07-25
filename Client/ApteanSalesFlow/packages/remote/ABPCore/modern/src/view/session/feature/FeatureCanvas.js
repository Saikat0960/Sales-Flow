Ext.define('ABP.view.session.feature.FeatureCanvas', {
    extend: 'Ext.Container',
    alias: 'widget.featurecanvas',
    requires: [
        'ABP.view.session.feature.FeatureCanvasController',
        'ABP.view.session.feature.FeatureCanvasModel',
        'ABP.view.session.toolbarTop.ToolbarTop',
        'ABP.view.session.help.Help',
        'ABP.view.session.about.About',
        'ABP.view.session.logger.LoggerPage',
        'ABP.view.session.settings.SettingsPage',
        'ABP.view.session.toolbarTop.search.SearchBar',
        'ABP.view.session.favorites.FavoritesManager',
        'ABP.view.session.thumbbar.Thumbbar',
        'ABP.view.session.thumbbar.ThumbbarTray'
    ],
    controller: 'featurecanvascontroller',
    viewModel: {
        type: 'featurecanvasmodel'
    },
    cls: 'feature-canvas',
    itemId: 'feature-canvas',
    ariaRole: 'main',
    autoEl: 'main',

    height: '100%',
    width: '100%',
    layout: 'vbox',
    flex: 1,
    settingsShown: false,
    items: [
        {
            xtype: 'container',
            itemId: 'topContainer',
            layout: 'vbox',
            flex: 1,
            height: '100%',
            width: '100%',
            items: [
                {
                    xtype: 'container',
                    flex: 1,
                    height: '100%',
                    width: '100%',
                    layout: 'hbox',
                    itemId: 'settingsContainer',
                    hidden: true,
                    items: []
                },
                {
                    xtype: 'container',
                    flex: 1,
                    height: '100%',
                    width: '100%',
                    layout: 'hbox',
                    itemId: 'applicationContainer',
                    style: 'z-index: 2;',
                    items: []
                }
            ]
        }, {
            xtype: 'thumbbar',
            docked: 'bottom',
            hidden: true
        }, {
            xtype: 'thumbbartray',
            hidden: true
        }
    ],

    initialize: function () {
        this.el.on('swipe', this.getController().interpretSwipe);
    }


});