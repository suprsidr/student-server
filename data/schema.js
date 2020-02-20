import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
const { gql } = require('apollo-server-express');
import resolvers from './resolvers';

const typeDefs = gql`
type Query {
  student(sid: ID): Student
  allStudents: [Student]
  search(field: String, query: String, sort: String, direction: Int): [Student]
}
type Mutation {
  addStudent(input: StudentInput): Student
  updateStudent(input: StudentInput): Student
  deleteStudent(input: DeleteInput): DeleteResponse
}
type DeleteResponse {
  ok: Boolean
  deletedCount: Int
}
input DeleteInput {
  sid: ID
}
input StudentInput {
  name: NameInput
  dob: String
  picture: PictureInput
  location: LocationInput
  phone: String
  cell: String
  email: String
  major: String
  gpa: String
  registered: Int
  sid: ID
  modified: Float
  modifiedby: String
}
input NameInput {
  first: String
  last: String
}
input PictureInput {
  large: String
}
input LocationInput {
  street: String
  city: String
  state: String
  postcode: String
}
type Student {
  name: Name
  dob: String
  picture: Picture
  location: Location
  phone: String
  cell: String
  email: String
  registered: String
  major: String
  gpa: String
  sid: ID!
  modified: String
  modifiedby: String
}
type Name {
  first: String
  last: String
}
type Picture {
  large: String
}
type Location {
  street: String
  city: String
  state: String
  postcode: String
}
`;

const schema = { typeDefs, resolvers };

// addMockFunctionsToSchema({ schema, mocks });

export default schema;
