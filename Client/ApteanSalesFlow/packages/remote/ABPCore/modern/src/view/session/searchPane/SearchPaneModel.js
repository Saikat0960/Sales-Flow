/*
    Search Right Pane Container (Modern) Model
    search implemented differently on Classic
*/
Ext.define('ABP.view.session.searchPane.SearchPaneModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.abp-searchpane',
    requires: [
        'ABP.model.SearchModel',
        'ABP.store.ABPRecentSearchStore'
    ],

    data: {
        empty: true,
        filterMenu: [],
        searchBar: [],
        searchInfo: [],
        searchSelection: null,
        selectedSuggestion: null,
        singleSelect: true
    },
    stores: {
        recentSearches: {
            xclass: 'ABP.store.ABPRecentSearchStore'
        },
        suggestions: {
            model: 'ABP.model.Suggestion',
            sortOnLoad: true,
            sorters: {
                property: 'timestamp',
                direction: 'DESC'
            }
        }
    },

    formulas: {
        emptyText: {
            bind: {
                _preSearch: '{i18n.search_searchText}',
                _selectedSearch: '{searchSelection}',
                _singleSelect: '{singleSelect}'
            },
            get: function (data) {
                if (data._singleSelect && data._selectedSearch) {
                    return data._preSearch + ' ' + data._selectedSearch.name;
                }
            }
        }
    },


    getSelectedSearchId: function () {
        var me = this;
        if (me.data.singleSelect) {
            if (!me.data.searchSelection) {
                me.data.searchSelection = me.data.searchInfo[0] || me.data.searchSelection;
            }
            if (me.data.searchSelection) {
                return me.data.searchSelection.id ? me.data.searchSelection.id : me.data.searchSelection.searchId;
            }
            else {
                return null;
            }
        } else {
            //TODO: multi logic
        }
    }

});