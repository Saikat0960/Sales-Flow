using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
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
    public class SalesOrderController : ApiController
    {
        private SalesModuleEntities db = new SalesModuleEntities();

        // GET: api/Sales_Order
        public IQueryable<SOWithCustomer> GetSales_Order()
        {
            var obj = from c in db.Sales_Order
                      select new SOWithCustomer
                      {
                          SO_Number = c.SO_Number,
                          Company_Name = c.Customer1.Company_Name,
                          Total_Value = c.Total_Value,
                          Status = c.Status,
                          Sales_Person = c.Sales_Person1.Name,
                          PO_Number = c.PO_Number,
                          Shipped = c.Shipped
                      };
            return obj;
        }

        // GET: api/Sales_Order/5
        [ResponseType(typeof(Sales_Order))]
        public IHttpActionResult GetSales_Order(int id)
        {
            Sales_Order sales_Order = db.Sales_Order.Find(id);
            if (sales_Order == null)
            {
                return NotFound();
            }
            sales_Order.Customer1 = db.Customers.Find(sales_Order.Customer);
            sales_Order.Tax1 = db.Taxes.Find(sales_Order.Tax);
            sales_Order.Sales_Person1 = db.Sales_Person.Find(sales_Order.Sales_Person);
            return Ok(sales_Order);
        }

        // PUT: api/Sales_Order/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutSales_Order(int id, SOWithItem sOWithItem)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != sOWithItem.sales_Order.SO_Number)
            {
                return BadRequest();
            }

            db.Entry(sOWithItem.sales_Order).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Sales_OrderExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            var databaseItemsId = (from qi in db.SO_Items
                                   where qi.SO_Id == id
                                   select qi.Id).ToList<int>();

            List<int> reqItemsId = new List<int>();

            SOItemsController sO_ItemsController = new SOItemsController();

            foreach (var item in sOWithItem.items)
            {
                if (item.Id != 0)
                {
                    sO_ItemsController.PutSO_Items(item.Id, item);
                    reqItemsId.Add(item.Id);
                }
                else
                {
                    var resp = sO_ItemsController.PostSO_Items(item);
                }

            }

            foreach (var tempId in databaseItemsId)
            {
                if (!reqItemsId.Contains(tempId))
                {
                    sO_ItemsController.DeleteSO_Items(tempId);
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Sales_Order
        [ResponseType(typeof(Sales_Order))]
        public IHttpActionResult PostSales_Order(SOWithItem sOWithItems)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Sales_Order.Add(sOWithItems.sales_Order);
            db.SaveChanges();

            foreach (var item in sOWithItems.items)
            {
                item.SO_Id = sOWithItems.sales_Order.SO_Number;
                db.SO_Items.Add(item);
            }
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = sOWithItems.sales_Order.SO_Number }, sOWithItems.sales_Order.SO_Number);
        }

        // DELETE: api/Sales_Order/5
        [ResponseType(typeof(Sales_Order))]
        public IHttpActionResult DeleteSales_Order(int id)
        {
            Sales_Order sales_Order = db.Sales_Order.Find(id);
            if (sales_Order == null)
            {
                return NotFound();
            }

            db.Sales_Order.Remove(sales_Order);
            db.SaveChanges();

            return Ok(sales_Order);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool Sales_OrderExists(int id)
        {
            return db.Sales_Order.Count(e => e.SO_Number == id) > 0;
        }
    }
}