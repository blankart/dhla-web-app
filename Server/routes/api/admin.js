const express = require("express");
const router = express.Router();
const UserAccount = require("../../models/UserAccount");
const Nonacademic = require("../../models/Nonacademic");
const Teacher = require("../../models/Teacher");
const Student = require("../../models/Student");
const ParentGuardian = require("../../models/ParentGuardian");
const Grade = require("../../models/Grade");
const Subject = require("../../models/Subject");
const Section = require("../../models/Section");
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

// @route POST api/admin/createaccount
// @desc Create an account for Director, Registrar, Teacher, Student, and Parent/Guardian
// @access Private

router.post(
  "/createaccount",
  passport.authenticate("admin", {
    session: false
  }),
  (req, res) => {
    const { email, firstName, middleName, lastName, position } = req.body;
    const { errors, isValid } = validateCreateAccount(req.body);

    if (!isValid) {
      res.status(400).json(errors);
    } else {
      UserAccount.findOne({
        where: {
          email
        }
      }).then(user => {
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
                emergencyRelationship: na
              }).then(user2 => {
                if (position == true || position == 2 || position == 6) {
                  // Create Director or Registrar Table
                  Nonacademic.create({
                    accountID: user2.accountID
                  }).then(() => {
                    res.json({
                      msg: "Nonacademic account created successfully!"
                    });
                  });
                } else if (position == 3) {
                  // Create Teacher Table
                  Teacher.create({ accountID: user2.accountID }).then(() => {
                    res.json({ msg: "Teacher account created successfully!" });
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
                    motherOfficeNum: na
                  }).then(() => {
                    res.json({ msg: "Student account created successfully!" });
                  });
                } else {
                  // Create Parent/Guardian Table
                  ParentGuardian.create({
                    accountID: user2.accountID
                  }).then(() => {
                    res.json({
                      msg: "Parent/Guardian account created successfully!"
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

// @route api/admin/getupdatelog
// @desc Get the edit/update log of the grade sheets
// @acess Public

// router.post(
//   "/getupdatelog",
//   passport.authenticate("admin", { session: false }),
//   async (req, res) => {
//     const updateLogData = [];
//     let { page, pageSize } = req.body;
//     page = page - 1;
//     let offset = page * pageSize;
//     let limit = offset + pageSize;
//     const grades = await Grade.findAll({
//       where: {
//         showLog: 1
//       },
//       order: [["date", "DESC"]]
//     });
//     if (grades.length != 0) {
//       for (grade of grades) {
//         const gradesheet = await GradeSheet.findOne({
//           where: { gradeSheetID: grade.gradeSheetID }
//         });
//         const oldGrade = await Grade.findOne({
//           where: {
//             categoryID: grade.categoryID,
//             studentID: grade.studentID,
//             gradeSheetID: grade.gradeSheetID,
//             entryNum: grade.entryNum,
//             showLog: 1,
//             date: {
//               [Op.lt]: grade.date
//             }
//           },
//           order: [["date", "DESC"]]
//         });
//         if (oldGrade) {
//           const gradeID = oldGrade.gradeID;
//           const score = oldGrade.score;
//           const teacherName = await utils.getTeacherName(gradesheet.teacherID);
//           const gradeLevel = await utils.getGradeLevelName(gradesheet.gradeLevelID);
//           const subjectName = await utils.getSubjectName(gradesheet.subjectID);
//           const sectionName = await utils.getSectionName(gradesheet.sectionID);
//           const studentName = await utils.getStudentName(grade.studentID);
//           const category = await utils.getCategoryName(grade.categoryID);
//           const data = {
//             gradeSheetID: gradesheet.gradeSheetID,
//             schoolYear: gradesheet.schoolYear,
//             academicTerm: gradesheet.academicTerm,
//             teacherName,
//             gradeLevel,
//             subjectName,
//             sectionName,
//             dateUpdated: grade.date,
//             studentName,
//             entryNum: grade.entryNum,
//             category,
//             total: grade.total,
//             oldGrade: {
//               gradeID,
//               score
//             },
//             newGrade: {
//               gradeID: grade.gradeID,
//               score: grade.score
//             }
//           };
//           updateLogData.push(data);
//         }
//       }
//       Grade.findAndCountAll({
//         where: {
//           isUpdated: 1,
//           showLog: 1
//         }
//       })
//         .then(count => {
//           updateLogData.sort((a, b) =>
//             a.dateUpdated < b.dateUpdated ? 1 : -1
//           );
//           res.status(200).json({
//             numOfPages: Math.ceil(updateLogData.length / pageSize),
//             updateLog: updateLogData.slice(
//               page * pageSize,
//               page * pageSize + pageSize
//             )
//           });
//         })
//         .catch(err => {
//           res.status(404);
//         });
//     } else {
//       res.status(404).json({ msg: "Not found" });
//     }
//   }
// );

// @route POST api/admin/getaccounts
// @desc Get the list of accounts
// @access Private

router.post(
  "/getaccounts",
  passport.authenticate("admin", { session: false }),
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
          [Op.ne]: 0
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

module.exports = router;
