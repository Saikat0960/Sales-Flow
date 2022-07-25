using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ApteanSalesFlow.Models
{
    public class CustomerWithSalesPerson
    {
        public int Id { get; set; }
        public string Company_Name { get; set; }
        public string Email { get; set; }
        public string Sales_Person { get; set; }
        public string Status { get; set; }
    }
}