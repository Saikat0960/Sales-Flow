Ext.define('ABP.view.session.toolbarTop.search.SearchBarController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.searchbarcontroller',

    listen: {
        controller: {
            '*': {
                searchBar_close: '__closeToButton',
                searchBar_openIn: '__openInBar',
                abp_searchBar_toggleKey: 'onToggleKeyPressed',
                abp_search_suggestions: 'onUpdatedSuggestions'
            }
        }
    },

    pendingRequests: 0,

    loadTask: null,

    /**
     * Handle the view models being created
     */
    initViewModel: function (vm) {
        this.callParent(vm);
        this.initSuggestions();

        this.loadTask = new Ext.util.DelayedTask(this.fireLoadRequest, this);
    },

    toggleSearchButtonPressed: function () {
        var me = this;
        var vm = me.getViewModel();
        var view = me.getView();
        var open = vm.get('searchBar.open');
        var searchButton = view.down('#searchbarSearchButton');

        if (open) {
            searchButton.removeCls('x-btn-pressed');
        } else {
            searchButton.addCls('x-btn-pressed');
        }
    },

    onSearchClick: function (options) {
        var me = this;
        var view = me.getView();
        var field = view.lookupReference('searchbarSearchField');
        var visible = field.isVisible();
        var vm = me.getViewModel();
        var searchText, searchHiearchy, instanceId;
        var toggleableGlobalSearch = ABP.Config.canGlobalSearchToggle();
        var shortcut = !Ext.isEmpty(options) ? options.shortcut : false;

        if (toggleableGlobalSearch === false && shortcut) {
            // Defer briefly to allow the '/' to process so it is not placed into the search field.
            Ext.defer(function (field) {
                field.focus();
            }, 1, me, [field]);
        } else if (toggleableGlobalSearch !== false) {
            me.toggleSearchButtonPressed();
        }

        if (visible) {
            me.hideSuggestions();
            // If the user has selected an item from the suggestion list
            // it should be used in the search, otherwise fallback into the text typed in
            var currentSelection = vm.get('selectedSuggestion');
            if (currentSelection) {
                searchText = currentSelection.get('text');
                searchHiearchy = currentSelection.get('hierarchy');
                instanceId = currentSelection.get('instanceId');
            }
            else {
                searchText = vm.get('searchBar.val').trim();
            }
            // If there is no search text or we got here via shortcut '/' just return.
            if (searchText.length === 0 || shortcut) {
                return;
            }
            var search = me.getSearchProvider();

            if (me.checkStringLength(searchText, search)) {
                args = searchText;
                if (instanceId) {
                    args = [searchText, instanceId];
                }
                me.fireEvent('main_fireAppEvent', search.data.appId, search.data.event, args);
            }
            if (toggleableGlobalSearch === true) {
                me.__closeToButton();
            }
            // Store the last run search, so long as the search provider has recents configured
            var recentStore = vm.getStore('recentSearches');
            recentStore.append(search, searchText, searchHiearchy, instanceId);
        } else {
            if (toggleableGlobalSearch === true) {
                me.expandSearchBar();
            }
        }
    },

    /**
     * Monitor the user pressing keys within the searh textbox. Handle the system / function keys to
     * navigate the selected popup items. Trigger the server side look up if its been configured.
     *
     * Up / Down ... cycle through the search results items
     * Esc ... close / cancel the search
     * Tab ... move the focus to the search results
     */
    onSearchFieldKeyDown: function (e) {
        var me = this;
        var keyCode = e.getKey();

        if (keyCode === e.DOWN) {
            me.moveSelectedSearchResult(1);
            e.stopEvent();
        }
        else if (keyCode === e.UP) {
            me.moveSelectedSearchResult(-1);
            e.stopEvent();
        }
    },

    __openInBar: function () {
        var me = this;
        var view = me.getView();
        var vm = me.getViewModel();
        var type = view.down('#searchbarTypeButton');
        var text = view.down('#searchbarSearchField');
        me.fireEvent('toolbar_setOverrideTitle', ' ');

        // TODO: check to ensure we don't use too much space
        view.setWidth('475');
        view.addCls('searchbaropen');
    },

    __closeToButton: function (transition) {
        var me = this;
        var view = me.getView();
        var vm = me.getViewModel();
        var open = vm.get('searchBar.open');
        var text = view.down('#searchbarSearchField');
        if (open) {
            me.fireEvent('toolbar_setOverrideTitle');
            view.setWidth(45);
            view.removeCls('searchbaropen');

            if (!transition) {
                text.setValue();
            }
            me.toggleSearchButtonPressed();
            vm.set('searchBar.open', false);

            me.hideSuggestions();
        }
    },

    /**
     * Handle the focus leaving the scope of the search bar
     */
    onFocusLeave: function () {
        this.__closeToButton();
    },

    /**
     * Handle the textbox receiving the focus, show the rececnt / suggestions if requried
     */
    onSearchFieldFocus: function () {
        this.showSuggestions();
    },

    /**
     * Handle the user pressing the ESC key to close / hide the search controls
     */
    onEscKey: function () {
        this.__closeToButton();
    },

    /**
     * Handle the user pressing the ENTER key to run the search
     */
    onEnterKey: function () {
        var me = this;
        var popup = Ext.get('GlobalSuggestionPopup').component;
        var dataview = popup.getComponent('searchPopupDataview');
        var items = dataview.all.elements;
        var length = items.length;
        var record;
        for (var i = 0; i < length; i++) {
            var item = items[i]
            if (item.className.includes('x-item-selected')) {
                record = dataview.store.getAt(i);
                break;
            } else {
                record = null;
            }
        }
        if (Ext.isEmpty(record)) {
            me.onSearchClick();
        } else {
            var click;
            me.onSuggestionClick(click, record);
        }
    },

    onJumpToKey: function () {
        this.fireEvent('abp_jumpto_show');
    },

    /**
     * Handle the user pressing the CTRL + Down keys to switch to the next search provider
     */
    onSwitchProviderDown: function () {
        this.switchProvider(1);
    },

    /**
     * Handle the user pressing the CTRL + Down keys to switch to the next search provider
     */
    onSwitchProviderUp: function () {
        this.switchProvider(-1);
    },

    /**
     * Handle the user clicking on the search provider dropdown
     */
    onProviderClick: function (args) {
        this.focusSearchField();
        this.setSearch(args.searchId);
    },

    onSuggestionClick: function (clicked, record, item, index, e, eOpts) {
        var me = this;
        var view = me.getView();
        var vm = me.getViewModel();

        var searchField = view.down('#searchbarSearchField');
        searchField.setValue(record.data.text);

        vm.set('selectedSuggestion', record);

        // Fire the search
        searchField.suspendEvent('focus');
        me.onSearchClick();
        searchField.suspendEvent('focus');
    },

    onSearchFieldChange: function (field, newValue, oldValue) {
        var me = this;
        me.refreshSuggestions(newValue);

        var vm = me.getViewModel();
        var view = me.getView();
        var hideLoading = true;
        var search = me.getSearchProvider();
        if (!search || !search.data || !search.data.suggestionEvent) {
            return;
        }

        // We have a product that wants to supply their own suggestions
        // lets handle the special cases:

        var searchText = newValue.trim();
        if (searchText.length >= search.data.suggestionThreshold) {
            // Wait 200ms before calling invoking the fire event function. If the user presses another key
            // during that 200ms, it will be cancelled and we'll wait another 200ms.
            this.loadTask.delay(200, this.fireLoadRequest, this, [search, searchText]);
        }
        else {
            // Cancel any outstanding fire events as the threshold has not be met, user may have pressed the back key
            this.loadTask.cancel();

            // The search text has fallen below the threshold, lets remove any suggestions
            // from previous look ups.
            me.removeCustomSuggestions();
        }

        // Update the suggestions popup showing the loading indicator if the application
        // is going off to find some more suggestions.
        var loading = (me.pendingRequests > 0);
        me.showSuggestions(loading);
    },

    privates: {
        /**
         * Handle any suggestions being passed from the application
         */
        onUpdatedSuggestions: function (searchId, seachTerm, suggestions, removeCaseInsensitiveDuplicates) {
            var me = this;

            // decrease the pending results, ensuring we don't hit negative value
            me.pendingRequests = Math.max(me.pendingRequests - 1, 0);

            var vm = me.getViewModel();
            var currentSearchId = vm.get('searchBar.selectedSearch');
            if (currentSearchId !== searchId) {
                // The user has changed the search provider while building suggestions.
                // lets abandon the returned suggestions.
                return;
            }

            if (!suggestions || suggestions.length === 0) {
                // If we didn't get any suggestions from the application, lets do now more.
                return;
            }

            var suggestionStore = me.getStore('suggestions');
            var recents = [];
            Ext.Array.each(suggestions, function (item) {
                // Skip any duplicate records
                if (suggestionStore.findExact('text', item.text) < 0) {
                    recents.push({
                        text: item.text,
                        hierarchy: item.hierarchy,
                        instanceId: item.instanceId,
                        timestamp: 0,//Date.now(),
                        count: 1,
                        isRecent: false
                    });
                }
            });

            // Append the loaded suggested for the existing store
            suggestionStore.loadData(recents, true);

            me.refreshSuggestions(undefined, removeCaseInsensitiveDuplicates);
        },

        refreshSuggestions: function (newValue, removeCaseInsensitiveDuplicates) {
            var me = this;
            var vm = me.getViewModel()
            var suggestions = vm.getStore("suggestions");

            // If no value is passed in, get the value from the textbox
            if (newValue === undefined) {
                newValue = vm.get('searchBar.val');
            }
            newValue = newValue.trim();

            suggestions.clearFilter();

            // Remove any duplicates from the store - this is a case insensitve compare.
            // Eg. If the store contains ["test", "TEST", "another test"] "TEST" will be removed.
            if (removeCaseInsensitiveDuplicates) {
                try {
                    ABP.util.Common.removeCaseInsensitiveDuplicates(suggestions, 'text');
                } catch (e) {
                    ABPLogger.logDebug(e);
                }
            }

            var sorters = [];
            if (newValue != "") {
                // Get the text filter object based on the selection
                filterFunction = ABP.util.filters.Factory.createStringFilter(newValue, [{ name: 'text', useSoundEx: false }, { name: 'hierarchy', useSoundEx: false }], true, 1);

                // filter the store passing the bound filter function
                suggestions.filter({ id: 'TextFilter', filterFn: filterFunction });

                // Only need to add the relevance into the sorting if we are filtering by the text
                sorters.push({ property: '_relevance', direction: 'DESC' });
            }

            sorters.push({ property: 'timestamp', direction: 'DESC' });
            suggestions.sort(sorters);

            var topNfilter = ABP.util.filters.Factory.createTopNFilter(me.getRecentLength());
            suggestions.filter({ id: 'TopNFilter', filterFn: topNfilter });

            if (suggestions.count() === 0) {
                return;
            }

            me.showSuggestions();

            // Clear the selected suggestion if its no longer available
            var selected = vm.get('selectedSuggestion');
            if (suggestions.indexOf(selected) === -1) {
                vm.set('selectedSuggestion', null);
            }
        },

        /**
         * Remove any suggestions that are non-recent i.e. have been added by the application
         */
        removeCustomSuggestions: function () {
            var me = this;
            var vm = me.getViewModel()
            var suggestions = vm.getStore("suggestions");

            var toRemove = [];
            suggestions.each(function (item) {
                if (!item.data.isRecent) {
                    toRemove.push(item);
                }
            });

            suggestions.remove(toRemove);
        },

        /**
         * Get the number of recent items to display to the user
         */
        getRecentLength: function () {
            var search = this.getSearchProvider()
            if (search) {
                return search.get('recents');
            }
            else {
                return 0;
            }
        },

        /**
         * Get a reference to the selected search provider
         */
        getSearchProvider: function () {
            var vm = this.getViewModel()
            var searchId = vm.get('searchBar.selectedSearch');
            var store = Ext.StoreMgr.get('searchStore');
            return store.getById(searchId);
        },

        /**
         * Move the selected suggestion  by a specific number of items.
         * typically used to move forward and back one space
         */
        moveSelectedSearchResult: function (increment) {
            var me = this;
            var vm = me.getViewModel(),
                v = me.getView();
            var currentSelection = vm.get('selectedSuggestion');

            var store = vm.getStore("suggestions");;
            var currentIndex = -1;
            if (currentSelection) {
                currentIndex = store.indexOf(currentSelection);
                currentIndex = currentIndex + increment;
            }
            else {
                // Nothing is currently selected lets force the selection based
                // on the direction of travel (increment)
                currentIndex = 0;
                if (increment < 0) {
                    currentIndex = store.getCount() - 1;
                }
            }

            var selected = store.getAt(currentIndex);
            vm.set('selectedSuggestion', selected);

            if (selected) {
                ABP.util.Aria.setActiveDecendant(v.down('#searchbarSearchField'), selected.id);
            }
            else {
                ABP.util.Aria.setActiveDecendant(v.down('#searchbarSearchField'), '');
            }
        },

        /**
         * Attempt to set the focus into the text field
         */
        focusSearchField: function () {
            var me = this;
            var text = me.getView().down('#searchbarSearchField');
            if (!text.hidden) {
                text.focus();
            }
        },

        /**
         * Switch the currently selected search provider in the direction specified
         */
        switchProvider: function (direction) {
            var me = this;
            var vm = me.getViewModel();

            var store = Ext.StoreMgr.get('searchStore');
            var selectedSearch = vm.get('searchBar.selectedSearch');
            var i = store.indexOfId(selectedSearch);
            i = i + direction;
            i = (i < 0) ? store.count() - 1 : i;
            i = (i >= store.count()) ? 0 : i;

            me.setSearch(store.getAt(i));
        },

        /**
         * Initialise the suggestions store from the recent store.
         */
        initSuggestions: function () {
            var me = this;
            var vm = me.getViewModel();
            var selectedSearchId = vm.get('searchBar.selectedSearch');
            var recentSearches = me.getStore('recentSearches');
            var suggestions = me.getStore('suggestions');

            suggestions.clearFilter();

            var recents = [];
            recentSearches.each(function (model) {
                if (model.data.searchId == selectedSearchId) {
                    recents.push({
                        text: model.data.text,
                        hierarchy: model.data.hierarchy,
                        instanceId: model.data.instanceId,
                        timestamp: model.data.timestamp,
                        count: model.data.count,
                        isRecent: true
                    });
                }
            });

            suggestions.loadData(recents);

            me.setSelectedSuggestionId('');
            me.refreshSuggestions('');
        },

        /**
         * Update the currently selected search from the model supplied
         */
        setSearch: function (search) {
            if (typeof search === 'string') {
                var store = Ext.StoreMgr.get('searchStore');
                search = store.getById(search);
            }

            if (!search) {
                return;
            }

            var me = this;
            var vm = me.getViewModel();
            vm.set('searchBar.selectedSearch', search.id);
            vm.set('searchBar.selectedSearchCls', search.get('icon'));

            ABP.util.LocalStorage.setForLoggedInUser('DefaultSearch', search.id);

            me.initSuggestions();
        },

        /**
         * Show the suggested popup
         *
         * @param loading whether the application is in the process of loading suggestions
         */
        showSuggestions: function (loading) {
            var me = this;
            var vm = me.getViewModel();
            var view = this.getView()
            var recentSearches = view.down('#GlobalSuggestionPopup');
            recentSearches.alignTarget = searchField;
            // Check to see whether there are any outstanding load requests before we hide the load indicator
            if (loading === undefined) {
                loading = (me.pendingRequests > 0);
            }
            recentSearches.setMessage(null);
            recentSearches.setLoading(loading);
            if (recentSearches.isVisible()) {
                return;
            }

            var recentStore = vm.getStore('recentSearches');
            if (recentStore.count() === 0 && !loading) {
                return;
            }

            // Defer showing the popup until the rest of the controls are rendered
            var searchField = view.down('#searchbarSearchField');
            Ext.Function.defer(function (searchField, recentSearches) {
                if (!searchField.isVisible()) {
                    return;
                }
                recentSearches.setWidth(searchField.getWidth());
                recentSearches.showBy(searchField, 'bl');
                this.setSelectedSuggestionId('');
                ABP.util.Aria.setExpanded(searchField, true);
                searchField.focus();
            }, 200, this, [searchField, recentSearches]);
        },

        /**
         * Hide the suggested popup
         */
        hideSuggestions: function () {
            var view = this.getView()
            var recentSearches = view.down('#GlobalSuggestionPopup');
            if (recentSearches) {
                recentSearches.hide();
            }

            this.pendingRequests = 0;
            if (this.loadTask) {
                this.loadTask.cancel();
            }

            var searchField = view.down('#searchbarSearchField');
            ABP.util.Aria.setExpanded(searchField, true);
        },

        ensureSuggestionsHidden: function () {
            var me = this;
            var view = me.getView();
            if (view.hidden === false) {
                me.hideSuggestions();
            }
        },

        /**
         * Set the selected suggestion from the supplied id
         */
        setSelectedSuggestionId: function (id) {
            var me = this;
            var vm = me.getViewModel();
            var store = vm.getStore("suggestions");
            if (store.count() === 0) {
                return;
            }

            var i = store.find('id', id);
            if (i !== -1) {
                vm.set('selectedSuggestion', store.getAt(i));
            }
            else {
                vm.set('selectedSuggestion', null);
            }
        },

        /**
         * Check the length of the string is valid before the search is invoked
         */
        checkStringLength: function (inString, record) {
            var me = this;
            var testString = inString.trim();
            var ret = false;
            if (record && record.data.minLength) {
                if (testString.length >= record.data.minLength) {
                    ret = true;
                } else {
                    if (record.data.minLengthError) {
                        ABP.view.base.popUp.PopUp.showError(record.data.minLengthError);
                    }
                }
            }
            return ret;
        },

        /**
         * Show the searchbar in its expanded view
         */
        expandSearchBar: function () {
            var me = this;
            var vm = me.getViewModel();
            var recentStore = vm.getStore('recentSearches');
            if (!recentStore.isLoaded()) {
                recentStore.load();
            }

            this.initSuggestions();

            me.__openInBar();
            vm.set('searchBar.open', true);

            me.focusSearchField();
        },

        /**
         * Handle the user pressing the toggle key (forward slash)
         */
        onToggleKeyPressed: function (args) {
            var me = this;

            // If the search id is passed in, ensure its the selected one
            if (args) {
                me.setSearch(args);
            }

            var vm = me.getViewModel()
            var open = vm.get('searchBar.open');
            if (!open) {
                me.onSearchClick({ shortcut: true });
            }
        },

        /**
         * Fire the load suggestions event for the application to handle. We expect the event to return true, but if its returns false
         * the application is not handling this request and we don't need to wait for a response, don't increment the pending requests.
         */
        fireLoadRequest: function (search, searchText) {
            var me = this;
            var search = me.getSearchProvider();

            // Fire the async request to get suggestions from the application.
            if (me.fireEvent(search.data.appId + '_' + search.data.suggestionEvent, { searchId: search.id, text: searchText })) {
                me.pendingRequests++;

                // Ensure the loading indicator is shown
                me.showSuggestions(true);
            }
        },

        getSuggestions: function () {
            var me = this;
            var view = me.getView();
            var field = view.lookupReference('searchbarSearchField');
            var value = field.value;
            me.onSearchFieldChange(field, value);
        }
    }
});
