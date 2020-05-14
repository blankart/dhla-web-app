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
const SchoolYear = require("../../models/SchoolYear");
const Grade = require("../../models/Grade");
const ClassRecordStatus = require("../../models/ClassRecordStatus");
const ActivityLog = require("../../models/ActivityLog");
const LogDetails = require("../../models/LogDetails");
const StudentGrades = require("../../models/StudentGrades");
const StudentFinalGrade = require("../../models/StudentFinalGrade");
const Op = Sequelize.Op;

// Director and Registrar Shared API
const directorRegistrar = ["director", "registrar"];

//Import Utility Functions
const utils = require("../../utils");

// Input Validation
const validateEditProfileNonacademic = require("../../validation/editprofilenonacademic");
const validateAddSection = require("../../validation/addsection");
const validateSubcomponent = require("../../validation/subcomponents");

// @route POST api/registar/updateprofile
// @desc Update profile
// @access Private

router.post(
  "/updateprofile",
  passport.authenticate("registrar", {
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
          .then((user2) => {
            res.status(200).json({
              msg: "Profile updated successfully!",
            });
          });
      }
    });
  }
);

// @route POST api/registrar/setdeadlineall
// @desc Set the submission deadline for all teachers
// @access Private

router.post(
  "/setdeadlineall",
  passport.authenticate("registrar", {
    session: false,
  }),
  (req, res) => {
    let { deadline } = req.body;
    const deadlineDate = utils.getPHTime(new Date(deadline));
    const dateSet = utils.getPHTime();
    if (deadlineDate.getTime() <= dateSet.getTime()) {
      res.status(400).json({
        msg: "Invalid date. Date must be greater than current date.",
      });
    } else {
      Teacher.findAll().then((teachers) => {
        if (teachers.length != 0) {
          for (const [index, value] of teachers.entries()) {
            SubmissionDeadline.findOne({
              where: {
                teacherID: value.teacherID,
                isActive: 1,
              },
            }).then((sd) => {
              if (sd) {
                sd.update({
                  deadline: deadlineDate,
                  dateSet,
                });
              } else {
                SubmissionDeadline.create({
                  teacherID: value.teacherID,
                  isActive: 1,
                  deadline: deadlineDate,
                  dateSet,
                });
              }
            });
          }
          res.status(200).json({
            msg: "Successfully updated the submission deadline!",
          });
        } else {
          res.status(404).json({
            msg: "No active teachers found.",
          });
        }
      });
    }
  }
);

// @route GET api/registrar/disabledeadline
// @desc Disable the submission deadline for all teachers
// @access Private

router.get(
  "/disabledeadline",
  passport.authenticate("registrar", {
    session: false,
  }),
  (req, res) => {
    SubmissionDeadline.findAll({
      where: {
        isActive: true,
      },
    }).then((submissiondeadline) => {
      if (submissiondeadline.length == 0) {
        res.status(404).json({
          msg: "There is no active submission deadline.",
        });
      } else {
        submissiondeadline.forEach(async (entry, key, arr) => {
          await entry.update({
            isActive: 0,
          });
        });
        res.status(200).json({
          msg: "Disabled successfully!",
        });
      }
    });
  }
);

// @route POST api/registrar/removedeadline
// @desc Remove submission deadline by deadlineID
// @access Private

router.post(
  "/removedeadline",
  passport.authenticate("registrar", {
    session: false,
  }),
  async (req, res) => {
    const { deadlineID } = req.body;
    if (deadlineID != 0) {
      SubmissionDeadline.findOne({
        where: {
          deadlineID,
        },
      }).then((sd) => {
        if (sd) {
          sd.update({
            isActive: 0,
          }).then(() => {
            res.status(200).json({
              msg: "Submission deadline removed successfully.",
            });
          });
        } else {
          res.status(404).json({
            msg: "Submission deadline not found!",
          });
        }
      });
    } else {
      SubmissionDeadline.findAll().then((sds) => {
        if (sds.length != 0) {
          for (const [index, value] of sds.entries()) {
            value.update({
              isActive: 0,
            });
          }
          res.status(200).json({
            msg: "Submission deadline removed successfully.",
          });
        }
      });
    }
  }
);

// @route POST api/registrar/setdeadline
// @desc Set the submission deadline for given teachers
// @access Private

router.post(
  "/setdeadline",
  passport.authenticate("registrar", {
    session: false,
  }),
  async (req, res) => {
    const { teacherID, deadline } = req.body;
    const deadlineDate = utils.getPHTime(new Date(deadline));
    const dateSet = utils.getPHTime();
    if (deadlineDate.getTime() <= dateSet.getTime()) {
      res.status(400).json({
        msg: "Invalid date. Date must be greater than current date.",
      });
    } else {
      SubmissionDeadline.findOne({
        where: {
          teacherID,
          isActive: 1,
        },
      }).then((sd) => {
        if (sd) {
          sd.update({
            deadline: deadlineDate,
            dateSet,
          });
        } else {
          SubmissionDeadline.create({
            deadline: deadlineDate,
            dateSet,
            teacherID,
            isActive: 1,
          });
        }
        res.status(200).json({
          msg: "Successfully updated the submission deadline!",
        });
      });
    }
  }
);

// @route POST api/registrar/getsections
// @desc Get sections based on keyword
// @access Private

router.post(
  "/getsections",
  passport.authenticate(["registrar", "director"], {
    session: false,
  }),
  async (req, res) => {
    let { page, pageSize, keyword } = req.body;
    page = page - 1;
    let offset = page * pageSize;
    let limit = offset + pageSize;
    Section.findAll({
      where: {
        sectionName: {
          [Op.like]: `%${keyword}%`,
        },
        archived: 0,
      },
    }).then((sections) => {
      let sectionData = [];
      if (sections.length != 0) {
        sections.forEach(async (section, key, arr) => {
          const keyID = section.sectionID;
          const name = section.sectionName;
          const gradeLevel = section.gradeLevel;
          sectionData.push({
            key: keyID,
            name,
            gradeLevel,
          });
          if (key == arr.length - 1) {
            Section.findAndCountAll({
              where: {
                sectionName: {
                  [Op.like]: `%${keyword}%`,
                },
                archived: 0,
              },
            })
              .then((count) => {
                sectionData.sort((a, b) =>
                  a.gradeLevel > b.gradeLevel ? 1 : -1
                );
                res.status(200).json({
                  numOfPages: Math.ceil(count.count / pageSize),
                  sectionList: sectionData.slice(
                    pageSize * page,
                    pageSize * (page + 1)
                  ),
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
    });
  }
);

// @route POST api/registrar/sectiongradelevel
// @desc Get grade level by studentID
// @access Private

router.post(
  "/sectiongradelevel",
  passport.authenticate("registrar", {
    session: false,
  }),
  async (req, res) => {
    const { sectionID } = req.body;
    let gradeLevel = await utils.getGradeLevelBySectionID(sectionID);
    if (gradeLevel === "") {
      res.status(404).json({
        msg: "Not found!",
      });
    } else {
      res.status(200).json({
        gradeLevel,
      });
    }
  }
);

// @route POST api/registrar/getpastgradelevel
// @desc Get past grade level
// @access Private

router.post(
  "/getpastgradelevel",
  passport.authenticate("registrar", {
    session: false,
  }),
  (req, res) => {
    const { gradeLevel } = req.body;
    const gradeLevels = [
      "N",
      "K1",
      "K2",
      "G1",
      "G2",
      "G3",
      "G4",
      "G5",
      "G6",
      "G7",
      "G8",
      "G9",
      "G10",
      "G11",
      "G12",
    ];
    const gradeLevelIndex = gradeLevels.indexOf(gradeLevel);
    if (gradeLevelIndex != 0) {
      res.status(200).json({
        gradeLevel: gradeLevels[gradeLevelIndex - 1],
      });
    } else {
      res.status(200).json({
        gradeLevel: gradeLevels[gradeLevelIndex],
      });
    }
  }
);

// @route POST api/registrar/addsection
// @desc Add a new section
// @access Private

router.post(
  "/addsection",
  passport.authenticate("registrar", {
    session: false,
  }),
  async (req, res) => {
    const { sectionName, gradeLevel } = req.body;
    const { errors, isValid } = validateAddSection({
      sectionName,
    });

    if (!isValid) {
      return res.status(400).json(errors);
    }

    Section.findOne({
      where: {
        sectionName,
        archived: 0,
      },
    }).then((section) => {
      if (section) {
        res.status(400).json({
          sectionName: "Section name is already taken",
        });
      } else {
        Section.create({
          sectionName,
          gradeLevel,
        }).then((section2) => {
          res.status(200).json({
            msg: "Section created successfully!",
          });
        });
      }
    });
  }
);

// @route POST api/registrar/editsection
// @desc Rename a section
// @access Private

router.post(
  "/editsection",
  passport.authenticate("registrar", {
    session: false,
  }),
  async (req, res) => {
    const { sectionID, sectionName, gradeLevel } = req.body;
    const { errors, isValid } = validateAddSection({
      sectionName,
    });
    if (!isValid) {
      return res.status(400).json(errors);
    }
    Section.findOne({
      where: {
        sectionID,
      },
    }).then((section) => {
      if (section) {
        section
          .update({
            sectionName,
            gradeLevel,
          })
          .then((section2) => {
            res.status(200).json({
              msg: "Section updated successfully!",
            });
          });
      } else {
        res.status(404).json({
          msg: "Section not found",
        });
      }
    });
  }
);

// @route POST api/registrar/deletesection
// @desc Delete a section
// @access Private

router.post(
  "/deletesection",
  passport.authenticate("registrar", {
    session: false,
  }),
  async (req, res) => {
    const { sectionID } = req.body;
    console.log("here1");
    Section.findOne({
      where: {
        sectionID,
      },
    })
      .then(async (section) => {
        let { schoolYearID, quarter } = await utils.getActiveSY();
        console.log("here2");
        await StudentSection.findAll({
          where: {
            sectionID,
            schoolYearID,
          },
        }).then(async (studentsections) => {
          let hasData = [];
          console.log("here3");
          for (const [index, value] of studentsections.entries()) {
            hasData.push(studentsection.studsectID);
          }
          if (hasData.length != 0) {
            res.status(400).json({
              msg:
                "Operation could not be completed. Remove all students under this section first.",
            });
          } else {
            await SubjectSection.findAll({
              where: {
                sectionID,
                schoolYearID,
              },
            }).then(async (subjectsections) => {
              console.log("here4");
              let hasData2 = [];
              for (const [index, value] of subjectsections.entries()) {
                hasData2.push(subjectsections.studsectID);
              }

              if (hasData2.length != 0) {
                console.log("here4");
                res.status(400).json({
                  msg:
                    "Operation could not be completed. There are active subjects in this section.",
                });
              } else {
                await TeacherSection.findOne({
                  where: {
                    sectionID,
                    schoolYearID,
                  },
                }).then((adviser) => {
                  if (adviser) {
                    adviser.destroy({});
                  }
                });
                await section
                  .update({
                    archived: 1,
                  })
                  .then(() => {
                    res.status(200).json({
                      msg: "Section deleted successfully!",
                    });
                  })
                  .catch((err) => res.status(404));
              }
            });
          }
        });
      })
      .catch((err) => res.status(404));
  }
);

// @route POST api/registrar/getallstudents
// @desc Get all students from a keyword
// @access Private

router.post(
  "/getallstudents",
  passport.authenticate(["registrar", "director"], {
    session: false,
  }),
  async (req, res) => {
    let { page, pageSize, keyword } = req.body;
    page = page - 1;
    let offset = page * pageSize;
    let limit = offset + pageSize;

    UserAccount.findAll({
      limit,
      offset,
      where: {
        position: 4,
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
            const studentID = await utils.getStudentID(user.accountID);
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
              studentID,
              email,
              name,
              position,
              imageUrl,
              isActive,
            });
            if (key == arr.length - 1) {
              UserAccount.findAndCountAll({
                where: {
                  position: 4,
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
                  accountData.sort((a, b) =>
                    a.accountID > b.accountID ? 1 : -1
                  );
                  res.status(200).json({
                    numOfPages: Math.ceil(count.count / pageSize),
                    accountList: accountData,
                  });
                })
                .catch((err) => {
                  res.status(200).json({
                    numOfPages: 1,
                    accountList: [],
                  });
                });
            }
          });
        } else {
          res.status(200).json({
            numOfPages: 1,
            accountList: [],
          });
        }
      })
      .catch((err) => {
        res.status(200).json({
          numOfPages: 1,
          accountList: [],
        });
      });
  }
);

// @route POST api/registrar/getallteachers
// @desc Get all teachers from a keyword
// @access Private

router.post(
  "/getallteachers",
  passport.authenticate(["registrar", "director"], {
    session: false,
  }),
  async (req, res) => {
    let { page, pageSize, keyword } = req.body;
    page = page - 1;
    let offset = page * pageSize;
    let limit = offset + pageSize;
    UserAccount.findAll({
      limit,
      offset,
      where: {
        position: 3,
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
      .then(async (users) => {
        let accountData = [];
        if (users.length != 0) {
          users.slice(0, pageSize).forEach(async (user, key, arr) => {
            const keyID = user.accountID;
            const teacherID = await utils.getTeacherID(user.accountID);
            const email = user.email;
            const name = `${utils.capitalize(
              user.lastName
            )}, ${utils.capitalize(user.firstName)} ${user.middleName
              .charAt(0)
              .toUpperCase()}.`;
            const position = utils.displayPosition(user.position);
            const imageUrl = user.imageUrl;
            const isActive = user.isActive;
            const { deadline, deadlineID } = await SubmissionDeadline.findOne({
              where: {
                teacherID,
                isActive: 1,
              },
            }).then((sd) => {
              if (sd) {
                const { deadline, deadlineID } = sd;
                return {
                  deadline,
                  deadlineID,
                };
              } else {
                return {
                  deadline: "NOT SET",
                  deadlineID: -1,
                };
              }
            });
            accountData.push({
              deadline,
              teacherID,
              key: keyID,
              email,
              name,
              position,
              imageUrl,
              isActive,
              deadlineID,
            });
            if (key == arr.length - 1) {
              UserAccount.findAndCountAll({
                where: {
                  position: 3,
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
                  accountData.sort((a, b) =>
                    a.accountID > b.accountID ? 1 : -1
                  );
                  res.status(200).json({
                    numOfPages: Math.ceil(count.count / pageSize),
                    accountList: accountData,
                  });
                })
                .catch((err) => {
                  res.status(200).json({
                    numOfPages: 1,
                    accountList: [],
                  });
                });
            }
          });
        } else {
          res.status(200).json({
            numOfPages: 1,
            accountList: [],
          });
        }
      })
      .catch((err) => {
        res.status(200).json({
          numOfPages: 1,
          accountList: [],
        });
      });
  }
);
// @route POST api/registrar/getfinalsubsect
// @desc Get subject section where class record status = 'F'
// @access Private

router.post(
  "/getfinalsubsect",
  passport.authenticate(directorRegistrar, {
    session: false,
  }),
  async (req, res) => {
    let { teacherID, page, pageSize, quarter, schoolYearID } = req.body;
    page = page - 1;
    let offset = page * pageSize;
    let limit = offset + pageSize;
    const deadline = await SubmissionDeadline.findOne({
      where: {
        teacherID,
        isActive: 1,
      },
    }).then((sd) => {
      if (sd) {
        return sd.deadline;
      } else {
        return "NOT SET";
      }
    });
    const { classRecordIDs, crStatus } = await SubjectSection.findAll({
      where: {
        teacherID,
        schoolYearID,
        subjectType: {
          [Op.in]:
            quarter == "Q1" || quarter == "Q2"
              ? ["NON_SHS", "1ST_SEM"]
              : ["NON_SHS", "2ND_SEM"],
        },
      },
    }).then(async (ss) => {
      if (ss) {
        let data = [];
        let crStatus = [];
        for (const [i, v] of ss.entries()) {
          const crs = await ClassRecordStatus.findOne({
            where: {
              classRecordID: v.classRecordID,
            },
          });
          if (quarter == "Q1" || quarter == "Q2") {
            if (
              crs[quarter.toLowerCase()] == "F" ||
              crs[quarter.toLowerCase()] == "D"
            ) {
              data.push(v.classRecordID);
              crStatus.push({
                classRecordID: v.classRecordID,
                status: crs[quarter.toLowerCase()],
              });
            }
          } else {
            if (quarter == "Q3") {
              if (v.subjectType == "NON_SHS") {
                if (
                  crs[quarter.toLowerCase()] == "F" ||
                  crs[quarter.toLowerCase()] == "D"
                ) {
                  data.push(v.classRecordID);
                  crStatus.push({
                    classRecordID: v.classRecordID,
                    status: crs[quarter.toLowerCase()],
                  });
                }
              } else {
                if (crs["q1"] == "F" || crs["q1"] == "D") {
                  data.push(v.classRecordID);
                  crStatus.push({
                    classRecordID: v.classRecordID,
                    status: crs["q1"],
                  });
                }
              }
            } else {
              if (v.subjectType == "NON_SHS") {
                if (
                  crs[quarter.toLowerCase()] == "F" ||
                  crs[quarter.toLowerCase()] == "D"
                ) {
                  data.push(v.classRecordID);
                  crStatus.push({
                    classRecordID: v.classRecordID,
                    status: crs[quarter.toLowerCase()],
                  });
                }
              } else {
                if (crs["q2"] == "F" || crs["q2"] == "D") {
                  data.push(v.classRecordID);
                  crStatus.push({
                    classRecordID: v.classRecordID,
                    status: crs["q2"],
                  });
                }
              }
            }
          }
        }
        return {
          classRecordIDs: data,
          crStatus,
        };
      }
    });
    if (classRecordIDs.length == 0) {
      res.status(404).json({
        msg: "Class Record not found!",
      });
    } else {
      let condition = {};
      condition["classRecordID"] = {
        [Op.in]: classRecordIDs,
      };
      await ClassRecordStatus.findAll({
        limit,
        offset,
        where: condition,
      }).then(async (crs) => {
        if (crs) {
          if (crs.length == 0) {
            res.status(404).json({
              msg: "No class record for deliberation found",
            });
          } else {
            let data2 = [];
            let numOfPages = 1;
            crs.slice(0, pageSize).forEach(async (v, k, r) => {
              const { classRecordID } = v;
              const subjectType = await utils.getSubjectTypeByClassRecordID(
                classRecordID
              );
              const status = crStatus.find(
                (a) => a.classRecordID == classRecordID
              ).status;
              let dateSubmitted = v[`${quarter.toLowerCase()}DateSubmitted`];
              if (subjectType == "2ND_SEM") {
                if (quarter == "Q3") {
                  dateSubmitted = v.q1DateSubmitted;
                } else if (quarter == "Q4") {
                  dateSubmitted = v.q2DateSubmitted;
                }
              }
              const {
                subjectCode,
                subjectName,
                section,
                subsectID,
              } = await SubjectSection.findOne({
                where: {
                  classRecordID,
                },
              }).then(async (cr) => {
                if (cr) {
                  const subjectCode = await utils.getSubjectCode(cr.subjectID);
                  const { subsectID } = cr;
                  const subjectName = await utils.getSubjectName(cr.subjectID);
                  const section = await utils.getSectionName(cr.sectionID);
                  return {
                    subjectCode,
                    subsectID,
                    subjectName,
                    section,
                  };
                }
              });
              data2.push({
                status,
                classRecordID,
                dateSubmitted,
                subjectCode,
                subjectName,
                section,
                subsectID,
              });
              if (k == r.length - 1) {
                numOfPages = await ClassRecordStatus.findAndCountAll({
                  where: condition,
                }).then((count) => {
                  return Math.ceil(count.count / pageSize);
                });
                res.status(200).json({
                  classRecordList: data2,
                  numOfPages,
                  deadline,
                });
              }
            });
          }
        }
      });
    }
  }
);

// @route POST api/registrar/getpastrecords
// @desc Get past records of students by grade level
// @access Private

router.post(
  "/getpastrecords",
  passport.authenticate("registrar", {
    session: false,
  }),
  async (req, res) => {
    let { page, pageSize, keyword } = req.body;
    const { gradeLevel } = req.body;
    let pastSY = await utils.getPastSY();
    let pastSYID = await utils.getSYID(pastSY);
    const gradeLevels = [
      "N",
      "K1",
      "K2",
      "G1",
      "G2",
      "G3",
      "G4",
      "G5",
      "G6",
      "G7",
      "G8",
      "G9",
      "G10",
      "G11",
      "G12",
    ];
    const gradeLevelIndex = gradeLevels.indexOf(gradeLevel);
    let pastGradeLevel =
      gradeLevelIndex == 0
        ? gradeLevels[gradeLevelIndex]
        : gradeLevels[gradeLevelIndex - 1];
    let sectionsID = await utils.getSectionsIDByGradeLevel(pastGradeLevel);
    let recordsData = {
      numOfPages: 1,
      studentData: [],
    };
    if (sectionsID.length != 0) {
      recordsData = await utils.getStudentSectionBySYAndSectionID({
        sectionID: sectionsID,
        schoolYearID: pastSYID,
        page,
        pageSize,
        keyword,
      });
      res.status(200).json(recordsData);
    } else {
      res.status(404).json({
        msg: "Not found!",
      });
    }
  }
);

// @route POST api/registrar/searchstudent
// @desc Suggestion search for students (5 entries)
// @access Private

router.post(
  "/searchstudent",
  passport.authenticate("registrar", {
    session: false,
  }),
  async (req, res) => {
    const { keyword } = req.body;
    let page = 1;
    let pageSize = 5;
    page = page - 1;
    let offset = page * pageSize;
    let limit = offset + pageSize;
    UserAccount.findAll({
      limit,
      offset,
      where: {
        position: 4,
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
        let studentData = [];
        if (users.length != 0) {
          users.slice(0, pageSize).forEach(async (user, key, arr) => {
            const keyID = await utils.getStudentID(user.accountID);
            const name = `${utils.capitalize(
              user.lastName
            )}, ${utils.capitalize(user.firstName)} ${user.middleName
              .charAt(0)
              .toUpperCase()}.`;
            const imageUrl = user.imageUrl;
            studentData.push({
              key: keyID,
              name,
              imageUrl,
            });
            if (key == arr.length - 1) {
              studentData.sort((a, b) => (a.name > b.name ? 1 : -1));
              res.status(200).json({
                accountList: studentData,
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
        res.status(404).json({
          msg: "Not found",
        });
      });
  }
);

// @route POST api/registrar/searchteacher
// @desc Suggestion search for teacher (5 entries)
// @access Private

router.post(
  "/searchteacher",
  passport.authenticate("registrar", {
    session: false,
  }),
  async (req, res) => {
    const { keyword } = req.body;
    let page = 1;
    let pageSize = 5;
    page = page - 1;
    let offset = page * pageSize;
    let limit = offset + pageSize;
    UserAccount.findAll({
      limit,
      offset,
      where: {
        position: 3,
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
        let teacherData = [];
        if (users.length != 0) {
          users.slice(0, pageSize).forEach(async (user, key, arr) => {
            const keyID = await utils.getTeacherID(user.accountID);
            const name = `${utils.capitalize(
              user.lastName
            )}, ${utils.capitalize(user.firstName)} ${user.middleName
              .charAt(0)
              .toUpperCase()}.`;
            const imageUrl = user.imageUrl;
            teacherData.push({
              key: keyID,
              name,
              imageUrl,
            });
            if (key == arr.length - 1) {
              teacherData.sort((a, b) => (a.name > b.name ? 1 : -1));
              res.status(200).json({
                accountList: teacherData,
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
        res.status(404).json({
          msg: "Not found",
        });
      });
  }
);

// @route POST api/registrar/searchenrolled
// @desc Suggestion search for enrolled students (5 entries)
// @access Private

router.post(
  "/searchenrolled",
  passport.authenticate("registrar", {
    session: false,
  }),
  async (req, res) => {
    const { keyword } = req.body;
    let page = 1;
    let pageSize = 5;
    page = page - 1;
    let offset = page * pageSize;
    let limit = offset + pageSize;
    let studentsID = await utils.getStudentsIDByKeyword(keyword);
    let { schoolYearID, quarter } = await utils.getActiveSY();
    if (studentsID.length == 0) {
      res.status(404).json({
        msg: "Not found!",
      });
    } else {
      StudentSection.findAll({
        limit,
        offset,
        where: {
          studentID: studentsID,
          schoolYearID,
        },
      }).then(async (studentsections) => {
        if (studentsections.length != 0) {
          let i = 0;
          let studsectarr = [];
          for (i; i < studentsections.slice(0, pageSize).length; i++) {
            let studsectID = studentsections[i].studsectID;
            let key = studentsections[i].studentID;
            let name = await utils.getStudentName(studentsections[i].studentID);
            let email = await utils.getStudentEmail(
              studentsections[i].studentID
            );
            let imageUrl = await utils.getStudentImageUrl(
              studentsections[i].studentID
            );
            let gradeLevel = await utils.getSectionGradeLevel(
              studentsections[i].sectionID
            );
            let sectionName = await utils.getSectionName(
              studentsections[i].sectionID
            );
            studsectarr.push({
              key,
              name,
              email,
              imageUrl,
              gradeLevel,
              sectionName,
              studsectID,
            });
          }
          res.status(200).json({
            studentList: studsectarr,
          });
        } else {
          res.status(404).json({
            msg: "Not found!",
          });
        }
      });
    }
  }
);

// @route POST api/registrar/getenrolled
// @desc Get enrolled students by school year and section
// @access Private

router.post(
  "/getenrolled",
  passport.authenticate("registrar", {
    session: false,
  }),
  (req, res) => {}
);

// @route GET api/registrar/createsy
// @desc Create a school year
// @access Private

router.post(
  "/createsy",
  passport.authenticate("registrar", {
    session: false,
  }),
  async (req, res) => {
    const { schoolYear } = req.body;
    let checker = schoolYear.split("-");
    if (checker.length != 2) {
      res.status(400).json({
        msg: "Invalid school year format",
      });
    } else {
      if (parseInt(checker[1]) - parseInt(checker[0]) != 1) {
        res.status(400).json({
          msg: "Invalid school year format",
        });
      } else {
        SchoolYear.findOne({
          where: {
            isActive: 1,
          },
        }).then((sy) => {
          if (sy) {
            res.status(400).json({
              msg: "Invalid operation. There is an active school year",
            });
          } else {
            SchoolYear.findOne({
              where: {
                schoolYear,
              },
            }).then((sy2) => {
              if (sy2) {
                res.status(404).json({
                  msg: "Invalid operation. School year already exists",
                });
              } else {
                SchoolYear.create({
                  schoolYear,
                  isActive: 1,
                  quarter: "Q1",
                }).then(() => {
                  res.status(200).json({
                    msg: "School year created successfully!",
                  });
                });
              }
            });
          }
        });
      }
    }
  }
);

// @route POST api/registrar/endschoolyear
// @desc Set school year isActive value to 0
// @access Private

router.post(
  "/endschoolyear",
  passport.authenticate("registrar", {
    session: false,
  }),
  async (req, res) => {
    const { schoolYearID } = req.body;
    SchoolYear.findOne({
      where: {
        schoolYearID,
      },
    }).then((sy) => {
      if (sy) {
        sy.update({
          isActive: 0,
        }).then(() => {
          res.status(200).json({
            msg: "School year has ended successfully!",
          });
        });
      } else {
        res.status(404).json({
          msg: "School year not found",
        });
      }
    });
  }
);

// @route POST api/registrar/listsubjectsection
// @desc List subject section by schoolyearID and quarter and section
// @access Private

router.post(
  "/listsubjectsection",
  passport.authenticate("registrar", {
    session: false,
  }),
  async (req, res) => {
    const { sectionID } = req.body;
    const { schoolYearID, quarter } = await utils.getActiveSY();
    const data = await SubjectSection.findAll({
      where: {
        sectionID,
        schoolYearID,
      },
    }).then(async (ss) => {
      if (ss.length != 0) {
        let data = [];
        for (const [index, value] of ss.entries()) {
          const { subsectID, subjectType, subjectID, teacherID } = value;
          const subjectName = await utils.getSubjectName(subjectID);
          const teacher = await utils.getTeacherName(teacherID);
          if (subjectType == "NON_SHS") {
            data.push({
              subsectID,
              subjectName,
              teacher,
            });
          } else {
            if (subjectType == "1ST_SEM") {
              if (quarter == "Q1" || quarter == "Q2") {
                data.push({
                  subsectID,
                  subjectName,
                  teacher,
                });
              }
            } else if (subjectType == "2ND_SEM") {
              if (quarter == "Q3" || quarter == "Q4") {
                data.push({
                  subsectID,
                  subjectName,
                  teacher,
                });
              }
            }
          }
        }
        return data;
      } else {
        return [];
      }
    });
    res.status(200).json({
      subjectList: data,
    });
  }
);

// @route POST api/registrar/changequartersy
// @desc Change quarter of school year
// @access Private

router.post(
  "/changequartersy",
  passport.authenticate("registrar", {
    session: false,
  }),
  async (req, res) => {
    const { schoolYearID, quarter } = req.body;
    SchoolYear.findOne({
      where: {
        schoolYearID,
      },
    }).then((sy) => {
      if (sy) {
        sy.update({
          quarter,
        }).then(async () => {
          const classRecordIDs = await SubjectSection.findAll({
            where: {
              schoolYearID,
            },
          }).then(async (ss) => {
            if (ss) {
              let data = [];
              for (const [index, value] of ss.entries())
                data.push(value.classRecordID);
              return data;
            }
          });
          ClassRecordStatus.findAll({
            where: {
              classRecordID: {
                [Op.in]: classRecordIDs,
              },
            },
          }).then(async (crs) => {
            if (crs) {
              for (const [index, value] of crs.entries()) {
                const subjectType = await utils.getSubjectTypeByClassRecordID(
                  value.classRecordID
                );
                const { sectionID, subjectID } = await SubjectSection.findOne({
                  where: {
                    classRecordID: value.classRecordID,
                  },
                }).then((ss) => {
                  if (ss) {
                    const { sectionID, subjectID } = ss;
                    return {
                      sectionID,
                      subjectID,
                    };
                  }
                });
                if (quarter == "Q1") {
                  if (
                    value.q1 == "L" &&
                    (subjectType == "NON_SHS" || subjectType == "1ST_SEM")
                  ) {
                    await value.update(
                      {
                        q1: "E",
                      },
                      {
                        position: "Registrar",
                        classRecordID: value.classRecordID,
                        type: "CHANGE_STATUS",
                        accountID: req.user.accountID,
                        sectionID,
                        subjectID,
                        oldVal: "L",
                        newVal: "E",
                        quarter: "Q1",
                      }
                    );
                  }
                  if (
                    value.q2 == "E" &&
                    (subjectType == "NON_SHS" || subjectType == "1ST_SEM")
                  ) {
                    await value.update(
                      {
                        q2: "L",
                      },
                      {
                        position: "Registrar",
                        classRecordID: value.classRecordID,
                        type: "CHANGE_STATUS",
                        accountID: req.user.accountID,
                        sectionID,
                        subjectID,
                        oldVal: "E",
                        newVal: "L",
                        quarter: "Q2",
                      }
                    );
                  }
                  if (value.q3 == "E" && subjectType == "NON_SHS") {
                    await value.update(
                      {
                        q3: "L",
                      },
                      {
                        position: "Registrar",
                        classRecordID: value.classRecordID,
                        type: "CHANGE_STATUS",
                        accountID: req.user.accountID,
                        sectionID,
                        subjectID,
                        oldVal: "E",
                        newVal: "L",
                        quarter: "Q3",
                      }
                    );
                  }
                  if (value.q1 == "E" && subjectType == "2ND_SEM") {
                    await value.update(
                      {
                        q1: "L",
                      },
                      {
                        position: "Registrar",
                        classRecordID: value.classRecordID,
                        type: "CHANGE_STATUS",
                        accountID: req.user.accountID,
                        sectionID,
                        subjectID,
                        oldVal: "E",
                        newVal: "L",
                        quarter: "Q1",
                      }
                    );
                  }
                  if (value.q4 == "E" && subjectType == "NON_SHS") {
                    await value.update(
                      {
                        q4: "L",
                      },
                      {
                        position: "Registrar",
                        classRecordID: value.classRecordID,
                        type: "CHANGE_STATUS",
                        accountID: req.user.accountID,
                        sectionID,
                        subjectID,
                        oldVal: "E",
                        newVal: "L",
                        quarter: "Q4",
                      }
                    );
                  }

                  if (value.q2 == "E" && subjectType == "2ND_SEM") {
                    await value.update(
                      {
                        q2: "L",
                      },
                      {
                        position: "Registrar",
                        classRecordID: value.classRecordID,
                        type: "CHANGE_STATUS",
                        accountID: req.user.accountID,
                        sectionID,
                        subjectID,
                        oldVal: "E",
                        newVal: "L",
                        quarter: "Q2",
                      }
                    );
                  }
                }

                if (quarter == "Q2") {
                  if (
                    value.q2 == "L" &&
                    (subjectType == "NON_SHS" || subjectType == "1ST_SEM")
                  ) {
                    await value.update(
                      {
                        q2: "E",
                      },
                      {
                        position: "Registrar",
                        classRecordID: value.classRecordID,
                        type: "CHANGE_STATUS",
                        accountID: req.user.accountID,
                        sectionID,
                        subjectID,
                        oldVal: "L",
                        newVal: "E",
                        quarter: "Q2",
                      }
                    );
                  }
                  if (
                    value.q1 == "E" &&
                    (subjectType == "NON_SHS" || subjectType == "1ST_SEM")
                  ) {
                    await value.update(
                      {
                        q1: "L",
                      },
                      {
                        position: "Registrar",
                        classRecordID: value.classRecordID,
                        type: "CHANGE_STATUS",
                        accountID: req.user.accountID,
                        sectionID,
                        subjectID,
                        oldVal: "E",
                        newVal: "L",
                        quarter: "Q1",
                      }
                    );
                  }
                  if (value.q3 == "E" && subjectType == "NON_SHS") {
                    await value.update(
                      {
                        q3: "L",
                      },
                      {
                        position: "Registrar",
                        classRecordID: value.classRecordID,
                        type: "CHANGE_STATUS",
                        accountID: req.user.accountID,
                        sectionID,
                        subjectID,
                        oldVal: "E",
                        newVal: "L",
                        quarter: "Q3",
                      }
                    );
                  }
                  if (value.q1 == "E" && subjectType == "2ND_SEM") {
                    await value.update(
                      {
                        q1: "L",
                      },
                      {
                        position: "Registrar",
                        classRecordID: value.classRecordID,
                        type: "CHANGE_STATUS",
                        accountID: req.user.accountID,
                        sectionID,
                        subjectID,
                        oldVal: "E",
                        newVal: "L",
                        quarter: "Q1",
                      }
                    );
                  }
                  if (value.q4 == "E" && subjectType == "NON_SHS") {
                    await value.update(
                      {
                        q4: "L",
                      },
                      {
                        position: "Registrar",
                        classRecordID: value.classRecordID,
                        type: "CHANGE_STATUS",
                        accountID: req.user.accountID,
                        sectionID,
                        subjectID,
                        oldVal: "E",
                        newVal: "L",
                        quarter: "Q4",
                      }
                    );
                  }
                  if (value.q2 == "E" && subjectType == "2ND_SEM") {
                    await value.update(
                      {
                        q2: "L",
                      },
                      {
                        position: "Registrar",
                        classRecordID: value.classRecordID,
                        type: "CHANGE_STATUS",
                        accountID: req.user.accountID,
                        sectionID,
                        subjectID,
                        oldVal: "E",
                        newVal: "L",
                        quarter: "Q2",
                      }
                    );
                  }
                }

                if (quarter == "Q3") {
                  if (value.q3 == "L" && subjectType == "NON_SHS") {
                    await value.update(
                      {
                        q3: "E",
                      },
                      {
                        position: "Registrar",
                        classRecordID: value.classRecordID,
                        type: "CHANGE_STATUS",
                        accountID: req.user.accountID,
                        sectionID,
                        subjectID,
                        oldVal: "L",
                        newVal: "E",
                        quarter: "Q3",
                      }
                    );
                  }
                  if (value.q1 == "L" && subjectType == "2ND_SEM") {
                    await value.update(
                      {
                        q1: "E",
                      },
                      {
                        position: "Registrar",
                        classRecordID: value.classRecordID,
                        type: "CHANGE_STATUS",
                        accountID: req.user.accountID,
                        sectionID,
                        subjectID,
                        oldVal: "L",
                        newVal: "E",
                        quarter: "Q1",
                      }
                    );
                  }
                  if (
                    value.q2 == "E" &&
                    (subjectType == "NON_SHS" || subjectType == "1ST_SEM")
                  ) {
                    await value.update(
                      {
                        q2: "L",
                      },
                      {
                        position: "Registrar",
                        classRecordID: value.classRecordID,
                        type: "CHANGE_STATUS",
                        accountID: req.user.accountID,
                        sectionID,
                        subjectID,
                        oldVal: "E",
                        newVal: "L",
                        quarter: "Q2",
                      }
                    );
                  }
                  if (
                    value.q1 == "E" &&
                    (subjectType == "NON_SHS" || subjectType == "1ST_SEM")
                  ) {
                    await value.update(
                      {
                        q1: "L",
                      },
                      {
                        position: "Registrar",
                        classRecordID: value.classRecordID,
                        type: "CHANGE_STATUS",
                        accountID: req.user.accountID,
                        sectionID,
                        subjectID,
                        oldVal: "E",
                        newVal: "L",
                        quarter: "Q1",
                      }
                    );
                  }
                  if (value.q4 == "E" && subjectType == "NON_SHS") {
                    await value.update(
                      {
                        q4: "L",
                      },
                      {
                        position: "Registrar",
                        classRecordID: value.classRecordID,
                        type: "CHANGE_STATUS",
                        accountID: req.user.accountID,
                        sectionID,
                        subjectID,
                        oldVal: "E",
                        newVal: "L",
                        quarter: "Q4",
                      }
                    );
                  }
                  if (value.q2 == "E" && subjectType == "2ND_SEM") {
                    await value.update(
                      {
                        q2: "L",
                      },
                      {
                        position: "Registrar",
                        classRecordID: value.classRecordID,
                        type: "CHANGE_STATUS",
                        accountID: req.user.accountID,
                        sectionID,
                        subjectID,
                        oldVal: "E",
                        newVal: "L",
                        quarter: "Q2",
                      }
                    );
                  }
                }

                if (quarter == "Q4") {
                  if (value.q4 == "L" && subjectType == "NON_SHS") {
                    await value.update(
                      {
                        q4: "E",
                      },
                      {
                        position: "Registrar",
                        classRecordID: value.classRecordID,
                        type: "CHANGE_STATUS",
                        accountID: req.user.accountID,
                        sectionID,
                        subjectID,
                        oldVal: "L",
                        newVal: "E",
                        quarter: "Q4",
                      }
                    );
                  }
                  if (value.q2 == "L" && subjectType == "2ND_SEM") {
                    await value.update(
                      {
                        q2: "E",
                      },
                      {
                        position: "Registrar",
                        classRecordID: value.classRecordID,
                        type: "CHANGE_STATUS",
                        accountID: req.user.accountID,
                        sectionID,
                        subjectID,
                        oldVal: "L",
                        newVal: "E",
                        quarter: "Q2",
                      }
                    );
                  }
                  if (
                    value.q2 == "E" &&
                    (subjectType == "NON_SHS" || subjectType == "1ST_SEM")
                  ) {
                    await value.update(
                      {
                        q2: "L",
                      },
                      {
                        position: "Registrar",
                        classRecordID: value.classRecordID,
                        type: "CHANGE_STATUS",
                        accountID: req.user.accountID,
                        sectionID,
                        subjectID,
                        oldVal: "E",
                        newVal: "L",
                        quarter: "Q2",
                      }
                    );
                  }
                  if (value.q3 == "E" && subjectType == "NON_SHS") {
                    await value.update(
                      {
                        q3: "L",
                      },
                      {
                        position: "Registrar",
                        classRecordID: value.classRecordID,
                        type: "CHANGE_STATUS",
                        accountID: req.user.accountID,
                        sectionID,
                        subjectID,
                        oldVal: "E",
                        newVal: "L",
                        quarter: "Q3",
                      }
                    );
                  }
                  if (value.q1 == "E" && subjectType == "2ND_SEM") {
                    await value.update(
                      {
                        q1: "L",
                      },
                      {
                        position: "Registrar",
                        classRecordID: value.classRecordID,
                        type: "CHANGE_STATUS",
                        accountID: req.user.accountID,
                        sectionID,
                        subjectID,
                        oldVal: "E",
                        newVal: "L",
                        quarter: "Q1",
                      }
                    );
                  }
                  if (
                    value.q1 == "E" &&
                    (subjectType == "NON_SHS" || subjectType == "1ST_SEM")
                  ) {
                    await value.update(
                      {
                        q1: "L",
                      },
                      {
                        position: "Registrar",
                        classRecordID: value.classRecordID,
                        type: "CHANGE_STATUS",
                        accountID: req.user.accountID,
                        sectionID,
                        subjectID,
                        oldVal: "E",
                        newVal: "L",
                        quarter: "Q1",
                      }
                    );
                  }
                }
              }

              res.status(200).json({
                msg: "Quarter successfully updated",
              });
            }
          });
        });
      } else {
        res.status(404).json({
          msg: "School year not found!",
        });
      }
    });
  }
);

// @route POST api/registrar/getsy
// @desc Get school year info by schoolYearID
// @access Private

router.post(
  "/getsy",
  passport.authenticate(["registrar", "director"], {
    session: false,
  }),
  async (req, res) => {
    let { schoolYearID } = req.body;
    let schoolYear = await utils.getSYname(schoolYearID);
    res.status(200).json({
      schoolYear,
      schoolYearID,
    });
  }
);

// @route GET api/registrar/getsy
// @desc Get current school year
// @access Private
router.get(
  "/getsy",
  passport.authenticate(["registrar", "director"], {
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

// @route GET api/registrar/getallsy
// @desc Get all school year
// @access Private

router.get(
  "/getallsy",
  passport.authenticate(["registrar", "director"], {
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

// @route GET api/registrar/getpastsy
// @desc Get past school year
// @access Private

router.get(
  "/getpastsy",
  passport.authenticate("registrar", {
    session: false,
  }),
  async (req, res) => {
    let pastSY = await utils.getPastSY();
    let pastSYID = await utils.getSYID(pastSY);
    res.status(200).json({
      schoolYearID: pastSYID,
      schoolYear: pastSY,
    });
  }
);

// @route POST api/registrar/sectionname
// @desc Get section name
// @access Private

router.post(
  "/sectionname",
  passport.authenticate("registrar", {
    session: false,
  }),
  async (req, res) => {
    let { sectionID } = req.body;
    let sectionName = await utils.getSectionName(sectionID);
    res.status(200).json({
      sectionName,
    });
  }
);

// @route POST api/registrar/getcurrentenrolled
// @desc Get currently enrolled students by section
// @access Private

router.post(
  "/getcurrentenrolled",
  passport.authenticate("registrar", {
    session: false,
  }),
  async (req, res) => {
    let { page, pageSize } = req.body;
    page = page - 1;
    let offset = page * pageSize;
    let limit = offset + pageSize;
    const { sectionID } = req.body;
    const { schoolYearID, quarter } = await utils.getActiveSY();
    const gradeLevel = await utils.getGradeLevelBySectionID(sectionID);
    StudentSection.findAll({
      limit,
      offset,
      where: {
        schoolYearID,
        sectionID,
      },
    })
      .then((studentsections) => {
        let studentData = [];
        if (studentsections.length == 0) {
          res.status(200).json({
            numOfPages: 1,
            studentList: [],
            gradeLevel,
          });
        } else {
          studentsections
            .slice(0, pageSize)
            .forEach(async (studentsection, key, arr) => {
              const studsectID = studentsection.studsectID;
              const keyID = studentsection.studentID;
              const name = await utils.getStudentName(studentsection.studentID);
              const email = await utils.getStudentEmail(
                studentsection.studentID
              );
              const imageUrl = await utils.getStudentImageUrl(
                studentsection.studentID
              );
              const sectionName = await utils.getSectionName(sectionID);
              studentData.push({
                key: keyID,
                name,
                email,
                imageUrl,
                gradeLevel,
                sectionName,
                studsectID,
              });
              if (key == arr.length - 1) {
                StudentSection.findAndCountAll({
                  where: {
                    schoolYearID,
                    sectionID,
                  },
                })
                  .then((count) => {
                    studentData.sort((a, b) => {
                      a.name > b.name ? 1 : -1;
                    });
                    res.status(200).json({
                      numOfPages: Math.ceil(count.count / pageSize),
                      studentList: studentData,
                      gradeLevel,
                    });
                  })
                  .catch((err) => {
                    res.status(404);
                  });
              }
            });
        }
      })
      .catch((err) => {
        res.status(404);
      });
  }
);

// @route POST api/registrar/createstudentsection
// @desc Add student to section
// @access Private

router.post(
  "/createstudentsection",
  passport.authenticate("registrar", {
    session: false,
  }),
  (req, res) => {
    const { studentID, sectionID, schoolYearID } = req.body;
    if (studentID == -1) {
      res.status(400).json({
        studentName: "You must select a student",
      });
    }
    StudentSection.findOne({
      where: {
        studentID,
        schoolYearID,
      },
    }).then((studentsection) => {
      if (studentsection) {
        res.status(400).json({
          studentName: "Student is already enrolled in a section",
        });
      } else {
        StudentSection.create({
          studentID,
          sectionID,
          schoolYearID,
        }).then(async (studentsection2) => {
          await StudentFinalGrade.create({
            studsectID: studentsection2.studsectID,
            grade: -1,
            schoolYearID,
          });
          for (const [index, value] of ["Q1", "Q2", "Q3", "Q4"].entries()) {
            await StudentGrades.create({
              schoolYearID,
              quarter: value,
              studsectID: studentsection2.studsectID,
              grade: -1,
            });
          }
          res.status(200).json({
            studentName: "Student enrolled successfully!",
            studsectID: studentsection2.studsectID,
          });
        });
      }
    });
  }
);

// @route POST api/registrar/deletestudentsection
// @desc Unenroll student from a student section
// @acces Private

router.post(
  "/deletestudentsection",
  passport.authenticate("registrar", {
    session: false,
  }),
  async (req, res) => {
    const { studentID, sectionID, schoolYearID } = req.body;
    StudentSection.findOne({
      where: {
        studentID,
        sectionID,
        schoolYearID,
      },
    }).then((studentsection) => {
      if (!studentsection) {
        res.status(400).json({
          msg: "Student section not found",
        });
      } else {
        SubjectSectionStudent.findAll({
          where: {
            studsectID: studentsection.studsectID,
          },
        }).then(async (ss) => {
          if (ss.length != 0) {
            res.status(400).json({
              msg:
                "Operation could not be completed. This student is actively enrolled in a subject.",
            });
          } else {
            studentsection.destroy().then(() => {
              res.status(200).json({
                msg: "Student unenrolled successfully!",
              });
            });
          }
        });
      }
    });
  }
);

// @route POST api/registrar/createsubjectsection
// @desc Create a subject load of teacher
// @access Private

router.post(
  "/createsubjectsection",
  passport.authenticate("registrar", {
    session: false,
  }),
  async (req, res) => {
    const { schoolYearID, quarter } = await utils.getActiveSY();
    const { payload, sectionID, subjectID, accountID } = req.body;
    const teacherID = await utils.getTeacherID(accountID);
    const subjectType = await Subject.findOne({
      where: {
        subjectID,
      },
    }).then((subj) => {
      if (subj) {
        return subj.subjectType;
      }
    });
    let isSHS = ![
      "N",
      "K1",
      "K2",
      "G1",
      "G2",
      "G3",
      "G4",
      "G5",
      "G6",
      "G7",
      "G8",
      "G9",
      "G10",
    ].includes(subjectType);
    let compareIn =
      quarter == "Q1" || quarter == "Q2"
        ? ["NON_SHS", "1ST_SEM"]
        : ["NON_SHS", "2ND_SEM"];

    SubjectSection.findOne({
      where: {
        subjectID,
        sectionID,
        teacherID,
        schoolYearID,
        subjectType: {
          [Op.in]: compareIn,
        },
      },
    }).then((ss) => {
      if (ss) {
        res.status(400).json({
          msg: "Subject load already exists!",
        });
      } else {
        ClassRecord.create({
          dateCreated: utils.getPHTime(),
          dateModified: utils.getPHTime(),
          isSubmitted: 0,
          q1Transmu: "50",
          q2Transmu: "50",
          q3Transmu: "50",
          q4Transmu: "50",
        })
          .then((classrecord) => {
            SubjectSection.create({
              subjectID,
              sectionID,
              teacherID,
              schoolYearID,
              classRecordID: classrecord.classRecordID,
              subjectType: isSHS
                ? quarter == "Q1" || quarter == "Q2"
                  ? "1ST_SEM"
                  : "2ND_SEM"
                : "NON_SHS",
            })
              .then(async (subjectsection) => {
                let objectSet = {
                  classRecordID: classrecord.classRecordID,
                  q1: "L",
                  q2: "L",
                  q3: "L",
                  q4: "L",
                };
                let subjectType = isSHS
                  ? quarter == "Q1" || quarter == "Q2"
                    ? "1ST_SEM"
                    : "2ND_SEM"
                  : "NON_SHS";
                if (subjectType == "NON_SHS" || subjectType == "1ST_SEM") {
                  objectSet[quarter.toLowerCase()] = "E";
                } else {
                  objectSet["q1"] = quarter == "Q3" ? "E" : "L";
                  objectSet["q2"] = quarter == "Q4" ? "E" : "L";
                }
                await ClassRecordStatus.create(objectSet);
                let i = 0;
                for (i; i < payload.length; i++) {
                  SubjectSectionStudent.create({
                    subsectID: subjectsection.subsectID,
                    studsectID: payload[i].studsectID,
                  }).then((subsectstud) => {
                    let q = isSHS ? ["Q1", "Q2"] : ["Q1", "Q2", "Q3", "Q4"];
                    let i = 0;
                    for (i = 0; i < q.length; i++) {
                      StudentWeightedScore.create({
                        subsectstudID: subsectstud.subsectstudID,
                        classRecordID: classrecord.classRecordID,
                        faWS: -1,
                        wwWS: -1,
                        ptWS: -1,
                        qeWS: -1,
                        finalGrade: -1,
                        quarter: q[i],
                      });
                    }
                    StudentSubjectGrades.create({
                      subsectstudID: subsectstud.subsectstudID,
                      classRecordID: classrecord.classRecordID,
                    });
                  });
                }
                Component.findOne({
                  where: {
                    subjectID,
                    component: "FA",
                  },
                }).then((comp1) => {
                  if (comp1) {
                    Component.findOne({
                      where: {
                        subjectID,
                        component: "WW",
                      },
                    }).then((comp2) => {
                      if (comp2) {
                        Component.findOne({
                          where: {
                            subjectID,
                            component: "PT",
                          },
                        }).then((comp3) => {
                          if (comp3) {
                            Component.findOne({
                              where: {
                                subjectID,
                                component: "QE",
                              },
                            }).then((comp4) => {
                              if (comp4) {
                                let q = isSHS
                                  ? ["Q1", "Q2"]
                                  : ["Q1", "Q2", "Q3", "Q4"];
                                let j = 0;
                                for (j; j < q.length; j++) {
                                  Subcomponent.create({
                                    classRecordID: classrecord.classRecordID,
                                    name: "Subcomponent 1",
                                    componentID: comp1.componentID,
                                    compWeight: 100,
                                    quarter: q[j],
                                  });
                                  Subcomponent.create({
                                    classRecordID: classrecord.classRecordID,
                                    name: "Subcomponent 1",
                                    componentID: comp2.componentID,
                                    compWeight: 100,
                                    quarter: q[j],
                                  });
                                  Subcomponent.create({
                                    classRecordID: classrecord.classRecordID,
                                    name: "Subcomponent 1",
                                    componentID: comp3.componentID,
                                    compWeight: 100,
                                    quarter: q[j],
                                  });
                                  Subcomponent.create({
                                    classRecordID: classrecord.classRecordID,
                                    name: "Quarterly Exam",
                                    componentID: comp4.componentID,
                                    compWeight: 100,
                                    quarter: q[j],
                                  });
                                }
                                res.status(200).json({
                                  msg: "Added successfully!",
                                });
                              } else {
                                res.status(404).json({
                                  msg: "QE component not found!",
                                });
                              }
                            });
                          } else {
                            res.status(404).json({
                              msg: "PT component not found!",
                            });
                          }
                        });
                      } else {
                        res.status(404).json({
                          msg: "WW component not found!",
                        });
                      }
                    });
                  } else {
                    res.status(404).json({
                      msg: "FA component not found!",
                    });
                  }
                });
              })
              .catch((err) => {
                res.status(400).json({
                  msg: "Error adding subject section",
                });
              });
          })
          .catch((err) => {
            res.status(400).json({
              msg: "Error adding class record",
            });
          });
      }
    });
  }
);

// @route POST api/registrar/deletesubjectsection
// @desc Delete a subject load of teacher
// @access Private

router.post(
  "/deletesubjectsection",
  passport.authenticate("registrar", {
    session: false,
  }),
  async (req, res) => {
    const { subsectID } = req.body;
    SubjectSection.findOne({
      where: {
        subsectID,
      },
    }).then(async (subjectsection) => {
      if (subjectsection) {
        SubjectSectionStudent.findAll({
          where: {
            subsectID,
          },
        }).then(async (sss) => {
          if (sss.length != 0) {
            res.status(400).json({
              msg:
                "Operation could not be completed. Remove all students under this subject first.",
            });
          } else {
            await subjectsection.destroy().then(() => {
              res.status(200).json({
                msg: "Subject load deleted successfully!",
              });
            });
          }
        });
      } else {
        res.status(400).json({
          msg: "Error deleting subject load! 2",
        });
      }
    });
  }
);

// @route POST api/registrar/studentprofile
// @desc Get all personal information based on studentID
// @access Private

router.post(
  "/studentprofile",
  passport.authenticate("registrar", {
    session: false,
  }),
  async (req, res) => {
    const { studentID } = req.body;
    Student.findOne({
      where: {
        studentID,
      },
    })
      .then((student) => {
        UserAccount.findOne({
          where: {
            accountID: student.accountID,
          },
        }).then((user) => {
          const payload = {
            firstName: user.firstName,
            lastName: user.lastName,
            middleName: user.middleName,
            suffix: user.suffix,
            nickname: user.nickname,
            contactNum: user.contactNum,
            address: user.address,
            province: user.province,
            city: user.city,
            region: user.region,
            zipcode: user.zipcode,
            civilStatus: user.civilStatus,
            sex: user.sex,
            citizenship: user.citizenship,
          };
          res.status(200).json(payload);
        });
      })
      .catch((err) => {
        res.status(404).json({
          msg: "Student not found!",
        });
      });
  }
);

// @route POST api/registrar/advisorytable
// @desc Get all advisers from current school year
// @access Private

router.post(
  "/advisorytable",
  passport.authenticate("registrar", {
    session: false,
  }),
  async (req, res) => {
    let { page, pageSize, keyword } = req.body;
    page = page - 1;
    const offset = page * pageSize;
    const limit = offset + pageSize;
    const { schoolYearID } = await utils.getActiveSY();
    if (schoolYearID == 0) {
      res.status(404).json({
        msg: "There is no active school year",
      });
    } else {
      let data = [];
      let sectionsID = await utils.getSectionsID({
        limit,
        offset,
        keyword,
      });
      let advisersData = await utils.getTeacherSectionBySchoolYearID(
        schoolYearID
      );
      let i = 0;
      for (i; i < sectionsID.slice(0, pageSize).length; i++) {
        let sectionID = sectionsID[i];
        let sectionName = await utils.getSectionName(sectionsID[i]);
        let adviser = "NO ADVISER";
        let teacherID = 0;
        let gradeLevel = await utils.getGradeLevelBySectionID(sectionsID[i]);
        data.push({
          sectionID,
          sectionName,
          adviser,
          teacherID,
          gradeLevel,
        });
      }
      i = 0;
      for (i; i < advisersData.length; i++) {
        let index = data.findIndex(
          (val) => val.sectionID == advisersData[i].sectionID
        );
        if (index != -1) {
          data[index].adviser = advisersData[i].teacherName;
          data[index].teacherID = advisersData[i].teacherID;
        }
      }
      Section.findAndCountAll({
        where: {
          archived: 0,
          sectionName: {
            [Op.like]: `%${keyword}%`,
          },
        },
      }).then((count) => {
        res.status(200).json({
          numOfPages: Math.ceil(count.count / pageSize),
          advisoryData: data,
        });
      });
    }
  }
);

// @route POST api/registrar/unassignadviser
// @desc Unassign adviser
// @access Private

router.post(
  "/unassignadviser",
  passport.authenticate("registrar", {
    session: false,
  }),
  async (req, res) => {
    const { schoolYearID, sectionID, teacherID } = req.body;
    TeacherSection.findOne({
      where: {
        schoolYearID,
        sectionID,
        teacherID,
      },
    }).then((adviser) => {
      if (adviser) {
        adviser.destroy().then(() => {
          res.status(200).json({
            msg: "You have successfully unassigned an adviser!",
          });
        });
      } else {
        res.status(404).json({
          teacherName: "Unassigning failed",
        });
      }
    });
  }
);

// @route POST api/registrar/assignadviser
// @desc Assign adivser
// @access Private

router.post(
  "/assignadviser",
  passport.authenticate("registrar", {
    session: false,
  }),
  async (req, res) => {
    const { schoolYearID, sectionID, teacherID } = req.body;
    TeacherSection.findOne({
      where: {
        schoolYearID,
        teacherID,
      },
    }).then((adivser) => {
      if (adivser) {
        res.status(404).json({
          teacherName: "There's already assigned adviser!",
        });
      } else {
        TeacherSection.create({
          schoolYearID,
          sectionID,
          teacherID,
        })
          .then((adivser2) => {
            res.status(200).json({
              msg: "You have successfully assigned an adviser",
            });
          })
          .catch((err) =>
            res.status(404).json({
              teacherName: "Assigning failed",
            })
          );
      }
    });
  }
);

// @route POST api/registrar/getsubjects
// @desc Get all subjects
// @access Private

router.post(
  "/getsubjects",
  passport.authenticate("registrar", {
    session: false,
  }),
  async (req, res) => {
    let { page, pageSize, keyword } = req.body;
    page = page - 1;
    let offset = page * pageSize;
    let limit = offset + pageSize;
    Subject.findAll({
      limit,
      offset,
      where: {
        subjectName: {
          [Op.like]: `%${keyword}%`,
        },
      },
    })
      .then((subjects) => {
        let subjectData = [];
        if (subjects.length != 0) {
          subjects.slice(0, pageSize).forEach(async (subject, key, arr) => {
            const keyID = subject.subjectID;
            const { subjectCode, subjectName, subjectType } = subject;
            subjectData.push({
              key: keyID,
              subjectCode,
              subjectName,
              subjectType,
            });
            if (key == arr.length - 1) {
              Subject.findAndCountAll({
                where: {
                  subjectName: {
                    [Op.like]: `%${keyword}%`,
                  },
                },
              })
                .then((count) => {
                  subjectData.sort((a, b) =>
                    a.subjectName > b.subjectName ? 1 : -1
                  );
                  res.status(200).json({
                    numOfPages: Math.ceil(count.count / pageSize),
                    subjectList: subjectData,
                  });
                })
                .catch((err) => {
                  res.status(404).json({
                    msg: "Not found",
                  });
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
        res.status(404).json({
          msg: "Not found",
        });
      });
  }
);

// @route POST api/registrar/teacherinfo
// @desc Get teacher information
// @access Private

router.post(
  "/teacherinfo",
  passport.authenticate(directorRegistrar, {
    session: false,
  }),
  async (req, res) => {
    const { teacherID } = req.body;
    const accountID = await Teacher.findOne({
      where: {
        teacherID,
      },
    }).then((t) => {
      if (t) {
        return t.accountID;
      }
    });
    UserAccount.findOne({
      where: {
        accountID,
      },
    }).then(async (user) => {
      if (user) {
        const { accountID, email, imageUrl } = user;
        const name = `${utils.capitalize(user.lastName)}, ${utils.capitalize(
          user.firstName
        )} ${user.middleName.charAt(0).toUpperCase()}.`;
        res.status(200).json({
          accountID,
          email,
          imageUrl,
          name,
        });
      } else {
        res.status(404).json({
          msg: "User not found",
        });
      }
    });
  }
);

// @route POST api/registrar/studentinfo
// @desc Get student info
// @access Private

router.post(
  "/studentinfo",
  passport.authenticate(directorRegistrar, {
    session: false,
  }),
  async (req, res) => {
    const { studentID } = req.body;
    const accountID = await Student.findOne({
      where: {
        studentID,
      },
    }).then((s) => {
      if (s) {
        return s.accountID;
      }
    });
    UserAccount.findOne({
      where: {
        accountID,
      },
    }).then(async (user) => {
      if (user) {
        const { accountID, email, imageUrl } = user;
        const name = `${utils.capitalize(user.lastName)}, ${utils.capitalize(
          user.firstName
        )} ${user.middleName.charAt(0).toUpperCase()}.`;
        res.status(200).json({
          accountID,
          email,
          imageUrl,
          name,
        });
      } else {
        res.status(404).json({
          msg: "User not found",
        });
      }
    });
  }
);

// @route POST api/registrar/userinfo
// @desc Get user information
// @access Private

router.post(
  "/userinfo",
  passport.authenticate("registrar", {
    session: false,
  }),
  async (req, res) => {
    const { accountID } = req.body;
    UserAccount.findOne({
      where: {
        accountID,
      },
    }).then(async (user) => {
      if (user) {
        const { accountID, email, imageUrl } = user;
        const name = `${utils.capitalize(user.lastName)}, ${utils.capitalize(
          user.firstName
        )} ${user.middleName.charAt(0).toUpperCase()}.`;
        res.status(200).json({
          accountID,
          email,
          imageUrl,
          name,
        });
      } else {
        res.status(404).json({
          msg: "User not found",
        });
      }
    });
  }
);

// @route POST api/registrar/getsubjectsection
// @desc Get subject section by teacherID
// @access Private

router.post(
  "/getsubjectsection",
  passport.authenticate("registrar", {
    session: false,
  }),
  async (req, res) => {
    let { accountID, page, pageSize } = req.body;
    let { schoolYearID, quarter } = await utils.getActiveSY();
    page = page - 1;
    let offset = page * pageSize;
    let limit = offset + pageSize;
    let teacherID = await utils.getTeacherID(accountID);
    let compareIn =
      quarter == "Q1" || quarter == "Q2"
        ? ["NON_SHS", "1ST_SEM"]
        : ["NON_SHS", "2ND_SEM"];
    SubjectSection.findAll({
      limit,
      offset,
      where: {
        teacherID,
        schoolYearID,
        subjectType: {
          [Op.in]: compareIn,
        },
      },
    }).then(async (subjectsections) => {
      if (subjectsections.length == 0) {
        res.status(404).json({
          msg: "No record",
        });
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
            sectionName,
          });
        }
        SubjectSection.findAndCountAll({
          where: {
            teacherID,
            schoolYearID,
            subjectType: {
              [Op.in]: compareIn,
            },
          },
        }).then((count) => {
          res.status(200).json({
            numOfPages: Math.ceil(count.count / pageSize),
            subjectSectionData: subjectsectionData,
          });
        });
      }
    });
  }
);

// @route POST api/registrar/getsectionbygradelevel
// @desc Get sections by grade level
// @access Private

router.post(
  "/getsectionbygradelevel",
  passport.authenticate(directorRegistrar, {
    session: false,
  }),
  async (req, res) => {
    const { gradeLevel } = req.body;
    Section.findAll({
      where: {
        gradeLevel,
        archived: 0,
      },
    }).then((sections) => {
      if (sections.length != 0) {
        let sectionsData = [];
        let i = 0;
        for (i; i < sections.length; i++) {
          const { sectionID, sectionName } = sections[i];
          sectionsData.push({
            sectionID,
            sectionName,
          });
        }
        res.status(200).json({
          sectionsList: sectionsData,
        });
      } else {
        res.status(404).json({
          msg: "Not found!",
        });
      }
    });
  }
);

// @route POST api/registrar/getsubjectbygradelevel
// @desc Get subjects by grade level
// @access Private

router.post(
  "/getsubjectbygradelevel",
  passport.authenticate("registrar", {
    session: false,
  }),
  async (req, res) => {
    let { gradeLevel } = req.body;
    const nonSHSGradeLevel = [
      "G1",
      "G2",
      "G3",
      "G4",
      "G5",
      "G6",
      "G7",
      "G8",
      "G9",
      "G10",
    ];
    if (["G11", "G12"].includes(gradeLevel)) {
      Subject.findAll({
        where: {
          subjectType: {
            [Op.notIn]: nonSHSGradeLevel,
          },
          archived: 0,
        },
      }).then((subjects) => {
        if (subjects.length == 0) {
          res.status(404).json({
            msg: "Not found",
          });
        } else {
          let subjectsData = [];
          let i = 0;
          for (i; i < subjects.length; i++) {
            const { subjectID, subjectCode, subjectName } = subjects[i];
            subjectsData.push({
              subjectID,
              subjectCode,
              subjectName,
            });
          }
          res.status(200).json({
            subjectsList: subjectsData,
          });
        }
      });
    } else {
      Subject.findAll({
        where: {
          subjectType: gradeLevel,
          archived: 0,
        },
      }).then((subjects) => {
        if (subjects.length == 0) {
          res.status(404).json({
            msg: "Not found",
          });
        } else {
          let subjectsData = [];
          let i = 0;
          for (i; i < subjects.length; i++) {
            const { subjectID, subjectCode, subjectName } = subjects[i];
            subjectsData.push({
              subjectID,
              subjectCode,
              subjectName,
            });
          }
          res.status(200).json({
            subjectsList: subjectsData,
          });
        }
      });
    }
  }
);

// @route POST api/registrar/getsubsectinfo
// @desc Get subject section info
// @access Private

router.post(
  "/getsubsectinfo",
  passport.authenticate("registrar", {
    session: false,
  }),
  async (req, res) => {
    const { subsectID } = req.body;
    SubjectSection.findOne({
      where: {
        subsectID,
      },
    }).then((subjectsection) => {
      if (subjectsection) {
        SubjectSectionStudent.findAll({
          where: {
            subsectID,
          },
        }).then(async (subjectsectionstudents) => {
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
              sectionName,
              gradeLevel,
              subjectName,
              studentList: [],
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
            for (i; i < subjectsectionstudents.length; i++) {
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
                gradeLevel,
              });
            }
            res.status(200).json({
              sectionName,
              gradeLevel,
              subjectName,
              studentList: studarr,
            });
          }
        });
      } else {
        res.status(404).json({
          msg: "Subject section not found!",
        });
      }
    });
  }
);

// @route POST api/registrar/addsubsectstud
// @desc Add a stud sect to subject section
// @access Private

router.post(
  "/addsubsectstud",
  passport.authenticate("registrar", {
    session: false,
  }),
  async (req, res) => {
    const { studsectID, subsectID } = req.body;
    const { schoolYearID, quarter } = await utils.getActiveSY();
    SubjectSectionStudent.findOne({
      where: {
        studsectID,
        subsectID,
      },
    }).then(async (subjectsectionstudent) => {
      if (subjectsectionstudent) {
        res.status(400).json({
          msg: "Student already enrolled in the subject!",
        });
      } else {
        SubjectSectionStudent.create({
          studsectID,
          subsectID,
        }).then(async (subsectstud) => {
          SubjectSection.findOne({
            where: {
              subsectID,
            },
          }).then(async (ss) => {
            if (ss) {
              const subjectType = await Subject.findOne({
                where: {
                  subjectID: ss.subjectID,
                },
              }).then((subj) => {
                if (subj) {
                  return subj.subjectType;
                }
              });
              let isSHS = ![
                "N",
                "K1",
                "K2",
                "G1",
                "G2",
                "G3",
                "G4",
                "G5",
                "G6",
                "G7",
                "G8",
                "G9",
                "G10",
              ].includes(subjectType);
              let q = isSHS ? ["Q1", "Q2"] : ["Q1", "Q2", "Q3", "Q4"];
              let i = 0;
              for (i = 0; i < q.length; i++) {
                StudentWeightedScore.create({
                  subsectstudID: subsectstud.subsectstudID,
                  classRecordID: ss.classRecordID,
                  faWS: -1,
                  wwWS: -1,
                  ptWS: -1,
                  qeWS: -1,
                  finalGrade: -1,
                  quarter: q[i],
                });
              }
              StudentSubjectGrades.create({
                subsectstudID: subsectstud.subsectstudID,
                classRecordID: ss.classRecordID,
              });

              Grade.findAll({
                attributes: [
                  [
                    Sequelize.fn("DISTINCT", Sequelize.col("description")),
                    "description",
                  ],
                  [Sequelize.col("total"), "total"],
                  [Sequelize.col("dateGiven"), "dateGiven"],
                  [Sequelize.col("componentID"), "componentID"],
                  [Sequelize.col("subcomponentID"), "subcomponentID"],
                  [Sequelize.col("classRecordID"), "classRecordID"],
                  [Sequelize.col("quarter"), "quarter"],
                ],
                where: {
                  classRecordID: ss.classRecordID,
                },
              }).then(async (res) => {
                if (res.length != 0) {
                  for (const [index, value] of res.entries()) {
                    await Grade.create({
                      description: value.description,
                      dateGiven: value.dateGiven,
                      score: 0,
                      total: value.total,
                      componentID: value.componentID,
                      subcomponentID: value.subcomponentID,
                      date: new Date(),
                      classRecordID: ss.classRecordID,
                      subsectstudID: subsectstud.subsectstudID,
                      quarter: value.quarter,
                      attendance: "P",
                      showLog: 0,
                      isUpdated: 0,
                    });
                  }
                  await utils.refreshStudentWeightedScoreBySubsectID(
                    ss.subsectID
                  );
                }
              });
              res.status(200).json({
                msg: "Student added to subject successfully!",
              });
            } else {
              res.status(404).json({
                msg: "Subject section does not exist!",
              });
            }
          });
        });
      }
    });
  }
);

// @route POST api/registrar/deletesubsectstud
// @desc Delete a stud sect to subject section
// @access Private

router.post(
  "/deletesubsectstud",
  passport.authenticate("registrar", {
    session: false,
  }),
  async (req, res) => {
    const { subsectstudID } = req.body;
    SubjectSectionStudent.findOne({
      where: {
        subsectstudID,
      },
    }).then((data) => {
      if (data) {
        data.destroy().then(() => {
          res.status(200).json({
            msg: "Student deleted to subject successfully!",
          });
        });
      } else {
        res.status(404).json({
          msg: "Not found!",
        });
      }
    });
  }
);

// @route POST api/registrar/getsubmittedsubsect
// @desc Get subject section where class record status = 'D'
// @access Private

router.post(
  "/getsubmittedsubsect",
  passport.authenticate("registrar", {
    session: false,
  }),
  async (req, res) => {
    let { accountID, page, pageSize, quarter } = req.body;
    page = page - 1;
    let offset = page * pageSize;
    let limit = offset + pageSize;
    const { schoolYearID } = await utils.getActiveSY();
    const teacherID = await utils.getTeacherID(accountID);
    const teacher = await utils.getTeacherName(teacherID);
    const deadline = await SubmissionDeadline.findOne({
      where: {
        teacherID,
        isActive: 1,
      },
    }).then((sd) => {
      if (sd) {
        return sd.deadline;
      } else {
        return "NOT SET";
      }
    });
    const classRecordIDs = await SubjectSection.findAll({
      where: {
        teacherID,
        schoolYearID,
        subjectType: {
          [Op.in]:
            quarter == "Q1" || quarter == "Q2"
              ? ["NON_SHS", "1ST_SEM"]
              : ["NON_SHS", "2ND_SEM"],
        },
      },
    }).then(async (ss) => {
      if (ss) {
        let data = [];
        for (const [i, v] of ss.entries()) {
          const crs = await ClassRecordStatus.findOne({
            where: {
              classRecordID: v.classRecordID,
            },
          });
          if (quarter == "Q1" || quarter == "Q2") {
            if (crs[quarter.toLowerCase()] == "D") {
              data.push(v.classRecordID);
            }
          } else {
            if (quarter == "Q3") {
              if (v.subjectType == "NON_SHS") {
                if (crs[quarter.toLowerCase()] == "D") {
                  data.push(v.classRecordID);
                }
              } else {
                if (crs["q1"] == "D") {
                  data.push(v.classRecordID);
                }
              }
            } else {
              if (v.subjectType == "NON_SHS") {
                if (crs[quarter.toLowerCase()] == "D") {
                  data.push(v.classRecordID);
                }
              } else {
                if (crs["q2"] == "D") {
                  data.push(v.classRecordID);
                }
              }
            }
          }
        }
        return data;
      }
    });
    if (classRecordIDs.length == 0) {
      res.status(200).json({
        classRecordList: [],
        numOfPages: 1,
        deadline,
      });
    } else {
      let condition = {};
      condition["classRecordID"] = {
        [Op.in]: classRecordIDs,
      };
      await ClassRecordStatus.findAll({
        limit,
        offset,
        where: condition,
      }).then(async (crs) => {
        if (crs) {
          if (crs.length == 0) {
            res.status(404).json({
              msg: "No class record for deliberation found",
            });
          } else {
            let data2 = [];
            let numOfPages = 1;
            crs.slice(0, pageSize).forEach(async (v, k, r) => {
              const { classRecordID } = v;
              const subjectType = await utils.getSubjectTypeByClassRecordID(
                classRecordID
              );
              let dateSubmitted = v[`${quarter.toLowerCase()}DateSubmitted`];
              if (subjectType == "2ND_SEM") {
                if (quarter == "Q3") {
                  dateSubmitted = v.q1DateSubmitted;
                } else if (quarter == "Q4") {
                  dateSubmitted = v.q2DateSubmitted;
                }
              }
              const {
                subjectCode,
                subjectName,
                section,
                subsectID,
              } = await SubjectSection.findOne({
                where: {
                  classRecordID,
                },
              }).then(async (cr) => {
                if (cr) {
                  const subjectCode = await utils.getSubjectCode(cr.subjectID);
                  const { subsectID } = cr;
                  const subjectName = await utils.getSubjectName(cr.subjectID);
                  const section = await utils.getSectionName(cr.sectionID);
                  return {
                    subjectCode,
                    subsectID,
                    subjectName,
                    section,
                  };
                }
              });
              data2.push({
                teacher,
                classRecordID,
                dateSubmitted,
                subjectCode,
                subjectName,
                section,
                subsectID,
              });
              if (k == r.length - 1) {
                numOfPages = await ClassRecordStatus.findAndCountAll({
                  where: condition,
                }).then((count) => {
                  return Math.ceil(count.count / pageSize);
                });
                res.status(200).json({
                  classRecordList: data2,
                  numOfPages,
                  deadline,
                });
              }
            });
          }
        }
      });
    }
  }
);

// @router POST api/registrar/condenseddeliberationgrade
// @desc Get condensed grade of students by sectionID and quarter
// @access Private

router.post(
  "/condenseddeliberationgrade",
  passport.authenticate("registrar", {
    session: false,
  }),
  async (req, res) => {
    const { sectionID, quarter } = req.body;
    const { schoolYearID } = await utils.getActiveSY();
    const studsectIDs = await StudentSection.findAll({
      where: {
        sectionID,
        schoolYearID,
      },
    }).then((ss) => {
      if (ss) {
        let data = [];
        for (const [i, v] of ss.entries()) {
          data.push(v.studsectID);
        }
        return data;
      }
    });
    SubjectSectionStudent.findAll({
      where: {
        studsectID: {
          [Op.in]: studsectIDs,
        },
      },
    }).then(async (sss) => {
      if (sss) {
        let data3 = [];
        for (const [i, x] of sss.entries()) {
          const grades = await SubjectSectionStudent.findAll({
            where: {
              studsectID: x.studsectID,
            },
          }).then(async (sss2) => {
            if (sss2) {
              let data2 = [];
              for (const [i, v] of sss2.entries()) {
                let name = await utils.getStudentNameBySubsectstudID(
                  v.subsectstudID
                );
                let sex = await utils.getStudentSexBySubsectstudID(
                  v.subsectstudID
                );
                let imageUrl = await utils.getStudentImageUrlBySubsectstudID(
                  v.subsectstudID
                );
                let studsectID = v.studsectID;
                let {
                  subjectType,
                  classRecordID,
                } = await SubjectSection.findOne({
                  where: {
                    subsectID: v.subsectID,
                  },
                }).then(async (ss) => {
                  if (ss) {
                    return {
                      subjectType: ss.subjectType,
                      classRecordID: ss.classRecordID,
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
                if (typeof status !== "undefined") {
                  let {
                    score,
                    subjectName,
                  } = await StudentSubjectGrades.findOne({
                    where: {
                      classRecordID,
                      subsectstudID: v.subsectstudID,
                    },
                  }).then(async (ssg) => {
                    if (ssg) {
                      let score;
                      let subjectID = await utils.getSubjectIDBySubsectstudID(
                        ssg.subsectstudID
                      );
                      let subjectName = await utils.getSubjectCode(subjectID);
                      if (status == "F" || status == "D") {
                        if (quarter == "Q1") {
                          if (
                            subjectType == "NON_SHS" ||
                            subjectType == "1ST_SEM"
                          ) {
                            score = ssg.q1FinalGrade;
                          }
                        } else if (quarter == "Q2") {
                          if (
                            subjectType == "NON_SHS" ||
                            subjectType == "1ST_SEM"
                          ) {
                            score = ssg.q2FinalGrade;
                          }
                        } else if (quarter == "Q3") {
                          if (subjectType == "NON_SHS") {
                            score = ssg.q3FinalGrade;
                          } else if (subjectType == "2ND_SEM") {
                            score = ssg.q1FinalGrade;
                          }
                        } else {
                          if (subjectType == "NON_SHS") {
                            score = ssg.q4FinalGrade;
                          } else if (subjectType == "2ND_SEM") {
                            score = ssg.q2FinalGrade;
                          }
                        }
                      }
                      return {
                        score,
                        subjectName,
                      };
                    }
                  });
                  if (typeof score !== "undefined" && typeof score !== "null") {
                    data2.push({
                      status,
                      imageUrl,
                      sex,
                      score,
                      subjectName,
                      name,
                      studsectID,
                    });
                  }
                }
              }
              return data2;
            }
          });
          data3.push(grades);
        }
        const resData = utils.formatCondensedDeliberationGrade(data3);
        res.status(200).json({
          data: [
            ...resData.data.filter((a) => a.sex == "M"),
            ...resData.data.filter((a) => a.sex == "F"),
          ],
          columns: resData.columns,
        });
      }
    });
  }
);

// @router POST api/registrar/condensedfinalgrade
// @desc Get condensed grade of students by sectionID and quarter
// @access Private

router.post(
  "/condensedfinalgrade",
  passport.authenticate(directorRegistrar, {
    session: false,
  }),
  async (req, res) => {
    const { sectionID, quarter, schoolYearID } = req.body;
    const studsectIDs = await StudentSection.findAll({
      where: {
        sectionID,
        schoolYearID,
      },
    }).then((ss) => {
      if (ss) {
        let data = [];
        for (const [i, v] of ss.entries()) {
          data.push(v.studsectID);
        }
        return data;
      }
    });
    SubjectSectionStudent.findAll({
      where: {
        studsectID: {
          [Op.in]: studsectIDs,
        },
      },
    }).then(async (sss) => {
      if (sss) {
        let data3 = [];
        for (const [i, x] of sss.entries()) {
          const grades = await SubjectSectionStudent.findAll({
            where: {
              studsectID: x.studsectID,
            },
          }).then(async (sss2) => {
            if (sss2) {
              let data2 = [];
              for (const [i, v] of sss2.entries()) {
                let name = await utils.getStudentNameBySubsectstudID(
                  v.subsectstudID
                );
                let studentID = await StudentSection.findOne({
                  where: {
                    studsectID: v.studsectID,
                  },
                }).then((ss) => ss.studentID);
                let sex = await utils.getStudentSexBySubsectstudID(
                  v.subsectstudID
                );
                let imageUrl = await utils.getStudentImageUrlBySubsectstudID(
                  v.subsectstudID
                );
                let studsectID = v.studsectID;
                let {
                  subjectType,
                  classRecordID,
                } = await SubjectSection.findOne({
                  where: {
                    subsectID: v.subsectID,
                  },
                }).then(async (ss) => {
                  if (ss) {
                    return {
                      subjectType: ss.subjectType,
                      classRecordID: ss.classRecordID,
                    };
                  }
                });
                let teacher = await SubjectSection.findOne({
                  where: {
                    classRecordID,
                  },
                }).then(async (ss) => await utils.getTeacherName(ss.teacherID));
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
                if (typeof status !== "undefined") {
                  let {
                    score,
                    subjectName,
                  } = await StudentSubjectGrades.findOne({
                    where: {
                      classRecordID,
                      subsectstudID: v.subsectstudID,
                    },
                  }).then(async (ssg) => {
                    if (ssg) {
                      let score;
                      let subjectID = await utils.getSubjectIDBySubsectstudID(
                        ssg.subsectstudID
                      );
                      let subjectName = await utils.getSubjectCode(subjectID);
                      if (status == "F" || status == "D") {
                        if (quarter == "Q1") {
                          if (
                            subjectType == "NON_SHS" ||
                            subjectType == "1ST_SEM"
                          ) {
                            score = ssg.q1FinalGrade;
                          }
                        } else if (quarter == "Q2") {
                          if (
                            subjectType == "NON_SHS" ||
                            subjectType == "1ST_SEM"
                          ) {
                            score = ssg.q2FinalGrade;
                          }
                        } else if (quarter == "Q3") {
                          if (subjectType == "NON_SHS") {
                            score = ssg.q3FinalGrade;
                          } else if (subjectType == "2ND_SEM") {
                            score = ssg.q1FinalGrade;
                          }
                        } else {
                          if (subjectType == "NON_SHS") {
                            score = ssg.q4FinalGrade;
                          } else if (subjectType == "2ND_SEM") {
                            score = ssg.q2FinalGrade;
                          }
                        }
                      }
                      return {
                        score,
                        subjectName,
                      };
                    }
                  });
                  if (typeof score !== "undefined" && typeof score !== "null") {
                    data2.push({
                      teacher,
                      classRecordID,
                      status,
                      imageUrl,
                      studentID,
                      sex,
                      score,
                      subjectName,
                      name,
                      studsectID,
                    });
                  }
                }
              }
              return data2;
            }
          });
          data3.push(grades);
        }
        const resData = utils.formatCondensedDeliberationGrade(data3);
        res.status(200).json({
          data: [
            ...resData.data.filter((a) => a.sex == "M"),
            ...resData.data.filter((a) => a.sex == "F"),
          ],
          columns: resData.columns,
        });
      }
    });
  }
);

// @route POST api/registrar/getsectionname
// @desc Get section name by studentID
// @access Private

router.post(
  "/getsectionname",
  passport.authenticate(directorRegistrar, {
    session: false,
  }),
  async (req, res) => {
    const response = await utils.getSectionName(req.body.sectionID);
    res.status(200).json({
      sectionName: response,
    });
  }
);

// @route POST api/registrar/getsyname
// @desc Get school year name by schoolYearID
// @access Private

router.post(
  "/getsyname",
  passport.authenticate(directorRegistrar, {
    session: false,
  }),
  async (req, res) => {
    const response = await utils.getSYname(req.body.schoolYearID);
    res.status(200).json({
      schoolYear: response,
    });
  }
);

// @route POST api/registrar/getnotsubmittedsubsect
// @desc Get not submitted subject section where class record status = 'D'
// @access Private

router.post(
  "/getnotsubmittedsubsect",
  passport.authenticate("registrar", {
    session: false,
  }),
  async (req, res) => {
    let { accountID, page, pageSize, quarter } = req.body;
    page = page - 1;
    let offset = page * pageSize;
    let limit = offset + pageSize;
    const { schoolYearID } = await utils.getActiveSY();
    const teacherID = await utils.getTeacherID(accountID);
    const deadline = await SubmissionDeadline.findOne({
      where: {
        teacherID,
        isActive: 1,
      },
    }).then((sd) => {
      if (sd) {
        return sd.deadline;
      } else {
        return "NOT SET";
      }
    });
    const classRecordIDs = await SubjectSection.findAll({
      where: {
        teacherID,
        schoolYearID,
        subjectType: {
          [Op.in]:
            quarter == "Q1" || quarter == "Q2"
              ? ["NON_SHS", "1ST_SEM"]
              : ["NON_SHS", "2ND_SEM"],
        },
      },
    }).then(async (ss) => {
      if (ss) {
        let data = [];
        for (const [i, v] of ss.entries()) {
          const crs = await ClassRecordStatus.findOne({
            where: {
              classRecordID: v.classRecordID,
            },
          });
          if (quarter == "Q1" || quarter == "Q2") {
            if (crs[quarter.toLowerCase()] == "E") {
              data.push(v.classRecordID);
            }
          } else {
            if (quarter == "Q3") {
              if (v.subjectType == "NON_SHS") {
                if (crs[quarter.toLowerCase()] == "E") {
                  data.push(v.classRecordID);
                }
              } else {
                if (crs["q1"] == "E") {
                  data.push(v.classRecordID);
                }
              }
            } else {
              if (v.subjectType == "NON_SHS") {
                if (crs[quarter.toLowerCase()] == "E") {
                  data.push(v.classRecordID);
                }
              } else {
                if (crs["q2"] == "E") {
                  data.push(v.classRecordID);
                }
              }
            }
          }
        }
        return data;
      }
    });
    if (classRecordIDs.length == 0) {
      res.status(200).json({
        classRecordList: [],
        numOfPages: 1,
        deadline: "NOT SET",
      });
    } else {
      let condition = {};
      condition["classRecordID"] = {
        [Op.in]: classRecordIDs,
      };
      await ClassRecordStatus.findAll({
        limit,
        offset,
        where: condition,
      }).then(async (crs) => {
        if (crs) {
          if (crs.length == 0) {
            res.status(200).json({
              classRecordList: [],
              numOfPages: 1,
              deadline: "NOT SET",
            });
          } else {
            let data2 = [];
            let numOfPages = 1;
            crs.slice(0, pageSize).forEach(async (v, k, r) => {
              const { classRecordID } = v;
              const subjectType = await utils.getSubjectTypeByClassRecordID(
                classRecordID
              );
              let dateSubmitted = v[`${quarter.toLowerCase()}DateSubmitted`];
              if (subjectType == "2ND_SEM") {
                if (quarter == "Q3") {
                  dateSubmitted = v.q1DateSubmitted;
                } else if (quarter == "Q4") {
                  dateSubmitted = v.q2DateSubmitted;
                }
              }
              const {
                subjectCode,
                subjectName,
                section,
                subsectID,
              } = await SubjectSection.findOne({
                where: {
                  classRecordID,
                },
              }).then(async (cr) => {
                if (cr) {
                  const subjectCode = await utils.getSubjectCode(cr.subjectID);
                  const { subsectID } = cr;
                  const subjectName = await utils.getSubjectName(cr.subjectID);
                  const section = await utils.getSectionName(cr.sectionID);
                  return {
                    subjectCode,
                    subsectID,
                    subjectName,
                    section,
                  };
                }
              });
              data2.push({
                classRecordID,
                dateSubmitted,
                subjectCode,
                subjectName,
                section,
                subsectID,
              });
              if (k == r.length - 1) {
                numOfPages = await ClassRecordStatus.findAndCountAll({
                  where: condition,
                }).then((count) => {
                  return Math.ceil(count.count / pageSize);
                });
                res.status(200).json({
                  classRecordList: data2,
                  numOfPages,
                  deadline,
                });
              }
            });
          }
        }
      });
    }
  }
);

// @route POST api/registrar/getclassrecinfo
// @desc Get class record info by classRecordID and quarter
// @access Private

router.post(
  "/getclassrecinfo",
  passport.authenticate(directorRegistrar, {
    session: false,
  }),
  async (req, res) => {
    let { classRecordID, quarter } = req.body;
    let { page, pageSize } = req.body;
    page = page - 1;
    let offset = page * pageSize;
    let limit = offset + pageSize;
    const subjectType = await utils.getSubjectTypeByClassRecordID(
      classRecordID
    );

    const { IDs, data, numOfPages } = await StudentSubjectGrades.findAll({
      where: {
        classRecordID,
      },
    }).then(async (sg) => {
      if (sg) {
        if (sg.length == 0) {
          res.status(200).json({
            numOfPages: 1,
            studentList: [],
          });
        } else {
          let data = [];
          let IDs = [];
          for (const [index, value] of sg.entries()) {
            const { subsectstudID } = value;
            let add = {};
            let grade = value[`${quarter.toLowerCase()}FinalGrade`];
            var i = 0;
            for (i = 1; i < parseInt(quarter.charAt(1)); i = i + 1) {
              add[`q${i}Grade`] = value[`q${i}FinalGrade`];
            }
            // if (quarter != "Q1") {
            //   add[`q${parseInt(quarter.charAt(1))-1}Grade`] = value[`q${parseInt(quarter.charAt(1))-1}FinalGrade`]
            // }
            if (subjectType == "2ND_SEM") {
              if (quarter == "Q3") {
                grade = value["q1FinalGrade"];
              } else if (quarter == "Q4") {
                grade = value["q2FinalGrade"];
                add["q1Grade"] = value["q1FinalGrade"];
              } else {
                grade = -1;
              }
            } else if (subjectType == "1ST_SEM") {
              if (quarter == "Q3" || quarter == "Q4") {
                grade = -1;
              }
            }
            const accountID = await utils.getAccountIDBySubsectstudID(
              subsectstudID
            );
            data.push({
              ...add,
              subsectstudID,
              grade,
              accountID,
            });
            IDs.push(accountID);
          }
          return {
            IDs,
            data,
            numOfPages: Math.ceil(data.length / pageSize),
          };
        }
      }
    });

    UserAccount.findAll({
      where: {
        accountID: {
          [Op.in]: IDs,
        },
      },
      order: [
        ["lastName", "ASC"],
        ["sex", "DESC"],
      ],
    }).then(async (ua) => {
      if (ua) {
        let newData = [];
        for (const [index, value] of ua.entries()) {
          const name = `${utils.capitalize(value.lastName)}, ${utils.capitalize(
            value.firstName
          )} ${value.middleName.charAt(0).toUpperCase()}.`;
          const subsectID = data.find((a) => a.accountID == value.accountID)
            .subsectID;
          const grade = data.find((a) => a.accountID == value.accountID).grade;
          const q1Grade = data.find((a) => a.accountID == value.accountID)
            .q1Grade;
          const q2Grade = data.find((a) => a.accountID == value.accountID)
            .q2Grade;
          const q3Grade = data.find((a) => a.accountID == value.accountID)
            .q3Grade;
          const q4Grade = data.find((a) => a.accountID == value.accountID)
            .q4Grade;
          const { imageUrl, sex } = value;
          newData.push({
            q1Grade,
            q2Grade,
            q3Grade,
            q4Grade,
            sex,
            name,
            subsectID,
            grade,
            imageUrl,
          });
        }
        res.status(200).json({
          numOfPages,
          studentList: [
            ...newData.filter((a) => a.sex == "M"),
            ...newData.filter((a) => a.sex == "F"),
          ].slice(page * pageSize, (page + 1) * pageSize),
        });
      }
    });
  }
);

// @route POST api/registrar/postclassrecord
// @desc Post class record by classRecordID and quarter
// @access Private

router.post(
  "/postclassrecord",
  passport.authenticate("registrar", {
    session: false,
  }),
  async (req, res) => {
    let { classRecordID, quarter } = req.body;
    const {
      subjectID,
      sectionID,
      subjectType,
      subsectID,
    } = await SubjectSection.findOne({
      where: {
        classRecordID,
      },
    }).then((ss) => {
      if (ss) {
        return {
          subjectID: ss.subjectID,
          sectionID: ss.sectionID,
          subjectType: ss.subjectType,
          subsectID: ss.subsectID,
        };
      }
    });
    if (subjectType == "2ND_SEM") {
      if (quarter == "Q3") {
        quarter = "Q1";
      } else {
        quarter = "Q2";
      }
    }

    ClassRecordStatus.findOne({
      where: {
        classRecordID,
      },
    }).then(async (crs) => {
      if (crs) {
        let quarterObj = {};
        quarterObj[quarter.toLowerCase()] = "F";
        let invalid =
          crs[quarter.toLowerCase()] == "L" ||
          crs[quarter.toLowerCase()] == "F" ||
          crs[quarter.toLowerCase()] == "E";
        if (invalid) {
          res.status(400).json({
            msg: "You are not authorized to edit this class record.",
          });
        } else {
          crs
            .update(quarterObj, {
              position: "Registrar",
              classRecordID,
              type: "CHANGE_STATUS",
              accountID: req.user.accountID,
              subjectID,
              sectionID,
              oldVal: "D",
              newVal: "F",
              quarter,
            })
            .then(async () => {
              await utils.refreshStudentGradesBySubsectID(subsectID);
              res.status(200).json({
                msg: "Class record is now posted!",
              });
            });
        }
      }
    });
  }
);

// @route POST api/registrar/revertclassrecord
// @desc Revert class record by classRecordID and quarter
// @access Private

router.post(
  "/revertclassrecord",
  passport.authenticate("registrar", {
    session: false,
  }),
  async (req, res) => {
    let { classRecordID, quarter } = req.body;
    const {
      subjectID,
      sectionID,
      subjectType,
      subsectID,
    } = await SubjectSection.findOne({
      where: {
        classRecordID,
      },
    }).then((ss) => {
      if (ss) {
        return {
          subjectID: ss.subjectID,
          sectionID: ss.sectionID,
          subjectType: ss.subjectType,
          subsectID: ss.subsectID,
        };
      }
    });
    if (subjectType == "2ND_SEM") {
      if (quarter == "Q3") {
        quarter = "Q1";
      } else {
        quarter = "Q2";
      }
    }

    ClassRecordStatus.findOne({
      where: {
        classRecordID,
      },
    }).then(async (crs) => {
      if (crs) {
        let quarterObj = {};
        quarterObj[quarter.toLowerCase()] = "D";
        let invalid =
          crs[quarter.toLowerCase()] == "L" ||
          crs[quarter.toLowerCase()] == "D" ||
          crs[quarter.toLowerCase()] == "E";
        if (invalid) {
          res.status(400).json({
            msg: "You are not authorized to edit this class record.",
          });
        } else {
          crs
            .update(quarterObj, {
              position: "Registrar",
              classRecordID,
              type: "CHANGE_STATUS",
              accountID: req.user.accountID,
              subjectID,
              sectionID,
              oldVal: "F",
              newVal: "D",
              quarter,
            })
            .then(async () => {
              await utils.refreshStudentGradesBySubsectID(subsectID);
              res.status(200).json({
                msg: "Class record is now ready for deliberation!",
              });
            });
        }
      }
    });
  }
);

// @route POST api/registrar/getsubjecttype
// @desc Get subject type by classRecordID
// @access Private

router.post(
  "/getsubjecttype",
  passport.authenticate(directorRegistrar, {
    session: false,
  }),
  async (req, res) => {
    const { classRecordID } = req.body;
    SubjectSection.findOne({
      where: {
        classRecordID,
      },
    }).then((ss) => {
      if (ss) {
        res.status(200).json({
          subjectType: ss.subjectType,
        });
      } else {
        res.status(404).json({
          msg: "Subject section not found!",
        });
      }
    });
  }
);

// @route POST api/registrar/getcomponents
// @desc Get components by classRecordID and quarter
// @access Private

router.post(
  "/getcomponents",
  passport.authenticate(directorRegistrar, {
    session: false,
  }),
  async (req, res) => {
    const { classRecordID, quarter } = req.body;
    SubjectSection.findOne({
      where: {
        classRecordID,
      },
    }).then((subjectsection) => {
      if (subjectsection) {
        Component.findOne({
          where: {
            subjectID: subjectsection.subjectID,
            component: "FA",
          },
        }).then((comp1) => {
          Component.findOne({
            where: {
              subjectID: subjectsection.subjectID,
              component: "WW",
            },
          }).then((comp2) => {
            Component.findOne({
              where: {
                subjectID: subjectsection.subjectID,
                component: "PT",
              },
            }).then((comp3) => {
              Component.findOne({
                where: {
                  subjectID: subjectsection.subjectID,
                  component: "QE",
                },
              }).then(async (comp4) => {
                let faSubcompData = [];
                let wwSubcompData = [];
                let ptSubcompData = [];
                let qeSubcompData = [];
                await Subcomponent.findAll({
                  where: {
                    classRecordID: subjectsection.classRecordID,
                    componentID: comp1.componentID,
                    quarter,
                  },
                }).then(async (subcomp1) => {
                  if (subcomp1.length != 0) {
                    let i = 0;
                    for (i = 0; i < subcomp1.length; i++) {
                      let { name, compWeight, subcompID } = subcomp1[i];
                      faSubcompData.push({
                        name,
                        compWeight,
                        subcompID,
                      });
                    }
                  }
                });
                await Subcomponent.findAll({
                  where: {
                    classRecordID: subjectsection.classRecordID,
                    componentID: comp2.componentID,
                    quarter,
                  },
                }).then(async (subcomp2) => {
                  if (subcomp2.length != 0) {
                    let i = 0;
                    for (i = 0; i < subcomp2.length; i++) {
                      let { name, compWeight, subcompID } = subcomp2[i];
                      wwSubcompData.push({
                        name,
                        compWeight,
                        subcompID,
                      });
                    }
                  }
                });
                await Subcomponent.findAll({
                  where: {
                    classRecordID: subjectsection.classRecordID,
                    componentID: comp3.componentID,
                    quarter,
                  },
                }).then(async (subcomp3) => {
                  if (subcomp3.length != 0) {
                    let i = 0;
                    for (i = 0; i < subcomp3.length; i++) {
                      let { name, compWeight, subcompID } = subcomp3[i];
                      ptSubcompData.push({
                        name,
                        compWeight,
                        subcompID,
                      });
                    }
                  }
                });
                await Subcomponent.findAll({
                  where: {
                    classRecordID: subjectsection.classRecordID,
                    componentID: comp4.componentID,
                    quarter,
                  },
                }).then(async (subcomp4) => {
                  if (subcomp4.length != 0) {
                    let i = 0;
                    for (i = 0; i < subcomp4.length; i++) {
                      let { name, compWeight, subcompID } = subcomp4[i];
                      qeSubcompData.push({
                        name,
                        compWeight,
                        subcompID,
                      });
                    }
                  }
                });
                const sectionName = await utils.getSectionName(
                  subjectsection.sectionID
                );
                const subjectName = await utils.getSubjectName(
                  subjectsection.subjectID
                );
                const schoolYear = await utils.getSYname(
                  subjectsection.schoolYearID
                );
                const subjectCode = await utils.getSubjectCode(
                  subjectsection.subjectID
                );
                res.status(200).json({
                  subjectCode,
                  sectionName,
                  subjectName,
                  schoolYear,
                  classRecordID: subjectsection.classRecordID,
                  FA: {
                    componentID: comp1.componentID,
                    weight: comp1.compWeight,
                    subcomponents: faSubcompData,
                  },
                  WW: {
                    componentID: comp2.componentID,
                    weight: comp2.compWeight,
                    subcomponents: wwSubcompData,
                  },
                  PT: {
                    componentID: comp3.componentID,
                    weight: comp3.compWeight,
                    subcomponents: ptSubcompData,
                  },
                  QE: {
                    componentID: comp4.componentID,
                    weight: comp4.compWeight,
                    subcomponents: qeSubcompData,
                  },
                });
              });
            });
          });
        });
      } else {
        res.status(404).json({
          msg: "Subject Section not found!",
        });
      }
    });
  }
);

// @route POST api/teacher/editsubcomp
// @desc Edit subcomponent name, weight by subcomponentID
// @access Private

router.post(
  "/editsubcomp",
  passport.authenticate("registrar", {
    session: false,
  }),
  async (req, res) => {
    const reg = /^-?[0-9]*(\.[0-9]*)?$/;
    const { payload, classRecordID, quarter } = req.body;
    ClassRecordStatus.findOne({
      where: {
        classRecordID,
      },
    }).then(async (crs) => {
      if (crs) {
        let invalid = false;
        if (quarter == "Q1") {
          invalid = crs.q1 == "L" || crs.q1 == "E" || crs.q1 == "F";
        } else if (quarter == "Q2") {
          invalid = crs.q2 == "L" || crs.q2 == "E" || crs.q2 == "F";
        } else if (quarter == "Q3") {
          invalid = crs.q3 == "L" || crs.q3 == "E" || crs.q3 == "F";
        } else {
          invalid = crs.q4 == "L" || crs.q4 == "E" || crs.q4 == "F";
        }
        if (invalid) {
          res.status(400).json({
            msg: "You are not authorized to edit this class record.",
          });
        } else {
          let i = 0;
          let sum = 0;
          for (i = 0; i < payload.length; i++) {
            let { errors, isValid } = validateSubcomponent({
              name: payload[i].name,
            });
            if (!isValid) {
              return res.status(400).json({
                msg: errors.msg,
              });
            } else {
              let valid =
                (!isNaN(payload[i].compWeight) &&
                  reg.test(payload[i].compWeight)) ||
                payload[i].compWeight === "" ||
                payload[i].compWeight === "-";
              if (
                payload[i].compWeight > 100 ||
                payload[i].compWeight < 0 ||
                !valid
              ) {
                return res.status(400).json({
                  msg: "Invalid component weight input",
                });
              } else {
                sum = sum + parseFloat(payload[i].compWeight);
              }
            }
          }

          if (sum != 100) {
            return res.status(400).json({
              msg: "Sum of component weights must be 100!",
            });
          }

          payload.forEach(async (val, arr, index) => {
            await Subcomponent.findOne({
              where: {
                subcompID: val.subcompID,
              },
            }).then((subcomp) => {
              if (subcomp) {
                SubjectSection.findOne({
                  where: {
                    classRecordID: subcomp.classRecordID,
                  },
                }).then(async (subjectsection) => {
                  if (subjectsection) {
                    let { name, compWeight } = val;
                    const componentName = await utils.getComponentName(
                      subcomp.componentID
                    );

                    subcomp
                      .update(
                        {
                          name,
                          compWeight,
                        },
                        {
                          showLog: true,
                          position: "Registrar",
                          type: "SUBCOMP_UPDATE",
                          accountID: req.user.accountID,
                          sectionID: subjectsection.sectionID,
                          subjectID: subjectsection.subjectID,
                          quarter,
                          subcompName: subcomp.name,
                          componentName,
                          classRecordID,
                          oldVal: subcomp.compWeight,
                          newVal: compWeight,
                          oldName: subcomp.name,
                          newName: name,
                        }
                      )
                      .then(async () => {
                        await utils.refreshStudentWeightedScoreBySubsectID(
                          subjectsection.subsectID
                        );
                      });
                  } else {
                    res.status(400).json({
                      msg: "Subject Section not found!",
                    });
                  }
                });
              } else {
                res.status(400).json({
                  msg: "Subcomponent not found!",
                });
              }
            });
          });
          res.status(200).json({
            msg: "Subcomponent updated successfully!",
          });
        }
      } else {
        res.status(404).json({
          msg: "Class record status not found!",
        });
      }
    });
  }
);

// @route POST api/registrar/addnewsubcomp
// @desc Add new subcomponent by classRecordID and componentID
// @access Private

router.post(
  "/addnewsubcomp",
  passport.authenticate("registrar", {
    session: false,
  }),
  async (req, res) => {
    const { classRecordID, componentID, name, quarter } = req.body;
    const { errors, isValid } = validateSubcomponent({
      name,
    });

    if (!isValid) {
      return res.status(400).json({
        msg: errors.msg,
      });
    }

    SubjectSection.findOne({
      where: {
        classRecordID,
      },
    }).then((subjectsection) => {
      if (subjectsection) {
        ClassRecordStatus.findOne({
          where: {
            classRecordID,
          },
        }).then(async (crs) => {
          if (crs) {
            if (quarter == "Q1") {
              if (crs.q1 == "L" || crs.q1 == "E" || crs.q1 == "F") {
                res.status(400).json({
                  msg: "You are not authorized to edit this class record.",
                });
              } else {
                const componentName = await utils.getComponentName(componentID);
                Subcomponent.create(
                  {
                    name,
                    componentID,
                    classRecordID,
                    compWeight: 0,
                    quarter,
                  },
                  {
                    showLog: true,
                    position: "Registrar",
                    type: "SUBCOMP_ADD",
                    accountID: req.user.accountID,
                    sectionID: subjectsection.sectionID,
                    subjectID: subjectsection.subjectID,
                    quarter,
                    subcompName: name,
                    componentName,
                    classRecordID,
                  }
                ).then((subcomponent) => {
                  res.status(200).json({
                    msg: "Successfully added a new subcomponent!",
                  });
                });
              }
            } else if (quarter == "Q2") {
              if (crs.q2 == "L" || crs.q2 == "E" || crs.q2 == "F") {
                res.status(400).json({
                  msg: "You are not authorized to edit this class record.",
                });
              } else {
                const componentName = await utils.getComponentName(componentID);
                Subcomponent.create(
                  {
                    name,
                    componentID,
                    classRecordID,
                    compWeight: 0,
                    quarter,
                  },
                  {
                    showLog: true,
                    position: "Registrar",
                    type: "SUBCOMP_ADD",
                    accountID: req.user.accountID,
                    sectionID: subjectsection.sectionID,
                    subjectID: subjectsection.subjectID,
                    quarter,
                    subcompName: name,
                    componentName,
                    classRecordID,
                  }
                ).then((subcomponent) => {
                  res.status(200).json({
                    msg: "Successfully added a new subcomponent!",
                  });
                });
              }
            } else if (quarter == "Q3") {
              if (crs.q3 == "L" || crs.q3 == "E" || crs.q3 == "F") {
                res.status(400).json({
                  msg: "You are not authorized to edit this class record.",
                });
              } else {
                const componentName = await utils.getComponentName(componentID);
                Subcomponent.create(
                  {
                    name,
                    componentID,
                    classRecordID,
                    compWeight: 0,
                    quarter,
                  },
                  {
                    showLog: true,
                    position: "Registrar",
                    type: "SUBCOMP_ADD",
                    accountID: req.user.accountID,
                    sectionID: subjectsection.sectionID,
                    subjectID: subjectsection.subjectID,
                    quarter,
                    subcompName: name,
                    componentName,
                    classRecordID,
                  }
                ).then((subcomponent) => {
                  res.status(200).json({
                    msg: "Successfully added a new subcomponent!",
                  });
                });
              }
            } else {
              if (crs.q4 == "L" || crs.q4 == "E" || crs.q4 == "F") {
                res.status(400).json({
                  msg: "You are not authorized to edit this class record.",
                });
              } else {
                const componentName = await utils.getComponentName(componentID);
                Subcomponent.create(
                  {
                    name,
                    componentID,
                    classRecordID,
                    compWeight: 0,
                    quarter,
                  },
                  {
                    showLog: true,
                    position: "Registrar",
                    type: "SUBCOMP_ADD",
                    accountID: req.user.accountID,
                    sectionID: subjectsection.sectionID,
                    subjectID: subjectsection.subjectID,
                    quarter,
                    subcompName: name,
                    componentName,
                    classRecordID,
                  }
                ).then((subcomponent) => {
                  res.status(200).json({
                    msg: "Successfully added a new subcomponent!",
                  });
                });
              }
            }
          } else {
            res.status(404).json({
              msg: "Class record status does not exist.",
            });
          }
        });
      } else {
        res.status(404).json({
          msg: "Subject section not found!",
        });
      }
    });
  }
);

// @route POST api/registrar/deletesubcomp
// @desc Delete subcomponent by subcomponentID
// @access Private

router.post(
  "/deletesubcomp",
  passport.authenticate("registrar", {
    session: false,
  }),
  async (req, res) => {
    const { subcompID, quarter, classRecordID } = req.body;
    ClassRecordStatus.findOne({
      where: {
        classRecordID,
      },
    }).then(async (crs) => {
      if (crs) {
        let invalid = false;
        if (quarter == "Q1") {
          invalid = crs.q1 == "L" || crs.q1 == "E" || crs.q1 == "F";
        } else if (quarter == "Q2") {
          invalid = crs.q2 == "L" || crs.q2 == "E" || crs.q2 == "F";
        } else if (quarter == "Q3") {
          invalid = crs.q3 == "L" || crs.q3 == "E" || crs.q3 == "F";
        } else {
          invalid = crs.q4 == "L" || crs.q4 == "E" || crs.q4 == "F";
        }
        if (invalid) {
          res.status(400).json({
            msg: "You are not authorized to edit this class record.",
          });
        } else {
          Subcomponent.findOne({
            where: {
              subcompID,
            },
          }).then((subcomponent) => {
            if (subcomponent) {
              Subcomponent.findAll({
                where: {
                  classRecordID: subcomponent.classRecordID,
                  componentID: subcomponent.componentID,
                },
              }).then((c) => {
                if (c.length == 1) {
                  res.status(400).json({
                    msg:
                      "Subcomponent can't be deleted. There must be at least one subcomponent.",
                  });
                } else {
                  let compweight = subcomponent.compWeight;
                  if (compweight != 0) {
                    res.status(400).json({
                      msg:
                        "Subcomponent can't be deleted. Set component weight to 0 first.",
                    });
                  } else {
                    Grade.findOne({
                      where: {
                        subcomponentID: subcomponent.subcompID,
                      },
                    }).then(async (g) => {
                      if (g) {
                        res.status(400).json({
                          msg:
                            "Operation could not be completed. Delete all grades under this subcomponent first.",
                        });
                      } else {
                        const {
                          sectionID,
                          subjectID,
                        } = await SubjectSection.findOne({
                          where: {
                            classRecordID,
                          },
                        }).then((ss) => {
                          if (ss) {
                            return {
                              sectionID: ss.sectionID,
                              subjectID: ss.subjectID,
                              subjectType: ss.subjectType,
                            };
                          }
                        });
                        const { accountID } = req.user;
                        const subcompName = subcomponent.name;
                        const componentName = await utils.getComponentName(
                          subcomponent.componentID
                        );
                        subcomponent
                          .destroy({
                            showLog: true,
                            position: "Registrar",
                            type: "SUBCOMP_DELETE",
                            classRecordID,
                            accountID,
                            sectionID,
                            subjectID,
                            quarter,
                            subcompName,
                            componentName,
                          })
                          .then(() => {
                            res.status(200).json({
                              msg: "Subcomponent deleted successfully!",
                            });
                          });
                      }
                    });
                  }
                }
              });
            } else {
              res.status(404).json({
                msg: "Subcomponent not found!",
              });
            }
          });
        }
      } else {
        res.status(404).json({
          msg: "Class record status does not exist.",
        });
      }
    });
  }
);

// @route POST api/registrar/getactivitylog
// @desc Get activity log by classRecordID
// @access Private

router.post(
  "/getactivitylog",
  passport.authenticate("registrar", {
    session: false,
  }),
  async (req, res) => {
    const { classRecordID, quarter } = req.body;
    const responseData = await ActivityLog.findAll({
      where: {
        classRecordID,
        quarter,
      },
      order: [["timestamp", "DESC"]],
    }).then(async (activitylogs) => {
      if (activitylogs) {
        let activitylogData = [];
        for (const [index, al] of activitylogs.entries()) {
          const {
            position,
            name,
            section,
            subject,
            type,
            logID,
            timestamp,
          } = al;
          const logDetails = await LogDetails.findAll({
            where: {
              logID,
            },
          }).then(async (lds) => {
            if (lds) {
              let logDetailsData = [];
              for (const [index2, ld] of lds.entries()) {
                const {
                  student,
                  component,
                  subcomponent,
                  description,
                  oldValue,
                  newValue,
                } = ld;
                logDetailsData.push({
                  student,
                  component,
                  subcomponent,
                  description,
                  oldValue,
                  newValue,
                });
              }

              return logDetailsData;
            }
          });

          activitylogData.push({
            position,
            name,
            section,
            subject,
            type,
            timestamp,
            logDetails,
          });
        }

        return activitylogData;
      }
    });

    res.status(200).json({
      activityLog: responseData,
    });
  }
);

// @router POST api/registrar/compinfo
// @desc Get component information by classRecordID and componentID

router.post(
  "/compinfo",
  passport.authenticate(directorRegistrar, {
    session: false,
  }),
  async (req, res) => {
    const { classRecordID, componentID, quarter } = req.body;
    const { accountID } = req.user;
    const teacherID = await utils.getTeacherID(accountID);
    SubjectSection.findOne({
      where: {
        classRecordID,
      },
    }).then(async (subjectsection) => {
      if (subjectsection) {
        Component.findOne({
          where: {
            componentID,
          },
        }).then(async (component) => {
          if (component) {
            let component = await utils.getComponentName(componentID);
            let grades = await Subcomponent.findAll({
              where: {
                componentID,
                classRecordID: subjectsection.classRecordID,
                quarter,
              },
            }).then(async (subcomp) => {
              if (subcomp.length == 0) {
                res.status(404).json({
                  msg: "Subcomponents not found!",
                });
              } else {
                let i = 0;
                let data1 = [];
                for (i = 0; i < subcomp.length; i++) {
                  const { subcompID } = subcomp[i];
                  let name = await utils.getSubcomponentName(subcompID);
                  name = name + ` (${subcomp[i].compWeight}%)`;
                  const data2 = await SubjectSectionStudent.findAll({
                    where: {
                      subsectID: subjectsection.subsectID,
                    },
                  }).then(async (subsectstud) => {
                    if (subsectstud.length == 0) {
                      res.status(404).json({
                        msg: "Subject section student not found!",
                      });
                    } else {
                      let j = 0;
                      let studentData = [];
                      for (j = 0; j < subsectstud.length; j++) {
                        const { subsectstudID } = subsectstud[j];
                        const name = await utils.getStudentNameBySubsectstudID(
                          subsectstudID
                        );
                        let sex = await utils.getStudentSexBySubsectstudID(
                          subsectstudID
                        );
                        const imageUrl = await utils.getStudentImageUrlBySubsectstudID(
                          subsectstudID
                        );
                        const grades = await Grade.findAll({
                          where: {
                            componentID,
                            subcomponentID: subcomp[i].subcompID,
                            classRecordID: subjectsection.classRecordID,
                            subsectstudID: subsectstud[j].subsectstudID,
                            quarter,
                          },
                          order: [["dateGiven", "DESC"]],
                        }).then(async (grades) => {
                          if (grades.length == 0) {
                            return [];
                          } else {
                            let k = 0;
                            let gradesData = [];
                            for (k = 0; k < grades.length; k++) {
                              const {
                                gradeID,
                                dateGiven,
                                score,
                                total,
                                attendance,
                              } = grades[k];
                              gradesData.push({
                                gradeID,
                                dateGiven,
                                score,
                                total,
                                attendance,
                              });
                            }
                            return gradesData;
                          }
                        });
                        let k = 0;
                        let sumScores = 0;
                        let sumItems = 0;
                        let excused = 0;
                        let ps = -1;
                        for (k = 0; k < grades.length; k++) {
                          if (grades[k].attendance == "E") {
                            excused = excused + 1;
                          } else if (grades[k].attendance == "A") {
                            sumScores = sumScores + 0;
                            sumItems = sumItems + parseFloat(grades[k].total);
                          } else {
                            sumScores = sumScores + parseFloat(grades[k].score);
                            sumItems = sumItems + parseFloat(grades[k].total);
                          }
                        }
                        if (grades.length != 0) {
                          if (grades.length == excused) {
                            ps = -1;
                          } else {
                            ps = (sumScores / sumItems) * 100;
                          }
                        }

                        studentData.push({
                          sex,
                          imageUrl,
                          subsectstudID,
                          name,
                          grades,
                          ps,
                        });
                      }
                      return studentData;
                    }
                  });
                  data2.sort((a, b) => (a.name > b.name ? 1 : -1));
                  let tempData = [
                    ...data2.filter((a) => a.sex == "M"),
                    ...data2.filter((a) => a.sex == "F"),
                  ];
                  data1.push({
                    subcompID,
                    name,
                    data: tempData,
                  });
                }
                return data1;
              }
            });
            let ave = await StudentWeightedScore.findAll({
              where: {
                classRecordID: subjectsection.classRecordID,
                quarter,
              },
            }).then(async (studweightedscore) => {
              if (studweightedscore.length == 0) {
                return [];
              } else {
                let l = 0;
                const aveData = [];
                for (l = 0; l < studweightedscore.length; l++) {
                  const {
                    subsectstudID,
                    faWS,
                    wwWS,
                    ptWS,
                    qeWS,
                    actualGrade,
                  } = studweightedscore[l];
                  const name = await utils.getStudentNameBySubsectstudID(
                    subsectstudID
                  );
                  let sex = await utils.getStudentSexBySubsectstudID(
                    subsectstudID
                  );
                  let ws = 0;
                  switch (component) {
                    case "Formative Assessment": {
                      ws = faWS;
                      break;
                    }
                    case "Written Works": {
                      ws = wwWS;
                      break;
                    }
                    case "Performance Task": {
                      ws = ptWS;
                      break;
                    }
                    case "Quarterly Exam": {
                      ws = qeWS;
                      break;
                    }
                    default:
                      break;
                  }
                  aveData.push({
                    sex,
                    subsectstudID,
                    ws,
                    name,
                  });
                }
                return aveData;
              }
            });
            ave.sort((a, b) => (a.name > b.name ? 1 : -1));
            let tempData2 = [
              ...ave.filter((a) => a.sex == "M"),
              ...ave.filter((a) => a.sex == "F"),
            ];
            res.status(200).json({
              componentID,
              component,
              grades,
              ave: tempData2,
            });
          } else {
            res.status(404).json({
              msg: "Component not found!",
            });
          }
        });
      } else {
        res.status(404).json({
          msg: "Subject section not found!",
        });
      }
    });
  }
);

// @router POST api/registrar/subcompinfo
// @desc Get component information by componentID and classRecordID
// @access Private

router.post(
  "/subcompinfo",
  passport.authenticate(directorRegistrar, {
    session: false,
  }),
  async (req, res) => {
    const { classRecordID, componentID, subcompID, quarter } = req.body;
    SubjectSection.findOne({
      where: {
        classRecordID,
      },
    }).then(async (subjectsection) => {
      if (subjectsection) {
        if (false) {
          res.status(400).json({
            msg: "Not authorized!",
          });
        } else {
          Component.findOne({
            where: {
              componentID,
            },
          }).then(async (component) => {
            if (component) {
              let component = await utils.getComponentName(componentID);
              let { subcomponentID, name, data } = await Subcomponent.findOne({
                where: {
                  componentID,
                  classRecordID: subjectsection.classRecordID,
                  subcompID,
                  quarter,
                },
              }).then(async (subcomp) => {
                if (!subcomp) {
                  res.status(404).json({
                    msg: "Subcomponents not found!",
                  });
                } else {
                  const subcomponentID = subcomp.subcompID;
                  let name = await utils.getSubcomponentName(subcomponentID);
                  name = name + ` (${subcomp.compWeight}%)`;
                  const data2 = await SubjectSectionStudent.findAll({
                    where: {
                      subsectID: subjectsection.subsectID,
                    },
                  }).then(async (subsectstud) => {
                    if (subsectstud.length == 0) {
                      res.status(404).json({
                        msg: "Subject section student not found!",
                      });
                    } else {
                      let j = 0;
                      let studentData = [];
                      for (j = 0; j < subsectstud.length; j++) {
                        const { subsectstudID } = subsectstud[j];
                        const name = await utils.getStudentNameBySubsectstudID(
                          subsectstudID
                        );
                        const sex = await utils.getStudentSexBySubsectstudID(
                          subsectstudID
                        );
                        const imageUrl = await utils.getStudentImageUrlBySubsectstudID(
                          subsectstudID
                        );
                        const grades = await Grade.findAll({
                          where: {
                            componentID,
                            subcomponentID: subcomp.subcompID,
                            classRecordID: subjectsection.classRecordID,
                            subsectstudID: subsectstud[j].subsectstudID,
                            quarter,
                          },
                          order: [["date", "DESC"]],
                        }).then(async (grades) => {
                          if (grades.length == 0) {
                            return [];
                          } else {
                            let k = 0;
                            let gradesData = [];
                            for (k = 0; k < grades.length; k++) {
                              const {
                                gradeID,
                                dateGiven,
                                score,
                                total,
                                description,
                                attendance,
                              } = grades[k];
                              gradesData.push({
                                gradeID,
                                dateGiven,
                                score,
                                total,
                                description,
                                attendance,
                              });
                            }
                            return gradesData;
                          }
                        });
                        let k = 0;
                        let sumScores = 0;
                        let sumItems = 0;
                        let excused = 0;
                        let ps = -1;
                        for (k = 0; k < grades.length; k++) {
                          if (grades[k].attendance == "E") {
                            excused = excused + 1;
                          } else if (grades[k].attendance == "A") {
                            sumScores = sumScores + 0;
                            sumItems = sumItems + parseFloat(grades[k].total);
                          } else {
                            sumScores = sumScores + parseFloat(grades[k].score);
                            sumItems = sumItems + parseFloat(grades[k].total);
                          }
                        }
                        if (grades.length != 0) {
                          if (grades.length == excused) {
                            ps = -1;
                          } else {
                            ps = (sumScores / sumItems) * 100;
                          }
                        }

                        studentData.push({
                          sex,
                          imageUrl,
                          subsectstudID,
                          name,
                          grades,
                          ps,
                        });
                      }
                      studentData.sort((a, b) => (a.name > b.name ? 1 : -1));
                      return [
                        ...studentData.filter((a) => a.sex == "M"),
                        ...studentData.filter((a) => a.sex == "F"),
                      ];
                    }
                  });

                  return {
                    subcomponentID,
                    name,
                    data: data2,
                  };
                }
              });
              let ave = await StudentWeightedScore.findAll({
                where: {
                  classRecordID: subjectsection.classRecordID,
                  quarter,
                },
              }).then(async (studweightedscore) => {
                if (studweightedscore.length == 0) {
                  return [];
                } else {
                  let l = 0;
                  const aveData = [];
                  for (l = 0; l < studweightedscore.length; l++) {
                    const {
                      subsectstudID,
                      faWS,
                      wwWS,
                      ptWS,
                      qeWS,
                      actualGrade,
                    } = studweightedscore[l];
                    const name = await utils.getStudentNameBySubsectstudID(
                      subsectstudID
                    );
                    let sex = await utils.getStudentSexBySubsectstudID(
                      subsectstudID
                    );
                    let ws = 0;
                    switch (component) {
                      case "Formative Assessment": {
                        ws = faWS;
                      }
                      case "Written Works": {
                        ws = wwWS;
                      }
                      case "Performance Task": {
                        ws = ptWS;
                      }
                      case "Quarterly Exam": {
                        ws = qeWS;
                      }
                      default:
                        "";
                    }
                    aveData.push({
                      sex,
                      subsectstudID,
                      ws,
                      name,
                    });
                  }
                  return aveData;
                }
              });
              ave.sort((a, b) => (a.name > b.name ? 1 : -1));
              res.status(200).json({
                componentID,
                component,
                subcompID: subcomponentID,
                subcompName: name,
                data,
                ave: [
                  ...ave.filter((a) => a.sex == "M"),
                  ...ave.filter((a) => a.sex == "F"),
                ],
              });
            } else {
              res.status(404).json({
                msg: "Component not found!",
              });
            }
          });
        }
      } else {
        res.status(404).json({
          msg: "Subject section not found!",
        });
      }
    });
  }
);

// @route POST api/registrar/deleterecord
// @desc Delete a record
// @access Private

router.post(
  "/deleterecord",
  passport.authenticate("registrar", {
    session: false,
  }),
  async (req, res) => {
    const {
      classRecordID,
      description,
      dateGiven,
      subcompID,
      componentID,
      quarter,
    } = req.body;
    SubjectSection.findOne({
      where: {
        classRecordID,
      },
    }).then((subsect) => {
      if (subsect) {
        if (false) {
          res.status(401).json({
            msg: "Not authorized!",
          });
        } else {
          ClassRecordStatus.findOne({
            where: {
              classRecordID: subsect.classRecordID,
            },
          }).then(async (crs) => {
            if (crs) {
              let invalid = false;
              if (quarter == "Q1") {
                invalid = crs.q1 == "L" || crs.q1 == "E" || crs.q1 == "F";
              } else if (quarter == "Q2") {
                invalid = crs.q2 == "L" || crs.q2 == "E" || crs.q2 == "F";
              } else if (quarter == "Q3") {
                invalid = crs.q3 == "L" || crs.q3 == "E" || crs.q3 == "F";
              } else {
                invalid = crs.q4 == "L" || crs.q4 == "E" || crs.q4 == "F";
              }
              if (invalid) {
                res.status(400).json({
                  msg: "You are not authorized to edit this class record.",
                });
              } else {
                Grade.findAll({
                  where: {
                    description,
                    dateGiven,
                    subcomponentID: subcompID,
                    componentID,
                    quarter,
                  },
                }).then(async (grades) => {
                  if (grades.length != 0) {
                    const name = await utils.getAccountName(req.user.accountID);
                    const section = await utils.getSectionName(
                      subsect.sectionID
                    );
                    const subject = await utils.getSubjectName(
                      subsect.subjectID
                    );
                    const logID = await ActivityLog.create({
                      type: "DELETE",
                      classRecordID,
                      position: "Registrar",
                      name,
                      section,
                      subject,
                      quarter,
                      timestamp: new Date(),
                    }).then(async (al) => {
                      if (al) {
                        return al.logID;
                      }
                    });
                    for (const [index, value] of grades.entries()) {
                      await value.destroy({
                        showLog: true,
                        logID,
                        subsectstudID: value.subsectstudID,
                        componentID,
                        subcompID,
                        value: value.score,
                      });
                    }
                    await utils.refreshStudentWeightedScoreBySubsectID(
                      subsect.subsectID
                    );
                    res.status(200).json({
                      msg: "Deleted successfully!",
                    });
                  } else {
                    res.status(404).json({
                      msg: "Grades not found!",
                    });
                  }
                });
              }
            } else {
              res.status(404).json({
                msg: "Class record status does not exist",
              });
            }
          });
        }
      } else {
        res.status(404).json({
          msg: "Subject section not found!",
        });
      }
    });
  }
);

// @route api/teacher/getrecinfo
// @desc Get grade record info by one gradeID
// @access Private

router.post(
  "/getrecinfo",
  passport.authenticate("registrar", {
    session: false,
  }),
  async (req, res) => {
    const {
      classRecordID,
      componentID,
      subcompID,
      quarter,
      gradeID,
    } = req.body;
    SubjectSection.findOne({
      where: {
        classRecordID,
      },
    }).then(async (ss) => {
      if (ss) {
        if (false) {
          res.status(401).json({
            msg: "Not authorized!",
          });
        } else {
          Grade.findOne({
            where: {
              gradeID,
            },
          }).then(async (grade) => {
            if (grade) {
              const { description, dateGiven, total } = grade;
              const component = await utils.getComponentName(componentID);
              const weight = await Subcomponent.findOne({
                where: {
                  subcompID,
                },
              }).then((sc) => {
                if (sc) {
                  return sc.compWeight;
                }
              });
              let subcompName = await utils.getSubcomponentName(subcompID);
              subcompName = `${subcompName} (${weight}%)`;
              Grade.findAll({
                where: {
                  quarter,
                  subcomponentID: subcompID,
                  componentID,
                  description: grade.description,
                  dateGiven: grade.dateGiven,
                },
              }).then(async (grades) => {
                if (grades.length == 0) {
                  res.status(404).json({
                    msg: "Grades not found!",
                  });
                } else {
                  let data = [];
                  for (const [index, value] of grades.entries()) {
                    const { subsectstudID, score, gradeID, attendance } = value;
                    const name = await utils.getStudentNameBySubsectstudID(
                      subsectstudID
                    );
                    const imageUrl = await utils.getStudentImageUrlBySubsectstudID(
                      subsectstudID
                    );
                    data.push({
                      gradeID,
                      subsectstudID,
                      score:
                        attendance == "A"
                          ? "A"
                          : attendance == "E"
                          ? "E"
                          : score,
                      name,
                      imageUrl,
                    });
                  }
                  res.status(200).json({
                    componentID,
                    component,
                    subcompID,
                    subcompName,
                    dateGiven,
                    total,
                    description,
                    data,
                  });
                }
              });
            } else {
              res.status(404).json({
                msg: "Grade not found!",
              });
            }
          });
        }
      } else {
        res.status(404).json({
          msg: "Subject section not found!",
        });
      }
    });
  }
);

// @route api/registrar/editrecord
// @desc Edit record
// @access Private

router.post(
  "/editrecord",
  passport.authenticate("registrar", {
    session: false,
  }),
  async (req, res) => {
    const reg = /^-?[0-9]*(\.[0-9]*)?$/;
    const {
      description,
      dateGiven,
      total,
      classRecordID,
      subcompID,
      componentID,
      quarter,
      payload,
    } = req.body;
    let totalValid =
      !isNaN(total) && reg.test(total) && total !== "" && total !== "-";
    SubjectSection.findOne({
      where: {
        classRecordID,
      },
    }).then(async (ss) => {
      if (ss) {
        ClassRecordStatus.findOne({
          where: {
            classRecordID: ss.classRecordID,
          },
        }).then(async (crs) => {
          if (crs) {
            let invalid = false;
            if (quarter == "Q1") {
              invalid = crs.q1 == "L" || crs.q1 == "E" || crs.q1 == "F";
            } else if (quarter == "Q2") {
              invalid = crs.q2 == "L" || crs.q2 == "E" || crs.q2 == "F";
            } else if (quarter == "Q3") {
              invalid = crs.q3 == "L" || crs.q3 == "E" || crs.q3 == "F";
            } else {
              invalid = crs.q4 == "L" || crs.q4 == "E" || crs.q4 == "F";
            }
            if (invalid) {
              res.status(400).json({
                msg: "You are not authorized to edit this class record.",
              });
            } else {
              if (!totalValid) {
                res.status(400).json({
                  msg: "Total score is invalid. Enter numbers only.",
                });
              } else {
                if (total <= 0) {
                  return res.status(400).json({
                    msg: "Total must be more than 0",
                  });
                } else {
                  SubjectSection.findOne({
                    where: {
                      classRecordID,
                    },
                  }).then(async (subjectsection) => {
                    if (subjectsection) {
                      if (false) {
                        return res.status(401).json({
                          msg: "Not authorized!",
                        });
                      } else {
                        const isSubmitted = await ClassRecord.findOne({
                          where: {
                            classRecordID: subjectsection.classRecordID,
                          },
                        }).then((cr) => {
                          if (cr) {
                            return cr.isSubmitted;
                          }
                        });
                        let { errors, isValid } = validateSubcomponent({
                          name: description,
                        });
                        if (!isValid) {
                          return res.status(400).json({
                            msg: "Error input: Description",
                          });
                        } else {
                          let i = 0;
                          let invalid = false;
                          let gradeIDchecker = [];
                          for (const [index, value] of payload.entries()) {
                            gradeIDchecker.push(value.gradeID);
                            await Grade.findAll({
                              where: {
                                componentID,
                                subcomponentID: subcompID,
                                quarter,
                                subsectstudID: value.subsectstudID,
                                gradeID: {
                                  [Op.ne]: value.gradeID,
                                },
                              },
                            }).then(async (grades2) => {
                              let sum = 0;
                              let totalTemp = 0;
                              for (const [
                                index2,
                                value2,
                              ] of grades2.entries()) {
                                if (value2.score == "A") {
                                  sum = sum + 0;
                                  totalTemp =
                                    totalTemp + parseFloat(value2.total);
                                } else if (value2.score == "E") {
                                } else {
                                  sum = sum + parseFloat(value2.score);
                                  totalTemp =
                                    totalTemp + parseFloat(value2.total);
                                }
                              }
                              if (
                                sum + parseFloat(value.score) >
                                  totalTemp + parseFloat(total) &&
                                !invalid
                              ) {
                                // invalid = true;
                                // return res.status(400).json({
                                //   msg:
                                //     "Invalid score input. Score must accumulate to less than or equal to the total number of items."
                                // });
                              }
                            });
                          }

                          for (i = 0; i < payload.length; i++) {
                            let { score, subsectstudID } = payload[i];
                            let valid =
                              (!isNaN(score) &&
                                reg.test(score) &&
                                score !== "" &&
                                score !== "-") ||
                              score == "A" ||
                              score == "E";
                            if (!valid) {
                              invalid = true;
                              return res.status(400).json({
                                msg:
                                  "Invalid score input. Enter numbers, E, or B only",
                              });
                            }
                          }

                          await Grade.findOne({
                            where: {
                              description,
                              dateGiven,
                              componentID,
                              subcomponentID: subcompID,
                              classRecordID: subjectsection.classRecordID,
                              quarter,
                              gradeID: {
                                [Op.notIn]: gradeIDchecker,
                              },
                            },
                          }).then(async (gr) => {
                            if (gr) {
                              res.status(400).json({
                                msg: "Descrption already exists!",
                              });
                            } else {
                              if (!invalid) {
                                const name = await utils.getAccountName(
                                  req.user.accountID
                                );
                                const section = await utils.getSectionName(
                                  subjectsection.sectionID
                                );
                                const subject = await utils.getSubjectName(
                                  subjectsection.subjectID
                                );
                                const logID = await ActivityLog.create({
                                  type: "UPDATE",
                                  classRecordID,
                                  position: "Registrar",
                                  name,
                                  section,
                                  subject,
                                  quarter,
                                  timestamp: new Date(),
                                }).then(async (al) => {
                                  if (al) {
                                    return al.logID;
                                  }
                                });

                                let oldDesc = "";
                                let oldTotal = -1;
                                for (const [
                                  index,
                                  value3,
                                ] of payload.entries()) {
                                  await Grade.findOne({
                                    where: {
                                      gradeID: value3.gradeID,
                                    },
                                  }).then(async (gr2) => {
                                    if (gr2) {
                                      const score = gr2.score;
                                      let attendance = "";
                                      if (value3.score == "A") {
                                        attendance = "A";
                                      } else if (value3.score == "E") {
                                        attendance = "E";
                                      } else {
                                        attendance = "P";
                                      }
                                      if (index == 0) {
                                        oldDesc = gr2.description;
                                        oldTotal = gr2.total;
                                      }
                                      await gr2.update(
                                        {
                                          description,
                                          total,
                                          dateGiven,
                                          attendance,
                                          score: value3.score,
                                          isUpdated: 1,
                                          showLog: isSubmitted,
                                        },
                                        {
                                          showLog: true,
                                          logID,
                                          subsectstudID: gr2.subsectstudID,
                                          componentID,
                                          subcompID,
                                          oldValue: gr2.score,
                                          newValue: value3.score,
                                          description,
                                        }
                                      );
                                    }
                                  });
                                }
                                await LogDetails.findAll({
                                  where: {
                                    logID,
                                  },
                                }).then((lds) => {
                                  if (lds) {
                                    if (lds.length == 0) {
                                      ActivityLog.findOne({
                                        where: {
                                          logID,
                                        },
                                      }).then(async (al) => {
                                        if (al) {
                                          al.destroy({}).then(() => {
                                            if (oldDesc != description) {
                                              ActivityLog.create({
                                                type: "DESC_UPDATE",
                                                classRecordID,
                                                position: "Registrar",
                                                name,
                                                section,
                                                subject,
                                                quarter,
                                                timestamp: new Date(),
                                              }).then(async (al2) => {
                                                if (al2) {
                                                  const component = await utils.getComponentName(
                                                    componentID
                                                  );
                                                  const subcomponent = await utils.getSubcomponentName(
                                                    subcompID
                                                  );
                                                  await LogDetails.create({
                                                    logID: al2.logID,
                                                    description: `Changed description from '${oldDesc}' to '${description}'`,
                                                    subcomponent,
                                                    component,
                                                  });
                                                }
                                              });
                                            }

                                            if (oldTotal != total) {
                                              ActivityLog.create({
                                                type: "TOTAL_UPDATE",
                                                classRecordID,
                                                position: "Registrar",
                                                name,
                                                section,
                                                subject,
                                                quarter,
                                                timestamp: new Date(),
                                              }).then(async (al2) => {
                                                if (al2) {
                                                  const component = await utils.getComponentName(
                                                    componentID
                                                  );
                                                  const subcomponent = await utils.getSubcomponentName(
                                                    subcompID
                                                  );
                                                  await LogDetails.create({
                                                    logID: al2.logID,
                                                    description: `Changed total from '${oldTotal}' to '${total}'`,
                                                    subcomponent,
                                                    component,
                                                  });
                                                }
                                              });
                                            }
                                          });
                                        }
                                      });
                                    } else {
                                      if (oldDesc != description) {
                                        ActivityLog.create({
                                          type: "DESC_UPDATE",
                                          classRecordID,
                                          position: "Registrar",
                                          name,
                                          section,
                                          subject,
                                          quarter,
                                          timestamp: new Date(),
                                        }).then(async (al2) => {
                                          if (al2) {
                                            const component = await utils.getComponentName(
                                              componentID
                                            );
                                            const subcomponent = await utils.getSubcomponentName(
                                              subcompID
                                            );
                                            await LogDetails.create({
                                              logID: al2.logID,
                                              description: `Changed description from '${oldDesc}' to '${description}'`,
                                              subcomponent,
                                              component,
                                            });
                                          }
                                        });
                                      }

                                      if (oldTotal != total) {
                                        ActivityLog.create({
                                          type: "TOTAL_UPDATE",
                                          classRecordID,
                                          position: "Registrar",
                                          name,
                                          section,
                                          subject,
                                          quarter,
                                          timestamp: new Date(),
                                        }).then(async (al2) => {
                                          if (al2) {
                                            const component = await utils.getComponentName(
                                              componentID
                                            );
                                            const subcomponent = await utils.getSubcomponentName(
                                              subcompID
                                            );
                                            await LogDetails.create({
                                              logID: al2.logID,
                                              description: `Changed total from '${oldTotal}' to '${total}'`,
                                              subcomponent,
                                              component,
                                            });
                                          }
                                        });
                                      }
                                    }
                                  }
                                });
                                await utils.refreshStudentWeightedScoreBySubsectID(
                                  subjectsection.subsectID
                                );

                                res.status(200).json({
                                  msg: "Record updated successfully!",
                                });
                              }
                            }
                          });
                        }
                      }
                    } else {
                      res.status(404).json({
                        msg: "Subject section not found!",
                      });
                    }
                  });
                }
              }
            }
          } else {
            res.status(404).json({
              msg: "Class record status does not exist",
            });
          }
        });
      } else {
        res.status(404).json({
          msg: "Subject section does not exist",
        });
      }
    });
  }
);

// @route POST api/registrar/addnewrecord
// @desc Add new record under subcomponent
// @access Private

router.post(
  "/addnewrecord",
  passport.authenticate("registrar", {
    session: false,
  }),
  async (req, res) => {
    const reg = /^-?[0-9]*(\.[0-9]*)?$/;
    const {
      componentID,
      subcompID,
      payload,
      dateGiven,
      description,
      total,
      classRecordID,
      quarter,
    } = req.body;
    let totalValid =
      !isNaN(total) && reg.test(total) && total !== "" && total !== "-";
    SubjectSection.findOne({
      where: {
        classRecordID,
      },
    }).then(async (ss) => {
      if (ss) {
        ClassRecordStatus.findOne({
          where: {
            classRecordID: ss.classRecordID,
          },
        }).then(async (crs) => {
          if (crs) {
            let invalid = false;
            if (quarter == "Q1") {
              invalid = crs.q1 == "L" || crs.q1 == "E" || crs.q1 == "F";
            } else if (quarter == "Q2") {
              invalid = crs.q2 == "L" || crs.q2 == "E" || crs.q2 == "F";
            } else if (quarter == "Q3") {
              invalid = crs.q3 == "L" || crs.q3 == "E" || crs.q3 == "F";
            } else {
              invalid = crs.q4 == "L" || crs.q4 == "E" || crs.q4 == "F";
            }
            if (invalid) {
              res.status(400).json({
                msg: "You are not authorized to edit this class record.",
              });
            } else {
              if (!totalValid) {
                res.status(400).json({
                  msg: "Total score is invalid. Enter numbers only.",
                });
              } else {
                if (total <= 0) {
                  res.status(400).json({
                    msg: "Total must be more than 0",
                  });
                }
                SubjectSection.findOne({
                  where: {
                    classRecordID,
                  },
                }).then(async (subjectsection) => {
                  if (subjectsection) {
                    if (false) {
                      return res.status(400).json({
                        msg: "Not authorized!",
                      });
                    } else {
                      let { errors, isValid } = validateSubcomponent({
                        name: description,
                      });
                      if (!isValid) {
                        return res.status(400).json({
                          msg: "Error input: Description",
                        });
                      } else {
                        let i = 0;
                        let invalid = false;
                        for (i = 0; i < payload.length; i++) {
                          let { score, subsectstudID } = payload[i];
                          let valid =
                            (!isNaN(score) &&
                              reg.test(score) &&
                              score !== "" &&
                              score !== "-") ||
                            score == "A" ||
                            score == "E";
                          if (!valid) {
                            invalid = true;
                            return res.status(400).json({
                              msg:
                                "Invalid score input. Enter numbers, E, or B only",
                            });
                          }
                        }

                        for (const [index, value] of payload.entries()) {
                          await Grade.findAll({
                            where: {
                              componentID,
                              subcomponentID: subcompID,
                              quarter,
                              subsectstudID: value.subsectstudID,
                            },
                          }).then(async (grades2) => {
                            let sum = 0;
                            let totalTemp = 0;
                            for (const [index2, value2] of grades2.entries()) {
                              if (value2.score == "A") {
                                sum = sum + 0;
                                totalTemp =
                                  totalTemp + parseFloat(value2.total);
                              } else if (value2.score == "E") {
                              } else {
                                sum = sum + parseFloat(value2.score);
                                totalTemp =
                                  totalTemp + parseFloat(value2.total);
                              }
                            }
                            if (
                              sum + parseFloat(value.score) >
                                totalTemp + parseFloat(total) &&
                              !invalid
                            ) {
                              // invalid = true;
                              // return res.status(400).json({
                              //   msg:
                              //     "Invalid score input. Scores must accumulate to less than or equal to the total number of items."
                              // });
                            }
                          });
                        }

                        await Grade.findOne({
                          where: {
                            description,
                            dateGiven,
                            componentID,
                            subcomponentID: subcompID,
                            classRecordID: subjectsection.classRecordID,
                            quarter,
                          },
                        }).then(async (gr) => {
                          if (gr) {
                            res.status(400).json({
                              msg: "Description already exists",
                            });
                          } else {
                            const name = await utils.getAccountName(
                              req.user.accountID
                            );
                            const section = await utils.getSectionName(
                              subjectsection.sectionID
                            );
                            const subject = await utils.getSubjectName(
                              subjectsection.subjectID
                            );
                            const logID = await ActivityLog.create({
                              type: "ADD",
                              classRecordID,
                              position: "Registrar",
                              name,
                              section,
                              subject,
                              quarter,
                              timestamp: new Date(),
                            }).then(async (al) => {
                              if (al) {
                                return al.logID;
                              }
                            });
                            for (i = 0; i < payload.length; i++) {
                              let { score, subsectstudID } = payload[i];
                              let attendance = "";
                              if (score == "A") {
                                attendance = "A";
                              } else if (score == "E") {
                                attendance = "E";
                              } else {
                                attendance = "P";
                              }
                              if (!invalid) {
                                Grade.create(
                                  {
                                    description,
                                    dateGiven,
                                    score,
                                    attendance,
                                    total,
                                    componentID,
                                    subcomponentID: subcompID,
                                    date: new Date(),
                                    classRecordID: subjectsection.classRecordID,
                                    subsectstudID,
                                    showLog: 0,
                                    isUpdated: 0,
                                    quarter: quarter,
                                  },
                                  {
                                    showLog: true,
                                    logID,
                                    subsectstudID,
                                    componentID,
                                    subcompID,
                                    value: score,
                                  }
                                );
                              }
                            }
                            await utils.refreshStudentWeightedScoreBySubsectID(
                              subjectsection.subsectID
                            );
                            return res.status(200).json({
                              msg: "Record has been added successfully!",
                            });
                          }
                        });
                      }
                    }
                  } else {
                    res.status(404).json({
                      msg: "Subject section not found!",
                    });
                  }
                });
              }
            }
          } else {
            res.status(404).json({
              msg: "Class record status does not exist",
            });
          }
        });
      } else {
        res.status(404).json({
          msg: "Subject section does not exist",
        });
      }
    });
  }
);

// @route api/registrar/changetransmutation
// @desc Change transmutation by classRecordID and quarter
// @access Private

router.post(
  "/changetransmutation",
  passport.authenticate("registrar", {
    session: false,
  }),
  async (req, res) => {
    const { classRecordID, quarter, transmutation } = req.body;
    SubjectSection.findOne({
      where: {
        classRecordID,
      },
    }).then(async (ss) => {
      if (ss) {
        if (false) {
          res.status(401).json({
            msg: "Not authorized!",
          });
        } else {
          ClassRecordStatus.findOne({
            where: {
              classRecordID: ss.classRecordID,
            },
          }).then(async (crs) => {
            if (crs) {
              let invalid = false;
              if (quarter == "Q1") {
                invalid = crs.q1 == "L" || crs.q1 == "E" || crs.q1 == "F";
              } else if (quarter == "Q2") {
                invalid = crs.q2 == "L" || crs.q2 == "E" || crs.q2 == "F";
              } else if (quarter == "Q3") {
                invalid = crs.q3 == "L" || crs.q3 == "E" || crs.q3 == "F";
              } else {
                invalid = crs.q4 == "L" || crs.q4 == "E" || crs.q4 == "F";
              }
              if (invalid) {
                res.status(400).json({
                  msg: "You are not authorized to edit this class record.",
                });
              } else {
                ClassRecord.findOne({
                  where: {
                    classRecordID: ss.classRecordID,
                  },
                }).then(async (cr) => {
                  if (cr) {
                    switch (quarter) {
                      case "Q1": {
                        await cr.update(
                          {
                            q1Transmu: transmutation,
                          },
                          {
                            showLog: true,
                            position: "Registrar",
                            type: "TRANSMU_UPDATE",
                            accountID: req.user.accountID,
                            sectionID: ss.sectionID,
                            subjectID: ss.subjectID,
                            quarter,
                            classRecordID,
                            oldVal: cr.q1Transmu,
                            newVal: transmutation,
                          }
                        );
                        break;
                      }
                      case "Q2": {
                        await cr.update(
                          {
                            q2Transmu: transmutation,
                          },
                          {
                            showLog: true,
                            position: "Registrar",
                            type: "TRANSMU_UPDATE",
                            accountID: req.user.accountID,
                            sectionID: ss.sectionID,
                            subjectID: ss.subjectID,
                            quarter,
                            classRecordID,
                            oldVal: cr.q2Transmu,
                            newVal: transmutation,
                          }
                        );
                        break;
                      }
                      case "Q3": {
                        await cr.update(
                          {
                            q3Transmu: transmutation,
                          },
                          {
                            showLog: true,
                            position: "Registrar",
                            type: "TRANSMU_UPDATE",
                            accountID: req.user.accountID,
                            sectionID: ss.sectionID,
                            subjectID: ss.subjectID,
                            quarter,
                            classRecordID,
                            oldVal: cr.q3Transmu,
                            newVal: transmutation,
                          }
                        );
                        break;
                      }
                      case "Q4": {
                        await cr.update(
                          {
                            q4Transmu: transmutation,
                          },
                          {
                            showLog: true,
                            position: "Registrar",
                            type: "TRANSMU_UPDATE",
                            accountID: req.user.accountID,
                            sectionID: ss.sectionID,
                            subjectID: ss.subjectID,
                            quarter,
                            classRecordID,
                            oldVal: cr.q4Transmu,
                            newVal: transmutation,
                          }
                        );
                        break;
                      }
                      default:
                        break;
                    }
                    await utils.refreshStudentWeightedScoreBySubsectID(
                      ss.subsectID
                    );
                    res.status(200).json({
                      msg: "Transmutation changed successfully!",
                    });
                  } else {
                    res.status(404).json({
                      msg: "Class Record not found!",
                    });
                  }
                });
              }
            } else {
              res.status(404).json({
                msg: "Subject Section not found!",
              });
            }
          });
        }
      } else {
        res.status(404).json({
          msg: "Class record status does not exist",
        });
      }
    });
  }
);

// @route POST api/registrar/getquartersummary
// @desc Get quarter summary by classRecordID and quarter
// @access Private

router.post(
  "/getquartersummary",
  passport.authenticate(directorRegistrar, {
    session: false,
  }),
  async (req, res) => {
    const { classRecordID, quarter } = req.body;
    SubjectSection.findOne({
      where: {
        classRecordID,
      },
    }).then(async (subsect) => {
      if (subsect) {
        if (false) {
          res.status(401).json({
            msg: "Not authorized!",
          });
        } else {
          const transmutation = await ClassRecord.findOne({
            where: {
              classRecordID: subsect.classRecordID,
            },
          }).then(async (cr) => {
            if (cr) {
              switch (quarter) {
                case "Q1": {
                  return cr.q1Transmu;
                  break;
                }
                case "Q2": {
                  return cr.q2Transmu;
                  break;
                }
                case "Q3": {
                  return cr.q3Transmu;
                  break;
                }
                case "Q4": {
                  return cr.q4Transmu;
                  break;
                }
                default:
                  break;
              }
            }
          });
          const subjectName = await utils.getSubjectName(subsect.subjectID);
          const subjectCode = await utils.getSubjectCode(subsect.subjectID);
          const sectionName = await utils.getSectionName(subsect.sectionID);
          const schoolYearID = subsect.schoolYearID;
          const schoolYear = await utils.getSYname(schoolYearID);
          const subsectstudIDs = await SubjectSectionStudent.findAll({
            where: {
              subsectID: subsect.subsectID,
            },
          }).then(async (sss) => {
            if (sss.length == 0) {
              return [];
            } else {
              let data = [];
              for (const [index, value] of sss.entries()) {
                data.push(value.subsectstudID);
              }
              return data;
            }
          });
          let data = [];
          for (const [index, value] of subsectstudIDs.entries()) {
            const temp = await StudentWeightedScore.findOne({
              where: {
                subsectstudID: value,
                quarter,
              },
            }).then(async (sws) => {
              if (sws) {
                const {
                  subsectstudID,
                  faWS,
                  wwWS,
                  ptWS,
                  qeWS,
                  actualGrade,
                  transmutedGrade50,
                  transmutedGrade55,
                  transmutedGrade60,
                } = sws;
                let finalGrade = 0;
                switch (transmutation) {
                  case "50": {
                    finalGrade = Math.round(transmutedGrade50);
                    break;
                  }
                  case "55": {
                    finalGrade = Math.round(transmutedGrade55);
                    break;
                  }
                  case "60": {
                    finalGrade = Math.round(transmutedGrade60);
                    break;
                  }
                  default:
                    break;
                }
                const name = await utils.getStudentNameBySubsectstudID(
                  subsectstudID
                );
                const sex = await utils.getStudentSexBySubsectstudID(
                  subsectstudID
                );
                const imageUrl = await utils.getStudentImageUrlBySubsectstudID(
                  subsectstudID
                );
                return {
                  sex,
                  name,
                  imageUrl,
                  subsectstudID,
                  faWS,
                  wwWS,
                  ptWS,
                  qeWS,
                  actualGrade,
                  transmutedGrade50,
                  transmutedGrade55,
                  transmutedGrade60,
                  finalGrade,
                };
              }
            });
            data.push(temp);
          }
          data.sort((a, b) => (a.name > b.name ? 1 : -1));
          res.status(200).json({
            transmutation,
            subjectName,
            subjectCode,
            sectionName,
            schoolYearID,
            schoolYear,
            classRecordID: subsect.classRecordID,
            data: [
              ...data.filter((a) => a.sex == "M"),
              ...data.filter((a) => a.sex == "F"),
            ],
          });
        }
      } else {
        res.status(404).json({
          msg: "Subject section not found!",
        });
      }
    });
  }
);

// @route POST api/registrar/getsubmittedsubsectbysectionid
// @desc Get subject section where class record status = 'D' by sectionID
// @access Private

router.post(
  "/getsubmittedsubsectbysectionid",
  passport.authenticate("registrar", {
    session: false,
  }),
  async (req, res) => {
    let = { sectionID, page, pageSize, quarter } = req.body;
    page = page - 1;
    let offset = page * pageSize;
    let limit = offset + pageSize;
    const sectionName = await utils.getSectionName(sectionID);
    const { schoolYearID } = await utils.getActiveSY();
    const classRecordIDs = await SubjectSection.findAll({
      where: {
        sectionID,
        schoolYearID,
        subjectType: {
          [Op.in]:
            quarter == "Q1" || quarter == "Q2"
              ? ["NON_SHS", "1ST_SEM"]
              : ["NON_SHS", "2ND_SEM"],
        },
      },
    }).then(async (ss) => {
      if (ss) {
        let data = [];
        for (const [i, v] of ss.entries()) {
          const crs = await ClassRecordStatus.findOne({
            where: {
              classRecordID: v.classRecordID,
            },
          });
          if (quarter == "Q1" || quarter == "Q2") {
            if (crs[quarter.toLowerCase()] == "D") {
              data.push(v.classRecordID);
            }
          } else {
            if (quarter == "Q3") {
              if (v.subjectType == "NON_SHS") {
                if (crs[quarter.toLowerCase()] == "D") {
                  data.push(v.classRecordID);
                }
              } else {
                if (crs["q1"] == "D") {
                  data.push(v.classRecordID);
                }
              }
            } else {
              if (v.subjectType == "NON_SHS") {
                if (crs[quarter.toLowerCase()] == "D") {
                  data.push(v.classRecordID);
                }
              } else {
                if (crs["q2"] == "D") {
                  data.push(v.classRecordID);
                }
              }
            }
          }
        }
        return data;
      }
    });
    if (classRecordIDs.length == 0) {
      res.status(200).json({
        sectionName,
        classRecordList: [],
        numOfPages: 1,
        deadline: "NOT SET",
      });
    } else {
      let condition = {};
      condition["classRecordID"] = {
        [Op.in]: classRecordIDs,
      };
      await ClassRecordStatus.findAll({
        limit,
        offset,
        where: condition,
      }).then(async (crs) => {
        if (crs) {
          if (crs.length == 0) {
            res.status(404).json({
              msg: "No class record for deliberation found",
            });
          } else {
            let data2 = [];
            let numOfPages = 1;
            crs.slice(0, pageSize).forEach(async (v, k, r) => {
              const { classRecordID } = v;
              const subjectType = await utils.getSubjectTypeByClassRecordID(
                classRecordID
              );
              let dateSubmitted = v[`${quarter.toLowerCase()}DateSubmitted`];
              if (subjectType == "2ND_SEM") {
                if (quarter == "Q3") {
                  dateSubmitted = v.q1DateSubmitted;
                } else if (quarter == "Q4") {
                  dateSubmitted = v.q2DateSubmitted;
                }
              }
              const {
                subjectCode,
                subjectName,
                section,
                subsectID,
                deadline,
                teacher,
              } = await SubjectSection.findOne({
                where: {
                  classRecordID,
                },
              }).then(async (cr) => {
                if (cr) {
                  const deadline = await SubmissionDeadline.findOne({
                    where: {
                      teacherID: cr.teacherID,
                      isActive: 1,
                    },
                  }).then((sd) => {
                    if (sd) {
                      return sd.deadline;
                    } else {
                      return "NOT SET";
                    }
                  });
                  const subjectCode = await utils.getSubjectCode(cr.subjectID);
                  const { subsectID } = cr;
                  const teacher = await utils.getTeacherName(cr.teacherID);
                  const subjectName = await utils.getSubjectName(cr.subjectID);
                  const section = await utils.getSectionName(cr.sectionID);
                  return {
                    teacher,
                    subjectCode,
                    subsectID,
                    subjectName,
                    section,
                    deadline,
                  };
                }
              });
              data2.push({
                teacher,
                classRecordID,
                dateSubmitted,
                subjectCode,
                subjectName,
                section,
                subsectID,
                deadline,
              });
              if (k == r.length - 1) {
                numOfPages = await ClassRecordStatus.findAndCountAll({
                  where: condition,
                }).then((count) => {
                  return Math.ceil(count.count / pageSize);
                });
                res.status(200).json({
                  sectionName,
                  classRecordList: data2,
                  numOfPages,
                  deadline,
                });
              }
            });
          }
        }
      });
    }
  }
);

// @route POST api/registrar/getnotsubmittedsubsectbysectionid
// @desc Get not submitted subject section where class record status = 'D' by sectionID
// @access Private

router.post(
  "/getnotsubmittedsubsectbysectionid",
  passport.authenticate("registrar", {
    session: false,
  }),
  async (req, res) => {
    let = { sectionID, page, pageSize, quarter } = req.body;
    page = page - 1;
    let offset = page * pageSize;
    let limit = offset + pageSize;
    const sectionName = await utils.getSectionName(sectionID);
    const { schoolYearID } = await utils.getActiveSY();
    const classRecordIDs = await SubjectSection.findAll({
      where: {
        sectionID,
        schoolYearID,
        subjectType: {
          [Op.in]:
            quarter == "Q1" || quarter == "Q2"
              ? ["NON_SHS", "1ST_SEM"]
              : ["NON_SHS", "2ND_SEM"],
        },
      },
    }).then(async (ss) => {
      if (ss) {
        let data = [];
        for (const [i, v] of ss.entries()) {
          const crs = await ClassRecordStatus.findOne({
            where: {
              classRecordID: v.classRecordID,
            },
          });
          if (quarter == "Q1" || quarter == "Q2") {
            if (crs[quarter.toLowerCase()] == "E") {
              data.push(v.classRecordID);
            }
          } else {
            if (quarter == "Q3") {
              if (v.subjectType == "NON_SHS") {
                if (crs[quarter.toLowerCase()] == "E") {
                  data.push(v.classRecordID);
                }
              } else {
                if (crs["q1"] == "E") {
                  data.push(v.classRecordID);
                }
              }
            } else {
              if (v.subjectType == "NON_SHS") {
                if (crs[quarter.toLowerCase()] == "E") {
                  data.push(v.classRecordID);
                }
              } else {
                if (crs["q2"] == "E") {
                  data.push(v.classRecordID);
                }
              }
            }
          }
        }
        return data;
      }
    });
    if (classRecordIDs.length == 0) {
      res.status(404).json({
        msg: "Class Record not found!",
      });
    } else {
      let condition = {};
      condition["classRecordID"] = {
        [Op.in]: classRecordIDs,
      };
      await ClassRecordStatus.findAll({
        limit,
        offset,
        where: condition,
      }).then(async (crs) => {
        if (crs) {
          if (crs.length == 0) {
            res.status(404).json({
              msg: "No class record for deliberation found",
            });
          } else {
            let data2 = [];
            let numOfPages = 1;
            crs.slice(0, pageSize).forEach(async (v, k, r) => {
              const { classRecordID } = v;
              const dateSubmitted = v[`${quarter.toLowerCase()}DateSubmitted`];
              const {
                subjectCode,
                subjectName,
                section,
                subsectID,
                deadline,
                teacher,
              } = await SubjectSection.findOne({
                where: {
                  classRecordID,
                },
              }).then(async (cr) => {
                if (cr) {
                  const deadline = await SubmissionDeadline.findOne({
                    where: {
                      teacherID: cr.teacherID,
                      isActive: 1,
                    },
                  }).then((sd) => {
                    if (sd) {
                      return sd.deadline;
                    } else {
                      return "NOT SET";
                    }
                  });
                  const subjectCode = await utils.getSubjectCode(cr.subjectID);
                  const { subsectID } = cr;
                  const subjectName = await utils.getSubjectName(cr.subjectID);
                  const teacher = await utils.getTeacherName(cr.teacherID);
                  const section = await utils.getSectionName(cr.sectionID);
                  return {
                    teacher,
                    subjectCode,
                    subsectID,
                    subjectName,
                    section,
                    deadline,
                  };
                }
              });
              data2.push({
                teacher,
                classRecordID,
                dateSubmitted,
                subjectCode,
                subjectName,
                section,
                subsectID,
                deadline,
              });
              if (k == r.length - 1) {
                numOfPages = await ClassRecordStatus.findAndCountAll({
                  where: condition,
                }).then((count) => {
                  return Math.ceil(count.count / pageSize);
                });
                res.status(200).json({
                  sectionName,
                  classRecordList: data2,
                  numOfPages,
                  deadline,
                });
              }
            });
          }
        }
      });
    }
  }
);

// @route POST api/registrar/studentdeliberationrecord
// @desc Get deliberation grade of student by studsectID
// @access Private

router.post(
  "/studentdeliberationrecord",
  passport.authenticate("registrar", {
    session: false,
  }),
  async (req, res) => {
    const { studsectID } = req.body;
    const { schoolYearID, quarter } = await utils.getActiveSY();
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
                if (subjectType == "NON_SHS" || subjectType == "1ST_SEM") {
                  return crs.q1;
                }
              } else if (quarter == "Q2") {
                if (subjectType == "NON_SHS" || subjectType == "1ST_SEM") {
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
              if (status == "F" || status == "D") {
                if (quarter == "Q1") {
                  if (subjectType == "NON_SHS" || subjectType == "1ST_SEM") {
                    return ssg.q1FinalGrade;
                  }
                } else if (quarter == "Q2") {
                  if (subjectType == "NON_SHS" || subjectType == "1ST_SEM") {
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
    res.status(200).json({
      data,
    });
  }
);

// @route POST api/registrar/studentfinalgrade
// @desc Get student final grade of student by studentID, schoolYearID
// @access Private

router.post(
  "/studentfinalgrade",
  passport.authenticate([...directorRegistrar, "teacher"], {
    session: false,
  }),
  async (req, res) => {
    const { studentID, schoolYearID } = req.body;
    const studsectID = await StudentSection.findOne({
      where: {
        studentID,
        schoolYearID,
      },
    }).then((std) => {
      if (std) {
        return std.studsectID;
      } else return -1;
    });
    if (studsectID == -1) {
      res.status(200).json({
        finalGrade: -1,
        data: [],
      });
    } else {
      let finalGrade = await StudentFinalGrade.findOne({
        where: {
          studsectID,
          schoolYearID,
        },
      }).then((sfg) => {
        if (sfg) {
          return sfg.grade;
        }
      });
      let data = await StudentGrades.findAll({
        where: {
          studsectID,
          schoolYearID,
        },
      }).then((sg) => {
        if (sg) {
          let data2 = [];
          for (const [index, value] of sg.entries()) {
            data2.push({
              quarter: value.quarter,
              grade: value.grade,
            });
          }
          return data2;
        }
      });
      data.sort((a, b) => (a.quarter > b.quarter ? 1 : -1));
      res.status(200).json({
        finalGrade,
        data,
      });
    }
  }
);

// @route POST api/registrar/studentfinalrecord
// @desc Get finalgrade grade of student by studentID, schoolYearID, quarter
// @access Private

router.post(
  "/studentfinalrecord",
  passport.authenticate(directorRegistrar, {
    session: false,
  }),
  async (req, res) => {
    const { studentID } = req.body;
    const { schoolYearID, quarter } = req.body;
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
                  if (subjectType == "NON_SHS" || subjectType == "1ST_SEM") {
                    return crs.q1;
                  }
                } else if (quarter == "Q2") {
                  if (subjectType == "NON_SHS" || subjectType == "1ST_SEM") {
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
                    if (subjectType == "NON_SHS" || subjectType == "1ST_SEM") {
                      return ssg.q1FinalGrade;
                    }
                  } else if (quarter == "Q2") {
                    if (subjectType == "NON_SHS" || subjectType == "1ST_SEM") {
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
      });
    }
  }
);

// @router POST api/registrar/getsectionstudent
// @desc Get student section by studentID, schoolYearID
// @access Private

router.post(
  "/getsectionstudent",
  passport.authenticate(directorRegistrar, {
    session: false,
  }),
  async (req, res) => {
    const { studentID, schoolYearID } = req.body;
    const section = await StudentSection.findOne({
      where: {
        studentID,
        schoolYearID,
      },
    }).then(async (ss) => {
      if (ss) {
        console.log(ss);
        await utils.getSectionName(ss.sectionID);
      } else {
        return null;
      }
    });
    if (section !== null && section !== undefined) {
      res.status(200).json({
        sectionName: section,
      });
    } else {
      res.status(200).json({ sectionName: "" });
    }
  }
);

// @router POST api/registrar/reportcardstudent
// @desc Generate report card pdf per student
// @access Private

router.post(
  "/reportcardstudent",
  passport.authenticate("registrar", {
    session: false,
  }),
  async (req, res) => {
    let doc = new PDFDocument();
    const { studentID, schoolYearID, quarter } = req.body;
    let filename = encodeURIComponent("final_grade") + ".pdf";
    res.setHeader(
      "Content-disposition",
      'attachment; filename="' + filename + '"'
    );
    res.setHeader("Content-type", "application/pdf");
    doc.pipe(res);
    await utils.generateReportCardStudent(
      doc,
      res,
      studentID,
      schoolYearID,
      quarter,
      true
    );
  }
);

// @route POST api/registrar/reportcardsection
// @desc Generate report card pdf per section
// @access Private

router.post(
  "/reportcardsection",
  passport.authenticate(["registrar", "teacher"], {
    session: false,
  }),
  async (req, res) => {
    let doc = new PDFDocument();
    let headerSent = false;
    const { studentIDs, schoolYearID, quarter } = req.body;
    let filename = encodeURIComponent("final_grade") + ".pdf";
    res.setHeader(
      "Content-disposition",
      'attachment; filename="' + filename + '"'
    );
    res.setHeader("Content-type", "application/pdf");
    doc.pipe(res);
    for (const [index, value] of studentIDs.entries()) {
      if (!headerSent) {
        await utils.generateReportCardStudent(
          doc,
          res,
          value,
          schoolYearID,
          quarter,
          index + 1 == studentIDs.length,
          headerSent
        );
      }
    }
  }
);

// @route POST api/registrar/getpassedfailed
// @desc Get number of passed/failed students by schoolYearID, quarter, and gradeLevel
// @access Private

router.post(
  "/getpassedfailed",
  passport.authenticate(directorRegistrar, {
    session: false,
  }),
  async (req, res) => {
    const { schoolYearID, quarter, gradeLevel } = req.body;
    Section.findAll({
      where: {
        gradeLevel,
      },
    }).then(async (section) => {
      if (section) {
        let data = [];
        for (const [index, value] of section.entries()) {
          let name = await utils.getSectionName(value.sectionID);
          let sectionID = value.sectionID;
          let failedInfo = [];
          const { numOfPassed, numOfFailed } = await StudentSection.findAll({
            where: {
              sectionID: value.sectionID,
              schoolYearID,
            },
          }).then(async (ss) => {
            if (ss) {
              let numOfPassed = 0;
              let numOfFailed = 0;
              for (const [index2, value2] of ss.entries()) {
                const passed = await SubjectSectionStudent.findAll({
                  where: {
                    studsectID: value2.studsectID,
                  },
                }).then(async (sss) => {
                  if (sss) {
                    let foundFailed = false;
                    let passed2 = 0;
                    for (const [index3, value3] of sss.entries()) {
                      passed2 = await StudentSubjectGrades.findAll({
                        where: {
                          subsectstudID: value3.subsectstudID,
                        },
                      }).then(async (ssg) => {
                        if (ssg) {
                          let passed4 = 1;
                          for (const [index4, value4] of ssg.entries()) {
                            let subjectType = await utils.getSubjectTypeByClassRecordID(
                              value4.classRecordID
                            );
                            if (subjectType == "NON_SHS") {
                              let status = await ClassRecordStatus.findOne({
                                where: {
                                  classRecordID: value4.classRecordID,
                                },
                              }).then((crs) => crs[`${quarter.toLowerCase()}`]);
                              if (status == "D" || status == "F") {
                                if (
                                  parseFloat(
                                    value4[`${quarter.toLowerCase()}FinalGrade`]
                                  ) < 75 &&
                                  parseFloat(
                                    value4[`${quarter.toLowerCase()}FinalGrade`]
                                  ) != -1
                                ) {
                                  let name = await utils.getStudentNameBySubsectstudID(
                                    value4.subsectstudID
                                  );
                                  let classRecordID = value4.classRecordID;
                                  let grade = parseFloat(
                                    value4[`${quarter.toLowerCase()}FinalGrade`]
                                  );
                                  let subjectID = await utils.getSubjectIDBySubsectstudID(
                                    value4.subsectstudID
                                  );
                                  let subjectName = await utils.getSubjectName(
                                    subjectID
                                  );
                                  let teacher = await SubjectSectionStudent.findOne(
                                    {
                                      where: {
                                        subsectstudID: value4.subsectstudID,
                                      },
                                    }
                                  )
                                    .then(
                                      async (subsectstud) =>
                                        await SubjectSection.findOne({
                                          where: {
                                            subsectID: subsectstud.subsectID,
                                          },
                                        })
                                    )
                                    .then(
                                      async (ss2) =>
                                        await utils.getTeacherName(
                                          ss2.teacherID
                                        )
                                    );
                                  failedInfo.push({
                                    name,
                                    classRecordID,
                                    grade,
                                    subjectName,
                                    teacher,
                                  });
                                  passed4 = -1;
                                  return passed4;
                                } else {
                                  passed4 = 1;
                                }
                              }
                            } else if (subjectType == "1ST_SEM") {
                              if (quarter == "Q1" || quarter == "Q2") {
                                let status = await ClassRecordStatus.findOne({
                                  where: {
                                    classRecordID: value4.classRecordID,
                                  },
                                }).then(
                                  (crs) => crs[`${quarter.toLowerCase()}`]
                                );
                                if (status == "D" || status == "F") {
                                  if (
                                    parseFloat(
                                      value4[
                                        `${quarter.toLowerCase()}FinalGrade`
                                      ]
                                    ) < 75 &&
                                    parseFloat(
                                      value4[
                                        `${quarter.toLowerCase()}FinalGrade`
                                      ]
                                    ) != -1
                                  ) {
                                    let name = await utils.getStudentNameBySubsectstudID(
                                      value4.subsectstudID
                                    );
                                    let classRecordID = value4.classRecordID;
                                    let grade = parseFloat(
                                      value4[
                                        `${quarter.toLowerCase()}FinalGrade`
                                      ]
                                    );
                                    let subjectID = await utils.getSubjectIDBySubsectstudID(
                                      value4.subsectstudID
                                    );
                                    let subjectName = await utils.getSubjectName(
                                      subjectID
                                    );
                                    let teacher = await SubjectSectionStudent.findOne(
                                      {
                                        where: {
                                          subsectstudID: value4.subsectstudID,
                                        },
                                      }
                                    )
                                      .then(
                                        async (subsectstud) =>
                                          await SubjectSection.findOne({
                                            where: {
                                              subsectID: subsectstud.subsectID,
                                            },
                                          })
                                      )
                                      .then(
                                        async (ss2) =>
                                          await utils.getTeacherName(
                                            ss2.teacherID
                                          )
                                      );
                                    failedInfo.push({
                                      name,
                                      classRecordID,
                                      grade,
                                      subjectName,
                                      teacher,
                                    });
                                    passed4 = -1;
                                    return passed4;
                                  } else {
                                    passed4 = 1;
                                  }
                                }
                              }
                            } else {
                              if (quarter == "Q3" || quarter == "Q4") {
                                let status = await ClassRecordStatus.findOne({
                                  where: {
                                    classRecordID: value4.classRecordID,
                                  },
                                }).then(
                                  (crs) =>
                                    crs[`q${parseInt(quarter.charAt(1)) - 2}`]
                                );
                                if (status == "D" || status == "F") {
                                  if (
                                    parseFloat(
                                      value4[
                                        `q${
                                          parseInt(quarter.charAt(1)) - 2
                                        }FinalGrade`
                                      ]
                                    ) < 75 &&
                                    parseFloat(
                                      value4[
                                        `q${
                                          parseInt(quarter.charAt(1)) - 2
                                        }FinalGrade`
                                      ]
                                    ) != 0
                                  ) {
                                    let name = await utils.getStudentNameBySubsectstudID(
                                      value4.subsectstudID
                                    );
                                    let classRecordID = value4.classRecordID;
                                    let grade = parseFloat(
                                      value4[
                                        `q${
                                          parseInt(quarter.charAt(1)) - 2
                                        }FinalGrade`
                                      ]
                                    );
                                    let subjectID = await utils.getSubjectIDBySubsectstudID(
                                      value4.subsectstudID
                                    );
                                    let subjectName = await utils.getSubjectName(
                                      subjectID
                                    );
                                    let teacher = await SubjectSectionStudent.findOne(
                                      {
                                        where: {
                                          subsectstudID: value4.subsectstudID,
                                        },
                                      }
                                    )
                                      .then(
                                        async (subsectstud) =>
                                          await SubjectSection.findOne({
                                            where: {
                                              subsectID: subsectstud.subsectID,
                                            },
                                          })
                                      )
                                      .then(
                                        async (ss2) =>
                                          await utils.getTeacherName(
                                            ss2.teacherID
                                          )
                                      );
                                    failedInfo.push({
                                      name,
                                      classRecordID,
                                      grade,
                                      subjectName,
                                      teacher,
                                    });
                                    passed4 = -1;
                                    return passed4;
                                  } else {
                                    passed4 = 1;
                                  }
                                }
                              }
                            }
                          }
                          return passed4;
                        }
                      });
                      if (passed2 == -1) {
                        foundFailed = true;
                      }

                      if (foundFailed) {
                        passed2 = -1;
                      }
                    }

                    return passed2;
                  }
                });
                if (passed == 1) {
                  numOfPassed = numOfPassed + 1;
                } else if (passed == -1) {
                  numOfFailed = numOfFailed + 1;
                } else {
                  // console.log(passed);
                }
              }
              return {
                numOfFailed,
                numOfPassed,
              };
            }
          });
          data.push({
            failedInfo,
            numOfPassed,
            numOfFailed,
            name,
            sectionID,
          });
        }
        res.status(200).json({
          data,
          failed: data
            .reduce((a, b) => [...a, b.numOfFailed], [])
            .reduce((a, b) => a + parseInt(b), 0),
        });
      }
    });
  }
);

// @route POST api/registrar/gethonorstudents
// @desc Get number of honor students by schoolYearID, and gradeLevel
// @access Private

router.post(
  "/gethonorstudents",
  passport.authenticate(directorRegistrar, {
    session: false,
  }),
  async (req, res) => {
    const { schoolYearID, gradeLevel } = req.body;
    Section.findAll({
      where: {
        gradeLevel,
      },
    }).then(async (section) => {
      if (section) {
        let data = [];
        for (const [index, value] of section.entries()) {
          let name = await utils.getSectionName(value.sectionID);
          let sectionID = value.sectionID;
          let honorInfo = [];
          const numOfHonors = await StudentSection.findAll({
            where: {
              sectionID: value.sectionID,
              schoolYearID,
            },
          }).then(async (ss) => {
            if (ss) {
              let numOfHonors = 0;
              for (const [index2, value2] of ss.entries()) {
                const isHonors = await StudentFinalGrade.findOne({
                  where: {
                    studsectID: value2.studsectID,
                    schoolYearID,
                  },
                }).then(async (sfg) => {
                  if (sfg) {
                    if (parseFloat(sfg.grade) >= 90) {
                      let name = await utils.getStudentNameByStudsectID(
                        value2.studsectID
                      );
                      let grade = sfg.grade;
                      honorInfo.push({
                        name,
                        grade,
                        studentID: ss.studentID,
                      });
                      return true;
                    } else {
                      return false;
                    }
                  }
                });
                if (isHonors) {
                  numOfHonors = numOfHonors + 1;
                }
              }
              return numOfHonors;
            }
          });
          data.push({
            name,
            sectionID,
            numOfHonors,
            honorInfo,
          });
        }
        res.status(200).json({
          data,
          numOfHonors: data
            .reduce((a, b) => [...a, b.numOfHonors], [])
            .reduce((a, b) => a + parseInt(b), 0),
        });
      }
    });
  }
);

module.exports = router;
