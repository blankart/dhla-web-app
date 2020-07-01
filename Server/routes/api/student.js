const express = require("express");
const PDFDocument = require("pdfkit");
const router = express.Router();
const UserAccount = require("../../models/UserAccount");
const passport = require("passport");
const Sequelize = require("sequelize");
const Teacher = require("../../models/Teacher");
const SubmissionDeadline = require("../../models/SubmissionDeadline");
const Section = require("../../models/Section");
const StudentSection = require("../../models/StudentSection");
const SubjectSection = require("../../models/SubjectSection");
const ClassRecord = require("../../models/ClassRecord");
const SubjectSectionStudent = require("../../models/SubjectSectionStudent");
const StudentWeightedScore = require("../../models/StudentWeightedScore");
const Student = require("../../models/Student");
const TeacherSection = require("../../models/TeacherSection");
const Subject = require("../../models/Subject");
const Component = require("../../models/Component");
const Subcomponent = require("../../models/Subcomponent");
const StudentSubjectGrades = require("../../models/StudentSubjectGrades");
const ParentGuardian = require("../../models/ParentGuardian");
const SchoolYear = require("../../models/SchoolYear");
const Grade = require("../../models/Grade");
const ClassRecordStatus = require("../../models/ClassRecordStatus");
const ActivityLog = require("../../models/ActivityLog");
const LogDetails = require("../../models/LogDetails");
const StudentGrades = require("../../models/StudentGrades");
const StudentFinalGrade = require("../../models/StudentFinalGrade");
const Op = Sequelize.Op;

// Input Validation
const validateEditProfileParent = require("../../validation/editprofileparent");

//Import Utility Functions
const utils = require("../../utils");

// @router POST api/student/updateprofile
// @desc Update profile
// @access Private

router.post(
  "/updateprofile",
  passport.authenticate("student", {
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

    const { errors, isValid } = validateEditProfileParent(req.body);

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
          .then((user2) => {
            res.status(200).json({
              msg: "Profile updated successfully!",
            });
          });
      }
    });
  }
);

// @route GET api/student/getsy
// @desc Get current school year
// @access Private
router.get(
  "/getsy",
  passport.authenticate(["student", "guardian"], {
    session: false,
  }),
  async (req, res) => {
    let { schoolYearID, quarter } = await utils.getActiveSY();
    if (schoolYearID != 0) {
      let schoolYear = await utils.getSYname(schoolYearID);
      res.status(200).json({
        schoolYear,
        schoolYearID,
        quarter,
      });
    } else {
      res.status(404).json({
        msg: "There is no active school year",
      });
    }
  }
);

// @route GET api/student/getallsy
// @desc Get all school year
// @access Private

router.get(
  "/getallsy",
  passport.authenticate(["student", "guardian"], {
    session: false,
  }),
  async (req, res) => {
    SchoolYear.findAll().then(async (sys) => {
      if (sys) {
        let data = [];
        for (const [index, value] of sys.entries()) {
          data.push({
            schoolYearID: value.schoolYearID,
            schoolYear: value.schoolYear,
          });
        }
        data.sort((a, b) => (a.schoolYear < b.schoolYear ? 1 : -1));
        res.status(200).json({
          schoolYearList: data,
        });
      }
    });
  }
);

// @route POST api/student/studentfinalrecord
// @desc Get finalgrade grade of student by studentID, schoolYearID, quarter
// @access Private

router.post(
  "/studentfinalrecord",
  passport.authenticate(["student", "guardian"], {
    session: false,
  }),
  async (req, res) => {
    if (req.body.parent == true) {
      const { accountID } = req.user;
      const accountIDs = await ParentGuardian.findOne({
        where: {
          accountID,
        },
      }).then((pg) => {
        if (pg) {
          return JSON.parse(pg.studentIDs);
        }
      });
      const { schoolYearID, quarter } = req.body;
      let outData = [];
      for (const [index, value] of accountIDs.entries()) {
        const studentID = await utils.getStudentID(value);
        const name = await utils.getStudentName(studentID);
        let section, gradeLevel;
        const teacher = await StudentSection.findOne({
          where: {
            studentID,
            schoolYearID,
          },
        }).then(async (ss) => {
          if (ss) {
            return await TeacherSection.findOne({
              where: {
                sectionID: ss.sectionID,
                schoolYearID,
              },
            }).then(async (ts) => {
              if (ts) {
                section = await utils.getSectionName(ss.sectionID);
                gradeLevel = await utils.getGradeLevelBySectionID(ss.sectionID);
                return await utils.getTeacherName(ts.teacherID);
              } else {
                section = await utils.getSectionName(ss.sectionID);
                gradeLevel = await utils.getGradeLevelBySectionID(ss.sectionID);
                return "No Adviser";
              }
            });
          } else {
            return -1;
          }
        });
        if (teacher == -1) {
          res.status(404).json({ msg: "Student not enrolled. " });
        } else {
          const studsectID = await StudentSection.findOne({
            where: {
              studentID,
              schoolYearID,
            },
          }).then((std) => {
            if (std) {
              return std.studsectID;
            } else {
              return -1;
            }
          });
          if (studsectID == -1) {
            res.status(200).json({
              data,
            });
          } else {
            const data = await SubjectSectionStudent.findAll({
              where: {
                studsectID,
              },
            }).then(async (sss2) => {
              if (sss2) {
                let data2 = [];
                for (const [i, v] of sss2.entries()) {
                  let {
                    subjectType,
                    classRecordID,
                    subjectID,
                  } = await SubjectSection.findOne({
                    where: {
                      subsectID: v.subsectID,
                      schoolYearID,
                    },
                  }).then(async (ss) => {
                    if (ss) {
                      return {
                        subjectType: ss.subjectType,
                        classRecordID: ss.classRecordID,
                        subjectID: ss.subjectID,
                      };
                    }
                  });

                  let status = await ClassRecordStatus.findOne({
                    where: {
                      classRecordID,
                    },
                  }).then(async (crs) => {
                    if (crs) {
                      if (quarter == "Q1") {
                        if (
                          subjectType == "NON_SHS" ||
                          subjectType == "1ST_SEM"
                        ) {
                          return crs.q1;
                        }
                      } else if (quarter == "Q2") {
                        if (
                          subjectType == "NON_SHS" ||
                          subjectType == "1ST_SEM"
                        ) {
                          return crs.q2;
                        }
                      } else if (quarter == "Q3") {
                        if (subjectType == "NON_SHS") {
                          return crs.q3;
                        } else if (subjectType == "2ND_SEM") {
                          return crs.q1;
                        }
                      } else {
                        if (subjectType == "NON_SHS") {
                          return crs.q4;
                        } else if (subjectType == "2ND_SEM") {
                          return crs.q2;
                        }
                      }
                    }
                  });
                  let subjectName = await utils.getSubjectName(subjectID);
                  if (typeof status !== "undefined") {
                    let score = await StudentSubjectGrades.findOne({
                      where: {
                        classRecordID,
                        subsectstudID: v.subsectstudID,
                      },
                    }).then((ssg) => {
                      if (status == "F") {
                        if (quarter == "Q1") {
                          if (
                            subjectType == "NON_SHS" ||
                            subjectType == "1ST_SEM"
                          ) {
                            return ssg.q1FinalGrade;
                          }
                        } else if (quarter == "Q2") {
                          if (
                            subjectType == "NON_SHS" ||
                            subjectType == "1ST_SEM"
                          ) {
                            return ssg.q2FinalGrade;
                          }
                        } else if (quarter == "Q3") {
                          if (subjectType == "NON_SHS") {
                            return ssg.q3FinalGrade;
                          } else if (subjectType == "2ND_SEM") {
                            return ssg.q1FinalGrade;
                          }
                        } else {
                          if (subjectType == "NON_SHS") {
                            return ssg.q4FinalGrade;
                          } else if (subjectType == "2ND_SEM") {
                            return ssg.q2FinalGrade;
                          }
                        }
                      }
                    });
                    if (typeof score !== "undefined") {
                      data2.push({
                        score,
                        subjectName,
                      });
                    }
                  }
                }
                return data2;
              }
            });
            let finalGrade = await StudentGrades.findOne({
              where: {
                studsectID,
                quarter,
              },
            }).then((sg) => {
              if (sg) {
                return sg.grade;
              }
            });
            outData.push({
              name,
              data,
              finalGrade,
              section,
              teacher,
              gradeLevel,
            });
          }
        }
      }
      res.status(200).json({
        data: outData,
      });
    } else {
      const { accountID } = req.user;
      const studentID = await utils.getStudentID(accountID);
      const { schoolYearID, quarter } = req.body;
      let section, gradeLevel;
      const teacher = await StudentSection.findOne({
        where: {
          studentID,
          schoolYearID,
        },
      }).then(async (ss) => {
        if (ss) {
          return await TeacherSection.findOne({
            where: {
              sectionID: ss.sectionID,
              schoolYearID,
            },
          }).then(async (ts) => {
            if (ts) {
              section = await utils.getSectionName(ss.sectionID);
              gradeLevel = await utils.getGradeLevelBySectionID(ss.sectionID);
              return await utils.getTeacherName(ts.teacherID);
            } else {
              section = await utils.getSectionName(ss.sectionID);
              gradeLevel = await utils.getGradeLevelBySectionID(ss.sectionID);
              return "No Adviser";
            }
          });
        } else {
          return -1;
        }
      });
      if (teacher == -1) {
        res.status(404).json({ msg: "Student not enrolled." });
      } else {
        const studsectID = await StudentSection.findOne({
          where: {
            studentID,
            schoolYearID,
          },
        }).then((std) => {
          if (std) {
            return std.studsectID;
          } else {
            return -1;
          }
        });
        if (studsectID == -1) {
          res.status(200).json({
            data: [],
            finalGrade: -1,
          });
        } else {
          const data = await SubjectSectionStudent.findAll({
            where: {
              studsectID,
            },
          }).then(async (sss2) => {
            if (sss2) {
              let data2 = [];
              for (const [i, v] of sss2.entries()) {
                let {
                  subjectType,
                  classRecordID,
                  subjectID,
                } = await SubjectSection.findOne({
                  where: {
                    subsectID: v.subsectID,
                    schoolYearID,
                  },
                }).then(async (ss) => {
                  if (ss) {
                    return {
                      subjectType: ss.subjectType,
                      classRecordID: ss.classRecordID,
                      subjectID: ss.subjectID,
                    };
                  }
                });

                let status = await ClassRecordStatus.findOne({
                  where: {
                    classRecordID,
                  },
                }).then(async (crs) => {
                  if (crs) {
                    if (quarter == "Q1") {
                      if (
                        subjectType == "NON_SHS" ||
                        subjectType == "1ST_SEM"
                      ) {
                        return crs.q1;
                      }
                    } else if (quarter == "Q2") {
                      if (
                        subjectType == "NON_SHS" ||
                        subjectType == "1ST_SEM"
                      ) {
                        return crs.q2;
                      }
                    } else if (quarter == "Q3") {
                      if (subjectType == "NON_SHS") {
                        return crs.q3;
                      } else if (subjectType == "2ND_SEM") {
                        return crs.q1;
                      }
                    } else {
                      if (subjectType == "NON_SHS") {
                        return crs.q4;
                      } else if (subjectType == "2ND_SEM") {
                        return crs.q2;
                      }
                    }
                  }
                });
                let subjectName = await utils.getSubjectName(subjectID);
                if (typeof status !== "undefined") {
                  let score = await StudentSubjectGrades.findOne({
                    where: {
                      classRecordID,
                      subsectstudID: v.subsectstudID,
                    },
                  }).then((ssg) => {
                    if (status == "F") {
                      if (quarter == "Q1") {
                        if (
                          subjectType == "NON_SHS" ||
                          subjectType == "1ST_SEM"
                        ) {
                          return ssg.q1FinalGrade;
                        }
                      } else if (quarter == "Q2") {
                        if (
                          subjectType == "NON_SHS" ||
                          subjectType == "1ST_SEM"
                        ) {
                          return ssg.q2FinalGrade;
                        }
                      } else if (quarter == "Q3") {
                        if (subjectType == "NON_SHS") {
                          return ssg.q3FinalGrade;
                        } else if (subjectType == "2ND_SEM") {
                          return ssg.q1FinalGrade;
                        }
                      } else {
                        if (subjectType == "NON_SHS") {
                          return ssg.q4FinalGrade;
                        } else if (subjectType == "2ND_SEM") {
                          return ssg.q2FinalGrade;
                        }
                      }
                    }
                  });
                  if (typeof score !== "undefined") {
                    data2.push({
                      score,
                      subjectName,
                    });
                  }
                }
              }
              return data2;
            }
          });
          let finalGrade = await StudentGrades.findOne({
            where: {
              studsectID,
              quarter,
            },
          }).then((sg) => {
            if (sg) {
              return sg.grade;
            }
          });
          res.status(200).json({
            data,
            finalGrade,
            section,
            teacher,
            gradeLevel,
          });
        }
      }
    }
  }
);

module.exports = router;
