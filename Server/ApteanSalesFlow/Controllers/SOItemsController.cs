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
    public class SOItemsController : ApiController
    {
        private SalesModuleEntities db = new SalesModuleEntities();

        // GET: api/SOItems
        public IQueryable<SO_Items> GetSO_Items()
        {
            return db.SO_Items;
        }

        // GET: api/SOItems/5
        [ResponseType(typeof(SO_Items))]
        public IHttpActionResult GetSO_Items(int id)
        {
            var sO_Items = (from q in db.SO_Items
                               where q.SO_Id == id
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
            if (sO_Items == null)
            {
                return NotFound();
            }
            return Ok(sO_Items);
        }

        // PUT: api/SOItems/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutSO_Items(int id, SO_Items sO_Items)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != sO_Items.Id)
            {
                return BadRequest();
            }

            db.Entry(sO_Items).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SO_ItemsExists(id))
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

        // POST: api/SOItems
        [ResponseType(typeof(SO_Items))]
        public IHttpActionResult PostSO_Items(SO_Items sO_Items)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.SO_Items.Add(sO_Items);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = sO_Items.Id }, sO_Items);
        }

        // DELETE: api/SOItems/5
        [ResponseType(typeof(SO_Items))]
        public IHttpActionResult DeleteSO_Items(int id)
        {
            SO_Items sO_Items = db.SO_Items.Find(id);
            if (sO_Items == null)
            {
                return NotFound();
            }

            db.SO_Items.Remove(sO_Items);
            db.SaveChanges();

            return Ok(sO_Items);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool SO_ItemsExists(int id)
        {
            return db.SO_Items.Count(e => e.Id == id) > 0;
        }
    }
}