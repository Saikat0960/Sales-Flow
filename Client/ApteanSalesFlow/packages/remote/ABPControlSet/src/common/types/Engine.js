/**
 * Engine configuration.
 */
Ext.define("ABPControlSet.common.types.Engine", {
    /** @ignore */
    requires: [
        'ABPControlSet.common.types.AssociatedDataRoot'
    ],

    /**
     * @cfg {String} appId
     * The application for which this form engine is associated. Used to help hook general interactions back to the view controller for out of context items.
     */
    appId: null,

    /**
     * @cfg {Function} sort
     * If a method is provided, the root of items will be sorted with this function prior to processing.
     */
    sort: null,

    /**
     * @cfg {Boolean} decode
     * If true, the value of the root will be decoded first.
     */
    decode: false,

    /**
     * @cfg {Boolean} responsive
     * Whether or not to use the responsive logic of the layouts.
     */
    responsive: true,

    /**
     * @cfg {Boolean} generateModel
     * If true, a model will be generated and returned with the result in the {@link ABPControlSet.common.FormEngine#processResult processResult} hook function.
     *
     */
    generateModel: false,

    /**
     * @cfg {Boolean} modelFieldPropName
     * The property which contains the field name which the value of the field should be matched to.
     *
     * Note: Only valid if generateModel is true.
     */
    modelFieldPropName: null,

    /**
     * @cfg {Boolean} modelIdentifierPropName
     * The property which contains the unique name for the model schema. This is used to ensure duplication of effort for creating a model is not needed if it is already created.
     *
     * Note: Only valid if generateModel is true.
     */
    modelIdentifierPropName: null,

    /**
     * @cfg {Boolean} flat
     * Whether or not the data blob should be processed as a flat structure. If the structure is already in the correct hierarchy, set to false.
     */
    flat: true,

    /**
     * @cfg {String} rootComponentPropName
     *
     * The property which value holds the array of items to be processed as the components of the metadata.
     */
    rootComponentPropName: '.',

    /**
     * @cfg {ABPControlSet.common.types.AssociatedDataRoot[]}
     * Reader config for objects associated with components (events, columns, etc). These will be sent to an extendable method with the component so they can be configured into the component.
     */
    associatedDataRoots: [],

    /**
     * @cfg {String} parentPropName
     * When adding components to their parent, we need the properties to accurately find the relationship.
     *
     * This configuration value is used to help find the parent of an item when the structure is flat. Used with the {@link matchChildWithName matchChildWithName} property.
     *
     * Note: Only valid when flat is true.
     */
    parentPropName: '',

    /**
     * @cfg {String} matchChildWithName
     * When adding components to their parent, we need the properties to match up this relationship.
     * This is the child property to use for matching a value to the parent.
     *
     * Note: Only valid when flat is true.
     */
    matchChildWithName: '',

    /**
     * @cfg {String} ownerPropName
     * An additional way to match to a parent if there needs to be another type of associated which parentPropName does not cover.
     *
     * Note: Only valid when flat is true.
     */
    ownerPropName: '',

    /**
     * @cfg {String[]} childrenProps
     * If the json is NOT flat, the values of this array are used to help find child items of an item in the metadata, and traverse down into the hierarchy of the metadata structure.
     *
     * Note: Only valid when flat is false.
     */
    childrenProps: [],

    /**
     * @cfg {String} originalDataPropName
     * A property name where the engine will store the original metadata on the component. If empty, the data will not be retained.
     */
    originalDataPropName: '',

    /**
     * @cfg {Object} assoc
     * Global key value pairs to match properties on the metadata object to a property on the Ext component. These will be applied to all items being processed.
     */
    assoc: {
    },

    /**
     * @cfg {Object} advancedAssoc
     * Advanced association mappings to be applied only to specific types of objects. This will rely on the value of the property in the {@link assoc assoc} which maps to the xtype.
     * Each property in the advancedAssoc object can have a value with the same object structure as the {@link assoc assoc} object.
     *
     * If the xtype value mapped to an object in your metadata, for example, is 'datafield', the below advanced key values would look like this:
     *
     *      advancedAssoc: {
     *          'datafield': {
     *              // Same key/value structure as 'assoc'
     *          }
     *      },
     */
    advancedAssoc: {
    },

    /**
     * @cfg {Object} xtypes
     * xtypes are what drive the component creation using a simple alias to the component.
     *
     * The {@link assoc assoc} object must have an xtype key, and a value for which property is meant to be read for the xtype mapping. The value found, is the key within this object mapping, and the value found here is the Ext or ABPControlSet component xtype to use.
     *
     *      xtypes: {
     *          'datafield': 'abptextfield'
     *      }
     */
    xtypes: {
    },

    /**
     * @cfg {Object} defaults
     * Defaults to set on each field type.
     *
     * Similar to the other properties, the field type is what creates the mapping.
     *
     *      defaults: {
     *          'datafield': {
     *              hideLabel: true
     *          }
     *      }
     *
     * Allows or applying defaults to child properties of items as well.
     *  For example:
     *
     *          // If an item has the property tabs as an array, the resulting objects from those tabs will have xtype: 'container' defaulted to them.
     *          childrenProps: {
     *              'tabs': {
     *                  xtype: 'container'
     *              }
     *          }
     */
    defaults: {
    },

    /**
     * @cfg {String} interactionsProp
     *
     * The property which value holds the array of metadata items to be processed as the interactions of form.
     */
    interactionsProp: null,
    /**
     * @cfg {Object} interactionAssoc
     * Key value pairs to match properties on the metadata object to a property on the interaction.
     */
    interactionAssoc: null,

    /**
     * @cfg {String[]} interactionChildrenProps
     * The values of this array are used to help find child items of an interaction in the metadata, and traverse down into the hierarchy of the metadata structure.
     *
     */
    interactionChildrenProps: null,

    /**
     * @cfg {Function} interactionsSort
     * If a method is provided, the root of the interactions will be sorted with this function prior to processing.
     */
    interactionsSort: null,

    /** @ignore */
    constructor: function (config) {
        config = config || {};
        this.callParent(arguments);
        Ext.apply(this, config);
    }
});