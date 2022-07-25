/**
 * The main view model used within the ABP applications.
 *
 * This view model contains all the data used within ABP to run the container
 */
Ext.define('ABP.view.main.ABPMainModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.abpmainmodel',

    stores: {
        main_environmentStore: "ABPEnvironmentStore"
    },

    data: {
        bootstrapConf: {
            settings: {
                extraSettingsFields: null
            }
        },
        bootstrapped: false,
        conf: {},
        forcePasswordChange: {},
        prebootstrapExtraSettingsField: {},
        prebootstrapExtraSettingsFilled: [],
        configurationExtraInfo: [],
        loginExtraFieldsFilled: [],
        startingLaunchCarouselTab: null, // Tab or carousel view to show in login panel.
        allowAutoShowSelectUser: true, // When false then don't go to/back to the user select panel.
        loginAsUser: null, // Used to hold info about the user that will automatically have an authentication attempt.
        ieTested: false,
        startingTheme: '',
        offlineMode: false,
        isOffline: false,
        hidePreAuthMessage: false,
        servicesAttempted: false,
        b2cAuth: null,

        /**
        * @cfg {Object} [i18n]
        * Object containing key / value pairs used to make the UI responsive to internationalisation. The values will be replaced when a language other than en is selected.
        */
        i18n: {
            about_applications: 'Applications',
            about_info: 'ABP featured applications to offer you appropriate and effective solutions',
            about_build: 'Build: ',
            about_detail: 'more...',
            about_thirdparty: 'Third-Party Attributions',
            about_title: 'About',
            about_version: 'Version:',
            cardSearch_all: 'All',
            cardSearch_next: 'pull<br>to load<br>more<br>',
            cardSearch_noConfig: 'Global Search not configured.  Please consult Admin.',
            cardSearch_noResults: 'returned no results',
            cardSearch_previous: 'pull<br>to load<br>previous<br>',
            cardSearch_title: 'Global Search',
            error_cancel_btn: 'Cancel',
            error_connection_failed: 'Connection Failed',
            error_connection_instructions: 'Please enter a valid url, then hit save.',
            error_no_btn: 'No',
            error_ok_btn: 'OK',
            error_timedout: 'Your request has timed out.  Please try again.',
            error_yes_btn: 'Yes',
            error_download_failed: 'Download Failed', // NEW in 3.0
            error_upload_failed: 'Upload Failed', // NEW in 3.0
            error_download_failed_fileNotFound: 'Unable to download the request file as it can not be found on the server.', // NEW in 3.0

            help_all_products: 'All Products',
            help_allTypes: 'All Help Links',
            help_allProducts: 'All Products',
            help_blocked_Text: 'The browser has blocked the following link from being opened. Please click on the link below to open it.',
            help_blocked_Title: 'Show Link',
            help_text: "Our solutions, services, and support deliver the competitive edge your business needs to succeed today and tomorrow. With our wide array of comprehensive support services, we can quickly and accurately answer your technical questions and keep your business moving forward.",
            help_title: 'Help',
            loading_mask_message: '', // NEW in 3.0
            load_apply_config: 'Applying Configuration',
            load_authenticating: 'Authenticating',
            load_discovering: 'Discovering', // NEW in 3.1.1
            load_authCheck: 'Checking Authorization',
            load_extraAuthStep: '',
            load_load_config: 'Loading Configuration',
            load_log: 'Logging In',
            logger_clear: 'Clear Logs',
            logger_clear_confirmation: 'Are you sure you want to clear all logs?',
            logger_level: 'Level',
            logger_filter: 'Filter', // NEW in 3.0
            logger_nothingtodisplay: 'No log items to display.', // NEW in 3.0
            logger_title: 'Logs',
            login_all_fields: 'Please fill in all fields',
            login_back: 'Back',
            login_dockNavigation: 'Dock Navigation Menu',
            login_environment: 'Environment',
            login_error_authFailure: 'Authentication Failed',
            login_error_configFailure: 'Configuration Failed',
            login_error_languageFailure: 'Language Configuration Failed',
            login_error_passwordExpired: 'Password has expired. Please contact your system administrator.',
            login_extraValue: 'value not within acceptable range',
            login_forcepw_back: 'Back',
            login_forcepw_confirmPassword: 'Re-enter Password',
            login_forcepw_instructions: 'Please enter your new password before signing in.',
            login_forcepw_newPassword: 'New Password',
            login_forcepw_signIn: 'Sign In',
            login_forcepw_title: 'New Password',
            login_forceLogin: 'Force Login',
            login_forgotpassword: 'Forgot your password?',
            login_keepMeSignedIn: 'Keep me signed in',
            login_language: 'Language',
            login_password: 'Password',
            login_recoverInstructions: 'Please enter your email address and choose the environment to reset your password.',
            login_recoverTitle: 'Recover Password',
            login_recover_back: 'Back',
            login_recover_enterNewPassword: 'Please enter a new password and confirm by re-entering it.',
            login_recover_failed: 'Password recovery failed',
            login_recover_id: 'Email Address',
            login_recover_passwordsDoNotMatch: 'Passwords do not match. Try again.',
            login_recover_passwordChangeFailed: 'Password change failed',
            login_recover_send: 'Send',
            login_recover_invalid_email: 'Email Address should be in the format "user@example.com"',
            login_recover_submit_success: 'Please check your email for further instructions.',
            login_save: 'Save',
            login_settingsInstructions: 'Please enter your server address in the field below. If you do not have this information, please contact your IT administrator.',
            login_settings_invalidurl: 'Please enter a valid server url',
            login_settingsTitle: 'Settings',
            login_settingsUrlList: 'Select a URL', // New in 3.1
            login_login_header: 'Login', // New in 3.1
            login_signin_btn: 'Sign In',
            login_url: 'URL',
            login_previousUrls: 'Other URLs',
            login_organization: 'Organization', // New in 3.1
            login_email: 'Email',
            login_emailOrOrganisation: 'Email / Organisation',
            login_SSOHelp: 'Enter your Email or Organisation',
            login_username: 'Username',
            login_selectUserTitle: 'Select Account',
            login_selectUserInstructions: 'Select an account or sign in with another one.',
            login_selectUserAnotherUser: 'Use another account',
            navMenu_navigation: 'Navigation',
            navMenu_searchbar_emptytext: 'Search',
            navMenu_home: 'Home',
            navMenu_favorites: 'Favorites',
            navMenu_recent: 'Recent',
            navMenu_suggested: 'Suggested',
            navMenu_swapView: 'Swap to ',
            reload_warning: 'Reloading this page will cause you to sign out and lose any unsaved data.',
            search_searchText: 'Search in',
            search_advanced: 'Advanced',
            search_apply: 'Apply',
            search_resultsPlaceholder: 'Search for items, data, and other collateral here.',
            search_type: 'Search Type',
            search_toggle: 'Toggle Search',
            selectfield_mobile_done: 'Done',
            sessionMenu_about: 'About',
            sessionMenu_calendar: 'Calendar',
            sessionMenu_chart: 'Charts',
            sessionMenu_clipboard: 'Clipboard',
            sessionMenu_environment: 'Environment: ',
            sessionMenu_help: 'Help',
            sessionMenu_languages: 'Language',
            sessionMenu_logger: 'Log',
            sessionMenu_search: 'Search',
            sessionMenu_settings: 'Settings',
            sessionMenu_url: 'URLs',
            sessionMenu_signoff: 'Sign Off',
            sessionMenu_theme: 'Theme',
            sessionMenu_time: 'Session Time: ',
            sessionMenu_user: 'User: ',
            sessionMenu_editPreferences: 'Edit Preferences',  // New in 3.1
            settingsCanvas_close: 'Close',
            settings_internalLinks: 'Internal Links',
            settings_languages: 'Languages',
            settings_userInfo: 'User Information',
            signout_message: 'Signing out...',
            warn_ie9: 'Url must have the same hostname as webpage when using Internet Explorer 9.',
            inactive_timeout: 'You are about to be logged out due to inactivity: ',
            timeout_title: 'Session Expiration Warning',
            session_timeout: 'Session expired due to inactivity',
            session_signoff: 'Sign Out',
            session_retain: 'Keep me signed in',

            // Action Center
            ac_widget_picker_default_group_title: 'Widgets',
            ac_switch_dashboard: 'Switch Dashboard',

            // New common resource strings
            button_close: 'Close',
            button_OK: 'OK',
            button_save: 'Save',
            button_cancel: 'Cancel',
            button_yes: 'Yes',
            button_no: 'No',
            button_clear: 'Clear',
            button_done: 'Done',
            button_search: 'Search',
            button_back: 'Back',
            button_next: 'Next',  // New in 3.1.1
            button_continue: 'Continue',
            button_delete: 'Delete',
            button_favorite: 'Favorite',
            button_unfavorite: 'Unfavorite',
            button_nextTheme: 'Next Theme',
            button_prevTheme: 'Previous Theme',
            sessionMenu_manageFavorites: 'Manage Favorites',
            favorites_title: 'Favorites',
            favorites_expandAll: 'Expand All',
            favorites_collapseAll: 'Collapse All',
            favorites_newGroup: 'New Group',
            favorites_newGroup_emptyText: 'Create New Group',
            favorites_toast_deleteEmptyGroups: 'Removed empty favorite groups',
            favorites_confirmDeleteGroupMsg: 'Are you sure you want to delete this group and all of its contents?',
            favorites_confirmDeleteGroupTitle: 'Delete this favorite group?',
            favorites_editPanel_title: 'Edit Favorite',
            favorites_editPanel_name: 'Name',
            favorites_editPanel_source: 'Source',
            favorites_editPanel_moveToGroup: 'Move to group',
            favorites_editPanel_noGroup: '< No Group >',
            favorites_manager_emptyGroup: 'This group is empty.',

            // WCAG STRINGS
            toolbar_toggleNavigation: 'Toggle Navigation',
            toolbar_search_navigation: 'Search Navigation',
            toolbar_jumpTo: 'Jump to',   // New in 3.1
            toolbar_placeinapplication: 'Place in application', // New in 3.1
            abp_navigation_menu: 'Navigation Menu', // New in 3.1
            abp_main_content: 'Main Content', // New in 3.1

            // Headlines
            sessionMenu_manageHeadlines: 'Manage Headlines',
            headlines_title: 'Headlines',
            headlines_new: 'New Headline',
            headlines_column_message: 'Message',
            headlines_label_message: 'Message',
            headlines_column_message_key: 'Message key',
            headlines_label_message_key: 'Message key',
            headlines_column_action: 'Action text',
            headlines_label_action: 'Action text',
            headlines_column_action_key: 'Action key',
            headlines_label_action_key: 'Action key',
            headlines_column_starttime: 'Start time',
            headlines_label_starttime: 'Start time',
            headlines_column_endtime: 'End time',
            headlines_label_endtime: 'End time',
            headlines_column_priority: 'Priority',
            headlines_label_priority: 'Priority',
            headlines_priority_info: 'Info',
            headlines_priority_warning: 'Warning',
            headlines_priority_alert: 'Alert',
            headlines_column_published: 'Published',
            headlines_label_published: 'Published',
            headlines_unsaved_changes: 'There are headlines which have not been saved. Close anyway?',
            headlines_delete: 'Do you wish to delete this headline?',
            // Default validation error message strings
            field_validation_error_blanktext: 'This field is required',
            field_validation_error_maxlengthtext: 'The maximum length for this field is {0}',
            field_validation_error_minlengthtext: 'The minimum length for this field is {0}',

            // Notifications/Alerts
            abp_notifications_button_tooltip: 'Notifications',
            abp_notifications_rightpane_title: 'Notifications',
            abp_notifications_label_no_notifications: 'No notifications.',
            abp_notifications_label_no_new_notifications: 'No new notifications.',
            abp_notifications_label_show_history: 'Show History',
            abp_notifications_label_hide_history: 'Hide History',
            abp_notifications_label_see_history: 'See History',
            abp_notifications_label_read: 'Read',
            abp_notifications_label_marked_as_read: 'Marked as Read',
            abp_notifications_label_marked_as_unread: 'Marked as Unread',
            abp_notifications_label_removed: 'Notification Removed',

            // Relative time strings
            abp_time_prefix_ago: '',
            abp_time_suffix_ago: 'ago',
            abp_time_prefix_from_now: '',
            abp_time_suffix_from_now: 'from now',
            abp_time_seconds: 'less than a minute',
            abp_time_minute: 'about a minute',
            abp_time_minutes: 'about {0} minutes',
            abp_time_hour: 'about an hour',
            abp_time_hours: 'about {0} hours',
            abp_time_day: 'about a day',
            abp_time_days: 'about {0} days',
            abp_time_month: 'about a month',
            abp_time_months: 'about {0} months',
            abp_time_year: 'about a year',
            abp_time_years: 'about {0} years',

            abp_short_time_prefix_ago: '',
            abp_short_time_suffix_ago: 'ago',
            abp_short_time_prefix_from_now: '',
            abp_short_time_suffix_from_now: 'from now',
            abp_short_time_seconds: 'few seconds',
            abp_short_time_minute: '1 min',
            abp_short_time_minutes: '{0} mins',
            abp_short_time_hour: '1 hour',
            abp_short_time_hours: '{0} hours',
            abp_short_time_day: '1 day',
            abp_short_time_days: '{0} days',
            abp_short_time_month: '1 month',
            abp_short_time_months: '{0} months',
            abp_short_time_year: '1 year',
            abp_short_time_years: '{0} years',

            // Offline mode strings
            login_offline_signin_btn: 'Offline Sign In',
            offline_login_instructions: 'Please enter an offline password. Use this password to log in while offline. This value is required for offline mode and should differ from your normal login password.',
            offline_login_password: 'Offline Password',
            offline_login_confirmpassword: 'Confirm Offline Password',
            offline_password_prompt: 'Enter password',
            offline_passwords_dont_match: 'Passwords do not match',
            offline_login_error_noOfflinePassword: 'Authentication Failed. No offline password exists for this user and environment.',
            sessionMenu_setOfflinePassword: 'Set Offline Password',
            button_switch_online_mode: 'Go Online',
            button_switch_offline_mode: 'Go Offline',
            prompt_gooffline_text: 'Go Offline? Any unsaved data will be lost.',
            prompt_gooffline_title: 'Switch to offline',
            prompt_goonline_text: 'Go Online? Any unsaved data will be lost.',
            prompt_goonline_title: 'Switch to online.',
            offline_passwordPrompt_failure: 'Authentication failed, could not go online.',
            offline_promptpassword_title: 'Enter password to go online',
            offline_noconnection: 'Cannot go online, no connection to server.',
            offline_headline_message: 'No connection to the Internet.',

            // Common util strings
            abp_filter_empty_text: 'Filter...', // NEW in 3.0

            // Sencha specific strings
            s_dataValidator_bound_emptyMessage: 'Must be present',
            s_dataValidator_bound_minOnlyMessage: 'Value must be greater than {0}',
            s_dataValidator_bound_maxOnlyMessage: 'Value must be less than {0}',
            s_dataValidator_bound_bothMessage: 'Value must be between {0} and {1}',
            s_dataValidator_email_message: 'Is not a valid email address',
            s_dataValidator_exclusion_message: 'Is a value that has been excluded',
            s_dataValidator_ipaddress_message: 'Is not a valid IP address',
            s_dataValidator_format_message: 'Is in the wrong format',
            s_dataValidator_inclusion_message: 'Is not in the list of acceptable values',
            s_dataValidator_length_minOnlyMessage: 'Length must be at least {0}',
            s_dataValidator_length_maxOnlyMessage: 'Length must be no more than {0}',
            s_dataValidator_length_bothMessage: 'Length must be between {0} and {1}',
            s_dataValidator_number_message: 'Is not a valid number',
            s_dataValidator_presence_message: 'Must be present',
            s_dataValidator_range_minOnlyMessage: 'Must be must be at least {0}',
            s_dataValidator_range_maxOnlyMessage: 'Must be no more than than {0}',
            s_dataValidator_range_bothMessage: 'Must be between {0} and {1}',
            s_dataValidator_range_nanMessage: 'Must be numeric',
            s_grid_plugin_dragText: '{0} selected row{1}',
            s_abstractView_loading: 'Loading...',
            s_tab_closeText: 'Close',
            s_field_invalidText: 'The value in this field is invalid',
            s_abstractView_loadingText: 'Loading...',
            s_picker_date_todayText: 'Today',
            s_picker_date_nowText: 'Now',
            s_picker_date_minText: 'This date is before the minimum date',
            s_picker_date_maxText: 'This date is after the maximum date',
            s_picker_date_disabledDaysText: 'Disabled',
            s_picker_date_disabledDatesText: 'Disabled',
            s_picker_date_nextText: 'Next Month (Control+Right)',
            s_picker_date_prevText: 'Previous Month (Control+Left)',
            s_picker_date_monthYearText: 'Choose a month (Control+Up/Down to move years)',
            s_picker_date_todayTip: '{0} (Spacebar)',
            s_picker_month_okText: '&#160;OK&#160;',
            s_picker_month_cancelText: 'Cancel',
            s_toolbar_paging_beforePageText: 'Page',
            s_toolbar_paging_afterPageText: 'of {0}',
            s_toolbar_paging_firstText: 'First Page',
            s_toolbar_paging_prevText: 'Previous Page',
            s_toolbar_paging_nextText: 'Next Page',
            s_toolbar_paging_lastText: 'Last Page',
            s_toolbar_paging_refreshText: 'Refresh',
            s_toolbar_paging_displayMsg: 'Displaying {0} - {1} of {2}',
            s_toolbar_paging_emptyMsg: 'No data to display',
            s_form_basic_waitTitle: 'Please Wait...',
            s_form_field_base_invalidText: 'The value in this field is invalid',
            s_field_text_minLengthText: 'The minimum length for this field is {0}',
            s_field_text_maxLengthText: 'The maximum length for this field is {0}',
            s_field_text_blankText: 'This field is required',
            s_field_text_regexText: '',
            s_field_number_minText: 'The minimum value for this field is {0}',
            s_field_number_maxText: 'The maximum value for this field is {0}',
            s_field_number_nanText: '{0} is not a valid number',
            s_field_date_disabledDaysText: 'Disabled',
            s_field_date_disabledDatesText: 'Disabled',
            s_field_date_minText: 'The date in this field must be after {0}',
            s_field_date_maxText: 'The date in this field must be before {0}',
            s_field_date_invalidText: '{0} is not a valid date - it must be in the format {1}',
            s_field_combo_defaultListConfig_loadingText: 'Loading...',
            s_field_vTypes_emailText: 'This field should be an e-mail address in the format "user@example.com"',
            s_field_vTypes_urlText: 'This field should be a URL in the format "http:/" + "/www.example.com"',
            s_field_vTypes_alphaText: 'This field should only contain letters and _',
            s_field_vTypes_alphanumText: 'This field should only contain letters, numbers and _',
            s_field_htmlEditor_createLinkText: 'Please enter the URL for the link:',
            s_field_htmlEditor_buttonTips_bold_title: 'Bold (Ctrl+B)',
            s_field_htmlEditor_buttonTips_bold_text: 'Make the selected text bold.',
            s_field_htmlEditor_buttonTips_italic_title: 'Italic (Ctrl+I)',
            s_field_htmlEditor_buttonTips_italic_text: 'Make the selected text italic.',
            s_field_htmlEditor_buttonTips_underline_title: 'Underline (Ctrl+U)',
            s_field_htmlEditor_buttonTips_underline_text: 'Underline the selected text.',
            s_field_htmlEditor_buttonTips_increasefontsize_title: 'Grow Text',
            s_field_htmlEditor_buttonTips_increasefontsize_text: 'Increase the font size.',
            s_field_htmlEditor_buttonTips_decreasefontsize_title: 'Shrink Text',
            s_field_htmlEditor_buttonTips_decreasefontsize_text: 'Decrease the font size.',
            s_field_htmlEditor_buttonTips_backcolor_title: 'Text Highlight Color',
            s_field_htmlEditor_buttonTips_backcolor_text: 'Change the background color of the selected text.',
            s_field_htmlEditor_buttonTips_forecolor_title: 'Font Color',
            s_field_htmlEditor_buttonTips_forecolor_text: 'Change the color of the selected text.',
            s_field_htmlEditor_buttonTips_justifyleft_title: 'Align Text Left',
            s_field_htmlEditor_buttonTips_justifyleft_text: 'Align text to the left.',
            s_field_htmlEditor_buttonTips_justifycenter_title: 'Center Text',
            s_field_htmlEditor_buttonTips_justifycenter_text: 'Center text in the editor.',
            s_field_htmlEditor_buttonTips_justifyright_title: 'Align Text Right',
            s_field_htmlEditor_buttonTips_justifyright_text: 'Align text to the right.',
            s_field_htmlEditor_buttonTips_insertunorderedlist_title: 'Bullet List',
            s_field_htmlEditor_buttonTips_insertunorderedlist_text: 'Start a bulleted list.',
            s_field_htmlEditor_buttonTips_insertorderedlist_title: 'Numbered List',
            s_field_htmlEditor_buttonTips_insertorderedlist_text: 'Start a numbered list.',
            s_field_htmlEditor_buttonTips_createlink_title: 'Hyperlink',
            s_field_htmlEditor_buttonTips_createlink_text: 'Make the selected text a hyperlink.',
            s_field_htmlEditor_buttonTips_sourceedit_title: 'Source Edit',
            s_field_htmlEditor_buttonTips_sourceedit_text: 'Switch to source editing mode.',
            s_grid_header_sortAscText: 'Sort Ascending',
            s_grid_header_sortDescText: 'Sort Descending',
            s_grid_header_lockText: 'Lock',
            s_grid_header_unlockText: 'Unlock',
            s_grid_header_columnsText: 'Columns',
            s_grid_groupingFeature_groupByText: 'Group by this field',
            s_grid_groupingFeature_showGroupsText: 'Show in Groups',
            s_grid_propertyColumnModel_nameText: 'Name',
            s_grid_propertyColumnModel_valueText: 'Value',
            s_grid_propertyColumnModel_trueText: 'true',
            s_grid_propertyColumnModel_falseText: 'false',
            s_grid_booleanColumn_trueText: 'true',
            s_grid_booleanColumn_falseText: 'false',
            s_grid_booleanColumn_undefinedText: '&#160;',
            s_field_time_minText: 'The time in this field must be equal to or after {0}',
            s_field_time_maxText: 'The time in this field must be equal to or before {0}',
            s_field_time_invalidText: '{0} is not a valid time',
            s_field_checkboxGroup_blankText: 'You must select at least one item in this group',
            s_field_radioGroup_blankText: 'You must select one item in this group',
            s_window_messageBox_buttonText_ok: 'OK',
            s_window_messageBox_buttonText_cancel: 'Cancel',
            s_window_messageBox_buttonText_yes: 'Yes',
            s_window_messageBox_buttonText_no: 'No',
            s_grid_filters_menuFilterText: 'Filters',
            s_grid_filters_boolean_yesText: 'Yes',
            s_grid_filters_boolean_noText: 'No',
            s_grid_filters_date_fields_lt: 'Before',
            s_grid_filters_date_fields_gt: 'After',
            s_grid_filters_date_fields_eq: 'On',
            s_grid_filters_list_loadingText: 'Loading...',
            s_grid_filters_number_emptyText: 'Enter Number...',
            s_grid_filters_string_emptyText: 'Enter Filter Text...',
            s_multiSelectorSearch_searchText: 'Search...',
            s_multiSelector_emptyText: 'Nothing selected',
            s_multiSelector_removeRowTip: 'Remove this item',
            s_multiSelector_addToolText: 'Search for items to add',

            //Aria Label helpers
            aria_tree_level: " level ", // New in 3.1
            aria_badge_count: " count ", // New in 3.1
            aria_badge_updated_count: " updated count " // New in 3.1
        },

        formatting: {
            monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            decimalSeparator: '.',
            thousandSeparator: ',',
            currencySign: '$',
            dateFormat: 'm-d-Y'
        },

        injectedSettingsFields: null,

        /**
        * @cfg {Boolean} [keepMeSignedIn=false]
        * Whether the user has selected to be signed in automatically the next time the application is loaded.
        */
        keepMeSignedIn: false,

        loginTime: '',
        smallScreenThreshold: 640,
        menuDocked: false,
        name: 'ABP',

        /**
        * @cfg {Object} [selected]
        * the currently selected environment and language
        */
        selected: {
            environment: '',
            language: ''
        },
        signout: false,
        signoutReason: '',
        smallScreen: false,

        /**
        * @cfg {Object} [selected]
        * The URL to the current user's profile picture
        */
        profilePhoto: ''
    },

    /**
     * Check whether a string exists within the interationalisation strings, if it does that string will be returned otherwise the original string is returned
     *
     * @param {String} inString the string to check
     * @param {Boolean} disableWarning true to turn off logger warning.  Use if string is acceptable to not be localized (returned from server).
     * @returns The translated string or if it does not exist the original
     */
    checkI18n: function (inString, disableWarning) {
        var me = this;
        var outString = inString;
        if (me.config.data.i18n[inString] != undefined) {
            outString = me.config.data.i18n[inString];
        }
        else {
            if (!disableWarning) {
                ABP.util.Logger.logInfo("i18n: '" + inString + "' was not found.");
            }
        }
        return outString;
    },

    /**
     * Update the i18n view model object. Process an object in the form:
     *     [
     *         { key: 'language_string_nameA', value: 'language string value' },
     *         { key: 'language_string_nameB', value: 'another language string value' },
     *         // etc.
     *     ]
     * Keys are either updated or added.
     * @param {Object[]} strings Array of objects will key and value properties.
     */
    i18nSet: function (strings) {
        var me = this;
        var i;

        if (!strings) {
            return;
        }

        var i18n = me.get('i18n');
        if (strings instanceof Array && strings.length > 0) {
            for (i = 0; i < strings.length; ++i) {
                if (strings[i] && strings[i].key && strings[i].value) {
                    i18n[strings[i].key] = strings[i].value;
                }
            }
        }

        me.set('i18n', i18n);
    },

    /**
     * Initialize the i18n view model object. Process an object in the form:
     *    {
     *        language_string_nameA: 'language string value',
     *        language_string_nameB: 'another language string value',
     *        // etc.
     *    }
     * @param {Object} strings A object whose properties are names of language strings and values are the user strings.
     */
    i18nSetDefaults: function (strings) {
        var me = this;
        var st;

        if (!strings) {
            return;
        }

        var i18n = me.get('i18n');
        if (strings instanceof Object) {
            for (st in strings) {
                if (strings.hasOwnProperty(st)) {
                    if (!i18n[st]) {
                        i18n[st] = strings[st];
                    }
                }
            }
        }

        me.set('i18n', i18n);
    }
});
