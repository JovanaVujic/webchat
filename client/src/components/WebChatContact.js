import React, { Component } from 'react';
import isEmpty from '../validation/is-empty';
import avatar from './common/avatar.jpg';

class WebChatContact extends Component {
  render() {
    const { profile, recipient, numUnreadMsg } = this.props;

    let alertContent = null;

    if (profile.user._id === recipient._id) {
      alertContent = numUnreadMsg === 0 ? null : <div className="chat-alert">{numUnreadMsg}</div>;
    }

    return (
      <div className="contact">
        <img
          src={isEmpty(profile.avatar) ? avatar : profile.avatar}
          alt={profile.user.name}
          className="profile-photo-sm float-left"
        />
        <div className="msg-preview">
          <h6>{profile.user.name}</h6>
          <p>{profile.status}</p>
          {alertContent}
        </div>
      </div>
    );
  }
}

export default WebChatContact;
