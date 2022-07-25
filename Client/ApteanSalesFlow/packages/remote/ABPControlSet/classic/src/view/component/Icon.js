/*
*   A icon displaying component. 
*   This does not inherit from Ext.form.field so it does not have a label or focus.
*/

Ext.define('ABPControlSet.view.component.Icon', {
    extend: 'Ext.Component',
    xtype: 'abpicon',
    mixins: [
        'ABPControlSet.base.mixin.Icon'
    ]
});