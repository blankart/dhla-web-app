// Import Models (Database table names)
const UserAccount = require("../models/UserAccount");
const Nonacademic = require("../models/Nonacademic");
const Student = require("../models/Student");
const ParentGuardian = require("../models/ParentGuardian");
const Teacher = require("../models/Teacher");
const Grade = require("../models/Grade");
const Section = require("../models/Section");
const Subject = require("../models/Subject");
const Adviser = require("../models/Adviser");
const AttendanceLog = require("../models/AttendanceLog");
const SubmissionDeadline = require("../models/SubmissionDeadline");
const SubjectSection = require("../models/SubjectSection");
const SubjectSectionStudent = require("../models/SubjectSectionStudent");
const Component = require("../models/Component");
const StudentWeightedScore = require("../models/StudentWeightedScore");
const ClassRecord = require("../models/ClassRecord");
const Subcomponent = require("../models/Subcomponent");
const AccountNotice = require("../models/AccountNotice");
const SchoolYear = require("../models/SchoolYear");
const StudentSection = require("../models/StudentSection");

const useraccountERD = async function() {
  // user account ERD
  await Nonacademic.belongsTo(UserAccount, { foreignKey: "accountID" });
  await UserAccount.hasOne(Nonacademic, { foreignKey: "accountID" });
  await UserAccount.hasOne(Student, { foreignKey: "accountID" });
  await UserAccount.hasOne(ParentGuardian, { foreignKey: "accountID" });
  await UserAccount.hasOne(Teacher, { foreignKey: "accountID" });
  await Student.belongsTo(UserAccount, { foreignKey: "accountID" });
  await ParentGuardian.belongsTo(UserAccount, { foreignKey: "accountID" });
  await Teacher.belongsTo(UserAccount, { foreignKey: "accountID" });
  await UserAccount.sync({ force: false }).then(() => {
    console.log("user account table created/synced");
    Nonacademic.sync({ force: false }).then(() => {
      console.log("nonacademic table created/synced");
    });
    Student.sync({ force: false }).then(() => {
      console.log("student table created/synced");
    });
    ParentGuardian.sync({ force: false }).then(() => {
      console.log("parent guardian table created/synced");
    });
    Teacher.sync({ force: false }).then(() => {
      console.log("teacher table created/synced");
    });
  });
};

const subjectsectionERD = async function() {
  //subject section erd
  await SchoolYear.sync({ force: false });
  await Section.hasMany(SubjectSection, { foreignKey: "sectionID" });
  await Teacher.hasMany(SubjectSection, { foreignKey: "teacherID" });
  await Subject.hasMany(SubjectSection, { foreignKey: "subjectID" });
  await StudentSection.hasMany(SubjectSectionStudent, { foreignKey: "studsectID" });
  await SubjectSection.hasMany(SubjectSectionStudent, {
    foreignKey: "subsectID"
  });
  await SchoolYear.hasMany(SubjectSection, { foreignKey: "schoolYearID" });
  await Subject.sync({ force: false }).then(async function() {
    await Teacher.sync({ force: false }).then(async function() {
      await Section.sync({ force: false }).then(async function() {
        await SubjectSection.sync({ force: false }).then(async function() {
          await SubjectSectionStudent.sync({ force: false }).then(
            async function() {
              console.log("subject section student created/synced");
            }
          );
        });
      });
    });
  });
};

const studentsectionERD = async function() {
  await Student.hasMany(StudentSection, { foreignKey: "studentID" });
  await SchoolYear.hasMany(StudentSection, { foreignKey: "schoolYearID" });
  await Section.hasMany(StudentSection, { foreignKey: "sectionID" });
  await StudentSection.sync({ force: false }).then(() => {
    console.log("student section table created/synced");
  });
};

const componentERD = async function() {
  // component weight ERD
  await Subject.hasMany(Component, { foreignKey: "subjectID" });
  await Component.sync({ force: false }).then(() => {
    console.log("component table created/synced");
  });
};

const gradeERD = async function() {
  // grade ERD
  await ClassRecord.sync({ force: false }).then(async function() {
    await ClassRecord.hasMany(StudentWeightedScore, {
      foreignKey: "classRecordID"
    });
    await Student.hasMany(StudentWeightedScore, { foreignKey: "studentID" });
    await ClassRecord.hasMany(Grade, { foreignKey: "classRecordID" });
    await ClassRecord.hasMany(Subcomponent, { foreignKey: "classRecordID" });
    await Component.hasMany(Subcomponent, { foreignKey: "componentID" });
    await Subcomponent.sync({ force: false }).then(async function() {
      await StudentWeightedScore.sync({ force: false }).then(async function() {
        await Subcomponent.hasMany(Grade, { foreignKey: "subcomponentID" });
        await Component.hasMany(Grade, { foreignKey: "componentID" });
        await Student.hasMany(Grade, { foreignKey: "studentID" });
        await Grade.sync({ force: false }).then(async function() {
          console.log("grade table created/synced");
        });
      });
    });
  });
};

const adviserERD = async function() {
  // adviser ERD
  await SchoolYear.hasMany(Adviser, { foreignKey: "schoolYearID" });
  await Section.hasMany(Adviser, { foreignKey: "sectionID" });
  await Teacher.hasMany(Adviser, { foreignKey: "teacherID" });
  await Adviser.sync({ force: false }).then(() => {
    console.log("adviser table created/synced");
  });
};

const attendancelogERD = async function() {
  // attendance log ERD
  await SchoolYear.hasMany(AttendanceLog, { foreignKey: "schoolYearID" });
  await Student.hasMany(AttendanceLog, { foreignKey: "studentID" });
  await Teacher.hasMany(AttendanceLog, { foreignKey: "teacherID" });
  await AttendanceLog.sync({ force: false }).then(() => {
    console.log("attendance log table created/synced");
  });
};

const submissiondeadlineERD = async function() {
  // submission deadline ERD
  await Teacher.hasMany(SubmissionDeadline, { foreignKey: "teacherID" });
  await SubmissionDeadline.sync({ force: false }).then(() => {
    console.log("submission deadline table created/synced");
  });
};

const studentnoticeERD = async function() {
  // student notice ERD
  await Student.hasOne(AccountNotice, { foreignKey: "studentID" });
  await AccountNotice.sync({ force: false }).then(() => {
    console.log("Account notice table created/synced");
  });
};

exports.init = async function() {
  await useraccountERD();
  await studentsectionERD();
  await subjectsectionERD();
  await componentERD();
  await gradeERD();
  await adviserERD();
  await attendancelogERD();
  await submissiondeadlineERD();
  await studentnoticeERD();
};
