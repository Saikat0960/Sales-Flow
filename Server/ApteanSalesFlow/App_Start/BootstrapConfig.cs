using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ApteanSalesFlow.App_Start
{
    public class BootstrapConfig
    {
        public string JsonData { get; set; }

        public BootstrapConfig()
        {
            JsonData = @"{
                 'resultCode': 0,
                 'errorMessage': '',
                 'errorMessageKey': '',
                 'errorDetailed': '',
                 'configuration': {
                    'settings': {
                        'allowServiceChange': false,
                        'authenticationType': 'cookie',
                        'canForcePasswordChange': false,
                        'canKeepMeSignedIn': true,
                        'canKeepMultipleUsersSignedIn': true,
                        'canRecoverPassword': false,
                        'defaultLanguage': 'en',
                        'enableSignOff': true,
	                    'showSimpleLogin': true,
                        'rememberExtraSettingsFields': true,
                        'rememberOption': false,
                        'rememberPassword': false,
                        'rememberUsername': true,
                        'b2cShowLogin': false,
      
                    },
   
                 'supportsDesktop': true,
                 'desktopUrl': '',
    
                 'branding': {
                    'companyName': 'Aptean'
            },
	             'availableEnvironments': [
           {
                    'id': '', 'name': '', 'languages': [
                      { 'name': 'English', 'key': 'en-us' }
           ]}
	],
    
    'authenticatedUserName': null
  }
        }";
        }
    }
}