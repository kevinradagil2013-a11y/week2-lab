import React from 'react';
import ReactDOM from 'react-dom/client';

import { CssBaseline } from '@mui/material';
import { ApolloProvider } from '@apollo/client/react';

import App from './App';
import { apolloClient } from './graphql/client';

ReactDOM.createRoot(
  document.getElementById('root')!,
).render(
  <React.StrictMode>
    <CssBaseline />
    <ApolloProvider client={apolloClient}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
);