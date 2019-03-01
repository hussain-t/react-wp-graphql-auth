import React, { Component } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import { AUTH_TOKEN } from '../helper';

const LOGIN_USER = gql`
  mutation LoginUser($username: String! $password: String!) {
    login(input: {
      clientMutationId: "uniqueId"
      username: $username
      password: $password
    }) {
      authToken
      user {
        id
        userId
        name
      }
    }
  }
`

class LoginForm extends Component {
  state = {
    validate: false,
    loading: false,
    username: '',
    password: '',
    error: '',
  }

  handleLogin = async (event, login) => {
    try {
      event.preventDefault();
      const { username, password } = this.state;
      this.setState({ loading: true, validate: true, error: false });
      login({ variables: { username, password } })
    } catch (e) {
      console.log(e)
    }
  }

  // .then(user => this.handleLoginSuccess(user))
  // .catch(error => this.handleLoginFail(error))
  
  handleLoginSuccess = user => {
    localStorage.setItem(AUTH_TOKEN, JSON.stringify(user));
    console.log('user', user)
    this.setState({
      validate: false,
      loading: false,
      username: '',
      password: '',
      error: ''
    });
    this.props.history.push('/profile');
  }

  handleLoginFail = error => {
    this.setState({ validate: true, loading: false, error: 'Invslid username / password' });
  }

  handleUsername = username => {
    this.setState({ username });
  }

  handlePassword = password => {
    this.setState({ password });
  }

  renderError() {
    if (this.state.error) {
      return (
        <Alert variant="danger">
          {this.state.error}
        </Alert>
      )
    } else if (this.state.loading) {
      return (
        <Alert variant="primary">
          Loading...
        </Alert>
      )
    }
  }

  render() {
    const { validate } = this.state;
    return (
      <Mutation mutation={LOGIN_USER}>
        {(login, { loading, error, data }) => (
          <div className="container">
          <Form 
            method="POST" 
            noValidate
            validated={validate}
            onSubmit={(event) => {
              event.preventDefault();
              const { username, password } = this.state;
              this.setState({ loading: true, validate: true, error: false });
              login({ variables: { username, password } })
            }}
          >
            <p>{JSON.stringify(loading)}</p>
            <p>{JSON.stringify(error)}</p>
            <p>{JSON.stringify(data)}</p>
            <h2>React WPGraphQL Auth</h2>
            <Form.Group controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control 
                type="text" 
                required 
                placeholder="Username / Email"
                onChange={event => this.handleUsername(event.target.value)}
                value={this.state.username}
              />
              <Form.Control.Feedback type="invalid">Username cannot be empty!</Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type="password" 
                required 
                placeholder="Password"
                onChange={event => this.handlePassword(event.target.value)}
                value={this.state.password}
              />
              <Form.Control.Feedback type="invalid">Password cannot be empty!</Form.Control.Feedback>
            </Form.Group>
            {this.renderError()}
            <Button variant="primary" type="submit">
              Login
            </Button>
          </Form>
        </div>
        )}
      </Mutation>
    )
  }
}



export default LoginForm;
