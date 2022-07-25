/**
 * Favorite Manager - Favorite tree can be manipulated and saved from here.
 */
Ext.define('ABP.view.session.favorites.FavoritesManager', {
    extend: 'ABP.view.components.panel.HeaderPanelBase',
    alias: 'widget.favoritesManager',
    requires: [
        'Ext.tree.Panel',
        'Ext.tree.Column',
        'Ext.data.TreeStore',
        'Ext.grid.plugin.CellEditing',
        'Ext.tree.plugin.TreeViewDragDrop',
        'ABP.view.session.favorites.FavoritesManagerController',
        'ABP.view.session.favorites.FavoritesManagerModel'
    ],
    viewModel: {
        type: 'favoritesmanagermodel'
    },
    controller: 'favoritesManager',
    scrollable: 'vertical',
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    bind: {
        title: '{i18n.favorites_title:htmlEncode}'
    },
    header: {
        automationCls: 'favorites-manager-header'
    },
    closable: true,
    items: [{
        xtype: 'treepanel',
        rootVisible: false,
        itemId: 'favoritestree',
        useArrows: true,
        ui: 'abpgridpanel',
        plugins: {
            cellediting: {
                clicksToEdit: 2,
                listeners: {
                    beforeedit: function (editor, context, options) {
                        var allowEdit = true;
                        if (!context.record.isLeaf()) {
                            // Group - always allow edit.
                            return allowEdit;
                        }
                        var sessionConfig = ABP.util.Config.getSessionConfig();
                        if (sessionConfig.settings.favorites && sessionConfig.settings.favorites.allowItemRename === false) {
                            allowEdit = false;
                        }
                        return allowEdit;
                    }
                }
            }
        },
        viewConfig: {
            listeners: {
                nodedragover: function (targetNode, position, data, e, options) {
                    var dragNode = !Ext.isEmpty(data.records) ? data.records[0] : undefined;
                    var depthLimit = ABP.util.Common.getViewModelProperty('conf.settings.favorites.depthLimit');
                    if (depthLimit === 0) {
                        return true;
                    }
                    if (targetNode.getDepth() >= depthLimit) {
                        if (targetNode.getDepth() === depthLimit) {
                            // Only exception if a leaf to a leaf.
                            if (targetNode.isLeaf() && dragNode.isLeaf()) {
                                return true;
                            }
                        }
                        else {
                            return false;
                        }
                    }
                    if (!dragNode) {
                        // Should not happen. But just to be safe - dropping some malformed value seems risky.
                        return false;
                    }
                    // Case of moving a group. Folders cannot exist within folders unless depthLimit is equal to 0.
                    if (!dragNode.isLeaf()) {
                        if (!targetNode.isLeaf() || !targetNode.parentNode.isRoot()) {
                            return false;
                        }
                    }
                    return true;
                }
            },
            plugins: {
                treeviewdragdrop: {
                    containerScroll: true
                }
            }
        },
        listeners: {
            edit: function (plugin, context) {
                // Refresh the view to force child nodes to update text immediately.
                if (context.view) {
                    context.view.refresh();
                }
            }
        },
        columns: [{
            xtype: 'treecolumn',
            text: null,
            flex: 0.5,
            dataIndex: 'text',
            editor: {
                xtype: 'textfield',
                allowBlank: false
            },
        }, {
            // Edit/Remove column
            xtype: 'actioncolumn',
            flex: 0.5,
            listeners: {
                afterrender: function () {
                    // Direct binding does not seem to work here.
                    if (ABP.util.Common.getViewModelProperty('conf.settings.favorites.depthLimit') === 1
                        && ABP.util.Common.getViewModelProperty('conf.settings.favorites.allowItemRename') === false) {
                        this.items[0].hidden = true;
                    }
                }
            },
            items: [{
                // Leave this icon in position 0 or edit above code to search for an itemId.
                width: 30,
                iconCls: 'icon-pencil',
                handler: 'editItemClicked'
            }, {
                xtype: 'actioncolumn',
                width: 30,
                iconCls: 'icon-navigate-cross',
                handler: 'removeItemClicked'
            }]
        }]
    }],

    tbar: {
        reference: 'tbar',
        cls: 'favorites-tbar',
        defaults: {
            border: false
        },
        bind: {
            height: '{toolbarHeight}'
        },
        items: [
            // TODO: replace onCancelClick with func to cancel favorites changes
            // instead of closing favorites manager
            //   {
            //     bind: {
            //         text: '{i18n.button_cancel:htmlEncode}'
            //     },
            //     cls: 'a-favorites-toolbar-cancel',
            //     width: 100,
            //     handler: 'onCancelClick'
            // },
            {
                bind: {
                    text: '{i18n.button_save:htmlEncode}'
                },
                cls: 'a-favorites-toolbar-save',
                width: 100,
                handler: 'onSaveClick'
            }, {
                bind: {
                    text: '{i18n.favorites_expandAll:htmlEncode}',
                    hidden: '{conf.settings.favorites.depthLimit === 1}'
                },
                cls: 'a-favorites-toolbar-expandall',
                width: 100,
                handler: 'onExpandAllClick'
            }, {
                bind: {
                    text: '{i18n.favorites_collapseAll:htmlEncode}',
                    hidden: '{conf.settings.favorites.depthLimit === 1}'
                },
                cls: 'a-favorites-toolbar-collapseall',
                width: 100,
                handler: 'onCollapseAllClick'
            }, {
                xtype: 'textfield',
                height: 32,
                bind: {
                    emptyText: '{i18n.favorites_newGroup_emptyText}',
                    value: '{favoriteTitle}',
                    hidden: '{conf.settings.favorites.depthLimit === 1}'
                },
                cls: 'a-favorites-toolbar-newgrouptext',
                itemId: 'newgrouptext',
                keyMap: {
                    'ENTER': {
                        handler: 'addNewGroup'
                    }
                },
                listeners: {
                    change: 'onChange'
                },
                width: 200
            }, {
                bind: {
                    disabled: '{favoriteTitle.length === 0}',
                    hidden: '{conf.settings.favorites.depthLimit === 1}'
                },
                cls: 'favorites-addgroup a-favorites-toolbar-newgroup',
                handler: 'addNewGroup',
                border: true,
                iconCls: 'icon-plus'
            }]
    }
});
