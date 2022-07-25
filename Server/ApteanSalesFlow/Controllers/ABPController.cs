using System;
using System.Web.Http;
using ApteanSalesFlow.Models;
using System.Net.Http;
using System.Net;
using System.Linq;
using Aptean.ABP.Configuration;
using Aptean.ABP.Configuration.Responses;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System.Collections.Generic;
using Aptean.ABP.Configuration.Container.Settings;
using System.Net.Http.Headers;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using ApteanSalesFlow.App_Start;

namespace ApteanSalesFlow.Controllers
{
    public class ABPController : ApiController
    {
        [HttpGet]
        public IHttpActionResult Bootstrap([FromUri] BootstrapModel bootstrapModel)
        {
            AbpBootstrapResponse abpBootstrap = new AbpBootstrapResponse();
            abpBootstrap.ResultCode = 0;
            abpBootstrap.ErrorMessage = "";
            abpBootstrap.ErrorMessageKey = "";
            abpBootstrap.ErrorDetailed = "";
            abpBootstrap.Configuration.Settings.AllowServiceChange = false;
            abpBootstrap.Configuration.Settings.AuthenticationType = "cookie";
            abpBootstrap.Configuration.Settings.CanForcePasswordChange = false;
            abpBootstrap.Configuration.Settings.CanKeepMeSignedIn = true;
            abpBootstrap.Configuration.Settings.CanKeepMultipleUsersSignedIn = true;
            abpBootstrap.Configuration.Settings.CanRecoverPassword = false;
            abpBootstrap.Configuration.Settings.DefaultLanguage = "en";
            abpBootstrap.Configuration.Settings.ExtraLoginFields = null;
            abpBootstrap.Configuration.Settings.EnableSignOff = true;
            abpBootstrap.Configuration.Settings.ShowSimpleLogin = true;
            abpBootstrap.Configuration.Settings.RememberExtraSettingsFields = true;
            abpBootstrap.Configuration.Settings.RememberOption = true;
            abpBootstrap.Configuration.Settings.RememberPassword = true;
            abpBootstrap.Configuration.Settings.RememberUsername = true;
            abpBootstrap.Configuration.SupportsDesktop = true;
            Language language = new Language("en-us", "English");
            Languages languages = new Languages();
            languages.Add(language);
            Aptean.ABP.Configuration.Environment environment = new Aptean.ABP.Configuration.Environment(new Guid(), "");
            //environment.Languages = languages;
            abpBootstrap.Configuration.AvailableEnvironments.Add(environment);
            abpBootstrap.Configuration.AuthenticatedUserName = null;
            abpBootstrap.Configuration.DefaultEnvironment = "en";
            //return Ok(CamelCaseJsonReturn(abpBootstrap));
            var settings = new JsonSerializerSettings();
            settings.ContractResolver = new CamelCasePropertyNamesContractResolver();
            settings.Formatting = Formatting.Indented;
            settings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
            return Json(abpBootstrap, settings);
        }

        [HttpGet]
        public new IHttpActionResult Configuration([FromUri] ConfigurationModel configurationModel)
        {
            AbpConfigurationResponse abpConfigurationResponse = new AbpConfigurationResponse();
            abpConfigurationResponse.ResultCode = 0;
            abpConfigurationResponse.ErrorMessage = "";
            abpConfigurationResponse.ErrorMessageKey = "";
            abpConfigurationResponse.ErrorDetailed = "";
            abpConfigurationResponse.Configuration.Settings.UserConfig.DisplayName = "";

            SettingsOption settingsOption = new SettingsOption(true, "", "", "", "");
            SettingsControl settingsControl = new SettingsControl("", "", "", "", new List<SettingsOption>() { settingsOption });
            abpConfigurationResponse.Configuration.Settings.AppSettings = new List<SettingsControl>() { settingsControl };

            abpConfigurationResponse.Configuration.Settings.AutoHideMenu = false;
            abpConfigurationResponse.Configuration.Settings.DefaultSearch = "name";
            abpConfigurationResponse.Configuration.Settings.DefaultTheme = "vivid-blue";
            abpConfigurationResponse.Configuration.Settings.EnableMenuFavorites = false;
            abpConfigurationResponse.Configuration.Settings.EnableMenuPeelOff = true;
            abpConfigurationResponse.Configuration.Settings.EnableMenuRecent = true;
            abpConfigurationResponse.Configuration.Settings.EnableMenuSuggested = true;
            abpConfigurationResponse.Configuration.Settings.EnableNavSearch = true;
            abpConfigurationResponse.Configuration.Settings.EnableSearch = false;
            abpConfigurationResponse.Configuration.Settings.EnableWideMenu = false;

            abpConfigurationResponse.Configuration.Settings.HideTreeNavigation = true;
            abpConfigurationResponse.Configuration.Settings.LoadPage.AppId = "ApteanSalesFlowPackage";
            abpConfigurationResponse.Configuration.Settings.LoadPage.Event = "HomeScreen";
            abpConfigurationResponse.Configuration.Settings.LoadPage.EventArgs = "";
            abpConfigurationResponse.Configuration.Settings.MainMenuNavSearchDisableSoundex = false;
            abpConfigurationResponse.Configuration.Settings.MainMenuNavSearchDisableRelevance = false;
            abpConfigurationResponse.Configuration.Settings.MainMenuNavSearchDuplicateFields = "";
            abpConfigurationResponse.Configuration.Settings.MainMenuNavSearchResultsMax = 20;
            abpConfigurationResponse.Configuration.Settings.MainMenuRecentMaxShown = 5;
            abpConfigurationResponse.Configuration.Settings.MainMenuSingleExpand = true;
            abpConfigurationResponse.Configuration.Settings.MainMenuSuggestedAutoExpand = true;
            abpConfigurationResponse.Configuration.Settings.MainMenuStartFavoritesOpen = false;
            abpConfigurationResponse.Configuration.Settings.NavSearchShowPath = true;
            abpConfigurationResponse.Configuration.Settings.RememberMenuState = true;
            abpConfigurationResponse.Configuration.Settings.PersistSelectedTheme = true;
            abpConfigurationResponse.Configuration.Settings.InactiveTimeout = 0;
            abpConfigurationResponse.Configuration.Settings.InactiveWarningTime = 0;
            UIComponent ui = new UIComponent();
            ui.Name = "";
            abpConfigurationResponse.Configuration.Settings.RightPane.Add(ui);
            abpConfigurationResponse.Configuration.Settings.Notifications.Enabled = false;
            abpConfigurationResponse.Configuration.Settings.Notifications.MaxHistory = 100;
            abpConfigurationResponse.Configuration.Settings.Notifications.ClearBadgeOnActivate = false;
            SearchProvider searchProvider = new SearchProvider();
            searchProvider.AppId = "";
            searchProvider.Event = "";
            searchProvider.Icon = "";
            searchProvider.MinLengthError = "";
            searchProvider.MinLength = 0;
            searchProvider.Name = "";
            abpConfigurationResponse.Configuration.Settings.SearchInfo.Add(searchProvider);

            abpConfigurationResponse.Configuration.Settings.SettingsPage.EnableAbout = true;
            abpConfigurationResponse.Configuration.Settings.SettingsPage.EnableHeadlinesManager = false;
            abpConfigurationResponse.Configuration.Settings.SettingsPage.EnableHelp = true;
            abpConfigurationResponse.Configuration.Settings.SettingsPage.EnableLanguages = true;
            abpConfigurationResponse.Configuration.Settings.SettingsPage.EnableLoggerView = false;
            abpConfigurationResponse.Configuration.Settings.SettingsPage.EnableSignOff = true;
            abpConfigurationResponse.Configuration.Settings.SettingsPage.EnableThemeChange = true;
            abpConfigurationResponse.Configuration.Settings.SettingsPage.EnableUser = true;
            abpConfigurationResponse.Configuration.Settings.SettingsPage.ShowSessionTimer = false;
            abpConfigurationResponse.Configuration.Settings.SettingsPage.ShowEnvironment = false;

            abpConfigurationResponse.Configuration.Settings.StartMenuHidden = true;
            SenchaEvent senchaEvent = new SenchaEvent("", "", "");
            abpConfigurationResponse.Configuration.Settings.UserClick = senchaEvent;

            abpConfigurationResponse.Configuration.Analytics.AnalyticsDefaultSheet = "ProcessAnalytics.qvw?PA01";
            abpConfigurationResponse.Configuration.Analytics.AnalyticsQVURL = "http://10.183.133.112";
            List<string> analyticsQVM = new List<string>() { "ProcessAnalytics.qvw" };
            abpConfigurationResponse.Configuration.Analytics.AnalyticsQVW = analyticsQVM;
            abpConfigurationResponse.Configuration.ToolbarTitleImageUrl = "../apteanlogo.png";

            Plugins plugins = new Plugins();
            Plugin plugin = new Plugin();
            plugin.PluginId = "";
            plugin.PluginUrl = "";
            plugin.ServicUrl = "";
            plugins.Add(plugin);
            abpConfigurationResponse.Configuration.EnabledPlugins = plugins;
            AvailableWidget availableWidget = new AvailableWidget("");
            availableWidget.PluginId = "";
            availableWidget.TemplateName = "";
            availableWidget.TemplateNameKey = "";
            availableWidget.Icon = "";

            abpConfigurationResponse.Configuration.AvailableWidgets.Add(availableWidget);
            LanguageResource languageResource1 = new LanguageResource("sessionMenu_about", "About");
            LanguageResource languageResource2 = new LanguageResource("sessionMenu_help", "Help");
            LanguageResource languageResource3 = new LanguageResource("sessionMenu_signoff", "Sign Off");
            LanguageResource languageResource4 = new LanguageResource("languages_en", "English");
            LanguageResource languageResource5 = new LanguageResource("languages_fr", "French");
            abpConfigurationResponse.Configuration.LanguageResources.Add(languageResource1);
            abpConfigurationResponse.Configuration.LanguageResources.Add(languageResource2);
            abpConfigurationResponse.Configuration.LanguageResources.Add(languageResource3);
            abpConfigurationResponse.Configuration.LanguageResources.Add(languageResource4);
            abpConfigurationResponse.Configuration.LanguageResources.Add(languageResource5);

            //Home NavMenu
            MenuItem HomeMenuItem = new MenuItem();
            HomeMenuItem.ActivateApp = true;
            HomeMenuItem.AppId = "ApteanSalesFlowPackage";
            HomeMenuItem.Children = new Menu();
            HomeMenuItem.Enabled = true;
            HomeMenuItem.Event = "menuItem";
            HomeMenuItem.EventArgs = "HomeManuItem";
            HomeMenuItem.Icon = "icon-home";
            HomeMenuItem.Label = "Home";
            HomeMenuItem.LabelKey = "";
            HomeMenuItem.Type = "event";

            //Customer NavMenu
            MenuItem CustomerCreateMenuItem = new MenuItem();
            CustomerCreateMenuItem.ActivateApp = true;
            CustomerCreateMenuItem.AppId = "ApteanSalesFlowPackage";
            CustomerCreateMenuItem.Children = new Menu();
            CustomerCreateMenuItem.Enabled = true;
            CustomerCreateMenuItem.Event = "menuItem";
            CustomerCreateMenuItem.EventArgs = "CustomerCreateMenuItem";
            CustomerCreateMenuItem.Icon = "icon-navigate-plus";
            CustomerCreateMenuItem.Label = "New";
            CustomerCreateMenuItem.LabelKey = "";
            CustomerCreateMenuItem.Type = "event";
            // CustomerCreateMenuItem.Shorthand = "#v";

            MenuItem CustomerShowMenuItem = new MenuItem();
            CustomerShowMenuItem.ActivateApp = true;
            CustomerShowMenuItem.AppId = "ApteanSalesFlowPackage";
            CustomerShowMenuItem.Children = new Menu();
            CustomerShowMenuItem.Enabled = true;
            CustomerShowMenuItem.Event = "menuItem";
            CustomerShowMenuItem.EventArgs = "CustomerShowMenuItem";
            CustomerShowMenuItem.Icon = "icon-record-search";
            CustomerShowMenuItem.Label = "Search";
            CustomerShowMenuItem.LabelKey = "";
            CustomerShowMenuItem.Type = "event";
            //CustomerShowMenuItem.Shorthand = "#c";

            Menu CustomerMenu = new Menu();
            CustomerMenu.Add(CustomerCreateMenuItem);
            CustomerMenu.Add(CustomerShowMenuItem);

            MenuItem CustomerMenuItem = new MenuItem();
            CustomerMenuItem.ActivateApp = true;
            CustomerMenuItem.AppId = "";
            CustomerMenuItem.Children = CustomerMenu;
            CustomerMenuItem.Enabled = true;
            CustomerMenuItem.Event = "";
            CustomerMenuItem.EventArgs = "";
            CustomerMenuItem.Icon = "icon-businessperson";
            CustomerMenuItem.Label = "Customer";
            CustomerMenuItem.LabelKey = "";
            CustomerMenuItem.Type = "event";
            //CustomerMenuItem.Shorthand = "";

            //Quote NavMenu
            MenuItem QuoteCreateMenuItem = new MenuItem();
            QuoteCreateMenuItem.ActivateApp = false;
            QuoteCreateMenuItem.AppId = "ApteanSalesFlowPackage";
            QuoteCreateMenuItem.Children = new Menu();
            QuoteCreateMenuItem.Enabled = true;
            QuoteCreateMenuItem.Event = "menuItem";
            QuoteCreateMenuItem.EventArgs = "QuoteCreateMenuItem";
            QuoteCreateMenuItem.Icon = "icon-navigate-plus";
            QuoteCreateMenuItem.Label = "New";
            QuoteCreateMenuItem.LabelKey = "";
            QuoteCreateMenuItem.Type = "event";
            //QuoteCreateMenuItem.Shorthand = "#v";

            MenuItem QuoteShowMenuItem = new MenuItem();
            QuoteShowMenuItem.ActivateApp = false;
            QuoteShowMenuItem.AppId = "ApteanSalesFlowPackage";
            QuoteShowMenuItem.Children = new Menu();
            QuoteShowMenuItem.Enabled = true;
            QuoteShowMenuItem.Event = "menuItem";
            QuoteShowMenuItem.EventArgs = "QuoteShowMenuItem";
            QuoteShowMenuItem.Icon = "icon-record-search";
            QuoteShowMenuItem.Label = "Search";
            QuoteShowMenuItem.LabelKey = "";
            QuoteShowMenuItem.Type = "event";
            //QuoteShowMenuItem.Shorthand = "#c";

            Menu QuoteMenu = new Menu();
            QuoteMenu.Add(QuoteCreateMenuItem);
            QuoteMenu.Add(QuoteShowMenuItem);

            MenuItem QuoteMenuItem = new MenuItem();
            QuoteMenuItem.ActivateApp = false;
            QuoteMenuItem.AppId = "";
            QuoteMenuItem.Children = QuoteMenu;
            QuoteMenuItem.Enabled = true;
            QuoteMenuItem.Event = "";
            QuoteMenuItem.EventArgs = "";
            QuoteMenuItem.Icon = "icon-quote";
            QuoteMenuItem.Label = "Quote";
            QuoteMenuItem.LabelKey = "";
            QuoteMenuItem.Type = "event";
            //QuoteMenuItem.Shorthand = "";

            //Sales Order Nav Menu
            MenuItem SalesOrderCreateMenuItem = new MenuItem();
            SalesOrderCreateMenuItem.ActivateApp = false;
            SalesOrderCreateMenuItem.AppId = "ApteanSalesFlowPackage";
            SalesOrderCreateMenuItem.Children = new Menu();
            SalesOrderCreateMenuItem.Enabled = true;
            SalesOrderCreateMenuItem.Event = "menuItem";
            SalesOrderCreateMenuItem.EventArgs = "SalesOrderCreateMenuItem";
            SalesOrderCreateMenuItem.Icon = "icon-navigate-plus";
            SalesOrderCreateMenuItem.Label = "New";
            SalesOrderCreateMenuItem.LabelKey = "";
            SalesOrderCreateMenuItem.Type = "event";
            // SalesOrderCreateMenuItem.Shorthand = "#v";

            MenuItem SalesOrderShowMenuItem = new MenuItem();
            SalesOrderShowMenuItem.ActivateApp = false;
            SalesOrderShowMenuItem.AppId = "ApteanSalesFlowPackage";
            SalesOrderShowMenuItem.Children = new Menu();
            SalesOrderShowMenuItem.Enabled = true;
            SalesOrderShowMenuItem.Event = "menuItem";
            SalesOrderShowMenuItem.EventArgs = "SalesOrderShowMenuItem";
            SalesOrderShowMenuItem.Icon = "icon-record-search";
            SalesOrderShowMenuItem.Label = "Search";
            SalesOrderShowMenuItem.LabelKey = "";
            SalesOrderShowMenuItem.Type = "event";
            //SalesOrderShowMenuItem.Shorthand = "#c";

            Menu SalesOrderMenu = new Menu();
            SalesOrderMenu.Add(SalesOrderCreateMenuItem);
            SalesOrderMenu.Add(SalesOrderShowMenuItem);

            MenuItem SalesOrderMenuItem = new MenuItem();
            SalesOrderMenuItem.ActivateApp = false;
            SalesOrderMenuItem.AppId = "";
            SalesOrderMenuItem.Children = SalesOrderMenu;
            SalesOrderMenuItem.Enabled = true;
            SalesOrderMenuItem.Event = "";
            SalesOrderMenuItem.EventArgs = "";
            SalesOrderMenuItem.Icon = "icon-salestask";
            SalesOrderMenuItem.Label = "Sales Order";
            SalesOrderMenuItem.LabelKey = "";
            SalesOrderMenuItem.Type = "event";
            //SalesOrderMenuItem.Shorthand = "";

            //Shipment Nav Menu
            MenuItem ShipmentCreateMenuItem = new MenuItem();
            ShipmentCreateMenuItem.ActivateApp = false;
            ShipmentCreateMenuItem.AppId = "ApteanSalesFlowPackage";
            ShipmentCreateMenuItem.Children = new Menu();
            ShipmentCreateMenuItem.Enabled = true;
            ShipmentCreateMenuItem.Event = "menuItem";
            ShipmentCreateMenuItem.EventArgs = "ShipmentCreateMenuItem";
            ShipmentCreateMenuItem.Icon = "icon-navigate-plus";
            ShipmentCreateMenuItem.Label = "New";
            ShipmentCreateMenuItem.LabelKey = "";
            ShipmentCreateMenuItem.Type = "event";
            //ShipmentCreateMenuItem.Shorthand = "#v";

            MenuItem ShipmentShowMenuItem = new MenuItem();
            ShipmentShowMenuItem.ActivateApp = false;
            ShipmentShowMenuItem.AppId = "ApteanSalesFlowPackage";
            ShipmentShowMenuItem.Children = new Menu();
            ShipmentShowMenuItem.Enabled = true;
            ShipmentShowMenuItem.Event = "menuItem";
            ShipmentShowMenuItem.EventArgs = "ShipmentShowMenuItem";
            ShipmentShowMenuItem.Icon = "icon-record-search";
            ShipmentShowMenuItem.Label = "Search";
            ShipmentShowMenuItem.LabelKey = "";
            ShipmentShowMenuItem.Type = "event";
            //ShipmentShowMenuItem.Shorthand = "#c";

            Menu ShipmentMenu = new Menu();
            ShipmentMenu.Add(ShipmentCreateMenuItem);
            ShipmentMenu.Add(ShipmentShowMenuItem);

            MenuItem ShipmentMenuItem = new MenuItem();
            ShipmentMenuItem.ActivateApp = false;
            ShipmentMenuItem.AppId = "";
            ShipmentMenuItem.Children = ShipmentMenu;
            ShipmentMenuItem.Enabled = true;
            ShipmentMenuItem.Event = "";
            ShipmentMenuItem.EventArgs = "";
            ShipmentMenuItem.Icon = "icon-small-truck";
            ShipmentMenuItem.Label = "Shipment";
            ShipmentMenuItem.LabelKey = "";
            ShipmentMenuItem.Type = "event";
            //ShipmentMenuItem.Shorthand = "";

            //Invoice
            MenuItem InvoiceCreateMenuItem = new MenuItem();
            InvoiceCreateMenuItem.ActivateApp = false;
            InvoiceCreateMenuItem.AppId = "ApteanSalesFlowPackage";
            InvoiceCreateMenuItem.Children = new Menu();
            InvoiceCreateMenuItem.Enabled = true;
            InvoiceCreateMenuItem.Event = "menuItem";
            InvoiceCreateMenuItem.EventArgs = "InvoiceCreateMenuItem";
            InvoiceCreateMenuItem.Icon = "icon-navigate-plus";
            InvoiceCreateMenuItem.Label = "New";
            InvoiceCreateMenuItem.LabelKey = "";
            InvoiceCreateMenuItem.Type = "event";
            //InvoiceCreateMenuItem.Shorthand = "#v";

            MenuItem InvoiceShowMenuItem = new MenuItem();
            InvoiceShowMenuItem.ActivateApp = false;
            InvoiceShowMenuItem.AppId = "ApteanSalesFlowPackage";
            InvoiceShowMenuItem.Children = new Menu();
            InvoiceShowMenuItem.Enabled = true;
            InvoiceShowMenuItem.Event = "menuItem";
            InvoiceShowMenuItem.EventArgs = "InvoiceShowMenuItem";
            InvoiceShowMenuItem.Icon = "icon-record-search";
            InvoiceShowMenuItem.Label = "Search";
            InvoiceShowMenuItem.LabelKey = "";
            InvoiceShowMenuItem.Type = "event";
            //InvoiceShowMenuItem.Shorthand = "#c";

            Menu InvoiceMenu = new Menu();
            InvoiceMenu.Add(InvoiceCreateMenuItem);
            InvoiceMenu.Add(InvoiceShowMenuItem);

            MenuItem InvoiceMenuItem = new MenuItem();
            InvoiceMenuItem.ActivateApp = false;
            InvoiceMenuItem.AppId = "";
            InvoiceMenuItem.Children = InvoiceMenu;
            InvoiceMenuItem.Enabled = true;
            InvoiceMenuItem.Event = "";
            InvoiceMenuItem.EventArgs = "";
            InvoiceMenuItem.Icon = "icon-invoice-dollar";
            InvoiceMenuItem.Label = "Invoice";
            InvoiceMenuItem.LabelKey = "";
            InvoiceMenuItem.Type = "event";
            // InvoiceMenuItem.Shorthand = "mlt";

            abpConfigurationResponse.Configuration.NavMenu.Add(HomeMenuItem);
            abpConfigurationResponse.Configuration.NavMenu.Add(CustomerMenuItem);
            abpConfigurationResponse.Configuration.NavMenu.Add(QuoteMenuItem);
            abpConfigurationResponse.Configuration.NavMenu.Add(SalesOrderMenuItem);
            abpConfigurationResponse.Configuration.NavMenu.Add(ShipmentMenuItem);
            abpConfigurationResponse.Configuration.NavMenu.Add(InvoiceMenuItem);

            var settings = new JsonSerializerSettings();
            settings.ContractResolver = new CamelCasePropertyNamesContractResolver();
            settings.Formatting = Formatting.Indented;
            settings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
            return Json(abpConfigurationResponse, settings);
        }

        [HttpPost]
        public HttpResponseMessage Login(LoginModel loginModel)
        {
            if (loginModel.password != null)
            {
                if (CheckUser(loginModel.logonId, loginModel.password))
                {
                    var sessionID = GenerateToken(loginModel.logonId);
                    HttpResponseMessage httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new
                    {
                        resultCode = 0,
                        errorMessage = "",
                        errorMessageKey = "",
                        errorDetailed = "",
                        sessionId = ""
                    });

                    CookieHeaderValue cookieHeaderValue = new CookieHeaderValue("session", sessionID);
                    cookieHeaderValue.Expires = DateTimeOffset.Now.AddHours(1);
                    cookieHeaderValue.Path = "/";
                    httpResponseMessage.Headers.AddCookies(new CookieHeaderValue[] { cookieHeaderValue });
                    return httpResponseMessage;
                }
            }
            else
            {
                try
                {
                    var cookie = Request.Headers.GetValues("Cookie");
                    if (cookie != null)
                    {
                        var token = cookie.First().ToString().Substring(8);
                        if (token != null)
                        {
                            if (JwtAuthenticationAttribute.ValidateToken(token))
                            {
                                return Request.CreateResponse(HttpStatusCode.OK, new
                                {
                                    resultCode = 0,
                                    errorMessage = "",
                                    errorMessageKey = "",
                                    errorDetailed = "",
                                    sessionId = ""
                                });
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, new
                    {
                        resultCode = 2
                    });
                }
            }
            return Request.CreateResponse(HttpStatusCode.OK, new
            {
                resultCode = 2
            });

        }
        [HttpPost]
        public IHttpActionResult Logout()
        {
            AbpLogoutResponse abpLogoutResponse = new AbpLogoutResponse();
            abpLogoutResponse.ResultCode = 0;
            abpLogoutResponse.ErrorMessageKey = "";
            abpLogoutResponse.ErrorMessage = "";
            abpLogoutResponse.ErrorDetailed = "";
            return Ok(abpLogoutResponse);
        }
        public bool CheckUser(string username, string password)
        {
            using (var ctx = new SalesModuleEntities())
            {
                var anonymousObjResult = from s in ctx.Users
                                         where s.Username.Equals(username)
                                         select s;
                foreach (var values in anonymousObjResult)
                {
                    return values.Password.CompareTo(password) == 0 ? true : false;
                }
            }

            return false;
        }

        private const string Secret = "db3OIsj+BXE9NZDy0t8W3TcNekrF+2d/1sFnWG4HnV8TZY30iTOdtVWJG8abWvB1GlOgJuQZdcF2Luqm/hccMw==";
        public static string GenerateToken(string username, int expireMinutes = 60)
        {
            var symmetricKey = Convert.FromBase64String(Secret);
            var tokenHandler = new JwtSecurityTokenHandler();

            var now = DateTime.Now;
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
            new Claim(ClaimTypes.Name, username)
        }),

                Expires = now.AddMinutes(Convert.ToInt32(expireMinutes)),

                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(symmetricKey),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var stoken = tokenHandler.CreateToken(tokenDescriptor);
            var token = tokenHandler.WriteToken(stoken);

            return token;
        }
    }
}