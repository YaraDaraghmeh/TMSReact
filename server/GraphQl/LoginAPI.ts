import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull
} from 'graphql';
import User from '../schema/User.js';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';


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

       
        const isMatch = await bcrypt.compare(args.password, user.password);
        if (!isMatch) {
          throw new Error('Invalid credentials');
        }

    
        const token = jwt.sign(
          { userId: user._id, role: user.role },
          process.env.JWT_SECRET as string,
          { expiresIn: '1d' }
        );

        return {
          token,
          user: {
            id: (user._id as mongoose.Types.ObjectId).toString() ,
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