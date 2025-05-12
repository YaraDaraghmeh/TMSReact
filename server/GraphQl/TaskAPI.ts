// server/GraphQl/TaskAPI.ts
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
  GraphQLID,
  GraphQLInputObjectType
} from 'graphql';
import Task from '../schema/Task.js';
import Project from '../schema/Project.js';
import Student from '../schema/Student.js';
import mongoose from 'mongoose';

const TaskType = new GraphQLObjectType({
  name: 'Task',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    project: { 
      type: new GraphQLObjectType({
        name: 'TaskProject',
        fields: {
          title: { type: GraphQLString }
        }
      }),
      resolve: (parent) => Project.findById(parent.projectId)
    },
    name: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    assignedTo: { 
      type: new GraphQLObjectType({
        name: 'AssignedStudent',
        fields: {
          name: { type: GraphQLString }
        }
      }),
      resolve: (parent) => Student.findById(parent.assignedTo)
    },
    status: { type: new GraphQLNonNull(GraphQLString) },
    dueDate: { type: GraphQLString }
  }
});

const TaskInputType = new GraphQLInputObjectType({
  name: 'TaskInput',
  fields: {
    projectId: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    assignedTo: { type: new GraphQLNonNull(GraphQLID) },
    status: { type: new GraphQLNonNull(GraphQLString) },
    dueDate: { type: new GraphQLNonNull(GraphQLString) }
  }
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    tasks: {
      type: new GraphQLList(TaskType),
      resolve: () => Task.find().populate('projectId assignedTo')
    },
    projects: {
      type: new GraphQLList(new GraphQLObjectType({
        name: 'ProjectOption',
        fields: {
          id: { type: GraphQLID },
          title: { type: GraphQLString }
        }
      })),
      resolve: () => Project.find({}, 'id title')
    },
    students: {
      type: new GraphQLList(new GraphQLObjectType({
        name: 'StudentOption',
        fields: {
          id: { type: GraphQLID },
          name: { type: GraphQLString }
        }
      })),
      resolve: () => Student.find({}, 'id name')
    }
  }
});

const RootMutation = new GraphQLObjectType({
  name: 'RootMutationType',
  fields: {
    createTask: {
      type: TaskType,
      args: {
        input: { type: new GraphQLNonNull(TaskInputType) }
      },
      resolve: (_, { input }) => {
        const task = new Task({
          ...input,
          dueDate: new Date(input.dueDate)
        });
        return task.save();
      }
    }
  }
});

export default new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation
});