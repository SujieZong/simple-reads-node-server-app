/**
 * Test script for Books API endpoints
 * This script tests all the book-related API endpoints to ensure they work correctly
 *
 * To run this test:
 * 1. Make sure your server is running: npm run dev
 * 2. Run this test: node test-books-api.js
 */

import axios from "axios";

const BASE_URL = "http://localhost:4000";
const API_BASE = `${BASE_URL}/api/books`;

// Test configuration
const TEST_QUERIES = {
  general: "Harry Potter",
  author: "Stephen King",
  category: "fiction",
  specificBook: "sJf7jgEACAAJ", // Harry Potter and the Philosopher's Stone
};

/**
 * Helper function to make API requests and handle errors
 */
async function makeRequest(url, description) {
  try {
    console.log(`\n🔄 Testing: ${description}`);
    console.log(`📍 URL: ${url}`);

    const startTime = Date.now();
    const response = await axios.get(url);
    const endTime = Date.now();

    console.log(`✅ Success! (${endTime - startTime}ms)`);
    console.log(`📊 Status: ${response.status}`);

    return response.data;
  } catch (error) {
    console.log(`❌ Failed: ${description}`);
    console.log(`📍 URL: ${url}`);

    if (error.response) {
      console.log(`📊 Status: ${error.response.status}`);
      console.log(`📝 Error: ${JSON.stringify(error.response.data, null, 2)}`);
    } else {
      console.log(`📝 Error: ${error.message}`);
    }

    return null;
  }
}

/**
 * Test the API help endpoint
 */
async function testApiHelp() {
  console.log("\n" + "=".repeat(50));
  console.log("📚 TESTING API HELP ENDPOINT");
  console.log("=".repeat(50));

  const result = await makeRequest(
    `${API_BASE}/help`,
    "API Help Documentation"
  );

  if (result && result.success) {
    console.log("\n📋 Available Endpoints:");
    Object.keys(result.endpoints).forEach((endpoint) => {
      console.log(
        `   • ${endpoint}: ${result.endpoints[endpoint].method} ${result.endpoints[endpoint].url}`
      );
    });
  }

  return result;
}

/**
 * Test book search functionality
 */
async function testBookSearch() {
  console.log("\n" + "=".repeat(50));
  console.log("🔍 TESTING BOOK SEARCH");
  console.log("=".repeat(50));

  // Test 1: Basic search
  const searchResult1 = await makeRequest(
    `${API_BASE}/search?q=${encodeURIComponent(
      TEST_QUERIES.general
    )}&maxResults=3`,
    `Search for "${TEST_QUERIES.general}"`
  );

  if (searchResult1 && searchResult1.success) {
    console.log(`\n📖 Found ${searchResult1.count} books:`);
    searchResult1.books.forEach((book, index) => {
      console.log(
        `   ${index + 1}. "${book.title}" by ${book.authors.join(", ")}`
      );
      console.log(`      📖 Google ID: ${book.googleId}`);
    });
  }

  // Test 2: Search with no results
  const searchResult2 = await makeRequest(
    `${API_BASE}/search?q=xyzabc123impossiblebook`,
    "Search for non-existent book"
  );

  if (searchResult2 && searchResult2.success) {
    console.log(`\n📖 Found ${searchResult2.count} books (should be 0)`);
  }

  // Test 3: Search without query parameter (should fail)
  await makeRequest(
    `${API_BASE}/search`,
    "Search without query parameter (should fail)"
  );

  return searchResult1;
}

/**
 * Test getting specific book details
 */
async function testBookDetails() {
  console.log("\n" + "=".repeat(50));
  console.log("📋 TESTING BOOK DETAILS");
  console.log("=".repeat(50));

  // Test 1: Get details for a known book
  const bookResult = await makeRequest(
    `${API_BASE}/${TEST_QUERIES.specificBook}`,
    `Get details for book ID: ${TEST_QUERIES.specificBook}`
  );

  if (bookResult && bookResult.success) {
    const book = bookResult.book;
    console.log("\n📚 Book Details:");
    console.log(`   📖 Title: ${book.title}`);
    console.log(`   ✍️  Authors: ${book.authors.join(", ")}`);
    console.log(`   📅 Published: ${book.publishedDate}`);
    console.log(`   📄 Pages: ${book.pageCount}`);
    console.log(`   🏷️  Categories: ${book.categories.join(", ")}`);
    console.log(
      `   ⭐ Rating: ${book.averageRating}/5 (${book.ratingsCount} ratings)`
    );
    console.log(`   🔗 Google ID: ${book.googleId}`);
  }

  // Test 2: Try to get details for non-existent book
  await makeRequest(
    `${API_BASE}/nonexistentbookid123`,
    "Get details for non-existent book (should fail)"
  );

  return bookResult;
}

/**
 * Test searching by author
 */
async function testSearchByAuthor() {
  console.log("\n" + "=".repeat(50));
  console.log("👤 TESTING SEARCH BY AUTHOR");
  console.log("=".repeat(50));

  const authorResult = await makeRequest(
    `${API_BASE}/author/${encodeURIComponent(
      TEST_QUERIES.author
    )}?maxResults=3`,
    `Search books by author: ${TEST_QUERIES.author}`
  );

  if (authorResult && authorResult.success) {
    console.log(
      `\n📖 Found ${authorResult.count} books by ${authorResult.author}:`
    );
    authorResult.books.forEach((book, index) => {
      console.log(`   ${index + 1}. "${book.title}" (${book.publishedDate})`);
    });
  }

  return authorResult;
}

/**
 * Test searching by category
 */
async function testSearchByCategory() {
  console.log("\n" + "=".repeat(50));
  console.log("🏷️ TESTING SEARCH BY CATEGORY");
  console.log("=".repeat(50));

  const categoryResult = await makeRequest(
    `${API_BASE}/category/${TEST_QUERIES.category}?maxResults=3`,
    `Search books by category: ${TEST_QUERIES.category}`
  );

  if (categoryResult && categoryResult.success) {
    console.log(
      `\n📖 Found ${categoryResult.count} ${categoryResult.category} books:`
    );
    categoryResult.books.forEach((book, index) => {
      console.log(
        `   ${index + 1}. "${book.title}" by ${book.authors.join(", ")}`
      );
    });
  }

  return categoryResult;
}

/**
 * Test server health
 */
async function testServerHealth() {
  console.log("\n" + "=".repeat(50));
  console.log("❤️ TESTING SERVER HEALTH");
  console.log("=".repeat(50));

  const healthResult = await makeRequest(
    `${BASE_URL}/api/health`,
    "Server Health Check"
  );

  if (healthResult && healthResult.status === "OK") {
    console.log(`\n✅ Server is healthy: ${healthResult.message}`);
  }

  return healthResult;
}

/**
 * Main test runner
 */
async function runAllTests() {
  console.log("🚀 Starting Books API Tests...");
  console.log(`🌐 Testing against: ${BASE_URL}`);

  const results = {
    serverHealth: null,
    apiHelp: null,
    bookSearch: null,
    bookDetails: null,
    searchByAuthor: null,
    searchByCategory: null,
  };

  try {
    // Run all tests
    results.serverHealth = await testServerHealth();
    results.apiHelp = await testApiHelp();
    results.bookSearch = await testBookSearch();
    results.bookDetails = await testBookDetails();
    results.searchByAuthor = await testSearchByAuthor();
    results.searchByCategory = await testSearchByCategory();

    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("📊 TEST SUMMARY");
    console.log("=".repeat(60));

    const testResults = [
      { name: "Server Health", passed: !!results.serverHealth },
      { name: "API Help", passed: !!results.apiHelp },
      { name: "Book Search", passed: !!results.bookSearch },
      { name: "Book Details", passed: !!results.bookDetails },
      { name: "Search by Author", passed: !!results.searchByAuthor },
      { name: "Search by Category", passed: !!results.searchByCategory },
    ];

    const passedTests = testResults.filter((test) => test.passed).length;
    const totalTests = testResults.length;

    testResults.forEach((test) => {
      console.log(`${test.passed ? "✅" : "❌"} ${test.name}`);
    });

    console.log(`\n🎯 Overall: ${passedTests}/${totalTests} tests passed`);

    if (passedTests === totalTests) {
      console.log("🎉 All tests passed! Your Books API is working correctly!");
    } else {
      console.log(
        "⚠️ Some tests failed. Please check your server and try again."
      );
    }
  } catch (error) {
    console.error("\n💥 Test runner failed:", error.message);
  }
}

// Run the tests
runAllTests();
