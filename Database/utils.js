import Database from './index.js';

// 用户相关操作
export const findUserByUsername = (username) => {
  return Database.users.find(user => user.username === username);
};

export const findUserById = (userId) => {
  return Database.users.find(user => user._id === userId);
};

export const findUsersByRole = (role) => {
  return Database.users.filter(user => user.role === role);
};

// 书籍相关操作
export const findBookById = (bookId) => {
  return Database.books.find(book => book._id === bookId);
};

export const findBookByGoogleId = (googleId) => {
  return Database.books.find(book => book.googleId === googleId);
};

// 书评相关操作
export const findReviewsByBookId = (bookId) => {
  return Database.reviews.filter(review => review.book === bookId);
};

export const findReviewsByUserId = (userId) => {
  return Database.reviews.filter(review => review.user === userId);
};

export const findReviewById = (reviewId) => {
  return Database.reviews.find(review => review._id === reviewId);
};

// 收藏相关操作
export const findFavoritesByUserId = (userId) => {
  return Database.favorites.filter(favorite => favorite.user === userId);
};

export const findFavoriteByUserAndBook = (userId, bookId) => {
  return Database.favorites.find(favorite => 
    favorite.user === userId && favorite.book === bookId
  );
};

// 关注相关操作
export const findFollowingByUserId = (userId) => {
  return Database.follows.filter(follow => follow.follower === userId);
};

export const findFollowersByUserId = (userId) => {
  return Database.follows.filter(follow => follow.following === userId);
};

export const findFollowByUsers = (followerId, followingId) => {
  return Database.follows.find(follow => 
    follow.follower === followerId && follow.following === followingId
  );
};

// 获取用户的完整资料（包含统计信息）
export const getUserProfile = (userId) => {
  const user = findUserById(userId);
  if (!user) return null;

  const reviews = findReviewsByUserId(userId);
  const favorites = findFavoritesByUserId(userId);
  const following = findFollowingByUserId(userId);
  const followers = findFollowersByUserId(userId);

  return {
    ...user,
    stats: {
      reviewCount: reviews.length,
      favoriteCount: favorites.length,
      followingCount: following.length,
      followerCount: followers.length
    }
  };
};

// 获取书籍的完整信息（包含书评）
export const getBookDetails = (bookId) => {
  const book = findBookById(bookId);
  if (!book) return null;

  const reviews = findReviewsByBookId(bookId);
  const reviewsWithUsers = reviews.map(review => ({
    ...review,
    author: findUserById(review.user)
  }));

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  return {
    ...book,
    reviews: reviewsWithUsers,
    stats: {
      reviewCount: reviews.length,
      averageRating: Math.round(averageRating * 10) / 10
    }
  };
};

// 检查用户权限
export const checkUserPermission = (currentUserId, targetUserId, action) => {
  const currentUser = findUserById(currentUserId);
  if (!currentUser) return false;

  // Admin可以对所有用户执行所有操作
  if (currentUser.role === 'admin') return true;

  // 用户只能操作自己的资源
  if (action === 'edit_own_profile' || action === 'delete_own_review') {
    return currentUserId === targetUserId;
  }

  // Writer可以编辑自己的内容
  if (currentUser.role === 'writer' && action === 'edit_own_content') {
    return currentUserId === targetUserId;
  }

  return false;
};

export default Database;
