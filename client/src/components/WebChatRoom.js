import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import {
  createChat,
  sendReply,
  deleteChat,
  getChatHistory,
  getLastChatMessages
} from '../actions/messageActions';

import WebChatContact from './WebChatContact';
import WebChatMessage from './WebChatMessage';
import WebChatAction from './WebChatAction';

const socket = io();

class WebChatRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recipient: '',
      message: '',
      messages: [],
      errors: {}
    };
  }

  /**
   * Component lifecycle hook when component did mount (inserted into the DOM tree)
   * It will trigger an extra rendering, but it will happen before the browser updates the screen.
   * This guarantees that even though the render() will be called twice in this case,
   * the user won’t see the intermediate state.
   */
  componentDidMount = () => {
    socket.on('refresh_messages', chat => {
      /*this.setState({
        messages: [...this.state.messages, message]
      });*/

      if (chat) {
        this.props.getChatHistory(chat);
      }
    });
  };

  /**
   * Component lifecycle hook when component is unmounted and destroyed
   */
  componentWillUnmount = () => {
    socket.off('refresh_messages');
  };

  clickHandler = recipient => {
    socket.emit('join_chat', recipient._id);
    this.setState({ recipient });
    // this.props.getChatHistory('5b5b714956e90e10ec41c84d');
    this.props.getLastChatMessages(recipient._id);
  };

  render() {
    const { profiles } = this.props;
    const { recipient } = this.state;
    const { messages } = this.props.message;
    const { user } = this.props.auth;

    let contactContent;
    let messagesContect;

    if (profiles.length > 0) {
      contactContent = profiles.map((profile, i) => (
        <li className={i === 0 ? 'active' : ''} key={i}>
          <a onClick={this.clickHandler.bind(this, profile.user)}>
            <WebChatContact key={profile._id} profile={profile}/>
          </a>
        </li>
      ));
    } else {
      contactContent = <h4>No profiles found...</h4>;
    }

    if (messages && messages.length) {
      messagesContect = messages.map((message, i) => (
        <li className={message.sender !== user ? 'right' : 'left'} key={i}>
          <WebChatMessage
            message={message}
            position={message.sender !== user ? 'float-right' : 'float-left'}
          />
        </li>
      ));
    } else {
      messagesContect = <h4>No messages found...</h4>;
    }

    return (
      <div className="row">
        <div className="col-md-5">
          <ul className="nav nav-tabs contact-list scrollbar-wrapper scrollbar-outer">
            {contactContent}
          </ul>
        </div>
        <div className="col-md-7">
          <div className="tab-content scrollbar-wrapper wrapper scrollbar-outer">
            <div className="tab-pane active">
              <div className="chat-body">
                <ul className="chat-message">
                  {messagesContect}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="clearfix"/>
        <WebChatAction recipient={recipient}/>
      </div>
    );
  }
}

WebChatRoom.propTypes = {
  createChat: PropTypes.func.isRequired,
  sendReply: PropTypes.func.isRequired,
  deleteChat: PropTypes.func.isRequired,
  getChatHistory: PropTypes.func.isRequired,
  getLastChatMessages: PropTypes.func.isRequired,
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
    createChat,
    sendReply,
    deleteChat,
    getChatHistory,
    getLastChatMessages
  }
)(WebChatRoom);
