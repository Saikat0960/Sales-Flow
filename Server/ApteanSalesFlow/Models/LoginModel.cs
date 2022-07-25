using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ApteanSalesFlow.Models
{
    public class LoginModel
    {
        public string logonId { get; set; }
        public string password { get; set; }
        public string environment { get; set; }
        public string locale { get; set; }
    }
}