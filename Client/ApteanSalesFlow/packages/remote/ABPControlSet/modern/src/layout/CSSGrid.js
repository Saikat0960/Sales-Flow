/**
 * @inheritdoc ABPControlSet.common.CSSGrid
 */
Ext.define("ABPControlSet.layout.CSSGrid", {
    // Ext JS Table Layout Configuration
    extend: "Ext.layout.Auto",
    alias: "layout.cssgrid",
    type: "cssgrid",
    /** @ignore */
    requires: [
        "ABPControlSet.common.CSSGrid"
    ],
    /** @ignore */
    mixins: ["ABPControlSet.common.CSSGrid"],

    /** @ignore */
    constructor: function (config) {
        config = config || {};
        var container = config.container;
        if (container) {
            var items = container && container.items;
            if (items) {
                items.setSorters({
                    // Sort by column and row.
                    sorterFn: this.columnAndRowSort
                });
                items.sort();
            }
        }
        this.callParent(arguments);
    },

    /** @private
     * Runs the layout.
     */
    doLayout: function (force) {
        var me = this,
            items = me.getLayoutItems();
        me.runCalculations(items, force);
    },

    /** @ignore */
    onAfterItemDockedChange: function () {
        this.callParent(arguments);
        this.doLayout(true);
    },
    /** @ignore */
    onItemPositionedChange: function () {
        this.callParent(arguments);
        this.doLayout(true);
    },
    /** @ignore */
    onItemCenteredChange: function () {
        this.callParent(arguments);
        this.doLayout(true);
    },
    onItemHiddenChange: function () {
        this.doLayout(true);
    },
    /** @ignore */
    onContainerInitialized: function () {
        var me = this,
            owner = me.getContainer();

        owner.mon(Ext.Viewport, "orientationchange", function () {
            this.doLayout();
        }, me);

        // Listen for the painted event to kick off the initial calculation.
        // Also register the resize event on the element and run calculations when the width changes.
        owner.on({
            single: true,
            painted: function () {
                this.doLayout(); // First run to make sure the layout is correct.
                /** Note resize event listeners impact performance. Remove and only use orientation change registered above as a means of re-calculating this layout. **/
                if (this.responsive === true) {
                    owner.mon(Ext.Viewport, "resize", function (element, width, height, oldWidth, oldHeight) {
                        if (width !== oldWidth) {
                            var items = this.getLayoutItems();
                            this.runCalculations(items);
                        }
                    }, this);
                }
            },
            scope: me
        });
        // Listen for the child components becoming hidden or visible. 
        // If a child becomes invisible then a layout ensures the blank space is collapsed.
        // Similarly if a child becomes visible then its order in the grid needs to be calculated with respect to its peers.  
        owner.on({
            delegate: '> component',
            hiddenchange: 'onItemHiddenChange',
            scope: me
        });
        me.callParent(arguments);
    },
    /*
    * Extended methods.
    */
    /** @ignore */
    getLayoutItems: function () {
        var me = this,
            owner = me.getContainer(),
            items = owner && owner.items,
            hideMode,
            visible = [];

        items = (items && items.getRange()) || [];
        var length = items.length,
            item;
        for (var i = 0; i < length; i++) {
            item = items[i];
            hideMode = item.getHideMode ? item.getHideMode() : null;
            if (item.isVisible() || (hideMode && hideMode !== 'display') || !me.responsive) {
                visible.push(item);
            }
        }

        // Re-order the items by column precedence if the layout is set to do so.
        return me.determineItemsWithColumnRowSorting(visible);
    },

    /**
     * @ignore
     * @private
     * Returns the inner element for which the css templating is set.
     */
    getRenderTarget: function () {
        var owner = this.getContainer();
        var rt = owner.bodyElement ? owner.bodyElement : owner;
        return rt;
    }
});
