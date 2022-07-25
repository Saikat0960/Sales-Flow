/**
 * ABPControlSet grid.
 *
 *   TODO:
 *
 *   MODERN Column pinning - needs tech spike - 2 hours + dev time.
 *   Row pinning - multi line summary feature extension. - 8 hours for both classic and modern.
 *   Auto resize columns - 1 hour to re-integrate.
 *   MODERN Drag and drop columns for arrangment - 2 hours tech spike + dev time.
 *   Tab to move between editable cells - 2 hours tech spike for modern.
 *   Tab into grid-cell to start edit. 2 hours dev
 *   up/down key support config - allow config to disable numeric/list fields up/down value setting when in grid. 2 hours tech spike + (~2) dev hours.
 *   Double click cell for drill down hook-up. 2 hours dev.
 *   Chart overlay - 2 tech spike + ~8 hours dev.
 *   MODERN row filter by column - Unknown ~2 hours tech spike.
 *   >1 column grouping - Unknown ~2 hours tech spike
 *   User config API + reset user config - 16 hours dev.
 *   Pin row selector checkbox to left - 1 hour classic. Unknown modern - 2 hours tech spike.
 *   Cell/row coloring - Classic takes Pivotal feature 2 hours dev - Modern unknown 2 hours tech spike + dev.
 *
 *
 */
Ext.define("ABPControlSet.view.grid.Grid", {
    extend: "Ext.grid.Grid",
    xtype: "abpgrid",
    requires: [
        "ABPControlSet.base.view.grid.plugin.Grid",
        "ABPControlSet.base.mixin.Grid"
    ],
    border: true,
    mixins: [
        "ABPControlSet.base.mixin.Grid"
    ],
    /**
     * @cfg {Boolean} listOnTop
     * If the listView config is true, this determines whether or not the listView is shown initially.
     */
    listOnTop: false,
    /**
     * @cfg {Boolean} listView
     * If true, the grid will have the list view option enabled.
     */
    listView: false,
    config: {
        showShadow: false,
        shadowOnScroll: false
    },

    listeners: {
        storechange: {
            el: 'element',
            fn: function (grid, store) {
                var me = this;
                if (store) {
                    store.on('datachanged', me.setGridHeightFromStore.bind(me));
                }
            }
        }
    },
    constructor: function (config) {
        config = config || {};
        config.listView = Ext.isBoolean(config.listView) ? config.listView : this.listView === false ? false : true;
        if (config.listView) {
            config.plugins = config.plugins || {};
            config.plugins.listview = config.plugins.listview === true ? {} : config.plugins.listview;
            if (!Ext.isObject(config.plugins.listview)) {
                config.plugins.listview = {};
            };
            config.plugins.listview.fullRow = config.listOnTop || this.listOnTop
            config.plugins.listview.template = config.listTemplate || this.listTemplate
        }
        this.mixins.abpcomponent.constructor.call(this, config);
        this.callParent([config]);
    },

    onScrollMove: function (start, end) {
        var me = this;
        var useShadow = me.getShadowOnScroll();
        var showShadow = me.getShowShadow();
        var boxExists = document.getElementById('grid-box-shadow');

        if (!useShadow) {
            return;
        }

        if (!boxExists) {
            var box = document.createElement('div');
            box.id = "grid-box-shadow";
            box.style.opacity = 0;
            this.outerCt.el.dom.prepend(box);
        }

        if (end >= 6 && !showShadow) {
            if (boxExists) {
                boxExists.style.opacity = 1;
            }
            me.setShowShadow(true);
        } else if (end < 6 && showShadow) {
            boxExists.style.opacity = 0;
            me.setShowShadow(false);
        }
    },

    privates: {
        syncRows: function () {
            // Aptean fix: Do not sync if the grid is hidden.
            // Without testing isHidden with deep == true, the grid thinks it is still visible
            // in the case where another form is being displayed ontop, in the card container.
            // Unless we abort, the code continues into syncRowsToHeight and syncs the number of 
            // row incorrectly because the grid reports its height to be 0 in this case.
            // The result is a bug where going back from a detail form to a list form shows
            // only the selected row, and not the other rows.
            if (this.isHidden(true)) {
                return;
            }
            this.setGridHeight();
            this.callParent(arguments)
        },
        /*
        *   OVERRIDDEN METHOD
        *   The Ext version of this method has a condition that prevents rerender of new data on infinite grids.
        *   The specific caveat is that the new and old data sets are both larger than the number of records in the grid.
        *   We have the common case where the results of a search will be greater than that number, so we need to reset the visible index.
        *   Making this the default behavior for list views, as it seems to have a neglible effect. 
        *   We also may want to make more decisions on when to refresh and we do need a hook into this method.
        */
        syncRowsToHeight: function (force) {
            var me = this,
                bufferZone = me.getBufferSize(),
                infinite = me.infinite,
                rowCountWas = me.getItemCount(),
                rowHeight = me.rowHeight,
                firstTime = !rowHeight,
                renderInfo = me.renderInfo,
                oldIndexBottom = renderInfo && renderInfo.indexBottom,
                storeCount = me.store.getCount(),
                visibleHeight = me.getMaxHeight() || me.getVisibleHeight(),
                indexTop, row, rowCount;

            if (firstTime) {
                if (!rowCountWas) {
                    me.setItemCount(1);
                }
                row = me.dataItems[0];
                row.$height = null;
                me.rowHeight = rowHeight = me.measureItem(row);
                if (!rowCountWas) { // APTEAN OVERRIDE: removed this otherwise 1st row does not show value that are not bound to the VM: && me.discardMeasureRow) {
                    row.destroy();
                    me.dataItems.length = 0;
                    me.setItemCount(0);
                }
            }
            if (infinite) {
                rowCount = Math.ceil(visibleHeight / rowHeight) + bufferZone;
                rowCount = Math.min(rowCount, storeCount);
            } else {
                rowCount = storeCount;
            }
            me.setItemCount(rowCount);
            // OVERRIDE replaced:
            // START old code
            // if ((firstTime && me.store.isVirtualStore) || rowCountWas !== rowCount || storeCount < oldIndexBottom) {
            // END old code
            // OVERRIDE replacement:
            // START new code
            if (me.listView || (firstTime && me.store.isVirtualStore) || rowCountWas !== rowCount || storeCount < oldIndexBottom) {
                // END new code
                if (infinite) {
                    indexTop = Math.min(storeCount - rowCount, renderInfo.indexTop);
                    indexTop = Math.max(0, indexTop);
                    if (indexTop === me.getTopRenderedIndex()) {

                        me.updateTopRenderedIndex(indexTop);
                    } else {
                        me.setTopRenderedIndex(indexTop);
                    }
                }
                if (firstTime) {
                    me.refreshGrouping();
                }
                force = force !== false;
                if (force && storeCount < oldIndexBottom) {
                    renderInfo.top = renderInfo.indexTop * me.rowHeight;
                }
            }
            if (force) {
                me.syncRows();
            }
        },

        setGridHeightFromStore: function (store) {
            this.setGridHeight(store);
        },

        /**
        * Now that we have a row item with a height, we can
        * set the grids min/max/height accordingly.
        **/
        setGridHeight: function (store) {
            var grid = this,
                rowHeight = grid.rowHeight,
                itemCount,
                store = store || grid.getStore(),
                height = grid.getHeight(),
                gridItemCount = grid.getItemCount(),
                minHeight = grid.getMinHeight(),
                extraHeight = this.getExtraGridHeight();

            // Set Min Height
            if (Ext.isEmpty(minHeight)) {
                // If no minHeight, set minHeight to the height of a single row.
                // If no minHeight is provided, grid will collapse to 0px in modern.
                grid.setMinHeight(rowHeight + extraHeight);
            }
            // Get the number of grid items for our calculation.            
            if (store && store.getData()) {
                itemCount = store.getData().length;
            }
            if (!itemCount) {
                // Last attempt to manually calculate the height will use grid.getItemCount(). 
                // This is an unreliable count so only use in the case that its the only thing available.                         
                itemCount = gridItemCount;
            }
            // Calculate the height if there is an item count, height has not been set or recalculateHeight is forced.
            if (!grid.responsiveFillHeight) {
                if (itemCount === 0) {
                    // Force measure for at least one item.                    
                    itemCount = 1;
                }
                // Only adjust height to its content if it is not meant to fill entire remaining height.
                var totalHeight = (rowHeight * itemCount) + extraHeight;
                if (totalHeight !== height && totalHeight > 0) {
                    grid.setHeight(totalHeight);
                }
            } else {
                grid.setHeight('100%');
            }
            // Set Max Height
            if (grid.config.maxHeight) {
                var maxHeight = ABP.util.String.parseInt(grid.config.maxHeight),
                    currentMaxHeight = grid.getMaxHeight();
                if (Ext.isEmpty(currentMaxHeight) && currentMaxHeight !== maxHeight) {
                    grid.setMaxHeight(maxHeight + extraHeight);
                }
            }
        },

        /**
        * Calculates the sum of headerHeight and any grid top/bottom padding/margin.
        *
        * @param {Object} grid A Sencha grid object.
        * @returns {Number} extraHeight.
        */
        getExtraGridHeight: function () {
            var grid = this,
                padding = grid.el.getPadding('tb'),
                margin = grid.el.getMargin('tb'),
                rowLinesIncrement = grid.getRowLines() ? 1 : 0, // If rowLines are being shown then these increse the height of the grid by 1px (i.e. all but one row overlap each other by 1px and also have a border 1px for the line). NOTE: This assumes rowLine height is 1px.
                headerHeight;

            if (grid.listView) {
                var titleBar = grid.getTitleBar();
                headerHeight = titleBar ? titleBar.el.getHeight() : 0;
            } else {
                var header = grid.getHeaderContainer();
                headerHeight = header ? header.el.getHeight() : 0;
            }
            return headerHeight + padding + margin + rowLinesIncrement;
        }
    }
});
