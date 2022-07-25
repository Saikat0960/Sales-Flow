/**
 * @private
 * CSS Grid layout.
 *
 * Compatibility:
 *
 *  - Current CSS Grid spec: [https://www.w3.org/TR/2011/WD-css3-grid-layout-20110407/](https://www.w3.org/TR/2011/WD-css3-grid-layout-20110407/)
 *  - Currently supported in Edge, Chrome, Firefox, Safari (Webkit): [https://developer.microsoft.com/en-us/microsoft-edge/platform/catalog/?q=specName%3Acss-grid-1](https://developer.microsoft.com/en-us/microsoft-edge/platform/catalog/?q=specName%3Acss-grid-1)
 *  - IE CSS grid: [https://rachelandrew.co.uk/archives/2016/11/26/should-i-try-to-use-the-ie-implementation-of-css-grid-layout/](https://rachelandrew.co.uk/archives/2016/11/26/should-i-try-to-use-the-ie-implementation-of-css-grid-layout/)
 *  - Chrome/Firefox/Webkit: [https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
 *  - Edge: [https://docs.microsoft.com/en-us/microsoft-edge/dev-guide/css/grid-layout](https://docs.microsoft.com/en-us/microsoft-edge/dev-guide/css/grid-layout)
 *
 * The layout shows the items in a grid according to the items row and column information.
 * The {@link #responsive} configuration option can turn this layout into a responsive one in that its items will wrap when there is no space to fit them side by side.
 *
 * For more information, read the [Layouts: CSS Grid Guide](#!/guide/abpcontrolset_layouts-section-css-grid).
 */
Ext.define('ABPControlSet.common.CSSGrid', {
    /*
    * Common functionality mixin between the classic and modern versions of the css grid layout.
    */
    extend: 'Ext.Mixin',
    responsiveGridTplFormat: '1fr',
    gridTplFormat: '1fr',
    gridTplFormatIE: '1fr',
    defaultTopGroupName: '__0__',
    fillRowWidth: true, // Used to determine whether or not we set a layout items colspans to fill the entire rows column count.
    columnPrecedence: false, // Default to false.
    defaultMinColumnWidth: 180, // Only for use with responsiveColSpan item configs.
    gridContainerStyled: false, // Internal prop to minimize dom interaction for the grid container element.
    baseCls: 'css-grid-container',
    baseResponsiveCls: 'css-grid-container-responsive',
    groupCls: 'css-grid-container-group',
    gridItemCls: 'css-grid-container-item',
    itemBodyCls: 'css-grid-container-item-body',

    /**
     * @cfg {Boolean} responsive
     *
     * If set to true, the layout will adjust its child items to best fit within its current width, while remaining in a reasonble order.
     *
     * If not set, this will default based on the toolkit being used; true for modern, false for classic.
     *
     * When true, the layout requires 3 mandatory pieces of information.
     * These can either be provided directly or they can be calculated via this classes logic based on other types of configurations within the layouts items.
     *
     * __Mandatory__:
     *
     *   - A {@link ABPControlSet.common.CSSGrid.baseColumnWidth baseColumnWidth} must be able to be calculated from the items, or set on configuration.
     *   - A {@link ABPControlSet.common.CSSGrid.maxColumns maxColumns} value must be able to be calculated from the items, or set on configuration.
     *   - Each item must have some kind of width or colspan set in order to determine how much width is allocated for the item.
     *
     * __Optional__:
     *
     *   - Each item can also specify heights or a rowspan to help with row management.
     *
     * __Column Width__:
     *
     * If a baseColumnWidth is not defined on configuration, it can be determined in a couple of ways:
     *
     *    1. If a maxColumns count is set, the baseColumnWidth can be determined by the owner width / column count.
     *    2. If no maxColumns are set, but the items have information like col index and colspan, a max columns count can be determined this way, and then the first route can be taken.
     *    3. If no maxColumns are set and no items have information about columns, the max columns count will be the numbers if items, and route one can be taken again.
     *
     * __Column Count__:
     *
     * If a maxColumns count is not defined on configuration, it can also be determined by a couple of different ways:
     *
     *    1. If a columnWidth is set, the ownerWidth / columnWidth is used to determine the columns.
     *    2. If a columnWidth is not set, but the items have information like col index and colspan, a max columns count can be determined this way.
     *    3. If no columnWidth is set, and no items have information about columns, the max columns count will be the numbers if items in the container.
     *
     * Example:
     *
     *       Ext.widget({
     *           xtype: 'container',
     *           layout: {
     *               type: 'cssgrid',
     *               responsive: true,
     *               maxColumns: 3, // Max columns ever allowed to show in a row.
     *               baseColumnWidth: 180 // Minimum width a column is allowed to go to before wrapping.
     *           }
     *       });
     *
     *  __Item configuration__:
     *
     *    An item can have multiple specifications to help determine its place in the layouts.
     *    The most basic is using a number pixel count for the property {@link ABPControlSet.base.mixin.Component#responsiveWidth responsiveWidth}.
     *    This also accepts a percentage to be used. If a % is used, it is best to also use a {@link ABPControlSet.base.mixin.Component#responsiveMinWidth responsiveMinWidth} on the item to ensure it wraps at a certain breakpoint.
     *
     *    An item can also have a {@link ABPControlSet.base.mixin.Component#fixedWidth fixedWidth}: true/false set for it. If true, the exact {@link ABPControlSet.base.mixin.Component#responsiveWidth responsiveWidth} pixel count will be maintained for the item.
     *
     *    Alternatively, each item can specify its own col, colspan, row, and rowspan to be used to determine the items place in the responsive layout grid.
     *    However, when this is used, it is best if a baseColumnWidth is specified for the layout itself or the items will never have any concept of responsive wrapping.
     *
     *    Container type items (typically panels with headers) can be configured with a bodyFixedWidth and bodyResponsiveWidth setting to keep the body of the container
     *    at or below a max width. Allowing headers to stretch larger than the body.
     *
     */
    responsive: Ext.toolkit === 'modern' ? true : false,

    /**
     * @cfg {Boolean} fillEmptySpace
     *
     * If true, any extra space to the left or right of items with the tallest heights in rows will try to be filled with nearby items in the layout.
     *
     *  - Only valid when {@link #responsive} is true.
     */
    fillEmptySpace: false,

    /**
     * @cfg {Number} columnWidth
     *
     * The minimum width a column is allowed to go to before wrapping.
     * A column width also determines the max allowed columns in the owners current width and when items should wrap.
     *
     *  - Only valid when {@link #responsive} is true.
     */
    baseColumnWidth: null,

    /**
     * @cfg {Number} maxColumns
     *
     * The max amount of columns allowed to be shown in a single row.
     *
     *  - Only valid when {@link #responsive} is true.
     */
    maxColumns: null,

    /**
     * @cfg {Number} minColumnWidth
     *
     * When no maxColumns or a baseColumnWidth is set, it requires the layout to figure out this information, and, to be as precise as possible, a gcd of all widths is used.
     * This results in the possibibilty of a gcd being 1, so the pixel count is then the column count which can impact performance. This will allow a minColumnWidth to be used to lessen the amount of total possible columns.
     *
     *  - Only valid when {@link #responsive} is true.
     */
    minColumnWidth: 1,

    /**
     * @cfg {Number} columnSpacing
     *
     * The default padding or margin to set on the left and right of items.
     * The use of padding or margin is determined by the type of components it is being set on. For components extending an Ext.Container type, meaning the item will contain child items (Panels, Grids, etc.), uses padding.
     * All other items will use a margin. This spacing is taken into account when determining the column and row specifications for css grid templates.
     *
     * There is no default columnSpacing. Instead defaultSpacing has a default value.
     */
    columnSpacing: null,

    /**
     * @cfg {Number} rowSpacing
     *
     * The default padding or margin to set on the top and bottom of items.
     * The use of padding or margin is determined by the type of components it is being set on. For components extending an Ext.Container type, meaning the item will contain child items (Panels, Grids, etc.), uses padding.
     * All other items will use a margin. This spacing is taken into account when determining the column and row specifications for css grid templates.
     *
     * There is no default rowSpacing. Instead defaultSpacing has a default value.
     */
    rowSpacing: null,

    /**
     * @cfg {Number/String} defaultSpacing
     *
     * The spacing to use on the items in the grid. Takes a similar format as margin or padding. Either a number or a string with the px values, '4 4 4 4', '4px', 4.
     * Buttons required spacing to be determined by a margin for proper styling, other items will use a padding. If a margin or padding is configured for the item, this will override any spacing set to the item itself or the parent layout.
     * */
    defaultSpacing: 4,

    /**
     * @cfg {String} contentJustify
     *
     * How to horizontally align the contents of the cssgrid. 
     * This applies to everything inside the cssgrid as a whole, 
     * and not individually to each item.
     * 
     * See CSS property justify-content for valid values. Examples: 'center', 'right', etc. 
     * */
    contentJustify: null,

    /**
     * @cfg {Number} containerSpacing
     *
     * If specified, this is the number (in px) which will separate Ext.Container types found in the layout. 
     * Meaning, this space will be applied to the right of a container, if another container comes after it within the same row. This is
     * to reduce doubled spacing which can occur with other spacing methods.
     * 
     * */
    containerSpacing: null,

    /**
     * @private
     * @property {Number} maxColumn
     *
     * Calculated internally by the layout.
     */

    /**
     * @private
     * @property {Number} maxRow
     *
     * Calculated internally by the layout.
     */

    /**
     * @ignore
     * Determines if the layout requires more information to complete - if so these calculations are performed.
     *
     * Executed by the classic and modern layouts:
     *  Classic - executed on calculate.
     *  Modern - executed on itemadd, itemremove, resize, and show.
     */
    runCalculations: function (items, forceUpdate) {
        var me = this,
            containerWidth = me.getTargetWidth(),
            gridCt = me.getRenderTarget();

        containerWidth = Ext.isString(containerWidth) ? parseInt(containerWidth) : containerWidth;
        if (gridCt && !Ext.isEmpty(containerWidth)) {
            // If not a refresh from invalidation, calculate. Must be ran prior to executing calculateItems.
            if (me.responsive && me.calculateLayoutInfo(items, containerWidth, forceUpdate)) {
                var groups = me.getGroups(items);
                // Reset groups so they can be configured and calculated properly.
                for (var groupName in groups) {
                    groups[groupName].configured = groups[groupName].calculated = false;
                }
                me.calculateItems(items, me.columnWidth, me.columns, me.defaultTopGroupName);
                me.updateGridContainer(gridCt, me.columnWidth, me.columns);
            } else if (!me.responsive) {
                me.calculateLayoutInfo(items, containerWidth);
                // Calculate the responsiveFill if not configured to be responsive (stretches item to fill remaining space in WYSIWYG layout of CSS Grid.
                me.calculateFill(items);
                me.updateGridContainer(gridCt, me.columnWidth, me.columns);
                me.calculateItems(items);
            }
        }
    },

    getTargetWidth: function () {
        var me = this;
        if (Ext.toolkit === 'modern') {
            var target = me.getRenderTarget(),
                targetEl = target ? target.el : null;
            return targetEl ? targetEl.getWidth() : undefined;
        } else {
            var owner = me.owner;
            if (owner.bodyResponsiveWidth && owner.bodyFixedWidth) {
                var gridCt = me.gridCt;
                return gridCt.getStyle('width') || gridCt.getWidth();
            } else {
                var targetContext = me.ownerContext.targetContext;
                return targetContext.getProp('width') || targetContext.getStyle('width') || (targetContext.lastBox ? targetContext.lastBox.width : targetContext.getDomProp('width'));
            }
        }
    },

    /**
     * @private
     * Find all items within the specified area, column or row, for the current column or row.
     */
    findAllAt: function (isColumn, placement, items) {
        var me = this,
            length = items.length,
            item,
            isLabel,
            atPlacement = [],
            itemSpacing,
            itemSpacingFactor,
            itemPlacement,
            itemSpan,
            isPercent,
            itemSize,
            earliestFillIndex = placement,
            allFill = true,
            isSingle = false,
            hasFill = false,
            hasFillViaChild = false;
        for (var i = 0; i < length; i++) {
            item = items[i];
            isLabel = Ext.toolkit === 'classic' ? item instanceof Ext.form.Label : item instanceof Ext.Label;
            itemPlacement = (isColumn ? item.responsiveCol : item.responsiveRow) || 0;
            itemSpan = (isColumn ? item.responsiveColSpan : item.responsiveRowSpan) || 1;
            if (itemPlacement === placement || (itemPlacement < placement && itemSpan > 1 && itemPlacement + itemSpan - 1 >= placement)) {
                // Item is in placement.
                hasFillViaChild = item.responsiveFillViaChild === true ? true : false;
                hasFill = hasFillViaChild || (isColumn ? (Ext.isBoolean(item.responsiveFillWidth) ? item.responsiveFillWidth : !!item.responsiveFill) : (Ext.isBoolean(item.responsiveFillHeight) ? item.responsiveFillHeight : !!item.responsiveFill));
                allFill = allFill === false ? false : hasFill;
                earliestFillIndex = hasFill ? itemPlacement < earliestFillIndex ? itemPlacement : earliestFillIndex : earliestFillIndex;
                isPercent = false;
                itemSize = isColumn ? (item.width || item.responsiveWidth || item.minWidth) : (item.height || item.responsiveHeight || item.minHeight);
                isSingle = itemSpan === 1 && itemPlacement === placement;
                itemSpacing = me.getItemSpacing(item);
                itemSpacingFactor = isColumn ? itemSpacing.left : itemSpacing.top;
                if (!Ext.isEmpty(itemSize)) {
                    isPercent = Ext.isString(itemSize) && itemSize.indexOf('%') !== -1;
                    itemSize = (parseInt(itemSize) / itemSpan) + (isPercent ? '%' : 0);
                    itemSize = Ext.isNumber(itemSize) ? Math.round(itemSize + (itemSpacingFactor * (isColumn && isLabel ? 1 : 2))) : itemSize;
                }
                atPlacement.push({
                    single: isSingle,
                    fillViaChild: hasFillViaChild,
                    fill: hasFill,
                    allFill: allFill,
                    earliestFillIndex: earliestFillIndex,
                    size: itemSize,
                    isPercent: isPercent,
                    item: item
                });
            }
        }
        return atPlacement;
    },

    translateItemsForResponsiveTemplate: function (isColumn, items) {
        var me = this,
            length = items.length,
            item,
            isLabel,
            atPlacement = [],
            itemSpacing,
            itemSpacingFactor,
            itemSpan,
            isPercent,
            itemSize,
            earliestFillIndex = 0,
            allFill = true,
            hasFill = false,
            hasFillViaChild = false;
        for (var i = 0; i < length; i++) {
            item = items[i];
            isLabel = Ext.toolkit === 'classic' ? item instanceof Ext.form.Label : item instanceof Ext.Label;
            itemSpan = (isColumn ? item.responsiveColSpan : item.responsiveRowSpan) || 1;
            hasFillViaChild = item.responsiveFillViaChild === true ? true : false;
            hasFill = hasFillViaChild || (isColumn ? (Ext.isBoolean(item.responsiveFillWidth) ? item.responsiveFillWidth : !!item.responsiveFill) : (Ext.isBoolean(item.responsiveFillHeight) ? item.responsiveFillHeight : !!item.responsiveFill));
            allFill = allFill === false ? false : hasFill;
            earliestFillIndex = hasFill ? i < earliestFillIndex ? i : earliestFillIndex : earliestFillIndex;
            isPercent = false;
            itemSize = isColumn ? (item.width || item.responsiveWidth || item.minWidth) : (item.height || item.responsiveHeight || item.minHeight);
            itemSpacing = me.getItemSpacing(item);
            itemSpacingFactor = isColumn ? itemSpacing.left : itemSpacing.top;
            if (!Ext.isEmpty(itemSize)) {
                isPercent = Ext.isString(itemSize) && itemSize.indexOf('%') !== -1;
                itemSize = (parseInt(itemSize) / itemSpan) + (isPercent ? '%' : 0);
                itemSize = Ext.isNumber(itemSize) ? Math.round(itemSize + (itemSpacingFactor * (isColumn && isLabel ? 1 : 2))) : itemSize;
            }
            atPlacement.push({
                single: length === 1,
                fillViaChild: hasFillViaChild,
                fill: hasFill,
                allFill: allFill,
                earliestFillIndex: earliestFillIndex,
                size: itemSize,
                isPercent: isPercent,
                item: item
            });
        }

        return atPlacement;
    },

    /**
     * @ignore
     * Re-calculate the maxRow and maxColumn based on the current items.
     */
    calculateMaxRowAndColumn: function (items) {
        var me = this,
            length = items.length,
            item,
            column, colspan, maxColumn = 0,
            row, rowspan, maxRow = 0,
            noItemsHaveSpecs = true;
        // Find the max column and row.
        for (var i = 0; i < length; i++) {
            item = items[i];
            if (!Ext.isEmpty(item.responsiveCol) || !Ext.isEmpty(item.responsiveColSpan)) {
                noItemsHaveSpecs = false;
            }
            column = item.responsiveCol || 0;
            colspan = item.responsiveColSpan || 1;
            if (column + colspan > maxColumn) {
                me.maxColumn = maxColumn = column + colspan;
            }
            if (!Ext.isEmpty(item.responsiveRow) || !Ext.isEmpty(item.responsiveRowSpan)) {
                noItemsHaveSpecs = false;
            }
            row = item.responsiveRow || 0;
            rowspan = item.responsiveRowSpan || 1;
            if (row + rowspan > maxRow) {
                me.maxRow = maxRow = row + rowspan;
            }
        }
        if (noItemsHaveSpecs) {
            me.maxRow = me.maxColumn = length;
        }
    },
    /**
     * Calculate the information needed to build a correct css grid for the layout.
     */
    calculateLayoutInfo: function (items, newWidth, forceUpdate) {
        // Figure out column info.
        var me = this,
            responsive = me.responsive;

        if (responsive) {
            var needsUpdate = false,
                oldWidth = me.oldWidth,
                defaultTopGroupName = me.defaultTopGroupName,
                oldColumnCount = me.columns,
                oldColumnWidth = me.columnWidth;

            if (!Ext.isEmpty(oldWidth) && newWidth === oldWidth && forceUpdate !== true) {
                needsUpdate = false;
            } else {
                // Need to calculate maxRow and maxColumn prior to template building/calculation of items.
                me.calculateMaxRowAndColumn(items); // maxRow and maxColumn is now set with the execution of this function.

                var info = me.getColumnsAndColumnWidth(items, newWidth, me.maxColumns, me.baseColumnWidth);
                me.columns = info.columns;
                me.columnWidth = info.columnWidth;
                if (forceUpdate === true || (me.columns !== oldColumnCount || me.columnWidth !== oldColumnWidth)) {
                    needsUpdate = true;
                }
                me.configureItems(items, defaultTopGroupName, me.columns, me.columnWidth);
            }
            if (needsUpdate) {
                // Only update the oldWidth if the layout is meant to be updated.
                me.oldWidth = newWidth;
            }
            return needsUpdate;
        } else {
            // Need to calculate maxRow and maxColumn prior to template building/calculation of items.
            me.calculateMaxRowAndColumn(items); // maxRow and maxColumn is now set with the execution of this function.

            // Calculate the css grid column and row template css styles.
            me.columnStyle = me.calculateColumnsTemplate(items);
            me.rowStyle = me.calculateRowsTemplate(items);
        }
    },

    /**
     * @private
     */
    calculateRowsTemplate: function (items) {
        items = items || [];
        var me = this,
            rowsTemplate = '',
            rowsInStart,
            fillUsed = {
                used: false,
                earliestFillIndex: 0
            },
            maxRow = me.maxRow;
        // Calculate rows from 0 -> (maxRow - 1) so we can stretch the rows from the start first.
        for (var i = 0; i <= (maxRow - 1); i++) {
            // Go through to the last row and lookup all row information.
            rowsInStart = me.findAllAt(false, i, items);
            if (fillUsed.used && fillUsed.earliestFillIndex < i) {
                fillUsed.used = false;
            }
            rowsTemplate += me.calculateItemTemplate(rowsInStart, false, fillUsed) + ' ';
        }
        return rowsTemplate;
    },

    /**
     * @private
     */
    calculateColumnsTemplate: function (items) {
        items = items || [];
        var me = this,
            columnsTemplate = '',
            columnsInStart,
            maxColumn = me.maxColumn,
            fillUsed = {
                used: false,
                earliestFillIndex: maxColumn - 1
            };
        // Calculate columns from (maxColumn - 1) -> 0 so we can stretch the columns until we hit a column with other needs if a fill is needing to happen.
        for (var i = maxColumn - 1; i >= 0; i--) {
            // Go through to the last column and lookup all column information.
            columnsInStart = me.findAllAt(true, i, items);
            if (fillUsed.used && fillUsed.earliestFillIndex < i) {
                fillUsed.used = false;
            }
            columnsTemplate = ' ' + me.calculateItemTemplate(columnsInStart, true, fillUsed) + columnsTemplate; // Columns get built last to first.
        }
        return columnsTemplate;
    },

    /** @private
     * Calculate the css grid column/row template for the items in the current placement (column or row).
     * @return {String} The template value for the current items.
     */
    calculateItemTemplate: function (inPlacement, isColumn, fillUsed) {
        inPlacement = inPlacement || [];
        var length = inPlacement.length,
            val = '';
        if (length) {
            var item,
                size,
                single,
                minSize,
                earliestFillIndex,
                isPlacementToFill,
                isFill,
                singleSize,
                singleHasFill,
                itemWithFillSize,
                itemFillViaChild,
                currentFillMinSizePercent,
                currentSingleMinSizePercent,
                currentMinSizePercent;
            for (var i = 0; i < length; i++) {
                item = inPlacement[i];
                size = item.size;
                // Make sure fill can occur if a single item in a column has fill.
                if (item.allFill || (length === 1 && item.single === true && (item.fill || item.fillViaChild === true))) {
                    singleHasFill = true;
                }
                // If the item is single and it has a size, keep track of it.
                if (length === 1 && item.single === true && !Ext.isEmpty(size)) {
                    single = true;
                    if (item.isPercent && Ext.isString(singleSize) && singleSize.indexOf('%') !== -1) {
                        currentSingleMinSizePercent = parseInt(singleSize);
                        singleSize = currentSingleMinSizePercent > size ? singleSize : size + '%';
                    } else if (size > singleSize) {
                        singleSize = size;
                    } else if (Ext.isEmpty(singleSize)) {
                        singleSize = size;
                    }
                }
                if (item.fill === true || item.fillViaChild === true) {
                    earliestFillIndex = isColumn ? earliestFillIndex > item.earliestFillIndex ? item.earliestFillIndex : earliestFillIndex : earliestFillIndex < item.earliestFillIndex ? item.earliestFillIndex : earliestFillIndex;
                    isFill = itemFillViaChild = true;
                    if (item.isPercent && Ext.isString(itemWithFillSize) && itemWithFillSize.indexOf('%') !== -1) {
                        currentFillMinSizePercent = parseInt(itemWithFillSize);
                        itemWithFillSize = currentFillMinSizePercent > size ? itemWithFillSize : size + '%';
                    } else if (size > itemWithFillSize || Ext.isEmpty(itemWithFillSize)) {
                        itemWithFillSize = size;
                    }
                }

                if (item.isPercent && Ext.isString(minSize) && minSize.indexOf('%') !== -1) {
                    currentMinSizePercent = parseInt(minSize);
                    minSize = currentMinSizePercent > size ? minSize : size + '%';
                } else if (size > minSize) {
                    minSize = size;
                } else if (Ext.isEmpty(minSize)) {
                    minSize = size;
                }
            }
            if ((isFill || itemFillViaChild) && !fillUsed.used) {
                fillUsed.earliestFillIndex = earliestFillIndex;
                isPlacementToFill = true;
                fillUsed.used = true;
            }
            if (Ext.isString(minSize) && minSize.indexOf('%') !== -1) {
                minSize = minSize + '%';
                if (minSize === '100%') {
                    // Use 1 flex for 100%
                    minSize = '1fr';
                }
            } else if (Ext.isNumber(minSize)) {
                // Items which have items spanning within them which span multiple placements do not need to be accounted for multiple times.
                minSize = minSize + 'px';
            } else {
                minSize = null;
            }

            if (Ext.isString(itemWithFillSize) && itemWithFillSize.indexOf('%') !== -1) {
                itemWithFillSize = itemWithFillSize + '%';

                if (itemWithFillSize === '100%') {
                    // Use 1 flex for 100%
                    itemWithFillSize = '1fr';
                }
            } else if (Ext.isNumber(itemWithFillSize)) {
                // Items which have items spanning within them which span multiple placements do not need to be accounted for multiple times.
                itemWithFillSize = itemWithFillSize + 'px';
            } else {
                itemWithFillSize = null;
            }

            if (minSize === '0px' || minSize === '0%') {
                // If no pixels. Use no pixels.
                val = '0px';
            } else if (single) {
                if (Ext.isString(singleSize) && singleSize.indexOf('%') !== -1) {
                    singleSize = singleSize + '%';
                    if (singleSize === '100%') {
                        // Use 1 flex for 100%
                        singleSize = '1fr';
                    }
                } else if (Ext.isNumber(singleSize)) {
                    // Items which have items spanning within them which span multiple placements do not need to be accounted for multiple times.
                    singleSize = singleSize + 'px';
                } else {
                    singleSize = null;
                }
                if (isColumn) {
                    // If there is a single item and it has a width, use it.
                    val = Ext.isNumber(parseInt(singleSize)) ? singleSize : 'auto';
                } else {
                    // If there is a single item and it has a size, use it.
                    val = (Ext.isNumber(parseInt(singleSize)) ? (singleSize ? singleSize : 'auto') : 'max-content');
                }
                if (singleHasFill) {
                    // If the single item has a fill, use the minmax to allow fill.
                    val = 'minmax(' + val + ', 1fr)';
                }
            } else if (isPlacementToFill || singleHasFill) { /** singleHasFill can potentially make it here - if all items in the placement are meant to fill, then we will minmax the value. */
                // If the item is meant to fill. Use minmax in the case where it allowed.
                val = Ext.isNumber(parseInt(itemWithFillSize)) ? itemWithFillSize : (itemWithFillSize ? 'auto' : 'min-content');
                val = 'minmax(' + val + ', 1fr)';
            } else if (isColumn) {
                // Allow dead columns to happen if the val is not a number.
                val = Ext.isNumber(parseInt(minSize)) ? 'max-content' /* Instead of using the width, use max-content so it fills to the greatest width found on an item */ : isPlacementToFill ? '0px' : 'min-content';
            } else {
                // Allow dead items to occur if the minSize is not a number.
                val = Ext.isNumber(parseInt(minSize)) ? minSize : isFill ? 'auto' : 'min-content';
            }
        } else {
            val = '0px';
        }
        return val;
    },

    /**
     * @private
     * Ensures the responsiveFill property of items get upwards inheritence of childs to the parent for proper fill logic.
     */
    calculateFill: function (items) {
        var me = this,
            owner,
            length = items.length,
            item;

        if (Ext.toolkit === 'modern') {
            owner = me.getContainer();
        } else {
            owner = me.owner;
        }

        for (var i = 0; i < length; i++) {
            item = items[i]
            // If an item is meant to fill, update its parent to fill.
            if ((item.responsiveFill || item.responsiveFillViaChild) && owner.responsiveFill !== true && owner.responsiveFillViaChild !== true) {
                owner.responsiveFillViaChild = true;
            }
        }
    },

    /**
     * @private
     * Sorts the items in the layout.
     */
    determineItemsWithColumnRowSorting: function (items) {
        return items.sort(this.columnAndRowSort);
    },

    /**
     * @private
     * Sort function for the items in the layout.
     */
    columnAndRowSort: function (itemA, itemB) {
        if (itemA.responsiveRow === itemB.responsiveRow) {
            if (itemA.responsiveCol < itemB.responsiveCol) {
                return -1;
            } else {
                if (itemA.responsiveCol === itemB.responsiveCol) {
                    return 0;
                }
                return 1;
            }
        } else if (itemA.responsiveRow < itemB.responsiveRow) {
            return -1;
        } else {
            if (itemA.responsiveRow === itemB.responsiveRow) {
                return 0
            }
            return 1;
        }
    },

    /**
     * @private
     * Determine if the layouts items are able to be sorted via column and row info.
     */
    isColumnAndRowSortable: function (items) {
        var i,
            item,
            len = items.length;

        for (i = 0; i < len; i++) {
            item = items[i];
            if (Ext.isEmpty(item.responsiveCol) || Ext.isEmpty(item.responsiveColSpan)
                || Ext.isEmpty(item.responsiveRow) || Ext.isEmpty(item.responsiveRowSpan)) {
                return false
            }
        }
        return true;
    },

    /**
     * @private
     * Overrides the Ext calculate items.
     * Calculates the items in the css grid layout. If responsive, the {@link #calculateResponsiveItems} is executed.
     */
    calculateItems: function (items, columnWidth, columns, groupName) {
        // Use the responsive logic if the layout is configured to do so.
        if (this.responsive) {
            // Re-define the rowStyling.
            this.rowStyle = this.calculateResponsiveItems(items, columnWidth, columns, groupName);
        } else {
            var me = this,
                len = items.length,
                item,
                style,
                minWidth,
                isLabel,
                itemSpacing,
                minHeight,
                itemWidth,
                margin,
                bodyEl,
                col, colspan, row, rowspan,
                bodyStyle,
                spanRowEnd,
                spanColEnd,
                largestRowCount = me.maxRow,
                largestColumnCount = me.maxColumn;

            for (var i = 0; i < len; i++) {
                item = items[i];
                bodyEl = Ext.toolkit === 'modern' ? item.bodyWrapElement : item.bodyEl;
                bodyStyle = null;
                isLabel = Ext.toolkit === 'classic' ? item instanceof Ext.form.Label : item instanceof Ext.Label;
                itemSpacing = me.getItemSpacing(item);
                style = {
                    // To be filled.
                };

                row = (item.responsiveRow || 0) + 1;
                rowspan = item.responsiveRowSpan || 1;
                col = (item.responsiveCol || 0) + 1;
                colspan = (item.responsiveColSpan || 1);
                spanRowEnd = len != 1 && item.responsiveFill && (row + (rowspan - 1)) >= largestRowCount ? true : false;
                spanColEnd = len != 1 && item.responsiveFill && (col + (colspan - 1)) >= largestColumnCount ? true : false;
                if (Ext.isIE) {
                    Ext.apply(style, {
                        '-ms-grid-row': row,
                        '-ms-grid-row-span': rowspan,
                        '-ms-grid-column': col,
                        '-ms-grid-column-span': colspan // TODO: IE span to end ?
                    });
                    if (item.cellAlign || isLabel) {
                        Ext.apply(style, {
                            '-ms-grid-column-align': item.cellAlign || (isLabel ? 'flex-end' : 'safe')
                        });
                    }
                } else {
                    Ext.apply(style, {
                        'grid-row-start': row,
                        'grid-row-end': 'span ' + (spanRowEnd ? 'end' : rowspan),
                        'grid-column-start': col,
                        'grid-column-end': 'span ' + (spanColEnd ? 'end' : colspan)
                    });
                    if (item.cellAlign || isLabel) {
                        Ext.apply(style, {
                            'justify-self': item.cellAlign || (isLabel ? 'flex-end' : 'safe')
                        });
                        if (Ext.browser.is.Firefox && isLabel) {
                            // Firefox requires extra label centering to occur for vertical alignment issues.
                            Ext.apply(style, {
                                'align-self': 'center'
                            });
                        }
                    }
                }

                minHeight = item.responsiveMinHeight || item.minHeight || 0;
                if (Ext.isString(minHeight) && minHeight.indexOf('%') !== -1) {
                    // As is.
                } else if (Ext.isNumber(minHeight)) {
                    minHeight = minHeight + 'px';
                }
                minWidth = item.responsiveMinWidth || item.minWidth || 0;
                if (Ext.isString(minWidth) && minWidth.indexOf('%') !== -1) {
                    // As is.
                } else if (Ext.isNumber(minWidth)) {
                    minWidth = minWidth + 'px';
                }
                itemWidth = item.responsiveWidth || item.width;
                if (Ext.isString(itemWidth) && itemWidth.indexOf('%') !== -1) {
                    // As is.
                } else if (Ext.isNumber(itemWidth)) {
                    itemWidth = itemWidth + 'px';
                }
                itemHeight = item.responsiveHeight || item.height;
                if (Ext.isString(itemHeight) && itemHeight.indexOf('%') !== -1) {
                    // As is.
                } else if (Ext.isNumber(itemHeight)) {
                    itemHeight = itemHeight + 'px';
                }
                if ((Ext.toolkit === 'modern' ? item instanceof Ext.field.Field : item instanceof Ext.form.field.Base) && bodyEl) {
                    bodyStyle = bodyStyle || {};
                    if (item.responsiveFill === true) {
                        Ext.apply(bodyStyle, {
                            'width': '100%'
                        });
                    } else if (item.responsiveFillWidth === true) {
                        Ext.apply(bodyStyle, {
                            'width': '100%'
                        });
                    } else {
                        Ext.apply(bodyStyle, {
                            'width': itemWidth
                        });
                    }
                    // If the item is a field with a body element, we are making sure the width of the body element reflects the width intended by the items configuration.
                    if (!Ext.isEmpty(minWidth)) {
                        Ext.apply(bodyStyle, {
                            'minWidth': minWidth,
                        });
                    }

                    if (!Ext.isEmpty(minHeight)) {
                        Ext.apply(bodyStyle, {
                            'minHeight': minHeight,
                        });
                    }
                    if (bodyEl) {
                        if (bodyEl.dom) {
                            Ext.apply(bodyEl.dom.style, bodyStyle);
                        } else {
                            bodyEl.setStyle(bodyStyle);
                        }
                    }
                }
                if (!Ext.isEmpty(minWidth) && Ext.isEmpty(style.minWidth)) {
                    style.minWidth = minWidth;
                }
                if (!Ext.isEmpty(minHeight) && Ext.isEmpty(style.minHeight)) {
                    style.minHeight = minHeight;
                }
                if (!Ext.isEmpty(itemWidth) && Ext.isEmpty(style.width)) {
                    style.width = itemWidth;
                }
                if (!Ext.isEmpty(itemHeight) && Ext.isEmpty(style.height)) {
                    style.height = itemHeight;
                }

                // If an item is meant to fill, set the width and height to 100%
                if (item.responsiveFill === true || item.responsiveFillViaChild == true) {
                    style.width = '100%';
                    style.height = (Ext.toolkit === 'modern' ? item instanceof Ext.field.Field : item instanceof Ext.form.field.Base) ? 'auto' : '100%';
                } else if (Ext.isEdge || Ext.isIE) {
                    // Handle MS Edge Case for non stretch items.
                    style.minWidth = 'calc(100% - ' + (itemSpacing.left + itemSpacing.right) + 'px)';
                }

                if (!(item instanceof Ext.Container) || item.isLabelable) {
                    // For non container type items or all labelable items, apply a margin to help with spacing.
                    // Issue in firefox where the outer margin thinks of being out of the bounds of the cell in the grid, causing the grid to attempt to grow to fit.
                    style[Ext.browser.is.Firefox && !(item instanceof Ext.Button) ? 'padding' : 'margin'] = me.getItemSpacingStyle(itemSpacing);
                }
                // Set the final style to the items element.
                if (item.setStyle) {
                    item.setStyle(style);
                } else if (item.protoEl && item.protoEl.setStyle) {
                    item.protoEl.setStyle(style);
                }
            }
        }
    },

    /**
     * @private
     * Responsive function.
     * Determines the correct column and row information to be utilized within the css grid styling.
     */
    calculateResponsiveItems: function (items, columnWidth, columns, groupName) {
        var me = this,
            item,
            itemEl,
            itemRow,
            isGroup,
            previousIsGroup = false,
            previousItemRow = -1,
            previousItemSetRow = -1,
            len = items.length,
            style,
            bodyEl,
            translatedItems,
            calcItems = [],
            checkStyle,
            groupStyle,
            groups = me.groups,
            group,
            modern = Ext.toolkit === 'modern',
            rowIdx = 0,
            fillUsed = {
                used: false,
                earliestFillIndex: 0
            },
            single = false,
            rowStyle = '',
            template,
            currentGroupName,
            colIdx = 0,
            rowspans = [], // rolling list of active rowspans for each column.
            j,
            spacingStyle,
            itemSpacing;

        // Assert sorting within the group as well.
        items = me.determineItemsWithColumnRowSorting(items);
        // If the layout has not determined its column width or total columns, return so it has a chnace to run those calculations first.
        if (Ext.isEmpty(columnWidth) || Ext.isEmpty(columns)) {
            return;
        }
        for (var i = 0; i < len; i++) {
            item = items[i];
            itemRow = item.responsiveRow;
            //currentGroupName = item.responsiveGroup;
            //group = groups[currentGroupName];
            // if (group && currentGroupName !== groupName) {
            //     if ((colIdx + group.colspan) > columns) {
            //         // move down to next row
            //         colIdx = 0;
            //         rowIdx++;
            //         translatedItems = me.translateItemsForResponsiveTemplate(false, calcItems);
            //         template = me.calculateResponsiveItemTemplate(translatedItems, false, fillUsed);
            //         rowStyle += (i === 0 ? '' : ' ') + template;
            //         // decrement all rowspans
            //         for (j = 0; j < columns; j++) {
            //             if (rowspans[j] > 0) {
            //                 rowspans[j]--;
            //             }
            //         }
            //         // Item right now is going into the next row if calcItems length is not 1.
            //         // A single item overflow its row, will stay in the 1 row.
            //         calcItems = calcItems.length === 1 ? [] : [item];
            //     } else {
            //         // Find the first available row/col slot not taken up by a spanning cell
            //         while (colIdx >= columns || rowspans[colIdx] > 0) {
            //             if (colIdx >= columns) {
            //                 // move down to next row
            //                 colIdx = 0;
            //                 rowIdx++;
            //                 // decrement all rowspans
            //                 for (j = 0; j < columns; j++) {
            //                     if (rowspans[j] > 0) {
            //                         rowspans[j]--;
            //                     }
            //                 }
            //             } else {
            //                 colIdx++;
            //             }
            //         }
            //         // Only push an item into calcItems if it is going into the currentRow.
            //         calcItems.push(item);
            //     }
            //     if (group.calculated) {
            //         // If the group is already configured, the items within the group are already processed, skip.
            //     } else {
            //         // If not calculated, we need to get the groups colspan and run the items through the mill with the correct columns and columnWidth specs.
            //         me.calculateResponsiveItems(group.items, group.columnWidth, group.columns, currentGroupName);
            //         if (group.el) {
            //             group.el.toggleCls(me.groupCls, true);
            //             groupStyle = group.el.style;
            //             if (itemRow > previousItemRow && previousItemSetRow === rowIdx) {
            //                 // move down to next row
            //                 colIdx = 0;
            //                 rowIdx++;
            //                 // decrement all rowspans
            //                 for (j = 0; j < columns; j++) {
            //                     if (rowspans[j] > 0) {
            //                         rowspans[j]--;
            //                     }
            //                 }
            //             }
            //             style = {
            //                 '-ms-grid-row': (rowIdx + 1).toString(),
            //                 '-ms-grid-column-span': (group.colspan || 1),
            //                 '-ms-grid-column': colIdx + 1,
            //                 'grid-column-start': colIdx + 1,
            //                 'grid-column-end': 'span ' + group.colspan
            //             };
            //             checkStyle = {
            //                 '-ms-grid-row': groupStyle['-ms-grid-row'],
            //                 '-ms-grid-column-span': groupStyle['-ms-grid-column-span'],
            //                 '-ms-grid-column': groupStyle['-ms-grid-column'],
            //                 'grid-column-start': groupStyle['grid-column-start'],
            //                 'grid-column-end': groupStyle['grid-column-end']
            //             };
            //             if (!Ext.Object.equals(style, checkStyle)) {
            //                 group.el.setStyle(style);
            //             }
            //             previousItemRow = itemRow;
            //             previousItemSetRow = rowIdx;
            //         }
            //         // Increment
            //         for (j = group.colspan || 1; j; --j) {
            //             rowspans[colIdx] = group.rowspan || 1;
            //             ++colIdx;
            //         }
            //         group.calculated = true;
            //         // Check to see if the parent group is fully calculated as well now. It may be possible the parent group only contains this group.
            //         if (groups[group.parentGroup] && !groups[group.parentGroup].calculated) {
            //             groups[group.parentGroup].calculated = me.isParentGroupFinished('calculated', group.parentGroup);
            //         }
            //     }
            // } else {
            itemEl = item.el;
            itemSpacing = me.getItemSpacing(item);
            itemEl.toggleCls(me.gridItemCls, true);
            if ((colIdx + item.colspan) > columns || itemRow > previousItemRow && previousItemSetRow === rowIdx + 1) {
                // If overflow, or if the current item was set to not be on the same row as the previous item via configuration, move to the next row.
                // If no items, calc with the current item.
                single = calcItems.length === 0;
                calcItems = single ? [item] : calcItems;
                // move down to next row
                colIdx = 0;
                rowIdx++;
                // decrement all rowspans
                for (j = 0; j < columns; j++) {
                    if (rowspans[j] > 0) {
                        rowspans[j]--;
                    }
                }
                translatedItems = me.translateItemsForResponsiveTemplate(false, calcItems);
                template = me.calculateItemTemplate(translatedItems, false, fillUsed);
                rowStyle += ' ' + template;
                // Item right now is going into the next row.
                calcItems = single ? [] : [item];
            } else {
                // Find the first available row/col slot not taken up by a spanning cell
                while (colIdx >= columns || rowspans[colIdx] > 0) {
                    if (colIdx >= columns) {
                        // decrement all rowspans
                        for (j = 0; j < columns; j++) {
                            if (rowspans[j] > 0) {
                                rowspans[j]--;
                            }
                        }
                    } else {
                        colIdx++;
                    }
                }
                // Only push an item into calcItems if it is going into the currentRow.
                calcItems.push(item);
            }
            // For container type items, apply a padding to help with spacing.
            // Zero out margin. Margin interferes with items and css grid column widths, causing scrollbars to appear.
            var useFullWidth = !!(item.layout ? item.layout.contentJustify : false);
            style = {
                'justify-self': item.cellAlign || 'stretch',
                'align-self': item.rowAlign,
                '-ms-grid-row': (rowIdx + 1).toString(),
                '-ms-grid-column-span': Ext.isIE ? (item.colspan || 1) : undefined,
                '-ms-grid-column': Ext.isIE ? (colIdx + 1).toString() : undefined,
                'grid-column-start': (colIdx + 1).toString(),
                'grid-column-end': 'span ' + item.colspan,
                'grid-row-start': (rowIdx + 1).toString(),
                'width': useFullWidth ? '100%' : 'auto' // TODO: This will break if there are multiple panels inside each other using contentJustify.
            };

            if (modern ? item instanceof Ext.field.Field : item instanceof Ext.form.field.Base) {
                bodyEl = modern ? item.bodyWrapElement : item.bodyEl;
                if (bodyEl) {
                    bodyEl.toggleCls(me.itemBodyCls, true);
                }
            } else if (item instanceof Ext.Container) {
                bodyEl = modern ? item.bodyWrapElement : item.body;
                if (bodyEl) {
                    bodyEl.toggleCls(me.itemBodyCls, true);
                }
            }
            // Fix for Edge not stretching fields to the width of the css-grid columns it spans - needs a min-width rather than a width to determine this.
            if (Ext.isEdge) {
                style.minWidth = '100%';
            }
            if (item.fixedWidth) {
                var maxWidth = item.responsiveWidth || item.responsiveMaxWidth || item.responsiveMinWidth;
                if (Ext.isString(maxWidth)) {
                    // If the width is a string value, set it directly. It is either a % or already a px value string.
                    style['max-width'] = maxWidth;
                } else {
                    if (maxWidth >= columnWidth * columns) {
                        maxWidth = columnWidth * columns;
                    }
                    style['max-width'] = maxWidth + 'px';
                }
            }
            isGroup = item instanceof Ext.Container;
            // Apply container spacing if configured.
            if (!Ext.isEmpty(me.containerSpacing) && isGroup) {
                style['margin-left'] = previousIsGroup && previousItemSetRow === rowIdx ? (Ext.isString(me.containerSpacing) ? me.containerSpacing : me.containerSpacing + 'px') : '0px';
            }
            previousIsGroup = isGroup;

            spacingStyle = me.getItemSpacingStyle(itemSpacing);
            // For responsive and (non container type items or all labelable items), apply a margin for all buttons.
            // There is an issue in the css griddisplay where the outer margin thinks of being out of the bounds of the cell in the grid, causing the grid to attempt to grow to fit.
            if (item instanceof Ext.Button) {
                style.width = 'calc(100% - ' + (itemSpacing.right + itemSpacing.left) + 'px)';
                style.margin = spacingStyle;
            } else {
                style.padding = spacingStyle;
            }

            itemEl.setStyle(style);
            // Increment
            for (j = item.colspan || 1; j; --j) {
                rowspans[colIdx] = item.rowspan || 1;
                ++colIdx;
            }
            previousItemRow = itemRow;
            previousItemSetRow = rowIdx;
        }

        // Finish the row styling with the last items.
        if (calcItems.length > 0) {
            translatedItems = me.translateItemsForResponsiveTemplate(false, calcItems);
            template = me.calculateItemTemplate(translatedItems, false, fillUsed);
            rowStyle += ' ' + template;
        }
        return rowStyle;
    },

    /**
     * @private
     * Return an object with the top, right, bottom, and left integer values for spacing.
     */
    getItemSpacing: function (item) {
        // Button = pull margin - if it has one, override any spacing provided at item or groups. Width calc = 100% - (left and right value sum)px.
        // All other = pull padding - if it has one, override any spacing provided at item or groups. Width = 100%.
        var me = this,
            itemEl = item.el ? item.el : item.element,
            useMargin = item instanceof Ext.Button,
            columnSpacing = me.columnSpacing,
            rowSpacing = me.rowSpacing,
            spacing = Ext.dom.Element.parseBox(me.defaultSpacing), // me.getSpacing(me.defaultSpacing),
            itemSpacing = Ext.isEmpty(item.spacing) ? spacing : Ext.dom.Element.parseBox(item.spacing), // me.getSpacing(item.spacing),
            isLabel = Ext.toolkit === 'classic' ? item instanceof Ext.form.Label : item instanceof Ext.Label,
            styles = {};
        // Merge any grid-level default column and row spacing into the default spacing.
        if (!Ext.isEmpty(columnSpacing)) {
            spacing.left = spacing.right = columnSpacing;
        }
        if (!Ext.isEmpty(rowSpacing)) {
            spacing.top = spacing.botton = rowSpacing;
        }
        // Pull any defined spacing on the styles.
        // Must be defined and > 0.
        // To set no spacing on items, set spacing = 0 on the item configuration.
        if (itemEl) {
            var top = (useMargin ? itemEl.getMargin('t') : itemEl.getPadding('t')) || undefined,
                right = (useMargin ? itemEl.getMargin('r') : itemEl.getPadding('r')) || undefined,
                bottom = (useMargin ? itemEl.getMargin('b') : itemEl.getPadding('b')) || undefined,
                left = (useMargin ? itemEl.getMargin('l') : itemEl.getPadding('l')) || undefined;
            if (top) {
                styles.top = top;
            }
            if (right) {
                styles.right = right;
            }
            if (bottom) {
                styles.bottom = bottom;
            }
            if (left) {
                styles.left = left;
            }
        }

        // Apply any group spacing to the item if not set already.
        Ext.applyIf(itemSpacing, spacing);
        Ext.apply(itemSpacing, styles);
        if (isLabel) {
            itemSpacing.right = 0; // Allow separate labels to be abutted to the left of their value field.
        }
        return itemSpacing;
    },

    /**
     * @private
     * Return a 4-part CSS string for margin or padding.
     */
    getItemSpacingStyle: function (itemSpacing) {
        return itemSpacing.top + 'px ' + itemSpacing.right + 'px ' + itemSpacing.bottom + 'px ' + itemSpacing.left + 'px';
    },

    /**
     * @private
     * Evaluates the spacing value. Returns the object containing top, right, bottom, left integer values.
     */
    /*
    getSpacing: function (spacing) {
        if (Ext.isNumber(spacing)) {
            return {
                top: spacing,
                right: spacing,
                bottom: spacing,
                left: spacing
            };
        } else if (Ext.isString(spacing)) {
            var split = spacing.split(' '),
                length = split.length;

            // Convert all to integers.
            split.forEach(function (space, index) {
                split[index] = parseInt(space);
            });

            if (length === 1) {
                // TRBL
                return {
                    top: split[0],
                    right: split[0],
                    bottom: split[0],
                    left: split[0]
                }
            } else if (length === 2) {
                // TB RL
                return {
                    top: split[0],
                    right: split[1],
                    bottom: split[0],
                    left: split[1]
                }
            } else if (length === 3) {
                // T RL B
                return {
                    top: split[0],
                    right: split[1],
                    bottom: split[2],
                    left: split[1]
                }
            } else if (length === 4) {
                // T R B L
                return {
                    top: split[0],
                    right: split[1],
                    bottom: split[2],
                    left: split[3]
                }
            }
        } else {
            return {};
        }
    },
*/

    /**
     * @private
     * Responsive function
     *
     * Determines what the column span of the items should be in preparation for the calculation of the styles.
     */
    configureItems: function (items, groupName, columns, columnWidth) {
        var me = this,
            i = 0,
            groups = me.groups || me.getGroups(items),
            len = items.length,
            item,
            info,
            group,
            groupWidth,
            groupColSpan,
            currentGroupName,
            currentItemColSpan,
            currentItemRow,
            previousItemRow = len > 0 ? items[0].responsiveRow : null,
            emptyColumns = columns,
            lastEndIndex = 0,
            fillRowWidth = me.fillRowWidth,
            rowFinished = false;

        // Determine the correct total columns.
        for (; i < len; i++) {
            item = items[i];
            groupColSpan = false;
            groupWidth = 0;
            currentGroupName = item.responsiveGroup;
            group = groups[currentGroupName];

            // As soon as we hit a group we need to assess what its colspan and width will be.
            // Upon doing this, configure the items within the group and set group to configured = true.
            if (group && currentGroupName !== groupName) {
                if (group.configured) {
                    // If the group is already configured, the items within the group are already processed, skip.
                    continue;
                } else {
                    // If not configured, we need to get the groups colspan and run the items through the mill with the correct columns and columnWidth specs.
                    groupColSpan = me.getGroupColSpan(group.items, emptyColumns, columnWidth);
                }
            }

            if (groupColSpan) {
                if (groupColSpan > emptyColumns) {
                    if (emptyColumns !== columns) {
                        // Need to go onto new row.
                        // If the group is too large, wrap.
                        if (fillRowWidth) {
                            me.stretchItemsForRow(items, lastEndIndex, emptyColumns, columns, i, columnWidth);
                        }
                        emptyColumns = columns;
                        lastEndIndex = i; // Since we just finished a row, set the lastEndIndex to i since we need to stretch the current item (i) when finishing the next row.
                        i--; // Go back one so we can calculate the next row including this group.
                        rowFinished = true;  // Set rowFinished to false since we still have a group which needs to be stretched.
                        continue;
                    } else {
                        // If greater than total columns allowed, we need to shrink.
                        groupColSpan = groupColSpan > columns ? columns : groupColSpan;
                        // On start of new row, will fill entire row.
                        groupWidth = groupColSpan * columnWidth;
                    }
                } else {
                    // Able to fit in current row.
                    groupWidth = groupColSpan * columnWidth;
                }
                info = me.getColumnsAndColumnWidth(group.items, groupWidth);
                group.columns = info.columns;
                group.columnWidth = info.columnWidth;
                group.colspan = groupColSpan;

                me.configureItems(group.items, currentGroupName, info.columns, info.columnWidth);
                me.updateGridContainer(group.el, info.columnWidth, info.columns);

                // Set the groups configured prop value to true so the items do not get processed again.
                group.configured = true;
                // Check to see if the parent group is fully configured as well now. It may be possible the parent group only contains this group.
                if (groups[group.parentGroup] && !groups[group.parentGroup].configured) {
                    groups[group.parentGroup].configured = me.isParentGroupFinished('configured', group.parentGroup);
                }
                // Calculate any remaining column space
                emptyColumns = emptyColumns - group.colspan;
                if (emptyColumns > 0) {
                    rowFinished = false;
                } else {
                    rowFinished = true;
                    lastEndIndex = i;
                    emptyColumns = columns;
                }
            } else {
                currentItemRow = Ext.isEmpty(item.responsiveRow) ? null : item.responsiveRow;
                currentItemColSpan = me.getItemColSpan(item, emptyColumns, columnWidth);
                // If the group is not too large, continue as normal.
                if (emptyColumns === columns && currentItemColSpan >= columns) {
                    // /\ If this is the first item and the current item cannot fit in a single row, shrink its column count to fit exactly in.
                    item.colspan = columns;
                    lastEndIndex = i + 1; // Set the last end index to i + 1 since we do not want the stretching of multiple groups to include this one.
                    previousItemRow = items[lastEndIndex] ? items[lastEndIndex].responsiveRow : currentItemRow;
                    rowFinished = true;  // Set rowFinished to true since we just filled a row.
                } else if (currentItemColSpan > emptyColumns || (currentItemRow !== null && previousItemRow === null) || (currentItemRow !== null && previousItemRow !== null && currentItemRow > previousItemRow)) {
                    // /\ If the current item (not the first) cannot fit in the remainder of the current row, the current rows items need to be stretched to fill the row.
                    // Once the row is stretched, start from the beginning using this current item; i, so i-- is needed.
                    // Stretch the items in the row previous to this one (i).

                    //   !!!!
                    // **** Account for groups in the stretching of the row ******
                    //   !!!!
                    if (fillRowWidth) {
                        me.stretchItemsForRow(items, lastEndIndex, emptyColumns, columns, i, columnWidth);
                    }
                    emptyColumns = columns;
                    lastEndIndex = i; // Since we just finished a row, set the lastEndIndex to i since we need to stretch the current item (i) when finishing the next row.
                    i--; // Go back one so we can calculate the next row including this group.
                    previousItemRow = currentItemRow;
                    rowFinished = false;  // Set rowFinished to false since we still have a group which needs to be stretched.
                } else {
                    // Set the current items colspan if it isn't a fixed width since it can fit.
                    item.colspan = currentItemColSpan;
                    emptyColumns -= currentItemColSpan;
                    if (emptyColumns > 0) {
                        previousItemRow = currentItemRow;
                        rowFinished = false;
                    } else {
                        emptyColumns = columns;
                        lastEndIndex = i;
                        previousItemRow = items[i + 1] ? items[i + 1].responsiveRow : currentItemRow;
                        rowFinished = true;  // Set rowFinished to true since we have no more columns.
                    }
                }
            }
        }

        // If the final row was never filled, fill it here.
        if (len > 0 && fillRowWidth && !rowFinished) {

            //   !!!!
            // **** Account for groups in the stretching of the row ******
            //   !!!!
            me.stretchItemsForRow(items, lastEndIndex, emptyColumns, columns, len, columnWidth);
        }
    },

    /**
     * @private
     * Responsive function
     *
     * Initializes the element where a css grid is being configured.
     */
    updateGridContainer: function (gridCt, columnWidth, columns) {
        var me = this,
            owner = me.owner || me.getContainer(), // Classic || Modern
            gridDom = gridCt.dom ? gridCt.dom : gridCt,
            gridStyle = gridDom ? gridDom.style : null,
            totalWidth = gridCt ? gridCt.getWidth() : null;
        if (gridStyle) {
            var style = {};
            // TODO: Move static css to a class to apply to the items.
            if (!me.gridContainerStyled) {
                gridCt.toggleCls(me.baseCls, true);
                if (me.responsive) {
                    gridCt.toggleCls(me.baseResponsiveCls, true);
                }
                me.gridContainerStyled = true;
            }

            var columnsTemplate = me.columnStyle,
                trimLastColumn = false,
                rowsTemplate = me.rowStyle;
            if (me.responsive) {
                if (me.contentJustify) {
                    style['justify-content'] = me.contentJustify;
                }
                if (me.fixedColumnWidth) {
                    columnsTemplate = Ext.String.repeat(me.fixedColumnWidth + 'px', columns, ' ');
                } else {
                    if (totalWidth && totalWidth < columnWidth * columns) {
                        trimLastColumn = true;
                    }
                    columnsTemplate = Ext.String.repeat(Ext.String.format(me.responsiveGridTplFormat, columnWidth), trimLastColumn ? columns - 1 : columns, ' ');
                    if (columns === 1) {
                        columnsTemplate = '100%'; // 100% needed instead of '1fr' otherwise rotate on iOS does not resize back to original width.
                    } else if (trimLastColumn) {
                        columnsTemplate += ' 1fr';
                    }
                }

                // TODO: Currently only tested with responsive - needs another iteration of testing with wysiwyg
                if (owner.bodyFixedWidth && owner.bodyResponsiveWidth) {
                    var maxWidth = owner.bodyResponsiveWidth || owner.bodyResponsiveWidth || owner.bodyResponsiveWidth;
                    if (Ext.isString(maxWidth)) {
                        // If the width is a string value, set it directly. It is either a % or already a px value string.
                        style['max-width'] = maxWidth;
                    } else {
                        style['max-width'] = maxWidth + 'px';
                    }
                } else {
                    style['max-width'] = '100%';
                }
            }
            // Only fill for css grid owner items not a direct child of an accordion.
            if (owner.responsiveFillViaChild && gridStyle['height'] !== '100%') {
                style["height"] = "100%";
            }
            // Set the proper grid-template of the target gridCt.
            if (Ext.isIE && columnsTemplate !== gridStyle['-ms-grid-columns']) {
                style['-ms-grid-columns'] = columnsTemplate;
            } else if (columnsTemplate !== gridStyle['grid-template-columns']) {
                style['grid-template-columns'] = columnsTemplate;
            }

            if (Ext.isIE && rowsTemplate !== gridStyle['-ms-grid-rows']) {
                style['-ms-grid-rows'] = rowsTemplate;
            } else if (rowsTemplate !== gridStyle['grid-template-rows']) {
                style['grid-template-rows'] = rowsTemplate;
            }

            if (!Ext.Object.isEmpty(style)) {
                gridCt.setStyle(style);
            }
        }
    },

    /**
     * @private
     * Responsive function
     * If not wysiwyg then we must determine the column count by using the parent width and child widths if they exist.
     * Try to find if an item has a colSpan and a width set, if so, the largest one can used as the column width of the grid.
     */
    getColumnWidth: function (items, newWidth) {
        var me = this,
            itemWidth,
            item,
            i, len = items.length,
            allWidths = [];
        // If a child does have a width it can be interpreted as the responsiveWidth as well.
        for (i = 0; i < len; i++) {
            item = items[i];
            // Only calculate columnWidth with responsiveWidths if the item does not have a responsiveColSpan.
            if (Ext.isEmpty(item.responsiveColSpan)) {
                itemWidth = item.responsiveWidth;
                if (Ext.isString(itemWidth) && itemWidth.indexOf('%') === -1) {
                    itemWidth = parseInt(itemWidth);
                }
                if (itemWidth && !isNaN(itemWidth)) {
                    allWidths.push(me.nearestEven(itemWidth));
                }
            }
        }

        if (allWidths.length > 0) {
            allWidths.push(me.nearestEven(newWidth));
            // Find the GCD of the widths to determine the most suitable column width.
            return Math.max(me.findGCD(allWidths), me.minColumnWidth);
        }
    },

    /**
     * @private
     * Responsive function.
     * Find the GCD of an array of numbers.
     */
    findGCD: function (items) {
        if (Object.prototype.toString.call(items) !== '[object Array]')
            return false;
        var len, a, b;
        len = items.length;
        if (!len) {
            return null;
        }
        a = items[0];
        for (var i = 1; i < len; i++) {
            b = items[i];
            a = this.gcdTwo(a, b);
        }
        return a;
    },

    /**
     * @private
     * Responsive function.
     * Find the GCD of two numbers.
     */
    gcdTwo: function (x, y) {
        if ((typeof x !== 'number') || (typeof y !== 'number'))
            return false;
        x = Math.abs(x);
        y = Math.abs(y);
        while (y) {
            var t = y;
            y = x % y;
            x = t;
        }
        return x;
    },

    /**
     * @private
     * Responsive function
     * Get the largest column width determined by the items within the layout.
     */
    getLargestColumnWidth: function (items) {
        var columnWidth = 0,
            i,
            item,
            len = items.length,
            largestColumnWidth = null;

        for (i = 0; i < len; i++) {
            item = items[i];
            if (!Ext.isEmpty(item.responsiveColSpan)) {
                columnWidth = item.responsiveWidth || 0;
                columnWidth = columnWidth / (item.responsiveColSpan || 1);
                columnWidth = isNaN(columnWidth) ? 1 : columnWidth;
                if (columnWidth > largestColumnWidth) {
                    largestColumnWidth = columnWidth;
                }
            }
        }
        return largestColumnWidth;
    },

    /**
     * @private
     * Responsive function
     *
     * Get the nearest even whole number of a number.
     */
    nearestEven: function (num) {
        return 2 * Math.round(num / 2);
    },

    /**
     * @private
     * Responsive function
     *
     * Get the colspan of an item in the current processing of the layout. Bound by empty columns and the column width of the group.
     *
     * When an item managed by a responsiveColSpan different rules apply than when an item is ruled by its responsiveWidth.
     *  If a responsiveColSpan exists this will take precedence. However, this as well as any minWidth or responsiveWidth set to the item will be taken into consideration as well.
     *  If a responsiveColSpan is greater than what allows for the responsiveWidth or minWidth to be shown, the minWidth will be used.
     */
    getItemColSpan: function (item, emptyColumns, columnWidth) {
        var currentItemColSpan,
            widthColSpan = 0;

        if (!Ext.isEmpty(item.responsiveColSpan)) {
            currentItemColSpan = item.responsiveColSpan;
            var emptyWidth = emptyColumns * columnWidth,
                itemWidth = currentItemColSpan * columnWidth;

            if (emptyWidth <= itemWidth) {
                currentItemColSpan = emptyColumns;
            }

            if (Ext.isString(item.responsiveWidth) && item.responsiveWidth.indexOf('%') !== -1) {
                var percent = parseInt(item.responsiveWidth.replace('%', '')) / 100;
                widthColSpan = Math.round(percent * emptyColumns);
                itemWidth = widthColSpan * columnWidth;
                if (emptyWidth < itemWidth) {
                    currentItemColSpan = emptyColumns;
                } else {
                    currentItemColSpan = widthColSpan;
                }
            } else if (Ext.isNumber(item.responsiveWidth)) {
                widthColSpan = (Math.round(item.responsiveWidth / columnWidth) || 1);
                itemWidth = widthColSpan * columnWidth;
                if (emptyWidth <= itemWidth) {
                    currentItemColSpan = widthColSpan;
                }
            }
        } else {
            if (Ext.isString(item.responsiveWidth) && item.responsiveWidth.indexOf('%') !== -1) {
                var percent = parseInt(item.responsiveWidth.replace('%', '')) / 100;
                currentItemColSpan = Math.round(percent * emptyColumns);
            } else if (Ext.isEmpty(item.responsiveWidth)) {
                currentItemColSpan = emptyColumns;
            } else {
                currentItemColSpan = (Math.round(item.responsiveWidth / columnWidth) || 1);
                // If the width is greater than the columnWidth * empty columns, add 1 to the result so it will expand beyond the width required, rather than below.
                if (item.responsiveWidth > (columnWidth * emptyColumns)) {
                    currentItemColSpan += 1;
                }
            }
            if (Ext.isNumber(item.responsiveMinWidth)) {
                widthColSpan = (Math.round(item.responsiveMinWidth / columnWidth) || 1);
            } else if (Ext.isNumber(item.minWidth)) {
                widthColSpan = (Math.round(item.minWidth / columnWidth) || 1);
            }
            // Take into account minimum widths of items. Some items may want to span 100% but also have a minumum width.
            currentItemColSpan = widthColSpan > currentItemColSpan ? widthColSpan : currentItemColSpan;
        }
        return currentItemColSpan;
    },

    /**
     * @private
     * Responsive function
     *
     * Stretch any remaining items in a row equally
     */
    stretchItemsForRow: function (items, rowStartIndex, emptyColumns, totalCols, end) {
        var me = this,
            unfixedCount = 0,
            j,
            item,
            groups = me.groups,
            group,
            previousItem,
            previousItemColSpan,
            addToEach = 0,
            difference = 0,
            floor = true,
            extendLast = false,
            extraColSpan;

        if (end - rowStartIndex === 1) {
            item = items[rowStartIndex];
            // Only item in the row. Set its col span to the total columns.
            item.colspan = totalCols;
            group = groups[item.responsiveGroup];
            if (group) {
                group.colspan = totalCols;
            }
        } else {
            // Get the count of items which aren't fixed width.
            for (j = rowStartIndex; j < end; j++) {
                if (!items[j].fixedWidth) {
                    unfixedCount++;
                }
            }
            // Must be at least 1.
            if (unfixedCount > 0) {
                addToEach = emptyColumns / unfixedCount;
                difference = addToEach % 1;
            } else {
                extendLast = true;
            }
            for (j = rowStartIndex; j < end; j++) {
                previousItem = items[j];
                previousItemColSpan = previousItem.colspan;
                if (!previousItem.fixedWidth) {
                    if (addToEach > 0) {
                        if (emptyColumns > 0) {
                            extraColSpan = difference !== 0 ? (floor ? Math.floor(addToEach) : Math.ceil(addToEach)) : addToEach;
                            if (j == end - 1) {
                                // If its the last item, add all columns left.
                                previousItem.colspan = previousItemColSpan + emptyColumns;
                                emptyColumns = 0;
                            } else {
                                previousItem.colspan = previousItemColSpan + extraColSpan;
                                emptyColumns -= extraColSpan;
                            }
                            if (difference !== 0) {
                                floor = !floor;
                            }
                        }
                    }
                } else if (extendLast && j == end - 1) {
                    // If we need to extend the last and we are on the last one, add the extra columns to it.
                    previousItem.colspan = previousItemColSpan + emptyColumns;
                }
            }
        }
    },

    /**
     * @private
     * Responsive function
     * Check if a parent group of a group has finished calculating.
     */
    isParentGroupFinished: function (prop, groupName) {
        var me = this,
            i,
            groups = me.groups,
            groupToCheck = groups[groupName],
            ownItemsLength = groupToCheck.ownItems ? groupToCheck.ownItems.length : 0,
            groupsToCheck = groupToCheck.groups,
            len = groupsToCheck ? groupsToCheck.length : 0;

        // If the parent group has its own items to process, it may not yet be completed.
        if (ownItemsLength) {
            return false;
        }
        // Go through each group to see if all are complete.
        for (i = 0; i < len; i++) {
            if (!groups[groupsToCheck[i]][prop]) {
                return false;
            }
        }
        return true;
    },

    /**
     * @private
     * Responsive function
     *
     * Determine if a group is within a group.
     */
    isPartOfGroup: function (item, otherGroupName) {
        var me = this,
            groups = me.groups,
            currentGroupName = item.responsiveGroup,
            currentGroup = groups[item.responsiveGroup];

        if (currentGroup) {
            return !!(currentGroupName === otherGroupName || Ext.Array.contains(currentGroup.groups, otherGroupName));
        }
        return false;
    },

    /**
     * @private
     * Responsive function
     *
     * Gets a condilated hash/value object with group information.
     */
    getGroups: function (items) {
        var me = this,
            item,
            insertEl,
            defaultTopGroupName = me.defaultTopGroupName,
            parentGroupInsertEl,
            groups = me.groups || {},
            len = items.length,
            containerEl,
            i;

        if (Ext.toolkit === 'modern') {
            var owner = me.getContainer();
            insertEl = owner.bodyElement ? owner.bodyElement : owner;
        } else {
            insertEl = me.getRenderTarget();
        }

        insertEl = insertEl.dom || insertEl;

        // Clear previous group items.
        for (var groupName in groups) {
            groups[groupName].ownItems = [];
            groups[groupName].items = [];
            groups[groupName].groups = [];
        }
        for (i = 0; i < len; i++) {
            item = items[i];
            parentGroupInsertEl = insertEl;
            // Create parent group.
            item.responsiveParentGroup = item.responsiveParentGroup || defaultTopGroupName;
            if (!Ext.isEmpty(item.responsiveParentGroup)) {
                if (!groups[item.responsiveParentGroup]) {
                    if (item.responsiveParentGroup === defaultTopGroupName) {
                        containerEl = insertEl;
                    } else {
                        containerEl = document.createElement('div');
                    }
                    parentGroupInsertEl = containerEl;
                    groups[item.responsiveParentGroup] = {
                        el: containerEl,
                        color: '#' + Math.floor(Math.random() * 16777215).toString(16),
                        items: [],
                        groups: [],
                        ownItems: []
                    };
                } else {
                    parentGroupInsertEl = groups[item.responsiveParentGroup].el;
                }
                // Add item in the parent group.
                groups[item.responsiveParentGroup].items.push(item);
            }
            // Add the group name into the parent group's groups name array.
            if (!Ext.isEmpty(item.responsiveParentGroup) && !Ext.Array.contains(groups[item.responsiveParentGroup].groups, item.responsiveGroup)) {
                groups[item.responsiveParentGroup].groups.push(item.responsiveGroup);
            }
            // Ensure all items have some group.
            item.responsiveGroup = item.responsiveGroup || defaultTopGroupName;
            // Create the current group and add the item.
            if (!Ext.isEmpty(item.responsiveGroup)) {
                if (!groups[item.responsiveGroup]) {
                    if (item.responsiveGroup === defaultTopGroupName) {
                        // If the group in the top level, use the gridCt already being used for the render target.
                        containerEl = insertEl;
                    } else {
                        containerEl = document.createElement('div');
                    }
                    groups[item.responsiveGroup] = {
                        el: containerEl,
                        parentGroup: item.responsiveParentGroup,
                        color: '#' + Math.floor(Math.random() * 16777215).toString(16),
                        items: [],
                        groups: [],
                        ownItems: []
                    };
                }
                groups[item.responsiveGroup].items.push(item);
                groups[item.responsiveGroup].ownItems.push(item);
            }
        }
        return me.groups = groups;
    },

    /**
     * @private
     * Responsive function
     * Get the column span of items within a group.
     */
    getGroupColSpan: function (items, emptyColumns, columnWidth) {
        var me = this;
        if (me.isColumnAndRowSortable(items)) {
            return me.getLargestColumnCount(items);
        } else {
            var item,
                groupColSpan = 0,
                currentItemColSpan,
                len = items.length;
            for (var i = 0; i < len; i++) {
                item = items[i];
                currentItemColSpan = me.getItemColSpan(item, emptyColumns, columnWidth);
                groupColSpan += currentItemColSpan;
            }
            return groupColSpan;
        }
    },

    /**
     * @private
     * Responsive function
     * Find the largest column placement in the items.
     */
    getLargestColumnCount: function (items) {
        var columnCount = 0,
            i,
            col, colspan,
            item,
            len = items.length,
            largestColumnCount = 0;

        for (i = 0; i < len; i++) {
            item = items[i];
            col = (item.responsiveCol || 0) + 1;
            colspan = (item.responsiveColSpan || 1);
            columnCount = (col + (colspan - 1));
            if (columnCount > largestColumnCount) {
                largestColumnCount = columnCount;
            }
        }
        largestColumnCount = largestColumnCount === 0 ? len : largestColumnCount;
        return largestColumnCount;
    },

    /**
     * @private
     * Responsive function.
     * Gets the current columns and columnWidth allowed with the current width of the owning container.
     */
    getColumnsAndColumnWidth: function (items, newWidth, columns, columnWidth) {
        var me = this,
            maxColumns = columns ? columns : undefined,
            largestColumnCount = Math.max(Math.floor(me.getLargestColumnCount(items)), 1);
        if (me.fixedColumnWidth) {
            columnWidth = me.fixedColumnWidth;
        } else if (!Ext.isEmpty(columnWidth) && Ext.isEmpty(columns)) {
            // If the layout is configured, use this information to calculate column count and column width priod to needing to use the items for calculations.
            // If the column width is not empty, but the column count is, get the column count.
            columns = Math.max(Math.floor(newWidth / columnWidth), 1);
        } else if (!Ext.isEmpty(columns) && Ext.isEmpty(columnWidth)) {
            // If the column count is not empty but the column width is, get the column width.
            columnWidth = Math.min(Math.floor(newWidth / columns), newWidth);
        } else if (Ext.isEmpty(columns) && Ext.isEmpty(columnWidth)) {
            columnWidth = me.getColumnWidth(items, newWidth);
            if (Ext.isEmpty(columnWidth)) {
                maxColumns = maxColumns || largestColumnCount;
                var safeColumns = Math.max(Math.floor(newWidth / me.defaultMinColumnWidth), 1);
                var maxColumnWidth = Math.max(Math.floor(newWidth / maxColumns), 1);
                // Get the columnWidth based on the items and their responsiveWidths and responsiveColSpans if available.
                columnWidth = me.getLargestColumnWidth(items);
                columnWidth = columnWidth < maxColumnWidth ? columnWidth : maxColumnWidth;
                columnWidth = me.defaultMinColumnWidth > columnWidth ? me.defaultMinColumnWidth : columnWidth;
                maxColumns = Math.max(Math.floor(newWidth / columnWidth), 1);
                maxColumns = safeColumns < maxColumns ? safeColumns : maxColumns;
            }
            if (!Ext.isEmpty(maxColumns)) {
                columns = maxColumns;
                columnWidth = Math.max(Math.floor(newWidth / columns), 1);
            } else {
                columns = Math.max(Math.floor(newWidth / columnWidth), 1);
            }
        }
        // Enforce the allowed columns max.
        var allowedColumns = Math.max(Math.floor(newWidth / columnWidth), 1);
        return {
            columns: allowedColumns < columns ? allowedColumns : columns,
            columnWidth: columnWidth
        }
    }
});
