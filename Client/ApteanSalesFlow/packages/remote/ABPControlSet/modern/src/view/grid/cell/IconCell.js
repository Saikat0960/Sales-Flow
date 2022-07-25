/**
 *  IconCell holds an abpicon to be used inside grids.
 *  It is purely presentational.  
 */
Ext.define('ABPControlSet.view.grid.cell.IconCell', {
    extend: 'Ext.grid.cell.Widget',
    xtype: 'abpiconcell',
    cls: 'abp-forms-icon-cell',
    config: {
        widgetClasses: 'x-icon-el x-font-icon',
        foregroundColor: null
    },

    constructor: function (config) {

        var columnConfig = config.column ? config.column.config : null;
        if (columnConfig) {
            config.widget = {
                xtype: 'abpicon',
                cls: config.widgetClasses ? config.widgetClasses : widgetClasses,
                automationCls: 'list-view-icon-' + columnConfig.listPriority,
            };
        }
        this.callParent([config]);
    },

    setValue: function (value) {
        var widget = this.getWidget();

        if (!Ext.isEmpty(widget)) {
            widget.setValue(value);
        }
        // We don't want the value set, it will put the text in the dom.
        this.callParent(null);
    }
})