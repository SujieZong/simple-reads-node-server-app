import * as booksService from "./service.js";

/**
 * Book routes for SimpleReads API
 * Provides endpoints for searching and retrieving book information from Google Books API
 */
export default function BookRoutes(app) {
  /**
   * Search for books
   * GET /api/books/search?q=query&maxResults=10
   */
  const searchBooks = async (req, res) => {
    try {
      const { q, maxResults = 10 } = req.query;

      if (!q || q.trim() === "") {
        return res.status(400).json({
          message: 'Query parameter "q" is required and cannot be empty',
          example: "/api/books/search?q=harry potter",
        });
      }

      console.log(
        `API: Searching books with query: "${q}", maxResults: ${maxResults}`
      );

      const books = await booksService.searchBooks(
        q.trim(),
        parseInt(maxResults)
      );

      res.json({
        success: true,
        count: books.length,
        query: q,
        books: books,
      });
    } catch (error) {
      console.error("Route error - searchBooks:", error.message);
      res.status(500).json({
        success: false,
        message: "Error searching books",
        error: error.message,
      });
    }
  };

  /**
   * Get detailed book information by Google Books ID
   * GET /api/books/:googleId
   */
  const getBookDetails = async (req, res) => {
    try {
      const { googleId } = req.params;

      if (!googleId) {
        return res.status(400).json({
          success: false,
          message: "Google Books ID is required",
        });
      }

      console.log(`API: Fetching book details for ID: ${googleId}`);

      const book = await booksService.getBookByGoogleId(googleId);

      res.json({
        success: true,
        book: book,
      });
    } catch (error) {
      console.error("Route error - getBookDetails:", error.message);

      if (error.message.includes("404") || error.response?.status === 404) {
        return res.status(404).json({
          success: false,
          message: "Book not found with the provided Google Books ID",
          googleId: req.params.googleId,
        });
      }

      res.status(500).json({
        success: false,
        message: "Error fetching book details",
        error: error.message,
      });
    }
  };

  /**
   * Search books by author
   * GET /api/books/author/:authorName?maxResults=10
   */
  const searchBooksByAuthor = async (req, res) => {
    try {
      const { authorName } = req.params;
      const { maxResults = 10 } = req.query;

      if (!authorName || authorName.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "Author name is required",
          example: "/api/books/author/Stephen King",
        });
      }

      console.log(`API: Searching books by author: "${authorName}"`);

      const books = await booksService.searchBooksByAuthor(
        authorName.trim(),
        parseInt(maxResults)
      );

      res.json({
        success: true,
        count: books.length,
        author: authorName,
        books: books,
      });
    } catch (error) {
      console.error("Route error - searchBooksByAuthor:", error.message);
      res.status(500).json({
        success: false,
        message: "Error searching books by author",
        error: error.message,
      });
    }
  };

  /**
   * Search books by category/genre
   * GET /api/books/category/:categoryName?maxResults=10
   */
  const searchBooksByCategory = async (req, res) => {
    try {
      const { categoryName } = req.params;
      const { maxResults = 10 } = req.query;

      if (!categoryName || categoryName.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "Category name is required",
          example: "/api/books/category/fiction",
        });
      }

      console.log(`API: Searching books by category: "${categoryName}"`);

      const books = await booksService.searchBooksByCategory(
        categoryName.trim(),
        parseInt(maxResults)
      );

      res.json({
        success: true,
        count: books.length,
        category: categoryName,
        books: books,
      });
    } catch (error) {
      console.error("Route error - searchBooksByCategory:", error.message);
      res.status(500).json({
        success: false,
        message: "Error searching books by category",
        error: error.message,
      });
    }
  };

  /**
   * Get API documentation/help
   * GET /api/books/help
   */
  const getApiHelp = (req, res) => {
    res.json({
      success: true,
      message: "SimpleReads Books API - Powered by Google Books",
      endpoints: {
        "Search books": {
          method: "GET",
          url: "/api/books/search",
          params: {
            q: "Search query (required)",
            maxResults: "Maximum results (optional, default: 10, max: 40)",
          },
          example: "/api/books/search?q=harry potter&maxResults=5",
        },
        "Get book details": {
          method: "GET",
          url: "/api/books/:googleId",
          example: "/api/books/sJf7jgEACAAJ",
        },
        "Search by author": {
          method: "GET",
          url: "/api/books/author/:authorName",
          params: {
            maxResults: "Maximum results (optional, default: 10)",
          },
          example: "/api/books/author/Stephen King?maxResults=5",
        },
        "Search by category": {
          method: "GET",
          url: "/api/books/category/:categoryName",
          params: {
            maxResults: "Maximum results (optional, default: 10)",
          },
          example: "/api/books/category/fiction?maxResults=5",
        },
      },
    });
  };

  /**
   * Get top 5 books by reviews + favorites (with fallback)
   * GET /api/books/top-engagement
   */
  const getTopBooksByEngagement = async (req, res) => {
    try {
      const books = await booksService.getTopBooksByEngagement();
      res.json({ success: true, count: books.length, books });
    } catch (error) {
      console.error("Route error - getTopBooksByEngagement:", error.message);
      res
        .status(500)
        .json({
          success: false,
          message: "Error fetching top books",
          error: error.message,
        });
    }
  };

  // Define routes
  app.get("/api/books/help", getApiHelp);
  app.get("/api/books/search", searchBooks);
  app.get("/api/books/author/:authorName", searchBooksByAuthor);
  app.get("/api/books/category/:categoryName", searchBooksByCategory);
  app.get("/api/books/top-engagement", getTopBooksByEngagement);
  app.get("/api/books/:googleId", getBookDetails); // This should be last to avoid conflicts

  console.log("Book routes initialized ✓");
}
