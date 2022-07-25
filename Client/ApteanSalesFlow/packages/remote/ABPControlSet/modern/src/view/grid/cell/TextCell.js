/**
 *  TextCell exists to provide cell-specific styling and behavior for text inside grids.
 *  It is purely presentational.  
 */
Ext.define('ABPControlSet.view.grid.cell.TextCell', {
    extend: 'Ext.grid.cell.Cell',
    xtype: 'abptextcell',
    encodeHtml: false,

    config: {
        foregroundColor: null,
    },

    updateForegroundColor: function (color) {
        this.el.setStyle('color', color);
    }

});
