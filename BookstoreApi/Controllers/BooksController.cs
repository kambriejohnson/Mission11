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

        // ✅ ADD BOOK
        [HttpPost]
[HttpPost]
public IActionResult Post([FromBody] Book newBook)
{
    int nextId = _context.Books.Any()
        ? _context.Books.Max(b => b.BookId) + 1
        : 1;

    newBook.BookId = nextId;
    newBook.Category = newBook.Classification;

    _context.Books.Add(newBook);
    _context.SaveChanges();

    return Ok(newBook);
}

        // ✅ UPDATE BOOK
        [HttpPut("{id}")]
public IActionResult Put(int id, [FromBody] Book updatedBook)
{
    var book = _context.Books.FirstOrDefault(b => b.BookId == id);

    if (book == null) return NotFound();

    book.Title = updatedBook.Title;
    book.Author = updatedBook.Author;
    book.Publisher = updatedBook.Publisher;
    book.ISBN = updatedBook.ISBN;
    book.Classification = updatedBook.Classification;
    book.Category = updatedBook.Classification;
    book.PageCount = updatedBook.PageCount;
    book.Price = updatedBook.Price;

    _context.SaveChanges();

    return Ok(book);
}
        // ✅ DELETE BOOK
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var book = _context.Books.FirstOrDefault(b => b.BookId == id);

            if (book == null) return NotFound();

            _context.Books.Remove(book);
            _context.SaveChanges();

            return NoContent();
        }
    }
}