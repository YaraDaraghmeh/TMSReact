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
          id: { type: GraphQLID },
          title: { type: GraphQLString }
        }
      }),
      resolve: async (parent) => {
        const project = await Project.findById(parent.projectId);
        return project ? { id: project.id, title: project.title } : null;
      }
    },
    name: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    assignedTo: {
      type: new GraphQLObjectType({
        name: 'AssignedStudent',
        fields: {
          id: { type: GraphQLID },
          name: { type: GraphQLString }
        }
      }),
      resolve: async (parent) => {
        const student = await Student.findById(parent.assignedTo);
        return student ? { id: student.id, name: student.name } : null;
      }
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
      resolve: (_, __, context) => {
        if (context.user?.role === 'Student') {
          return Task.find({ assignedTo: context.user.studentId || context.user.id })
            .populate('projectId assignedTo');
        }
        return Task.find().populate('projectId assignedTo');
      }
    },
    studentTasks: {
      type: new GraphQLList(TaskType),
      args: {
        studentId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve: (_, { studentId }) => {
        return Task.find({ assignedTo: studentId })
          .populate('projectId assignedTo');
      }
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
      resolve: (_, { input }, context) => {
        if (context.user?.role !== 'Administrator') {
          throw new Error('Unauthorized: Only administrators can create tasks');
        }

        const task = new Task({
          ...input,
          dueDate: new Date(input.dueDate)
        });
        return task.save();
      }
    },
  updateTaskStatus: {
  type: TaskType,
  args: {
    taskId: { type: new GraphQLNonNull(GraphQLID) },
    status: { type: new GraphQLNonNull(GraphQLString) }
  },
  async resolve(_, { taskId, status }, context) {
    const task = await Task.findById(taskId);
    if (!task) throw new Error('Task not found');



    if (context.user?.role !== 'Administrator' && context.user?.role !== 'Student') {
      throw new Error('Unauthorized');
    }

    task.status = status;
    await task.save();
    return task;
  }
}

  }
});

export default new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation
});
