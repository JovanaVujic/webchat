import React, { Component } from 'react';

class WebChatMessage extends Component {
  render() {
    const { message, position } = this.props;

    return (
      <div>
        <img
          src="images/users/user-2.jpg"
          alt=""
          className={'profile-photo-sm ' + position}
        />
        <div className="chat-item">
          <div className="chat-item-header">
            <h5>{message.sender.name}</h5>
            <small className="text-muted">{message.date}</small>
          </div>
          <p>{message.text}</p>
        </div>
      </div>
    );
  }
}

export default WebChatMessage;
