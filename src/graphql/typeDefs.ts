import { gql } from 'graphql-tag';

const typeDefs = gql`
  type Student {
    id: ID!
    name: String!
  }

  type User {
    id: ID!
    username: String!
    name: String!
    role: String!
    student: Student
  }

  type Project {
    id: ID!
    title: String!
    description: String!
    students: [Student!]!
    category: String
    startDate: String
    endDate: String
    status: String
    progress: Int
  }

  type Task {
    id: ID!
    name: String!
    description: String
    assignedTo: Student
    status: String
    dueDate: String
    project: Project
  }

  type Query {
    projects: [Project]
    tasks: [Task]
    students: [Student]
    users: [User]
  }

  type Mutation {
    createProject(
      title: String!
      description: String!
      studentIds: [ID!]!
      category: String
      startDate: String
      endDate: String
      status: String
      progress: Int
    ): Project
  }
`;

export default typeDefs;
