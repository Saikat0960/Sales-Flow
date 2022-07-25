using ApteanSalesFlow.App_Start;
using ApteanSalesFlow.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;

namespace ApteanSalesFlow.Controllers
{
   //[JwtAuthentication]
    public class DefaultController : ApiController
    {
        private SalesModuleEntities db = new SalesModuleEntities();
        [Route("api/SalesPerson")]
        public IQueryable<Sales_Person> GetSalesPerson()
        {
            return db.Sales_Person;
        }

        // GET: api/Customer/5
        [Route("api/SalesPerson/{id}")]
        [ResponseType(typeof(Sales_Person))]
        public async Task<IHttpActionResult> GetSalesPerson(int id)
        {
           Sales_Person sales_Person = await db.Sales_Person.FindAsync(id);
            if (sales_Person == null)
            {
                return NotFound();
            }

            return Ok(sales_Person);
        }

        [Route("api/Countries")]
        public IQueryable<Country> GetCountries()
        {
            return db.Countries;
        }

        [Route("api/Currencies")]
        public IQueryable<Currency> GetCurrencies()
        {
            return db.Currencies;
        }

        [Route("api/Tax")]
        public IQueryable<Tax> GetTax()
        {
            return db.Taxes;
        }

        [Route("api/Tax/{id}")]
        [ResponseType(typeof(Tax))]
        public IHttpActionResult GetTax(int id)
        {
            var tax = (from t in db.Taxes where t.Country_Id == id select t).ToList();
            return Ok(tax);
        }
       
        [Route("api/Items")]
        public IHttpActionResult GetItems()
        {
            return Ok((from p in db.Parts
                       join g in db.Groups
                       on p.Group_Id equals g.Id
                       join c in db.Product_Class
                       on p.Product_Class_Id equals c.Id
                       join u in db.UOMs
                       on p.UOM_Id equals u.Id
                       select new CustomPart
                       {
                           Part_Id = p.Id,
                           Part_Name = p.Name,
                           Product_Class = c.Name,
                           Product_Group = g.Name,
                           UOM = u.Name,
                           Revision = p.Rev,
                           Description = p.Description
                       }).ToList());
        }

        [ResponseType(typeof(Part))]
        [Route("api/Items/{id}")]
        public IHttpActionResult GetPart(int id)
        {
            Part part = db.Parts.Find(id);
            if (part == null)
            {
                return NotFound();
            }
            part.Product_Class = db.Product_Class.Find(part.Product_Class_Id);
            part.Group = db.Groups.Find(part.Group_Id);
            part.UOM = db.UOMs.Find(part.UOM_Id);
            part.Warehouse = db.Warehouses.Find(part.Warehouse_Id);
            return Ok(part);
        }

 
        [Route("api/find_symbols_in_names")]
        [HttpPost]
        public IHttpActionResult findSymbols(Express data)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            for(int i=0;i<data.chemicals.Length;i++)
            {
                for (int j = 0; j < data.symbols.Length; j++)
                {
                    if (data.chemicals[i].Contains(data.symbols[j]))
                    {
                        data.chemicals[i] = data.chemicals[i].Replace(data.symbols[j], "[" + data.symbols[j] + "]");
                    }
                }
            }
            return Ok(data.chemicals);
        }
        //[Route("api/ChangeCustomerStatus/{id}")]
        //[ResponseType(typeof(Customer))]
        //public IHttpActionResult ChangeCustomerStatus(int id)
        //{
        //    Customer customer = db.Customers.Find(id);
        //    customer.Status = "CONFIRMED";
        //    db.SaveChanges();
        //    return Ok(customer.Id);
        //}

    }
}
