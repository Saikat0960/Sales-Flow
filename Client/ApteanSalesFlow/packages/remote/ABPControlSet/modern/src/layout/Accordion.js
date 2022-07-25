/**
 * Modern accordion layout.
 *
 * This layout allows collapsible panels in a container to behave like an accordion.
 */
Ext.define('ABPControlSet.layout.Accordion', {
    extend: 'Ext.layout.VBox',
    alias: 'layout.abpaccordion',
    type: 'abpaccordion',

    targetCls: Ext.baseCSSPrefix + 'accordion-layout-ct',
    itemCls: [Ext.baseCSSPrefix + 'box-item', Ext.baseCSSPrefix + 'accordion-item'],

    align: 'stretch',

    enableSplitters: false,

    /**
     * @cfg {Boolean} fill
     * True to adjust the active item's height to fill the available space in the container, false to use the
     * item's current height, or auto height if not explicitly set.
     */
    fill: true,

    /**
     * @cfg {Boolean} autoWidth
     * Child Panels have their width actively managed to fit within the accordion's width.
     * @removed This config is ignored in ExtJS 4
     */

    /**
     * @cfg {Boolean} titleCollapse
     * True to allow expand/collapse of each contained panel by clicking anywhere on the title bar, false to allow
     * expand/collapse only when the toggle tool button is clicked.  When set to false,
     * {@link #hideCollapseTool} should be false also. An explicit {@link Ext.panel.Panel#titleCollapse} declared
     * on the panel will override this setting.
     */
    titleCollapse: true,

    /**
     * @cfg {Boolean} hideCollapseTool
     * True to hide the contained Panels' collapse/expand toggle buttons, false to display them.
     * When set to true, {@link #titleCollapse} is automatically set to true.
     */
    hideCollapseTool: false,

    /**
     * @cfg {Boolean} collapseFirst
     * True to make sure the collapse/expand toggle button always renders first (to the left of) any other tools
     * in the contained Panels' title bars, false to render it last. By default, this will use the
     * {@link Ext.panel.Panel#collapseFirst} setting on the panel. If the config option is specified on the layout,
     * it will override the panel value.
     */
    collapseFirst: undefined,

    /**
     * @cfg {Boolean} activeOnTop
     * Only valid when {@link #multi} is `false`
     *
     * True to swap the position of each panel as it is expanded so that it becomes the first item in the container,
     * false to keep the panels in the rendered order.
     */
    activeOnTop: false,

    /**
     * @cfg {Boolean} multi
     * Set to true to enable multiple accordion items to be open at once.
     */
    multi: false,

    /**
     * @cfg {Boolean} [wrapOver=true] When `true`, pressing Down or Right arrow key on the
     * focused last accordion panel header will navigate to the first panel; pressing Up
     * or Left arrow key on the focused first accordion panel header will navigate to the
     * last panel.
     * Set this to `false` to prevent keyboard navigation from wrapping over the edges.
     */
    wrapOver: true,

    panelCollapseMode: 'header',

    defaultAnimatePolicy: {
        y: true,
        height: true
    },

    // The component owning this layout.
    owner: null,

    onContainerInitialized: function () {
        this.callParent(arguments);
        var container = this.getContainer();
        this.owner = container;

        // Accordion widgets have the role of tablist along with the attribute
        // aria-multiselectable="true" to indicate that it's an accordion
        // and not just a simple tab panel.
        // We can't set this role on the panel's main el as this panel may be
        // a region in a border layout which yields its own set of ARIA attributes.
        // We also can't set this role on panel's body el, because the panel could be
        // a FormPanel that would have role="form" on the body el, and the tablist
        // needs to be contained within it.
        // containers innerElement or fall back to bodyElement seems to be the most logical choice here.
        var el = container.innerElement || container.bodyElement || container.el;
        if (el) {
            el.dom.setAttribute('role', 'tablist');
            el.dom.setAttribute('aria-multiselectable', true);
        }
    },

    onItemAdd: function (item) {
        var me = this;

        item.getCollapsible = item.getCollapsible || function () { return false; };
        item.getCollapsed = item.getCollapsed || function () { return false; };

        if (item.rendered) {
            me.beforeRenderItem(item);
        } else {
            item.on("painted", me.beforeRenderItem, me)
        }


        if (item.collapseMode === 'placeholder') {
            item.collapseMode = me.panelCollapseMode;
        }

        item.collapseDirection = item.headerPosition;

        me.callParent(arguments);
    },

    onItemRemove: function (panel, destroying) {
        var me = this,
            item;

        me.callParent(arguments);

        if (!me.owner.destroying && !me.multi && !panel.getCollapsed()) {
            item = me.owner.items.first();
            if (item) {
                item.expand();
            }
        }
    },

    getExpanded: function () {
        var items = this.owner.items.items,
            len = items.length,
            i = 0,
            out = [],
            add,
            item;

        for (; i < len; ++i) {
            item = items[i];

            if (!item.hidden) {
                add = item.getCollapsed ? !item.getCollapsed() : true;
                if (add) {
                    out.push(item);
                }
            }
        }
        return out;
    },

    // No need to run an extra layout since everything has already achieved the
    // desired size when using an accordion.
    afterCollapse: Ext.emptyFn,

    afterExpand: Ext.emptyFn,

    beforeRenderItem: function (comp) {
        var me = this,
            owner = me.owner,
            collapseFirst = me.collapseFirst,
            hasCollapseFirst = Ext.isDefined(collapseFirst),
            expandedItem = me.getExpanded()[0],
            multi = me.multi,
            comp;

        comp.toggleCls(Ext.baseCSSPrefix + 'accordion-item', true);

        if (comp.header) {
            comp.header.toggleCls(Ext.baseCSSPrefix + 'accordion-hd', true);
        }

        // Set up initial properties for Panels in an accordion.
        comp.isAccordionPanel = true;
        comp.bodyAriaRole = 'tabpanel';
        comp.accordionWrapOver = me.wrapOver;

        if (!multi || comp.getCollapsible() == undefined) {
            comp.setCollapsible({
                useDrawer: !me.titleCollapse
            });
        }

        if (comp.getCollapsible()) {
            if (hasCollapseFirst) {
                comp.collapseFirst = collapseFirst;
            }
            if (me.hideCollapseTool) {
                comp.hideCollapseTool = me.hideCollapseTool;
                // Configure the item's collapsible object for the correct titleCollapse setting..
                me.configureTitleCollapse(comp, true);
            } else if (me.titleCollapse && comp.titleCollapse === undefined) {
                // Only force titleCollapse if we don't explicitly
                // set one on the child panel
                // Configure the item's collapsible object for the correct titleCollapse setting..
                me.configureTitleCollapse(comp, me.titleCollapse);
            }
        }

        comp.hideHeader = comp.width = null;
        comp.title = comp.title || '&#160;';
        if (comp.addBodyCls) {
            comp.addBodyCls(Ext.baseCSSPrefix + 'accordion-body');
        }

        // If only one child Panel is allowed to be expanded
        // then collapse all except the first one found with collapsed:false
        // If we have hasExpanded set, we've already done this
        if (!multi) {
            if (expandedItem) {
                comp.setCollapsed(expandedItem !== comp);
            } else if (comp.getCollapsed() === false) {
                expandedItem = comp;
            } else {
                comp.setCollapsed(true);
            }

            // If only one child Panel may be expanded, then intercept expand/show requests.
            owner.mon(comp, 'beforecollapse', me.onBeforeComponentCollapse, me);
            owner.mon(comp, 'beforeexpand', me.onBeforeComponentExpand, me);
        }
        owner.mon(comp, 'collapse', me.updatePanelClasses, me);
        owner.mon(comp, 'expand', me.updatePanelClasses, me);
        // Need to still check this outside multi because we don't want
        // a single item to be able to collapse
        comp.headerOverCls = Ext.baseCSSPrefix + 'accordion-hd-over';


        // If no collapsed:false Panels found, make the first one expanded, only if we're
        // not during an expand/collapse
        if (!me.processing && !multi) {
            if (!expandedItem) {
                comp.setCollapsed(false);
            } else if (me.activeOnTop) {
                me.configureItem(expandedItem);
                expandedItem.setCollapsed(false);
                if (owner.items.indexOf(expandedItem) > 0) {
                    owner.insert(0, expandedItem);
                }
            }
        }
    },

    configureTitleCollapse: function (comp, titleCollapse) {
        var collapsible = comp.getCollapsible();
        if (Ext.isObject(collapsible)) {
            var header = collapsible.getTarget().getHeader();
            if (header) {
                if (titleCollapse) {
                    collapsible.setUseDrawer(false);
                    collapsible.setAnimation(false);
                }
                if (header.element && titleCollapse) {
                    // Remove any previous.
                    header.element.un({
                        destroyable: true,
                        scope: comp,
                        tap: this.onTitleTap
                    });
                    header.element.on({
                        destroyable: true,
                        scope: comp,
                        tap: this.onTitleTap
                    });
                }
            }
        }
    },

    // Toggle the collapsed state.
    onTitleTap: function () {
        this.setCollapsed(!this.getCollapsed());
    },

    configureItem: function (item) {
        // Accordion headers are immune to dock layout's border-management rules
        item.ignoreHeaderBorderManagement = true;

        // We handle animations for the expand/collapse of items.
        // Items do not have individual borders
        item.animCollapse = false;

        // If filling available space, all Panels flex.
        if (this.fill) {
            item.flex = 1;
        }
    },

    getVisibleItems: function () {
        var owner = this.owner,
            items = owner ? owner.items.items : [],
            item,
            len = items.length,
            i = 0,
            visible = [];

        for (var i = 0; i < len; i++) {
            item = items[i];
            if ((!item.rendered && item.hidden !== true) || (item.rendered && item.isVisible())) {
                visible.push(item);
            }
        }
        return visible;
    },

    updatePanelClasses: function () {
        var children = this.getVisibleItems(),
            ln = children.length,
            siblingCollapsed = true,
            i, child, header;

        for (i = 0; i < ln; i++) {
            child = children[i];
            header = child.getHeader ? child.getHeader() : null;
            if (header) {
                header.toggleCls(Ext.baseCSSPrefix + 'accordion-hd', true);
                header.toggleCls(Ext.baseCSSPrefix + 'accordion-hd-sibling-expanded', !siblingCollapsed);
                header.toggleCls(Ext.baseCSSPrefix + 'accordion-hd-last-collapsed', i + 1 === ln && child.getCollapsed());
            }
            siblingCollapsed = child.getCollapsed();
        }
    },

    // When a Component expands, adjust the heights of the other Components to be just enough to accommodate
    // their headers.
    // The expanded Component receives the only flex value, and so gets all remaining space.
    onBeforeComponentExpand: function (toExpand) {
        var me = this,
            owner = me.owner,
            multi = me.multi,
            moveToTop = !multi && !me.animate && me.activeOnTop,
            expanded;

        if (!me.processing) {
            me.processing = true;

            if (!multi) {
                expanded = me.getExpanded()[0];
                if (expanded && expanded !== toExpand) {
                    expanded.collapse();
                }
            }

            if (moveToTop) {
                // Prevent extra layout when moving the item
                Ext.suspendLayouts();
                owner.insert(0, toExpand);
                Ext.resumeLayouts();
            }

            me.processing = false;
        }
    },

    onBeforeComponentCollapse: function (comp) {
        var me = this,
            owner = me.owner,
            toExpand,
            expanded;

        if (me.owner.items.getCount() === 1) {
            // do not allow collapse if there is only one item
            return false;
        }

        if (!me.processing) {
            me.processing = true;
            toExpand = comp.next() || comp.prev();

            if (me.multi) {
                expanded = me.getExpanded();

                // If the collapsing Panel is the only expanded one, expand the following Component.
                // All this is handling fill: true, so there must be at least one expanded,
                if (expanded.length === 1) {
                    toExpand.expand();
                }

            } else if (toExpand) {
                toExpand.expand();
            }
            me.processing = false;
        }
    }
});
