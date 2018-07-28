import React, { Component } from 'react';
import isEmpty from '../validation/is-empty';
import avatar from './common/avatar.jpg';
import io from 'socket.io-client';

class WebChatContact extends Component {
  render() {
    const { profile } = this.props;

    return (
      <div className="contact">
        <img
          src={isEmpty(profile.avatar) ? avatar : profile.avatar}
          alt={profile.user.name}
          className="profile-photo-sm float-left"
        />
        <div className="msg-preview">
          <h6>{profile.user.name}</h6>
          <p className="text-muted">{profile.status}</p>
          <small className="text-muted">a min ago</small>
          <div className="chat-alert">1</div>
        </div>
      </div>
    );
  }
}

export default WebChatContact;
