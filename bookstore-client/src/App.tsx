import { useEffect, useState } from "react"
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom"
import CartPage from "./CartPage"

function App() {
  const navigate = useNavigate()
  const location = useLocation()

  const [books, setBooks] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [booksPerPage, setBooksPerPage] = useState(5)
  const [sortOrder, setSortOrder] = useState("asc")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [cart, setCart] = useState<any[]>(() => {
    const savedCart = sessionStorage.getItem("cart")
    return savedCart ? JSON.parse(savedCart) : []
  })
  const [returnPage, setReturnPage] = useState(1)
  const [returnCategory, setReturnCategory] = useState("")

  useEffect(() => {
    let url = "http://localhost:5087/Books"

    if (selectedCategory !== "") {
      url += `?category=${selectedCategory}`
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => setBooks(data))
  }, [selectedCategory])

  useEffect(() => {
    sessionStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const pageFromUrl = params.get("page")

    if (pageFromUrl) {
      setCurrentPage(Number(pageFromUrl))
    }
  }, [location.search])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const categoryFromUrl = params.get("category")

    if (categoryFromUrl !== null) {
      setSelectedCategory(categoryFromUrl)
    }
  }, [location.search])

  const sortedBooks = [...books].sort((a: any, b: any) => {
    if (sortOrder === "asc") {
      return a.title.localeCompare(b.title)
    } else {
      return b.title.localeCompare(a.title)
    }
  })

  const indexOfLastBook = currentPage * booksPerPage
  const indexOfFirstBook = indexOfLastBook - booksPerPage
  const currentBooks = sortedBooks.slice(indexOfFirstBook, indexOfLastBook)
  const totalPages = Math.ceil(books.length / booksPerPage)

  const addToCart = (book: any) => {
    const existingItem = cart.find((item) => item.bookId === book.bookId)

    if (existingItem) {
      const updatedCart = cart.map((item) =>
        item.bookId === book.bookId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
      setCart(updatedCart)
    } else {
      setCart([...cart, { ...book, quantity: 1 }])
    }

    setReturnPage(currentPage)
    setReturnCategory(selectedCategory)
    navigate("/cart")
  }

  const removeFromCart = (bookId: number) => {
    const updatedCart = cart.filter((item) => item.bookId !== bookId)
    setCart(updatedCart)
  }

  const clearCart = () => {
    setCart([])
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="container py-4">
            <h1 className="text-center mb-4">Online Bookstore</h1>

            <div className="row g-4">
              <div className="col-lg-4">
                <div className="sticky-top" style={{ top: "20px" }}>
                  <div className="card shadow-sm border-0 mb-4">
                    <div className="card-body">
                      <h4 className="text-center mb-3">
                        Cart Summary
                        <span className="badge text-bg-primary ms-2">
                          {cart.reduce((total, item) => total + item.quantity, 0)}
                        </span>
                      </h4>

                      <div className="text-center mb-4">
                        {cart.length === 0 ? (
                          <p className="text-center">Your cart is empty.</p>
                        ) : (
                          <>
                            <p className="mb-1">
                              Items: {cart.reduce((total, item) => total + item.quantity, 0)}
                            </p>
                            <p className="fw-bold mb-3">
                              Total: $
                              {cart
                                .reduce((total, item) => total + item.price * item.quantity, 0)
                                .toFixed(2)}
                            </p>
                          </>
                        )}

                        <Link to="/cart" className="btn btn-primary w-100">
                          View Cart
                        </Link>
                      </div>

                      <div className="mb-3">
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

                      <div className="mb-3">
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

                      <div className="mb-1">
                        <label className="form-label fw-semibold">Filter by category</label>
                        <select
                          className="form-select"
                          value={selectedCategory}
                          onChange={(e) => {
                            setSelectedCategory(e.target.value)
                            setCurrentPage(1)
                          }}
                        >
                          <option value="">All</option>
                          <option value="Fiction">Fiction</option>
                          <option value="Non-Fiction">Non-Fiction</option>
                          <option value="Biography">Biography</option>
                          <option value="Self-Help">Self-Help</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-8">
                {currentBooks.map((b: any) => (
                  <div key={b.bookId} className="card mb-3 shadow-sm border-0">
                    <div className="card-body">
                      <h3 className="card-title text-primary">{b.title}</h3>
                      <p className="mb-1"><strong>Author:</strong> {b.author}</p>
                      <p className="mb-1"><strong>Publisher:</strong> {b.publisher}</p>
                      <p className="mb-1"><strong>ISBN:</strong> {b.isbn}</p>
                      <p className="mb-1"><strong>Category:</strong> {b.classification}</p>
                      <p className="mb-1"><strong>Pages:</strong> {b.pageCount}</p>
                      <p className="mb-0"><strong>Price:</strong> ${b.price}</p>

                      <button
                        className="btn btn-primary mt-3"
                        onClick={() => addToCart(b)}
                      >
                        Add to Cart
                      </button>
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
        }
      />

      <Route
        path="/cart"
        element={
          <CartPage
            cart={cart}
            removeFromCart={removeFromCart}
            clearCart={clearCart}
            returnPage={returnPage}
            returnCategory={returnCategory}
          />
        }
      />
    </Routes>
  )
}

export default App