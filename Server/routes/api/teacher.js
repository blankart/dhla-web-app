const express = require("express");
const router = express.Router();
const UserAccount = require("../../models/UserAccount");
const Grade = require("../../models/Grade");
const SubjectSection = require("../../models/SubjectSection");
const SubjectSectionStudent = require("../../models/SubjectSectionStudent");
const StudentWeightedScore = require("../../models/StudentWeightedScore");
const StudentGrades = require("../../models/StudentGrades");
const Teacher = require("../../models/Teacher");
const Component = require("../../models/Component");
const ClassRecord = require("../../models/ClassRecord");
const Subcomponent = require("../../models/Subcomponent");
const passport = require("passport");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

// Input Validation
const validateEditProfileNonacademic = require("../../validation/editprofilenonacademic");
const validateSubcomponent = require("../../validation/subcomponents");

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
    let sessionTeacherID = await utils.getTeacherID(req.user.accountID);
    if (sessionTeacherID != teacherID) {
      res.status(400).json({ msg: "Not authorized!" });
    }
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
    const { accountID } = req.user;
    const teacherID = await utils.getTeacherID(accountID);
    let { page, pageSize } = req.body;
    page = page - 1;
    let offset = page * pageSize;
    let limit = offset + pageSize;
    SubjectSection.findOne({ where: { subsectID } }).then(subjectsection => {
      if (subjectsection) {
        if (subjectsection.teacherID != teacherID) {
          res.status(400).json({ msg: "Not authorized!" });
        } else {
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
              for (
                i;
                i < subjectsectionstudents.slice(0, pageSize).length;
                i++
              ) {
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
        }
      } else {
        res.status(404).json({ msg: "Subject section not found!" });
      }
    });
  }
);

// @route POST api/teacher/getcomponents
// @desc Get components per subject section
// @access Private

router.post(
  "/getcomponents",
  passport.authenticate("teacher", { session: false }),
  async (req, res) => {
    const { subsectID, quarter } = req.body;
    const { accountID } = req.user;
    const teacherID = await utils.getTeacherID(accountID);
    SubjectSection.findOne({ where: { subsectID } }).then(subjectsection => {
      if (subjectsection) {
        if (subjectsection.teacherID != teacherID) {
          res.status(400).json({ msg: "Not authorized!" });
        } else {
          Component.findOne({
            where: { subjectID: subjectsection.subjectID, component: "FA" }
          }).then(comp1 => {
            Component.findOne({
              where: { subjectID: subjectsection.subjectID, component: "WW" }
            }).then(comp2 => {
              Component.findOne({
                where: { subjectID: subjectsection.subjectID, component: "PT" }
              }).then(comp3 => {
                Component.findOne({
                  where: {
                    subjectID: subjectsection.subjectID,
                    component: "QE"
                  }
                }).then(async comp4 => {
                  let faSubcompData = [];
                  let wwSubcompData = [];
                  let ptSubcompData = [];
                  let qeSubcompData = [];
                  await Subcomponent.findAll({
                    where: {
                      classRecordID: subjectsection.classRecordID,
                      componentID: comp1.componentID,
                      quarter
                    }
                  }).then(async subcomp1 => {
                    if (subcomp1.length != 0) {
                      let i = 0;
                      for (i = 0; i < subcomp1.length; i++) {
                        let { name, compWeight, subcompID } = subcomp1[i];
                        faSubcompData.push({ name, compWeight, subcompID });
                      }
                    }
                  });
                  await Subcomponent.findAll({
                    where: {
                      classRecordID: subjectsection.classRecordID,
                      componentID: comp2.componentID,
                      quarter
                    }
                  }).then(async subcomp2 => {
                    if (subcomp2.length != 0) {
                      let i = 0;
                      for (i = 0; i < subcomp2.length; i++) {
                        let { name, compWeight, subcompID } = subcomp2[i];
                        wwSubcompData.push({ name, compWeight, subcompID });
                      }
                    }
                  });
                  await Subcomponent.findAll({
                    where: {
                      classRecordID: subjectsection.classRecordID,
                      componentID: comp3.componentID,
                      quarter
                    }
                  }).then(async subcomp3 => {
                    if (subcomp3.length != 0) {
                      let i = 0;
                      for (i = 0; i < subcomp3.length; i++) {
                        let { name, compWeight, subcompID } = subcomp3[i];
                        ptSubcompData.push({ name, compWeight, subcompID });
                      }
                    }
                  });
                  await Subcomponent.findAll({
                    where: {
                      classRecordID: subjectsection.classRecordID,
                      componentID: comp4.componentID,
                      quarter
                    }
                  }).then(async subcomp4 => {
                    if (subcomp4.length != 0) {
                      let i = 0;
                      for (i = 0; i < subcomp4.length; i++) {
                        let { name, compWeight, subcompID } = subcomp4[i];
                        qeSubcompData.push({ name, compWeight, subcompID });
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
                      subcomponents: faSubcompData
                    },
                    WW: {
                      componentID: comp2.componentID,
                      weight: comp2.compWeight,
                      subcomponents: wwSubcompData
                    },
                    PT: {
                      componentID: comp3.componentID,
                      weight: comp3.compWeight,
                      subcomponents: ptSubcompData
                    },
                    QE: {
                      componentID: comp4.componentID,
                      weight: comp4.compWeight,
                      subcomponents: qeSubcompData
                    }
                  });
                });
              });
            });
          });
        }
      } else {
        res.status(404).json({ msg: "Subject section not found!" });
      }
    });
  }
);

// @route POST api/teacher/addnewsubcomp
// @desc Add new subcomponent by classrecordID and componentID
// @access Private

router.post(
  "/addnewsubcomp",
  passport.authenticate("teacher", { session: false }),
  async (req, res) => {
    const { classRecordID, componentID, name, quarter } = req.body;
    const { accountID } = req.user;
    const teacherID = await utils.getTeacherID(accountID);
    const { errors, isValid } = validateSubcomponent({ name });

    if (!isValid) {
      return res.status(400).json({ msg: errors.msg });
    }
    SubjectSection.findOne({ where: { classRecordID } }).then(
      subjectsection => {
        if (subjectsection) {
          if (subjectsection.teacherID == teacherID) {
            Subcomponent.create({
              name,
              componentID,
              classRecordID,
              compWeight: 0,
              quarter
            }).then(subcomponent => {
              res
                .status(200)
                .json({ msg: "Successfully added a new subcomponent!" });
            });
          } else {
            res.status(400).json({ msg: "Not authorized!" });
          }
        } else {
          res.status(404).json({ msg: "Subject section not found!" });
        }
      }
    );
  }
);

// @route POST api/teacher/editsubcomp
// @desc Edit subcomponent name, weight by subcomponentID
// @access Private

router.post(
  "/editsubcomp",
  passport.authenticate("teacher", { session: false }),
  async (req, res) => {
    const reg = /^-?[0-9]*(\.[0-9]*)?$/;
    const { payload } = req.body;
    const { accountID } = req.user;
    const teacherID = await utils.getTeacherID(accountID);
    let i = 0;
    let sum = 0;
    for (i = 0; i < payload.length; i++) {
      let { errors, isValid } = validateSubcomponent({ name: payload[i].name });
      if (!isValid) {
        return res.status(400).json({ msg: errors.msg });
      } else {
        let valid =
          (!isNaN(payload[i].compWeight) && reg.test(payload[i].compWeight)) ||
          payload[i].compWeight === "" ||
          payload[i].compWeight === "-";
        if (
          payload[i].compWeight > 100 ||
          payload[i].compWeight < 0 ||
          !valid
        ) {
          return res
            .status(400)
            .json({ msg: "Invalid component weight input" });
        } else {
          sum = sum + parseFloat(payload[i].compWeight);
        }
      }
    }

    if (sum != 100) {
      return res.status(400).json({
        msg: "Sum of component weights must be 100!"
      });
    }

    payload.forEach(async (val, arr, index) => {
      await Subcomponent.findOne({
        where: { subcompID: val.subcompID }
      }).then(subcomp => {
        if (subcomp) {
          SubjectSection.findOne({
            where: { classRecordID: subcomp.classRecordID }
          }).then(subjectsection => {
            if (subjectsection) {
              if (subjectsection.teacherID == teacherID) {
                let { name, compWeight } = val;
                subcomp
                  .update({
                    name,
                    compWeight
                  })
                  .then(async () => {
                    await utils.refreshStudentWeightedScoreBySubsectID(
                      subjectsection.subsectID
                    );
                  });
              } else {
                res.status(401).json({ msg: "Not authorized!" });
              }
            } else {
              res.status(400).json({ msg: "Subject Section not found!" });
            }
          });
        } else {
          res.status(400).json({ msg: "Subcomponent not found!" });
        }
      });
    });

    res.status(200).json({ msg: "Subcomponent updated successfully!" });
  }
);

// @router POST api/teacher/deletesubcomp
// @desc Delete subcomponent by subcomponentID
// @access Private

router.post(
  "/deletesubcomp",
  passport.authenticate("teacher", { session: false }),
  async (req, res) => {
    const { subcompID } = req.body;
    const { accountID } = req.user;
    const teacherID = await utils.getTeacherID(accountID);

    Subcomponent.findOne({ where: { subcompID } }).then(subcomponent => {
      if (subcomponent) {
        Subcomponent.findAll({
          where: {
            classRecordID: subcomponent.classRecordID,
            componentID: subcomponent.componentID
          }
        }).then(c => {
          if (c.length == 1) {
            res.status(400).json({
              msg:
                "Subcomponent can't be deleted. There must be at least one subcomponent."
            });
          } else {
            SubjectSection.findOne({
              where: { classRecordID: subcomponent.classRecordID }
            }).then(subjectsection => {
              if (subjectsection) {
                if (subjectsection.teacherID != teacherID) {
                  res.status(400).json({ msg: "Not authorized!" });
                } else {
                  let compweight = subcomponent.compWeight;
                  if (compweight != 0) {
                    res.status(400).json({
                      msg:
                        "Subcomponent can't be deleted. Set component weight to 0 first."
                    });
                  } else {
                    subcomponent.destroy({}).then(() => {
                      res
                        .status(200)
                        .json({ msg: "Subcomponent deleted successfully!" });
                    });
                  }
                }
              } else {
                res.status(404).json({ msg: "Subject section not found!" });
              }
            });
          }
        });
      } else {
        res.status(404).json({ msg: "Subcomponent not found!" });
      }
    });
  }
);

// @router POST api/teacher/compinfo
// @desc Get component information by componentID and subseectID
// @access Private

router.post(
  "/compinfo",
  passport.authenticate("teacher", { session: false }),
  async (req, res) => {
    const { subsectID, componentID, quarter } = req.body;
    const { accountID } = req.user;
    const teacherID = await utils.getTeacherID(accountID);
    SubjectSection.findOne({ where: { subsectID } }).then(
      async subjectsection => {
        if (subjectsection) {
          if (subjectsection.teacherID != teacherID) {
            res.status(400).json({ msg: "Not authorized!" });
          } else {
            Component.findOne({ where: { componentID } }).then(
              async component => {
                if (component) {
                  let component = await utils.getComponentName(componentID);
                  let grades = await Subcomponent.findAll({
                    where: {
                      componentID,
                      classRecordID: subjectsection.classRecordID,
                      quarter
                    }
                  }).then(async subcomp => {
                    if (subcomp.length == 0) {
                      res.status(404).json({ msg: "Subcomponents not found!" });
                    } else {
                      let i = 0;
                      let data1 = [];
                      for (i = 0; i < subcomp.length; i++) {
                        const { subcompID } = subcomp[i];
                        let name = await utils.getSubcomponentName(subcompID);
                        name = name + ` (${subcomp[i].compWeight}%)`;
                        const data2 = await SubjectSectionStudent.findAll({
                          where: { subsectID }
                        }).then(async subsectstud => {
                          if (subsectstud.length == 0) {
                            res.status(404).json({
                              msg: "Subject section student not found!"
                            });
                          } else {
                            let j = 0;
                            let studentData = [];
                            for (j = 0; j < subsectstud.length; j++) {
                              const { subsectstudID } = subsectstud[j];
                              const name = await utils.getStudentNameBySubsectstudID(
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
                                  quarter
                                },
                                order: [["dateGiven", "DESC"]]
                              }).then(async grades => {
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
                                      total
                                    } = grades[k];
                                    gradesData.push({
                                      gradeID,
                                      dateGiven,
                                      score,
                                      total
                                    });
                                  }
                                  return gradesData;
                                }
                              });
                              let k = 0;
                              let sumScores = 0;
                              let sumItems = 0;
                              let ps = -1;
                              for (k = 0; k < grades.length; k++) {
                                sumScores =
                                  sumScores + parseFloat(grades[k].score);
                                sumItems =
                                  sumItems + parseFloat(grades[k].total);
                              }
                              if (grades.length != 0) {
                                ps = (sumScores / sumItems) * 100;
                              }

                              studentData.push({
                                imageUrl,
                                subsectstudID,
                                name,
                                grades,
                                ps
                              });
                            }
                            return studentData;
                          }
                        });
                        data1.push({ subcompID, name, data: data2 });
                      }
                      return data1;
                    }
                  });
                  let ave = await StudentWeightedScore.findAll({
                    where: {
                      classRecordID: subjectsection.classRecordID,
                      quarter
                    }
                  }).then(async studweightedscore => {
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
                          actualGrade
                        } = studweightedscore[l];
                        const name = await utils.getStudentNameBySubsectstudID(
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
                          subsectstudID,
                          ws,
                          name
                        });
                      }
                      return aveData;
                    }
                  });
                  res.status(200).json({ componentID, component, grades, ave });
                } else {
                  res.status(404).json({ msg: "Component not found!" });
                }
              }
            );
          }
        } else {
          res.status(404).json({ msg: "Subject section not found!" });
        }
      }
    );
  }
);

// @router POST api/teacher/subcompinfo
// @desc Get component information by componentID and subseectID
// @access Private

router.post(
  "/subcompinfo",
  passport.authenticate("teacher", { session: false }),
  async (req, res) => {
    const { subsectID, componentID, subcompID, quarter } = req.body;
    const { accountID } = req.user;
    const teacherID = await utils.getTeacherID(accountID);
    SubjectSection.findOne({ where: { subsectID } }).then(
      async subjectsection => {
        if (subjectsection) {
          if (subjectsection.teacherID != teacherID) {
            res.status(400).json({ msg: "Not authorized!" });
          } else {
            Component.findOne({ where: { componentID } }).then(
              async component => {
                if (component) {
                  let component = await utils.getComponentName(componentID);
                  let {
                    subcomponentID,
                    name,
                    data
                  } = await Subcomponent.findOne({
                    where: {
                      componentID,
                      classRecordID: subjectsection.classRecordID,
                      subcompID,
                      quarter
                    }
                  }).then(async subcomp => {
                    if (!subcomp) {
                      res.status(404).json({ msg: "Subcomponents not found!" });
                    } else {
                      const subcomponentID = subcomp.subcompID;
                      let name = await utils.getSubcomponentName(
                        subcomponentID
                      );
                      name = name + ` (${subcomp.compWeight}%)`;
                      const data2 = await SubjectSectionStudent.findAll({
                        where: { subsectID }
                      }).then(async subsectstud => {
                        if (subsectstud.length == 0) {
                          res.status(404).json({
                            msg: "Subject section student not found!"
                          });
                        } else {
                          let j = 0;
                          let studentData = [];
                          for (j = 0; j < subsectstud.length; j++) {
                            const { subsectstudID } = subsectstud[j];
                            const name = await utils.getStudentNameBySubsectstudID(
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
                                quarter
                              },
                              order: [["date", "DESC"]]
                            }).then(async grades => {
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
                                    description
                                  } = grades[k];
                                  gradesData.push({
                                    gradeID,
                                    dateGiven,
                                    score,
                                    total,
                                    description
                                  });
                                }
                                return gradesData;
                              }
                            });
                            let k = 0;
                            let sumScores = 0;
                            let sumItems = 0;
                            let ps = -1;
                            for (k = 0; k < grades.length; k++) {
                              sumScores =
                                sumScores + parseFloat(grades[k].score);
                              sumItems = sumItems + parseFloat(grades[k].total);
                            }
                            if (grades.length != 0) {
                              ps = (sumScores / sumItems) * 100;
                            }

                            studentData.push({
                              imageUrl,
                              subsectstudID,
                              name,
                              grades,
                              ps
                            });
                          }
                          return studentData;
                        }
                      });

                      return { subcomponentID, name, data: data2 };
                    }
                  });
                  let ave = await StudentWeightedScore.findAll({
                    where: {
                      classRecordID: subjectsection.classRecordID,
                      quarter
                    }
                  }).then(async studweightedscore => {
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
                          actualGrade
                        } = studweightedscore[l];
                        const name = await utils.getStudentNameBySubsectstudID(
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
                          subsectstudID,
                          ws,
                          name
                        });
                      }
                      return aveData;
                    }
                  });
                  res.status(200).json({
                    componentID,
                    component,
                    subcompID: subcomponentID,
                    subcompName: name,
                    data,
                    ave
                  });
                } else {
                  res.status(404).json({ msg: "Component not found!" });
                }
              }
            );
          }
        } else {
          res.status(404).json({ msg: "Subject section not found!" });
        }
      }
    );
  }
);

// @route POST api/teacher/addnewrecord
// @desc Add new record under subcomponent
// @access Private

router.post(
  "/addnewrecord",
  passport.authenticate("teacher", { session: false }),
  async (req, res) => {
    const reg = /^-?[0-9]*(\.[0-9]*)?$/;
    const {
      componentID,
      subcompID,
      payload,
      dateGiven,
      description,
      total,
      subsectID,
      quarter
    } = req.body;
    let totalValid =
      (!isNaN(total) && reg.test(total)) || total === "" || total === "-";
    if (!totalValid) {
      res
        .status(400)
        .json({ msg: "Total score is invalid. Enter numbers only." });
    } else {
      const { accountID } = req.user;
      const teacherID = await utils.getTeacherID(accountID);
      if (total <= 0) {
        res.status(400).json({ msg: "Total must be more than 0" });
      }
      SubjectSection.findOne({ where: { subsectID } }).then(
        async subjectsection => {
          if (subjectsection) {
            if (subjectsection.teacherID != teacherID) {
              return res.status(400).json({ msg: "Not authorized!" });
            } else {
              let { errors, isValid } = validateSubcomponent({
                name: description
              });
              if (!isValid) {
                return res
                  .status(400)
                  .json({ msg: "Error input: Description" });
              } else {
                let i = 0;
                let invalid = false;
                for (i = 0; i < payload.length; i++) {
                  let { score, subsectstudID } = payload[i];
                  let valid =
                    (!isNaN(score) && reg.test(score)) ||
                    score === "" ||
                    score === "-";
                  if (!valid) {
                    invalid = true;
                    return res
                      .status(400)
                      .json({ msg: "Invalid score input. Enter numbers only" });
                  }
                }

                for (const [index, value] of payload.entries()) {
                  await Grade.findAll({
                    where: {
                      componentID,
                      subcomponentID: subcompID,
                      quarter,
                      subsectstudID: value.subsectstudID
                    }
                  }).then(async grades2 => {
                    let sum = 0;
                    let totalTemp = 0;
                    for (const [index2, value2] of grades2.entries()) {
                      sum = sum + parseFloat(value2.score);
                      totalTemp = totalTemp + parseFloat(value2.total);
                    }

                    console.log(sum + parseFloat(value.score));
                    console.log(totalTemp + parseFloat(total));
                    if (
                      sum + parseFloat(value.score) >
                        totalTemp + parseFloat(total) &&
                      !invalid
                    ) {
                      invalid = true;
                      return res.status(400).json({
                        msg:
                          "Invalid score input. Scores must accumulate to less than or equal to the total number of items."
                      });
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
                    quarter
                  }
                }).then(async gr => {
                  if (gr) {
                    res.status(400).json({ msg: "Description already exists" });
                  } else {
                    for (i = 0; i < payload.length; i++) {
                      let { score, subsectstudID } = payload[i];
                      if (!invalid) {
                        Grade.create({
                          description,
                          dateGiven,
                          score,
                          total,
                          componentID,
                          subcomponentID: subcompID,
                          date: new Date(),
                          classRecordID: subjectsection.classRecordID,
                          subsectstudID,
                          showLog: 0,
                          isUpdated: 0,
                          quarter: quarter
                        });
                      }
                    }
                    await utils.refreshStudentWeightedScoreBySubsectID(
                      subjectsection.subsectID
                    );
                    return res
                      .status(200)
                      .json({ msg: "Record has been added successfully!" });
                  }
                });
              }
            }
          } else {
            res.status(404).json({ msg: "Subject section not found!" });
          }
        }
      );
    }
  }
);

// @route POST api/teacher/deleterecord
// @desc Delete a record
// @access Private

router.post(
  "/deleterecord",
  passport.authenticate("teacher", { session: false }),
  async (req, res) => {
    const { accountID } = req.user;
    const {
      subsectID,
      description,
      dateGiven,
      subcompID,
      componentID,
      quarter
    } = req.body;
    const teacherID = await utils.getTeacherID(accountID);
    SubjectSection.findOne({ where: { subsectID } }).then(subsect => {
      if (subsect) {
        if (subsect.teacherID != teacherID) {
          res.status(401).json({ msg: "Not authorized!" });
        } else {
          Grade.findAll({
            where: {
              description,
              dateGiven,
              subcomponentID: subcompID,
              componentID,
              quarter
            }
          }).then(async grades => {
            if (grades.length != 0) {
              for (const [index, value] of grades.entries()) {
                await value.destroy({});
              }
              await utils.refreshStudentWeightedScoreBySubsectID(subsectID);
              res.status(200).json({ msg: "Deleted successfully!" });
            } else {
              res.status(404).json({ msg: "Grades not found!" });
            }
          });
        }
      } else {
        res.status(404).json({ msg: "Subject section not found!" });
      }
    });
  }
);

// @route POST api/teacher/getquartersummary
// @desc Get quarter summary by subsectID and quarter
// @access Private

router.post(
  "/getquartersummary",
  passport.authenticate("teacher", { session: false }),
  async (req, res) => {
    const { accountID } = req.user;
    const { subsectID, quarter } = req.body;
    const teacherID = await utils.getTeacherID(accountID);
    SubjectSection.findOne({ where: { subsectID } }).then(async subsect => {
      if (subsect) {
        if (subsect.teacherID != teacherID) {
          res.status(401).json({ msg: "Not authorized!" });
        } else {
          const transmutation = await ClassRecord.findOne({
            where: { classRecordID: subsect.classRecordID }
          }).then(async cr => {
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
            where: { subsectID }
          }).then(async sss => {
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
              where: { subsectstudID: value, quarter }
            }).then(async sws => {
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
                  transmutedGrade60
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
                const imageUrl = await utils.getStudentImageUrlBySubsectstudID(
                  subsectstudID
                );
                return {
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
                  finalGrade
                };
              }
            });
            data.push(temp);
          }

          res.status(200).json({
            transmutation,
            subjectName,
            subjectCode,
            sectionName,
            schoolYearID,
            schoolYear,
            data
          });
        }
      } else {
        res.status(404).json({ msg: "Subject section not found!" });
      }
    });
  }
);

// @route api/teacher/changetransmutation
// @desc Change transmutation by subsectID and quarter
// @access Private

router.post(
  "/changetransmutation",
  passport.authenticate("teacher", { session: false }),
  async (req, res) => {
    const { subsectID, quarter, transmutation } = req.body;
    const { accountID } = req.user;
    const teacherID = await utils.getTeacherID(accountID);
    SubjectSection.findOne({ where: { subsectID } }).then(async ss => {
      if (ss) {
        if (ss.teacherID != teacherID) {
          res.status(401).json({ msg: "Not authorized!" });
        } else {
          ClassRecord.findOne({
            where: { classRecordID: ss.classRecordID }
          }).then(async cr => {
            if (cr) {
              switch (quarter) {
                case "Q1": {
                  await cr.update({ q1Transmu: transmutation });
                  break;
                }
                case "Q2": {
                  await cr.update({ q2Transmu: transmutation });
                  break;
                }
                case "Q3": {
                  await cr.update({ q3Transmu: transmutation });
                  break;
                }
                case "Q4": {
                  await cr.update({ q4Transmu: transmutation });
                  break;
                }
                default:
                  break;
              }
              await utils.refreshStudentWeightedScoreBySubsectID(subsectID);
              res
                .status(200)
                .json({ msg: "Transmutation changed successfully!" });
            } else {
              res.status(404).json({ msg: "Class Record not found!" });
            }
          });
        }
      } else {
        res.status(404).json({ msg: "Subject Section not found!" });
      }
    });
  }
);

// @route api/teacher/getrecinfo
// @desc Get grade record info by one gradeID
// @access Private

router.post(
  "/getrecinfo",
  passport.authenticate("teacher", { session: false }),
  async (req, res) => {
    const { accountID } = req.user;
    const { subsectID, componentID, subcompID, quarter, gradeID } = req.body;
    const teacherID = await utils.getTeacherID(accountID);
    SubjectSection.findOne({ where: { subsectID } }).then(async ss => {
      if (ss) {
        if (ss.teacherID != teacherID) {
          res.status(401).json({ msg: "Not authorized!" });
        } else {
          Grade.findOne({ where: { gradeID } }).then(async grade => {
            if (grade) {
              const { description, dateGiven, total } = grade;
              const component = await utils.getComponentName(componentID);
              const weight = await Subcomponent.findOne({
                where: { subcompID }
              }).then(sc => {
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
                  dateGiven: grade.dateGiven
                }
              }).then(async grades => {
                if (grades.length == 0) {
                  res.status(404).json({ msg: "Grades not found!" });
                } else {
                  let data = [];
                  for (const [index, value] of grades.entries()) {
                    const { subsectstudID, score, gradeID } = value;
                    const name = await utils.getStudentNameBySubsectstudID(
                      subsectstudID
                    );
                    const imageUrl = await utils.getStudentImageUrlBySubsectstudID(
                      subsectstudID
                    );
                    data.push({
                      gradeID,
                      subsectstudID,
                      score,
                      name,
                      imageUrl
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
                    data
                  });
                }
              });
            } else {
              res.status(404).json({ msg: "Grade not found!" });
            }
          });
        }
      } else {
        res.status(404).json({ msg: "Subject section not found!" });
      }
    });
  }
);

// @route api/teacher/editrecord
// @desc Edit record
// @access Private

router.post(
  "/editrecord",
  passport.authenticate("teacher", { session: false }),
  async (req, res) => {
    const reg = /^-?[0-9]*(\.[0-9]*)?$/;
    const {
      description,
      dateGiven,
      total,
      subsectID,
      subcompID,
      componentID,
      quarter,
      payload
    } = req.body;
    let totalValid =
      (!isNaN(total) && reg.test(total)) || total === "" || total === "-";
    if (!totalValid) {
      res
        .status(400)
        .json({ msg: "Total score is invalid. Enter numbers only." });
    } else {
      const { accountID } = req.user;
      const teacherID = await utils.getTeacherID(accountID);
      if (total <= 0) {
        return res.status(400).json({ msg: "Total must be more than 0" });
      } else {
        SubjectSection.findOne({ where: { subsectID } }).then(
          async subjectsection => {
            if (subjectsection) {
              if (subjectsection.teacherID != teacherID) {
                return res.status(401).json({ msg: "Not authorized!" });
              } else {
                const isSubmitted = await ClassRecord.findOne({
                  where: { classRecordID: subjectsection.classRecordID }
                }).then(cr => {
                  if (cr) {
                    return cr.isSubmitted;
                  }
                });
                let { errors, isValid } = validateSubcomponent({
                  name: description
                });
                if (!isValid) {
                  return res
                    .status(400)
                    .json({ msg: "Error input: Description" });
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
                        gradeID: { [Op.ne]: value.gradeID }
                      }
                    }).then(async grades2 => {
                      let sum = 0;
                      let totalTemp = 0;
                      for (const [index2, value2] of grades2.entries()) {
                        sum = sum + parseFloat(value2.score);
                        totalTemp = totalTemp + parseFloat(value2.total);
                      }
                      if (
                        sum + parseFloat(value.score) >
                          totalTemp + parseFloat(total) &&
                        !invalid
                      ) {
                        invalid = true;
                        return res.status(400).json({
                          msg:
                            "Invalid score input. Score must accumulatae to less than or equal to the total number of items."
                        });
                      }
                    });
                  }

                  for (i = 0; i < payload.length; i++) {
                    let { score, subsectstudID } = payload[i];
                    let valid =
                      (!isNaN(score) && reg.test(score)) ||
                      score === "" ||
                      score === "-";
                    if (!valid) {
                      invalid = true;
                      return res.status(400).json({
                        msg: "Invalid score input. Enter numbers only"
                      });
                    } else if (score < 0) {
                      invalid = true;
                      return res.status(400).json({
                        msg:
                          "Invalid score input. Enter values not less than 0."
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
                      gradeID: { [Op.notIn]: gradeIDchecker }
                    }
                  }).then(async gr => {
                    if (gr) {
                      res
                        .status(400)
                        .json({ msg: "Descrption already exists!" });
                    } else {
                      for (const [index, value3] of payload.entries()) {
                        if (!invalid) {
                          Grade.findOne({
                            where: { gradeID: value3.gradeID }
                          }).then(async gr2 => {
                            if (gr2) {
                              await gr2.update({
                                description,
                                total,
                                dateGiven,
                                score: value3.score,
                                isUpdated: 1,
                                showLog: isSubmitted
                              });
                            }
                          });
                        }
                      }

                      res
                        .status(200)
                        .json({ msg: "Record updated successfully!" });
                    }
                  });
                }
              }
            } else {
              res.status(404).json({ msg: "Subject section not found!" });
            }
          }
        );
      }
    }
  }
);

// @route POST api/teacher/getsummary
// @desc Get summary by subsectID
// @access Private

router.post(
  "/getsummary",
  passport.authenticate("teacher", { session: false }),
  async (req, res) => {
    const { accountID } = req.user;
    const { subsectID } = req.body;
    const teacherID = await utils.getTeacherID(accountID);
    SubjectSection.findOne({ where: { subsectID } }).then(async subsect => {
      if (subsect) {
        if (subsect.teacherID != teacherID) {
          res.status(401).json({ msg: "Not authorized!" });
        } else {
          const {
            q1Transmu,
            q2Transmu,
            q3Transmu,
            q4Transmu
          } = await ClassRecord.findOne({
            where: { classRecordID: subsect.classRecordID }
          }).then(async cr => {
            if (cr) {
              const { q1Transmu, q2Transmu, q3Transmu, q4Transmu } = cr;
              return { q1Transmu, q2Transmu, q3Transmu, q4Transmu };
            }
          });
          const subjectName = await utils.getSubjectName(subsect.subjectID);
          const subjectCode = await utils.getSubjectCode(subsect.subjectID);
          const sectionName = await utils.getSectionName(subsect.sectionID);
          const schoolYearID = subsect.schoolYearID;
          const schoolYear = await utils.getSYname(schoolYearID);
          StudentGrades.findAll({
            where: { classRecordID: subsect.classRecordID }
          }).then(async sg => {
            if (sg.length != 0) {
              let data = [];
              for (const [index, value] of sg.entries()) {
                const {
                  subsectstudID,
                  studentGradesID,
                  q1FinalGrade,
                  q2FinalGrade,
                  q3FinalGrade,
                  q4FinalGrade,
                  ave
                } = value;
                const name = await utils.getStudentNameBySubsectstudID(
                  subsectstudID
                );
                const imageUrl = await utils.getStudentImageUrlBySubsectstudID(
                  subsectstudID
                );
                data.push({
                  subsectstudID,
                  studentGradesID,
                  q1FinalGrade,
                  q2FinalGrade,
                  q3FinalGrade,
                  q4FinalGrade,
                  ave,
                  name,
                  imageUrl
                });
              }
              res.status(200).json({
                subjectName,
                subjectCode,
                sectionName,
                schoolYear,
                schoolYearID,
                data,
                q1Transmu,
                q2Transmu,
                q3Transmu,
                q4Transmu
              });
            } else {
              res.status(404).json({ msg: "Student Grades not found!" });
            }
          });
        }
      } else {
        res.status(404).json({ msg: "Subject section not found!" });
      }
    });
  }
);

module.exports = router;
