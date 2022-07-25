/**
 * @inheritdoc ABPControlSet.common.CSSGrid
 */
Ext.define("ABPControlSet.layout.CSSGrid", {
    // Ext JS Container Layout Configuration
    extend: "Ext.layout.container.Container",
    /** @ignore */
    requires: [
        "ABPControlSet.common.CSSGrid"
    ],
    /** @ignore */
    mixins: ["ABPControlSet.common.CSSGrid"],
    /** @ignore */
    alias: "layout.cssgrid",
    /** @ignore */
    type: "cssgrid",
    /** @ignore */
    setsItemSize: false,
    /** 
     * @ignore 
     * Defaults to true - keep true - the child items need to be layed out to where its width can be read so its layouts are properly completely.
    */
    needsItemSize: true, 
    /** @ignore */
    autoSizePolicy: {
        readsWidth: 1,
        readsHeight: 0,
        setsWidth: 0,
        setsHeight: 0
    },
    /** @ignore */
    usesContainerHeight: false,
    /** @ignore */
    usesContainerWidth: true,
    /** @ignore */
    usesHeight: false,
    /** @ignore */
    usesWidth: true,

    /** @ignore */
    childEls: [
        'gridCt'
    ],

    /** @ignore */
    renderTpl: [
        '<div id="{ownerId}-gridCt" data-ref="gridCt" role="presentation">',
        '{%this.renderBody(out,values)%}',
        '</div>'
    ],

    /** @private
     * Runs the layout.
     */
    doLayout: function () {
        var me = this,
            owner = me.owner;

        if (owner && owner.updateLayout) {
            owner.updateLayout();
        }
    },

    /** @private */
    getInsertPosition: function (el, position) {
        el = el.dom ? el.dom : el;
        var childNodes = el.childNodes;
        // Convert the position to an element to insert before
        if (position !== undefined) {
            if (Ext.isNumber(position) && childNodes) {
                position = childNodes[position];
            }
        }
        return position;
    },

    // The item count during the last run of the layout.
    visibleItemCount: null,
    /*
    * Extended methods.
    */
    /** @private */
    calculate: function (ownerContext) {
        var me = this;
        if (me.responsive) {
            var items = ownerContext ? ownerContext.visibleItems || me.getLayoutItems() : [];
            me.runCalculations(items, me.visibleItemCount !== items.length);
            me.visibleItemCount = items.length;
            if (!ownerContext.hasDomProp('containerChildrenSizeDone')) {
                me.done = false;
            } else {
                var targetContext = ownerContext.targetContext,
                    widthShrinkWrap = ownerContext.widthModel.shrinkWrap,
                    heightShrinkWrap = ownerContext.heightModel.shrinkWrap,
                    shrinkWrap = heightShrinkWrap || widthShrinkWrap,
                    table = shrinkWrap && targetContext.el.dom,
                    targetPadding = shrinkWrap && targetContext.getPaddingInfo();

                if (widthShrinkWrap) {
                    ownerContext.setContentWidth(table.offsetWidth + targetPadding.width, true);
                }

                if (heightShrinkWrap) {
                    ownerContext.setContentHeight(table.offsetHeight + targetPadding.height, true);
                }
            }
        } else {
            var me = this,
                props = ownerContext.props,
                el = me.getRenderTarget();

            if (ownerContext.hasDomProp('containerChildrenSizeDone')) {
                if (ownerContext.widthModel.shrinkWrap && isNaN(props.width)) {
                    ownerContext.setContentWidth(el.getWidth(), true);
                }
                if (ownerContext.heightModel.shrinkWrap && isNaN(props.height)) {
                    ownerContext.setContentHeight(el.getHeight(), true);
                }
                return;
            }
            me.done = false;
        }
    },

    /*
    * Extended methods.
    */
    beginLayoutCycle: function (ownerContext) {
        var me = this;
        me.callParent(arguments);
        if (!me.responsive) {
            me.runCalculations(ownerContext ? ownerContext.visibleItems || me.getLayoutItems() : []);
        }
    },

    /** @private
     * Iterates over all passed items, ensuring they are rendered.  If the items are already rendered,
     * also determines if the items are in the proper place in the dom.
     *
     * This method also ensures that wrapper elements for groups are rendered and positioned correctly.
     * As well as making sure child items of groups are rendered within the appropriate wrapper element.
     */
    renderItems: function (items, target) {
        var me = this,
            ln = items.length;
        if (me.responsive && ln > 1) {
            var i = 0,
                nextSibling,
                group,
                parentGroup,
                groups = me.getGroups(items),
                groupLength = 0,
                pos = 0,
                item;

            for (var groupName in groups) {
                groupLength++;
                groups[groupName].appended = false;
            }
            if (groupLength > 1) {
                for (; i < ln; i++ , pos++) {
                    item = items[i];
                    // Need to ensure the element wrapping the group is rendered in the correct position in its parent element so the tab order remains intact.
                    group = groups[item.responsiveGroup];
                    parentGroup = groups[group.parentGroup];
                    if (group && !group.appended && parentGroup && parentGroup.el) {
                        nextSibling = me.getInsertPosition(parentGroup.el, pos);
                        if (nextSibling) {
                            parentGroup.el.insertBefore(group.el, nextSibling);
                        } else {
                            parentGroup.el.appendChild(group.el);
                        }
                        group.appended = true;
                    }
                    if (item && !item.rendered) {
                        me.renderItem(item, group ? group.el : target, pos);
                    } else if (item.ignoreDomPosition) {
                        --pos;
                    } else if (!me.isValidParent(item, group ? group.el : target, pos)) {
                        me.moveItem(item, group ? group.el : target, pos);
                    } else {
                        // still need to configure the item, it may have moved in the container.
                        me.configureItem(item);
                    }
                }
            } else {
                me.callParent(arguments);
            }
        } else {
            me.callParent(arguments);
        }
    },
    // Override the default getLayout items to not use the array directly within the items collection.
    // Sort by column and row.
    /** @private */
    getLayoutItems: function () {
        var me = this,
            result = [],
            items = me.callParent(),
            len = items.length,
            item, i;

        for (i = 0; i < len; i++) {
            item = items[i];
            // Only include items which are meant to be in the layout and dom. If the item is hidden and hideMode is set to display, this means the item will not be in in the dom.
            if (!item.hidden || item.hideMode !== 'display' || !me.responsive) {
                result.push(item);
            }
        }

        return me.determineItemsWithColumnRowSorting(result);
    },

    /** @private */
    getRenderTarget: function () {
        return this.gridCt;
    }
});