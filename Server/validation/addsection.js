const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateAddSection(data) {
  let errors = {};

  data.sectionName = !isEmpty(data.sectionName) ? data.sectionName : "";

  if (!Validator.isLength(data.sectionName, { min: 2, max: 255 })) {
    errors.sectionName = "Section name must be between 2 and 255 characters";
  }

  if (Validator.isEmpty(data.sectionName)) {
    errors.sectionName = "Section name field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
