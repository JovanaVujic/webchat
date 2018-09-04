import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isEmpty from '../validation/is-empty';

import { getChatHistory } from '../actions/messageActions';

import WebChatContact from './WebChatContact';
import WebChatMessage from './WebChatMessage';
import WebChatAction from './WebChatAction';

class WebChatRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recipient: '',
      message: '',
      currentChat: '',
      numberOfUsers: '',
      numUnreadMsg: 0,
      chatroom: {},
      errors: {}
    };
  }

  componentDidMount = () => {
    const { socket } = this.props;

    socket.on('refresh message', chat => {
      if (chat.from.user.id === this.state.recipient._id) {
        let message = {};
        message.sender = chat.from.user;
        message.date = Date.now();
        message.text = chat.text;
        this.setState({ message: message });

        //this.props.getChatHistory(this.state.recipient._id);
      } else {
        console.log(this.state.recipient);
        this.setState({ numUnreadMsg: ++this.state.numUnreadMsg });
      }
    });
  };

  clickHandler = (recipient, i) => {
    const { socket } = this.props;

    if (!isEmpty(this.state.chatroom)) {
      socket.emit('leave chat', this.state.chatroom);
    }

    //create room with name createded with recipient and user name
    let chatroom = {
      user1: recipient.name,
      user2: this.props.auth.user.name
    };
    this.setState({ chatroom });
    socket.emit('join chat', chatroom);

    this.setState({ recipient, currentChat: i, numUnreadMsg: 0, message: '' });
    this.props.getChatHistory(recipient._id);
  };

  render() {
    const { profiles, socket } = this.props;
    const { recipient, chatroom, numUnreadMsg, message } = this.state;
    const { messages } = this.props.message;
    const { user } = this.props.auth;

    let visibility = recipient === '' ? 'd-none' : '';

    let contactContent;
    let messagesContent;
    let newMessage;

    if (profiles.length > 0) {
      let contactContentList = profiles.map((profile, i) => (
        <li key={i}>
          <a
            onClick={this.clickHandler.bind(this, profile.user, i)}
            className={(profile.user.isOnline ? '' : 'offline') + (i === this.state.currentChat ? ' active' : '')}
          >
            <WebChatContact profile={profile} numUnreadMsg={numUnreadMsg} recipient={recipient} />
          </a>
        </li>
      ));
      contactContent = <ul className="nav contact-list">{contactContentList}</ul>;
    } else {
      contactContent = <h5 className="mt-3">No profiles found...</h5>;
    }

    if (message !== '') {
      newMessage = (
        <li className={message.id !== user.id ? 'left' : 'right'}>
          <WebChatMessage message={message} position={message.id !== user.id ? 'float-left' : 'float-right'} />
        </li>
      );
    }

    if (messages && messages.length) {
      let messagesContentList = messages.map((message, i) => (
        <li className={message.sender._id !== user.id ? 'left' : 'right'} key={i}>
          <WebChatMessage message={message} position={message.sender._id !== user.id ? 'float-left' : 'float-right'} />
        </li>
      ));
      messagesContent = (
        <ul className="chat-message">
          {newMessage}
          {messagesContentList}
        </ul>
      );
    } else {
      if (newMessage !== '') {
        messagesContent = <ul className="chat-message">{newMessage}</ul>;
      } else {
        messagesContent = <h5 className="mt-3">No messages found...</h5>;
      }
    }

    return (
      <div>
        <div className="row">
          <div className="col-md-5 scroller">{contactContent}</div>
          <div className="col-md-7 scroller">
            {this.state.numberOfUsers}
            <div className="active">
              <div className="chat-body">{messagesContent}</div>
            </div>
          </div>
        </div>
        <div className={'row float-right ' + visibility}>
          <WebChatAction recipient={recipient} socket={socket} chatroom={chatroom} />
        </div>
      </div>
    );
  }
}

WebChatRoom.propTypes = {
  getChatHistory: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  message: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  message: state.message,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {
    getChatHistory
  }
)(WebChatRoom);
