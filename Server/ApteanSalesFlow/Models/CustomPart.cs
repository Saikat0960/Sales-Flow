using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ApteanSalesFlow.Models
{
    public class CustomPart
    {
        public int Part_Id { get; set; }
        public string Part_Name { get; set; }
        public string Revision { get; set; }
        public string Description { get; set; }
        public string Product_Group { get; set; }
        public string Product_Class { get; set; }
        public string UOM { get; set; }
    }
}