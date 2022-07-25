/**
 *  IconCell holds an abpicon to be used inside grids.
 *  It is purely presentational.  
 */
Ext.define('ABPControlSet.view.grid.cell.ButtonCell', {
    extend: 'Ext.grid.cell.Widget',
    xtype: 'abpbuttoncell',
    cls: 'abp-forms-button-cell',
    config: {
        widgetClasses: 'x-icon-el x-font-icon',
        iconCls: null,
        text: null,
        fieldLabel: null,
        disabled: null,
        hidden: null,
        parentColumn: null
    },

    constructor: function (config) {
        var columnConfig = config.column ? config.column.config : null;
        var column = config.parentColumn;
        if (columnConfig) {
            config.widget = {
                xtype: 'abpbutton',
                cls: 'grid-row-tools abp-forms-row-button abp-list-view-trigger',
                automationCls: 'list-view-trigger-' + columnConfig.listPriority,
                iconCls: column && column.iconCls ? column.iconCls : null,
                text: column && column.label ? column.label : '',
                iconAlign: 'top',
                disabled: column ? column.disabled : false,
                hidden: column ? column.hidden : false
            };
        }
        this.callParent([config]);
    },

    setValue: function (value) {
        var widget = this.getWidget();

        if (!Ext.isEmpty(widget)) {
            widget.setValue(value);
        }
        this.callParent(value);
    },

    setIconCls: function (value) {
        var widget = this.getWidget();

        if (!Ext.isEmpty(widget)) {
            widget.setIconCls(value);
        }
    },

    setFieldLabel: function (value) {
        var widget = this.getWidget();

        if (!Ext.isEmpty(widget)) {
            widget.setText(value);
        }
    }
})