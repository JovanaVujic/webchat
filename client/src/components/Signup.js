import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { signupUser } from "../actions/authActions";
import InputField from "./common/InputField";

class Signup extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      password: "",
      password2: "",
      errors: {}
    };

    this.changeHandler = this.changeHandler.bind(this);
    this.onSubmit = this.submitHandler.bind(this);
  }

  componentDidMount = () => {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/webchat");
    }
  };

  componentWillReceiveProps = nextProps => {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  };

  changeHandler = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  submitHandler = e => {
    e.preventDefault();

    const newUser = {
      name: this.state.name,
      password: this.state.password,
      password2: this.state.password2
    };

    this.props.signupUser(newUser, this.props.history);
  };

  render() {
    const { errors } = this.state;

    return (
      <div className="container">
        <div className="row">
          <div className="col-md-8 m-auto">
            <h2 className="display-4 text-center">Sign up</h2>

            <form noValidate onSubmit={this.submitHandler}>
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
              <InputField
                placeholder="Confirm Password"
                name="password2"
                type="password"
                value={this.state.password2}
                onChange={this.changeHandler}
                error={errors.password2}
                icon="fas fa-key"
              />
              <input type="submit" className="btn btn-info btn-block mt-4" />
            </form>
            <p className="mt-3">
              Already have an account?
              <Link to="/login" className="font-weight-bold">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

Signup.propTypes = {
  signupUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { signupUser }
)(withRouter(Signup));
