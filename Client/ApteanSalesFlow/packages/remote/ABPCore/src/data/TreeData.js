/**
 * Wraps and presents a data item in a TreeStore.
 * 
 * Used to provide an alternative object to a TreeStore node record, which is an Ext.data.TreeModel object.
 * 
 * Used when a node object is not yet created for a TreeStore, and only the underlying data is available.
 * 
 * Note: ABP.data.TreeData is simple and does not try to be a functionally complete copy of Ext.data.TreeModel.
 *
 */
Ext.define('ABP.data.TreeData', {

    xtype: 'abptreedata',

    /**
     * @property (Boolean) isData
     * 
     * The isData property is provided as a way to distinguish between an Ext.data.TreeModel object 
     * (as used when the menu item is a node in the tree) and this ABP.data.TreeData object.
     */
    isData: true,

    /**
     * @property {Object} data
     * 
     * A data record.
     */
    data: null,

    /**
     * @property {Object} parentDataArray
     * 
     * The parent array of the data record.
     */
    parentDataArray: null,

    /**
     * @property {Object} index
     * 
     * The array index of the data in the parentDataArray }
     */
    index: null,

    /**
     * @property {Number} level
     * Where it was possible to determine, this is the depth of the item in the tree store.
     * 
     * If not possible to calculate then null.
     */
    level: null,

    /**
     * @property {String} parentId
     * Where it was possible to determine, this is the id of the parent. 
     * It could be a child node or child data.
     * 
     * If not possible to calculate then null. For example, the parent might be root.
     */
    parentId: null,

    constructor: function (config) {
        this.initConfig(config);
        return this;
    },

    getData: function () {
        return this.data;
    },

    isLeaf: function () {
        return this.data ? this.data.isLeaf : false;
    },

    hasChildNodes: function () {
        return this.data ? (this.data.children ? true : false) : false;
    },

    set: function (key, value) {
        if (this.data) {
            this.data[key] = value;
        }
    },

    /**
     * Remove this data from its parentDataArray.
     */
    remove: function () {
        if (this.parentDataArray) {
            Ext.Array.removeAt(this.parentDataArray, this.index);
        }
    }

});