/**
 * @private
 * Shared internal (non-public) code for classes that work with the Main Menu.
 */
Ext.define('ABP.internal.util.MainMenu', {

    singleton: true,

    /**
     * Returns a copy of all the favorite items as an array of nodes (Ext.data.TreeModel objects). 
     * 
     * When lazyFill:true, the resulting nodes still have the unrendered data in them, even if copied. So this is safe.
     * 
     * @returns {Ext.data.TreeModel[]} Array of nodes (Ext.data.TreeModel).
     */
    copyFavorites: function () {
        var me = this,
            favorites = me.getFavoritesNode();

        if (!favorites) {
            return null;
        }

        // Copy the favourite node so existing favorites are not altered by the caller?
        var favoritesWork = favorites.copy(undefined, undefined, true);
        return favoritesWork.childNodes;
    },

    /**
     * Returns a JSON encoded serialization of the favorite items.
     * 
     * This will be a complete combination of nodes and data if the TreeStore has lazyFill:true.
     * That is, although not all nodes may have been created because the user has not visited them yet, the underlying raw data 
     * is still correctly serialized along with the nodes.
     * @returns {Array} Array of nodes and data items as a serialized JSON string.
     */
    jsonSerializeFavorites: function () {
        var me = this,
            navStore = Ext.getStore('navSearch'),
            favorites = me.getFavoritesNode();

        if (!favorites) {
            return null;
        }

        // TODO: Once the new lazyFill:true code has been bedded in and known to be bug free, remove the else here, and remove the test for lazyFill. If "then" branch should be able to handle both cases.
        if (navStore.lazyFill) {
            // This is the complex case.
            // Under the favorites node there can be a mix of nodes and child data under the nodes that is unrendered
            // and therefore does not have child nodes of its own.
            // So we have to build up the heirchary as a combination of child nodes and child data.
            var serializedFavorites = this.serializeNodeWithData(favorites, navStore);
            return Ext.JSON.encode(serializedFavorites.children);
        } else {
            // If lazyFill:false then things are pretty simple. 
            // Use the build-in serializer for nodes.
            return Ext.JSON.encode(favorites.serialize().children);
        }
    },

    /**
     * Return the navSearch's favorites node 'container_nav-favorites'.
     * @return {Ext.data.TreeModel} The navSearch's favorites node 'container_nav-favorites'.
     */
    getFavoritesNode: function () {
        var navStore = Ext.getStore('navSearch');
        if (!navStore) {
            return null;
        }
        return navStore.getNodeById('container_nav-favorites'); // Even if the store has lazyFill:true This is safe because the tree will create top-level nodes.
    },

    /**
     * Creates an object with children arrays of objects that represent the node and it child nodes and data. 
     *
     * Ensures there are no duplicates between the nodes and the data.
     * @param {Ext.data.TreeModel} node The node to serialize.
     * @param {Ext.data.TreeStore} store The store the node comes from.
     * @param {Ext.data.writer.Writer} writerParam Pass null. In recursion, an Ext.data.writer.Json is passed in.
     * @result {Object}
     */
    serializeNodeWithData: function (node, store, writerParam) {
        var writer = writerParam || new Ext.data.writer.Json({
            writeAllFields: true
        });

        // Serializes the node record. The children have to be done separately.
        var result = writer.getRecordData(node);
        var children = [];

        // Get child nodes.
        var childNodes = node.childNodes;
        var len = Ext.isArray(childNodes) ? childNodes.length : 0;
        for (var i = 0; i < len; i++) {
            children.push(this.serializeNodeWithData(childNodes[i], store, writer));
        }

        // Get child data.
        var childData = node.data.children;
        var len = Ext.isArray(childData) ? childData.length : 0;
        for (var i = 0; i < len; i++) {
            // Only add this data item if its id is not already serialized.
            var unique = Ext.Array.every(children, function (childNode) {
                return !(childNode.id === childData[i].id);
            });
            if (unique) {
                // At this point the data is just raw data, and not a TreeRecord. 
                // Unfortunately the Ext.data.writer.Writer only works with a model record,
                // so we have to convert the data to one before serialization.
                var newRec = store.getModel().loadData(childData[i]);
                children.push(this.serializeNodeWithData(newRec, store, writer));
            }
        }

        // Only define a "children" property in the result if there are children.
        if (!Ext.isEmpty(children)) {
            result.children = children;
        }

        return result;
    },

});