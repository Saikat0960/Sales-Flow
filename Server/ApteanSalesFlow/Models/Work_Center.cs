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
    
    public partial class Work_Center
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Work_Center()
        {
            this.Routings = new HashSet<Routing>();
            this.Work_Calendar = new HashSet<Work_Calendar>();
        }
    
        public string Name { get; set; }
        public string Description { get; set; }
        public string Department { get; set; }
        public double Setup_Time { get; set; }
        public Nullable<double> Move_Time { get; set; }
        public decimal Capacity { get; set; }
        public int Id { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Routing> Routings { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Work_Calendar> Work_Calendar { get; set; }
    }
}
