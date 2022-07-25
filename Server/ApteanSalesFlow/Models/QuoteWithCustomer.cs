using ApteanSalesFlow.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ApteanSalesFlow.Controllers
{
    public class QuoteWithCustomer
    {
        public int Quote_Number { get; set; }
        public string Company_Name { get; set; }
        public string Sales_Person { get; set; }
        public string Status { get; set; }
    }
}