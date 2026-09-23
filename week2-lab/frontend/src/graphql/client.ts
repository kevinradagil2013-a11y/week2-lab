import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';

const API_URL =
  import.meta.env.VITE_API_URL ??
  'http://localhost:3106';

export const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: `${API_URL}/graphql`,
  }),
  cache: new InMemoryCache(),
});