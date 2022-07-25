Ext.define('ABP.view.session.favorites.FavoritesManagerModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.favoritesmanagermodel',

    data: {
        favoriteTitle: ''
    },

    formulas: {
        hideEditIcon: {
            bind: {
                _depthLimit: '{conf.settings.favorites.depthLimit}',
                _allowItemRename: '{conf.settings.favorites.allowItemRename}'
            },
            get: function (data) {
                // If items cannot be renamed and groups are not allowed there is no reason to show the edit button.
                if (data._depthLimit === 1 && data._allowItemRename === false) {
                    return true;
                }
                return false;
            }
        }
    }
});
