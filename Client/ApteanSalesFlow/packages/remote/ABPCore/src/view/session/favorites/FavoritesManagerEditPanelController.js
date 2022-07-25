/**
 * Controller for the favorite edit panels.
 */
Ext.define('ABP.view.session.favorites.FavoritesManagerEditPanelController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.favoriteseditpanel',

    init: function () {
        var me = this,
            view = me.getView(),
            favorite = view.getFavorite(),
            nameField = view.down('#favoriteName'),
            sourceField = view.down('#favoriteSource'),
            groupsField = view.down('#favoriteGroups'),
            favoriteData = favorite.getData();

        nameField.setValue(favoriteData.text);
        sourceField.setValue(me.__getSourceText(favoriteData));
        me.__buildGroups(favorite, groupsField);
    },

    // Close the edit panel.
    onCloseClick: function () {
        this.getView().close();
    },

    // Delete this favorite item or group.
    onDeleteClick: function () {
        var me = this,
            view = me.getView(),
            favorite = view.getFavorite();

        // This check covers both leaf nodes and empty groups, do not prompt before delete for either.
        if (favorite.hasChildNodes() === false) {
            favorite.remove();
            view.close();
        }
        else {
            view.close();
            // Otherwise the group has children so be sure to prompt first.
            ABP.view.base.popUp.PopUp.showOkCancel(
                ABP.util.Common.geti18nString('favorites_confirmDeleteGroupMsg'),
                ABP.util.Common.geti18nString('favorites_confirmDeleteGroupTitle'),
                function (result) {
                    if (result) {
                        favorite.remove(true);
                    }
                });
        }
    },

    // Update this favorite - display text and folder location.
    onSaveClick: function () {
        var me = this,
            view = me.getView(),
            favorite = view.getFavorite(),
            nameField = view.down('#favoriteName'),
            groupsField = view.down('#favoriteGroups'),
            selectedGroup = groupsField.getValue(),
            treeStore = favorite.getTreeStore();

        if (Ext.isEmpty(nameField.getValue())) {
            return;
        }
        // Set the new text.
        favorite.set('text', nameField.getValue());
        // If a group was specified, move the favorite/group to the new location.
        if (selectedGroup) {
            var targetGroup = treeStore.getNodeById(selectedGroup);

            // getNodeById appears to not work consistenly in ExtJs 6.5.3 so this manual method of group discovery is necessary.
            if (!targetGroup) {
                targetGroup = me.__findTargetGroup(treeStore.getRootNode(), selectedGroup);
                if (Ext.isArray(targetGroup) && targetGroup.length === 1) {
                    targetGroup = targetGroup[0];
                }
            }
            if (targetGroup) {
                targetGroup.insertChild(0, favorite);
            } else {
                ABP.util.Logger.logWarn('Could not find favorite group' + targetGroup);
            }
        }

        view.close();
    },

    // Build the Favorite group store and use it to populate the groups combobox.
    __buildGroups: function (favorite, groupsField) {
        var depthLimit = ABP.util.Common.getViewModelProperty('conf.settings.favorites.depthLimit');
        var root = favorite.getTreeStore().getRootNode();
        // Add the "< No Group >" node and concat the rest of the groups found within the root.
        var groups = [{
            id: 'root',
            text: ABP.util.Common.geti18nString('favorites_editPanel_noGroup')
        }]
        if (depthLimit === 0 || favorite.isLeaf()) {
            // special case - cannot move groups into other groups with depthLimit equal to 2. Case of 1 is covered since this field is hidden.
            groups = groups.concat(this.__getAllGroupsDeep(root));
        }
        // Remove root node and add < No group >
        groupsField.setStore(Ext.create('Ext.data.Store', {
            fields: ['id', 'text'],
            data: groups
        }));
    },

    // Depth search on the provided node, returns all groups (non-leaf nodes)
    __getAllGroupsDeep: function (node) {
        var me = this,
            view = me.getView(),
            favorite = view.getFavorite(),
            allGroups = [];

        // Skip empty nodes & leaf nodes.
        // Also skip the node if it is current edit target as its children are not viable drop targets.
        if (!node || node.isLeaf() || node.id === favorite.id) {
            return [];
        } else {
            if (node.id !== 'root') {
                allGroups.push({
                    id: node.id,
                    text: node.getData().text
                });
            }
            node.eachChild(function (Mynode) {
                allGroups = allGroups.concat(me.__getAllGroupsDeep(Mynode));
            });
        }
        return allGroups;
    },

    // Deeply searches "node" to find the specified non-leaf with an id of groupId.
    __findTargetGroup: function (node, groupId) {
        var me = this,
            targetGroup = [];

        if (!node || node.isLeaf()) {
            return [];
        } else {
            if (node.id === groupId) {
                targetGroup.push(node);
            }
            node.eachChild(function (childNode) {
                targetGroup = targetGroup.concat(me.__findTargetGroup(childNode, groupId));
            });
        }
        return targetGroup;
    },

    // Calculate the "source" text - this text
    __getSourceText: function (favoriteData) {
        var sourceText;
        if (favoriteData.labelKey) {
            sourceText = ABP.util.Common.geti18nString(favoriteData.labelKey);
            if (sourceText) {
                return sourceText;
            }
        }
        if (favoriteData.config) {
            return favoriteData.config.text || favoriteData.text;
        }
        return favoriteData.text;
    }
});