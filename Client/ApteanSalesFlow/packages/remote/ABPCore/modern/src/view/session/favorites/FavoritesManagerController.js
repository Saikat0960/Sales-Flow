/**
 * Controller for the Favorite manager.
 */
Ext.define('ABP.view.session.favorites.FavoritesManagerController', {
    extend: 'ABP.view.session.favorites.FavoritesManagerControllerBase',
    alias: 'controller.favoritesManager',

    onBackClick: function () {
        var me = this,
            view = me.getView();
        var favList = view.down('#favoritestree');
        favList.onBackTap();
    },

    onNavigateBack: function (nestedList, node, lastActiveList) {
        var me = this,
            view = me.getView(),
            vm = me.getViewModel();

        // Check just in case the navigate back button was not properly hidden.
        if (!node.parentNode) {
            return;
        }
        if (node.parentNode.id === 'root') {
            view.setTitle(vm.get('i18n.favorites_title'));
            view.hideBackButton();
        } else {
            view.setTitle(node.parentNode.get('text'));
        }
        me.__resolvePendingActions(nestedList);
    },

    /**
     * New group clicked - Ensure newgrouptext has a value and if so create a new empty group and insert at the top (right under the root).
     */
    addNewGroup: function () {
        var me = this,
            view = me.getView(),
            textField = view.down('#newgrouptext'),
            favList = view.down('#favoritestree');
        textValue = textField.getValue();

        if (!textValue) {
            textField.markInvalid(ABP.util.Common.geti18nString('favorites_newGroup_emptyText'));
            textField.focus();
            return;
        }
        if (favList) {
            var swiper = favList.getPlugin('nestedlistswiper');
            if (swiper) {
                swiper.dismissAll();
            }
        }
        var currentParent = view.favTree.getLastNode();
        if (currentParent) {
            currentParent.insertChild(0, {
                text: textValue,
                iconCls: 'icon-folder',
                label: textValue,
                leaf: false,
                expanded: false
            });
        }
        textField.setValue(null);
    },

    editItemClicked: function (list, action) {
        var allowItemRename = true;
        if (action.record.isLeaf()) {
            allowItemRename = ABP.util.Common.getViewModelProperty('conf.settings.favorites.allowItemRename');
        }
        var editPanel = Ext.create('ABP.view.session.favorites.FavoritesManagerEditPanel', {
            favorite: action.record,
            treeView: list,
            viewModel: {
                data: {
                    allowItemRename: allowItemRename,
                    depthLimit: ABP.util.Common.getViewModelProperty('conf.settings.favorites.depthLimit'),
                    favorites_editPanel_title: ABP.util.Common.geti18nString('favorites_editPanel_title'),
                    favorites_editPanel_name: ABP.util.Common.geti18nString('favorites_editPanel_name'),
                    favorites_editPanel_source: ABP.util.Common.geti18nString('favorites_editPanel_source'),
                    favorites_editPanel_moveToGroup: ABP.util.Common.geti18nString('favorites_editPanel_moveToGroup'),
                    button_cancel: ABP.util.Common.geti18nString('button_cancel'),
                    button_delete: ABP.util.Common.geti18nString('button_delete'),
                    button_save: ABP.util.Common.geti18nString('button_save')
                }
            }
        });
        editPanel.showBy(Ext.getBody(), 'c-c');
    },

    /**
     * The 'x' was clicked. If the item was a leaf or empty group simply delete it otherwise prompt the user before deleting.
     */
    removeItemClicked: function (list, action) {
        var me = this;
        var favorite = action.record;
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
    },

    onListitemTapped: function (nestedList, list, index, target, record) {
        var me = this,
            view = me.getView();

        if (!record || record.isLeaf()) {
            return;
        }
        view.setTitle(record.get('text'));
        view.showBackButton();
        me.__resolvePendingActions(nestedList);
    },

    /**
     * Resolves all pending actions.
     */
    __resolvePendingActions: function (nestedList) {
        // For now simply dismiss all pending.
        var swiper = nestedList.getPlugin('nestedlistswiper');
        if (swiper) {
            swiper.dismissAll();
        }
    }
});