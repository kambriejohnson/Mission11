import { useEffect, useState } from "react"

function App() {

  // Where we store our data (books, page number, sorting choice)
  const [books, setBooks] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [booksPerPage, setBooksPerPage] = useState(5)
  const [sortOrder, setSortOrder] = useState("asc")

  // Run this once when the page loads to grab the books from the API
  useEffect(() => {
    fetch("http://localhost:5087/Books")
      .then(res => res.json())
      .then(data => setBooks(data))
  }, [])

  // Create a sorted copy of the books (so we don't mess up the original list)
  const sortedBooks = [...books].sort((a: any, b: any) => {
  if (sortOrder === "asc") {
    return a.title.localeCompare(b.title)
  } else {
    return b.title.localeCompare(a.title)
  }
})

  // Math to figure out which books to show on the current page
  const indexOfLastBook = currentPage * booksPerPage
  const indexOfFirstBook = indexOfLastBook - booksPerPage
  const currentBooks = sortedBooks.slice(indexOfFirstBook, indexOfLastBook)

  const totalPages = Math.ceil(books.length / booksPerPage)

  return (
  <div className="container py-4">
    <div className="row justify-content-center">
      <div className="col-md-10">
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <h1 className="text-center mb-4">Online Bookstore</h1>

            <div className="row mb-4">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Books per page</label>
                <select
                  className="form-select"
                  value={booksPerPage}
                  onChange={(e) => {
                    setBooksPerPage(Number(e.target.value))
                    setCurrentPage(1)
                  }}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Sort by title</label>
                <select
                  className="form-select"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="asc">A → Z</option>
                  <option value="desc">Z → A</option>
                </select>
              </div>
            </div>

            {currentBooks.map((b: any) => (
              <div key={b.bookId} className="card mb-3 shadow-sm">
                <div className="card-body">
                  <h3 className="card-title text-primary">{b.title}</h3>
                  <p className="mb-1"><strong>Author:</strong> {b.author}</p>
                  <p className="mb-1"><strong>Publisher:</strong> {b.publisher}</p>
                  <p className="mb-1"><strong>ISBN:</strong> {b.isbn}</p>
                  <p className="mb-1"><strong>Category:</strong> {b.classification}</p>
                  <p className="mb-1"><strong>Pages:</strong> {b.pageCount}</p>
                  <p className="mb-0"><strong>Price:</strong> ${b.price}</p>
                </div>
              </div>
            ))}

            <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
              <button
                className="btn btn-outline-primary"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>

              <span className="fw-semibold">
                Page {currentPage} of {totalPages}
              </span>

              <button
                className="btn btn-outline-primary"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)
}

export default App