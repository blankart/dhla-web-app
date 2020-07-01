const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateSubcomponent(data) {
  let errors = {};
  data.name = !isEmpty(data.name) ? data.name : "";
  if (!Validator.isLength(data.name, { min: 2, max: 255 })) {
    errors.msg = "Subcomponent name must be between 2 and 255 characters";
  }
  if (Validator.isEmpty(data.name)) {
    errors.msg = "Subcomponent name field is required";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
