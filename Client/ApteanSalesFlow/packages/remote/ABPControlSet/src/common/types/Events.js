/**
* Events fired and supported by ABP Control Set.
*
* __NOTE:__ Always use the enum name and not the value. Example: Use ABPControlSet.common.types.Events.UserChanged instead of "userchanged".
*
* @enum
*/
Ext.define("ABPControlSet.common.types.Events", {
    singleton: true,
    /**
    * Fires when a control's value is changed by the user. (Value differs from the time a user focused the control to the time the control loses focus)
    *
    * Does not fire if the control is changed by API methods.
    */
    UserChanged: "userchanged",
    /**
    * Fires when a field has its trigger component clicked.
    *
    */
    TriggerClick: "triggerclick",
    /**
    * Fires when a field has its trigger component focused.
    *
    */
    TriggerFocus: "triggerfocus",
    /**
    * Fires when a component is about to show its context menu.
    */
    ContextMenu: "contextshow",
    /**
    * Fires when a context menu item for a components context menu is clicked.
    */
    ContextMenuItemClick: "contextmenuitemclick",
    /**
    * Fires when an image is longpressed.
    */
    ImageLongPress: "longpress",
    /**
    * Fires when an image is clicked.
    */
    ImageClick: "click",
    /**
    * Fires when an image is double clicked.
    */
    ImageDoubleClick: "doubletap",
    /**
    * Fires when a radio group obtains focus.
    */
    RadioGroupFocus: "radiogroupfocus",
    /**
     * Fires when the ag-grid component has a record removed from it.
     */
    AGGridRemove: 'aggridremove',
    /**
     * Fires when the ag-grid component has a record added to it.
     */
    AGGridAdd: 'aggridadd',
    /**
     * Fires when the ag-grid component has a record updated in it.
     */
    AGGridUpdate: 'aggridupdate'
});