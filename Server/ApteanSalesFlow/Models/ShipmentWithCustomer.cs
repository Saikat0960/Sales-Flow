using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ApteanSalesFlow.Models
{
    public class ShipmentWithCustomer
    {
        public int Shipment_Number { get; set; }
        public string Tracking_No { get; set; }
        public string Company_Name { get; set; }
        public string Status { get; set; }
        public int Invoiced { get; set; }
        public int SO_Number { get; set; }

    }
}