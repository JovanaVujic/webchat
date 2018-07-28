const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function chatValidation(data) {
  let errors = {};

  data.recipient = !isEmpty(data.recipient) ? data.recipient : '';
  data.text = !isEmpty(data.text) ? data.text : '';

  if (Validator.isEmpty(data.recipient)) {
    errors.recipient = 'Recipient is required.';
  }

  if (Validator.isEmpty(data.text)) {
    errors.text = 'Message is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
