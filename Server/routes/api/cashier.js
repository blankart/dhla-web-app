const express = require("express");
const router = express.Router();
const UserAccount = require("../../models/UserAccount");
const AccountNotice = require("../../models/AccountNotice");
const passport = require("passport");

// Input Validation
const validateCreateAccount = require("../../validation/createaccount");
const validateEditProfileNonacademic = require("../../validation/editprofilenonacademic");

//Import Utility Functions
const utils = require("../../utils");

// @route POST api/cashier/updateprofile
// @desc Update profile
// @access Private

router.post(
  "/updateprofile",
  passport.authenticate("cashier", {
    session: false
  }),
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

    console.log(req.body.firstName);

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

// @route POST api/cashier/getallstudents
// @desc Get all students from a keyword
// @access Private

router.post(
  "/getallstudents",
  passport.authenticate("cashier", { session: false }),
  async (req, res) => {
    let { page, pageSize, keyword } = req.body;
    page = page - 1;
    let offset = page * pageSize;
    let limit = offset + pageSize;

    UserAccount.findAll({
      limit,
      offset,
      where: {
        accountID: 4,
        [Op.or]: [
          {
            firstName: {
              [Op.like]: `%${keyword}%`
            }
          },
          {
            lastName: {
              [Op.like]: `%${keyword}%`
            }
          }
        ]
      }
    })
      .then(users => {
        let accountData = [];
        if (users.length != 0) {
          users.slice(0, pageSize).forEach(async (user, key, arr) => {
            const keyID = user.accountID;
            const email = user.email;
            const name =
              utils.capitalize(user.firstName) +
              " " +
              utils.capitalize(user.lastName);
            const position = utils.displayPosition(user.position);
            const imageUrl = user.imageUrl;
            const isActive = user.isActive;
            accountData.push({
              key: keyID,
              email,
              name,
              position,
              imageUrl,
              isActive
            });
            console.log(key + " User account");
            if (key == arr.length - 1) {
              UserAccount.findAndCountAll({
                where: {
                  accountID: {
                    [Op.ne]: 1
                  },
                  [Op.or]: [
                    {
                      firstName: {
                        [Op.like]: `%${keyword}%`
                      }
                    },
                    {
                      lastName: {
                        [Op.like]: `%${keyword}%`
                      }
                    }
                  ]
                }
              })
                .then(count => {
                  accountData.sort((a, b) => (a.key > b.key ? 1 : -1));
                  res.status(200).json({
                    numOfPages: Math.ceil(count.count / pageSize),
                    accountList: accountData
                  });
                })
                .catch(err => {
                  res.status(404);
                });
            }
          });
        } else {
          res.status(404).json({ msg: "Not found" });
        }
      })
      .catch(err => {
        res.status(404);
      });
  }
);

// @route POST api/cashier/restrict
// @desc Restrict an account
// @access Private

router.post(
  "/restrict",
  passport.authenticate("cashier", {
    session: false
  }),
  (req, res) => {
    const { accountID, message } = req.body;
    UserAccount.findOne({
      where: {
        accountID
      }
    }).then(user => {
      if (!user) {
        errors.email = "User account not found";
        res.status(404).json(errors);
      } else {
        user.update({ isActive: false }).then(() => {
          AccountNotice.create({ accountID, message }).then(accountnotice => {
            res.status(200).json({ msg: "Account restricted succesfully!" });
          });
        });
      }
    });
  }
);

// @route POST api/cashier/unrestrict
// @desc Unrestrict an account
// @access Private

router.post(
  "/unrestrict",
  passport.authenticate("cashier", {
    session: false
  }),
  (req, res) => {
    const { accountID } = req.body;
    UserAccount.findOne({
      where: {
        accountID
      }
    }).then(user => {
      if (!user) {
        errors.email = "User account not found";
        res.status(404).json(errors);
      } else {
        user.update({ isActive: true }).then(() => {
          AccountNotice.findOne({ where: { accountID } }).then(
            accountnotice => {
              if (accountnotice) {
                accountnotice.destroy().then(() => {
                  res
                    .status(200)
                    .json({ msg: "Account unrestricted successfully!" });
                });
              } else {
                res.status(404);
              }
            }
          );
        });
      }
    });
  }
);

module.exports = router;
