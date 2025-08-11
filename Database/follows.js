export default [
  {
    _id: "follow001",
    follower: "user001", // john_reader follows mike_writer
    following: "user003", // mike_writer
    createdAt: new Date("2024-01-26T10:00:00Z")
  },
  {
    _id: "follow002", 
    follower: "user001", // john_reader follows sarah_writer
    following: "user004", // sarah_writer
    createdAt: new Date("2024-02-02T14:30:00Z")
  },
  {
    _id: "follow003",
    follower: "user002", // alice_reader follows mike_writer
    following: "user003", // mike_writer  
    createdAt: new Date("2024-02-05T16:15:00Z")
  },
  {
    _id: "follow004",
    follower: "user002", // alice_reader follows sarah_writer
    following: "user004", // sarah_writer
    createdAt: new Date("2024-02-13T11:20:00Z")
  },
  {
    _id: "follow005",
    follower: "user006", // emma_reader follows sarah_writer
    following: "user004", // sarah_writer
    createdAt: new Date("2024-02-01T20:45:00Z")
  },
  {
    _id: "follow006",
    follower: "user006", // emma_reader follows david_writer  
    following: "user007", // david_writer
    createdAt: new Date("2024-02-16T09:30:00Z")
  },
  {
    _id: "follow007",
    follower: "user008", // lily_reader follows mike_writer
    following: "user003", // mike_writer
    createdAt: new Date("2024-02-09T15:10:00Z")
  },
  {
    _id: "follow008",
    follower: "user008", // lily_reader follows alice_reader
    following: "user002", // alice_reader
    createdAt: new Date("2024-02-20T12:25:00Z")
  },
  {
    _id: "follow009",
    follower: "user003", // mike_writer follows sarah_writer (writers follow each other)
    following: "user004", // sarah_writer
    createdAt: new Date("2024-02-14T08:40:00Z")
  },
  {
    _id: "follow010", 
    follower: "user004", // sarah_writer follows mike_writer (writers follow each other)
    following: "user003", // mike_writer
    createdAt: new Date("2024-02-14T08:45:00Z")
  },
  {
    _id: "follow011",
    follower: "user007", // david_writer follows mike_writer
    following: "user003", // mike_writer
    createdAt: new Date("2024-02-10T13:55:00Z")
  },
  {
    _id: "follow012",
    follower: "user001", // john_reader follows david_writer
    following: "user007", // david_writer
    createdAt: new Date("2024-02-19T17:20:00Z")
  }
];
