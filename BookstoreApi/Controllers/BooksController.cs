using Microsoft.AspNetCore.Mvc;
using BookstoreApi.Data;
using BookstoreApi.Models;

namespace BookstoreApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class BooksController : ControllerBase
    {
        private BookstoreContext _context;

        public BooksController(BookstoreContext temp)
        {
            _context = temp;
        }

        [HttpGet]
        public IEnumerable<Book> Get(string? category)
        {
            var query = _context.Books.AsQueryable();

            if (!string.IsNullOrEmpty(category))
            {
                query = query.Where(b => b.Classification == category);
            }

            return query.ToList();
        }
    }
}