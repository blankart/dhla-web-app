const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = validateEditProfileParent = data => {
  let errors = {};

  data.firstName = !isEmpty(data.firstName) ? data.firstName : "";
  data.lastNane = !isEmpty(data.lastNane) ? data.lastNane : "";
  data.middleName = !isEmpty(data.middleName) ? data.middleName : "";
  data.suffix = !isEmpty(data.suffix) ? data.suffix : "";
  data.nickname = !isEmpty(data.nickname) ? data.nickname : "";
  data.contactNum = !isEmpty(data.contactNum) ? data.contactNum : "";
  data.address = !isEmpty(data.address) ? data.address : "";
  data.province = !isEmpty(data.province) ? data.province : "";
  data.city = !isEmpty(data.city) ? data.city : "";
  data.region = !isEmpty(data.region) ? data.region : "";
  data.zipcode = !isEmpty(data.zipcode) ? data.zipcode : "";
  data.civilStatus = !isEmpty(data.civilStatus) ? data.civilStatus : "";
  data.sex = !isEmpty(data.sex) ? data.sex : "";
  data.citizenship = !isEmpty(data.citizenship) ? data.citizenship : "";
  data.birthDate = !isEmpty(data.birthDate) ? data.birthDate : "";
  data.birthPlace = !isEmpty(data.birthPlace) ? data.birthPlace : "";
  data.religion = !isEmpty(data.religion) ? data.religion : "";
  data.emergencyName = !isEmpty(data.emergencyName) ? data.emergencyName : "";
  data.emergencyAddress = !isEmpty(data.emergencyAddress)
    ? data.emergencyAddress
    : "";
  data.emergencyTelephone = !isEmpty(data.emergencyTelephone)
    ? data.emergencyTelephone
    : "";
  data.emergencyCellphone = !isEmpty(data.emergencyCellphone)
    ? data.emergencyCellphone
    : "";
  data.emergencyEmail = !isEmpty(data.emergencyEmail)
    ? data.emergencyEmail
    : "";
  data.emergencyRelationship = !isEmpty(data.emergencyRelationship)
    ? data.emergencyRelationship
    : "";
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
    !Validator.isLength(data.suffix, {
      min: 2,
      max: 10
    })
  ) {
    errors.suffix = "Suffix must be between 2 and 10 characters";
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

  if (
    !Validator.isLength(data.province, {
      min: 2,
      max: 20
    })
  ) {
    errors.province = "Province must be between 2 and 20 characters";
  }

  if (
    !Validator.isLength(data.city, {
      min: 2,
      max: 25
    })
  ) {
    errors.city = "City must be between 2 and 25 characters";
  }

  if (
    !Validator.isLength(data.zipcode, {
      min: 4,
      max: 4
    })
  ) {
    errors.zipcode = "Postal code must be exactly 4 digits";
  }
  if (
    !Validator.isLength(data.region, {
      min: 2,
      max: 15
    })
  ) {
    errors.region = "Region must be between 2 and 15 characters";
  }
  if (
    !Validator.isLength(data.citizenship, {
      min: 2,
      max: 20
    })
  ) {
    errors.citizenship = "Citizenship must be between 2 and 20 characters";
  }

  if (
    !Validator.isLength(data.birthPlace, {
      min: 2,
      max: 25
    })
  ) {
    errors.birthPlace = "Birth place must be between 2 and 25 characters";
  }

  if (
    !Validator.isLength(data.religion, {
      min: 2,
      max: 20
    })
  ) {
    errors.religion = "Religion must be between 2 and 20 characters";
  }

  if (
    !Validator.isLength(data.emergencyName, {
      min: 2,
      max: 30
    })
  ) {
    errors.emergencyName = "Contact person be between 2 and 30 characters";
  }

  if (
    !Validator.isLength(data.emergencyAddress, {
      min: 2,
      max: 50
    })
  ) {
    errors.emergencyAddress = "Contact address be between 2 and 50 characters";
  }

  if (
    !Validator.isLength(data.emergencyTelephone, {
      min: 2,
      max: 50
    })
  ) {
    errors.emergencyTelephone =
      "Contact telephone no. be between 2 and 50 characters";
  }

  if (
    !Validator.isLength(data.emergencyCellphone, {
      min: 2,
      max: 50
    })
  ) {
    errors.emergencyCellphone =
      "Contact cellphone no. be between 2 and 50 characters";
  }

  if (
    !Validator.isLength(data.emergencyEmail, {
      min: 2,
      max: 30
    })
  ) {
    errors.emergencyEmail = "Contact email be between 2 and 30 characters";
  }

  if (
    !Validator.isLength(data.emergencyRelationship, {
      min: 2,
      max: 15
    })
  ) {
    errors.emergencyRelationship =
      "Contact relationship no. be between 2 and 15 characters";
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

  if (Validator.isEmpty(data.suffix)) {
    errors.suffix = "Suffix field is required";
  }
  if (Validator.isEmpty(data.contactNum)) {
    errors.contactNum = "Contact number field is required";
  }

  if (Validator.isEmpty(data.nickname)) {
    errors.nickname = "Nickname field is required";
  }
  if (Validator.isEmpty(data.address)) {
    errors.address = "Address field is required";
  }
  if (Validator.isEmpty(data.province)) {
    errors.province = "Province field is required";
  }

  if (Validator.isEmpty(data.city)) {
    errors.city = "City field is required";
  }

  if (Validator.isEmpty(data.region)) {
    errors.region = "Region field is required";
  }

  if (Validator.isEmpty(data.zipcode)) {
    errors.zipcode = "Postal code field is required";
  }

  if (Validator.isEmpty(data.citizenship)) {
    errors.citizenship = "Citizenship field is required";
  }

  if (Validator.isEmpty(data.birthPlace)) {
    errors.birthPlace = "Birth place field is required";
  }

  if (Validator.isEmpty(data.religion)) {
    errors.religion = "Religion field is required";
  }

  if (Validator.isEmpty(data.emergencyName)) {
    errors.emergencyName = "Contact person field is required";
  }

  if (Validator.isEmpty(data.emergencyAddress)) {
    errors.emergencyAddress = "Contact address field is required";
  }

  if (Validator.isEmpty(data.emergencyTelephone)) {
    errors.emergencyTelephone = "Contact telephone no. field is required";
  }

  if (Validator.isEmpty(data.emergencyCellphone)) {
    errors.emergencyCellphone = "Contact cellphone no. field is required";
  }

  if (Validator.isEmpty(data.emergencyEmail)) {
    errors.emergencyEmail = "Contact email field is required";
  }

  if (Validator.isEmpty(data.emergencyRelationship)) {
    errors.emergencyRelationship = "Contact relationship field is required";
  }

  if (!Validator.isEmail(data.emergencyEmail)) {
    errors.emergencyEmail = "Email is invalid";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
