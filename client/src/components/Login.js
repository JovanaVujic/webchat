import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { loginUser } from './../actions/authActions';
import InputField from './common/InputField';

import io from 'socket.io-client';
const socket = io();

class Login extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      password: '',
      errors: {}
    };

    this.changeHandler = this.changeHandler.bind(this);
    this.onSubmit = this.submitHandler.bind(this);
  }

  componentDidMount = () => {
    const { auth } = this.props;

    if (auth.isAuthenticated) {
      socket.emit('login', auth.user.name);
      this.props.history.push('/webchat');
    }
  };

  componentWillReceiveProps = nextProps => {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }

    if (nextProps.auth.isAuthenticated) {
      socket.emit('login', nextProps.auth.user.name);
      this.props.history.push('/webchat');
    }

    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  };

  submitHandler = e => {
    e.preventDefault();

    const userData = {
      name: this.state.name,
      password: this.state.password
    };

    this.props.loginUser(userData);
  };

  changeHandler = e => {
    this.state.errors[e.target.name] = '';
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { errors } = this.state;

    return (
      <div className="login">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h2 className="display-4 text-center mt-4">Log In</h2>
              <form onSubmit={this.submitHandler}>
                <InputField
                  placeholder="Name"
                  name="name"
                  value={this.state.name}
                  onChange={this.changeHandler}
                  error={errors.name}
                  icon="fas fa-user"
                />

                <InputField
                  placeholder="Password"
                  name="password"
                  type="password"
                  value={this.state.password}
                  onChange={this.changeHandler}
                  error={errors.password}
                  icon="fas fa-key"
                />
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
              <p className="mt-3">
                Didn`t sign up yet?{' '}
                <Link to="/" className="font-weight-bold">
                  Signup
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { loginUser }
)(Login);
