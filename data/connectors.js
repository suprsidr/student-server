import Mongoose from "mongoose";

Mongoose.Promise = global.Promise;

const mongo = Mongoose.connect("mongodb://localhost:27017/students", {
  useMongoClient: true
});

const StudentSchema = Mongoose.Schema({
  name: { first: String, last: String },
  dob: String,
  picture: { large: String },
  location: {
    street: String,
    city: String,
    state: String,
    postcode: String
  },
  phone: String,
  cell: String,
  email: String,
  registered: Date,
  major: String,
  gpa: String,
  sid: String,
  modified: Date,
  modifiedby: String
});

const Students = Mongoose.model("students", StudentSchema);

export { Students };
