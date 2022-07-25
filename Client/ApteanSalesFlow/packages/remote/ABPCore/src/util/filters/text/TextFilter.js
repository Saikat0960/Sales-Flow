/**
 * Text filtering class used to match a model with a number of fields.
 *
 * @since ABP 3.0.0
 */
Ext.define('ABP.util.filters.text.TextFilter', {
    itemId: 'StringFilter',
    config: {
        /**
         * The text to search for within the model instance
         */
        searchText: '',

        searchTerms: [],

        /**
         * Whether all the values entered should match, false will match any of the search text
         */
        matchAllValues: false,

        /**
         * The minumum length the search term must exceeed before the filtering is enabled
         */
        minLengthThreshold: 2,

        /**
        * array of field config {name:'', useSoundEx: false}
        */
        searchFields: [],

        /**
         * The weighting factor to apply to the relevance of the match.
         * The weighting is purely based on the number of search terms that are used
         */
        weighting: 1,
    },

    defaultSearchFieldConfig: {
        name: '',
        useSoundEx: true
    },

    matchingConfig: {
        isMatch: false,
        isExactMatch: false,
        wordPosition: false,
        charPosition: false,
        soundsLike: false
    },

    /**
    * Initialises a new instance of the search filter.
    * @param {String/Number} config Array of fields to use in the filter. Config data for each field {name, useSoundex}.
    */
    constructor: function (config) {
        if (Ext.isArray(config.searchFields)) {
            Ext.Array.each(config.searchFields, function (searchField, index, searchFields) {
                searchFields[index] = Ext.apply({}, searchField || {}, this.defaultSearchFieldConfig);
            });
        }

        config.searchText = config.searchText.toLowerCase().trim()
        config.weighting = (1 / config.searchText.split(' ').length);
        config.searchTerms = config.searchText.split(' ');

        this.initConfig(config);

        return this;
    },

    /**
     * public function for filtering based on period values. Subclasses to override this
     * @param {String/Number} item The model instance to check for a match
     * @return {Boolean} whether the model matches the filter criteria
     */
    filter: function (item) {
        var searchText = this.getSearchText();
        if (!searchText) {
            return true;
        }

        // Check that there is more than the threshold characters before filtering
        var threshold = this.getMinLengthThreshold();
        if (searchText.length < threshold) {
            return true;
        }

        var me = this, itemMatching = [],
            match = null;

        var numberOfTerms = this.config.searchTerms.length;
        for (var i = 0; i < numberOfTerms; i++) {
            // only check the threshold for the first term, this will prevent the disappearing when you have text like 'test c'
            if (this.config.searchTerms[i].length >= threshold || i > 0) {
                if (this.getMatchAllValues()) {
                    match = this._itemHasMatch(item, this.config.searchTerms[i], i)
                }
                else {
                    match = this._itemHasMatch(item, this.config.searchTerms[i], i)
                }

                if (match.isMatch) {
                    itemMatching.push(match);
                }
            }
        }

        // If we are looking for all matching values ensure we have the same number of
        // values as we do terms
        if (this.getMatchAllValues()) {
            if (itemMatching.length != numberOfTerms) {
                itemMatching = [];
            }
        }

        item.data._relevance = me._calculateAccuracy(itemMatching);
        return (item.data._relevance > 0);
    },

    calculateRelevancy: function (item) {
        var me = this;

        var searchText = this.getSearchText();
        if (!searchText) {
            //magic number: this just means it has zero relevancy
            return 0;
        }

        // Check that there is more than the threshold characters before filtering
        var threshold = this.getMinLengthThreshold();
        if (searchText.length < threshold) {
            //magic number: this just means it has zero priority
            return 0;
        }
        var itemMatching = [];
        var match = null;

        var numberOfTerms = this.config.searchTerms.length;
        for (var i = 0; i < numberOfTerms; i++) {
            // only check the threshold for the first term, this will prevent the disappearing when you have text like 'test c'
            if (this.config.searchTerms[i].length >= threshold || i > 0) {
                if (this.getMatchAllValues()) {
                    match = this._itemHasMatch(item, this.config.searchTerms[i], i)
                }
                else {
                    match = this._itemHasMatch(item, this.config.searchTerms[i], i)
                }

                if (match.isMatch) {
                    itemMatching.push(match);
                }
            }
        }

        // If we are looking for all matching values ensure we have the same number of
        // values as we do terms
        if (this.getMatchAllValues()) {
            if (itemMatching.length != numberOfTerms) {
                itemMatching = [];
            }
        }

        item.data._relevance = me._calculateAccuracy(itemMatching);
        return item.data._relevance;
    },

    _calculateAccuracy: function (matchings) {
        if (matchings.length === 0) {
            return 0;
        }

        var relevance = 0;
        var matches = 0;

        matchings.forEach(function (matching) {

            if (matching.isExactMatch) {
                relevance += 20
            }

            if (matching.wordPosition) {
                relevance += 6
            }

            if (matching.charPosition) {
                relevance += 10
            }

            if (matching.soundsLike) {
                relevance += 3
            }
        })

        // if (matchings.length !== matches && this.config.matchAllValues){
        //     relevance = 0;
        // }

        return relevance;
    },

    /**
     * Check whether the search term is contained within any of the property values, match is case insensitive.
     * @private
     * @param {String/Number} propertyValue The value stored in the property
     * @param {String/Number} searchTerm The search term to find
     * @return {Boolean} whether the property contains the search term
     */
    _itemHasMatch: function (item, searchTerm, termIndex) {
        var me = this;

        var matchToReturn = me._createMatch();;

        Ext.Array.each(this.getSearchFields(), function (field, index) {
            var fieldValue = item.get(field.name);
            match = me._contains(fieldValue, searchTerm, termIndex);

            if (!match.isMatch && field.useSoundEx) {
                // There is no exact match in the search term lets see whether any of the words sound like the search term
                match = me.soundsLike(fieldValue, searchTerm, match);
            }

            matchToReturn.isMatch |= match.isMatch;
            matchToReturn.isExactMatch |= match.isExactMatch;
            matchToReturn.wordPosition |= match.wordPosition;
            matchToReturn.charPosition |= match.charPosition;
            matchToReturn.soundsLike |= match.soundsLike;
        });

        return matchToReturn;
    },

    _createMatch: function (config) {
        return Ext.apply({}, config || {}, this.matchingConfig);
    },

    /**
     * Check whether the search term is contained within the property value, match is case insensitive.
     *
     * For example a search term:
     *
     *
     * @private
     * @param {String/Number} propertyValue The value stored in the property
     * @param {String/Number} searchTerm The search term to find
     * @return {Number} The relevancy of the match, 1 is complete and 0 is no match
     */
    _contains: function (propertyValue, searchTerm, termIndex) {
        var me = this,
            match = me._createMatch();
        if (!propertyValue || Ext.isObject(propertyValue)) {
            return match;
        }

        propertyValue = propertyValue.toLowerCase();
        if (propertyValue === this.getSearchText()) {
            match.isExactMatch = true;
        }

        var valueParts = propertyValue.split(' ')
        for (var i = 0; i < valueParts.length; i++) {
            var pos = valueParts[i].indexOf(searchTerm);
            if (pos >= 0) {
                // A pattern match has been found in the value word
                match.isMatch = true;
                match.wordPosition = (termIndex === i);
                match.charPosition = (pos === 0);
            }
        }

        return match;
    },
    characterFilter: function (item) {
        var searchText = this.getSearchText();
        if (!searchText) {
            return true;
        }

        // Check that there is more than the threshold characters before filtering
        var threshold = 0;
        if (searchText.length < threshold) {
            return true;
        }

        var me = this, itemMatching = [],
            match = null;

        var numberOfTerms = this.config.searchTerms.length;
        for (var i = 0; i < numberOfTerms; i++) {
            // only check the threshold for the first term, this will prevent the disappearing when you have text like 'test c'
            if (this.config.searchTerms[i].length >= threshold || i > 0) {
                if (this.getMatchAllValues()) {
                    match = this._itemHasMatch(item, this.config.searchTerms[i], i)
                }
                else {
                    match = this._itemHasMatch(item, this.config.searchTerms[i], i)
                }

                if (match.isMatch) {
                    itemMatching.push(match);
                }
            }
        }

        // If we are looking for all matching values ensure we have the same number of
        // values as we do terms
        if (this.getMatchAllValues()) {
            if (itemMatching.length != numberOfTerms) {
                itemMatching = [];
            }
        }

        item.data._relevance = me._calculateAccuracy(itemMatching);
        return (item.data._relevance > 0);
    },



    privates: {
        /**
         * Check whether the value sounds like the search term by checking the sounded value of each of the words, all the words must sound alike for a true return.
         * @private
         * @param {String/Number} propertyValue The value stored in the property
         * @param {String/Number} searchTerm The search term to match
         * @return {Number} The relevancy of the match, 0.5 is complete and 0 is no match
         */
        soundsLike: function (propertyValue, searchTerm) {
            var me = this,
                match = me._createMatch();

            if (!propertyValue || Ext.isObject(propertyValue)) {
                return match;
            }

            var searchTermSoundEx = this.getSoundEx(searchTerm);
            var startSoundEx = this.getProminentPart(searchTermSoundEx);

            parts = propertyValue.split(' ');
            for (i = 0; i < parts.length; i++) {
                var wordSoundex = this.getSoundEx(parts[i]);
                if (wordSoundex === searchTermSoundEx) {
                    match.isMatch = true;
                    match.soundsLike = true;
                }

                // Check the soundex on part of the typed in word, as the user is typing
                // if only the first characters match we want to show the results
                if (Ext.String.startsWith(wordSoundex, startSoundEx)) {
                    match.isMatch = true;
                    match.soundsLike = true;
                }
            }
            return match;
        },

        /**
         * @private
         * Extract the prominent part of the soundex code, so it can be used with partial word matches
         * @param {String} soundex The soundex code i.e. X000
         * @return {String} The soundex code without the trailing 0's
         */
        getProminentPart: function (soundex) {
            var i = soundex.indexOf('0');
            if (i < 0) {
                return soundex;
            }

            return soundex.substring(0, i);
        },

        /**
         * Generate the soundex code for the word passed in. Words that sound similar will have the same code
         * @private
         * @param {String} value The value to generate the sound ex value for
         * @return {String} The soundex code for the value supplied
         */
        getSoundEx: function (value) {
            var charArray = value.toLowerCase().split(''),
                firstChar = charArray.shift(),
                soundCode = '',
                codes = {
                    a: '', e: '', i: '', o: '', u: '',
                    b: 1, f: 1, p: 1, v: 1,
                    c: 2, g: 2, j: 2, k: 2, q: 2, s: 2, x: 2, z: 2,
                    d: 3, t: 3,
                    l: 4,
                    m: 5, n: 5,
                    r: 6
                };

            soundCode = firstChar +
                charArray
                    .map(function (value, index, charArray) {
                        // Create a new array, maping the original characters onto the character weighting codes
                        return codes[value]
                    })
                    .filter(function (value, index, charArray) {
                        // Check that t
                        return ((index === 0) ? value !== codes[firstChar] : value !== charArray[index - 1]);
                    })
                    .join('');

            return (soundCode + '000').slice(0, 4).toUpperCase();
        }


    }

})
