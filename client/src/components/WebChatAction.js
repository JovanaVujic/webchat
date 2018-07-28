import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import io from 'socket.io-client';

import { createChat, sendReply, deleteChat } from '../actions/messageActions';

import InputField from './common/InputField';

const socket = io();

class WebChatAction extends Component {
  constructor() {
    super();
    this.state = {
      text: '',
      errors: {}
    };

    this.changeHandler = this.changeHandler.bind(this);
    this.onSubmit = this.submitHandler.bind(this);
  }

  changeHandler = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  submitHandler = e => {
    e.preventDefault();

    const newMessage = {
      text: this.state.text
    };

    this.props.createChat(this.props.recipient._id, newMessage);

    newMessage.room = this.props.recipient._id;

    socket.emit('new_message', newMessage);
  };

  render() {
    const { errors } = this.props;
    return (
      <div className="send-message">
        <div className="input-group">
          <form onSubmit={this.submitHandler}>
            <InputField
              placeholder="Send message"
              name="text"
              value={this.state.text}
              onChange={this.changeHandler}
              error={errors.text}
            />
            <input type="submit" className="btn btn-info btn-block mt-4" />
          </form>
        </div>
      </div>
    );
  }
}

WebChatAction.propTypes = {
  createChat: PropTypes.func.isRequired,
  sendReply: PropTypes.func.isRequired,
  deleteChat: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors
});

export default connect(
  mapStateToProps,
  {
    createChat,
    sendReply,
    deleteChat
  }
)(WebChatAction);
