using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ApteanSalesFlow.Models
{
    public class InvoiceWithCustomer
    {
        public int InvoiceID { get; set; }
        public string CustomerName { get; set; }
        public int ShipmentID { get; set; }
        public int SO_Number { get; set; }
        public DateTime Date { get; set; }
    }
}