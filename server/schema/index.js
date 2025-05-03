import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString
  } from 'graphql'
  
  const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      hello: {
        type: GraphQLString,
        resolve() {
          return 'Hello from GraphQL API 👋'
        }
      }
    }
  })
  
  export default new GraphQLSchema({
    query: RootQuery
  })
  