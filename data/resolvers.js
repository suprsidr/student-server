// import { Students } from './connectors';
import uuid from 'uuid';
const ItemProvider = require("../itemprovider-mongodb").ItemProvider;
const itemProvider = new ItemProvider();

itemProvider.open(function (err) { console.log(err) });

const errorResponse = { ok: false, error: 'Oops something went wrong!' };

const resolvers = {
  Query: {
    student(_, args) {
      return itemProvider.findOne({
        collection: "students",
        query: { sid: args.sid },
        limit: 0,
        sort: {},
        fields: {}
      });
    },
    allStudents() {
      return itemProvider.findItems(
          {
            collection: "students",
            query: {},
            limit: 0,
            sort: {},
            fields: {}
          })
    },
    search(_, { field, query, sort, direction = 1 }) {
      return Students.find({ [field]: { $regex: query } })
        .sort({ [sort]: direction })
        .then(students => students);
    }
  },
  Mutation: {
    addStudent(_, { input: student }) {
      console.log(student);
      student.sid = uuid.v4();
      student.modified = student.registered = Date.now();
      student.dob = new Date(student.dob);

      return Students.create(student).then(result => result);
    },
    updateStudent(_, { input: student }) {
      student.modified = Date.now();
      return Students.findOneAndUpdate(
        { sid: student.sid },
        { $set: student },
        { new: true }
      ).then(result => result);
    },
    deleteStudent(_, { input: { sid } }) {
      return itemProvider.deleteItem({
        collection: "students",
        query: { sid: sid }
      });
    }
  }
};

export default resolvers;
