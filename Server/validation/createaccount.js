const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateCreateAccount(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.firstName = !isEmpty(data.firstName) ? data.firstName : "";
  data.middleName = !isEmpty(data.middleName) ? data.middleName : "";
  data.lastName = !isEmpty(data.lastName) ? data.lastName : "";

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }
  if (
    !Validator.isLength(data.firstName, {
      min: 2,
      max: 255
    })
  ) {
    errors.firstName = "First name must be between 2 and 255 characters";
  }

  if (
    !Validator.isLength(data.lastName, {
      min: 2,
      max: 255
    })
  ) {
    errors.lastName = "Last name must be between 2 and 255 characters";
  }

  if (
    !Validator.isLength(data.middleName, {
      min: 2,
      max: 255
    })
  ) {
    errors.middleName = "Middle name must be between 2 and 255 characters";
  }
  if (Validator.isEmpty(data.firstName)) {
    errors.firstName = "First name field is required";
  }
  if (Validator.isEmpty(data.lastName)) {
    errors.lastName = "Last name field is required";
  }
  if (Validator.isEmpty(data.middleName)) {
    errors.middleName = "Middle name field is required";
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
