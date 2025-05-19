import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLInputObjectType,
} from 'graphql';
import User from '../schema/User.js';
import Student from '../schema/Student.js';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserPayloadType = new GraphQLObjectType({
  name: 'UserPayload',
  fields: {
    id: { type: GraphQLString },
    username: { type: GraphQLString },
    name: { type: GraphQLString },
    role: { type: GraphQLString },
    studentId: { type: GraphQLString },
  },
});

const SignUpInputType = new GraphQLInputObjectType({
  name: 'SignUpInput',
  fields: {
    username: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    isStudent: { type: GraphQLBoolean },
    universityId: { type: GraphQLString },
  },
});

const SignUpPayloadType = new GraphQLObjectType({
  name: 'SignUpPayload',
  fields: {
    success: { type: GraphQLBoolean },
    message: { type: GraphQLString },
    user: { type: UserPayloadType },
  },
});

const RootMutation = new GraphQLObjectType({
  name: 'RootMutationType',
  fields: {
    signUp: {
      type: SignUpPayloadType,
      args: {
        input: { type: new GraphQLNonNull(SignUpInputType) },
      },
      async resolve(parent, { input }) {
        const existingUser = await User.findOne({ username: input.username });
        if (existingUser) {
          throw new Error('Username already exists');
        }

        let studentId = null;
        if (input.isStudent && input.universityId) {
          const student = await new Student({
            name: input.name,
            universityId: input.universityId,
          }).save();
          studentId = student._id;
        }

        const user = new User({
          username: input.username,
          password: input.password,
          name: input.name,
          role: input.isStudent ? 'Student' : 'Administrator',
          studentId,
        });

        await user.save();

        return {
          success: true,
          message: 'Registration successful, please login',
          user: {
            id: (user._id as mongoose.Types.ObjectId).toString(),
            username: user.username,
            name: user.name,
            role: user.role,
            studentId: user.studentId?.toString(),
          },
        };
      },
    },
  },
});

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      hello: {
        type: GraphQLString,
        resolve: () => 'Hello from GraphQL API 👋',
      },
    },
  }),
  mutation: RootMutation,
});
