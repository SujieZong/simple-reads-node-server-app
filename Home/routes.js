/**
 * Home page routes for SimpleReads API
 * Provides dynamic content for home page based on user authentication status
 */
export default function HomeRoutes(app) {
  /**
   * Get home page data
   * Provides different content for anonymous vs logged-in users
   * GET /api/home
   */
  const getHomeData = async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];

      // Import DAOs
      const ReviewDAO = await import("../Reviews/dao.js");
      const UserDAO = await import("../Users/dao.js");
      const FollowDAO = await import("../Follows/dao.js");

      if (!currentUser) {
        // Anonymous user - show generic content
        const recentReviews = await ReviewDAO.findAllReviews();
        const topWriters = await UserDAO.findUsersByRole("writer");

        res.json({
          user: null,
          content: {
            type: "anonymous",
            recentReviews: recentReviews.slice(0, 10),
            topWriters: topWriters.slice(0, 5),
            featuredBooks: [], // Could be populated from trending books
            totalUsers: await UserDAO.findAllUsers().then(
              (users) => users.length
            ),
            totalReviews: recentReviews.length,
          },
          timestamp: new Date().toISOString(),
        });
      } else {
        // Logged-in user - show personalized content
        const following = await FollowDAO.getFollowing(currentUser._id);
        const followingIds = following.map((f) => f.following._id);

        // Get reviews from followed users
        const feedReviews = [];
        for (const userId of followingIds) {
          const userReviews = await ReviewDAO.findReviewsByUser(userId);
          feedReviews.push(...userReviews);
        }

        // Sort by creation date
        feedReviews.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        const recentReviews = await ReviewDAO.findAllReviews();

        res.json({
          user: {
            _id: currentUser._id,
            username: currentUser.username,
            role: currentUser.role,
            avatar: currentUser.avatar,
          },
          content: {
            type: "personalized",
            personalizedFeed: feedReviews.slice(0, 10),
            recentReviews: recentReviews.slice(0, 5),
            followingCount: following.length,
            suggestedUsers: await UserDAO.findUsersByRole("writer").then(
              (writers) =>
                writers
                  .filter(
                    (w) =>
                      w._id !== currentUser._id && !followingIds.includes(w._id)
                  )
                  .slice(0, 3)
            ),
          },
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Error fetching home data:", error.message);
      res.status(500).json({
        success: false,
        message: "Error fetching home data",
        error: error.message,
      });
    }
  };

  /**
   * Get trending books (books with most recent reviews)
   * GET /api/home/trending
   */
  const getTrendingBooks = async (req, res) => {
    try {
      const ReviewDAO = await import("../Reviews/dao.js");
      const BooksService = await import("../Books/service.js");

      const recentReviews = await ReviewDAO.findAllReviews();

      // Count reviews per book
      const bookCounts = {};
      recentReviews.forEach((review) => {
        bookCounts[review.book] = (bookCounts[review.book] || 0) + 1;
      });

      // Sort books by review count
      const trendingBookIds = Object.entries(bookCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([bookId]) => bookId);

      // Get book details for trending books
      const trendingBooks = [];
      for (const bookId of trendingBookIds) {
        try {
          const book = await BooksService.getBookByGoogleId(bookId);
          trendingBooks.push({
            ...book,
            reviewCount: bookCounts[bookId],
          });
        } catch (error) {
          console.warn(
            `Could not fetch details for book ${bookId}:`,
            error.message
          );
        }
      }

      res.json({
        success: true,
        trendingBooks,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error fetching trending books:", error.message);
      res.status(500).json({
        success: false,
        message: "Error fetching trending books",
        error: error.message,
      });
    }
  };

  // Define routes
  app.get("/api/home", getHomeData);
  app.get("/api/home/trending", getTrendingBooks);

  /**
   * Get credits information
   * GET /api/home/credits
   */
  app.get("/api/home/credits", (req, res) => {
    res.json({
      credits: {
        authors: "Wei-Yun Feng, Sujie Zong",
        course: "5610 Summer2 2025",
        links: [
          {
            label: "React App Repository",
            url: "https://github.com/Nimodipine/simple-reads-react-server-app.git",
          },
          {
            label: "Node Server Repository",
            url: "https://github.com/SujieZong/simple-reads-node-server-app.git",
          },
        ],
      },
    });
  });

  console.log("Home routes initialized ✓");
}
