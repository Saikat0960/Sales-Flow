/**
 *  Panel to edit individual favorite items from the favorite manager.
 */
Ext.define('ABP.view.session.favorites.FavoritesManagerEditPanel', {
    extend: 'Ext.Panel',
    requires: [
        'ABP.view.session.favorites.FavoritesManagerEditPanelController',
        'ABP.view.session.favorites.FavoritesEditPanelModel'
    ],
    alias: 'widget.favoriteseditpanel',
    controller: 'favoriteseditpanel',
    viewModel: {
        type: 'favoritesEditPanel'
    },
    cls: 'favoriteseditpanel',
    bodyCls: 'x-unselectable',
    floated: true,
    modal: true,
    bind: {
        title: '{favorites_editPanel_title:htmlEncode}'
    },
    padding: 10,
    border: true,
    layout: {
        type: 'vbox',
        align: 'center',
        pack: 'center'
    },
    header: {
        automationCls: 'edit-favorites-panel-header'
    },

    config: {
        favorite: undefined,
    },

    tools: [{
        iconCls: 'icon-navigate-cross',
        handler: 'onCloseClick'
    }],

    defaults: {
        labelAlign: 'top',
    },

    items: [{
        xtype: 'textfield',
        width: '100%',
        allowBlank: false,
        cls: 'a-favorites-editpanel-name',
        itemId: 'favoriteName',
        bind: {
            label: '{favorites_editPanel_name:htmlEncode}',
            disabled: '{!allowItemRename}'
        }
    }, {
        xtype: 'textfield',
        cls: 'a-favorites-editpanel-source',
        width: '100%',
        editable: false,
        disabled: true,
        itemId: 'favoriteSource',
        bind: {
            label: '{favorites_editPanel_source:htmlEncode}',
            hidden: '{!allowItemRename}'
        }
    }, {
        xtype: 'combobox',
        displayField: 'text',
        width: '100%',
        valueField: 'id',
        cls: 'a-favorites-editpanel-groups',
        itemId: 'favoriteGroups',
        bind: {
            label: '{favorites_editPanel_moveToGroup:htmlEncode}',
            hidden: '{depthLimit === 1}'
        }
    }],

    bbar: {
        padding: 10,
        defaults: {
            border: false
        },
        items: [{
            bind: {
                text: '{button_cancel:htmlEncode}'
            },
            flex: 1,
            automationCls: 'favorites-editpanel-bbar-cancel',
            handler: 'onCloseClick'
        }, {
            bind: {
                text: '{button_delete:htmlEncode}'
            },
            flex: 1,
            automationCls: 'favorites-editpanel-bbar-delete',
            handler: 'onDeleteClick'
        }, {
            bind: {
                text: '{button_save:htmlEncode}'
            },
            flex: 1,
            automationCls: 'favorites-editpanel-bbar-save',
            handler: 'onSaveClick'
        }]
    }
});