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
    public class ShipmentsController : ApiController
    {
        private SalesModuleEntities db = new SalesModuleEntities();

        // GET: api/Shipments
        public IQueryable<ShipmentWithCustomer> GetShipments()
        {
            var obj = from c in db.Shipments
                      select new ShipmentWithCustomer
                      {
                          Shipment_Number = c.Shipment_Number,
                          Tracking_No = c.Tracking_Number,
                          Company_Name = c.Customer1.Company_Name,
                          Status = c.Status,
                          Invoiced = c.Invoiced,
                          SO_Number = c.SO_Number
                      };
            return obj;
        }

        //[Route("api/Shipment/{id}")]
        [ResponseType(typeof(Shipment))]
        public IHttpActionResult GetShipment(int id)
        {
            Shipment shipment = db.Shipments.Find(id);
            if (shipment == null)
            {
                return NotFound();
            }

            shipment.Sales_Order = db.Sales_Order.Find(shipment.SO_Number);
            shipment.Customer1 = db.Customers.Find(shipment.Customer);
            shipment.Customer1.Sales_Person = db.Sales_Person.Find(shipment.Sales_Order.Sales_Person);
            return Ok(shipment);
        }

        // PUT: api/Shipments/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutShipment(int id, Shipment shipment)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != shipment.Shipment_Number)
            {
                return BadRequest();
            }

            db.Entry(shipment).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ShipmentExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Shipments
        [ResponseType(typeof(Shipment))]
        public IHttpActionResult PostShipment(Shipment shipment)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Shipments.Add(shipment);
            db.SaveChanges();

            Sales_Order sales_Order = db.Sales_Order.Find(shipment.SO_Number);
            sales_Order.Shipped = 1;
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = shipment.Shipment_Number }, shipment.Shipment_Number);
        }

        // DELETE: api/Shipments/5
        [ResponseType(typeof(Shipment))]
        public IHttpActionResult DeleteShipment(int id)
        {
            Shipment shipment = db.Shipments.Find(id);
            if (shipment == null)
            {
                return NotFound();
            }

            db.Shipments.Remove(shipment);
            db.SaveChanges();

            return Ok(shipment);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ShipmentExists(int id)
        {
            return db.Shipments.Count(e => e.Shipment_Number == id) > 0;
        }
    }
}