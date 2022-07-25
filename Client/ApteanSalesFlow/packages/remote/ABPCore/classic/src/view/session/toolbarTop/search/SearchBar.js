Ext.define('ABP.view.session.toolbarTop.search.SearchBar', {
    extend: 'Ext.container.Container',
    alias: 'widget.searchbar',
    requires: [
        'ABP.view.session.toolbarTop.search.SearchBarController',
        'ABP.view.session.toolbarTop.search.SearchBarViewModel',
        'ABP.view.session.toolbarTop.search.SearchPopup'
    ],
    controller: 'searchbarcontroller',
    viewModel: {
        type: 'searchbarmodel'
    },
    width: 45,
    bind: {
        height: '{toolbarHeight}'
    },
    listeners: {
        focusleave: 'onFocusLeave'
    },
    cls: 'searchbar',
    layout: {
        type: 'hbox',
        align: 'center',
        pack: 'end'
    },
    items: [{
        xtype: 'abpbutton',
        itemId: 'searchbarTypeButton',
        scale: 'large',
        // cls: 'abp-icon-button dark-bg',
        uiCls: ['dark'],
        hidden: true,
        bind: {
            menu: '{searchBar.menuOptions}',
            iconCls: '{searchBar.selectedSearchCls}',
            hidden: '{!showBarMenuButton}',
            ariaLabel: '{i18n.button_search}'
        },
        height: 44
    }, {
        xtype: 'textfield',
        itemId: 'searchbarSearchField',
        reference: 'searchbarSearchField',
        cls: 'searchbar-searchfield a-searchbar-searchfield',
        // Ensure we supress the browser spell check
        inputAttrTpl: 'spellcheck="false"',
        ariaRole: 'combobox',
        hidden: true,
        hideLabel: true,
        bind: {
            emptyText: '{emptyText}',
            ariaLabel: '{emptyText}',
            hideLabel: true,
            //fieldLabel: '{emptyText}',
            hidden: '{!searchBar.open}',
            value: '{searchBar.val}'
        },
        height: 32,
        width: 225,
        enableKeyEvents: true,
        listeners: {
            change: 'onSearchFieldChange',
            focus: 'onSearchFieldFocus',
            show: function () {
                this.focus();
            },
            el: {
                keydown: 'onSearchFieldKeyDown'
            },
            hide: 'ensureSuggestionsHidden'
        },
        keyMap: {
            ESC: 'onEscKey',
            ENTER: 'onEnterKey',
            "CTRL+DOWN": 'onSwitchProviderDown',
            "CTRL+UP": 'onSwitchProviderUp',
            "ALT+191": {
                alt: true,
                fn: 'onJumpToKey',
                defaultEventAction: 'stopPropagation',
            }
        },
        ariaAttributes: {
            'aria-owns': 'GlobalSuggestionPopup',
            'aria-controls': 'GlobalSuggestionPopup',
            'aria-haspopup': 'listbox',
            'aria-expanded': 'false',
            'aria-autocomplete': 'list',
            'aria-activedescendant': ''
        }
    },
    {
        xtype: 'searchpopup',
        id: 'GlobalSuggestionPopup',
    },
    {
        xtype: 'abpbutton',
        itemId: 'searchbarAdvancedButton',
        focusCls: '',
        overCls: 'searchbar-button-over',
        cls: 'searchbar-button a-searchbar-advancedbutton',
        height: 44,
        bind: {
            text: '{i18n.search_advanced:htmlEncode}',
            ariaLabel: '{i18n.search_advanced}'
        },
        hidden: true
    },],

    initComponent: function () {
        var me = this;
        var items = me.items;
        var toggleable = ABP.Config.canGlobalSearchToggle();
        if (toggleable === false) {
            var length = items.length - 1;  //Advanced button is not being used, so this omits it from the process;
            for (var i = 0; i < length; i++) {
                var item = items[i];
                if (item.hidden) {
                    item.hidden = false;
                }
                if (item.bind) {
                    var bind = item.bind;
                    if (bind.hidden) {
                        delete item.bind.hidden;
                    }
                }
                if (item.itemId === 'searchbarSearchField') {
                    var listeners = item.listeners;
                    listeners.focus = 'getSuggestions';
                    item.triggers = {
                        search: {
                            cls: 'icon-magnifying-glass',
                            automationCls: 'global-search-trigger',
                            handler: 'onSearchClick'
                        }
                    }
                }
            }
            me.callParent();
            var controller = me.getController();
            controller.__openInBar();
        } else {
            items.push(
                {
                    xtype: 'abpbutton',
                    itemId: 'searchbarSearchButton',
                    uiCls: ['dark'],
                    // cls: 'abp-icon-button toolbar-menu-button toolbar-rpsegment-button',
                    iconCls: 'icon-magnifying-glass',
                    scale: 'large',
                    bind: {
                        tooltip: '{i18n.sessionMenu_search:htmlEncode}',
                        ariaLabel: '{i18n.search_toggle}',
                        ariaExpanded: '{searchBar.open}'
                    },
                    height: 44,
                    width: 45,
                    handler: 'onSearchClick'
                }
            );
            me.callParent();
        }
    }
});
