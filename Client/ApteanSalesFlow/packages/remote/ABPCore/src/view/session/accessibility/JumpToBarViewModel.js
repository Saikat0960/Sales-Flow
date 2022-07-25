Ext.define('ABP.view.session.accessibility.JumpToBarViewModel', {
        extend: 'Ext.app.ViewModel',
        requires: [
            'ABP.model.WCAGRegion'
        ],
        alias: 'viewmodel.jumptobar',
        stores: {
            targets: {
                model: 'ABP.model.WCAGRegion',
                data : [
                    {domId: 'NavMenu',         text: 'Main Menu'},
                    {domId: 'GlobalSearch',    text: 'Global Search'},
                    {domId: 'UserSettings',    text: 'User Settings'},
                    {domId: 'MainContent',     text: 'Main Content'}
                ]
            }
        }
    });