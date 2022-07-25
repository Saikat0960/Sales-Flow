/**
 * Base controller code for Modern and Classic favorite manager controllers.
 * 
 * IMPORTANT: Shared between Modern and Classic.
 */
Ext.define('ABP.view.session.favorites.FavoritesManagerControllerBase', {
    extend: 'Ext.app.ViewController',

    init: function () {
        var me = this,
            view = me.getView();

        // Make a copy of the favorites showing in the menu, because any edits may get cancelled.
        var favStoreCopy = me.getFavoritesStoreCopy();
        view.favTree = view.down('#favoritestree');
        view.favTree.setStore(favStoreCopy);
    },

    /**
     * @private
     * Returns a copy of the favorites, as a new store.
     */
    getFavoritesStoreCopy: function () {
        var me = this;

        var favoritesCopy = ABP.internal.util.MainMenu.copyFavorites();

        // Create the store copy.
        var favStore = Ext.create('Ext.data.TreeStore', {
            root: {
                expanded: true,
                children: favoritesCopy
                //children: favoritesCopy.getData().children || null // Copy underlying child data instead of nodes because nodes won't exist unless the user has expanded to them when the navSearch store is lazyFill: true
                //children: favoritesCopy.childNodes || null
            }
        });

        return favStore;
    },

    /**
     * Save was clicked - push the new favorites into the nav menu.
     */
    onSaveClick: function () {
        var me = this,
            toastShown = false,
            view = me.getView(),
            favorites = [];

        if (!view.favTree) {
            return;
        }
        // Get the root node and build up the favorites list.
        var treeStore = view.favTree.getStore();
        var root = treeStore.getRootNode();
        if (root.hasChildNodes()) {
            favorites = me.buildChildNode(root, toastShown);
        }
        // Update favorites.
        me.fireEvent('mainmenu_updateFavorites', favorites);
        // Hide the favorites manager.
        me.fireEvent('featureCanvas_hideSetting');
    },

    /**
     * Cancel was clicked - do nothing and close this view.
     */
    onCancelClick: function () {
        this.fireEvent('featureCanvas_hideSetting');
    },

    privates: {

        /**
         *  Recursively build one node.
         */
        buildChildNode: function (parentNode, toastShown) {
            var node = [],
                childNode,
                i,
                msg,
                children;

            for (i = 0; i < parentNode.childNodes.length; i++) {
                childNode = parentNode.childNodes[i];
                if (childNode.isLeaf()) {
                    node.push(childNode.data);
                } else {
                    // Skip empty groups. Toast once to indicate empty groups will be removed.
                    if (!childNode.hasChildNodes()) {
                        if (!toastShown) {
                            msg = ABP.util.Common.geti18nString('favorites_toast_deleteEmptyGroups');
                            toastShown = true;
                            ABP.view.base.toast.ABPToast.show(msg);
                        }
                        continue;
                    }
                    children = this.buildChildNode(childNode, toastShown);
                    if (children && children.length > 0) {
                        node.push({
                            appId: 'container',
                            config: {
                                icon: 'icon-folder',
                                text: childNode.data.text,
                            },
                            text: childNode.data.text,
                            //id: childNode.id, // TODO Why was id never set with Steven's original code?
                            uniqueId: childNode.id,
                            enabled: true,
                            children: children
                        });
                    }
                }
            }
            return node;
        }
    }

});