import axios from "axios";
import * as dao from "./dao.js";

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
 * Get book from cache or fetch from Google Books API
 * @param {string} googleId - Google Books ID
 * @returns {Promise<Object>} Book object
 */
export const getBookByGoogleId = async (googleId) => {
  try {
    // First, try to get from local database
    let book = await dao.findBookByGoogleId(googleId);

    // If found and recently synced (within 24 hours), return cached version
    if (
      book &&
      book.lastSyncedAt &&
      new Date() - new Date(book.lastSyncedAt) < 24 * 60 * 60 * 1000
    ) {
      // Increment view count
      await dao.incrementViewCount(googleId);
      return book;
    }

    // Otherwise, fetch from Google Books API
    console.log(
      `Fetching book details from Google Books API for ID: ${googleId}`
    );

    const response = await axios.get(
      `${GOOGLE_BOOKS_API_URL}/volumes/${googleId}`
    );

    const item = response.data;
    const bookData = {
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
      publisher: item.volumeInfo.publisher || "",
      isbn:
        item.volumeInfo.industryIdentifiers?.find((id) => id.type === "ISBN_13")
          ?.identifier ||
        item.volumeInfo.industryIdentifiers?.find((id) => id.type === "ISBN_10")
          ?.identifier ||
        "",
      googleRating: item.volumeInfo.averageRating || 0,
      googleRatingsCount: item.volumeInfo.ratingsCount || 0,
      previewLink: item.volumeInfo.previewLink || "",
      infoLink: item.volumeInfo.infoLink || "",
    };

    // Save to database (upsert)
    book = await dao.createOrUpdateBook(bookData);

    // Increment view count
    await dao.incrementViewCount(googleId);

    console.log(`Successfully cached book: ${book.title}`);
    return book;
  } catch (error) {
    console.error("Error fetching book by Google ID:", error.message);

    // If API fails but we have cached data, return it
    const cachedBook = await dao.findBookByGoogleId(googleId);
    if (cachedBook) {
      console.log("Returning cached book due to API error");
      return cachedBook;
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
