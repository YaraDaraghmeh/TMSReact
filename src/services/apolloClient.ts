// src/services/apolloClient.ts
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

const apolloClient = new ApolloClient({ // تغيير اسم المتغير
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

export default apolloClient; // استخدام التصدير الافتراضي