/**
 * Controller for the Favorites manager.
 */
Ext.define('ABP.view.session.favorites.FavoritesManagerController', {
    extend: 'ABP.view.session.favorites.FavoritesManagerControllerBase',
    alias: 'controller.favoritesManager',

    /**
     * Expand all clicked - Expand all items under the root.
     */
    onExpandAllClick: function () {
        var me = this,
            view = me.getView();

        if (view.favTree) {
            view.favTree.getRootNode().expandChildren(true);
        }
    },

    /**
     * Collapse all clicked - collapse everything under the root (does not collapse root).
     */
    onCollapseAllClick: function () {
        var me = this,
            view = me.getView();

        if (view.favTree) {
            view.favTree.getRootNode().collapseChildren(true);
        }
    },

    /**
     * New group clicked - Ensure newgrouptext has a value and if so create a new empty group and insert at the top (right under the root).
     */
    addNewGroup: function () {
        var vm = this.getViewModel();
        var view = this.getView();
        var value = vm.get('favoriteTitle');
        var textField = view.down('#newgrouptext');

        if (!value) {
            textField.markInvalid(ABP.util.Common.geti18nString('favorites_newGroup_emptyText'));
            textField.focus();
            return;
        }

        view.favTree.getRootNode().insertChild(0, {
            text: value,
            iconCls: 'icon-folder',
            label: value,
            leaf: false,
            expanded: false
        });

        // textField.setValue(null);
        vm.set('favoriteTitle', '');
    },

    /**
     * Group title change - Update favoriteTitle on vm
     */
    onChange: function (e) {
        var vm = this.getViewModel();
        vm.set('favoriteTitle', e.value);
    },

    editItemClicked: function (treeView, rowIndex, colIndex, col, event, favorite) {
        var allowItemRename = true;
        if (favorite.isLeaf()) {
            // If this is not a group check if the name is editable.
            var favConfig = ABP.util.Config.getSessionConfig().settings.favorites;
            if (favConfig && Ext.isBoolean(favConfig.allowItemRename)) {
                allowItemRename = favConfig.allowItemRename;
            }
        }
        var editPanel = Ext.create('ABP.view.session.favorites.FavoritesManagerEditPanel', {
            favorite: favorite,
            treeView: treeView,
            viewModel: {
                data: {
                    allowItemRename: allowItemRename
                }
            }
        });
        editPanel.show();
    },

    /**
     * The 'x' was clicked. If the item was a leaf or empty group simply delete it otherwise prompt the user before deleting.
     */
    removeItemClicked: function (treeView, rowIndex, colIndex, col, event, favorite) {
        var me = this;
        // This check covers both leaf nodes and empty groups, do not prompt before delete for either.
        if (favorite.hasChildNodes() === false) {
            favorite.remove();
        }
        else {
            // Otherwise the group has children so be sure to prompt first.
            ABP.view.base.popUp.PopUp.showOkCancel(
                me.getViewModel().data.i18n.favorites_confirmDeleteGroupMsg,
                me.getViewModel().data.i18n.favorites_confirmDeleteGroupTitle,
                function (result) {
                    if (result) {
                        favorite.remove(true);
                    }
                });
        }
    }

});
