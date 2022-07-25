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
    public class QuoteItemsController : ApiController
    {
        private SalesModuleEntities db = new SalesModuleEntities();

        // GET: api/Quote_Items
        public IQueryable<Quote_Items> GetQuote_Items()
        {
            return db.Quote_Items;
        }

        // GET: api/Quote_Items/5
        [ResponseType(typeof(Quote_Items))]
        public IHttpActionResult GetQuote_Items(int id)
        {
            var quote_Items = (from q in db.Quote_Items
                               where q.Quote_Id == id
                               join p in db.Parts
                               on q.Part_Id equals p.Id
                               join g in db.Groups
                               on p.Group_Id equals g.Id
                               join c in db.Product_Class
                               on p.Product_Class_Id equals c.Id
                               join u in db.UOMs
                               on p.UOM_Id equals u.Id
                               select new CustomItem
                               {
                                   Part_Id = p.Id,
                                   Part_Name = p.Name,
                                   Product_Class = c.Name,
                                   Product_Group = g.Name,
                                   UOM = u.Name, 
                                   Quantity = q.Quantity,
                                   Price = q.Price,
                                   Id = q.Id
                               }).ToList();
            //Quote_Items quote_Items = db.Quote_Items.Find(id);
            if (quote_Items == null)
            {
                return NotFound();
            }
            return Ok(quote_Items);
        }

        // PUT: api/Quote_Items/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutQuote_Items(int id, Quote_Items quote_Items)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != quote_Items.Id)
            {
                return BadRequest();
            }

            db.Entry(quote_Items).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Quote_ItemsExists(id))
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

        // POST: api/Quote_Items
        [ResponseType(typeof(Quote_Items))]
        public IHttpActionResult PostQuote_Items(Quote_Items quote_Items)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Quote_Items.Add(quote_Items);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = quote_Items.Id }, quote_Items);
        }

        // DELETE: api/Quote_Items/5
        [ResponseType(typeof(Quote_Items))]
        public IHttpActionResult DeleteQuote_Items(int id)
        {
            Quote_Items quote_Items = db.Quote_Items.Find(id);
            if (quote_Items == null)
            {
                return NotFound();
            }

            db.Quote_Items.Remove(quote_Items);
            db.SaveChanges();

            return Ok(quote_Items);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool Quote_ItemsExists(int id)
        {
            return db.Quote_Items.Count(e => e.Id == id) > 0;
        }
    }
}