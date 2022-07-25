/**
 * Favorite Manager - Favorite tree can be manipulated and saved from here.
 */
Ext.define('ABP.view.session.favorites.FavoritesManager', {
    extend: 'ABP.view.components.panel.HeaderPanelBase',
    controller: 'favoritesManager',
    alias: 'widget.favoritesManager',
    requires: [
        'Ext.data.TreeStore',
        'Ext.dataview.NestedList',
        'Ext.dataview.listswiper.ListSwiper',
        'ABP.view.session.favorites.FavoritesManagerController',
        'ABP.view.session.favorites.FavoritesManagerModel',
        'ABP.view.session.favorites.plugins.NestedListSwiper'
    ],
    cls: 'favoritesmanager',
    viewModel: {
        type: 'favoritesmanagermodel'
    },
    bind: {
        title: '{i18n.favorites_title:htmlEncode}'
    },
    height: '100%',
    width: '100%',
    closable: true,
    showBack: true,
    backHandler: 'onBackClick',
    tools: [{
        iconCls: 'icon-save',
        handler: 'onSaveClick'
    }],
    tbar: [{
        xtype: 'textfield',
        padding: 5,
        flex: 1,
        itemId: 'newgrouptext',
        bind: {
            placeholder: '{i18n.favorites_newGroup_emptyText}',
            value: '{favoriteTitle}'
        }
    }, {
        xtype: 'button',
        height: 32,
        bind: {
            text: '{i18n.favorites_newGroup}',
            disabled: '{favoriteTitle.length === 0}'
        },
        handler: 'addNewGroup'
    }],

    items: [{
        xtype: 'nestedlist',
        toolbar: false,
        height: '100%',
        width: '100%',
        itemId: 'favoritestree', // Strictly this is a nestedlist and not a tree, but the same itemId is used for Modern as Classic so there is more shared code.
        bind: {
            emptyText: '{i18n.favorites_manager_emptyGroup:htmlEncode}'
        },
        displayField: 'text',
        listConfig: {
            itemTpl: [
                '<div class="favorite-list-item">',
                '<div class="favorite-list-icon {iconCls}"></div>',
                '<div class="favorite-list-text">{text}</div>',
                '</div>'
            ]
        },
        itemConfig: {
            ripple: true
        },
        plugins: {
            nestedlistswiper: {
                commitDelay: 1500,
                dismissOnTap: true,
                right: [{
                    iconCls: 'icon-pencil',
                    cls: 'favoriteseditbutton',
                    commit: 'editItemClicked',
                    width: 100
                }, {
                    iconCls: 'icon-navigate-cross',
                    commit: 'removeItemClicked',
                    width: 100,
                    undoable: true
                }]
            }
        },
        listeners: {
            itemtap: 'onListitemTapped',
            back: 'onNavigateBack'
        }
    }],

    listeners: {
        painted: function () {
            // Cannot navigate back initially.
            this.hideBackButton();
            var depthLimit = ABP.util.Common.getViewModelProperty('conf.settings.favorites.depthLimit') || 0;
            var allowItemRename = Ext.isBoolean(ABP.util.Common.getViewModelProperty('conf.settings.favorites.allowItemRename')) ?
                ABP.util.Common.getViewModelProperty('conf.settings.favorites.allowItemRename') : true;

            // Folders are not allowed, go ahead and hide the whole tbar.
            if (depthLimit === 1) {
                this.getTbar().hide();
                if (!allowItemRename) {
                    // No folders are allowed and no renaming. Set right actions minus the edit button.
                    var nestedSwiper = this.down('nestedlist').getPlugin('nestedlistswiper');
                    nestedSwiper.setRight([{
                        iconCls: 'icon-navigate-cross',
                        commit: 'removeItemClicked',
                        width: 100,
                        undoable: true
                    }]);
                }
            }
        }
    }
});