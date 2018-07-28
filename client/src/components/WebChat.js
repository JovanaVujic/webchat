import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  getCurrentProfile,
  getProfiles,
  createProfile
} from '../actions/profileActions';

import Loader from './common/Loader';
import InputField from './common/InputField';

import Profile from './Profile';
import WebChatRoom from './WebChatRoom';

class WebChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayEditForm: false,
      avatar: '',
      status: '',
      errors: {}
    };

    this.onChange = this.changeHandler.bind(this);
    this.onSubmit = this.submitHandler.bind(this);
  }

  componentDidMount = () => {
    this.props.getCurrentProfile();
    this.props.getProfiles();
  };

  changeHandler = e => {
    switch (e.target.name) {
      case 'avatar':
        this.setState({ [e.target.name]: e.target.files[0] });
        break;
      default:
        this.setState({ [e.target.name]: e.target.value });
    }
  };

  submitHandler = e => {
    e.preventDefault();

    const profileData = new FormData();
    profileData.append('avatar', this.state.avatar);
    profileData.append('status', this.state.status);

    this.props.createProfile(profileData);

    this.setState({
      displayEditForm: false,
      avatar: '',
      status: ''
    });
  };

  render() {
    const { errors, displayEditForm } = this.state;
    const { profile, profiles, loading } = this.props.profile;

    let webChatContent;
    let profileContent;
    let editFormContent;

    if (profile === null || loading) {
      profileContent = <Loader />;
    } else {
      if (displayEditForm) {
        editFormContent = (
          <form noValidate onSubmit={this.submitHandler}>
            <InputField
              placeholder="Status"
              name="status"
              value={this.state.status}
              onChange={this.changeHandler}
              error={errors.status}
            />
            <InputField
              placeholder="Avatar"
              name="avatar"
              type="file"
              value={this.state.avatar}
              onChange={this.changeHandler}
              error={errors.avatar}
            />
            <button type="submit">
              Save
              <i className="fas fa-briefcase btn-icon" />
            </button>
          </form>
        );
      }
      profileContent = (
        <div>
          <Profile profile={profile} />
          <button
            type="button"
            onClick={() =>
              this.setState(prevState => ({
                displayEditForm: !prevState.displayEditForm
              }))
            }
            className={displayEditForm ? 'd-none' : ''}
          >
            <i className="fas fa-pencil-alt" />
          </button>
          {editFormContent}
        </div>
      );

      if (profiles === null || loading) {
        webChatContent = <Loader />;
      } else {
        webChatContent = <WebChatRoom profiles={profiles} />;
      }
    }

    return (
      <div>
        {this.state.message}
        {profileContent}
        <div className="container">
          <div className="row">
            <div className="chat-room">{webChatContent}</div>
          </div>
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
