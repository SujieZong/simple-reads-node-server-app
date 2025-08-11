import Database from './Database/index.js';
import { 
  getUserProfile, 
  getBookDetails, 
  findUsersByRole,
  checkUserPermission 
} from './Database/utils.js';

console.log('=== SimpleReads Database Test ===\n');

// Test user data
console.log('1. User Role Distribution:');
const readers = findUsersByRole('reader');
const writers = findUsersByRole('writer');
const admins = findUsersByRole('admin');

console.log(`   Readers: ${readers.length} users`);
console.log(`   Writers: ${writers.length} users`);
console.log(`   Admins: ${admins.length} users\n`);

// Test user profile
console.log('2. Writer User Example (mike_writer):');
const writerProfile = getUserProfile('user003');
console.log(`   Username: ${writerProfile.username}`);
console.log(`   Role: ${writerProfile.role}`);
console.log(`   Expertise: ${writerProfile.expertise?.join(', ')}`);
console.log(`   Stats: ${writerProfile.stats.reviewCount} reviews, ${writerProfile.stats.favoriteCount} favorites\n`);

// Test book details
console.log('3. Book Example (The Three-Body Problem):');
const bookDetails = getBookDetails('book001');
console.log(`   Title: ${bookDetails.title}`);
console.log(`   Author: ${bookDetails.authors.join(', ')}`);
console.log(`   Review Count: ${bookDetails.stats.reviewCount}`);
console.log(`   Average Rating: ${bookDetails.stats.averageRating} stars\n`);

// Test permission system
console.log('4. Permission Tests:');
const readerCanEditOwn = checkUserPermission('user001', 'user001', 'edit_own_profile');
const readerCanEditOther = checkUserPermission('user001', 'user002', 'edit_own_profile');
const adminCanEditAny = checkUserPermission('user005', 'user001', 'edit_own_profile');

console.log(`   Reader edit own profile: ${readerCanEditOwn ? '✓' : '✗'}`);
console.log(`   Reader edit other's profile: ${readerCanEditOther ? '✓' : '✗'}`);
console.log(`   Admin edit any profile: ${adminCanEditAny ? '✓' : '✗'}\n`);

// Test data integrity
console.log('5. Data Statistics:');
console.log(`   Total Users: ${Database.users.length}`);
console.log(`   Total Books: ${Database.books.length}`);
console.log(`   Total Reviews: ${Database.reviews.length}`);
console.log(`   Total Favorites: ${Database.favorites.length}`);
console.log(`   Total Follows: ${Database.follows.length}`);

console.log('\n=== Database Test Complete ===');
