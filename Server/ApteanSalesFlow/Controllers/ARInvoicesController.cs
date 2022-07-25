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
    public class ARInvoicesController : ApiController
    {
        private SalesModuleEntities db = new SalesModuleEntities();

        // GET: api/ARInvoice
        public IQueryable<InvoiceWithCustomer> GetAR_Invoices()
        {
            var obj = from c in db.AR_Invoice
                      select new InvoiceWithCustomer
                      {
                          InvoiceID = c.Id,
                          CustomerName = c.Customer.Company_Name,
                          ShipmentID = c.Shipment_Number,
                          SO_Number = c.Shipment.SO_Number,
                          Date = c.Date
                      };
            return obj;
        }

        // GET: api/ARInvoice/5
        [ResponseType(typeof(AR_Invoice))]
        public IHttpActionResult GetAR_Invoice(int id)
        {
            AR_Invoice aR_Invoice = db.AR_Invoice.Find(id);
            if (aR_Invoice == null)
            {
                return NotFound();
            }
            aR_Invoice.Customer = db.Customers.Find(aR_Invoice.Customer_Id);
            aR_Invoice.Sales_Order = db.Sales_Order.Find(aR_Invoice.SO_Number);
            aR_Invoice.Customer.Sales_Person = db.Sales_Person.Find(aR_Invoice.Sales_Order.Sales_Person);
            return Ok(aR_Invoice);
        }

        // PUT: api/ARInvoice/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutAR_Invoice(int id, AR_Invoice aR_Invoice)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != aR_Invoice.Id)
            {
                return BadRequest();
            }

            db.Entry(aR_Invoice).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AR_InvoiceExists(id))
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

        // POST: api/ARInvoice
        [ResponseType(typeof(AR_Invoice))]
        public IHttpActionResult PostAR_Invoice(AR_Invoice aR_Invoice)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                db.AR_Invoice.Add(aR_Invoice);
                db.SaveChanges();

                Shipment shipment = db.Shipments.Find(aR_Invoice.Shipment_Number);
                shipment.Invoiced = 1;
                db.SaveChanges();

                return CreatedAtRoute("DefaultApi", new { id = aR_Invoice.Id }, aR_Invoice.Id);
            }
            catch (System.Data.Entity.Validation.DbEntityValidationException dbEx)
            {
                Exception raise = dbEx;
                foreach (var validationErrors in dbEx.EntityValidationErrors)
                {
                    foreach (var validationError in validationErrors.ValidationErrors)
                    {
                        string message = string.Format("{0}:{1}",
                            validationErrors.Entry.Entity.ToString(),
                            validationError.ErrorMessage);
                        // raise a new exception nesting  
                        // the current instance as InnerException  
                        raise = new InvalidOperationException(message, raise);
                    }
                }
                throw raise;
            }

        }

        // DELETE: api/ARInvoice/5
        [ResponseType(typeof(AR_Invoice))]
        public IHttpActionResult DeleteAR_Invoice(int id)
        {
            AR_Invoice aR_Invoice = db.AR_Invoice.Find(id);
            if (aR_Invoice == null)
            {
                return NotFound();
            }

            db.AR_Invoice.Remove(aR_Invoice);
            db.SaveChanges();

            return Ok(aR_Invoice);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool AR_InvoiceExists(int id)
        {
            return db.AR_Invoice.Count(e => e.Id == id) > 0;
        }
    }
}