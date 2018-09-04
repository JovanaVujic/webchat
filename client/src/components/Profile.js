import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from '../actions/authActions';
import { clearCurrentProfile } from '../actions/profileActions';
import isEmpty from '../validation/is-empty';
import avatar from './common/avatar.jpg';

class Profile extends Component {
  //Logout handler
  logoutHandler = e => {
    e.preventDefault();

    const { socket, auth } = this.props;

    socket.emit('logout', auth.user.name);

    this.props.clearCurrentProfile();
    this.props.logoutUser();
  };

  render() {
    const { user } = this.props.auth;
    const { profile } = this.props;

    let avatarSrc;
    let profileStatus;

    // Check if logged in user has profile data
    if (Object.keys(profile).length > 0) {
      avatarSrc = isEmpty(profile.avatar) ? avatar : profile.avatar;
      profileStatus = profile.status;
    } else {
      avatarSrc = avatar;
    }

    let avatarContent = (
      <div className="profile-avatar">
        <img src={avatarSrc} alt="Avatar" />
      </div>
    );

    return (
      <div className="container profile">
        <div className="row">
          <a href="" className="logout" onClick={this.logoutHandler.bind(this)}>
            Logout
          </a>
          <div className="profile-data">
            {avatarContent}
            <div className="profile-name">{user.name}</div>
            <div className="profile-status">{profileStatus}</div>
          </div>
        </div>
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
  { logoutUser, clearCurrentProfile }
)(Profile);
