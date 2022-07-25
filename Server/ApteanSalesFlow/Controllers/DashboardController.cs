using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using ApteanSalesFlow.App_Start;
using ApteanSalesFlow.Models;

namespace ApteanSalesFlow.Controllers
{
    [JwtAuthentication]
    public class DashboardController : ApiController
    {
        private SalesModuleEntities db = new SalesModuleEntities();

        [ResponseType(typeof(Sales_Order))]
        public IEnumerable<Sales_Order> GetSalesOrderData()
        {
            IEnumerable<Sales_Order> sales_Orders = db.Sales_Order
                  .OrderByDescending(m => m.SO_Number)
                  .Take(10);
            return sales_Orders;
        }

        // GET: api/DashBoard
        [ResponseType(typeof(Dashboard))]
        public List<Dashboard> GetDashBoardData()
        {
            List<Dashboard> Dashboards = new List<Dashboard>();
            Dashboard Dashboard = new Dashboard();
            IEnumerable<Sales_Order> sales_Orders = from s in db.Sales_Order
                                                    where s.Status.Equals("APPROVED")
                                                    select s;

            Dashboard.Value = sales_Orders.Count();
            Dashboard.Name = "Sales Order";
            Dashboards.Add(Dashboard);
            Dashboard Dashboard3 = new Dashboard();
            IEnumerable<Customer> customers = from s in db.Customers
                                              where s.Status.Equals("CONFIRMED")
                                              select s;

            Dashboard3.Value = customers.Count();
            Dashboard3.Name = "Customers";
            Dashboards.Add(Dashboard3);
            Dashboard Dashboard1 = new Dashboard();
            IEnumerable<Shipment> shipments = from s in db.Shipments
                                              where s.Status.Equals("APPROVED")
                                              select s;

            Dashboard1.Value = shipments.Count();
            Dashboard1.Name = "Shipment";
            Dashboards.Add(Dashboard1);
            Dashboard Dashboard2 = new Dashboard();
            IEnumerable<Quote> quotes = from s in db.Quotes
                                        where s.Status.Equals("APPROVED")
                                        select s;

            Dashboard2.Value = quotes.Count();
            Dashboard2.Name = "Quote";
            Dashboards.Add(Dashboard2);
            return Dashboards;
        }

        [ResponseType(typeof(ApprovedData))]
        public ApprovedData GetApprovedData()
        {
            IEnumerable<Sales_Order> sales_Orders = from s in db.Sales_Order
                                                    where s.Status.Equals("APPROVED")
                                                    select s;

            IEnumerable<Shipment> shipments = from s in db.Shipments
                                              where s.Status.Equals("APPROVED")
                                              select s;

            IEnumerable<Quote> quotes = from s in db.Quotes
                                        where s.Status.Equals("APPROVED")
                                        select s;

            IEnumerable<Customer> customers = from s in db.Customers
                                              where s.Status.Equals("CONFIRMED")
                                              select s;
            var obj = new ApprovedData
            {
                ApprovedSO = sales_Orders.Count(),
                TotalSO = db.Sales_Order.Count(),
                ApprovedShipment = shipments.Count(),
                TotalShipment = db.Shipments.Count(),
                ApprovedQuote = quotes.Count(),
                TotalQuote = db.Quotes.Count(),
                Confirmed = customers.Count(),
                Prospect = db.Customers.Count()
            };
            return obj;
        }

    }
}
