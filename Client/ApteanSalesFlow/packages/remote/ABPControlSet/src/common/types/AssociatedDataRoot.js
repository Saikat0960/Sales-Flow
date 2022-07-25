/**
 * AssociatedDataRoot configuration object.
 * Reader config for objects associated with components (events, columns, etc). These will be passed to the extendable {@link ABPControlSet.common.FormEngine#processAssociatedItem processAssociatedItem} method
 */
Ext.define("ABPControlSet.common.types.AssociatedDataRoot", {
    /**
     * @cfg {String} rootPropName
     * Property on the json blob where this root data lives.
     */
    rootPropName: '',
    /**
     * @cfg {Boolean} decode
     * If true, the value of the root will be decoded first.
     */
    decode: false,
    /**
     * @cfg {String} matchProp
     * Property on the associated object which has the value to match with the componentMatchProp value.
     */
    matchProp: '',
    /**
     * @cfg {String} componentMatchProp
     * The property to gather a value from the component[originalDataPropName] to match with the matchProp value.
     */
    componentMatchProp: '',
    /**
     * @cfg {Object} assoc
     * Property associations to prep a new object for this data. See {@link ABPControlSet.common.types.Engine#assoc assoc} for more information.
     */
    assoc: {
    }
});