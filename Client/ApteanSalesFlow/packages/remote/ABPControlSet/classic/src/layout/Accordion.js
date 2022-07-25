/**
 * Classic accordion layout wrapper.
 *
 * Simple wrapper for the classic accordion layout. Allows collapsible panels in a container to behave like an accordion.
 *
 *     Ext.create('Ext.panel.Panel', {
 *         layout: {
 *             // layout-specific configs go here
 *             type: 'abpaccordion',
 *             titleCollapse: false,
 *             animate: true,
 *             activeOnTop: true
 *         }
 *     });
 */
Ext.define('ABPControlSet.layout.Accordion', {
    extend: 'Ext.layout.container.Accordion',

    alias: 'layout.abpaccordion',
    type: 'abpaccordion',

    /**
     * @cfg {Boolean} fill
     * True to adjust the active item's height to fill the available space in the container, false to use the
     * item's current height, or auto height if not explicitly set.
     */
    fill: true,

    // Default titleCollapse to true.
    titleCollapse: true,

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
     * @cfg {Boolean} animate
     * True to slide the contained panels open and closed during expand/collapse using animation, false to open and
     * close directly with no animation. Note: The layout performs animated collapsing
     * and expanding, *not* the child Panels.
     */
    animate: true,

    /**
     * @cfg {Boolean} activeOnTop
     * Only valid when {@link #multi} is `false` and {@link #animate} is `false`.
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

    // Allow all items as a sibling of a collapsible accordion panel - ensure addBodyCls is at minimum an empty function.
    beforeRenderItems: function (items) {
        var header,
            ln = items.length,
            comp;

        for (var i = 0; i < ln; i++) {
            comp = items[i];
            if (!Ext.isFunction(comp.addBodyCls)) {
                comp.addBodyCls = Ext.emptyFn;
            }
        }
        this.callParent(arguments);
        // After the parent is called, all components titleCollapse prop will be set.
        for (var i = 0; i < ln; i++) {
            comp = items[i];
            header = comp.getHeader ? comp.getHeader() : null;
            if (comp.titleCollapse && header && header.toggleCls) {
                header.toggleCls('abp-accordion-title-collapse', true);
            }
        }
    },

    updatePanelClasses: function (ownerContext) {
        var children = ownerContext.visibleItems,
            ln = children.length,
            siblingCollapsed = true,
            i, child, header;

        for (i = 0; i < ln; i++) {
            child = children[i];
            header = child.header;
            if (header) {
                header.addCls(Ext.baseCSSPrefix + 'accordion-hd');

                if (siblingCollapsed) {
                    header.removeCls(Ext.baseCSSPrefix + 'accordion-hd-sibling-expanded');
                } else {
                    header.addCls(Ext.baseCSSPrefix + 'accordion-hd-sibling-expanded');
                }
                if (i + 1 === ln && child.collapsed) {
                    header.addCls(Ext.baseCSSPrefix + 'accordion-hd-last-collapsed');
                } else {
                    header.removeCls(Ext.baseCSSPrefix + 'accordion-hd-last-collapsed');
                }
                siblingCollapsed = child.collapsed;
            }
        }
    }
});