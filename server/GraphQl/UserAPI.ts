import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull
} from 'graphql';
import User from '../schema/User.js';
import mongoose from 'mongoose';

type LeanUser = {
  _id: mongoose.Types.ObjectId;
  username: string;
  name: string;
  role: string;
  studentId?: mongoose.Types.ObjectId;
};

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    username: { type: GraphQLString },
    name: { type: GraphQLString },
    role: { type: GraphQLString },
    studentId: { type: GraphQLString }
  }
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    users: {
      type: new GraphQLList(UserType),
      args: {
        search: { type: GraphQLString }
      },
      resolve: async (_, { search }) => {
        const query = search
          ? {
              $or: [
                { username: { $regex: search, $options: 'i' } },
                { name: { $regex: search, $options: 'i' } }
              ]
            }
          : {};

        const users = await User.find(query).lean<LeanUser[]>();

        return users.map((user) => ({
          id: user._id.toString(),
          username: user.username,
          name: user.name,
          role: user.role,
          studentId: user.studentId?.toString()
        }));
      }
    },
    getUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: async (_, { id }) => {
        const user = await User.findById(id).lean<LeanUser>();
        if (!user) throw new Error('User not found');
        return {
          id: user._id.toString(),
          username: user.username,
          name: user.name,
          role: user.role,
          studentId: user.studentId?.toString()
        };
      }
    }
  })
});

export default new GraphQLSchema({
  query: RootQuery
});
