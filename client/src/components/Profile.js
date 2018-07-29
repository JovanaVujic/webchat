import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../actions/authActions";
import isEmpty from "../validation/is-empty";
import avatar from "./common/avatar.jpg";

class Profile extends Component {
  logoutHandler = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  render() {
    const { user } = this.props.auth;
    const { profile } = this.props;

    let profileContent;

    // Check if logged in user has profile data
    if (Object.keys(profile).length > 0) {
      profileContent = (
        <div>
          <img
            src={isEmpty(profile.avatar) ? avatar : profile.avatar}
            style={{ margin: "auto", display: "block" }}
            alt="Avatar"
          />
          {profile.status}
        </div>
      );
    } else {
        profileContent = (<div>
        <img
          src={avatar}
          style={{ margin: "auto", display: "block" }}
          alt="Avatar"
        />
      </div>);
    }

    return (
      <div>
        {user.name}
        {profileContent}
        <a href="" onClick={this.logoutHandler.bind(this)}>
          Logout
        </a>
      </div>
    );
  }
}

Profile.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(Profile);
