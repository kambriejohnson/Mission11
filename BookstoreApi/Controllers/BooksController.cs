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
        public IEnumerable<Book> Get()
        {
            return _context.Books.ToList();
        }
    }
}