const UserAccount = require("../models/UserAccount");
const Nonacademic = require("../models/Nonacademic");
const SchoolYear = require("../models/SchoolYear");
const Section = require("../models/Section");
const Student = require("../models/Student");
const StudentSection = require("../models/StudentSection");
const SubjectSection = require("../models/SubjectSection");
const SubjectSectionStudent = require("../models/SubjectSectionStudent");
const StudentWeightedScore = require("../models/StudentWeightedScore");
const StudentSubjectGrades = require("../models/StudentSubjectGrades");
const ClassRecord = require("../models/ClassRecord");
const Component = require("../models/Component");
const Subcomponent = require("../models/Subcomponent");
const TeacherSection = require("../models/TeacherSection");
const Teacher = require("../models/Teacher");
const Sequelize = require("sequelize");
const Subject = require("../models/Subject");
const Grade = require("../models/Grade");
const ClassRecordStatus = require("../models/ClassRecordStatus");
const StudentGrades = require("../models/StudentGrades");
const StudentFinalGrade = require("../models/StudentFinalGrade");
const AccountNotice = require('../models/AccountNotice')
const logo = require("../assets/pdf/logo");
const Op = Sequelize.Op;

// Utility Functions
exports.getPHTime = function(date = "") {
  const d = date === "" ? new Date() : new Date(date);
  const localOffset = d.getTimezoneOffset() * 60000;
  const UTC = d.getTime() + localOffset;
  const PHT = UTC + 3600000 * 16;
  return new Date(PHT);
};

exports.createUser = async({
  email,
  password,
  isActive,
  position
}) => {
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

exports.getSubjectNameBySubsectstudID = async subsectstudID => {
  return await SubjectSectionStudent.findOne({
    where: {
      subsectstudID
    }
  }).then(
    async sss => {
      return await SubjectSection.findOne({
        where: {
          subsectID: sss.subsectID
        }
      }).then(async ss => {
        return await this.getSubjectName(ss.subjectID);
      });
    }
  );
};

exports.getStudentSexByStudentId = async studentID => {
  return await Student.findOne({
    where: {
      studentID
    }
  }).then(async student => {
    return await UserAccount.findOne({
      where: {
        accountID: student.accountID
      }
    }).then(user => {
      return user.sex;
    });
  });
};

exports.createNonAcademic = async({
  accountID
}) => {
  return await Nonacademic.create({
    accountID
  });
};

exports.capitalize = string => {
  return string;
};

const capitalize = string => {
  return string;
};

exports.getAccountName = async accountID => {
  return await UserAccount.findOne({
    where: {
      accountID
    }
  }).then(user => {
    return `${capitalize(user.lastName)}, ${capitalize(
      user.firstName
    )} ${user.middleName.charAt(0).toUpperCase()}.`;
  });
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
      return `${capitalize(user.lastName)}, ${capitalize(
        user.firstName
      )} ${user.middleName.charAt(0).toUpperCase()}.`;
    });
  });
};

exports.getAccountIDBySubsectstudID = async subsectstudID => {
  return await SubjectSectionStudent.findOne({
    where: {
      subsectstudID
    }
  }).then(
    async ss => {
      if (ss) {
        return await StudentSection.findOne({
          where: {
            studsectID: ss.studsectID
          }
        }).then(async ss => {
          if (ss) {
            return await Student.findOne({
              where: {
                studentID: ss.studentID
              }
            }).then(async s => {
              if (s) {
                return s.accountID;
              }
            });
          }
        });
      }
    }
  );
};

exports.getNonacademicName = async facultyID => {
  return await Nonacademic.findOne({
    where: {
      facultyID
    }
  }).then(
    nonacademic => {
      return UserAccount.findOne({
        where: {
          accountID: nonacademic.accountID
        }
      }).then(user => {
        return `${capitalize(user.lastName)}, ${capitalize(
          user.firstName
        )} ${user.middleName.charAt(0).toUpperCase()}.`;
      });
    }
  );
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
      return `${capitalize(user.lastName)}, ${capitalize(
        user.firstName
      )} ${user.middleName.charAt(0).toUpperCase()}.`;
    });
  });
};

exports.getStudentEmail = async studentID => {
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
  return await Subject.findOne({
    where: {
      subjectID
    }
  }).then(subject => {
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

exports.getActiveSY = async() => {
  return await SchoolYear.findOne({
    where: {
      isActive: 1
    }
  }).then(
    schoolYear => {
      if (schoolYear) {
        const {
          schoolYearID,
          quarter
        } = schoolYear;
        return {
          schoolYearID,
          quarter
        };
      } else return {
        schoolYearID: 0,
        quarter: "Q1"
      };
    }
  );
};

exports.getStudentSectionBySYAndSectionID = async({
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
      [Op.or]: [{
        firstName: {
          [Op.like]: `%${keyword}%`
        }
      }, {
        lastName: {
          [Op.like]: `%${keyword}%`
        }
      }]
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
      where: {
        sectionID,
        schoolYearID,
        studentID: studentIDs
      }
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
          data.push({
            sectionName,
            studentName,
            studentID,
            email,
            imageUrl
          });
        }
        await StudentSection.findAndCountAll({
          where: {
            sectionID,
            schoolYearID,
            studentID: studentIDs
          }
        }).then(count => {
          data.sort((a, b) => (a.studentName > b.studentName ? 1 : -1));
          numOfPages = Math.ceil(count.count / pageSize);
        });
        return {
          studentData: data,
          numOfPages
        };
      } else {
        return {
          studentData: [],
          numOfPages: 1
        };
      }
    })
    .catch(err => {
      return {
        studentData: [],
        numOfPages: 1
      };
    });
};

exports.getSectionsIDByGradeLevel = async gradeLevel => {
  return await Section.findAll({
    where: {
      gradeLevel
    }
  }).then(
    async sections => {
      if (sections.length == 0) {
        return [];
      } else {
        let sectionData = [];
        await sections.forEach(async(section, key, arr) => {
          sectionData.push(section.sectionID);
        });
        return sectionData;
      }
    }
  );
};

exports.getStudentImageUrl = async studentID => {
  return await Student.findOne({
    where: {
      studentID
    }
  }).then(async student => {
    if (student) {
      return await UserAccount.findOne({
        where: {
          accountID: student.accountID
        }
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

exports.getTeacherSectionBySchoolYearID = async schoolYearID => {
  return await TeacherSection.findAll({
    where: {
      schoolYearID
    }
  }).then(
    async advisers => {
      if (advisers.length == 0) {
        return [];
      } else {
        let advisersData = [];
        await advisers.forEach(async(adviser, key, arr) => {
          let sectionID = adviser.sectionID;
          let teacherName = await this.getTeacherName(adviser.teacherID);
          let teacherID = adviser.teacherID;
          advisersData.push({
            sectionID,
            teacherName,
            teacherID
          });
        });
        return advisersData;
      }
    }
  );
};

exports.getSectionsID = async({
  limit,
  offset,
  keyword
}) => {
  return await Section.findAll({
    limit,
    offset,
    where: {
      archived: 0,
      sectionName: {
        [Op.like]: `%${keyword}%`
      }
    }
  }).then(async sections => {
    if (sections.length == 0) {
      return [];
    } else {
      let sectionData = [];
      await sections.forEach(async(section, key, arr) => {
        sectionData.push(section.sectionID);
      });
      return sectionData;
    }
  });
};

exports.getGradeLevelBySectionID = async sectionID => {
  return await Section.findOne({
    where: {
      sectionID
    }
  }).then(section => {
    if (section) {
      return section.gradeLevel;
    } else {
      return "";
    }
  });
};

exports.getSYID = async schoolYear => {
  return await SchoolYear.findOne({
    where: {
      schoolYear
    }
  }).then(sy => {
    if (sy) return sy.schoolYearID;
    else return 0;
  });
};

const getActiveSY = async() => {
  return await SchoolYear.findOne({
    where: {
      isActive: 1
    }
  }).then(
    schoolYear => {
      if (schoolYear) return schoolYear.schoolYearID;
      else return 0;
    }
  );
};

exports.getPastSY = async() => {
  let currSyID = await getActiveSY();
  let currSy = await getSYname(currSyID);
  return (
    (parseInt(currSy.slice(0, 4)) - 1).toString() +
    "-" +
    (parseInt(currSy.slice(5, 9)) - 1).toString()
  );
};

exports.getSYname = async schoolYearID => {
  return await SchoolYear.findOne({
    where: {
      schoolYearID
    }
  }).then(
    schoolYear => {
      if (schoolYear) return schoolYear.schoolYear;
      else return "";
    }
  );
};

const getSYname = async schoolYearID => {
  return await SchoolYear.findOne({
    where: {
      schoolYearID
    }
  }).then(
    schoolYear => {
      if (schoolYear) return schoolYear.schoolYear;
      else return "";
    }
  );
};

exports.getStudentID = async accountID => {
  return await Student.findOne({
    where: {
      accountID
    }
  }).then(student => {
    if (student) return student.studentID;
    else return "";
  });
};

exports.getTeacherID = async accountID => {
  return await Teacher.findOne({
    where: {
      accountID
    }
  }).then(teacher => {
    if (teacher) return teacher.teacherID;
    else return "";
  });
};

exports.getStudentsIDByKeyword = async keyword => {
  return await UserAccount.findAll({
    where: {
      position: 4,
      [Op.or]: [{
        firstName: {
          [Op.like]: `%${keyword}%`
        }
      }, {
        lastName: {
          [Op.like]: `%${keyword}%`
        }
      }]
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
  return await StudentSection.findOne({
    where: {
      studsectID
    }
  }).then(
    async studentsection => {
      if (studentsection) {
        return await this.getStudentName(studentsection.studentID);
      } else {
        return "";
      }
    }
  );
};

exports.getStudentSexBySubsectstudID = async subsectstudID => {
  return await SubjectSectionStudent.findOne({
    where: {
      subsectstudID
    }
  }).then(
    async sss => {
      return await this.getStudentSexByStudsectID(sss.studsectID);
    }
  );
};

exports.getStudentSexByStudsectID = async studsectID => {
  return await StudentSection.findOne({
    where: {
      studsectID
    }
  }).then(
    async studentsection => {
      if (studentsection) {
        return await this.getStudentSexByStudentId(studentsection.studentID);
      } else {
        return "";
      }
    }
  );
};

exports.getStudentEmailByStudsectID = async studsectID => {
  return await StudentSection.findOne({
    where: {
      studsectID
    }
  }).then(
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
  return await StudentSection.findOne({
    where: {
      studsectID
    }
  }).then(
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
  return await StudentSection.findOne({
    where: {
      studsectID
    }
  }).then(
    async studentsection => {
      if (studentsection) {
        return await this.getSectionName(studentsection.sectionID);
      } else {
        return "";
      }
    }
  );
};

exports.getAccountNoticeByAccountID = async accountID => {
  return await AccountNotice.findOne({
    where: {
      accountID
    }
  }).then(an => an.message)
}

exports.getSectionGradeLevelByStudsectID = async studsectID => {
  return await StudentSection.findOne({
    where: {
      studsectID
    }
  }).then(
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
  return await SubjectSectionStudent.findOne({
    where: {
      subsectstudID
    }
  }).then(
    async subsectstud => {
      if (subsectstud) {
        return await StudentSection.findOne({
          where: {
            studsectID: subsectstud.studsectID
          }
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
  return await Component.findOne({
    where: {
      componentID
    }
  }).then(
    async comp => {
      if (comp) {
        return comp.component == "FA" ?
          "Formative Assessment" :
          comp.component == "WW" ?
          "Written Works" :
          comp.component == "PT" ?
          "Performance Task" :
          comp.component == "QE" ?
          "Quarterly Exam" :
          "";
      } else {
        return "";
      }
    }
  );
};

exports.getSubcomponentName = async subcompID => {
  return await Subcomponent.findOne({
    where: {
      subcompID
    }
  }).then(
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
  return await SubjectSectionStudent.findOne({
    where: {
      subsectstudID
    }
  }).then(
    async subsectstud => {
      if (subsectstud) {
        return await StudentSection.findOne({
          where: {
            studsectID: subsectstud.studsectID
          }
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

exports.getSubcompWsBySubsectstudIDAndSubcompIDAndQuarter = async({
  subcompID,
  subsectstudID,
  quarter
}) => {
  return await Grade.findAll({
    where: {
      subcomponentID: subcompID,
      subsectstudID,
      quarter
    }
  }).then(async grades => {
    if (grades.length == 0) {
      return -1;
    } else {
      let score = 0;
      let i = 0;
      let total = 0;
      let ps = 0;
      let excused = 0;
      for (i = 0; i < grades.length; i++) {
        if (grades[i].attendance == "E") {
          excused = excused + 1;
        } else if (grades[i].attendance == "A") {
          score = score + 0;
          total = total + parseFloat(grades[i].total);
        } else {
          score = score + parseFloat(grades[i].score);
          total = total + parseFloat(grades[i].total);
        }
      }
      if (grades.length != 0) {
        if (grades.length == excused) {
          ps = -1;
        } else {
          ps = (score / total) * 100;
        }
      }
      return ps;
    }
  });
};

exports.refreshStudentWeightedScoreBySubsectID = async subsectID => {
  const {
    subjectID,
    classRecordID,
    subjectType
  } = await SubjectSection.findOne({
    where: {
      subsectID
    }
  }).then(subsect => {
    if (subsect) {
      const {
        subjectID,
        classRecordID,
        subjectType
      } = subsect;
      return {
        subjectID,
        classRecordID,
        subjectType
      };
    } else {
      return -1;
    }
  });
  return await SubjectSectionStudent.findAll({
    where: {
      subsectID
    }
  }).then(
    async subsectstud => {
      if (subsectstud.length == 0) {
        return false;
      } else {
        let q =
          subjectType == "NON_SHS" ? ["Q1", "Q2", "Q3", "Q4"] : ["Q1", "Q2"];
        let subsectstudIDs = [];
        let i = 0;
        for (i = 0; i < subsectstud.length; i++) {
          let {
            subsectstudID
          } = subsectstud[i];
          subsectstudIDs.push(subsectstudID);
        }
        Component.findOne({
          where: {
            subjectID,
            component: "FA"
          }
        }).then(async comp1 => {
          if (comp1) {
            Component.findOne({
              where: {
                subjectID,
                component: "WW"
              }
            }).then(async comp2 => {
              if (comp2) {
                Component.findOne({
                  where: {
                    subjectID,
                    component: "PT"
                  }
                }).then(async comp3 => {
                  if (comp3) {
                    Component.findOne({
                      where: {
                        subjectID,
                        component: "QE"
                      }
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
                                    const {
                                      compWeight
                                    } = value;
                                    const ws = await this.getSubcompWsBySubsectstudIDAndSubcompIDAndQuarter({
                                      subcompID: value.subcompID,
                                      subsectstudID: value3,
                                      quarter: value2
                                    });
                                    if (ws == -1) {
                                      if (parseFloat(compWeight) != 0)
                                        hasNegativeOne = true;
                                    }
                                    faData.push({
                                      compWeight,
                                      ws
                                    });
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
                                        .then(async() => {});
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
                                        .then(async() => {});
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
                                    const {
                                      compWeight
                                    } = value;
                                    const ws = await this.getSubcompWsBySubsectstudIDAndSubcompIDAndQuarter({
                                      subcompID: value.subcompID,
                                      subsectstudID: value3,
                                      quarter: value2
                                    });
                                    if (ws == -1) {
                                      if (parseFloat(compWeight) != 0)
                                        hasNegativeOne = true;
                                    }
                                    wwData.push({
                                      compWeight,
                                      ws
                                    });
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
                                        .then(async() => {});
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
                                        .then(async() => {});
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
                                    const {
                                      compWeight
                                    } = value;
                                    const ws = await this.getSubcompWsBySubsectstudIDAndSubcompIDAndQuarter({
                                      subcompID: value.subcompID,
                                      subsectstudID: value3,
                                      quarter: value2
                                    });
                                    if (ws == -1) {
                                      if (parseFloat(compWeight) != 0)
                                        hasNegativeOne = true;
                                    }
                                    ptdata.push({
                                      compWeight,
                                      ws
                                    });
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
                                        .then(async() => {});
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
                                        .then(async() => {});
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
                                    const {
                                      compWeight
                                    } = value;
                                    const ws = await this.getSubcompWsBySubsectstudIDAndSubcompIDAndQuarter({
                                      subcompID: value.subcompID,
                                      subsectstudID: value3,
                                      quarter: value2
                                    });
                                    if (ws == -1) {
                                      if (parseFloat(compWeight) != 0)
                                        hasNegativeOne = true;
                                    }
                                    qeData.push({
                                      compWeight,
                                      ws
                                    });
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
                                        .then(async() => {});
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
                                        .then(async() => {});
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
                            await StudentWeightedScore.findOne({
                              where: {
                                subsectstudID: value6,
                                quarter: value5
                              }
                            }).then(async sws2 => {
                              if (sws2) {
                                await this.studentWeightedScoreUpdate(
                                  sws2.weightedScoreID
                                );
                              }
                            });

                            await StudentSubjectGrades.findOne({
                              where: {
                                subsectstudID: value6
                              }
                            }).then(async sg => {
                              if (sg) {
                                await this.studentGradesUpdate(
                                  sg.studsubjgradesID,
                                  subjectType
                                );
                              }
                            });
                          }
                        }
                      } else {
                        res
                          .status(404)
                          .json({
                            msg: "QE component not found!"
                          });
                      }
                    });
                  } else {
                    res.status(404).json({
                      msg: "PT component not found!"
                    });
                  }
                });
              } else {
                res.status(404).json({
                  msg: "WW component not found!"
                });
              }
            });
          } else {
            res.status(404).json({
              msg: "FA component not found!"
            });
          }
        });
      }
    }
  );
};

exports.formatCondensedDeliberationGrade = data => {
  let flags = [],
    flags2 = [],
    name = [],
    subjectName = [],
    output = [];
  for (const [i, v] of data.entries()) {
    for (const [i2, v2] of v.entries()) {
      if (flags[v2.name]) continue;
      flags[v2.name] = true;
      name.push(v2.name);
    }
    for (const [i2, v2] of v.entries()) {
      if (flags2[v2.subjectName]) continue;
      flags2[v2.subjectName] = true;
      subjectName.push(v2.subjectName);
    }
  }
  for (const [i, v] of name.entries()) {
    let name = v,
      grades = [];
    let temparr = data.find(a => a[0].name == v);
    let studsectID = temparr[0].studsectID;
    let sex = temparr[0].sex;
    let studentID = temparr[0].studentID;
    let imageUrl = temparr[0].imageUrl;
    for (const [i2, v2] of subjectName.entries()) {
      let grade =
        typeof temparr.find(a => a.subjectName == v2) === "undefined" ?
        "N/A" :
        temparr.find(a => a.subjectName == v2).score;
      grades.push({
        subjectName: v2,
        grade
      });
    }
    output.push({
      imageUrl,
      studentID,
      sex,
      name,
      grades,
      studsectID
    });
  }
  output.sort((a, b) => (a.name > b.name ? 1 : -1));
  return {
    data: output,
    columns: subjectName
  };
};

exports.refreshStudentGradesBySubsectID = async subsectID => {
  await SubjectSectionStudent.findAll({
    where: {
      subsectID
    }
  }).then(async sss => {
    if (sss) {
      sss.forEach(async(x, k, r) => {
        for (const [index, q] of["Q1", "Q2", "Q3", "Q4"].entries()) {
          const grades = await SubjectSectionStudent.findAll({
            where: {
              studsectID: x.studsectID
            }
          }).then(async sss2 => {
            if (sss2) {
              let data2 = [];
              for (const [i, v] of sss2.entries()) {
                let {
                  subjectType,
                  classRecordID
                } = await SubjectSection.findOne({
                  where: {
                    subsectID: v.subsectID
                  }
                }).then(async ss => {
                  if (ss) {
                    return {
                      subjectType: ss.subjectType,
                      classRecordID: ss.classRecordID
                    };
                  }
                });
                let status = await ClassRecordStatus.findOne({
                  where: {
                    classRecordID
                  }
                }).then(async crs => {
                  if (crs) {
                    if (q == "Q1") {
                      if (
                        subjectType == "NON_SHS" ||
                        subjectType == "1ST_SEM"
                      ) {
                        return crs.q1;
                      }
                    } else if (q == "Q2") {
                      if (
                        subjectType == "NON_SHS" ||
                        subjectType == "1ST_SEM"
                      ) {
                        return crs.q2;
                      }
                    } else if (q == "Q3") {
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
                  let score = await StudentSubjectGrades.findOne({
                    where: {
                      classRecordID,
                      subsectstudID: v.subsectstudID
                    }
                  }).then(ssg => {
                    if (ssg) {
                      if (status == "F") {
                        if (q == "Q1") {
                          if (
                            subjectType == "NON_SHS" ||
                            subjectType == "1ST_SEM"
                          ) {
                            return ssg.q1FinalGrade;
                          }
                        } else if (q == "Q2") {
                          if (
                            subjectType == "NON_SHS" ||
                            subjectType == "1ST_SEM"
                          ) {
                            return ssg.q2FinalGrade;
                          }
                        } else if (q == "Q3") {
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
                    }
                  });
                  if (typeof score !== "undefined") {
                    data2.push(score);
                  }
                }
              }
              return data2;
            }
          });
          await StudentGrades.findOne({
            where: {
              studsectID: x.studsectID,
              quarter: q
            }
          }).then(async sg => {
            if (sg) {
              if (grades.length == 0) {
                await sg.update({
                  grade: -1
                });
              } else {
                let av = 0;
                let denom = 0;
                for (const [i2, v2] of grades.entries()) {
                  if (v2 != -1) {
                    denom = denom + 1;
                    av = av + parseFloat(v2);
                  }
                }
                if (denom != 0) {
                  av = parseFloat(av / denom);
                  await sg.update({
                    grade: av
                  });
                } else {
                  await sg.update({
                    grade: -1
                  });
                }
              }
            }
          });
        }

        await StudentGrades.findAll({
          where: {
            studsectID: x.studsectID
          }
        }).then(async sg2 => {
          if (sg2) {
            let invalid = false;
            let sum = 0;
            for (const [index, value] of sg2.entries()) {
              if (value.grade == -1) {
                invalid = true;
              } else {
                sum = sum + parseFloat(value.grade);
              }
            }
            await StudentFinalGrade.findOne({
              where: {
                studsectID: x.studsectID
              }
            }).then(async sfg => {
              if (sfg) {
                if (!invalid) {
                  let ave = parseFloat(sum / 4);
                  await sfg.update({
                    grade: ave
                  });
                } else {
                  await sfg.update({
                    grade: -1
                  });
                }
              }
            });
          }
        });
      });
    }
  });
};
exports.getSubjectIDBySubsectstudID = async subsectstudID => {
  return await SubjectSectionStudent.findOne({
    where: {
      subsectstudID
    }
  }).then(
    async sss => {
      if (sss) {
        return await SubjectSection.findOne({
          where: {
            subsectID: sss.subsectID
          }
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

exports.studentGradesUpdate = async(studsubjgradesID, subjectType) => {
  return await StudentSubjectGrades.findOne({
    where: {
      studsubjgradesID
    }
  }).then(async sg => {
    if (sg) {
      const q1Transmutation = await ClassRecord.findOne({
        where: {
          classRecordID: sg.classRecordID
        }
      }).then(async cr => {
        if (cr) {
          return cr.q1Transmu;
        }
      });
      const q2Transmutation = await ClassRecord.findOne({
        where: {
          classRecordID: sg.classRecordID
        }
      }).then(async cr => {
        if (cr) {
          return cr.q2Transmu;
        }
      });
      const q3Transmutation = await ClassRecord.findOne({
        where: {
          classRecordID: sg.classRecordID
        }
      }).then(async cr => {
        if (cr) {
          return cr.q3Transmu;
        }
      });
      const q4Transmutation = await ClassRecord.findOne({
        where: {
          classRecordID: sg.classRecordID
        }
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
            case "50":
              {
                return sws.transmutedGrade50;
                break;
              }
            case "55":
              {
                return sws.transmutedGrade55;
                break;
              }
            case "60":
              {
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
            case "50":
              {
                return sws.transmutedGrade50;
                break;
              }
            case "55":
              {
                return sws.transmutedGrade55;
                break;
              }
            case "60":
              {
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
            case "50":
              {
                return sws.transmutedGrade50;
                break;
              }
            case "55":
              {
                return sws.transmutedGrade55;
                break;
              }
            case "60":
              {
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
            case "50":
              {
                return sws.transmutedGrade50;
                break;
              }
            case "55":
              {
                return sws.transmutedGrade55;
                break;
              }
            case "60":
              {
                return sws.transmutedGrade60;
                break;
              }
            default:
              break;
          }
        }
      });

      if (parseFloat(q1TransmuGrade) != -1) {
        await sg.update({
          q1FinalGrade: Math.round(parseFloat(q1TransmuGrade))
        });
      } else {
        await sg.update({
          q1FinalGrade: -1
        });
      }

      if (parseFloat(q2TransmuGrade) != -1) {
        await sg.update({
          q2FinalGrade: Math.round(parseFloat(q2TransmuGrade))
        });
      } else {
        await sg.update({
          q2FinalGrade: -1
        });
      }

      if (parseFloat(q3TransmuGrade) != -1) {
        await sg.update({
          q3FinalGrade: Math.round(parseFloat(q3TransmuGrade))
        });
      } else {
        await sg.update({
          q3FinalGrade: -1
        });
      }

      if (parseFloat(q4TransmuGrade) != -1) {
        await sg.update({
          q4FinalGrade: Math.round(parseFloat(q4TransmuGrade))
        });
      } else {
        await sg.update({
          q4FinalGrade: -1
        });
      }

      if (subjectType == "NON_SHS") {
        if (
          parseFloat(q1TransmuGrade) != -1 &&
          parseFloat(q2TransmuGrade) != -1 &&
          parseFloat(q3TransmuGrade) != -1 &&
          parseFloat(q4TransmuGrade) != -1
        ) {
          let ave =
            (Math.round(parseFloat(q1TransmuGrade)) +
              Math.round(parseFloat(q2TransmuGrade)) +
              Math.round(parseFloat(q3TransmuGrade)) +
              Math.round(parseFloat(q4TransmuGrade))) /
            4;
          await sg.update({
            ave
          });
        } else {
          await sg.update({
            ave: -1
          });
        }
      } else {
        if (
          parseFloat(q1TransmuGrade) != -1 &&
          parseFloat(q2TransmuGrade) != -1
        ) {
          let ave =
            (Math.round(parseFloat(q1TransmuGrade)) +
              Math.round(parseFloat(q2TransmuGrade))) /
            2;
          await sg.update({
            ave
          });
        } else {
          await sg.update({
            ave: -1
          });
        }
      }
    }
  });
};

exports.getSubjectTypeByClassRecordID = async classRecordID => {
  return await SubjectSection.findOne({
    where: {
      classRecordID
    }
  }).then(ss => {
    if (ss) {
      return ss.subjectType;
    }
  });
};

exports.studentWeightedScoreUpdate = async weightedScoreID => {
  return await StudentWeightedScore.findOne({
    where: {
      weightedScoreID
    }
  }).then(async sws => {
    if (sws) {
      const subjectID = await this.getSubjectIDBySubsectstudID(
        sws.subsectstudID
      );
      Component.findAll({
        where: {
          subjectID
        }
      }).then(async comps => {
        if (comps.length != 0) {
          let data = [];
          let hasNegativeOne =
            sws.wwWS == -1 || sws.ptWS == -1 || sws.qeWS == -1;
          for (const [index, value] of comps.entries()) {
            const {
              component,
              compWeight
            } = value;
            data.push({
              component,
              compWeight
            });
          }
          let sum = 0;
          for (const [index2, value2] of data.entries()) {
            switch (value2.component) {
              case "FA":
                {
                  sum =
                  sum +
                  (parseFloat(sws.faWS) * parseFloat(value2.compWeight)) / 100;
                  break;
                }
              case "WW":
                {
                  sum =
                  sum +
                  (parseFloat(sws.wwWS) * parseFloat(value2.compWeight)) / 100;
                  break;
                }
              case "PT":
                {
                  sum =
                  sum +
                  (parseFloat(sws.ptWS) * parseFloat(value2.compWeight)) / 100;
                  break;
                }
              case "QE":
                {
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
            await sws.update({
              actualGrade: -1
            });
          }

          let transmuGrade50 =
            75 +
            (parseFloat(sws.actualGrade) - parseFloat(50)) /
            ((100 - parseFloat(50)) / 25);
          let transmuGrade55 =
            75 +
            (parseFloat(sws.actualGrade) - parseFloat(55)) /
            ((100 - parseFloat(55)) / 25);
          let transmuGrade60 =
            75 +
            (parseFloat(sws.actualGrade) - parseFloat(60)) /
            ((100 - parseFloat(60)) / 25);

          if (sws.actualGrade != -1) {
            await sws.update({
              transmutedGrade50: transmuGrade50
            });
            await sws.update({
              transmutedGrade55: transmuGrade55
            });
            await sws.update({
              transmutedGrade60: transmuGrade60
            });
          } else {
            await sws.update({
              transmutedGrade50: -1
            });
            await sws.update({
              transmutedGrade55: -1
            });
            await sws.update({
              transmutedGrade60: -1
            });
          }
        }
      });
    }
  });
};

exports.generateReportCardStudent = async(
  doc,
  res,
  studentID,
  schoolYearID,
  quarter,
  end,
  headerSent
) => {
  const displayQuarter = q => `Quarter ${q.charAt(1)}`;
  const displayGradeLevel = gradeLevel => {
    switch (gradeLevel) {
      case "N":
        return "Nursery";
      case "K1":
        return "Kinder 1";
      case "K2":
        return "Kinder 2";
      case "G1":
        return "Grade 1";
      case "G2":
        return "Grade 2";
      case "G3":
        return "Grade 3";
      case "G4":
        return "Grade 4";
      case "G5":
        return "Grade 5";
      case "G6":
        return "Grade 6";
      case "G7":
        return "Grade 7";
      case "G8":
        return "Grade 8";
      case "G9":
        return "Grade 9";
      case "G10":
        return "Grade 10";
      case "G11":
        return "Grade 11";
      case "G12":
        return "Grade 12";
      default:
        return "";
    }
  };
  const name = await this.getStudentName(studentID);
  const schoolYear = await this.getSYname(schoolYearID);
  const studsectID = await StudentSection.findOne({
    where: {
      studentID,
      schoolYearID
    }
  }).then(ss => {
    if (ss) {
      return ss.studsectID;
    } else {
      return -1;
    }
  });
  if (studsectID == -1) {
    headerSent = true
    res.status(404).json({
      msg: "Student is not enrolled this school year."
    });
    // doc.end()
  } else {
    const section = await this.getSectionNameByStudsectID(studsectID);
    const gradeLevel = await this.getSectionGradeLevelByStudsectID(studsectID);
    const subsectstudIDs = await SubjectSectionStudent.findAll({
      where: {
        studsectID
      }
    }).then(async sss => {
      if (sss) {
        let data = [];
        for (const [index, x] of sss.entries()) {
          const subjectType = await SubjectSectionStudent.findOne({
            where: {
              subsectstudID: x.subsectstudID
            }
          }).then(
            async subsectstud =>
            await SubjectSection.findOne({
              where: {
                subsectID: subsectstud.subsectID
              }
            }).then(subsect => subsect.subjectType)
          );
          const compare = ["Q1", "Q2"].includes(quarter) ?
            ["NON_SHS", "1ST_SEM"] :
            ["NON_SHS", "2ND_SEM"];
          if (compare.includes(subjectType)) {
            data.push(x.subsectstudID);
          }
        }
        return data;
      }
    });
    if (subsectstudIDs.length == 0) {
      headerSent = true
      res.status(404).json({
        msg: "Student is not enrolled in a subject this school year."
      });
      // doc.end()
    } else {
      StudentSubjectGrades.findAll({
        where: {
          subsectstudID: {
            [Op.in]: subsectstudIDs
          }
        }
      }).then(async ssg => {
        if (ssg) {
          let data = {
            q1: [],
            q2: [],
            q3: [],
            q4: [],
            final: []
          };

          for (const [i, y] of ssg.entries()) {
            const classRecordStatus = await ClassRecordStatus.findOne({
              where: {
                classRecordID: y.classRecordID
              }
            });
            const subjectType = await this.getSubjectTypeByClassRecordID(
              y.classRecordID
            );
            let subjectName = await this.getSubjectNameBySubsectstudID(
              y.subsectstudID
            );
            if (subjectType == "NON_SHS") {
              let hasNegativeOne = false;
              for (const [i2, q] of["Q1", "Q2", "Q3", "Q4"].entries()) {
                let score = y[`${q.toLowerCase()}FinalGrade`];
                if (classRecordStatus[q.toLowerCase()] == "F" && quarter >= q) {
                  data[q.toLowerCase()].push({
                    subjectName,
                    score
                  });
                } else {
                  hasNegativeOne = true;
                  data[q.toLowerCase()].push({
                    subjectName,
                    score: -1
                  });
                }
              }
              if (!hasNegativeOne) {
                data.final.push({
                  subjectName,
                  score: y.ave
                });
              } else {
                data.final.push({
                  subjectName,
                  score: -1
                });
              }
            } else if (subjectType == "1ST_SEM") {
              let hasNegativeOne = false;
              for (const [i2, q] of["Q1", "Q2"].entries()) {
                let score = y[`${q.toLowerCase()}FinalGrade`];
                if (classRecordStatus[q.toLowerCase()] == "F" && quarter >= q) {
                  data[q.toLowerCase()].push({
                    subjectName,
                    score
                  });
                } else {
                  hasNegativeOne = true;
                  data[q.toLowerCase()].push({
                    subjectName,
                    score: -1
                  });
                }
              }
              if (!hasNegativeOne) {
                data.final.push({
                  subjectName,
                  score: y.ave
                });
              } else {
                data.final.push({
                  subjectName,
                  score: -1
                });
              }
            } else if (subjectType == "2ND_SEM") {
              let hasNegativeOne = false;
              for (const [i2, q] of["Q1", "Q2"].entries()) {
                let score = y[`${q.toLowerCase()}FinalGrade`];
                if (
                  classRecordStatus[q.toLowerCase()] == "F" &&
                  `Q${parseInt(quarter.charAt(1)) - 2}` >= q
                ) {
                  data[`q${parseInt(q.charAt(1)) + 2}`].push({
                    subjectName,
                    score
                  });
                } else {
                  hasNegativeOne = true;
                  data[`q${parseInt(q.charAt(1)) + 2}`].push({
                    subjectName,
                    score: -1
                  });
                }
              }
              if (!hasNegativeOne) {
                data.final.push({
                  subjectName,
                  score: y.ave
                });
              } else {
                data.final.push({
                  subjectName,
                  score: -1
                });
              }
            }
          }
          if (!["G11", "G12"].includes(gradeLevel)) {
            let finalGrade = -1;
            if (quarter == "Q4") {
              finalGrade = await StudentFinalGrade.findOne({
                where: {
                  schoolYearID,
                  studsectID
                }
              }).then(sfg => sfg.grade);
            }
            const {
              q1,
              q2,
              q3,
              q4,
              final
            } = data;
            let flags = [];
            let subjectName = [];
            //PDF CREATION
            for (const [index, value] of[
                ...q1,
                ...q2,
                ...q3,
                ...q4
              ].entries()) {
              if (flags[value.subjectName]) continue;
              flags[value.subjectName] = true;
              subjectName.push(value.subjectName);
            }
            doc.image(logo, 234.5, 30, {
              width: 140,
              align: "center"
            });
            doc.x = 30;
            doc.y = 90;
            doc.text("Name: " + name);
            doc.moveDown();
            doc.text("Section: " + section);
            doc.moveDown();
            doc.text("Grade Level: " + displayGradeLevel(gradeLevel));
            doc.moveDown();
            doc
              .fontSize(14)
              .text(
                `Report Card of S.Y. ${schoolYear} ${displayQuarter(quarter)}`, {
                  width: 549,
                  align: "center"
                }
              );
            doc.moveDown();
            doc.fontSize(12);
            let y = doc.y;
            let x = doc.x;
            doc.text("Subject Name", {
              width: 200,
              align: "center"
            });
            let newX = doc.x;
            let newY = doc.y;
            doc.x = 230;
            doc.y = y;
            doc.rect(x, y - 5, 200, newY - y + 5).stroke();
            doc.text("Q1", {
              width: 69.8,
              align: "center"
            });
            doc.x = 299.8;
            doc.y = y;
            doc.rect(doc.x - 69.8, y - 5, 69.8, newY - y + 5).stroke();
            doc.text("Q2", {
              width: 69.8,
              align: "center"
            });
            doc.x = 369.6;
            doc.y = y;
            doc.rect(doc.x - 69.8, y - 5, 69.8, newY - y + 5).stroke();
            doc.text("Q3", {
              width: 69.8,
              align: "center"
            });
            doc.x = 439.4;
            doc.y = y;
            doc.rect(doc.x - 69.8, y - 5, 69.8, newY - y + 5).stroke();
            doc.text("Q4", {
              width: 69.8,
              align: "center"
            });
            doc.x = 509.2;
            doc.y = y;
            doc.rect(doc.x - 69.8, y - 5, 69.8, newY - y + 5).stroke();
            doc.text("Final", {
              width: 69.8,
              align: "center"
            });
            doc.x = 579;
            doc.y = y;
            doc.rect(doc.x - 69.8, y - 5, 69.8, newY - y + 5).stroke();
            doc.x = newX;
            doc.y = newY;

            doc.moveDown();
            for (const [index, value] of subjectName.entries()) {
              let border = 14;
              let y = doc.y;
              let x = doc.x;
              doc.x = doc.x + 5;
              doc.text(value, {
                width: 200
              });
              let newX = doc.x - 5;
              let newY = doc.y;
              doc.x = 230;
              doc.y = y;
              doc.rect(x, y - border, 200, newY - y + border).stroke();
              doc.text(
                q1.find(a => a.subjectName == value) ?
                q1.find(a => a.subjectName == value).score == -1 ?
                "" :
                q1.find(a => a.subjectName == value).score :
                "", {
                  width: 69.8,
                  align: "center"
                }
              );
              doc.x = 299.8;
              doc.y = y;
              doc
                .rect(doc.x - 69.8, y - border, 69.8, newY - y + border)
                .stroke();
              doc.text(
                q2.find(a => a.subjectName == value) ?
                q2.find(a => a.subjectName == value).score == -1 ?
                "" :
                q2.find(a => a.subjectName == value).score :
                "", {
                  width: 69.8,
                  align: "center"
                }
              );
              doc.x = 369.6;
              doc.y = y;
              doc
                .rect(doc.x - 69.8, y - border, 69.8, newY - y + border)
                .stroke();
              doc.text(
                q3.find(a => a.subjectName == value) ?
                q3.find(a => a.subjectName == value).score == -1 ?
                "" :
                q3.find(a => a.subjectName == value).score :
                "", {
                  width: 69.8,
                  align: "center"
                }
              );
              doc.x = 439.4;
              doc.y = y;
              doc
                .rect(doc.x - 69.8, y - border, 69.8, newY - y + border)
                .stroke();
              doc.text(
                q4.find(a => a.subjectName == value) ?
                q4.find(a => a.subjectName == value).score == -1 ?
                "" :
                q4.find(a => a.subjectName == value).score :
                "", {
                  width: 69.8,
                  align: "center"
                }
              );
              doc.x = 509.2;
              doc.y = y;
              doc
                .rect(doc.x - 69.8, y - border, 69.8, newY - y + border)
                .stroke();
              doc.text(
                final.find(a => a.subjectName == value) ?
                final.find(a => a.subjectName == value).score == -1 ?
                "" :
                final.find(a => a.subjectName == value).score :
                "", {
                  width: 69.8,
                  align: "center"
                }
              );
              doc.x = 579;
              doc.y = y;
              doc
                .rect(doc.x - 69.8, y - border, 69.8, newY - y + border)
                .stroke();
              doc.x = newX;
              doc.y = newY;
              doc.moveDown();
            }
            doc.text(`Final Grade: ${finalGrade == -1 ? "N/A" : finalGrade}`);
            if (end) doc.end();
            else doc.addPage();
          } else {
            if (["Q1", "Q2"].includes(quarter)) {
              // 1st Sem SHS
              let finalGrade = -1;
              if (quarter == "Q4") {
                finalGrade = await StudentFinalGrade.findOne({
                  where: {
                    schoolYearID,
                    studsectID
                  }
                }).then(sfg => sfg.grade);
              }
              const {
                q1,
                q2,
                final
              } = data;
              let flags = [];
              let subjectName = [];
              //PDF CREATION
              for (const [index, value] of[...q1, ...q2].entries()) {
                if (flags[value.subjectName]) continue;
                flags[value.subjectName] = true;
                subjectName.push(value.subjectName);
              }
              doc.image(logo, 234.5, 30, {
                width: 140,
                align: "center"
              });
              doc.x = 30;
              doc.y = 90;
              doc.text("Name: " + name);
              doc.moveDown();
              doc.text("Section: " + section);
              doc.moveDown();
              doc.text("Grade Level: " + displayGradeLevel(gradeLevel));
              doc.moveDown();
              doc
                .fontSize(14)
                .text(
                  `Report Card of S.Y. ${schoolYear} - First Semester ${displayQuarter(
                    quarter
                  )}`, {
                    width: 549,
                    align: "center"
                  }
                );
              doc.moveDown();
              doc.fontSize(12);
              let y = doc.y;
              let x = doc.x;
              doc.text("Subject Name", {
                width: 200,
                align: "center"
              });
              let newX = doc.x;
              let newY = doc.y;
              doc.x = 230;
              doc.y = y;
              doc.rect(x, y - 5, 200, newY - y + 5).stroke();
              doc.text("Midterm", {
                width: 116.33,
                align: "center"
              });
              doc.x = 346.33;
              doc.y = y;
              doc.rect(doc.x - 116.33, y - 5, 116.33, newY - y + 5).stroke();
              doc.text("Finals", {
                width: 116.33,
                align: "center"
              });
              doc.x = 462.66;
              doc.y = y;
              doc.rect(doc.x - 116.33, y - 5, 116.3, newY - y + 5).stroke();
              doc.text("Final Grade", {
                width: 116.33,
                align: "center"
              });
              doc.x = 579;
              doc.y = y;
              doc.rect(doc.x - 116.33, y - 5, 116.3, newY - y + 5).stroke();
              doc.x = newX;
              doc.y = newY;
              doc.moveDown();
              for (const [index, value] of subjectName.entries()) {
                let border = 14;
                let y = doc.y;
                let x = doc.x;
                doc.x = doc.x + 5;
                doc.text(value, {
                  width: 200
                });
                let newX = doc.x - 5;
                let newY = doc.y;
                doc.x = 230;
                doc.y = y;
                doc.rect(x, y - border, 200, newY - y + border).stroke();
                doc.text(
                  q1.find(a => a.subjectName == value) ?
                  q1.find(a => a.subjectName == value).score == -1 ?
                  "" :
                  q1.find(a => a.subjectName == value).score :
                  "", {
                    width: 116.33,
                    align: "center"
                  }
                );
                doc.x = 346.33;
                doc.y = y;
                doc
                  .rect(doc.x - 116.33, y - border, 116.33, newY - y + border)
                  .stroke();
                doc.text(
                  q2.find(a => a.subjectName == value) ?
                  q2.find(a => a.subjectName == value).score == -1 ?
                  "" :
                  q2.find(a => a.subjectName == value).score :
                  "", {
                    width: 116.33,
                    align: "center"
                  }
                );
                doc.x = 462.66;
                doc.y = y;
                doc
                  .rect(doc.x - 116.33, y - border, 116.33, newY - y + border)
                  .stroke();
                doc.text(
                  final.find(a => a.subjectName == value) ?
                  final.find(a => a.subjectName == value).score == -1 ?
                  "" :
                  final.find(a => a.subjectName == value).score :
                  "", {
                    width: 116.33,
                    align: "center"
                  }
                );
                doc.x = 579;
                doc.y = y;
                doc
                  .rect(doc.x - 116.33, y - border, 116.33, newY - y + border)
                  .stroke();
                doc.x = newX;
                doc.y = newY;
                doc.moveDown();
              }
              let enumerator = 0;
              let denominator = 0;
              let ave = 0;
              for (const [i3, v3] of final.entries()) {
                if (v3.score != -1) {
                  enumerator = enumerator + parseFloat(v3.score);
                  denominator = denominator = 1;
                }
              }
              ave =
                denominator == 0 ?
                -1 :
                Math.round(parseFloat(enumerator / denominator));
              doc.text(`Semester Grade: ${ave == -1 ? "N/A" : ave}`);
              doc.moveDown();
              doc.text(`Final Grade: ${finalGrade == -1 ? "N/A" : finalGrade}`);
              if (end) doc.end();
              else doc.addPage();
            } else {
              // 2nd Sem SHS
              let finalGrade = -1;
              if (quarter == "Q4") {
                finalGrade = await StudentFinalGrade.findOne({
                  where: {
                    schoolYearID,
                    studsectID
                  }
                }).then(sfg => sfg.grade);
              }
              const {
                q3,
                q4,
                final
              } = data;
              let flags = [];
              let subjectName = [];
              //PDF CREATION
              for (const [index, value] of[...q3, ...q4].entries()) {
                if (flags[value.subjectName]) continue;
                flags[value.subjectName] = true;
                subjectName.push(value.subjectName);
              }

              doc.image(logo, 234.5, 30, {
                width: 140,
                align: "center"
              });
              doc.x = 30;
              doc.y = 90;
              doc.text("Name: " + name);
              doc.moveDown();
              doc.text("Section: " + section);
              doc.moveDown();
              doc.text("Grade Level: " + displayGradeLevel(gradeLevel));
              doc.moveDown();
              doc
                .fontSize(14)
                .text(
                  `Report Card of S.Y. ${schoolYear} - Second Semester ${displayQuarter(
                    quarter
                  )}`, {
                    width: 549,
                    align: "center"
                  }
                );
              doc.moveDown();
              doc.fontSize(12);
              let y = doc.y;
              let x = doc.x;
              doc.text("Subject Name", {
                width: 200,
                align: "center"
              });
              let newX = doc.x;
              let newY = doc.y;
              doc.x = 230;
              doc.y = y;
              doc.rect(x, y - 5, 200, newY - y + 5).stroke();
              doc.text("Midterm", {
                width: 116.33,
                align: "center"
              });
              doc.x = 346.33;
              doc.y = y;
              doc.rect(doc.x - 116.33, y - 5, 116.33, newY - y + 5).stroke();
              doc.text("Finals", {
                width: 116.33,
                align: "center"
              });
              doc.x = 462.66;
              doc.y = y;
              doc.rect(doc.x - 116.33, y - 5, 116.3, newY - y + 5).stroke();
              doc.text("Final Grade", {
                width: 116.33,
                align: "center"
              });
              doc.x = 579;
              doc.y = y;
              doc.rect(doc.x - 116.33, y - 5, 116.3, newY - y + 5).stroke();
              doc.x = newX;
              doc.y = newY;
              doc.moveDown();
              for (const [index, value] of subjectName.entries()) {
                let border = 14;
                let y = doc.y;
                let x = doc.x;
                doc.x = doc.x + 5;
                doc.text(value, {
                  width: 200
                });
                let newX = doc.x - 5;
                let newY = doc.y;
                doc.x = 230;
                doc.y = y;
                doc.rect(x, y - border, 200, newY - y + border).stroke();
                doc.text(
                  q3.find(a => a.subjectName == value) ?
                  q3.find(a => a.subjectName == value).score == -1 ?
                  "" :
                  q3.find(a => a.subjectName == value).score :
                  "", {
                    width: 116.33,
                    align: "center"
                  }
                );
                doc.x = 346.33;
                doc.y = y;
                doc
                  .rect(doc.x - 116.33, y - border, 116.33, newY - y + border)
                  .stroke();
                doc.text(
                  q4.find(a => a.subjectName == value) ?
                  q4.find(a => a.subjectName == value).score == -1 ?
                  "" :
                  q4.find(a => a.subjectName == value).score :
                  "", {
                    width: 116.33,
                    align: "center"
                  }
                );
                doc.x = 462.66;
                doc.y = y;
                doc
                  .rect(doc.x - 116.33, y - border, 116.33, newY - y + border)
                  .stroke();
                doc.text(
                  final.find(a => a.subjectName == value) ?
                  final.find(a => a.subjectName == value).score == -1 ?
                  "" :
                  final.find(a => a.subjectName == value).score :
                  "", {
                    width: 116.33,
                    align: "center"
                  }
                );
                doc.x = 579;
                doc.y = y;
                doc
                  .rect(doc.x - 116.33, y - border, 116.33, newY - y + border)
                  .stroke();
                doc.x = newX;
                doc.y = newY;
                doc.moveDown();
              }
              let enumerator = 0;
              let denominator = 0;
              let ave = 0;
              for (const [i3, v3] of final.entries()) {
                if (v3.score != -1) {
                  enumerator = enumerator + parseFloat(v3.score);
                  denominator = denominator = 1;
                }
              }
              ave =
                denominator == 0 ?
                -1 :
                Math.round(parseFloat(enumerator / denominator));
              doc.text(`Semester Grade: ${ave == -1 ? "N/A" : ave}`);
              doc.moveDown();
              doc.text(`Final Grade: ${finalGrade == -1 ? "N/A" : finalGrade}`);
              if (end) doc.end();
              else doc.addPage();
            }
          }
        }
      });
    }
  }
};