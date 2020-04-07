const express = require("express");
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
const Adviser = require("../../models/Adviser");
const Subject = require("../../models/Subject");
const Component = require("../../models/Component");
const Subcomponent = require("../../models/Subcomponent");
const StudentGrades = require("../../models/StudentGrades");
const Op = Sequelize.Op;

//Import Utility Functions
const utils = require("../../utils");

// Input Validation
const validateEditProfileNonacademic = require("../../validation/editprofilenonacademic");
const validateAddSection = require("../../validation/addsection");

// @route POST api/registar/updateprofile
// @desc Update profile
// @access Private

router.post(
  "/updateprofile",
  passport.authenticate("registrar", {
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

// @route POST api/registrar/setdeadlineall
// @desc Set the submission deadline for all teachers
// @access Private

router.post(
  "/setdeadlineall",
  passport.authenticate("registrar", { session: false }),
  (req, res) => {
    let { deadline } = req.body;
    const dateSet = utils.getPHTime();
    const deadlineDate = utils.getPHTime(deadline);
    SubmissionDeadline.findOne({ where: { isActive: true } }).then(entry => {
      if (entry) {
        res
          .status(500)
          .json({ msg: "A submission deadline is currently active" });
      } else {
        SubmissionDeadline.findAll({ where: { isActive: true } }).then(
          submissiondeadline => {
            Teacher.findAll().then(teachers => {
              if (teachers.length == 0) {
                res.status(404).json({ msg: "No teachers are found yet." });
              }
              teachers.forEach(async (teacher, key, arr) => {
                await SubmissionDeadline.create({
                  teacherID: teacher.teacherID,
                  dateSet,
                  deadline: deadlineDate,
                  isActive: 1
                });
              });
              res.status(200).json({ msg: "Deadline set successfully!" });
            });
          }
        );
      }
    });
  }
);

// @route GET api/registrar/disabledeadline
// @desc Disable the submission deadline for all teachers
// @access Private

router.get(
  "/disabledeadline",
  passport.authenticate("registrar", { session: false }),
  (req, res) => {
    SubmissionDeadline.findAll({ where: { isActive: true } }).then(
      submissiondeadline => {
        if (submissiondeadline.length == 0) {
          res.status(404).json({
            msg: "There is no active submission deadline."
          });
        } else {
          submissiondeadline.forEach(async (entry, key, arr) => {
            await entry.update({ isActive: 0 });
          });
          res.status(200).json({ msg: "Disabled successfully!" });
        }
      }
    );
  }
);

// @route POST api/registrar/setdeadline
// @desc Set the submission deadline for given teachers
// @access Private

router.post(
  "/setdeadline",
  passport.authenticate("registrar", { session: false }),
  async (req, res) => {
    const { teachers, deadline } = req.body;
    deadlineDate = utils.getPHTime(deadline);
    await teachers.map(async teacher => {
      await SubmissionDeadline.findOne({
        where: {
          isActive: true,
          teacherID: teacher.id
        }
      }).then(async function(teacher) {
        await teacher.update({ deadline: deadlineDate });
      });
    });

    res.status(200).json({ msg: "Deadline set successfully!" });
  }
);

// @route POST api/registrar/getsections
// @desc Get sections based on keyword
// @access Private

router.post(
  "/getsections",
  passport.authenticate("registrar", { session: false }),
  async (req, res) => {
    let { page, pageSize, keyword } = req.body;
    page = page - 1;
    let offset = page * pageSize;
    let limit = offset + pageSize;
    Section.findAll({
      limit,
      offset,
      where: {
        sectionName: {
          [Op.like]: `%${keyword}%`
        },
        archived: 0
      }
    }).then(sections => {
      let sectionData = [];
      if (sections.length != 0) {
        sections.slice(0, pageSize).forEach(async (section, key, arr) => {
          const keyID = section.sectionID;
          const name = section.sectionName;
          const gradeLevel = section.gradeLevel;
          sectionData.push({ key: keyID, name, gradeLevel });
          if (key == arr.length - 1) {
            Section.findAndCountAll({
              where: {
                sectionName: {
                  [Op.like]: `%${keyword}%`
                },
                archived: 0
              }
            })
              .then(count => {
                sectionData.sort((a, b) => (a.key > b.key ? 1 : -1));
                res.status(200).json({
                  numOfPages: Math.ceil(count.count / pageSize),
                  sectionList: sectionData
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
    });
  }
);

// @route POST api/registrar/sectiongradelevel
// @desc Get grade level by studentID
// @access Private

router.post(
  "/sectiongradelevel",
  passport.authenticate("registrar", { session: false }),
  async (req, res) => {
    const { sectionID } = req.body;
    let gradeLevel = await utils.getGradeLevelBySectionID(sectionID);
    if (gradeLevel === "") {
      res.status(404).json({ msg: "Not found!" });
    } else {
      res.status(200).json({ gradeLevel });
    }
  }
);

// @route POST api/registrar/getpastgradelevel
// @desc Get past grade level
// @access Private

router.post(
  "/getpastgradelevel",
  passport.authenticate("registrar", { session: false }),
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
      "G12"
    ];
    const gradeLevelIndex = gradeLevels.indexOf(gradeLevel);
    if (gradeLevelIndex != 0) {
      res.status(200).json({ gradeLevel: gradeLevels[gradeLevelIndex - 1] });
    } else {
      res.status(200).json({ gradeLevel: gradeLevels[gradeLevelIndex] });
    }
  }
);

// @route POST api/registrar/addsection
// @desc Add a new section
// @access Private

router.post(
  "/addsection",
  passport.authenticate("registrar", { session: false }),
  async (req, res) => {
    const { sectionName, gradeLevel } = req.body;
    const { errors, isValid } = validateAddSection({ sectionName });

    if (!isValid) {
      return res.status(400).json(errors);
    }

    Section.findOne({ where: { sectionName, archived: 0 } }).then(section => {
      if (section) {
        res.status(400).json({ sectionName: "Section name is already taken" });
      } else {
        Section.create({ sectionName, gradeLevel }).then(section2 => {
          res.status(200).json({ msg: "Section created successfully!" });
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
  passport.authenticate("registrar", { session: false }),
  async (req, res) => {
    const { sectionID, sectionName, gradeLevel } = req.body;
    const { errors, isValid } = validateAddSection({ sectionName });
    if (!isValid) {
      return res.status(400).json(errors);
    }
    Section.findOne({ where: { sectionID } }).then(section => {
      if (section) {
        section.update({ sectionName, gradeLevel }).then(section2 => {
          res.status(200).json({ msg: "Section updated successfully!" });
        });
      } else {
        res.status(404).json({ msg: "Section not found" });
      }
    });
  }
);

// @route POST api/registrar/deletesection
// @desc Delete a section
// @access Private

router.post(
  "/deletesection",
  passport.authenticate("registrar", { session: false }),
  async (req, res) => {
    const { sectionID } = req.body;
    Section.findOne({ where: { sectionID } })
      .then(async section => {
        let schoolYearID = await utils.getActiveSY();
        await StudentSection.findAll({
          where: { sectionID, schoolYearID }
        }).then(studentsections => {
          studentsections.forEach(async (studentsection, key, arr) => {
            studentsection.destroy({});
          });
        });
        await Adviser.findOne({ where: { sectionID, schoolYearID } }).then(
          adviser => {
            if (adviser) {
              adviser.destroy({});
            }
          }
        );
        await SubjectSection.findAll({
          where: { sectionID, schoolYearID }
        }).then(subjectsections => {
          subjectsections.forEach(async (subjectsection, key, arr) => {
            subjectsection.destroy({});
          });
        });
        await section
          .update({ archived: 1 })
          .then(() => {
            res.status(200).json({ msg: "Section deleted successfully!" });
          })
          .catch(err => res.status(404));
      })
      .catch(err => res.status(404));
  }
);

// @route POST api/registrar/getallstudents
// @desc Get all students from a keyword
// @access Private

router.post(
  "/getallstudents",
  passport.authenticate("registrar", { session: false }),
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
                  position: 4,
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
                  accountData.sort((a, b) =>
                    a.accountID > b.accountID ? 1 : -1
                  );
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

// @route POST api/registrar/getallteachers
// @desc Get all teachers from a keyword
// @access Private

router.post(
  "/getallteachers",
  passport.authenticate("registrar", { session: false }),
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
            if (key == arr.length - 1) {
              UserAccount.findAndCountAll({
                where: {
                  position: 3,
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
                  accountData.sort((a, b) =>
                    a.accountID > b.accountID ? 1 : -1
                  );
                  res.status(200).json({
                    numOfPages: Math.ceil(count.count / pageSize),
                    accountList: accountData
                  });
                })
                .catch(err => {
                  res.status(404).json({ msg: "Not found" });
                });
            }
          });
        } else {
          res.status(404).json({ msg: "Not found" });
        }
      })
      .catch(err => {
        res.status(404).json({ msg: "Not found" });
      });
  }
);

// @route POST api/registrar/getpastrecords
// @desc Get past records of students by grade level
// @access Private

router.post(
  "/getpastrecords",
  passport.authenticate("registrar", { session: false }),
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
      "G12"
    ];
    const gradeLevelIndex = gradeLevels.indexOf(gradeLevel);
    let pastGradeLevel =
      gradeLevelIndex == 0
        ? gradeLevels[gradeLevelIndex]
        : gradeLevels[gradeLevelIndex - 1];
    let sectionsID = await utils.getSectionsIDByGradeLevel(pastGradeLevel);
    let recordsData = { numOfPages: 1, studentData: [] };
    if (sectionsID.length != 0) {
      recordsData = await utils.getStudentSectionBySYAndSectionID({
        sectionID: sectionsID,
        schoolYearID: pastSYID,
        page,
        pageSize,
        keyword
      });
      res.status(200).json(recordsData);
    } else {
      res.status(404).json({ msg: "Not found!" });
    }
  }
);

// @route POST api/registrar/searchstudent
// @desc Suggestion search for students (5 entries)
// @access Private

router.post(
  "/searchstudent",
  passport.authenticate("registrar", { session: false }),
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
        let studentData = [];
        if (users.length != 0) {
          users.slice(0, pageSize).forEach(async (user, key, arr) => {
            const keyID = await utils.getStudentID(user.accountID);
            const name =
              utils.capitalize(user.firstName) +
              " " +
              utils.capitalize(user.lastName);
            const imageUrl = user.imageUrl;
            studentData.push({ key: keyID, name, imageUrl });
            if (key == arr.length - 1) {
              studentData.sort((a, b) => (a.name > b.name ? 1 : -1));
              res.status(200).json({ accountList: studentData });
            }
          });
        } else {
          res.status(404).json({ msg: "Not found" });
        }
      })
      .catch(err => {
        res.status(404).json({ msg: "Not found" });
      });
  }
);

// @route POST api/registrar/searchteacher
// @desc Suggestion search for teacher (5 entries)
// @access Private

router.post(
  "/searchteacher",
  passport.authenticate("registrar", { session: false }),
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
        let teacherData = [];
        if (users.length != 0) {
          users.slice(0, pageSize).forEach(async (user, key, arr) => {
            const keyID = await utils.getTeacherID(user.accountID);
            const name =
              utils.capitalize(user.firstName) +
              " " +
              utils.capitalize(user.lastName);
            const imageUrl = user.imageUrl;
            teacherData.push({ key: keyID, name, imageUrl });
            if (key == arr.length - 1) {
              teacherData.sort((a, b) => (a.name > b.name ? 1 : -1));
              res.status(200).json({ accountList: teacherData });
            }
          });
        } else {
          res.status(404).json({ msg: "Not found" });
        }
      })
      .catch(err => {
        res.status(404).json({ msg: "Not found" });
      });
  }
);

// @route POST api/registrar/searchenrolled
// @desc Suggestion search for enrolled students (5 entries)
// @access Private

router.post(
  "/searchenrolled",
  passport.authenticate("registrar", { session: false }),
  async (req, res) => {
    const { keyword } = req.body;
    let page = 1;
    let pageSize = 5;
    page = page - 1;
    let offset = page * pageSize;
    let limit = offset + pageSize;
    let studentsID = await utils.getStudentsIDByKeyword(keyword);
    let schoolYearID = await utils.getActiveSY();
    if (studentsID.length == 0) {
      res.status(404).json({ msg: "Not found!" });
    } else {
      StudentSection.findAll({
        limit,
        offset,
        where: { studentID: studentsID, schoolYearID }
      }).then(async studentsections => {
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
              studsectID
            });
          }
          res.status(200).json({ studentList: studsectarr });
        } else {
          res.status(404).json({ msg: "Not found!" });
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
  passport.authenticate("registrar", { session: false }),
  (req, res) => {}
);

// @route GET api/registrar/getsy
// @desc Get current school year
// @access Private
router.get(
  "/getsy",
  passport.authenticate("registrar", { session: false }),
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

// @route GET api/registrar/getpastsy
// @desc Get past school year
// @access Private

router.get(
  "/getpastsy",
  passport.authenticate("registrar", { session: false }),
  async (req, res) => {
    let pastSY = await utils.getPastSY();
    let pastSYID = await utils.getSYID(pastSY);
    res.status(200).json({ schoolYearID: pastSYID, schoolYear: pastSY });
  }
);

// @route POST api/registrar/sectionname
// @desc Get section name
// @access Private

router.post(
  "/sectionname",
  passport.authenticate("registrar", { session: false }),
  async (req, res) => {
    let { sectionID } = req.body;
    let sectionName = await utils.getSectionName(sectionID);
    res.status(200).json({ sectionName });
  }
);

// @route POST api/registrar/getcurrentenrolled
// @desc Get currently enrolled students by section
// @access Private

router.post(
  "/getcurrentenrolled",
  passport.authenticate("registrar", { session: false }),
  async (req, res) => {
    let { page, pageSize } = req.body;
    page = page - 1;
    let offset = page * pageSize;
    let limit = offset + pageSize;
    const { sectionID } = req.body;
    const schoolYearID = await utils.getActiveSY();
    const gradeLevel = await utils.getGradeLevelBySectionID(sectionID);
    StudentSection.findAll({
      limit,
      offset,
      where: { schoolYearID, sectionID }
    })
      .then(studentsections => {
        let studentData = [];
        if (studentsections.length == 0) {
          res.status(200).json({ numOfPages: 1, studentList: [], gradeLevel });
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
                studsectID
              });
              if (key == arr.length - 1) {
                StudentSection.findAndCountAll({
                  where: { schoolYearID, sectionID }
                })
                  .then(count => {
                    studentData.sort((a, b) => {
                      a.name > b.name ? 1 : -1;
                    });
                    res.status(200).json({
                      numOfPages: Math.ceil(count.count / pageSize),
                      studentList: studentData,
                      gradeLevel
                    });
                  })
                  .catch(err => {
                    res.status(404);
                  });
              }
            });
        }
      })
      .catch(err => {
        res.status(404);
      });
  }
);

// @route POST api/registrar/createstudentsection
// @desc Add student to section
// @access Private

router.post(
  "/createstudentsection",
  passport.authenticate("registrar", { session: false }),
  (req, res) => {
    const { studentID, sectionID, schoolYearID } = req.body;
    if (studentID == -1) {
      res.status(400).json({ studentName: "You must select a student" });
    }
    StudentSection.findOne({
      where: { studentID, schoolYearID }
    }).then(studentsection => {
      if (studentsection) {
        res
          .status(400)
          .json({ studentName: "Student is already enrolled in a section" });
      } else {
        StudentSection.create({ studentID, sectionID, schoolYearID }).then(
          studentsection2 => {
            res
              .status(200)
              .json({ studentName: "Student enrolled successfully!" });
          }
        );
      }
    });
  }
);

// @route POST api/registrar/deletestudentsection
// @desc Unenroll student from a student section
// @acces Private

router.post(
  "/deletestudentsection",
  passport.authenticate("registrar", { session: false }),
  async (req, res) => {
    const { studentID, sectionID, schoolYearID } = req.body;
    StudentSection.findOne({
      where: { studentID, sectionID, schoolYearID }
    }).then(studentsection => {
      if (!studentsection) {
        res.status(400).json({ studentName: "Student section not found" });
      } else {
        studentsection.destroy().then(() => {
          res
            .status(200)
            .json({ studentName: "Student unenrolled successfully!" });
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
  passport.authenticate("registrar", { session: false }),
  async (req, res) => {
    const schoolYearID = await utils.getActiveSY();
    const { payload, sectionID, subjectID, accountID } = req.body;
    const teacherID = await utils.getTeacherID(accountID);
    SubjectSection.findOne({
      where: { subjectID, sectionID, teacherID, schoolYearID }
    }).then(ss => {
      if (ss) {
        res.status(400).json({ msg: "Subject load already exists!" });
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
          .then(classrecord => {
            SubjectSection.create({
              subjectID,
              sectionID,
              teacherID,
              schoolYearID,
              classRecordID: classrecord.classRecordID
            })
              .then(subjectsection => {
                let i = 0;
                for (i; i < payload.length; i++) {
                  SubjectSectionStudent.create({
                    subsectID: subjectsection.subsectID,
                    studsectID: payload[i].studsectID
                  }).then(subsectstud => {
                    let q = ["Q1", "Q2", "Q3", "Q4"];
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
                        quarter: q[i]
                      });
                    }
                    StudentGrades.create({
                      subsectstudID: subsectstud.subsectstudID,
                      classRecordID: classrecord.classRecordID
                    });
                  });
                }
                Component.findOne({
                  where: { subjectID, component: "FA" }
                }).then(comp1 => {
                  if (comp1) {
                    Component.findOne({
                      where: { subjectID, component: "WW" }
                    }).then(comp2 => {
                      if (comp2) {
                        Component.findOne({
                          where: { subjectID, component: "PT" }
                        }).then(comp3 => {
                          if (comp3) {
                            Component.findOne({
                              where: { subjectID, component: "QE" }
                            }).then(comp4 => {
                              if (comp4) {
                                let q = ["Q1", "Q2", "Q3", "Q4"];
                                let j = 0;
                                for (j; j < q.length; j++) {
                                  Subcomponent.create({
                                    classRecordID: classrecord.classRecordID,
                                    name: "Subcomponent 1",
                                    componentID: comp1.componentID,
                                    compWeight: 100,
                                    quarter: q[j]
                                  });
                                  Subcomponent.create({
                                    classRecordID: classrecord.classRecordID,
                                    name: "Subcomponent 1",
                                    componentID: comp2.componentID,
                                    compWeight: 100,
                                    quarter: q[j]
                                  });
                                  Subcomponent.create({
                                    classRecordID: classrecord.classRecordID,
                                    name: "Subcomponent 1",
                                    componentID: comp3.componentID,
                                    compWeight: 100,
                                    quarter: q[j]
                                  });
                                  Subcomponent.create({
                                    classRecordID: classrecord.classRecordID,
                                    name: "Quarterly Exam",
                                    componentID: comp4.componentID,
                                    compWeight: 100,
                                    quarter: q[j]
                                  });
                                }
                                res
                                  .status(200)
                                  .json({ msg: "Added successfully!" });
                              } else {
                                res
                                  .status(404)
                                  .json({ msg: "QE component not found!" });
                              }
                            });
                          } else {
                            res
                              .status(404)
                              .json({ msg: "PT component not found!" });
                          }
                        });
                      } else {
                        res
                          .status(404)
                          .json({ msg: "WW component not found!" });
                      }
                    });
                  } else {
                    res.status(404).json({ msg: "FA component not found!" });
                  }
                });
              })
              .catch(err => {
                res.status(400).json({ msg: "Error adding subject section" });
              });
          })
          .catch(err => {
            res.status(400).json({ msg: "Error adding class record" });
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
  passport.authenticate("registrar", { session: false }),
  async (req, res) => {
    const { subsectID } = req.body;
    SubjectSection.findOne({ where: { subsectID } }).then(
      async subjectsection => {
        if (subjectsection) {
          await subjectsection.destroy().then(() => {
            res.status(200).json({ msg: "Subject load deleted successfully!" });
          });
        } else {
          res.status(400).json({ msg: "Error deleting subject load! 2" });
        }
      }
    );
  }
);

// @route POST api/registrar/studentprofile
// @desc Get all personal information based on studentID
// @access Private

router.post(
  "/studentprofile",
  passport.authenticate("registrar", { session: false }),
  async (req, res) => {
    const { studentID } = req.body;
    Student.findOne({ where: { studentID } })
      .then(student => {
        UserAccount.findOne({ where: { accountID: student.accountID } }).then(
          user => {
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
              citizenship: user.citizenship
            };
            res.status(200).json(payload);
          }
        );
      })
      .catch(err => {
        res.status(404).json({ msg: "Student not found!" });
      });
  }
);

// @route POST api/registrar/advisorytable
// @desc Get all advisers from current school year
// @access Private

router.post(
  "/advisorytable",
  passport.authenticate("registrar", { session: false }),
  async (req, res) => {
    let { page, pageSize, keyword } = req.body;
    page = page - 1;
    const offset = page * pageSize;
    const limit = offset + pageSize;
    const schoolYearID = await utils.getActiveSY();
    if (schoolYearID == 0) {
      res.status(404).json({ msg: "There is no active school year" });
    } else {
      let data = [];
      let sectionsID = await utils.getSectionsID({ limit, offset, keyword });
      let advisersData = await utils.getAdviserBySchoolYearID(schoolYearID);
      let i = 0;
      for (i; i < sectionsID.slice(0, pageSize).length; i++) {
        let sectionID = sectionsID[i];
        let sectionName = await utils.getSectionName(sectionsID[i]);
        let adviser = "NO ADVISER";
        let teacherID = 0;
        let gradeLevel = await utils.getGradeLevelBySectionID(sectionsID[i]);
        data.push({ sectionID, sectionName, adviser, teacherID, gradeLevel });
      }
      i = 0;
      for (i; i < advisersData.length; i++) {
        let index = data.findIndex(
          val => val.sectionID == advisersData[i].sectionID
        );
        if (index != -1) {
          data[index].adviser = advisersData[i].teacherName;
          data[index].teacherID = advisersData[i].teacherID;
        }
      }
      Section.findAndCountAll({
        where: { archived: 0, sectionName: { [Op.like]: `%${keyword}%` } }
      }).then(count => {
        res.status(200).json({
          numOfPages: Math.ceil(count.count / pageSize),
          advisoryData: data
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
  passport.authenticate("registrar", { session: false }),
  async (req, res) => {
    const { schoolYearID, sectionID, teacherID } = req.body;
    Adviser.findOne({ where: { schoolYearID, sectionID, teacherID } }).then(
      adviser => {
        if (adviser) {
          adviser.destroy().then(() => {
            res
              .status(200)
              .json({ msg: "You have successfully unassigned an adviser!" });
          });
        } else {
          res.status(404).json({ teacherName: "Unassigning failed" });
        }
      }
    );
  }
);

// @route POST api/registrar/assignadviser
// @desc Assign adivser
// @access Private

router.post(
  "/assignadviser",
  passport.authenticate("registrar", { session: false }),
  async (req, res) => {
    const { schoolYearID, sectionID, teacherID } = req.body;
    Adviser.findOne({ where: { schoolYearID, teacherID } }).then(adivser => {
      if (adivser) {
        res
          .status(404)
          .json({ teacherName: "There's already assigned adviser!" });
      } else {
        Adviser.create({ schoolYearID, sectionID, teacherID })
          .then(adivser2 => {
            res
              .status(200)
              .json({ msg: "You have successfully assigned an adviser" });
          })
          .catch(err =>
            res.status(404).json({ teacherName: "Assigning failed" })
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
  passport.authenticate("registrar", { session: false }),
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
          [Op.like]: `%${keyword}%`
        }
      }
    })
      .then(subjects => {
        let subjectData = [];
        if (subjects.length != 0) {
          subjects.slice(0, pageSize).forEach(async (subject, key, arr) => {
            const keyID = subject.subjectID;
            const { subjectCode, subjectName, subjectType } = subject;
            subjectData.push({
              key: keyID,
              subjectCode,
              subjectName,
              subjectType
            });
            if (key == arr.length - 1) {
              Subject.findAndCountAll({
                where: {
                  subjectName: {
                    [Op.like]: `%${keyword}%`
                  }
                }
              })
                .then(count => {
                  subjectData.sort((a, b) =>
                    a.subjectName > b.subjectName ? 1 : -1
                  );
                  res.status(200).json({
                    numOfPages: Math.ceil(count.count / pageSize),
                    subjectList: subjectData
                  });
                })
                .catch(err => {
                  res.status(404).json({ msg: "Not found" });
                });
            }
          });
        } else {
          res.status(404).json({ msg: "Not found" });
        }
      })
      .catch(err => {
        res.status(404).json({ msg: "Not found" });
      });
  }
);

// @route POST api/registrar/userinfo
// @desc Get user information
// @access Private

router.post(
  "/userinfo",
  passport.authenticate("registrar", { session: false }),
  async (req, res) => {
    const { accountID } = req.body;
    UserAccount.findOne({ where: { accountID } }).then(async user => {
      if (user) {
        const { accountID, email, imageUrl } = user;
        const name =
          utils.capitalize(user.firstName) +
          " " +
          utils.capitalize(user.lastName);
        res.status(200).json({ accountID, email, imageUrl, name });
      } else {
        res.status(404).json({ msg: "User not found" });
      }
    });
  }
);

// @route POST api/registrar/getsubjectsection
// @desc Get subject section by teacherID
// @access Private

router.post(
  "/getsubjectsection",
  passport.authenticate("registrar", { session: false }),
  async (req, res) => {
    let { accountID, schoolYearID, page, pageSize } = req.body;
    page = page - 1;
    let offset = page * pageSize;
    let limit = offset + pageSize;
    let teacherID = await utils.getTeacherID(accountID);
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

// @route POST api/registrar/getsectionbygradelevel
// @desc Get sections by grade level
// @access Private

router.post(
  "/getsectionbygradelevel",
  passport.authenticate("registrar", { session: false }),
  async (req, res) => {
    const { gradeLevel } = req.body;
    Section.findAll({ where: { gradeLevel, archived: 0 } }).then(sections => {
      if (sections.length != 0) {
        let sectionsData = [];
        let i = 0;
        for (i; i < sections.length; i++) {
          const { sectionID, sectionName } = sections[i];
          sectionsData.push({ sectionID, sectionName });
        }
        res.status(200).json({ sectionsList: sectionsData });
      } else {
        res.status(404).json({ msg: "Not found!" });
      }
    });
  }
);

// @route POST api/registrar/getsubjectbygradelevel
// @desc Get subjects by grade level
// @access Private

router.post(
  "/getsubjectbygradelevel",
  passport.authenticate("registrar", { session: false }),
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
      "G10"
    ];
    if (["G11", "G12"].includes(gradeLevel)) {
      Subject.findAll({
        where: { subjectType: { [Op.notIn]: nonSHSGradeLevel }, archived: 0 }
      }).then(subjects => {
        if (subjects.length == 0) {
          res.status(404).json({ msg: "Not found" });
        } else {
          let subjectsData = [];
          let i = 0;
          for (i; i < subjects.length; i++) {
            const { subjectID, subjectCode, subjectName } = subjects[i];
            subjectsData.push({ subjectID, subjectCode, subjectName });
          }
          res.status(200).json({ subjectsList: subjectsData });
        }
      });
    } else {
      Subject.findAll({
        where: { subjectType: gradeLevel, archived: 0 }
      }).then(subjects => {
        if (subjects.length == 0) {
          res.status(404).json({ msg: "Not found" });
        } else {
          let subjectsData = [];
          let i = 0;
          for (i; i < subjects.length; i++) {
            const { subjectID, subjectCode, subjectName } = subjects[i];
            subjectsData.push({ subjectID, subjectCode, subjectName });
          }
          res.status(200).json({ subjectsList: subjectsData });
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
  passport.authenticate("registrar", { session: false }),
  async (req, res) => {
    const { subsectID } = req.body;
    SubjectSection.findOne({ where: { subsectID } }).then(subjectsection => {
      if (subjectsection) {
        SubjectSectionStudent.findAll({ where: { subsectID } }).then(
          async subjectsectionstudents => {
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
                  gradeLevel
                });
              }
              res.status(200).json({
                sectionName,
                gradeLevel,
                subjectName,
                studentList: studarr
              });
            }
          }
        );
      } else {
        res.status(404).json({ msg: "Subject section not found!" });
      }
    });
  }
);

// @route POST api/registrar/addsubsectstud
// @desc Add a stud sect to subject section
// @access Private

router.post(
  "/addsubsectstud",
  passport.authenticate("registrar", { session: false }),
  async (req, res) => {
    const { studsectID, subsectID } = req.body;
    SubjectSectionStudent.findOne({ where: { studsectID, subsectID } }).then(
      subjectsectionstudent => {
        if (subjectsectionstudent) {
          res
            .status(400)
            .json({ msg: "Student already enrolled in the subject!" });
        } else {
          SubjectSectionStudent.create({ studsectID, subsectID }).then(() => {
            res
              .status(200)
              .json({ msg: "Student added to subject successfully!" });
          });
        }
      }
    );
  }
);

// @route POST api/registrar/deletesubsectstud
// @desc Delete a stud sect to subject section
// @access Private

router.post(
  "/deletesubsectstud",
  passport.authenticate("registrar", { session: false }),
  async (req, res) => {
    const { subsectstudID } = req.body;
    SubjectSectionStudent.findOne({ where: { subsectstudID } }).then(data => {
      if (data) {
        data.destroy().then(() => {
          res
            .status(200)
            .json({ msg: "Student deleted to subject successfully!" });
        });
      } else {
        res.status(404).json({ msg: "Not found!" });
      }
    });
  }
);

module.exports = router;
