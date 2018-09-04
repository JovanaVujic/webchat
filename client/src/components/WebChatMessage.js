import React, { Component } from 'react';
import Moment from 'react-moment';
import isEmpty from '../validation/is-empty';
import avatar from './common/avatar.jpg';

class WebChatMessage extends Component {
  render() {
    const { message, position } = this.props;

    return (
      <div>
        <img
          src={isEmpty(message.sender.avatar) ? avatar : message.sender.avatar}
          alt=""
          className={'profile-photo-sm ' + position}
        />
        <div className="chat-item">
          <div className="chat-item-header">
            <h5>{message.sender.name}</h5>
            <small className="text-muted">
              <Moment fromNow ago>
                {message.date}
              </Moment>{' '}
              ago
            </small>
          </div>
          <p className="chat-item-text">{message.text}</p>
        </div>
      </div>
    );
  }
}

export default WebChatMessage;
