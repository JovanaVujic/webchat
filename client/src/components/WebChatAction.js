import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { sendMessage, sendReply, deleteChat } from '../actions/messageActions';

import InputField from './common/InputField';

class WebChatAction extends Component {
  constructor() {
    super();
    this.state = {
      text: '',
      typing: '',
      errors: {}
    };

    this.changeHandler = this.changeHandler.bind(this);
    this.keyDownHandler = this.keyDownHandler.bind(this);
    this.blurHandler = this.blurHandler.bind(this);
    this.onSubmit = this.submitHandler.bind(this);
  }

  componentDidMount = () => {
    const { socket } = this.props;

    socket.on('typing', data => {
      this.setState({ typing: data });
    });

    socket.on('stop typing', () => {
      this.setState({ typing: '' });
    });
  };

  componentWillUnmount = () => {
    const { socket } = this.props;
    socket.off('typing');
    socket.off('stop typing');
    socket.off('new message');
  };

  changeHandler = e => {
    this.setState({ text: e.target.value });
  };

  keyDownHandler = e => {
    const { socket, recipient, auth } = this.props;
    let chat = {};
    chat.chatroom = { user1: recipient.name, user2: auth.user.name };
    chat.username = auth.user.name;
    socket.emit('typing', chat);
  };

  blurHandler = e => {
    const { socket, recipient, auth } = this.props;
    socket.emit('stop typing', { user1: recipient.name, user2: auth.user.name });
  };

  submitHandler = e => {
    e.preventDefault();
    const { socket, recipient, auth } = this.props;

    const newMessage = {
      text: this.state.text
    };

    this.props.sendMessage(recipient._id, newMessage);
    socket.emit('new message', { text: this.state.text, to: recipient, from: auth });

    this.setState({ text: '' });
  };

  render() {
    const { errors } = this.props;
    return (
      <div className="send-message">
        <div className="user-typing">{this.state.typing}</div>
        <div className="input-group">
          <form onSubmit={this.submitHandler}>
            <InputField
              placeholder="Send message"
              name="text"
              value={this.state.text}
              onChange={this.changeHandler}
              onKeyDown={this.keyDownHandler}
              onBlur={this.blurHandler}
              error={errors.text}
            />
            <input type="submit" className="btn btn-send btn-block" />
          </form>
        </div>
      </div>
    );
  }
}

WebChatAction.propTypes = {
  sendReply: PropTypes.func.isRequired,
  deleteChat: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  message: state.message.message
});

export default connect(
  mapStateToProps,
  {
    sendMessage,
    sendReply,
    deleteChat
  }
)(WebChatAction);
