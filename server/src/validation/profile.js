const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function profileValidation(data) {
  let errors = {};

  data.status = !isEmpty(data.status) ? data.status : "";

  if (Validator.isEmpty(data.status)) {
    errors.status = "Status field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
