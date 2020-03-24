const express = require("express");
const router = express.Router();
const UserAccount = require("../../models/UserAccount");
const passport = require("passport");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

// Input Validation
const validateEditProfileNonacademic = require("../../validation/editprofilenonacademic");

//Import Utility Functions
const utils = require("../../utils");

// @route POST api/director/updateprofile
// @desc Update profile
// @access Private

router.post(
  "/updateprofile",
  passport.authenticate("director", { session: false }),
  (req, res) => {
    const {
      firstName,
      lastName,
      middleName,
      suffix,
      nickname,
      contactNum,
      address,
      province,
      city,
      region,
      zipcode,
      civilStatus,
      sex,
      citizenship,
      birthDate,
      birthPlace,
      religion,
      emergencyName,
      emergencyAddress,
      emergencyTelephone,
      emergencyCellphone,
      emergencyEmail,
      emergencyRelationship
    } = req.body;

    const { errors, isValid } = validateEditProfileNonacademic(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    UserAccount.findOne({
      where: {
        accountID: req.user.accountID
      }
    }).then(user => {
      if (user) {
        user
          .update({
            firstName,
            lastName,
            middleName,
            suffix,
            nickname,
            contactNum,
            address,
            province,
            city,
            region,
            zipcode,
            civilStatus,
            sex,
            citizenship,
            birthDate,
            birthPlace,
            religion,
            emergencyName,
            emergencyAddress,
            emergencyTelephone,
            emergencyCellphone,
            emergencyEmail,
            emergencyRelationship
          })
          .then(user2 => {
            res.status(200).json({ msg: "Profile updated successfully!" });
          });
      }
    });
  }
);

module.exports = router;
