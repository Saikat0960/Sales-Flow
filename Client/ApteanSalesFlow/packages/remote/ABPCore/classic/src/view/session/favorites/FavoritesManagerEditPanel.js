/**
 *  Panel to edit individual favorite items from the favorite manager.
 */
Ext.define('ABP.view.session.favorites.FavoritesManagerEditPanel', {
    extend: 'Ext.panel.Panel',
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
    floating: true,
    modal: true,
    bind: {
        title: '{i18n.favorites_editPanel_title:htmlEncode}'
    },
    //frame: true,
    border: true,
    layout: 'vbox',
    header: {
        automationCls: 'edit-favorites-panel-header'
    },

    config: {
        favorite: undefined,
    },

    width: 500,
    height: 300,

    tools: [{
        iconCls: 'icon-navigate-cross',
        handler: 'onCloseClick'
    }],

    defaults: {
        labelAlign: 'top',
        width: '100%',
        margin: '0 10 0 10'
    },

    items: [{
        xtype: 'textfield',
        allowBlank: false,
        cls: 'a-favorites-editpanel-name',
        itemId: 'favoriteName',
        bind: {
            fieldLabel: '{i18n.favorites_editPanel_name:htmlEncode}',
            disabled: '{!allowItemRename}'
        }
    }, {
        xtype: 'textfield',
        cls: 'a-favorites-editpanel-source',
        editable: false,
        disabled: true,
        itemId: 'favoriteSource',
        bind: {
            fieldLabel: '{i18n.favorites_editPanel_source:htmlEncode}',
            hidden: '{!allowItemRename}'
        }
    }, {
        xtype: 'combobox',
        displayField: 'text',
        valueField: 'id',
        cls: 'a-favorites-editpanel-groups',
        itemId: 'favoriteGroups',
        bind: {
            fieldLabel: '{i18n.favorites_editPanel_moveToGroup:htmlEncode}',
            hidden: '{conf.settings.favorites.depthLimit === 1}'
        }
    }],

    bbar: {
        defaults: {
            border: false
        },
        items: ['->', {
            bind: {
                text: '{i18n.button_cancel:htmlEncode}'
            },
            cls: 'a-favorites-editpanel-bbar-cancel',
            width: 100,
            handler: 'onCloseClick'
        }, {
                bind: {
                    text: '{i18n.button_delete:htmlEncode}'
                },
                cls: 'a-favorites-editpanel-bbar-delete',
                width: 100,
                handler: 'onDeleteClick'
            }, {
                bind: {
                    text: '{i18n.button_save:htmlEncode}'
                },
                cls: 'a-favorites-editpanel-bbar-save',
                width: 100,
                handler: 'onSaveClick'
            }]
    }
});