/**
 * @private
 * Base context menu plugin.
 */
Ext.define("ABPControlSet.base.view.contextmenu.plugin.ContextMenu", {
    extend: "Ext.plugin.Abstract",

    id: "abpcontextmenu",

    alias: 'plugin.abpcontextmenu',

    cachedConfig: {
        contextMenu: 1 // Set to a value to force the apply method to execute.
    },

    applyContextMenu: function (contextMenu) {
        contextMenu = Ext.widget({
            padding: 0,
            relative: true,
            xtype: "menu",
            floating: true,
            header: false,
            layout: "fit",
            items: [
                {
                    xtype: "abpcontextmenu",
                    listeners: {
                        itemclick: this.onItemClick,
                        scope: this
                    },
                    store: {
                        type: "tree",
                        rootVisible: true,
                        root: {}
                    }
                }
            ]
        });
        return contextMenu;
    },

    constructor: function (config) {
        config = config || {};
        this.callParent([config]);
    },

    onItemClick: function (tree, itemData) {
        var currentCmp = tree.getCurrentCmp ? tree.getCurrentCmp() : null;
        var item = itemData.node;
        var currentContext = tree.getCurrentContext();
        if (currentCmp) {
            var contextMenu = this.getContextMenu();
            currentCmp.fireEvent(ABPControlSet.common.types.Events.ContextMenuItemClick, currentCmp, currentContext, item, item.get("checkbox") ? !!item.get("checked") : null);
            var handler = item.get("handler");
            if (Ext.isFunction(handler)) {
                handler(currentCmp, currentContext, item, item.get("checkbox") ? !!item.get("checked") : null);
            }
            if (!item.get("checkbox") && item.get("leaf")) {
                contextMenu.hide();
            }
        }
    },

    init: function (parent) {
        if (Ext.toolkit === "classic") {
            var element = parent.element ? parent.element : parent.el;
            if (element) {
                element.on({
                    contextmenu: {
                        fn: this.onContextMenu,
                        scope: this
                    }
                });
            } else {
                parent.on({
                    el: {
                        contextmenu: {
                            fn: this.onContextMenu,
                            scope: this
                        }
                    }
                });
            }
        } else {
            parent.on({
                contextmenu: {
                    element: 'element',
                    preventDefault: true,
                    fn: this.onContextMenu,
                    scope: this
                }
            });
        }
    },

    onContextMenu: function (event, el) {
        var contextMenu = this.getContextMenu(),
            contextList = contextMenu ? contextMenu.down("abpcontextmenu") : null;
        if (contextList) {
            var store = contextList.getStore(),
                root = store.getRoot();
            if (root) {
                root.removeAll();
                var cmp = this.cmp;
                if (cmp && cmp.fireEvent) {
                    var context = cmp.getContextMenuData ? cmp.getContextMenuData(event, el) : {};
                    contextList.setCurrentCmp(cmp);
                    contextList.setCurrentContext(context);
                    if (cmp.fireEvent(ABPControlSet.common.types.Events.ContextMenu, root, this.cmp, context, el, event) !== false) {
                        if (root && root.childNodes && root.childNodes.length > 0) {
                            if (event && event.stopEvent) {
                                event.stopEvent();
                            }
                            if (Ext.toolkit === 'modern') {
                                contextMenu.showBy(cmp, 't-b');
                            } else {
                                contextMenu.showAt(event.pageX, event.pageY);
                            }
                        }
                    }
                }
            }
        }
    }
});