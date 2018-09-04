import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import isEmpty from '../validation/is-empty';

import { getCurrentProfile, getProfiles, createProfile } from '../actions/profileActions';

import Loader from './common/Loader';
import InputField from './common/InputField';
import UploadField from './common/UploadField';

import Profile from './Profile';
import WebChatRoom from './WebChatRoom';

const socket = io();

class WebChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayEditForm: false,
      avatar: '',
      status: '',
      messageOnOff: '',
      onoffStatus: '',
      updateProfile: '',
      doReload: false,
      errors: {}
    };

    this.onChange = this.changeHandler.bind(this);
    this.onSubmit = this.submitHandler.bind(this);
  }

  /**
   * Component lifecycle hook when component did mount (inserted into the DOM tree)
   * It will trigger an extra rendering, but it will happen before the browser updates the screen.
   * This guarantees that even though the render() will be called twice in this case,
   * the user won’t see the intermediate state.
   */
  componentDidMount = () => {
    this.props.getCurrentProfile();
    this.props.getProfiles();

    socket.on('user joined', data => this.socketHandler(data.username, 'online'));

    socket.on('user left', data => this.socketHandler(data.username, 'offline'));
  };

  /**
   * Component update hook is invoked immediately after updating occurs
   */
  componentWillUpdate = () => {
    if (this.state.updateProfile !== '') {
      let onoff = this.state.onoffStatus === 'offline' ? false : true;
      this.updateProfileHandler(this.state.updateProfile, onoff);
    }
  };

  updateProfileHandler = (username, isOnline) => {
    const { profiles } = this.props.profile;

    profiles.forEach(profile => {
      if (profile.user.name === username) {
        profile.user.isOnline = isOnline;
        this.doReload();
        return;
      }
    });
  };

  doReload = () => {
    this.setState({ doReload: !this.state.doReload });
  };

  /**
   * Component lifecycle hook when component is unmounted and destroyed
   */
  componentWillUnmount = () => {
    socket.off('user joined');
    socket.off('user left');
  };

  changeHandler = e => {
    switch (e.target.name) {
      case 'avatar':
        this.setState({ avatar: e.target.files[0] });
        break;
      default:
        this.setState({ status: e.target.value });
    }
  };

  submitHandler = e => {
    e.preventDefault();

    const profileData = new FormData();
    profileData.append('avatar', this.state.avatar);
    profileData.append('status', this.state.status);

    this.props.createProfile(profileData);

    this.setState({
      avatar: '',
      status: ''
    });
  };

  closeBoxHandler = e => {
    e.preventDefault();
    this.setState({ displayEditForm: false });
  };

  socketHandler = (username, onoff) => {
    if (username !== this.props.auth.user.name) {
      this.setUserMessage(username, onoff);
    }

    this.setState({ updateProfile: '' });

    setTimeout(() => {
      this.setState({ messageOnOff: '' });
    }, 5000);
  };

  setUserMessage = (name, status) => {
    this.setState({
      onoffStatus: status,
      messageOnOff: 'User ' + name + ' is ' + status,
      updateProfile: name
    });
  };

  render() {
    const { errors, displayEditForm, messageOnOff, onoffStatus, doReload } = this.state;
    const { profile, profiles, loading } = this.props.profile;

    let webChatContent;
    let profileContent;
    let editFormContent;
    let hasProfile = false;

    if (profile === null || loading) {
      profileContent = <Loader />;
    } else {
      if (!isEmpty(profile)) hasProfile = true;

      if (displayEditForm) {
        editFormContent = (
          <div className="edit-profile-form">
            <a href="" className="close-box" onClick={this.closeBoxHandler.bind(this)}>
              X
            </a>
            <form noValidate onSubmit={this.submitHandler}>
              <InputField
                placeholder="Status"
                name="status"
                value={this.state.status}
                onChange={this.changeHandler}
                error={errors.status}
              />
              <UploadField placeholder="Avatar" name="avatar" value={this.state.avatar} onChange={this.changeHandler} />
              <button type="submit" className="btn btn-info btn-block">
                Save
              </button>
            </form>
          </div>
        );
      }
      profileContent = (
        <div className="webchat">
          <Profile profile={profile} socket={socket} />
          <button
            type="button"
            onClick={() =>
              this.setState(prevState => ({
                displayEditForm: !prevState.displayEditForm
              }))
            }
            className={'btn btn-link btn-profile-action'}
          >
            {!hasProfile ? 'Create Profile' : 'Edit Profile'}
          </button>
          {editFormContent}
        </div>
      );

      webChatContent = hasProfile ? <WebChatRoom profiles={profiles} socket={socket} reload={doReload} /> : null;
    }

    return (
      <div>
        {profileContent}
        <div className="webchatroom">
          <div className="chat-room container">{webChatContent}</div>
          <div className={'chat-user fade show ' + onoffStatus}>{messageOnOff}</div>
        </div>
      </div>
    );
  }
}

WebChat.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  getProfiles: PropTypes.func.isRequired,
  createProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { getCurrentProfile, getProfiles, createProfile }
)(WebChat);
