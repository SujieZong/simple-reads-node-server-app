export default [
  {
    _id: "user001",
    username: "john_reader",
    email: "john@example.com",
    password: "hashed_password_123", // Should be bcrypt hashed in production
    role: "reader",
    avatar: "/avatars/john.jpg",
    bio: "Reading enthusiast who loves sci-fi and mystery novels",
    createdAt: new Date("2024-01-15T10:30:00Z"),
    lastLoginAt: new Date("2024-08-10T09:15:00Z")
  },
  {
    _id: "user002", 
    username: "alice_reader",
    email: "alice@example.com",
    password: "hashed_password_456",
    role: "reader",
    avatar: "/avatars/alice.jpg",
    bio: "Literature enthusiast focused on contemporary literature and poetry",
    createdAt: new Date("2024-02-20T14:20:00Z"),
    lastLoginAt: new Date("2024-08-09T16:45:00Z")
  },
  {
    _id: "user003",
    username: "mike_writer",
    email: "mike@bookcritic.com", 
    password: "hashed_password_789",
    role: "writer",
    avatar: "/avatars/mike.jpg",
    bio: "Senior book critic and professional literary reviewer with 10 years of experience",
    writerBadge: true,
    expertise: ["Contemporary Literature", "Science Fiction", "Historical Biography"],
    createdAt: new Date("2023-11-10T08:00:00Z"),
    lastLoginAt: new Date("2024-08-11T07:30:00Z")
  },
  {
    _id: "user004",
    username: "sarah_writer", 
    email: "sarah@literaryreview.com",
    password: "hashed_password_101",
    role: "writer",
    avatar: "/avatars/sarah.jpg",
    bio: "Independent book critic focusing on women's literature and social issues",
    writerBadge: true,
    expertise: ["Women's Literature", "Sociology", "Psychology"],
    createdAt: new Date("2023-12-05T12:15:00Z"),
    lastLoginAt: new Date("2024-08-10T18:20:00Z")
  },
  {
    _id: "user005",
    username: "admin_tom",
    email: "admin@simplereads.com",
    password: "hashed_password_admin",
    role: "admin", 
    avatar: "/avatars/admin.jpg",
    bio: "SimpleReads community administrator",
    createdAt: new Date("2023-10-01T00:00:00Z"),
    lastLoginAt: new Date("2024-08-11T06:00:00Z")
  },
  {
    _id: "user006",
    username: "emma_reader",
    email: "emma@gmail.com",
    password: "hashed_password_202",
    role: "reader",
    avatar: "/avatars/emma.jpg", 
    bio: "Reader who enjoys mystery and thriller novels",
    createdAt: new Date("2024-03-12T11:45:00Z"),
    lastLoginAt: new Date("2024-08-08T20:30:00Z")
  },
  {
    _id: "user007",
    username: "david_writer",
    email: "david@bookreview.net",
    password: "hashed_password_303",
    role: "writer",
    avatar: "/avatars/david.jpg",
    bio: "Professional sci-fi critic with PhD in Science Fiction Literature",
    writerBadge: true,
    expertise: ["Science Fiction", "Fantasy Literature", "Philosophy of Technology"],
    createdAt: new Date("2024-01-08T15:30:00Z"),
    lastLoginAt: new Date("2024-08-09T12:15:00Z")
  },
  {
    _id: "user008",
    username: "lily_reader",
    email: "lily@outlook.com", 
    password: "hashed_password_404",
    role: "reader",
    avatar: "/avatars/lily.jpg",
    bio: "Classic literature lover currently reading Shakespeare's complete works",
    createdAt: new Date("2024-04-22T09:20:00Z"),
    lastLoginAt: new Date("2024-08-07T14:10:00Z")
  }
];
