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
    username: '',
    password: '',
    error: '',
  }
  _isMounted = false;

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleLogin = async (event, login) => {
    event.preventDefault();
    const { username, password } = this.state;
    if(this._isMounted) {
      this.setState({ validate: true });
    }
    await login({ variables: { username, password } })
      .then(response => this.handleLoginSuccess(response))
      .catch(err => this.handleLoginFail(err.graphQLErrors[0].message))
  }
  
  handleLoginSuccess = response => {
    localStorage.setItem(AUTH_TOKEN, JSON.stringify(response.data.login));
    this.props.history.push('/profile');
    if(this._isMounted) {
      this.setState({
        validate: false,
        username: '',
        password: '',
        error: '',
      });
    }
    this.props.history.push('/profile');
  }

  handleLoginFail = err => {
    const error = err.split('_').join(' ').toUpperCase();

    if(this._isMounted) {
      this.setState({ 
        validate: true, 
        loading: false, 
        error ,
      });
    }
  }

  handleUsername = username => {
    this.setState({ username });
  }

  handlePassword = password => {
    this.setState({ password });
  }

  renderMessage(loading, error) {
    if (error) {
      return (
        <Alert variant="danger">
          {this.state.error}
        </Alert>
      )
    } else if (loading) {
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
        {(login, { loading, error }) => (
          <div className="container">
          <Form 
            method="POST" 
            noValidate
            validated={validate}
            onSubmit={(event) => this.handleLogin(event, login)}
          >
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
            {this.renderMessage(loading, error)}
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
