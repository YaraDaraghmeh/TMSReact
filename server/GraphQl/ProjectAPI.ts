import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLInt
} from 'graphql';
import Project from '../schema/Project.js';
import Task from '../schema/Task.js';
import Student from '../schema/Student.js';

// TaskType
const TaskType = new GraphQLObjectType({
  name: 'Task',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    dueDate: { type: GraphQLString },
    assignedTo: {
      type: new GraphQLObjectType({
        name: 'AssignedStudent',
        fields: {
          id: { type: GraphQLID },
          name: { type: GraphQLString }
        }
      }),
      resolve: async (parent) => Student.findById(parent.assignedTo)
    }
  })
});

// StudentType
const StudentType = new GraphQLObjectType({
  name: 'Student',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    projects: {
      type: new GraphQLList(ProjectType),
      resolve: async (parent) => {
        // Find all projects that have this student ID in their students array
        return Project.find({ students: parent._id });
      }
    }
  })
});

// ProjectType
const ProjectType = new GraphQLObjectType({
  name: 'Project',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    progress: { type: GraphQLInt },
    status: { type: GraphQLString },
    category: { type: GraphQLString },
    startDate: { type: GraphQLString },
    endDate: { type: GraphQLString },
    students: {
      type: new GraphQLList(new GraphQLObjectType({
        name: 'StudentInProject',
        fields: {
          id: { type: GraphQLID },
          name: { type: GraphQLString }
        }
      })),
      resolve: async (parent) => Student.find({ _id: { $in: parent.students } })
    },
    tasks: {
      type: new GraphQLList(TaskType),
      resolve: async (parent) => Task.find({ projectId: parent._id })
    }
  })
});

// ProjectInputType
const ProjectInputType = new GraphQLInputObjectType({
  name: 'ProjectInput',
  fields: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: new GraphQLNonNull(GraphQLString) },
    category: { type: GraphQLString },
    status: { type: GraphQLString },
    startDate: { type: GraphQLString },
    endDate: { type: GraphQLString },
    progress: { type: GraphQLInt },
    students: { type: new GraphQLList(GraphQLID) }
  }
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    allProjects: {
      type: new GraphQLList(ProjectType),
      resolve: () => Project.find()
    },
    projectById: {
      type: ProjectType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve: (_, { id }) => Project.findById(id)
    },
    allStudents: {
      type: new GraphQLList(StudentType),
      resolve: () => Student.find()
    },
    studentById: {
      type: StudentType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve: (_, { id }) => Student.findById(id)
    },
    projectsByStudentId: {
      type: new GraphQLList(ProjectType),
      args: {
        studentId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve: (_, { studentId }) => {
        return Project.find({ students: studentId });
      }
    }
  }
});

// Mutation
const Mutation = new GraphQLObjectType({
  name: 'RootMutationType',
  fields: {
    createProject: {
      type: ProjectType,
      args: {
        input: { type: new GraphQLNonNull(ProjectInputType) }
      },
      resolve: async (_, { input }) => {
        const newProject = new Project(input);
        return await newProject.save();
      }
    },
    createStudent: {
      type: StudentType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLString }
      },
      resolve: async (_, { name, email }) => {
        const newStudent = new Student({ name, email });
        return await newStudent.save();
      }
    }
  }
});

// Final Schema
export default new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});