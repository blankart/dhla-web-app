const UserAccount = require("../models/UserAccount");
const Nonacademic = require("../models/Nonacademic");
const SchoolYear = require("../models/SchoolYear");
const Section = require("../models/Section");
const Student = require("../models/Student");
const StudentSection = require("../models/StudentSection");
const SubjectSection = require("../models/SubjectSection");
const SubjectSectionStudent = require("../models/SubjectSectionStudent");
const StudentWeightedScore = require("../models/StudentWeightedScore");
const StudentGrades = require("../models/StudentGrades");
const ClassRecord = require("../models/ClassRecord");
const Component = require("../models/Component");
const Subcomponent = require("../models/Subcomponent");
const Adviser = require("../models/Adviser");
const Teacher = require("../models/Teacher");
const Sequelize = require("sequelize");
const Subject = require("../models/Subject");
const Grade = require("../models/Grade");
const Op = Sequelize.Op;

// Utility Functions
exports.getPHTime = function(date = "") {
  const d = date === "" ? new Date() : new Date(date);
  const localOffset = d.getTimezoneOffset() * 60000;
  const UTC = d.getTime() + localOffset;
  const PHT = UTC + 3600000 * 16;
  return new Date(PHT);
};

exports.createUser = async ({ email, password, isActive, position }) => {
  const na = "NA";
  return await UserAccount.create({
    email,
    password,
    isActive,
    position,
    firstName: na,
    lastName: na,
    middleName: na,
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
  });
};

exports.createNonAcademic = async ({ accountID }) => {
  return await Nonacademic.create({
    accountID
  });
};

exports.capitalize = string => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const capitalize = string => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

exports.getTeacherName = async teacherID => {
  return await Teacher.findOne({
    where: {
      teacherID
    }
  }).then(teacher => {
    return UserAccount.findOne({
      where: {
        accountID: teacher.accountID
      }
    }).then(user => {
      return capitalize(user.firstName) + " " + capitalize(user.lastName);
    });
  });
};

exports.getStudentName = async studentID => {
  return await Student.findOne({
    where: {
      studentID
    }
  }).then(student => {
    return UserAccount.findOne({
      where: {
        accountID: student.accountID
      }
    }).then(user => {
      return capitalize(user.firstName) + " " + capitalize(user.lastName);
    });
  });
};

exports.getStudentEmail = async studentID => {
  return await Student.findOne({ where: { studentID } }).then(student => {
    return UserAccount.findOne({
      where: { accountID: student.accountID }
    }).then(user => {
      return user.email;
    });
  });
};

exports.getSubjectCode = async subjectID => {
  return await Subject.findOne({
    where: {
      subjectID
    }
  }).then(subject => {
    return subject.subjectCode;
  });
};

exports.getSubjectName = async subjectID => {
  return await Subject.findOne({ where: { subjectID } }).then(subject => {
    return subject.subjectName;
  });
};

exports.getSectionName = async sectionID => {
  return await Section.findOne({
    where: {
      sectionID
    }
  }).then(section => {
    return section.sectionName;
  });
};

exports.getSectionGradeLevel = async sectionID => {
  return await Section.findOne({
    where: {
      sectionID
    }
  }).then(section => {
    return section.gradeLevel;
  });
};

exports.displayPosition = position => {
  switch (position) {
    case false:
      return "Administrator";
    case true:
      return "Director";
    case 2:
      return "Registrar";
    case 3:
      return "Teacher";
    case 4:
      return "Student";
    case 5:
      return "Guardian";
    case 6:
      return "Cashier";
    default:
      return "";
  }
};

exports.getActiveSY = async () => {
  return await SchoolYear.findOne({ where: { isActive: 1 } }).then(
    schoolYear => {
      if (schoolYear) return schoolYear.schoolYearID;
      else return 0;
    }
  );
};

exports.getStudentSectionBySYAndSectionID = async ({
  sectionID,
  schoolYearID,
  page,
  pageSize,
  keyword
}) => {
  page = page - 1;
  let offset = page * pageSize;
  let limit = offset + pageSize;
  let studentIDs = [];
  let numOfPages = 0;

  await UserAccount.findAll({
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
  }).then(async useraccounts => {
    if (useraccounts.length != 0) {
      var i = 0;
      for (i; i < useraccounts.length; i++) {
        let studentID = await this.getStudentID(useraccounts[i].accountID);
        if (studentID != "") {
          studentIDs.push(studentID);
        }
      }
    }
  });
  return await StudentSection.findAll({
    limit,
    offset,
    where: { sectionID, schoolYearID, studentID: studentIDs }
  })
    .then(async studentsections => {
      let data = [];
      if (studentsections.length != 0) {
        var i = 0;
        for (i; i < studentsections.slice(0, pageSize).length; i++) {
          let sectionName = await this.getSectionName(
            studentsections[i].sectionID
          );
          let studentName = await this.getStudentName(
            studentsections[i].studentID
          );
          let studentID = studentsections[i].studentID;
          let imageUrl = await this.getStudentImageUrl(
            studentsections[i].studentID
          );
          let email = await this.getStudentEmail(studentsections[i].studentID);
          data.push({ sectionName, studentName, studentID, email, imageUrl });
        }
        await StudentSection.findAndCountAll({
          where: { sectionID, schoolYearID, studentID: studentIDs }
        }).then(count => {
          data.sort((a, b) => (a.studentName > b.studentName ? 1 : -1));
          numOfPages = Math.ceil(count.count / pageSize);
        });
        return { studentData: data, numOfPages };
      } else {
        return { studentData: [], numOfPages: 1 };
      }
    })
    .catch(err => {
      return { studentData: [], numOfPages: 1 };
    });
};

exports.getSectionsIDByGradeLevel = async gradeLevel => {
  return await Section.findAll({ where: { gradeLevel } }).then(
    async sections => {
      if (sections.length == 0) {
        return [];
      } else {
        let sectionData = [];
        await sections.forEach(async (section, key, arr) => {
          sectionData.push(section.sectionID);
        });
        return sectionData;
      }
    }
  );
};

exports.getStudentImageUrl = async studentID => {
  return await Student.findOne({ where: { studentID } }).then(async student => {
    if (student) {
      return await UserAccount.findOne({
        where: { accountID: student.accountID }
      }).then(user => {
        if (user) {
          return user.imageUrl;
        } else {
          return "";
        }
      });
    } else {
      return "";
    }
  });
};

exports.getAdviserBySchoolYearID = async schoolYearID => {
  return await Adviser.findAll({ where: { schoolYearID } }).then(
    async advisers => {
      if (advisers.length == 0) {
        return [];
      } else {
        let advisersData = [];
        await advisers.forEach(async (adviser, key, arr) => {
          let sectionID = adviser.sectionID;
          let teacherName = await this.getTeacherName(adviser.teacherID);
          let teacherID = adviser.teacherID;
          advisersData.push({ sectionID, teacherName, teacherID });
        });
        return advisersData;
      }
    }
  );
};

exports.getSectionsID = async ({ limit, offset, keyword }) => {
  return await Section.findAll({
    limit,
    offset,
    where: { archived: 0, sectionName: { [Op.like]: `%${keyword}%` } }
  }).then(async sections => {
    if (sections.length == 0) {
      return [];
    } else {
      let sectionData = [];
      await sections.forEach(async (section, key, arr) => {
        sectionData.push(section.sectionID);
      });
      return sectionData;
    }
  });
};

exports.getGradeLevelBySectionID = async sectionID => {
  return await Section.findOne({ where: { sectionID } }).then(section => {
    if (section) {
      return section.gradeLevel;
    } else {
      return "";
    }
  });
};

exports.getSYID = async schoolYear => {
  return await SchoolYear.findOne({ where: { schoolYear } }).then(sy => {
    if (sy) return sy.schoolYearID;
    else return 0;
  });
};

const getActiveSY = async () => {
  return await SchoolYear.findOne({ where: { isActive: 1 } }).then(
    schoolYear => {
      if (schoolYear) return schoolYear.schoolYearID;
      else return 0;
    }
  );
};

exports.getPastSY = async () => {
  let currSyID = await getActiveSY();
  let currSy = await getSYname(currSyID);
  return (
    (parseInt(currSy.slice(0, 4)) - 1).toString() +
    "-" +
    (parseInt(currSy.slice(5, 9)) - 1).toString()
  );
};

exports.getSYname = async schoolYearID => {
  return await SchoolYear.findOne({ where: { schoolYearID } }).then(
    schoolYear => {
      if (schoolYear) return schoolYear.schoolYear;
      else return "";
    }
  );
};

const getSYname = async schoolYearID => {
  return await SchoolYear.findOne({ where: { schoolYearID } }).then(
    schoolYear => {
      if (schoolYear) return schoolYear.schoolYear;
      else return "";
    }
  );
};

exports.getStudentID = async accountID => {
  return await Student.findOne({ where: { accountID } }).then(student => {
    if (student) return student.studentID;
    else return "";
  });
};

exports.getTeacherID = async accountID => {
  return await Teacher.findOne({ where: { accountID } }).then(teacher => {
    if (teacher) return teacher.teacherID;
    else return "";
  });
};

exports.getStudentsIDByKeyword = async keyword => {
  return await UserAccount.findAll({
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
  }).then(async students => {
    if (students.length == 0) {
      return [];
    } else {
      var i = 0;
      let studarr = [];
      for (i = 0; i < students.length; i++) {
        const studentID = await this.getStudentID(students[i].accountID);
        studarr.push(studentID);
      }
      return studarr;
    }
  });
};

exports.getStudentNameByStudsectID = async studsectID => {
  return await StudentSection.findOne({ where: { studsectID } }).then(
    async studentsection => {
      if (studentsection) {
        return await this.getStudentName(studentsection.studentID);
      } else {
        return "";
      }
    }
  );
};

exports.getStudentEmailByStudsectID = async studsectID => {
  return await StudentSection.findOne({ where: { studsectID } }).then(
    async studentsection => {
      if (studentsection) {
        return await this.getStudentEmail(studentsection.studentID);
      } else {
        return "";
      }
    }
  );
};

exports.getStudentImageUrlByStudsectID = async studsectID => {
  return await StudentSection.findOne({ where: { studsectID } }).then(
    async studentsection => {
      if (studentsection) {
        return await this.getStudentImageUrl(studentsection.studentID);
      } else {
        return "";
      }
    }
  );
};

exports.getSectionNameByStudsectID = async studsectID => {
  return await StudentSection.findOne({ where: { studsectID } }).then(
    async studentsection => {
      if (studentsection) {
        return await this.getSectionName(studentsection.sectionID);
      } else {
        return "";
      }
    }
  );
};

exports.getSectionGradeLevelByStudsectID = async studsectID => {
  return await StudentSection.findOne({ where: { studsectID } }).then(
    async studentsection => {
      if (studentsection) {
        return await this.getSectionGradeLevel(studentsection.sectionID);
      } else {
        return "";
      }
    }
  );
};

exports.getStudentNameBySubsectstudID = async subsectstudID => {
  return await SubjectSectionStudent.findOne({ where: { subsectstudID } }).then(
    async subsectstud => {
      if (subsectstud) {
        return await StudentSection.findOne({
          where: { studsectID: subsectstud.studsectID }
        }).then(async studsect => {
          if (studsect) {
            return await this.getStudentName(studsect.studentID);
          } else {
            return "";
          }
        });
      } else {
        return "";
      }
    }
  );
};

exports.getComponentName = async componentID => {
  return await Component.findOne({ where: { componentID } }).then(
    async comp => {
      if (comp) {
        return comp.component == "FA"
          ? "Formative Assessment"
          : comp.component == "WW"
          ? "Written Works"
          : comp.component == "PT"
          ? "Performance Task"
          : comp.component == "QE"
          ? "Quarterly Exam"
          : "";
      } else {
        return "";
      }
    }
  );
};

exports.getSubcomponentName = async subcompID => {
  return await Subcomponent.findOne({ where: { subcompID } }).then(
    async subcomp => {
      if (subcomp) {
        return subcomp.name;
      } else {
        return "";
      }
    }
  );
};

exports.getStudentImageUrlBySubsectstudID = async subsectstudID => {
  return await SubjectSectionStudent.findOne({ where: { subsectstudID } }).then(
    async subsectstud => {
      if (subsectstud) {
        return await StudentSection.findOne({
          where: { studsectID: subsectstud.studsectID }
        }).then(async studsect => {
          if (studsect) {
            return await this.getStudentImageUrl(studsect.studentID);
          } else {
            return "";
          }
        });
      } else {
        return "";
      }
    }
  );
};

exports.getSubcompWsBySubsectstudIDAndSubcompIDAndQuarter = async ({
  subcompID,
  subsectstudID,
  quarter
}) => {
  return await Grade.findAll({
    where: { subcomponentID: subcompID, subsectstudID, quarter }
  }).then(async grades => {
    if (grades.length == 0) {
      return -1;
    } else {
      let score = 0;
      let i = 0;
      let total = 0;
      let ps = 0;
      for (i = 0; i < grades.length; i++) {
        const name = await this.getStudentNameBySubsectstudID(subsectstudID);
        const subcompname = await this.getSubcomponentName(subcompID);
        score = score + parseFloat(grades[i].score);
        total = total + parseFloat(grades[i].total);
      }

      if (grades.length != 0) {
        ps = (score / total) * 100;
      }
      return ps;
    }
  });
};

exports.refreshStudentWeightedScoreBySubsectID = async subsectID => {
  const { subjectID, classRecordID } = await SubjectSection.findOne({
    where: { subsectID }
  }).then(subsect => {
    if (subsect) {
      const { subjectID, classRecordID } = subsect;
      return { subjectID, classRecordID };
    } else {
      return -1;
    }
  });
  return await SubjectSectionStudent.findAll({ where: { subsectID } }).then(
    async subsectstud => {
      if (subsectstud.length == 0) {
        return false;
      } else {
        let q = ["Q1", "Q2", "Q3", "Q4"];
        let subsectstudIDs = [];
        let i = 0;
        for (i = 0; i < subsectstud.length; i++) {
          let { subsectstudID } = subsectstud[i];
          subsectstudIDs.push(subsectstudID);
        }
        Component.findOne({
          where: { subjectID, component: "FA" }
        }).then(async comp1 => {
          if (comp1) {
            Component.findOne({
              where: { subjectID, component: "WW" }
            }).then(async comp2 => {
              if (comp2) {
                Component.findOne({
                  where: { subjectID, component: "PT" }
                }).then(async comp3 => {
                  if (comp3) {
                    Component.findOne({
                      where: { subjectID, component: "QE" }
                    }).then(async comp4 => {
                      if (comp4) {
                        //Refreshing all FA records
                        await Subcomponent.findAll({
                          where: {
                            componentID: comp1.componentID,
                            classRecordID
                          }
                        }).then(async fasc => {
                          if (fasc.length != 0) {
                            for (const [
                              index3,
                              value3
                            ] of subsectstudIDs.entries()) {
                              for (const [index2, value2] of q.entries()) {
                                let faData = [];
                                let hasNegativeOne = false;
                                for (const [index, value] of fasc.entries()) {
                                  if (value.quarter == value2) {
                                    const { compWeight } = value;
                                    const ws = await this.getSubcompWsBySubsectstudIDAndSubcompIDAndQuarter(
                                      {
                                        subcompID: value.subcompID,
                                        subsectstudID: value3,
                                        quarter: value2
                                      }
                                    );
                                    if (ws == -1) {
                                      if (parseFloat(compWeight) != 0)
                                        hasNegativeOne = true;
                                    }
                                    faData.push({ compWeight, ws });
                                  }
                                }
                                if (!hasNegativeOne) {
                                  let sum = 0;
                                  for (const [
                                    index,
                                    value4
                                  ] of faData.entries()) {
                                    sum =
                                      sum +
                                      (parseFloat(value4.compWeight) / 100) *
                                        parseFloat(value4.ws);
                                  }
                                  StudentWeightedScore.findOne({
                                    where: {
                                      subsectstudID: value3,
                                      quarter: value2,
                                      classRecordID
                                    }
                                  }).then(async sws => {
                                    if (sws) {
                                      sws
                                        .update({
                                          faWS: sum
                                        })
                                        .then(async () => {});
                                    }
                                  });
                                } else {
                                  StudentWeightedScore.findOne({
                                    where: {
                                      subsectstudID: value3,
                                      quarter: value2,
                                      classRecordID
                                    }
                                  }).then(async sws => {
                                    if (sws) {
                                      sws
                                        .update({
                                          faWS: -1
                                        })
                                        .then(async () => {});
                                    }
                                  });
                                }
                              }
                            }
                          }
                        });

                        //Refreshing all WW records
                        await Subcomponent.findAll({
                          where: {
                            componentID: comp2.componentID,
                            classRecordID
                          }
                        }).then(async wwsc => {
                          if (wwsc.length != 0) {
                            for (const [
                              index3,
                              value3
                            ] of subsectstudIDs.entries()) {
                              for (const [index2, value2] of q.entries()) {
                                let wwData = [];
                                let hasNegativeOne = false;
                                for (const [index, value] of wwsc.entries()) {
                                  if (value.quarter == value2) {
                                    const { compWeight } = value;
                                    const ws = await this.getSubcompWsBySubsectstudIDAndSubcompIDAndQuarter(
                                      {
                                        subcompID: value.subcompID,
                                        subsectstudID: value3,
                                        quarter: value2
                                      }
                                    );
                                    if (ws == -1) {
                                      if (parseFloat(compWeight) != 0)
                                        hasNegativeOne = true;
                                    }
                                    wwData.push({ compWeight, ws });
                                  }
                                }
                                if (!hasNegativeOne) {
                                  let sum = 0;
                                  for (const [
                                    index,
                                    value4
                                  ] of wwData.entries()) {
                                    sum =
                                      sum +
                                      (parseFloat(value4.compWeight) / 100) *
                                        parseFloat(value4.ws);
                                  }
                                  StudentWeightedScore.findOne({
                                    where: {
                                      subsectstudID: value3,
                                      quarter: value2,
                                      classRecordID
                                    }
                                  }).then(async sws => {
                                    if (sws) {
                                      sws
                                        .update({
                                          wwWS: sum
                                        })
                                        .then(async () => {});
                                    }
                                  });
                                } else {
                                  StudentWeightedScore.findOne({
                                    where: {
                                      subsectstudID: value3,
                                      quarter: value2,
                                      classRecordID
                                    }
                                  }).then(async sws => {
                                    if (sws) {
                                      sws
                                        .update({
                                          wwWS: -1
                                        })
                                        .then(async () => {});
                                    }
                                  });
                                }
                              }
                            }
                          }
                        });

                        //Refreshing all PT records
                        await Subcomponent.findAll({
                          where: {
                            componentID: comp3.componentID,
                            classRecordID
                          }
                        }).then(async ptsc => {
                          if (ptsc.length != 0) {
                            for (const [
                              index3,
                              value3
                            ] of subsectstudIDs.entries()) {
                              for (const [index2, value2] of q.entries()) {
                                let ptdata = [];
                                let hasNegativeOne = false;
                                for (const [index, value] of ptsc.entries()) {
                                  if (value.quarter == value2) {
                                    const { compWeight } = value;
                                    const ws = await this.getSubcompWsBySubsectstudIDAndSubcompIDAndQuarter(
                                      {
                                        subcompID: value.subcompID,
                                        subsectstudID: value3,
                                        quarter: value2
                                      }
                                    );
                                    if (ws == -1) {
                                      if (parseFloat(compWeight) != 0)
                                        hasNegativeOne = true;
                                    }
                                    ptdata.push({ compWeight, ws });
                                  }
                                }
                                if (!hasNegativeOne) {
                                  let sum = 0;
                                  for (const [
                                    index,
                                    value4
                                  ] of ptdata.entries()) {
                                    sum =
                                      sum +
                                      (parseFloat(value4.compWeight) / 100) *
                                        parseFloat(value4.ws);
                                  }
                                  StudentWeightedScore.findOne({
                                    where: {
                                      subsectstudID: value3,
                                      quarter: value2,
                                      classRecordID
                                    }
                                  }).then(async sws => {
                                    if (sws) {
                                      sws
                                        .update({
                                          ptWS: sum
                                        })
                                        .then(async () => {});
                                    }
                                  });
                                } else {
                                  StudentWeightedScore.findOne({
                                    where: {
                                      subsectstudID: value3,
                                      quarter: value2,
                                      classRecordID
                                    }
                                  }).then(async sws => {
                                    if (sws) {
                                      sws
                                        .update({
                                          ptWS: -1
                                        })
                                        .then(async () => {});
                                    }
                                  });
                                }
                              }
                            }
                          }
                        });

                        //Refreshing all QE records
                        await Subcomponent.findAll({
                          where: {
                            componentID: comp4.componentID,
                            classRecordID
                          }
                        }).then(async qesc => {
                          if (qesc.length != 0) {
                            for (const [
                              index3,
                              value3
                            ] of subsectstudIDs.entries()) {
                              for (const [index2, value2] of q.entries()) {
                                let qeData = [];
                                let hasNegativeOne = false;
                                for (const [index, value] of qesc.entries()) {
                                  if (value.quarter == value2) {
                                    const { compWeight } = value;
                                    const ws = await this.getSubcompWsBySubsectstudIDAndSubcompIDAndQuarter(
                                      {
                                        subcompID: value.subcompID,
                                        subsectstudID: value3,
                                        quarter: value2
                                      }
                                    );
                                    if (ws == -1) {
                                      if (parseFloat(compWeight) != 0)
                                        hasNegativeOne = true;
                                    }
                                    qeData.push({ compWeight, ws });
                                  }
                                }
                                if (!hasNegativeOne) {
                                  let sum = 0;
                                  for (const [
                                    index,
                                    value4
                                  ] of qeData.entries()) {
                                    sum =
                                      sum +
                                      (parseFloat(value4.compWeight) / 100) *
                                        parseFloat(value4.ws);
                                  }
                                  StudentWeightedScore.findOne({
                                    where: {
                                      subsectstudID: value3,
                                      quarter: value2,
                                      classRecordID
                                    }
                                  }).then(async sws => {
                                    if (sws) {
                                      sws
                                        .update({
                                          qeWS: sum
                                        })
                                        .then(async () => {});
                                    }
                                  });
                                } else {
                                  StudentWeightedScore.findOne({
                                    where: {
                                      subsectstudID: value3,
                                      quarter: value2,
                                      classRecordID
                                    }
                                  }).then(async sws => {
                                    if (sws) {
                                      sws
                                        .update({
                                          qeWS: -1
                                        })
                                        .then(async () => {});
                                    }
                                  });
                                }
                              }
                            }
                          }
                        });
                        for (const [index5, value5] of q.entries()) {
                          for (const [
                            index6,
                            value6
                          ] of subsectstudIDs.entries()) {
                            StudentWeightedScore.findOne({
                              where: { subsectstudID: value6, quarter: value5 }
                            }).then(async sws2 => {
                              if (sws2) {
                                await this.studentWeightedScoreUpdate(
                                  sws2.weightedScoreID
                                );
                              }
                            });

                            StudentGrades.findOne({
                              where: { subsectstudID: value6 }
                            }).then(async sg => {
                              if (sg) {
                                await this.studentGradesUpdate(
                                  sg.studentGradesID
                                );
                              }
                            });
                          }
                        }
                      } else {
                        res
                          .status(404)
                          .json({ msg: "QE component not found!" });
                      }
                    });
                  } else {
                    res.status(404).json({ msg: "PT component not found!" });
                  }
                });
              } else {
                res.status(404).json({ msg: "WW component not found!" });
              }
            });
          } else {
            res.status(404).json({ msg: "FA component not found!" });
          }
        });
      }
    }
  );
};

exports.getSubjectIDBySubsectstudID = async subsectstudID => {
  return await SubjectSectionStudent.findOne({ where: { subsectstudID } }).then(
    async sss => {
      if (sss) {
        return await SubjectSection.findOne({
          where: { subsectID: sss.subsectID }
        }).then(async ss => {
          if (ss) {
            return ss.subjectID;
          } else {
            return -1;
          }
        });
      } else {
        return -1;
      }
    }
  );
};

exports.studentGradesUpdate = async studentGradesID => {
  return await StudentGrades.findOne({ where: { studentGradesID } }).then(
    async sg => {
      if (sg) {
        const q1Transmutation = await ClassRecord.findOne({
          where: { classRecordID: sg.classRecordID }
        }).then(async cr => {
          if (cr) {
            return cr.q1Transmu;
          }
        });
        const q2Transmutation = await ClassRecord.findOne({
          where: { classRecordID: sg.classRecordID }
        }).then(async cr => {
          if (cr) {
            return cr.q2Transmu;
          }
        });
        const q3Transmutation = await ClassRecord.findOne({
          where: { classRecordID: sg.classRecordID }
        }).then(async cr => {
          if (cr) {
            return cr.q3Transmu;
          }
        });
        const q4Transmutation = await ClassRecord.findOne({
          where: { classRecordID: sg.classRecordID }
        }).then(async cr => {
          if (cr) {
            return cr.q4Transmu;
          }
        });
        const q1TransmuGrade = await StudentWeightedScore.findOne({
          where: {
            classRecordID: sg.classRecordID,
            subsectstudID: sg.subsectstudID,
            quarter: "Q1"
          }
        }).then(async sws => {
          if (sws) {
            switch (q1Transmutation) {
              case "50": {
                return sws.transmutedGrade50;
                break;
              }
              case "55": {
                return sws.transmutedGrade55;
                break;
              }
              case "60": {
                return sws.transmutedGrade60;
                break;
              }
              default:
                break;
            }
          }
        });

        const q2TransmuGrade = await StudentWeightedScore.findOne({
          where: {
            classRecordID: sg.classRecordID,
            subsectstudID: sg.subsectstudID,
            quarter: "Q2"
          }
        }).then(async sws => {
          if (sws) {
            switch (q2Transmutation) {
              case "50": {
                return sws.transmutedGrade50;
                break;
              }
              case "55": {
                return sws.transmutedGrade55;
                break;
              }
              case "60": {
                return sws.transmutedGrade60;
                break;
              }
              default:
                break;
            }
          }
        });

        const q3TransmuGrade = await StudentWeightedScore.findOne({
          where: {
            classRecordID: sg.classRecordID,
            subsectstudID: sg.subsectstudID,
            quarter: "Q3"
          }
        }).then(async sws => {
          if (sws) {
            switch (q3Transmutation) {
              case "50": {
                return sws.transmutedGrade50;
                break;
              }
              case "55": {
                return sws.transmutedGrade55;
                break;
              }
              case "60": {
                return sws.transmutedGrade60;
                break;
              }
              default:
                break;
            }
          }
        });

        const q4TransmuGrade = await StudentWeightedScore.findOne({
          where: {
            classRecordID: sg.classRecordID,
            subsectstudID: sg.subsectstudID,
            quarter: "Q4"
          }
        }).then(async sws => {
          if (sws) {
            switch (q4Transmutation) {
              case "50": {
                return sws.transmutedGrade50;
                break;
              }
              case "55": {
                return sws.transmutedGrade55;
                break;
              }
              case "60": {
                return sws.transmutedGrade60;
                break;
              }
              default:
                break;
            }
          }
        });

        if (parseFloat(q1TransmuGrade) != -1) {
          await sg.update({ q1FinalGrade: Math.round(parseFloat(q1TransmuGrade)) });
        } else {
          await sg.update({ q1FinalGrade: -1 });
        }

        if (parseFloat(q2TransmuGrade) != -1) {
          await sg.update({ q2FinalGrade: Math.round(parseFloat(q2TransmuGrade)) });
        } else {
          await sg.update({ q2FinalGrade: -1 });
        }

        if (parseFloat(q3TransmuGrade) != -1) {
          await sg.update({ q3FinalGrade: Math.round(parseFloat(q3TransmuGrade)) });
        } else {
          await sg.update({ q3FinalGrade: -1 });
        }

        if (parseFloat(q4TransmuGrade) != -1) {
          await sg.update({ q4FinalGrade: Math.round(parseFloat(q4TransmuGrade)) });
        } else {
          await sg.update({ q4FinalGrade: -1 });
        }

        if (
          parseFloat(q1TransmuGrade) != -1 &&
          parseFloat(q2TransmuGrade) != -1 &&
          parseFloat(q3TransmuGrade) != -1 &&
          parseFloat(q4TransmuGrade) != -1
        ) {
          let ave =
            (parseFloat(q1TransmuGrade) +
              parseFloat(q2TransmuGrade) +
              parseFloat(q3TransmuGrade) +
              parseFloat(q4TransmuGrade)) /
            4;
          await sg.update({ ave });
        } else {
          await sg.update({ ave: -1 });
        }
      }
    }
  );
};

exports.studentWeightedScoreUpdate = async weightedScoreID => {
  return await StudentWeightedScore.findOne({
    where: { weightedScoreID }
  }).then(async sws => {
    if (sws) {
      const subjectID = await this.getSubjectIDBySubsectstudID(
        sws.subsectstudID
      );
      Component.findAll({ where: { subjectID } }).then(async comps => {
        if (comps.length != 0) {
          let data = [];
          let hasNegativeOne =
            sws.wwWS == -1 || sws.ptWS == -1 || sws.qeWS == -1;
          for (const [index, value] of comps.entries()) {
            const { component, compWeight } = value;
            data.push({ component, compWeight });
          }
          let sum = 0;
          for (const [index2, value2] of data.entries()) {
            switch (value2.component) {
              case "FA": {
                sum =
                  sum +
                  (parseFloat(sws.faWS) * parseFloat(value2.compWeight)) / 100;
                break;
              }
              case "WW": {
                sum =
                  sum +
                  (parseFloat(sws.wwWS) * parseFloat(value2.compWeight)) / 100;
                break;
              }
              case "PT": {
                sum =
                  sum +
                  (parseFloat(sws.ptWS) * parseFloat(value2.compWeight)) / 100;
                break;
              }
              case "QE": {
                sum =
                  sum +
                  (parseFloat(sws.qeWS) * parseFloat(value2.compWeight)) / 100;
                break;
              }
              default:
                break;
            }
          }
          if (!hasNegativeOne) {
            await sws.update({
              actualGrade: sum
            });
          } else {
            await sws.update({ actualGrade: -1 });
          }

          let transmuGrade50 =
            75 +
            (parseFloat(sws.actualGrade) - parseFloat(50)) /
              ((100-parseFloat(50)) / 25);
          let transmuGrade55 =
            75 +
            (parseFloat(sws.actualGrade) - parseFloat(55)) /
              ((100-(parseFloat(55))) / 25);
          let transmuGrade60 =
            75 +
            (parseFloat(sws.actualGrade) - parseFloat(60)) /
              ((100-parseFloat(60)) / 25);

          if (sws.actualGrade != -1) {
            await sws.update({ transmutedGrade50: transmuGrade50 });
            await sws.update({ transmutedGrade55: transmuGrade55 });
            await sws.update({ transmutedGrade60: transmuGrade60 });
          } else {
            await sws.update({ transmutedGrade50: -1 });
            await sws.update({ transmutedGrade55: -1 });
            await sws.update({ transmutedGrade60: -1 });
          }
        }
      });
    }
  });
};
