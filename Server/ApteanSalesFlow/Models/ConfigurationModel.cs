using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ApteanSalesFlow.Models
{
    public class ConfigurationModel
    {
        [JsonProperty("locale")]
        public string Locale { get; set; }

        [JsonProperty("devicetype")]
        public string DeviceType { get; set; }
    }
}