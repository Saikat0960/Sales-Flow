using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ApteanSalesFlow.Models
{
    public class QuoteWithItems
    {
        public Quote quote { get; set; }
        public ICollection<Quote_Items> items { get; set; }
    }
}