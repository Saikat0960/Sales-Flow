using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace ApteanSalesFlow
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

            HttpConfiguration config = GlobalConfiguration.Configuration;
            config.Formatters.JsonFormatter
                        .SerializerSettings
                        .ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;

        }

        protected void Application_BeginRequest(object sender, EventArgs eventArgs)
        {
            var origin = HttpContext.Current.Request.Headers.Get("Origin") ?? "";
            HttpContext.Current.Response.AddHeader("Access-Control-Allow-Origin", origin);
            HttpContext.Current.Response.AddHeader("Access-Control-Allow-Credentials", "true");
            HttpContext.Current.Response.AddHeader("Access-Control-Expose-Headers", "*");
            if (HttpContext.Current.Request.HttpMethod == "OPTIONS")
            {
                var requestHeaders = HttpContext.Current.Request.Headers.Get("Access-Control-Request-Headers") ?? "";
                if (!string.IsNullOrEmpty(requestHeaders))
                    HttpContext.Current.Response.AddHeader("Access-Control-Allow-Headers", requestHeaders);
                HttpContext.Current.Response.End();
            }
        }
    }
}
