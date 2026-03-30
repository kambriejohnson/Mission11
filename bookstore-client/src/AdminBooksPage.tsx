import { useEffect, useState } from "react"

type Book = {
  bookId: number
  title: string
  author: string
  publisher: string
  isbn: string
  category: string
  classification: string
  pageCount: number
  price: number
}

const emptyBook: Book = {
  bookId: 0,
  title: "",
  author: "",
  publisher: "",
  isbn: "",
  category: "",
  classification: "",
  pageCount: 0,
  price: 0
}

const API_URL = "https://bookstore-backend-hrceaafxeyd9akfy.eastus-01.azurewebsites.net"

function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [formData, setFormData] = useState<Book>(emptyBook)
  const [editing, setEditing] = useState(false)

  const fetchBooks = () => {
  fetch(`${API_URL}/Books`)
    .then((res) => res.json())
    .then((data) => setBooks(data))
}

  useEffect(() => {
    fetchBooks()
  }, [])

  const handleChange = (e: any) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: name === "price" || name === "pageCount" ? Number(value) : value
    })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const url = editing
  ? `${API_URL}/Books/${formData.bookId}`
  : `${API_URL}/Books`

    const method = editing ? "PUT" : "POST"

    const bookToSend = {
      ...formData,
      category: formData.classification
    }

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookToSend)
    })

    if (!response.ok) {
      const errorText = await response.text()
      alert(errorText)
      return
    }

    setFormData(emptyBook)
    setEditing(false)
    fetchBooks()
  }

  const handleEdit = (book: Book) => {
    setFormData({
      ...book,
      category: book.category ?? book.classification
    })
    setEditing(true)
  }

  const handleDelete = async (id: number) => {
    await fetch(`${API_URL}/Books/${id}`, {
      method: "DELETE"
    })
    fetchBooks()
  }

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">Admin Book Management</h1>

      <form onSubmit={handleSubmit} className="mb-4">
  <div className="mb-2">
    <label>Title</label>
    <input
      name="title"
      className="form-control"
      placeholder="Enter book title"
      value={formData.title}
      onChange={handleChange}
      required
    />
  </div>

  <div className="mb-2">
    <label>Author</label>
    <input
      name="author"
      className="form-control"
      placeholder="Enter author name"
      value={formData.author}
      onChange={handleChange}
      required
    />
  </div>

  <div className="mb-2">
    <label>Publisher</label>
    <input
      name="publisher"
      className="form-control"
      placeholder="Enter publisher"
      value={formData.publisher}
      onChange={handleChange}
      required
    />
  </div>

  <div className="mb-2">
    <label>ISBN</label>
    <input
      name="isbn"
      className="form-control"
      placeholder="e.g. 9781234567890"
      value={formData.isbn}
      onChange={handleChange}
      required
    />
  </div>

  <div className="mb-2">
    <label>Category</label>
    <input
      name="classification"
      className="form-control"
      placeholder="Fiction, Non-Fiction, etc."
      value={formData.classification}
      onChange={handleChange}
      required
    />
  </div>

  <div className="mb-2">
    <label>Page Count</label>
    <input
      name="pageCount"
      type="number"
      className="form-control"
      placeholder="Enter number of pages"
      value={formData.pageCount}
      onChange={handleChange}
      required
    />
  </div>

  <div className="mb-2">
    <label>Price ($)</label>
    <input
      name="price"
      type="number"
      step="0.01"
      className="form-control"
      placeholder="Enter price"
      value={formData.price}
      onChange={handleChange}
      required
    />
  </div>

  <button type="submit" className="btn btn-primary mt-3">
    {editing ? "Update Book" : "Add Book"}
  </button>
</form>

      {books.map((b) => (
        <div key={b.bookId} className="mb-2">
          {b.title} — {b.author}
          <button
            onClick={() => handleEdit(b)}
            className="btn btn-warning btn-sm ms-2"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(b.bookId)}
            className="btn btn-danger btn-sm ms-2"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  )
}

export default AdminBooksPage