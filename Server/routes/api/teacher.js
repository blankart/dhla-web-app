const express = require("express");
const router = express.Router();
const UserAccount = require("../../models/UserAccount");
const Grade = require("../../models/Grade");
const SubjectSection = require("../../models/SubjectSection");
const SubjectSectionStudent = require("../../models/SubjectSectionStudent");
const passport = require("passport");
const Sequelize = require("sequelize");

// Input Validation
const validateEditProfileNonacademic = require("../../validation/editprofilenonacademic");

//Import Utility Functions
const utils = require("../../utils");

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

// @route POST api/teacher/listsubjectsection
// @desc List subject section of teacher by school year
// @access Private

router.post(
  "/listsubjectsection",
  passport.authenticate("teacher", { session: false }),
  async (req, res) => {
    let { teacherID, schoolYear, page, pageSize } = req.body;
    let offset = page * pageSize;
    let limit = offset + pageSize;
    SubjectSection.findAll({
      limit,
      offset,
      where: { teacherID, schoolYear }
    })
      .then(subjectsections => {
        let subjectsectionData = [];
        if (subjectsections.length != 0) {
          subjectsections
            .slice(0, pageSize)
            .forEach(async (subjectsection, key, arr) => {
              const keyID = subjectsection.subsectID;
              const subjectName = await utils.getSubjectName(
                subjectsection.subjectID
              );
              const sectionName = await utils.getSectionName(
                subjectsection.sectionID
              );
              const classRecordID = subjectsection.classRecordID;
              subjectsectionData.push({
                key: keyID,
                subjectName,
                sectionName,
                classRecordID
              });
              if (key == arr.length - 1) {
                SubjectSection.findAndCountAll({
                  where: { teacherID, schoolYear }
                })
                  .then(count => {
                    subjectsectionData.sort((a, b) => {
                      a.key > b.key ? 1 : -1;
                    });
                    res.status(200).json({
                      numOfPages: Math.ceil(count.count / pageSize),
                      subjectsectionList: subjectsectionData
                    });
                  })
                  .catch(err => {
                    res.status(404);
                  });
              }
            });
        } else {
          req.status(404).json({ msg: "Not found" });
        }
      })
      .catch(err => {
        res.status(404);
      });
  }
);

// @route GET api/registrar/getsy
// @desc Get current school year
// @access Private
router.get(
  "/getsy",
  passport.authenticate("teacher", { session: false }),
  async (req, res) => {
    let schoolYearID = await utils.getActiveSY();
    if (schoolYearID != 0) {
      let schoolYear = await utils.getSYname(schoolYearID);
      res.status(200).json({ schoolYear, schoolYearID });
    } else {
      res.status(404).json({ msg: "There is no active school year" });
    }
  }
);

// @route POST api/registrar/getsujectload
// @desc Get subject load of teacher
// @access Private

router.post(
  "/getsubjectload",
  passport.authenticate("teacher", { session: false }),
  async (req, res) => {
    const { accountID } = req.user;
    let { page, pageSize } = req.body;
    page = page - 1;
    let offset = page * pageSize;
    let limit = offset + pageSize;
    const teacherID = await utils.getTeacherID(accountID);
    const schoolYearID = await utils.getActiveSY();
    SubjectSection.findAll({
      limit,
      offset,
      where: { teacherID, schoolYearID }
    }).then(async subjectsections => {
      if (subjectsections.length == 0) {
        res.status(404).json({ msg: "No record" });
      } else {
        let subjectsectionData = [];
        let i = 0;
        for (i; i < subjectsections.slice(0, pageSize).length; i++) {
          const key = subjectsections[i].subsectID;
          const subjectCode = await utils.getSubjectCode(
            subjectsections[i].subjectID
          );
          const subjectName = await utils.getSubjectName(
            subjectsections[i].subjectID
          );
          const gradeLevel = await utils.getSectionGradeLevel(
            subjectsections[i].sectionID
          );
          const sectionName = await utils.getSectionName(
            subjectsections[i].sectionID
          );
          subjectsectionData.push({
            key,
            subjectCode,
            subjectName,
            gradeLevel,
            sectionName
          });
        }
        SubjectSection.findAndCountAll({
          where: { teacherID, schoolYearID }
        }).then(count => {
          res.status(200).json({
            numOfPages: Math.ceil(count.count / pageSize),
            subjectSectionData: subjectsectionData
          });
        });
      }
    });
  }
);

// @route POST api/teacher/getsubsectinfo
// @desc Get subject section info
// @access Private

router.post(
  "/getsubsectinfo",
  passport.authenticate("teacher", { session: false }),
  async (req, res) => {
    const { subsectID } = req.body;
    let { page, pageSize } = req.body;
    page = page - 1;
    let offset = page * pageSize;
    let limit = offset + pageSize;
    SubjectSection.findOne({ where: { subsectID } }).then(subjectsection => {
      if (subjectsection) {
        SubjectSectionStudent.findAll({
          limit,
          offset,
          where: { subsectID }
        }).then(async subjectsectionstudents => {
          if (subjectsectionstudents.length == 0) {
            const sectionName = await utils.getSectionName(
              subjectsection.sectionID
            );
            const gradeLevel = await utils.getSectionGradeLevel(
              subjectsection.sectionID
            );
            const subjectName = await utils.getSubjectName(
              subjectsection.subjectID
            );
            res.status(200).json({
              numOfPages: 1,
              sectionName,
              gradeLevel,
              subjectName,
              studentList: []
            });
          } else {
            let i = 0;
            let studarr = [];
            const sectionName = await utils.getSectionName(
              subjectsection.sectionID
            );
            const gradeLevel = await utils.getSectionGradeLevel(
              subjectsection.sectionID
            );
            const subjectName = await utils.getSubjectName(
              subjectsection.subjectID
            );
            for (i; i < subjectsectionstudents.slice(0, pageSize).length; i++) {
              let key = subjectsectionstudents[i].subsectstudID;
              let name = await utils.getStudentNameByStudsectID(
                subjectsectionstudents[i].studsectID
              );
              let email = await utils.getStudentEmailByStudsectID(
                subjectsectionstudents[i].studsectID
              );
              let sectionName = await utils.getSectionNameByStudsectID(
                subjectsectionstudents[i].studsectID
              );
              let imageUrl = await utils.getStudentImageUrlByStudsectID(
                subjectsectionstudents[i].studsectID
              );
              let gradeLevel = await utils.getSectionGradeLevelByStudsectID(
                subjectsectionstudents[i].studsectID
              );
              studarr.push({
                key,
                name,
                email,
                sectionName,
                imageUrl,
                gradeLevel
              });
            }
            SubjectSectionStudent.findAndCountAll({
              limit,
              offset,
              where: { subsectID }
            }).then(count => {
              res.status(200).json({
                numOfPages: Math.ceil(count.count / pageSize),
                sectionName,
                gradeLevel,
                subjectName,
                studentList: studarr
              });
            });
          }
        });
      } else {
        res.status(404).json({ msg: "Subject section not found!" });
      }
    });
  }
);

module.exports = router;
