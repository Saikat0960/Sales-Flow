Ext.define('ABP.view.session.SessionCanvasModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.sessioncanvasmodel',
    requires: [
        'ABP.store.ABPRecentSearchStore'
    ],

    data: {
        menuOpen: false,
        rightPaneOpen: false,
        rightPaneTabs: [],
        searchBar: {
            Open: false,
            menuOptions: [],
            selectedSearchCls: 'icon-earth',
            selectedSearch: 'global',
            val: ''
        }
    },

    stores: {
        searchProviders: {
            storeId: 'searchStore',
            model: 'ABP.model.SearchModel'
        }
    }
});