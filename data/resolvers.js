// import { Students } from './connectors';
import uuid from 'uuid';
const ItemProvider = require("../itemprovider-mongodb").ItemProvider;
const itemProvider = new ItemProvider();

itemProvider.open(function (err, db) { console.log(err, db) });

const resolvers = {
  Query: {
    student(_, { sid }, context, info) {
      return itemProvider.findOne({
        collection: "students",
        query: { sid: sid },
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
      return itemProvider.findItems(
        {
          collection: "students",
          query: { [field]: { $regex: query } },
          limit: 0,
          sort: { [sort]: direction },
          fields: {}
        });
    }
  },
  Mutation: {
    addStudent(_, { input: student }) {
      console.log(student);
      student.sid = uuid.v4();
      student.modified = student.registered = Date.now();
      student.dob = new Date(student.dob);
      return itemProvider.saveItem({
        collection: 'students',
        student
      });
    },
    updateStudent(_, { input: student }) {
      student.modified = Date.now();
      return itemProvider.updateItem({
        collection: 'students',
        query: { sid: student.sid },
        action: { $set: student }
      });
    },
    deleteStudent(_, { input: { sid } }) {
      return itemProvider.deleteItem({
        collection: 'students',
        query: { sid: sid }
      });
    }
  }
};

export default resolvers;
