Ext.define('ABPControlSet.view.listview.ListViewRow', {
    extend: 'Ext.grid.Row',
    xtype: 'listviewrow',
    requires: ['Ext.grid.plugin.RowExpander'],

    config: {
        cellsElementStyle: null
    },

    setCellsElementStyle: function (style) {
        var me = this;
        if (!Ext.isEmpty(me.cellsElement) && !Ext.isEmpty(style)) {
            me.cellsElement.setStyle(style);
        }
    },

    /**
     * @private
     */
    element: {
        reference: 'element',
        tag: 'table',
        children: [{
            tag: 'tr',
            reference: 'cellsElement',
            className: Ext.baseCSSPrefix + 'cells-el'
        }]
    },
    /**
     * @private
     */
    cellPlaceholderSelector: null,

    getCellForField: function (cells, fieldName) {
        var cell,
            column,
            length = cells.length;
        for (var i = 0; i < length; i++) {
            cell = cells[i];
            if (cell) {
                column = cell.getColumn();
                if (column.getDataIndex() === fieldName) {
                    return cell;
                }
            }
        }
    },
    /**
     * @private
     * Apply the template for the priorities of the list view.
     */
    onAdded: function (grid) {
        var me = this,
            out = [],
            listViewPlugin = grid.listViewPlugin;
        me.callParent(arguments);
        if (listViewPlugin) {
            listViewPlugin.renderFullRow({
                record: null,
                rowIndex: null,
                recordIndex: null,
                cells: me.cells,
                cellsElement: me.cellsElement
            }, out, this);

            me.cellsElement.dom.innerHTML = out.join('');
            var cells = me.cells,
                rowExpander = grid.getPlugin('rowexpander'),
                placeholder,
                cell,
                fieldName,
                cellsElementDom = me.cellsElement.dom,
                placeholders = cellsElementDom.querySelectorAll('.' + me.cellPlaceholderSelector),
                length = placeholders.length;

            for (var i = 0; i < length; i++) {
                placeholder = placeholders[i];
                if (placeholder) {
                    fieldName = placeholder.getAttribute('data-index');
                    if (!Ext.isEmpty(fieldName)) {
                        cell = me.getCellForField(cells, fieldName);
                        if (cell) {
                            //fieldIndex = parseInt(placeholder.getAttribute('field-index'));
                            // Add list view classes to the td.
                            // parent = placeholder.parentNode;
                            // parent.removeChild(placeholder);
                            // cell.toggleCls('abp-list-view-field-value', true);
                            // cell.toggleCls('abp-list-view-field-value-' + fieldIndex, true);
                            // parent.appendChild(cell.el.dom);
                            // var cellTpl = cell.el.dom.outerHTML;
                            // // Replace first div with a td.
                            // var withoutFirstDiv = cellTpl.replace('div', 'td');
                            // // Get the last index for the div sub string.
                            // var start = withoutFirstDiv.lastIndexOf('div');
                            // // Isolate the last div.
                            // var lastTd = withoutFirstDiv.substring(start);
                            // // replace
                            // lastTd = lastTd.replace('div', 'td');
                            // // Get entirety of the string without the ending.
                            // var withoutLastDiv = withoutFirstDiv.substring(0, start);
                            // cell.el.dom.outerHTML = withoutLastDiv + lastTd;
                            placeholder.appendChild(cell.el.dom);
                            cell.setRendered(true);
                        }
                    }
                }
            }
            if (rowExpander) {
                me.addColumn(rowExpander.getColumn());
            }
        } else {
            me.callParent(arguments);
        }
    },

    /**
     * @private
     */
    // insertColumn: function (index, column) {
    //     // Adjust the column template so it renders td cells.
    //     var me = this;
    //     debugger
    //     var cellComp = column.getCell();
    //     var getTemplateFn = cellComp.getTemplate ? cellComp.getTemplate.bind(cellComp) : undefined;
    //     cellComp.getTemplate = function () {
    //         var template = getTemplateFn ? getTemplateFn() : [{}];
    //         if (template && template[0]) {
    //             template[0].tag = 'td';
    //             template[0].cls = (template[0].cls || '') + ' abp-list-view-field-value';
    //         }
    //     }
    //     me.callParent(arguments);
    //     cellComp.getTemplate = getTemplateFn;
    // },

    // /**
    //  * @private
    //  */
    // insertColumnBefore: Ext.emptyFn,

    /**
     * Overrides the Ext.grid.Row version of toggleCollapsed so that the expansion is scrolled visible.
     */
    toggleCollapsed: function () {

        // Original Ext code is just one line:  this.setCollapsed(!this.getCollapsed());
        var me = this,
            collapsed = me.getCollapsed();
        this.setCollapsed(!collapsed);

        if (collapsed) {
            // If _was_ collapsed, now it is expanded - make sure the row expansion is visible.
            body = me.getBody();
            if (body) {
                // It seems unlikely that the body will not be painted by now because Ext's updateCollapsed function (called via setCollapsed above) 
                // will have called body.show(). But just in case, a painted event handler is added in that case.
                if ( body.isPainted() && body.el && body.el.dom && body.el.dom.scrollIntoViewIfNeeded) {
                    // A slight delay is used otherwise the element can be scrolled higher than the user expects.
                    // This happens because a previously expanded row mght be collapsing at the same time.
                    // Also scrollIntoViewIfNeeded is not supported by some lesser browsers like Firefox for Android: https://caniuse.com/#search=scrollIntoViewIfNeeded
                    Ext.defer(function(){
                        body.el.dom.scrollIntoViewIfNeeded(false);
                    }, 50);
                } else {
                    body.on('painted', function () {
                        if ( body.el && body.el.dom && body.el.dom.scrollIntoViewIfNeeded ) {
                            body.el.dom.scrollIntoViewIfNeeded(false);
                        }
                    }, me);
                }
            }
        }
    },
    
    /**
     * @private
     */
    removeColumn: Ext.emptyFn,

    /**
     * @private
     */
    setColumnWidth: Ext.emptyFn,

    /**
     * @private
     */
    showColumn: Ext.emptyFn,

    /**
     * @private
     */
    hideColumn: Ext.emptyFn
});