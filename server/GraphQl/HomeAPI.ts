import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
} from 'graphql';
import Project from '../schema/Project.js';
import Task from '../schema/Task.js';
import Student from '../schema/Student.js';

// 1. نوع الإحصائيات
const StatsType = new GraphQLObjectType({
  name: 'Stats',
  fields: {
    totalProjects: { type: GraphQLNonNull(GraphQLString) },
    totalTasks: { type: GraphQLNonNull(GraphQLString) },
    finishedProjects: { type: GraphQLNonNull(GraphQLString) },
    totalStudents: { type: GraphQLNonNull(GraphQLString) },
  }
});

// 2. Root Query
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
    }
  }
});

export default new GraphQLSchema({
  query: RootQuery
});
