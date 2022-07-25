using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ApteanSalesFlow.App_Start
{
    public class HomeConfig
    {
        public string JsonData { get; set; }

        public HomeConfig()
        {
            JsonData = @"{
              'resultCode': 0,
              'errorMessage': '',
              'errorMessageKey': '',
              'errorDetailed': '',
              'configuration': {
                        
                            'settings': {
                                'userConfig': {
                                    'displayName': '',
                    'photo': null,
                    'enableEditProfile': false
                                },
                  'appSettings': [
                    {
                      'appId': '',
                      'event': '',
                      'options': [
                        {
                          'checked': true,
                          'title': '',
                          'value': '',
                          'name': ''
                        }
                      ],
                      'title': '',
                      'type': ''
                    }
                  ],
                  'appToolbarTitle': null,
                  'autoHideMenu': true,
                  'defaultSearch': 'name',
                  'defaultTheme': 'vivid-blue',
                  'enableMenuFavorites': false,
                  'enableMenuPeelOff': false,
                  'enableMenuRecent': false,
                  'enableMenuSuggested': false,
                  'enableNavSearch': true,
                  'enableSearch': true,
                  'enableWideMenu': false,
                  'favorites': {
                                    'depthLimit': 0,
                    'hideIcons': false,
                    'allowItemRename': true,
                    'favoriteItems': [
                      {
                                        'activateApp': true,
                        'appId': '',
                        'children': [],
                        'enabled': true,
                        'event': '',
                        'eventArgs': [],
                        'hash': '',
                        'icon': '',
                        'itemHref': '',
                        'label': '',
                        'labelKey': '',
                        'type': 'event'
                      }
                    ]
                  },
                  'recents': [
                    {
                                    'activateApp': true,
                      'appId': '',
                      'children': [],
                      'enabled': true,
                      'event': '',
                      'eventArgs': [],
                      'hash': '',
                      'icon': '',
                      'itemHref': '',
                      'label': '',
                      'labelKey': '',
                      'type': 'event'
                    }
                  ],
                  'hideTreeNavigation': true,
                  'toolbarTitleShowBranding': true,
                  'loadPage': {
                                    'appId': '',
                    'event': '',
                    'eventArgs': ''
                  },
                  'mainMenuModernFocusFirstOption': false,
                  'mainMenuNavSearchDisableSoundex': false,
                  'mainMenuNavSearchDisableRelevance': false,
                  'mainMenuNavSearchDuplicateFields': '',
                  'mainMenuNavSearchResultsMax': 20,
                  'mainMenuRecentMaxShown': 5,
                  'mainMenuSingleExpand': true,
                  'mainMenuSuggestedAutoExpand': true,
                  'mainMenuStartFavoritesOpen': true,
                  'mainMenuLazyFill': true,
                  'navSearchShowPath': true,
                  'rememberMenuState': true,
                  'persistSelectedTheme': true,
                  'inactiveTimeout': 0,
                  'inactiveWarningTime': 0,
                  'rightPane': [
                    {
                                    'name': ''
                    }
                  ],
                  'notifications': {
                                    'enabled': true,
                    'maxHistory': 100,
                    'clearBadgeOnActivate': false
                  },
                  'searchInfo': [
                    {
                                    'appId': '',
                      'event': '',
                      'icon': '',
                      'minLength': 0,
                      'minLengthError': '',
                      'name': ''
                    }
                  ],
                  'settingsPage': {
                                    'enableAbout': true,
                    'enableHeadlinesManager': false,
                    'enableHelp': true,
                    'enableLanguages': true,
                    'enableLoggerView': true,
                    'enableSignOff': true,
                    'enableThemeChange': true,
                    'enableUser': true,
                    'showSessionTimer': true,
                    'showEnvironment': true
                  },
                  'startMenuHidden': true,
                  'disableNavMenu': false,
                  'userClick': {
                                    'appId': '',
                    'event': '',
                    'eventArgs': ''
                  }
                            },
                'analytics': {
                                'analyticsDefaultSheet': 'ProcessAnalytics.qvw?PA01',
                  'analyticsQVW': [ 'ProcessAnalytics.qvw' ],
                  'analyticsQVURL': 'http://10.183.133.112'
                },
                'cardSearch': {
                                'cardsearchUrl': 'api/cardsearch',
                  'gsTimeout': 30000,
                  'showFavorites': false,
                  'types': [
                    {
                                    'color': '#000000',
                      'icon': 'fa fa-star',
                      'name': 'Accounts',
                      'notDisplayed': [
                        'field1',
                        'field2'
                      ],
                      'rows': [
                        {
                                        'field': 'nameField',
                          'title': 'Name'
                        }
                      ],
                      'titlefield': 'nameField',
                      'type': 'Account'
                    }
                  ],
                  'shortcuts': [
                    {
                                    'key': 'ALT+I',
                      'activateApp': true,
                      'appId': '',
                      'event': '',
                      'eventArgs': ''
                    }
                  ],
                  'headlines': [
                    {
                                    'message': 'Info Message',
                      'uniqueId': 'e28a0643-85d9-4cc7-8b50-a5162a223a70'
                    }
                  ],
                  'packages': [
                    {
                                    'id': '',
                      'url': ''
                    }
                  ],
                  'treeMenu': [
                    {
                                    'activateApp': true,
                      'appId': '',
                      'children': [],
                      'contextMenu': false,
                      'enabled': true,
                      'event': '',
                      'eventArgs': '',
                      'hash': '',
                      'icon': '',
                      'itemHref': '',
                      'label': '',
                      'labelKey': '',
                      'tooltip': '',
                      'tooltipKey': '',
                      'type': 'event',
                      'uniqueId': '',
                      'shorthand': ''
                    }
                  ],
                  'sessionMenu': [
                    {
                                    'activateApp': true,
                      'appId': '',
                      'contextMenu': false,
                      'enabled': true,
                      'event': '',
                      'eventArgs': '',
                      'icon': '',
                      'label': '',
                      'labelKey': '',
                      'tooltip': '',
                      'tooltipKey': '',
                      'type': 'event',
                      'uniqueId': ''
                    }
                  ],
                  'toolbarMenu': [
                    {
                      'activateApp': true,
                      'appId': '',
                      'contextMenu': false,
                      'enabled': true,
                      'event': '',
                      'eventArgs': '',
                      'icon': '',
                      'label': '',
                      'labelKey': '',
                      'side': 'right',
                      'tooltip': '',
                      'tooltipKey': '',
                      'type': 'event',
                      'uniqueId': ''
                    }
                  ],
                  'toolbarTitleImageUrl': '',
                  'enabledPlugins': [
                    {
                                    'pluginId': '',
                      'pluginUrl': '',
                      'serviceUrl': ''
                    }
                  ],
                  'availableWidgets': [
                    {
                      'pluginId': '',
                      'templateId': '',
                      'templateName': '',
                      'templateNameKey': '',
                      'icon': ''
                    }
                  ],
                  'languageResources': [
                    {
                                    'key': 'sessionMenu_about',
                      'value': 'About'
                    },
                    {
                                    'key': 'sessionMenu_help',
                      'value': 'Help'
                    },
                    {
                                    'key': 'sessionMenu_signoff',
                      'value': 'Sign Off'
                    },
                    {
                                    'key': 'sessionMenu_languages',
                      'value': 'Languages'
                    },
                    {
                                    'key': 'languages_en',
                      'value': 'English'
                    },
                    {
                                    'key': 'languages_fr',
                      'value': 'French'
                    }
                  ]
                }
            }
        }";
        }
    }
}