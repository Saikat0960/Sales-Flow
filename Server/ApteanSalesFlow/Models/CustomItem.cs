using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ApteanSalesFlow.Models
{
    public class CustomItem
    {
        public int Id { get; set; }
        public int Part_Id { get; set; }
        public string Part_Name { get; set; }
        public string UOM { get; set; }
        public string Product_Group { get; set; }
        public string Product_Class { get; set; }
        public int Quantity { get; set; }
        public double Price { get; set; }
    }
}