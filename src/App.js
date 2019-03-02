import React, { Component } from 'react';
import { ApolloProvider } from 'react-apollo'
import ApolloClient from 'apollo-boost';

import Router from './components/Router';
import { domain } from './config/app.json'

const client = new ApolloClient({
  uri: `${domain.env.siteUrl}/graphql`
})

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Router />
      </ApolloProvider>
    );
  }
}

export default App;
