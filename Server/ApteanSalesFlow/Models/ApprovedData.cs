using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ApteanSalesFlow.Models
{
    public class ApprovedData
    {
        public int ApprovedSO { get; set; }
        public int TotalSO { get; set; }
        public int ApprovedShipment { get; set; }
        public int TotalShipment { get; set; }
        public int ApprovedQuote { get; set; }
        public int TotalQuote { get; set; }
        public int Confirmed { get; set; }
        public int Prospect { get; set; }
    }
}