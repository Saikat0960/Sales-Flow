/////////////////////////////////////////////////////////////////////////////////////
//  Name:      app/view/session/feature/FeatureCanvas.js
//  Purpose:   Provide basic platform for a feature canvas
//  Created:   7/8/2014 - Joe Blenis
//  Last Edit: 7/8/2014 - Joe Blenis - Created File
/////////////////////////////////////////////////////////////////////////////////////
Ext.define('ABP.view.session.feature.FeatureCanvas', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.featurecanvas',
    requires: [
        'ABP.view.session.help.HelpView',
        'ABP.view.session.about.About',
        'ABP.view.session.logger.LoggerPage',
        'ABP.view.session.toolbarTop.ToolbarTop',
        'ABP.view.session.feature.FeatureCanvasController',
        'ABP.view.session.feature.FeatureCanvasModel',
        'ABP.view.session.mainMenu.MainMenu',
        'ABP.view.session.subMenu.SubMenu',
        'ABP.view.session.favorites.FavoritesManager',
        'ABP.view.session.headlines.HeadlinesManager'
    ],
    controller: 'featurecanvascontroller',
    viewModel: {
        type: 'featurecanvasmodel'
    },

    subMenuOpened: false,
    menuOpened: false,
    settingsShown: false,
    layout: 'absolute',
    //height: '100%',
    cls: 'feature-canvas',
    ariaRole: 'main',
    autoEl: 'main',
    
    //dockedItems: [{ xtype: 'toolbartop'}],
    flex: 1,
    initComponent: function () {
        var me = this;
        var vm = me.getViewModel();
        var autoHide = me.getViewModel().get('conf').settings.autoHideMenu;
        vm.set('autoHide', autoHide);
        me.items = [
            {
                xtype: 'container', anchor: '100% 100%', layout: 'fit', itemId: 'topContainer', items: [
                    { xtype: 'container', anchor: '100% 100%', layout: 'fit', itemId: 'settingsContainer', items: [], hidden: true },
                    { xtype: 'container', anchor: '100% 100%', style: 'z-index: 2;', layout: 'fit', itemId: 'applicationContainer', items: [] }
                ]
            }];

        me.callParent();
    }

});
