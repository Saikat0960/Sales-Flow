/**
 * Extend this class to tailor a form engine specific to your product needs.
 *
 *      Ext.define('CustomEngine.Engine', {
 *          extend: 'ABPControlSet.common.FormEngine',
 *          singleton: true,
 *          engine: {
 *              // Custom Configs
 *          },
 *          processItem: function (item, metadata) {
 *              // Custom item processing.
 *          }
 *      });
 *
 *      var form = CustomEngine.Engine.processJson(metadataBlobJson);
 *
 * Read the [Control Set: Form Engine Guide](#!/guide/abpcontrolset_getting_started-section-building-an-engine) for more information.
 */
Ext.define('ABPControlSet.common.FormEngine', {
    /** @ignore */
    requires: [
        'ABPControlSet.view.*',
        'ABPControlSet.layout.*',
        'ABPControlSet.common.types.*'
    ],

    /**
     * @cfg {ABPControlSet.common.types.Engine} engine
     * An {@link ABPControlSet.common.types.Engine Engine} configuration.
     */
    engine: null,

    /** @ignore
     *  Current items of the form being created. Will be created and destroyed in each process.
    */
    __currentItems: null,

    /** @template
     * @method processItem
     *  Additional processing of the item.
     *
     * @param {Object} componentConfiguration
     * The new item to be consumed as a component
     * @param {Object} itemMetadata
     * The original metadata for this item
     * @return {Object}
     * It is not required to return a value here since the item being manipulated is the actual item in the result. However, an object can be returned with some additional data for customizing the result.
     *      {
     *          after: Object[], // Array of additional components to add to the items after the current one.
     *          before: Object[] // Array of additional components to add to the items before the current one.
     *      }
     */
    processItem: Ext.emptyFn,

    /** @template
     * @method processInteraction
     *  Additional processing of the interaction.
     *
     * @param {Object} interactionConfiguration
     * The new item to be consumed as an ABPControlSet.common.types.Ineraction.
     * @param {Object} interactionMetadata
     * The original metadata for this interaction.
     */
    processInteraction: Ext.emptyFn,

    /** @template
     * @method processItemField
     *  Additional processing of the item for the model field.
     *  Can return an Ext.data.field.Field object configuration.
     *  If false is returned, the field will not be added to the model. If nothing is returned, by default a field with the name of the value at the engine.modelFieldPropName will be added.
     *
     *  During this step, the item (component) can have its value bound to the view model if this model is being used in the view model.
     *
     *     item.bind = { value: '{modelInDataOfViewModelProp.FieldNamePropValue}' };
     *
     * @param {Object} componentConfiguration
     * The new item to be consumed as a component
     * @param {Object} itemMetadata
     * The original metadata for this item
     * @return {Boolean/Ext.data.field.Field}
     * If false is returned, no field will be added for this item. If nothing is returned, a default field mapped via modelFieldPropName will be added. An Ext.data.field.Field configuration can be returned as well.
     */
    processItemField: Ext.emptyFn,

    /** @template
     *  Additional processing of an associated item.
     *
     *  @param {Object} componentConfiguration
     *  The component associated with this associated item
     *  @param {Object} itemMetadata
     *  The original metadata for the associated root item
     *  @param {Object} associatedConfiguration
     *  The new associated item configuration with mapped values
     *  @param {Object} rootPropName
     *  The root prop name for this association
     */
    processAssociatedItem: Ext.emptyFn,

    /**
     *  @template
     *  Additional processing of the result before it is returned.
     *
     * @param {Object[]} result
     * The resulting object array of components from the engine
     * @param {Ext.data.Model} model
     * The generated Ext.data.Model if generateModel is true. Can be used within a view model for binding purposes.
     * @return {Object/Object[]}
     * The final result to be returned by the original processJson execution.
     */
    processResult: function (result, model) {
        return result;
    },

    /**
     *  @template
     *  Additional processing of a reference property value for an Ext JS component.
     *  This may be needed if the value to be mapped here is not a valid Ext JS reference
     *
     *  Ext JS doc note: Valid identifiers start with a letter or underscore and are followed by zero or more additional letters, underscores or digits. References are case sensitive.
     *
     *  This method is meant to be extended.
     */
    preProcessReference: function (value) { return value; },

    /**
     * @ignore
     * @template
     *  Additional processing of an associated data item for a created Ext JS component. Meant to be used after the form is already created.
     *
     *  @param {Object} componentConfiguration
     *  The component associated with this associated item.
     *  @param {Object} itemMetadata
     *  The original metadata for this item
     *  @param {Object} associatedConfiguration
     *  The new associated item configuration
     *  @param {Object} rootPropName
     *  The root prop name for this association
     */
    processAssociatedItemData: Ext.emptyFn,

    /** @ignore */
    constructor: function (config) {
        config = config || {};
        this.engine = config.engine || this.engine || {};
        this.callParent(arguments);
        // Apply the defaults of the engine if properties are not defined.
        if (!(this.engine instanceof ABPControlSet.common.types.Engine)) {
            this.engine = new ABPControlSet.common.types.Engine(this.engine);
        }
    },

    /**
     *   Process a json blob with the configured engine.
     *   If a callback is provided, this callback will be presented with an array of new Ext JS component configuration objects, else it will be returned immediately.
     *
     * @param {Object/String} json
     * The json string or object to be consumed.
     * @param {Function} callback
     * Optional function to return the result to.
     * @param {Object} additionalConfig
     * Configuration overrides to the original engine configuration. Will be returned to original configuration state after this execution completes.
     * @return {Object/Object[]}
     * The result of the engine process. If the result is processed prior to this via {@link processResult Engine}, the result of this processed will be returned here.
     */
    processJson: function (json, callback, additionalConfig) {
        var originalEngine = Ext.clone(this.engine);
        // Decode the json if it is a string value.
        if (Ext.isString(json)) {
            json = Ext.decode(json);
        }
        if (Ext.isObject(additionalConfig)) {
            Ext.apply(this.engine, additionalConfig);
        }
        var engine = this.engine,
            componentRoot;
        if (!engine.rootComponentPropName || engine.rootComponentPropName === '.') {
            componentRoot = json;
        } else {
            componentRoot = this.findRoot(engine.rootComponentPropName, json);
        }
        if (engine.decode) {
            componentRoot = Ext.decode(componentRoot);
        }
        var result = this.process(componentRoot),
            fields = Ext.isArray(result) ? [] : result.fields,
            components = Ext.isArray(result) ? result : result.items;

        // Process associatedDataRoots
        var associatedDataRoots = engine.associatedDataRoots,
            dataRootConfig,
            dataRoot,
            length = associatedDataRoots.length,
            i = 0,
            modelPreface = "dynamic_",
            modelIdentifierPropName = engine.modelIdentifierPropName,
            modelIdentifier,
            model;

        if (engine.generateModel && modelIdentifierPropName) {
            modelIdentifier = this.getPropValue(json, modelIdentifierPropName);
            if (modelIdentifier && Ext.ClassManager.isCreated(modelPreface + modelIdentifier)) {
                model = Ext.create(modelPreface + modelIdentifier);
                engine.generateModel = false;
            }
        }

        for (; i < length; i++) {
            dataRootConfig = associatedDataRoots[i];
            if (dataRootConfig.rootPropName) {
                dataRoot = this.findRoot(dataRootConfig.rootPropName, json);
                if (dataRootConfig.decode) {
                    try {
                        var encodedDataRoot = Ext.decode(dataRoot);
                        dataRoot = encodedDataRoot;
                    } catch (err) {
                        // Throw out and continue for now.
                    }
                }
                if (dataRoot) {
                    this.processDataAssociation(dataRoot, dataRootConfig, components);
                }
            }
        }
        var interactions;
        if (engine.interactionsProp) {
            var interactionsRoot = this.findRoot(engine.interactionsProp, json);
            if (interactionsRoot) {
                interactions = this.processInteractions(interactionsRoot);
            }
        }

        if (engine.generateModel && !model) {
            modelIdentifier = modelIdentifier || Ext.id();
            Ext.define(modelPreface + modelIdentifier, {
                extend: 'Ext.data.Model',
                fields: fields || []
            });
            model = Ext.create(modelPreface + modelIdentifier);
        }
        // Rid of the current items referencing.
        delete this.__currentItems;
        var finalResult = this.processResult(components, model, interactions ? Ext.isArray(interactions) ? interactions : interactions.items || [interactions] : null);
        // Set the engine back to its base state since some config may have been applied via the processJson
        Ext.apply(this.engine, originalEngine);

        if (Ext.isFunction(callback)) {
            callback(finalResult);
        } else {
            return finalResult;
        }
    },

    /**
     * @ignore
    *   Process a json blob with the configured engine for form associated data.
    *   No callback is necessary since the handling will occur in the process associated item extended methods.
    */
    processDataForForm: function (form, json) {
        var engine = this.engine;

        if (engine.flat) {
            // Process associatedDataRoots
            var associatedDataRoots = engine.associatedDataRoots,
                dataRootConfig,
                dataRoot,
                length = associatedDataRoots.length,
                i = 0;

            for (; i < length; i++) {
                dataRootConfig = associatedDataRoots[i];
                if (dataRootConfig.rootPropName) {
                    dataRoot = this.findRoot(dataRootConfig.rootPropName, json);
                    if (dataRootConfig.decode) {
                        try {
                            var encodedDataRoot = Ext.decode(dataRoot);
                            dataRoot = encodedDataRoot;
                        } catch (err) {
                            // Throw out and continue for now.
                        }
                    }
                    if (dataRoot) {
                        this.processDataAssociationForForm(dataRoot, dataRootConfig, form);
                    }
                }
            }
        } else {
            // Possible heirarchical data structure processing for engine.
        }
    },

    /**
     * @ignore
     *  Process items with the configured engine.
     *  Returns an object:
     *  {
     *      items: [] Ext JS component configuration objects.
     *      fields: [] Ext.data.field.Field configuration object for each field needed for the model.
     *  }
     */
    process: function (root, allItems, allFields, childProp) {
        // Calculate the item recursively.
        var item;
        var engine = this.engine;
        allFields = allFields || [];
        if (Ext.isArray(root)) {
            if (Ext.isFunction(this.engine.sort)) {
                root = Ext.Array.sort(root, this.engine.sort);
            }
            var items = [];
            var length = root.length;
            // If Array, an Array will be returned.
            for (var i = 0; i < length; i++) {
                item = this.process(root[i], items, allFields, childProp) || null;
                if (Ext.isObject(item) && item.items) {
                    items = items.concat(item.items);
                } else if (Ext.isArray(item)) {
                    items = items.concat(item);
                }
            }
            return {
                items: items,
                fields: allFields
            };
        } else if (Ext.isObject(root)) {
            allItems = allItems || [];
            allFields = allFields || [];
            item = this.associateData(root, engine.assoc, childProp);
            // See if the item has any children. If it does process it.
            if (!engine.flat) {
                var childrenProps = engine.childrenProps || [];
                var children;
                var length = childrenProps.length;
                var foundItems = [];
                for (var i = 0; i < length; i++) {
                    children = root[childrenProps[i]];
                    // Process the items as a possible array or any object with name value pairs.
                    if (Ext.isArray(children) && children.length) {
                        var result = this.process(children, null, allFields, childrenProps[i]);
                        if (Ext.isObject(result) && result.items) {
                            foundItems = foundItems.concat(result.items);
                        } else if (Ext.isArray(result)) {
                            foundItems = foundItems.concat(result);
                        }
                    } else if (Ext.isObject(children)) {
                        for (var childName in children) {
                            var result = this.process(children[childName], null, allFields, childrenProps[i]);
                            if (Ext.isObject(result) && result.items) {
                                foundItems = foundItems.concat(result.items);
                            } else if (Ext.isArray(result)) {
                                foundItems = foundItems.concat(result);
                            }
                        }
                    }
                }
                // Keep the objects clean and only added items if it was found.
                if (foundItems.length > 0) {
                    item.items = foundItems;
                }

            }
        }
        var result = [],
            options = this.processItem(item, item[engine.originalDataPropName]);
        // Process the result of the template processItem.
        if (options === false) {
            item = null;
            result = [];
        } else if (Ext.isObject(options)) {
            var before = options.before || [],
                after = options.after || [];
            result = result.concat(before);
            if (!Ext.isEmpty(item.xtype)) {
                result = result.concat([item]);
            }
            result = result.concat(after);
        } else {
            result = [item];
        }

        // If a model is to be generated, process each item's field.
        if (engine.generateModel) {
            var fieldItem,
                length = result.length,
                field,
                name;
            for (var i = 0; i < length; i++) {
                fieldItem = result[i];
                field = this.processItemField(fieldItem, fieldItem[engine.originalDataPropName]);
                name = fieldItem[engine.originalDataPropName] ? fieldItem[engine.originalDataPropName][engine.modelFieldPropName] : null;
                if (field !== false && !Ext.isEmpty(name)) {
                    allFields.push(Ext.isObject(field) ? field : {
                        name: name
                    });
                }
            }
        }
        // Only add to parent if the engine is flat.
        if (item && engine.flat) {
            // Add to the current forms items, since all items may be a parent at this point.
            this.__currentItems = this.__currentItems || {};
            this.__currentItems[item[engine.matchChildWithName]] = item;
            // Add item to parent.
            if (!Ext.isEmpty(root[engine.parentPropName])) {
                this.addToParent(result, root[engine.parentPropName]);
                return;
            } else if (!Ext.isEmpty(root[engine.ownerPropName])) {
                this.addToParent(result, root[engine.ownerPropName]);
                return;
            }
        }
        // If Object, an Object will be returned.
        if (Ext.isObject(result)) {
            return result;
        } else {
            return {
                items: result,
                fields: allFields
            };
        }
    },

    /**
     *  @ignore
     *  Process interactions with the configured engine.
     *  Returns an array of interaction objects.
     */
    processInteractions: function (root, childProp) {
        // Calculate the item recursively.
        var interaction;
        var engine = this.engine;
        if (Ext.isArray(root)) {
            if (Ext.isFunction(this.engine.interactionsSort)) {
                root = Ext.Array.sort(root, this.engine.interactionsSort);
            }
            var interactions = [];
            var length = root.length;
            // If Array, an Array will be returned.
            for (var i = 0; i < length; i++) {
                interaction = this.processInteractions(root[i], childProp) || null;
                if (Ext.isObject(interaction) && interaction.items) {
                    interactions = interactions.concat(interaction.items);
                } else if (Ext.isArray(interaction)) {
                    interactions = interactions.concat(interaction);
                }
            }
            return {
                items: interactions
            };
        } else if (Ext.isObject(root)) {
            interaction = this.associateData(root, engine.interactionAssoc, childProp);
            interaction.appId = interaction.appId || engine.appId;
            // See if the item has any children. If it does process it.
            var childrenProps = engine.interactionChildrenProps || [];
            var children;
            var length = childrenProps.length;
            var foundItems = [];
            for (var i = 0; i < length; i++) {
                children = root[childrenProps[i]];
                // Process the items as a possible array or any object with name value pairs.
                if (Ext.isArray(children) && children.length) {
                    var result = this.processInteractions(children, childrenProps[i]);
                    if (Ext.isObject(result) && result.items) {
                        foundItems = foundItems.concat(result.items);
                    } else if (Ext.isArray(result)) {
                        foundItems = foundItems.concat(result);
                    }
                } else if (Ext.isObject(children)) {
                    for (var childName in children) {
                        var result = this.processInteractions(children[childName], childrenProps[i]);
                        if (Ext.isObject(result) && result.items) {
                            foundItems = foundItems.concat(result.items);
                        } else if (Ext.isArray(result)) {
                            foundItems = foundItems.concat(result);
                        }
                    }
                }
            }
            // Keep the objects clean and only added items if it was found.
            if (foundItems.length > 0) {
                interaction.items = foundItems;
            }
        }
        this.processInteraction(interaction, interaction[engine.originalDataPropName]);

        return {
            items: [interaction]
        };
    },

    /** @ignore
     *  The logic of mapping property values from the metadata to a new object.
     *  Returns the new object with the mapped values based upon the association config passed in.
     */
    associateData: function (root, assocOrig, childProp) {
        var me = this,
            item = {},
            engine = me.engine,
            assoc = {},
            defaults = engine.defaults,
            advancedAssoc = engine.advancedAssoc,
            xtypes = engine.xtypes,
            xtypeString = 'xtype';

        Ext.apply(assoc, assocOrig);
        // Set the original data onto the item.
        if (engine.originalDataPropName) {
            item[engine.originalDataPropName] = root;
        }

        function processXtype(foundTypeProp) {
            // Keep the found xtype property.
            var type = me.getPropValue(root, foundTypeProp);
            if (xtypes[foundTypeProp] && xtypes[foundTypeProp][type]) {
                item[xtypeString] = xtypes[foundTypeProp][type];
            } else if (xtypes[type]) {
                item[xtypeString] = xtypes[type];
            }

            // Apply the advanced association to the assoc object about to be processed.
            if (advancedAssoc[foundTypeProp] && advancedAssoc[foundTypeProp][type]) {
                Ext.apply(assoc, advancedAssoc[foundTypeProp][type]);
            } else if (advancedAssoc[type]) {
                Ext.apply(assoc, advancedAssoc[type]);
            }

            // Apply the defaults in the engine to the item if they aren't already applied (applyIf)
            if (foundTypeProp && defaults[foundTypeProp] && defaults[foundTypeProp][type]) {
                Ext.applyIf(item, Ext.clone(defaults[foundTypeProp][type]));
            } else if (type && defaults[type]) {
                Ext.applyIf(item, Ext.clone(defaults[type]));
            }
            return foundTypeProp;
        };

        // First process the xtype so the advanced associations can be obtained if they exist.
        if (xtypeString in assoc) {
            var xtype = assoc[xtypeString];
            if (Ext.isArray(xtype)) {
                var length = xtype.length,
                    attemptXtype;
                for (var i = 0; i < length; i++) {
                    attemptXtype = me.getPropValue(root, xtype[i]);
                    if (!Ext.isEmpty(attemptXtype)) {
                        processXtype(xtype[i]);
                        break;
                    }
                }
            } else if (Ext.isString(xtype)) {
                processXtype(xtype);
            }
        }

        var val,
            assocProp;
        for (var prop in assoc) {
            // Xtype is a special case to the process. It requires the special xtype mappings and a default value if one is not found.
            // Handled before this for loop.
            if (prop === xtypeString) {
                continue;
            } else {
                assocProp = assoc[prop];
                if (assocProp.indexOf('+') !== -1) {
                    var props = assocProp.split('+');
                    var length = props.length;
                    val = '';
                    for (var i = 0; i < length; i++) {
                        val += (me.getPropValue(root, props[i]) || '');
                    }
                } else {
                    val = me.getPropValue(root, assocProp);
                }
                // Only apply found properties so we don't clutter objects.
                if (val !== undefined) {
                    item[prop] = val;
                }
            }
        }

        // Apply any childrenProp type defaults.
        if (engine.defaults['childrenProps'] && engine.defaults['childrenProps'][childProp]) {
            Ext.applyIf(item, Ext.clone(engine.defaults['childrenProps'][childProp]));
        }

        return item;
    },

    /** @ignore
     *  Helper function to obtain the correct property value in regards to the associated mapping string.
     */
    getPropValue: function (root, prop) {
        var split = prop.split('.'),
            length = split.length;
        if (split.length > 1) {
            var value = root;
            for (var i = 0; i < length; i++) {
                value = this.doGet(value, split[i]);
                if (value == undefined) {
                    break;
                }
            }
            return value;
        } else {
            return this.doGet(root, prop);
        }
    },

    /** @ignore
     *  Get prop off the object.
     */
    doGet: function (root, prop) {
        var value = root[prop];
        if (Ext.String.startsWith(prop, '!')) {
            prop = prop.substring(1, prop.length);
            if (Ext.String.startsWith(prop, '^')) {
                prop = prop.substring(1, prop.length);
                value = root[prop] != undefined ? (root[prop] + '' || '').toLowerCase() : undefined;
            } else {
                value = root[prop] != undefined ? !root[prop] : undefined;
            }
        } else if (Ext.String.startsWith(prop, '^')) {
            prop = prop.substring(1, prop.length);
            value = root[prop] != undefined ? (root[prop] + '' || '').toUpperCase() : undefined;
        }
        return value;
    },

    /**
     * @ignore
     * Similar to the process method, this also takes into consideration that these items may be related to the component.
     * The component is searched for and included in the processAssociatedItem extendable method.
     */
    processDataAssociation: function (root, rootConfig, componentItems) {
        // Calculate the item recursively.
        if (Ext.isArray(root)) {
            var length = root.length;
            // If Array, an Array will be returned.
            for (var i = 0; i < length; i++) {
                this.processDataAssociation(root[i], rootConfig, componentItems) || null;
            }
        } else if (Ext.isObject(root)) {
            var newObj = this.associateData(root, rootConfig.assoc, this.engine);
            var component = this.findItem(componentItems, rootConfig.componentMatchProp, root[rootConfig.matchProp]);
            this.processAssociatedItem(component, root, newObj, rootConfig.rootPropName);
        }
    },

    /**
     * @ignore
     * Similar to the process method, this also takes into consideration that these items may be related to the component.
     * The component is searched for within the form top-level container by the reference match and included in the processAssociatedItem extendable method.
     */
    processDataAssociationForForm: function (root, rootConfig, form) {
        // Calculate the item recursively.
        if (Ext.isArray(root)) {
            var length = root.length;
            // If Array, an Array will be returned.
            for (var i = 0; i < length; i++) {
                this.processDataAssociationForForm(root[i], rootConfig, form) || null;
            }
        } else if (Ext.isObject(root)) {
            var newObj = this.associateData(root, rootConfig.assoc, this.engine);
            var component = form;
            if (Ext.isString(root[rootConfig.matchProp])) {
                component = this.findItemOnForm(form, rootConfig.componentMatchProp, root[rootConfig.matchProp]);
            }
            this.processAssociatedItemData(component, root, newObj, rootConfig.rootPropName);
        }
    },

    /**
     * @ignore
     * The logic to match items to their parents in order to create a heirachical structure, which Ext JS nesting expects.
     * If a parent is found, the items is added into the items array of the parent Ext JS component configuration.
     */
    addToParent: function (items, parentValue) {
        var me = this,
            currentItems = me.__currentItems || {}, // fail safe.
            parent = currentItems[parentValue];

        if (parent) {
            parent.items = parent.items || [];
            parent.items = parent.items.concat(items);
        }
    },

    /** @ignore */
    convertObjectsToArray: function (root, engine) {
        var data;
        for (var prop in root) {
            if (Ext.isObject(root[prop])) {
                var length = engine.objectToArrayNames.length;
                data = null;
                for (var i = 0; i < length; i++) {
                    if (engine.objectToArrayNames[i].prop === prop) {
                        data = engine.objectToArrayNames[i];
                        break;
                    }
                }
                if (data) {
                    if (Ext.isArray(root[data.newProp])) {
                        root[data.newProp] = root[data.newProp].concat(this.objectToArray(root[prop], engine));
                    } else {
                        root[data.newProp] = this.objectToArray(root[prop], engine);
                    }
                    if (data.newProp !== prop) {
                        delete root[prop];
                    }
                }
            } else if (Ext.isArray(root[prop])) {
                var length = root[prop].length;
                for (var i = 0; i < length; i++) {
                    this.convertObjectsToArray(root[prop][i]);
                }
            }
        }
        return root;
    },

    /** @ignore */
    objectToArray: function (object, engine) {
        var newArray = [];
        for (var prop in object) {
            this.convertObjectsToArray(object[prop], engine);
            object[prop][engine.objectToPropName] = prop;
            newArray.push(object[prop]);
        }
        return newArray;
    },

    /**
     * @ignore
     * Helper function to find the property (root) in an object.
     */
    findRoot: function (name, newObj) {
        for (var prop in newObj) {
            if (prop === name) {
                return newObj[prop];
            } else if (Ext.isObject(newObj[prop])) {
                var found = this.findRoot(name, newObj[prop]);
                if (found) {
                    return found;
                }
            }
        }
    },

    /**
     * @ignore
     * Helper function to find an item in an array based on matching a property value.
     */
    findItem: function (items, itemProp, value) {
        var i = 0,
            len = items.length;
        for (; i < len; i++) {
            if (items[i][this.engine.originalDataPropName] && items[i][this.engine.originalDataPropName][itemProp] === value) {
                return items[i];
            } else if (Ext.isArray(items[i].items)) {
                var item = this.findItem(items[i].items, itemProp, value);
                if (item) {
                    return item;
                }
            }
        }
    },

    /**
     * @ignore
     * Helper function to find the related component within a top level container component.
     */
    findItemOnForm: function (form, itemProp, value) {
        var mappedProp = this.findAssociatedPropMap(itemProp);
        if (mappedProp) {
            if (mappedProp === 'reference') {
                var reference = this.preProcessReference(value);
                if (reference) {
                    return form.lookup(reference);
                }
            } else {
                return form.down('[' + mappedProp + '=' + value + ']');
            }
        } else {
            return form.down('[' + itemProp + '=' + value + ']');
        }
    },

    /**
     * @ignore
     * Helper function to find the component property for which the json item property is mapped to.
     */
    findAssociatedPropMap: function (itemProp) {
        if (Ext.isString(itemProp)) {
            var engine = this.engine;
            var assoc = engine.assoc;
            if (assoc) {
                for (var prop in assoc) {
                    if (assoc[prop] === itemProp) {
                        return prop;
                    }
                }
            }
        }
    }
});
