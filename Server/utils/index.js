const UserAccount = require("../models/UserAccount");
const Nonacademic = require("../models/Nonacademic");
const SchoolYear = require("../models/SchoolYear");
const Section = require("../models/Section");
const Student = require("../models/Student");
const StudentSection = require("../models/StudentSection");
const Adviser = require("../models/Adviser");
const Teacher = require("../models/Teacher");
const Sequelize = require("sequelize");
const Subject = require("../models/Subject");
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
        console.log(useraccounts[i].accountID);
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
