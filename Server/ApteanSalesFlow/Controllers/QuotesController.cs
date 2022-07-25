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
    public class QuotesController : ApiController
    {
        private SalesModuleEntities db = new SalesModuleEntities();

        // GET: api/Quotes
        public IQueryable<QuoteWithCustomer> GetQuotes()
        {
            return from q in db.Quotes
                   join c in db.Customers
                   on q.Customer equals c.Id
                   join s in db.Sales_Person
                   on q.Sales_Person equals s.Id
                   select new QuoteWithCustomer
                   {
                       Quote_Number = q.Quote_Number,
                       Company_Name = c.Company_Name,
                       Sales_Person = s.Name,
                       Status = q.Status
                   };
           
        }

        // GET: api/Quotes/5
        [ResponseType(typeof(Quote))]
        public IHttpActionResult GetQuote(int id)
        {
            Quote quote = db.Quotes.Find(id);
            if (quote == null)
            {
                return NotFound();
            }
            quote.Customer1 = db.Customers.Find(quote.Customer);
            quote.Customer1.Sales_Person = db.Sales_Person.Find(quote.Sales_Person);
            quote.Customer1.Tax1 = db.Taxes.Find(quote.Customer1.Tax);
            return Ok(quote);
        }

        // PUT: api/Quotes/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutQuote(int id, QuoteWithItems quoteWithItems)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != quoteWithItems.quote.Quote_Number)
            {
                return BadRequest();
            }

            db.Entry(quoteWithItems.quote).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!QuoteExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            var databaseItemsId = (from qi in db.Quote_Items
                                   where qi.Quote_Id == id
                                   select qi.Id).ToList<int>();

            List<int> reqItemsId = new List<int>();

            QuoteItemsController quote_ItemsController = new QuoteItemsController();

            foreach (var item in quoteWithItems.items)
            {
                if (item.Id != 0)
                {
                    quote_ItemsController.PutQuote_Items(item.Id, item);
                    reqItemsId.Add(item.Id);
                }
                else
                {
                    var resp = quote_ItemsController.PostQuote_Items(item);
                }

            }

            foreach (var tempId in databaseItemsId)
            {
                if (!reqItemsId.Contains(tempId))
                {
                    quote_ItemsController.DeleteQuote_Items(tempId);
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Quotes
        [ResponseType(typeof(Quote))]
        public IHttpActionResult PostQuote(QuoteWithItems quoteWithItems)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Quotes.Add(quoteWithItems.quote);
            db.SaveChanges();

            foreach (var item in quoteWithItems.items)
            {
                item.Quote_Id = quoteWithItems.quote.Quote_Number;
                db.Quote_Items.Add(item);
            }
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = quoteWithItems.quote.Quote_Number }, quoteWithItems.quote.Quote_Number);
        }

        // DELETE: api/Quotes/5
        [ResponseType(typeof(Quote))]
        public IHttpActionResult DeleteQuote(int id)
        {
            Quote quote = db.Quotes.Find(id);
            if (quote == null)
            {
                return NotFound();
            }

            db.Quotes.Remove(quote);
            db.SaveChanges();

            return Ok(quote);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool QuoteExists(int id)
        {
            return db.Quotes.Count(e => e.Quote_Number == id) > 0;
        }
    }
}