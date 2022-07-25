using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ApteanSalesFlow.Models
{
    public class SOWithItem
    {
        public Sales_Order sales_Order { get; set; }
        public ICollection<SO_Items> items { get; set; }
    }
}