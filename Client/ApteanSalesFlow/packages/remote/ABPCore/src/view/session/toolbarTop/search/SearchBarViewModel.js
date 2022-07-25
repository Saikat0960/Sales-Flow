Ext.define('ABP.view.session.toolbarTop.search.SearchBarViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.searchbarmodel',
    requires: [
        'ABP.model.SearchModel',
        'ABP.store.ABPRecentSearchStore'
    ],

    data: {
        selectedSuggestion: null
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
                _selectedSearch: '{searchBar.selectedSearch}'
            },
            get: function (data) {
                return data._preSearch + ' ' + data._selectedSearch;
            }
        },
        modernWidth: {
            get: function () {
                var ret = 475;
                if (ABP.util.Common.getSmallScreen()) {
                    ret = '100%';
                }
                return ret;
            }
        },
        modernDock: {
            get: function () {
                var ret = null;
                if (ABP.util.Common.getSmallScreen()) {
                    ret = 'top';
                }
                return ret;
            }
        },
        selectedSearchTextLS: {
            bind: {
                __selectedSearch: '{searchBar.selectedSearch}'
            },
            get: function (data) {
                var ss;
                var modern = ABP.util.Common.getModern();
                var ret = '';
                if (modern) {
                    ss = ABP.util.Common.getSmallScreen();
                    if (!ss) {
                        ret = data.__selectedSearch;
                    }
                }
                return ret;
            }
        },
        showBarMenuButton: {
            bind: {
                __open: '{searchBar.open}',
                __menu: '{searchBar.menuOptions}'
            },
            get: function (data) {
                // Show the search provider menu button is the search bar is open and
                // there is more than 1 search provider
                return data.__open && data.__menu.length > 1;
            }
        },
        showDropMenuButton: {
            bind: {
                __menu: '{searchProviders}'
            },
            get: function (data) {
                var ret = false;
                if (data.__menu.getCount() < 2) {
                    return true;
                }
                return ret;
            }
        }
    }
});