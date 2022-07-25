Ext.define('ABP.view.session.toolbarTop.search.SearchBar', {
    extend: 'Ext.Container',
    alias: 'widget.searchbar',
    requires: [
        'ABP.view.session.toolbarTop.search.SearchBarController',
        'ABP.view.session.toolbarTop.search.SearchBarViewModel',
        'ABP.view.session.toolbarTop.search.SearchSelectorButton',
        'ABP.view.session.toolbarTop.search.SearchPopup'
    ],
    controller: 'searchbarcontroller',
    viewModel: {
        type: 'searchbarmodel'
    },
    height: 44,
    width: '100%',
    bind: {
        docked: '{modernDock}',
        hidden: '{!searchBar.open}'
    },
    listeners: {
        // focusleave: 'onFocusLeave'
    },
    cls: 'searchbar searchbaropen',
    layout: {
        type: 'hbox'
    },
    items: [
        // {
        //     xtype: 'button',
        //     itemId: 'searchbarTypeButton',
        //     scale: 'large',
        //     cls: 'abp-icon-button dark-bg',
        //     bind: {
        //         menu: '{searchBar.menuOptions}',
        //         iconCls: '{searchBar.selectedSearchCls}',
        //         //hidden: '{showBarMenuButton}'
        //     },
        //     height: 44
        // },
        {
            xtype: 'searchselectorbutton',
            bind: {
                store: '{searchProviders}'
            }
        },
        {
            xtype: 'textfield',
            itemId: 'searchbarSearchField',
            inputType: 'search',
            cls: 'searchbar-searchfield a-searchdrop-searchfield',
            clearable: false,
            bind: {
                placeholder: '{emptyText}',
                value: '{searchBar.val}'
            },
            listeners: {
                change: 'onSearchFieldChange',
                focus: 'onSearchFieldFocus'
            },
            triggers: {
                search: {
                    iconCls: 'icon-magnifying-glass',
                    weight: -2,
                    handler: 'onSearchClick'
                }
            },
            height: 38,
            flex: 1
        },
        {
            xtype: 'searchpopup',
            itemId: 'GlobalSuggestionPopup',
        },
        {
            xtype: 'button',
            itemId: 'searchbarAdvancedButton',
            focusCls: '',
            overCls: 'searchbar-button-over',
            cls: 'searchbar-button a-searchdrop-advancedbutton',
            bind: {
                text: '{i18n.search_advanced}'
            },
            hidden: true
        },
        {
            xtype: 'button',
            itemId: 'searchbarSearchButton',
            pressedCls: 'searchbar-button-press',
            cls: 'searchbar-button  a-searchdrop-searchbutton',
            iconCls: 'icon-magnifying-glass',
            width: 45,
            handler: 'onSearchClick',
            hidden: true
        }
    ]
});
