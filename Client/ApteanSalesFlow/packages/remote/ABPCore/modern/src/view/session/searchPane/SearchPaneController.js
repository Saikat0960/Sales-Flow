/*
    Search Right Pane Container (Modern) Controller
    search implemented differently on Classic
*/
Ext.define('ABP.view.session.searchPane.SearchPaneController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.abp-searchpane',

    listen: {
        controller: {
            '*': {
                searchPane_setupSearch: '__setupSearch',
                searchPane_loadResultObject: '__addSearchObject',
                abp_search_suggestions: 'onUpdatedSuggestions',
                searchPane_switchProvider: '__switchSearchProvider'
            }
        }
    },

    privates: {
        /*
            Called when configuration is run
            Determines how the docked pane header will function based on settings.singleSearchSelection
                and the amount of searches configured in settings.searchInfo array
        */
        __setupSearch: function (settings) {
            var me = this;
            var filterbutton = null;
            var vm = me.getViewModel();
            var items = [];
            vm.set('searchInfo', settings.searchInfo);
            if (Ext.isNumber(settings.searchInfo.length)) {
                // more than one search type?
                if (settings.searchInfo.length > 1) {
                    // Single Search Selection (true) or toggled list (false) default
                    if (settings.singleSearchSelection) {
                        filterbutton = me.__makeSingleSelectButton(settings.searchInfo);
                    } else {
                        filterbutton = me.__makeMultiSelectButton(settings.searchInfo);
                    }
                    vm.set('singleSelect', settings.singleSearchSelection);
                } else {
                    // only 1 search
                    filterbutton = null;
                }
            }
            if (filterbutton) {
                items.push(filterbutton);
            }
            items = items.concat(me.__makeSearchAndClose());
            me.lookupReference('abpSearchPaneHeader').add(items);
        },
        /*
            Creates the button for the docked pane header for settings.singleSearchSelection - false
            Also triggers the creation of the button menu before returning
        */
        __makeMultiSelectButton: function (searchInfo) {
            // make button
            var ret = {
                xtype: 'abpbutton',
                reference: 'abp-search-searchselectionbutton',
                cls: ['abp-searchpane-header-button'],
                margin: '0px 10px 0px 0px',
                iconCls: 'icon-funnel',
                arrow: false,
                handler: '__showFilterMenu'
            };
            // set filtermenu
            this.__setMultiMenu(searchInfo);
            return ret;
        },
        /*
            Creates the settings.singleSearchSelection - false version of the filterMenu
            (Checkboxes for each searchInfo object and an 'apply' button)
        */
        __setMultiMenu: function (searchInfo) {
            var checks = [];
            var vm = this.getViewModel();
            var selection = vm.get('searchSelection');
            var selectAll = Ext.isEmpty(selection);
            // Make checkboxes
            for (var i = 0; i < searchInfo.length; ++i) {
                var selected;
                if (selectAll) {
                    selected = true;
                } else {
                }
                checks.push({
                    xtype: 'checkboxfield',
                    value: true,
                    // passed in search info
                    appId: searchInfo[i].appId,
                    searchEvent: searchInfo[i].event,
                    icon: searchInfo[i].icon,
                    searchId: searchInfo[i].id,
                    minLength: searchInfo[i].minLength,
                    minLengthError: searchInfo[i].minLengthError,
                    name: searchInfo[i].name,
                    recents: searchInfo[i].recents,
                    suggestionEvent: searchInfo[i].suggestionEvent,
                    suggestionThreshold: searchInfo[i].suggestionThreshold,
                    // checkbox info
                    label: searchInfo[i].name,
                    cls: 'abp-search-field',
                    labelCls: 'settingspage-label',
                    labelAlign: 'right',
                    event: searchInfo[i].appId + '_' + searchInfo[i].event,
                    checked: selected
                });
            }
            // Make 'Apply' Button
            var button = {
                xtype: 'abpbutton',
                bind: {
                    text: '{i18n.search_apply:htmlEncode}'
                },
                handler: '__updateMultiSelect'
            }
            // Make Form panel
            var formPanel = {
                xtype: 'formpanel',
                reference: 'abp-search-checkform',
                items: checks
            }
            vm.set('filterMenu', [formPanel, button]);
        },
        /*
            'apply' button handler for settings.singleSearchSelection - false
            Should set the searchSelection in view model based off checked menu items then hide the menu
        */
        __updateMultiSelect: function () {
            //TODO : multiselect update logic
            this.__hideFilterMenu();
        },
        /*
            Shows the button menu, calling showBy on the pane header
        */
        __showFilterMenu: function () {
            var me = this;
            var searchSelect = me.lookupReference('searchSelectionMenu');
            var data = searchSelect.floatParentNode.getData();

            // Remove old theme class and set to current
            searchSelect.setUserCls(ABP.util.Common.getCurrentTheme());

            // have to make the mask before sencha tries to preprocess the showby (otherwise it wont be transparent)
            if (!data.modalMask) {
                // Most of this was stolen from sencha source and altered to add an additional class to the parent mask
                var Widget = Ext.Widget;
                var floatRoot = Ext.getFloatRoot();
                var positionEl = searchSelect.getFloatWrap();
                data.modalMask = searchSelect.floatParentNode.createChild({
                    cls: 'x-mask abp-modal-mask-transparent'
                }, positionEl);

                data.modalMask.on({
                    tap: Widget.onModalMaskTap,
                    scope: Widget
                });
                // A know issue with Safari Mobile causes a body with overflow: hidden
                // to be scrollable on iOS.
                // https://bugs.webkit.org/show_bug.cgi?id=153852
                if (Ext.isiOS && searchSelect.floatParentNode === floatRoot) {
                    data.modalMask.on({
                        touchmove: function (e) {
                            e.preventDefault();
                        }
                    });
                }
            }
            searchSelect.setWidth(me.getView().measure().width);
            searchSelect.showBy(me.lookupReference('abpSearchPaneHeader'), 'b');
        },
        /*
            Hides the button Menu
            Removes focus from button
        */
        __hideFilterMenu: function () {
            this.lookupReference('searchSelectionMenu').hide();
            this.lookupReference('abp-search-searchselectionbutton').blur();
        },
        /*
            Creates the button for the docked pane header for settings.singleSearchSelection - true
            Also triggers the creation of the button menu before returning
        */
        __makeSingleSelectButton: function (searchInfo) {
            var defaultSearch = ABP.util.LocalStorage.getForLoggedInUser('DefaultSearch');
            if (defaultSearch) {
                defaultSearch = searchInfo[searchInfo.findIndex(function (item) { return item.id === defaultSearch })]
                if (!defaultSearch) {
                    defaultSearch = searchInfo[0];
                }
            } else {
                defaultSearch = searchInfo[0];
            }

            if (!defaultSearch.icon) {
                icon = 'icon-funnel';
            }
            // make button
            var ret = {
                xtype: 'abpbutton',
                reference: 'abp-search-searchselectionbutton',
                cls: ['abp-searchpane-header-button'],
                automationCls: 'search-searchselectionbutton',
                margin: '0px 10px 0px 0px',
                iconCls: defaultSearch.icon,
                arrow: false,
                handler: '__showFilterMenu'
            };
            // set filtermenu
            this.__setSingleSelectMenu(searchInfo, defaultSearch);
            return ret;
        },
        /*
            Creates the settings.singleSearchSelection - true version of the filterMenu
            (buttons for each searchInfo object)
        */
        __setSingleSelectMenu: function (searchInfo, defaultSearch) {
            var vm = this.getViewModel();
            //var selection = vm.get('searchSelection');
            // Loop through searchInfo make button for each
            var menu = [];
            for (var i = 0; i < searchInfo.length; ++i) {
                menu.push({
                    xtype: 'abpbutton',
                    // passed in search info
                    appId: searchInfo[i].appId,
                    searchEvent: searchInfo[i].event,
                    searchIcon: searchInfo[i].icon,
                    searchId: searchInfo[i].id,
                    minLength: searchInfo[i].minLength,
                    minLengthError: searchInfo[i].minLengthError,
                    name: searchInfo[i].name,
                    recents: searchInfo[i].recents,
                    suggestionEvent: searchInfo[i].suggestionEvent,
                    suggestionThreshold: searchInfo[i].suggestionThreshold,
                    // button info
                    handler: '__updateSingleSelect',
                    iconCls: searchInfo[i].icon,
                    text: searchInfo[i].name,
                    textAlign: 'left',
                    cls: ['abp-singleselect-search-button']
                });
            }
            vm.set('filterMenu', menu);
            vm.set('searchSelection', defaultSearch);
            this.initSuggestions();
        },
        /*
            button handler for settings.singleSearchSelection - true
            Should set the searchSelection in view model based off the selected search
            Also changes the pane header button icon to that of the search (if search is configured to have one)
        */
        __updateSingleSelect: function (selection) {
            var icon = selection.config.iconCls;
            var vm = this.getViewModel();
            vm.set('searchSelection', selection.config);
            if (icon) {
                this.lookupReference('abp-search-searchselectionbutton').setIconCls(icon);
            }
            this.__hideFilterMenu();
            this.initSuggestions();
            ABP.util.LocalStorage.setForLoggedInUser('DefaultSearch', selection.config.searchId);
        },
        /*
            external handler for switching single search
            used for thumbbar when product specifies which search should be opened to
        */
        __switchSearchProvider: function (searchId) {
            var me = this;
            var vm = me.getViewModel();
            var searchInfo = vm.get('searchInfo');
            var search = searchInfo[searchInfo.findIndex(function (item) { return item.id === searchId })];
            if (search) {
                vm.set('searchSelection', search);
                if (search.icon) {
                    this.lookupReference('abp-search-searchselectionbutton').setIconCls(search.icon);
                }
            }
        },
        /*
            Creates search field and close button
            These are constant reguardless of settings.singleSearchSelection or number of search options
        */
        __makeSearchAndClose: function () {
            return [
                {
                    xtype: 'textfield',
                    reference: 'abp-search-searchfield',
                    flex: 1,
                    height: 32,
                    margin: '3px 0px 3px 0px',
                    cls: ['abp-searchpane-header-searchfield'],
                    automationCls: 'searchpane-header-searchfield',
                    bind: {
                        placeholder: '{emptyText}'
                    },
                    triggers: {
                        search: {
                            iconCls: 'icon-magnifying-glass',
                            cls: ['abp-searchpane-header-trigger'],
                            automationCls: 'searchpane-header-trigger-search',
                            handler: '__search'
                        },
                        clear: {
                            type: 'clear',
                            automationCls: 'searchpane-header-trigger-clear'
                        }
                    },
                    listeners: {
                        'action': '__search',
                        change: 'onSearchFieldChange',
                        focus: 'onSearchFieldFocus',
                        show: function () {
                            this.focus();
                        },
                        el: {
                            keydown: 'onSearchFieldKeyDown'
                        }
                    }
                },
                {
                    xtype: 'abpbutton',
                    cls: ['abp-searchpane-header-button'],
                    automationCls: 'searchpane-header-close',
                    margin: '0px 0px 0px 10px',
                    iconCls: 'icon-navigate-cross',
                    handler: '__closePanel'
                }
            ]
        },
        /*
            Router for checking selection display is correct before showing the button menu
        */
        __checkSelection: function () {
            if (this.getViewModel().get('singleSelect')) {
                this.__checkSingleSelect();
            } else {
                this.__checkMultiSelection();
            }
        },
        /*
            settings.singleSearchSelection - true version of selection display pre show check
            Makes sure only one object is highlighted (the currently selected search)
        */
        __checkSingleSelect: function () {
            var me = this;
            var vm = me.getViewModel();
            var selection = vm.get('searchSelection');
            var menu = vm.get('filterMenu');
            if (selection) {
                for (var i = 0; i < menu.length; ++i) {
                    if (menu[i].name === selection.name) {
                        if (menu[i].cls.length === 1) {
                            menu[i].cls.push('abp-singleselect-search-button-selected');
                        }
                    } else {
                        if (menu[i].cls.length > 1) {
                            // if there is a second cls, it is for selected, get rid of it
                            menu[i].cls = [menu[i].cls[0]];
                        }
                    }
                }
                // subtle styling changes wont be picked up, set to null to force the reload
                vm.set('filterMenu', null);
                vm.set('filterMenu', menu);
            }
        },
        /*
            settings.singleSearchSelection - false version of selection display pre show check
            Makes sure the currently selected searches are the only ones that are checked
        */
        __checkMultiSelection: function () {
            var me = this;
            var vm = me.getViewModel();
            var selection = vm.get('searchSelection');
            // TODO - multiselect logic matching viewmodel searchSelection against checked boxes
        },
        /*
            Adds provided object to resultsContainer (sent as response to search)
        */
        __addSearchObject: function (object) {
            var me = this;
            var resultsContainer = me.lookupReference('abp-search-results');
            var vm = me.getViewModel();
            var single = vm.get('singleSelect');
            if (single) {
                me.__stopSearchTraceTimer();
                if (object) {
                    resultsContainer.removeAll();
                    resultsContainer.add(object);
                    vm.set('empty', false);
                }
            } else {
                //TODO: multiselect logic for adding results, and stoping trace timer
            }
        },
        /*
            Start search timer.  Documenting where hangups could be.
        */
        __startSearchTraceTimer: function () {
            // TODO: STEVE make a trace timer tool
        },
        /*
            Stop search timer and log trace.  Documenting where hangups could be.
        */
        __stopSearchTraceTimer: function () {
            // TODO: STEVE make a trace timer tool, please?
        },
        /*
            Fires event to close the right pane
            handler for our close button
        */
        __closePanel: function () {
            this.fireEvent('session_toggleRightPane');
        },
        /*
            Check length of search vs search crteria and fire search event(s) if they pass
        */
        __search: function () {
            var me = this;
            var vm = me.getViewModel();
            var searchText, searchHiearchy;
            // If the user has selected an item from the suggestion list
            // it should be used in the search, otherwise fallback into the text typed in
            var currentSelection = vm.get('selectedSuggestion');
            if (currentSelection) {
                searchText = currentSelection.get('text');
                searchHiearchy = currentSelection.get('hierarchy');
            } else {
                searchText = me.lookupReference('abp-search-searchfield').getValue();
                searchText = searchText ? searchText.trim() : '';
            }

            var search = me.getSearchProvider();

            if (searchText.length !== 0 && me.checkStringLength(searchText, search)) {
                console.log(search.data.appId + '_' + search.data.event);
                me.fireEvent('main_fireAppEvent', search.data.appId, search.data.event, searchText);
            }

            // Store the last run search, so long as the search provider has recents configured
            var recentStore = vm.getStore('recentSearches');
            recentStore.append(search, searchText, searchHiearchy);
            me.hideSuggestions();
        },
        /**********************************************************************************
        Start: pillaging from old searchController
        **********************************************************************************/
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
        /**
        * Handle the textbox receiving the focus, show the reecnt / suggestions if requried
        */
        onSearchFieldFocus: function () {
            this.showSuggestions();
        },
        onSuggestionClick: function (clicked, record, item, index, e, eOpts) {
            var me = this;
            var view = me.getView()
            var searchField = me.lookupReference('abp-search-searchfield');
            searchField.setValue(record.record.data.text);

            // Fire the search
            me.__search();
        },

        onSearchFieldChange: function (field, newValue, oldValue) {
            var me = this;
            me.refreshSuggestions(newValue);
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
        /**
         * Handle any suggestions being passed from the application
         */
        onUpdatedSuggestions: function (searchId, seachTerm, suggestions) {
            var me = this;

            // decrease the pending results, ensuring we don't hit negative value
            me.pendingRequests = Math.max(me.pendingRequests - 1, 0);

            var vm = me.getViewModel();
            var currentSearchId = vm.getSelectedSearchId();
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

            me.refreshSuggestions();
        },

        refreshSuggestions: function (newValue) {
            var me = this;
            var vm = me.getViewModel()
            var suggestions = vm.getStore("suggestions");

            // If no value is passed in, get the value from the textbox
            if (newValue === undefined) {
                newValue = me.lookupReference('abp-search-searchfield').getValue();
                newValue = newValue ? newValue.trim() : '';
            }
            newValue = newValue.trim();

            suggestions.clearFilter();

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
                // No suggestions so remove the popup loading indicator
                me.hideSuggestions();
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
            var searchId = vm.getSelectedSearchId();
            var store = Ext.StoreMgr.get('searchStore');
            return store.getById(searchId);
        },
        /**
         * Attempt to set the focus into the text field
         */
        focusSearchField: function () {
            var me = this;
            var text = me.lookupReference('abp-search-searchfield');
            if (!text.hidden) {
                text.focus();
            }
        },
        /**
         * Initialise the suggestions store from the recent store.
         */
        initSuggestions: function () {
            var me = this;
            var vm = me.getViewModel();
            var selectedSearchId = vm.getSelectedSearchId();
            var recentSearches = me.getStore('recentSearches');
            var suggestions = me.getStore('suggestions');
            if (selectedSearchId) {
                suggestions.clearFilter();

                var recents = [];
                recentSearches.each(function (model) {
                    if (model.data.searchId == selectedSearchId) {
                        recents.push({
                            text: model.data.text,
                            timestamp: model.data.timestamp,
                            count: model.data.count,
                            isRecent: true
                        });
                    }
                });

                suggestions.loadData(recents);

                me.setSelectedSuggestionId('');
                me.refreshSuggestions('');
            }
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
            var recentSearches = me.lookupReference('GlobalSuggestionPopup');
            recentSearches.alignTarget = searchField;

            // Check to see whether there are any outstanding load requests before we hide the load indicator
            if (loading === undefined) {
                loading = (me.pendingRequests > 0);
            }
            recentSearches.setLoading(loading);
            if (recentSearches.isVisible()) {
                return;
            }

            var recentStore = vm.getStore('recentSearches');
            if (recentStore.count() === 0 && !loading) {
                return;
            }

            // Defer showing the popup until the rest of the controls are rendered
            var searchField = me.lookupReference('abp-search-searchfield');
            Ext.Function.defer(function (searchField, recentSearches) {
                if (!searchField.isVisible()) {
                    return;
                }
                //Rewrite sencha to add transparent mask
                var data = recentSearches.floatParentNode.getData();
                // Remove old theme class and set to current
                recentSearches.setUserCls(ABP.util.Common.getCurrentTheme());

                // have to make the mask before sencha tries to preprocess the showby (otherwise it wont be transparent)
                if (!data.modalMask) {
                    // Most of this was stolen from sencha source and altered to add an additional class to the parent mask
                    var Widget = Ext.Widget;
                    var floatRoot = Ext.getFloatRoot();
                    var positionEl = recentSearches.getFloatWrap();
                    data.modalMask = recentSearches.floatParentNode.createChild({
                        cls: 'x-mask abp-modal-mask-transparent'
                    }, positionEl);

                    data.modalMask.on({
                        tap: Widget.onModalMaskTap,
                        scope: Widget
                    });
                    // A know issue with Safari Mobile causes a body with overflow: hidden
                    // to be scrollable on iOS.
                    // https://bugs.webkit.org/show_bug.cgi?id=153852
                    if (Ext.isiOS && recentSearches.floatParentNode === floatRoot) {
                        data.modalMask.on({
                            touchmove: function (e) {
                                e.preventDefault();
                            }
                        });
                    }
                }
                var isPhone = Ext.os.deviceType === "Phone";
                var searchInputWrapper = searchField.getParent();
                if (isPhone === true) {
                    recentSearches.setWidth('100%');
                    recentSearches.showBy(searchField, 'b');
                } else {
                    var searchInputWrapper = searchField.getParent();
                    var inputWrapperClientRec = searchInputWrapper.el.dom.getBoundingClientRect();
                    // Set recentSearches width to match right pane width
                    recentSearches.setWidth(inputWrapperClientRec.width);
                    // Show recentSearches right below search input wrapper
                    var inputWrapperBottom = inputWrapperClientRec.y + inputWrapperClientRec.height;
                    recentSearches.showAt({ x: inputWrapperClientRec.x, y: inputWrapperClientRec.y + inputWrapperClientRec.height });
                }

                this.setSelectedSuggestionId('');
                searchField.focus();
            }, 200, this, [searchField, recentSearches]);
        },

        /**
         * Hide the suggested popup
         */
        hideSuggestions: function () {
            var me = this;
            var recentSearches = me.lookupReference('GlobalSuggestionPopup');
            if (recentSearches) {
                recentSearches.hide();
            }

            this.pendingRequests = 0;
            if (this.loadTask) {
                this.loadTask.cancel();
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
        }
        /**********************************************************************************
        End: pillaging from old searchController
        **********************************************************************************/
    }
});
