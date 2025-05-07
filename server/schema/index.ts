import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull
} from 'graphql';
import User from './User.js';
import mongoose from 'mongoose';
// تعريف نوع UserPayload
const UserPayloadType = new GraphQLObjectType({
  name: 'UserPayload',
  fields: {
    id: { type: GraphQLString },
    username: { type: GraphQLString },
    name: { type: GraphQLString },
    role: { type: GraphQLString },
    studentId: { type: GraphQLString }
  }
});

// تعريف نوع AuthPayload
const AuthPayloadType = new GraphQLObjectType({
  name: 'AuthPayload',
  fields: {
    token: { type: new GraphQLNonNull(GraphQLString) },
    user: { type: UserPayloadType }
  }
});

const RootMutation = new GraphQLObjectType({
  name: 'RootMutationType',
  fields: {
    login: {
      type: AuthPayloadType,
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(parent, args) {
        const user = await User.findOne({ username: args.username });
        
        if (!user) {
          throw new Error('User not found');
        }

        // تأكد من أن user._id موجود وأنه من النوع الصحيح
        if (!user._id || !(user._id instanceof mongoose.Types.ObjectId)) {
          throw new Error('Invalid user ID');
        }

        return {
          token: 'generated-jwt-token', // استبدل هذا بإنشاء JWT حقيقي
          user: {
            id: user._id.toString(),
            username: user.username,
            name: user.name,
            role: user.role,
            studentId: user.studentId?.toString()
          }
        };
      }
    }
  }
});

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      hello: {
        type: GraphQLString,
        resolve: () => 'Hello from GraphQL API 👋'
      }
    }
  }),
  mutation: RootMutation
});