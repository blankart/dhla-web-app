const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateEditProfile(data) {
  let errors = {};

  data.firstName = !isEmpty(data.firstName) ? data.firstName : "";
  data.lastName = !isEmpty(data.lastName) ? data.lastName : "";
  data.middleName = !isEmpty(data.middleName) ? data.middleName : "";
  data.suffix = !isEmpty(data.suffix) ? data.suffix : "";
  data.imageUrl = !isEmpty(data.imageUrl) ? data.imageUrl : "";
  data.contactNum = !isEmpty(data.contactNum) ? data.contactNum : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.nickname = !isEmpty(data.nickname) ? data.nickname : "";
  data.address = !isEmpty(data.address) ? data.address : "";
  data.bday = !isEmpty(data.bday) ? data.bday : "";
  data.sex = !isEmpty(data.sex) ? data.sex : "";

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

  if (
    !Validator.isLength(data.nickname, {
      min: 2,
      max: 255
    })
  ) {
    errors.nickname = "Nickname must be between 2 and 255 characters";
  }

  if (
    !Validator.isLength(data.address, {
      min: 2,
      max: 255
    })
  ) {
    errors.address = "Middle name must be between 2 and 255 characters";
  }

  if (
    !Validator.isLength(data.contactNum, {
      min: 11,
      max: 11
    })
  ) {
    errors.contactNum = "Contact number must be exactly 11 digits";
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
  if (Validator.isEmpty(data.imageUrl)) {
    errors.imageUrl = "Image Url field is required";
  }
  if (Validator.isEmpty(data.contactNum)) {
    errors.contactNum = "Contact number field is required";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }

  if (Validator.isEmpty(data.nickname)) {
    errors.nickname = "Nickname field is required";
  }
  if (Validator.isEmpty(data.address)) {
    errors.address = "Address field is required";
  }
  if (Validator.isEmpty(data.bday)) {
    errors.bday = "Birthday field is required";
  }
  if (Validator.isEmpty(data.sex)) {
    errors.sex = "Sex field is required";
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
