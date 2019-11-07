const express = require("express");
const router = express.Router();
const UserAccount = require("../../models/UserAccount");
const Grade = require("../../models/Grade");
const GradeSheet = require("../../models/GradeSheet");
const passport = require("passport");
const Sequelize = require("sequelize");

// Input Validation
const validateEditProfileNonacademic = require("../../validation/editprofilenonacademic");

// @route api/teacher/savegrade
// @desc Create/Save a grade sheet
// @access Private

router.post(
  "/savegrade",
  passport.authenticate("teacher", { session: false }),
  (req, res) => {
    // Assume that if gradeSheetID is set to 0, we will create a new grade sheet
    const {
      gradeSheetID,
      schoolYear,
      academicTerm,
      isSubmitted,
      subjectID,
      sectionID,
      gradeLevelID,
      teacherID,
      grades
    } = req.body;

    if (gradeSheetID == 0) {
      // Create a new grade sheet
      GradeSheet.create({
        schoolYear,
        academicTerm,
        isSubmitted: 0,
        subjectID,
        sectionID,
        gradeLevelID,
        teacherID,
        dateCreated: new Date(),
        dateModified: new Date()
      }).then(async gradesheet => {
        for (let grade of grades) {
          await Grade.create({
            studentID: grade.studentID,
            score: grade.score,
            total: grade.total,
            categoryID: grade.categoryID,
            entryNum: grade.entryNum,
            showLog: false,
            gradeSheetID: gradesheet.gradeSheetID,
            date: new Date(),
            isUpdated: 0
          });
        }
        res.json({ msg: "Grade sheet has been created successfully!" });
      });
    } else {
      // Save a grade sheet
      GradeSheet.findOne({
        where: {
          gradeSheetID
        }
      }).then(gradesheet => {
        if (gradesheet) {
          gradesheet
            .update({
              dateModified: new Date(),
              isSubmitted: isSubmitted == 1 ? 1 : 0
            })
            .then(g => {
              for (let grade of grades) {
                Grade.findOne({
                  where: {
                    studentID: grade.studentID,
                    total: grade.total,
                    categoryID: grade.categoryID,
                    entryNum: grade.entryNum,
                    gradeSheetID: gradesheet.gradeSheetID,
                    showLog: 1
                  },
                  order: [["date", "DESC"]]
                }).then(async tempGrade => {
                  if (tempGrade) {
                    if (tempGrade.score == grade.score) {
                      // Update nothing
                    } else {
                      await Grade.create({
                        studentID: grade.studentID,
                        score: grade.score,
                        total: grade.total,
                        categoryID: grade.categoryID,
                        entryNum: grade.entryNum,
                        showLog: gradesheet.isSubmitted == 1 ? 1 : 0,
                        gradeSheetID: gradesheet.gradeSheetID,
                        date: new Date(),
                        isUpdated: 1
                      });
                    }
                  } else {
                    await Grade.create({
                      studentID: grade.studentID,
                      score: grade.score,
                      total: grade.total,
                      categoryID: grade.categoryID,
                      entryNum: grade.entryNum,
                      showLog: gradesheet.isSubmitted == 1 ? 1 : 0,
                      gradeSheetID: gradesheet.gradeSheetID,
                      date: new Date(),
                      isUpdated: 1
                    });
                  }
                });
                res.json({
                  msg: "Grade sheet has been updated successfully!"
                });
              }
            });
        } else {
          res.status(404).json({
            errors: {
              gradeSheet: "Grade sheet not found!"
            }
          });
        }
      });
    }
  }
);

// @route POST api/teacher/updateprofile
// @desc Update profile
// @access Private

router.post(
  "/updateprofile",
  passport.authenticate("teacher", {
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

module.exports = router;
