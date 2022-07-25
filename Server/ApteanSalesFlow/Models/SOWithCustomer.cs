using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ApteanSalesFlow.Models
{
    public class SOWithCustomer
    {
        public int SO_Number { get; set; }
        public string Company_Name { get; set; }
        public double Total_Value { get; set; }
        public string Status { get; set; }
        public string Sales_Person { get; set; }
        public int PO_Number { get; set; }
        public int Shipped { get; set; }
}
}