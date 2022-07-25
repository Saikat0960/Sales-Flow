Ext.define('ABP.view.session.favorites.FavoritesEditPanelModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.favoritesEditPanel',

    data: {
        depthLimit: null,
        allowItemRename: null,
        favorites_editPanel_title: '',
        favorites_editPanel_name: '',
        favorites_editPanel_source: '',
        favorites_editPanel_moveToGroup: '',
        button_cancel: '',
        button_delete: '',
        button_save: ''
    }
});
