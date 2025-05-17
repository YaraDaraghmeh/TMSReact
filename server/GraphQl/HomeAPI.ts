import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
  GraphQLInt
} from 'graphql';
import Project from '../schema/Project.js';
import Task from '../schema/Task.js';
import Student from '../schema/Student.js';


const StatsType = new GraphQLObjectType({
  name: 'Stats',
  fields: {
    totalProjects: { type: GraphQLNonNull(GraphQLString) },
    totalTasks: { type: GraphQLNonNull(GraphQLString) },
    finishedProjects: { type: GraphQLNonNull(GraphQLString) },
    totalStudents: { type: GraphQLNonNull(GraphQLString) },
  }
});

const StudentTaskStatsType = new GraphQLObjectType({
  name: 'StudentTaskStats',
  fields: {
    pending: { type: GraphQLNonNull(GraphQLInt) },
    inProgress: { type: GraphQLNonNull(GraphQLInt) },
    completed: { type: GraphQLNonNull(GraphQLInt) },
    cancled: { type: GraphQLNonNull(GraphQLInt) },
  }
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    stats: {
      type: StatsType,
      resolve: async () => {
        const totalProjects = await Project.countDocuments();
        const totalTasks = await Task.countDocuments();
        const finishedProjects = await Project.countDocuments({ status: 'finished' });
        const totalStudents = await Student.countDocuments();

        return {
          totalProjects: totalProjects.toString(),
          totalTasks: totalTasks.toString(),
          finishedProjects: finishedProjects.toString(),
          totalStudents: totalStudents.toString(),
        };
      }
    },

    studentTaskStats: {
      type: StudentTaskStatsType,
      args: {
        studentId: { type: GraphQLNonNull(GraphQLID) }
      },
      resolve: async (_, { studentId }) => {
        const pending = await Task.countDocuments({ assignedTo: studentId, status: 'Pending' });
        const inProgress = await Task.countDocuments({ assignedTo: studentId, status: 'In Progress' });
        const completed = await Task.countDocuments({ assignedTo: studentId, status: 'Completed' });
        const cancled = await Task.countDocuments({ assignedTo: studentId, status: 'cancled' });

        return {
          pending,
          inProgress,
          completed,
          cancled
        };
      }
    }
  }
});

export default new GraphQLSchema({
  query: RootQuery
});
