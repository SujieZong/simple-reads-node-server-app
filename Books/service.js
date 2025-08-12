import axios from "axios";

const GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1";

/**
 * Search for books using Google Books API
 * @param {string} query - Search query
 * @param {number} maxResults - Maximum number of results to return (default: 10)
 * @returns {Promise<Array>} Array of book objects
 */
export const searchBooks = async (query, maxResults = 10) => {
  try {
    console.log(`Searching for books with query: "${query}"`);

    const response = await axios.get(`${GOOGLE_BOOKS_API_URL}/volumes`, {
      params: {
        q: query,
        maxResults: Math.min(maxResults, 40), // Google Books API max is 40
        orderBy: "relevance",
        printType: "books",
      },
    });

    if (!response.data.items) {
      console.log("No books found for query:", query);
      return [];
    }

    const books = response.data.items.map((item) => ({
      googleId: item.id,
      title: item.volumeInfo.title || "Unknown Title",
      authors: item.volumeInfo.authors || ["Unknown Author"],
      thumbnail:
        item.volumeInfo.imageLinks?.thumbnail ||
        item.volumeInfo.imageLinks?.smallThumbnail ||
        "",
      description: item.volumeInfo.description || "No description available",
      publishedDate: item.volumeInfo.publishedDate || "",
      categories: item.volumeInfo.categories || [],
      pageCount: item.volumeInfo.pageCount || 0,
      language: item.volumeInfo.language || "en",
      averageRating: item.volumeInfo.averageRating || 0,
      ratingsCount: item.volumeInfo.ratingsCount || 0,
      previewLink: item.volumeInfo.previewLink || "",
      infoLink: item.volumeInfo.infoLink || "",
    }));

    console.log(`Found ${books.length} books`);
    return books;
  } catch (error) {
    console.error("Error searching books:", error.message);
    if (error.response) {
      console.error(
        "API Response:",
        error.response.status,
        error.response.data
      );
    }
    throw new Error(`Failed to search books: ${error.message}`);
  }
};

/**
 * Get detailed information about a specific book by Google ID
 * @param {string} googleId - Google Books ID
 * @returns {Promise<Object>} Book object with detailed information
 */
export const getBookByGoogleId = async (googleId) => {
  try {
    console.log(`Fetching book details for Google ID: ${googleId}`);

    const response = await axios.get(
      `${GOOGLE_BOOKS_API_URL}/volumes/${googleId}`
    );

    const item = response.data;
    const book = {
      googleId: item.id,
      title: item.volumeInfo.title || "Unknown Title",
      authors: item.volumeInfo.authors || ["Unknown Author"],
      thumbnail:
        item.volumeInfo.imageLinks?.thumbnail ||
        item.volumeInfo.imageLinks?.smallThumbnail ||
        "",
      description: item.volumeInfo.description || "No description available",
      publishedDate: item.volumeInfo.publishedDate || "",
      categories: item.volumeInfo.categories || [],
      pageCount: item.volumeInfo.pageCount || 0,
      language: item.volumeInfo.language || "en",
      averageRating: item.volumeInfo.averageRating || 0,
      ratingsCount: item.volumeInfo.ratingsCount || 0,
      previewLink: item.volumeInfo.previewLink || "",
      infoLink: item.volumeInfo.infoLink || "",
      publisher: item.volumeInfo.publisher || "",
      publishedDate: item.volumeInfo.publishedDate || "",
      isbn:
        item.volumeInfo.industryIdentifiers?.find((id) => id.type === "ISBN_13")
          ?.identifier ||
        item.volumeInfo.industryIdentifiers?.find((id) => id.type === "ISBN_10")
          ?.identifier ||
        "",
    };

    console.log(`Successfully fetched book: ${book.title}`);
    return book;
  } catch (error) {
    console.error("Error fetching book by Google ID:", error.message);
    if (error.response) {
      console.error(
        "API Response:",
        error.response.status,
        error.response.data
      );
    }
    throw new Error(`Failed to fetch book details: ${error.message}`);
  }
};

/**
 * Search books by author
 * @param {string} author - Author name
 * @param {number} maxResults - Maximum number of results
 * @returns {Promise<Array>} Array of book objects
 */
export const searchBooksByAuthor = async (author, maxResults = 10) => {
  return searchBooks(`inauthor:"${author}"`, maxResults);
};

/**
 * Search books by category/genre
 * @param {string} category - Category/genre
 * @param {number} maxResults - Maximum number of results
 * @returns {Promise<Array>} Array of book objects
 */
export const searchBooksByCategory = async (category, maxResults = 10) => {
  return searchBooks(`subject:"${category}"`, maxResults);
};
