const express = require("express");
const router = express.Router();
const UserAccount = require("../../models/UserAccount");
const Nonacademic = require("../../models/Nonacademic");
const Teacher = require("../../models/Teacher");
const Student = require("../../models/Student");
const ParentGuardian = require("../../models/ParentGuardian");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

// Input Validation
const validateCreateAccount = require("../../validation/createaccount");
const validateEditProfileNonacademic = require("../../validation/editprofilenonacademic");

//Import Utility Functions
const utils = require("../../utils");

// @route POST api/admin/updateprofile
// @desc Update profile
// @access Private

router.post(
  "/updateprofile",
  passport.authenticate("admin", {
    session: false,
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
      emergencyRelationship,
    } = req.body;

    const { errors, isValid } = validateEditProfileNonacademic(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    UserAccount.findOne({
      where: {
        accountID: req.user.accountID,
      },
    }).then((user) => {
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
            emergencyRelationship,
          })
          .then(() => {
            res.status(200).json({
              msg: "Profile updated successfully!",
            });
          });
      }
    });
  }
);

// @route POST api/admin/createaccount
// @desc Create an account for Director, Registrar, Teacher, Student, and Parent/Guardian
// @access Private

router.post(
  "/createaccount",
  passport.authenticate("admin", {
    session: false,
  }),
  (req, res) => {
    const { email, firstName, middleName, lastName, position } = req.body;
    const { errors, isValid } = validateCreateAccount(req.body);

    if (!isValid) {
      res.status(400).json(errors);
    } else {
      UserAccount.findOne({
        where: {
          email,
        },
      }).then((user) => {
        if (user) {
          errors.email = "Email already existss";
          res.status(400).json(errors);
        } else {
          // Default password: firstname+lastname+123
          // Still subject to change
          bcrypt.genSalt(10, (err, salt) => {
            const password = firstName + "" + lastName + "123";
            bcrypt.hash(password.toLowerCase(), salt, (err, hash) => {
              let na = "NA";
              UserAccount.create({
                email,
                password: hash,
                isActive: 1,
                position,
                firstName,
                lastName,
                middleName,
                suffix: na,
                nickname: na,
                imageUrl: na,
                contactNum: na,
                address: na,
                province: na,
                city: na,
                region: na,
                zipcode: na,
                civilStatus: "SINGLE",
                sex: "M",
                citizenship: na,
                birthDate: 0,
                birthPlace: na,
                religion: na,
                emergencyName: na,
                emergencyAddress: na,
                emergencyTelephone: na,
                emergencyCellphone: na,
                emergencyEmail: na,
                emergencyRelationship: na,
              }).then((user2) => {
                if (position == true || position == 2 || position == 6) {
                  // Create Director or Registrar Table
                  Nonacademic.create({
                    accountID: user2.accountID,
                  }).then(() => {
                    res.json({
                      msg: "Nonacademic account created successfully!",
                    });
                  });
                } else if (position == 3) {
                  // Create Teacher Table
                  Teacher.create({
                    accountID: user2.accountID,
                  }).then(() => {
                    res.json({
                      msg: "Teacher account created successfully!",
                    });
                  });
                } else if (position == 4) {
                  // Create Student Table
                  let na = "NA";
                  Student.create({
                    accountID: user2.accountID,
                    motherName: na,
                    fatherAddress: na,
                    fatherEmail: na,
                    fatherOccupation: na,
                    fatherEmployer: na,
                    fatherBusinessAdd: na,
                    fatherOfficeNum: na,
                    motherName: na,
                    motherAddress: na,
                    motherEmail: na,
                    motherOccupation: na,
                    motherEmployer: na,
                    motherBusinessAdd: na,
                    motherOfficeNum: na,
                  }).then(() => {
                    res.json({
                      msg: "Student account created successfully!",
                    });
                  });
                } else {
                  // Create Parent/Guardian Table
                  ParentGuardian.create({
                    accountID: user2.accountID,
                  }).then(() => {
                    res.json({
                      msg: "Parent/Guardian account created successfully!",
                    });
                  });
                }
              });
            });
          });
        }
      });
    }
  }
);

// @route POST api/admin/deactivate
// @desc Delete an account
// @access Private

router.post(
  "/deactivate",
  passport.authenticate("admin", {
    session: false,
  }),
  (req, res) => {
    const { accountID } = req.body;
    UserAccount.findOne({
      where: {
        accountID,
      },
    }).then((account) => {
      if (account) {
        account.destroy().then(() => {
          res.status(200).json({
            msg: "Account deleted successfully!",
          });
        });
      } else {
        res.status(404).json({
          msg: "User account not found!",
        });
      }
    });
  }
);

// @route POST api/admin/getaccounts
// @desc Get the list of accounts
// @access Private

router.post(
  "/getaccounts",
  passport.authenticate("admin", {
    session: false,
  }),
  (req, res) => {
    let { page, pageSize, keyword } = req.body;
    page = page - 1;
    let offset = page * pageSize;
    let limit = offset + pageSize;

    UserAccount.findAll({
      limit,
      offset,
      where: {
        position: {
          [Op.ne]: 0,
        },
        [Op.or]: [
          {
            firstName: {
              [Op.like]: `%${keyword}%`,
            },
          },
          {
            lastName: {
              [Op.like]: `%${keyword}%`,
            },
          },
        ],
      },
    })
      .then((users) => {
        let accountData = [];
        if (users.length != 0) {
          users.slice(0, pageSize).forEach(async (user, key, arr) => {
            const keyID = user.accountID;
            const email = user.email;
            const name = `${utils.capitalize(
              user.lastName
            )}, ${utils.capitalize(user.firstName)} ${user.middleName
              .charAt(0)
              .toUpperCase()}.`;
            const position = utils.displayPosition(user.position);
            const imageUrl = user.imageUrl;
            const isActive = user.isActive;
            accountData.push({
              key: keyID,
              email,
              name,
              position,
              imageUrl,
              isActive,
            });
            if (key == arr.length - 1) {
              UserAccount.findAndCountAll({
                where: {
                  position: {
                    [Op.ne]: 0,
                  },
                  [Op.or]: [
                    {
                      firstName: {
                        [Op.like]: `%${keyword}%`,
                      },
                    },
                    {
                      lastName: {
                        [Op.like]: `%${keyword}%`,
                      },
                    },
                  ],
                },
              })
                .then((count) => {
                  accountData.sort((a, b) => {
                    if (a.name < b.name) {
                      return -1;
                    }
                    if (a.name > b.name) {
                      return 1;
                    }
                    return 0;
                  });
                  res.status(200).json({
                    numOfPages: Math.ceil(count.count / pageSize),
                    accountList: accountData,
                  });
                })
                .catch((err) => {
                  res.status(404);
                });
            }
          });
        } else {
          res.status(404).json({
            msg: "Not found",
          });
        }
      })
      .catch((err) => {
        res.status(404);
      });
  }
);

// @route POST api/admin/assignparent
// @desc Assign parent by parentID and accountID
// @access Private

router.post(
  "/assignparent",
  passport.authenticate("admin", {
    session: false,
  }),
  async (req, res) => {
    const { accountID, parentID } = req.body;
    ParentGuardian.findOne({
      where: {
        accountID: parentID,
      },
    }).then(async (pg) => {
      if (pg) {
        if (pg.studentIDs === null || pg.studentIDs === undefined) {
          let newData = [accountID];
          pg.update({
            studentIDs: JSON.stringify(newData),
          }).then(() =>
            res.status(200).json({
              msg: "Parent assigned successfully!",
            })
          );
        } else {
          let tempData = [...JSON.parse(pg.studentIDs)];
          if (!tempData.includes(accountID)) {
            tempData.push(accountID);
            pg.update({
              studentIDs: JSON.stringify(tempData),
            }).then(() =>
              res.status(200).json({
                msg: "Parent assigned successfully!",
              })
            );
          }
        }
      }
    });
  }
);

// @route POST api/admin/unassignparent
// @desc Unassign parent by parentID and accountID
// @access Private

router.post(
  "/unassignparent",
  passport.authenticate("admin", {
    session: false,
  }),
  async (req, res) => {
    const { accountID, parentID } = req.body;
    ParentGuardian.findOne({
      where: {
        accountID: parentID,
      },
    }).then(async (pg) => {
      if (pg) {
        if (pg.studentIDs === null || pg.studentIDs === undefined) {
          // let newData = [accountID]
          // pg.update({
          //   studentIDs: JSON.stringify(newData)
          // }).then(() => res.status(200).json({
          //   msg: "Parent assigned successfully!"
          // }))
        } else {
          let tempData = [...JSON.parse(pg.studentIDs)];
          if (tempData.includes(accountID)) {
            pg.update({
              studentIDs: JSON.stringify(
                tempData.filter((a) => a != accountID)
              ),
            }).then(() =>
              res.status(200).json({
                msg: "Parent unassigned successfully!",
              })
            );
          }
        }
      }
    });
  }
);

// @route POST api/admin/getallparents
// @desc Get all parent account
// @access Private

router.post(
  "/getallparents",
  passport.authenticate("admin", {
    session: false,
  }),
  async (req, res) => {
    let { page, pageSize, keyword, accountID } = req.body;
    page = page - 1;
    let offset = page * pageSize;
    let limit = offset + pageSize;

    let listParents = await ParentGuardian.findAll().then(async (pg) => {
      if (pg) {
        let data = [];
        for (const [index, value] of pg.entries()) {
          if (value.studentIDs !== null && value.studentIDs !== undefined) {
            let studentIDs = JSON.parse(value.studentIDs);
            if (studentIDs.includes(accountID)) {
              data.push({
                accountID: value.accountID,
              });
            }
          }
        }
        return data;
      }
    });
    UserAccount.findAll({
      limit,
      offset,
      where: {
        position: 5,
        [Op.or]: [
          {
            firstName: {
              [Op.like]: `%${keyword}%`,
            },
          },
          {
            lastName: {
              [Op.like]: `%${keyword}%`,
            },
          },
        ],
      },
    })
      .then((users) => {
        let accountData = [];
        if (users.length != 0) {
          users.slice(0, pageSize).forEach(async (user, key, arr) => {
            const keyID = user.accountID;
            const email = user.email;
            const name = `${utils.capitalize(
              user.lastName
            )}, ${utils.capitalize(user.firstName)} ${user.middleName
              .charAt(0)
              .toUpperCase()}.`;
            const position = utils.displayPosition(user.position);
            const imageUrl = user.imageUrl;
            const isActive = user.isActive;
            accountData.push({
              key: keyID,
              email,
              name,
              position,
              imageUrl,
              isActive,
            });
            if (key == arr.length - 1) {
              UserAccount.findAndCountAll({
                where: {
                  position: 5,
                  [Op.or]: [
                    {
                      firstName: {
                        [Op.like]: `%${keyword}%`,
                      },
                    },
                    {
                      lastName: {
                        [Op.like]: `%${keyword}%`,
                      },
                    },
                  ],
                },
              })
                .then((count) => {
                  accountData.sort((a, b) => {
                    if (a.name < b.name) {
                      return -1;
                    }
                    if (a.name > b.name) {
                      return 1;
                    }
                    return 0;
                  });
                  res.status(200).json({
                    numOfPages: Math.ceil(count.count / pageSize),
                    accountList: accountData,
                    listParents,
                  });
                })
                .catch(() => {
                  res.status(404);
                });
            }
          });
        } else {
          res.status(404).json({
            msg: "Not found",
          });
        }
      })
      .catch(() => {
        res.status(404);
      });
  }
);

module.exports = router;
