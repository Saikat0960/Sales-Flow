/*
    Search Right Pane Container (Modern)
    search implemented differently on Classic
*/
Ext.define('ABP.view.session.searchPane.SearchPane', {
    extend: 'Ext.Container',
    requires: [
        'ABP.view.session.searchPane.SearchPaneController',
        'ABP.view.session.searchPane.SearchPaneModel',
        'ABP.view.session.toolbarTop.search.SearchPopup'
    ],
    alias: 'widget.abp-searchpane',
    controller: 'abp-searchpane',
    viewModel: {
        type: 'abp-searchpane'
    },
    cls: ['abp-searchpane'],
    layout: 'vbox',
    items: [
        {
            xtype: 'container',
            cls: ['abp-searchpane-header'],
            reference: 'abpSearchPaneHeader',
            layout: 'hbox',
            docked: 'top',
            items: []
        },
        {
            xtype: 'container',
            flex: 1,
            items: [
                {
                    xtype: 'container',
                    reference: 'searchSelectionMenu',
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    hidden: true,
                    floated: true,
                    modal: true,
                    hideOnMaskTap: true,
                    left: 0,
                    bind: {
                        items: '{filterMenu}'
                    },
                    listeners: {
                        beforeShow: '__checkSelection'
                    }
                },
                {
                    xtype: 'searchpopup',
                    reference: 'GlobalSuggestionPopup'
                },
                {
                    xtype: 'container',
                    cls: ['rightpane-content'],
                    bind: {
                        hidden: '{!empty}'
                    },
                    reference: 'abp-search-emptycontent',
                    flex: 1,
                    height: '100%',
                    layout: {
                        type: 'vbox',
                        align: 'center',
                        pack: 'center'
                    },
                    items: [
                        {
                            xtype: 'component',
                            html: '<div class="icon-magnifying-glass abp-search-resultsplaceholder-icon"></div>'
                        }, {
                            xtype: 'component',
                            bind: {
                                html: '<div class="abp-search-resultsplaceholder">{i18n.search_resultsPlaceholder:htmlEncode}</div>'
                            }
                        }
                    ]
                },
                {
                    xtype: 'container',
                    cls: ['rightpane-content'],
                    bind: {
                        hidden: '{empty}'
                    },
                    height: '100%',
                    reference: 'abp-search-results',
                    flex: 1,
                    layout: 'fit'
                }
            ]
        }
    ]
});
