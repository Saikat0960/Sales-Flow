//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace ApteanSalesFlow.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class SO_Items
    {
        public int Part_Id { get; set; }
        public int Quantity { get; set; }
        public double Price { get; set; }
        public int SO_Id { get; set; }
        public int Id { get; set; }
    
        public virtual Part Part { get; set; }
        public virtual Sales_Order Sales_Order { get; set; }
    }
}
