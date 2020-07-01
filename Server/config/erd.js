// Import Models (Database table names)
const UserAccount = require("../models/UserAccount");
const Nonacademic = require("../models/Nonacademic");
const Student = require("../models/Student");
const ParentGuardian = require("../models/ParentGuardian");
const Teacher = require("../models/Teacher");
const Grade = require("../models/Grade");
const Section = require("../models/Section");
const Subject = require("../models/Subject");
const TeacherSection = require("../models/TeacherSection");
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
const StudentSubjectGrades = require("../models/StudentSubjectGrades");
const ActivityLog = require("../models/ActivityLog");
const LogDetails = require("../models/LogDetails");
const ClassRecordStatus = require("../models/ClassRecordStatus");
const StudentGrades = require("../models/StudentGrades");
const StudentFinalGrade = require("../models/StudentFinalGrade");
const utils = require("../utils");

const useraccountERD = async function() {
  // user account ERD

  await UserAccount.hasOne(Nonacademic, {
    foreignKey: "accountID"
  });
  await UserAccount.hasOne(Student, {
    foreignKey: "accountID"
  });
  await UserAccount.hasOne(ParentGuardian, {
    foreignKey: "accountID"
  });
  await UserAccount.hasOne(Teacher, {
    foreignKey: "accountID"
  });
  await UserAccount.sync({
    force: false
  }).then(() => {
    console.log("user account table created/synced");
    Nonacademic.sync({
      force: false
    }).then(() => {
      console.log("nonacademic table created/synced");
    });
    Student.sync({
      force: false
    }).then(() => {
      console.log("student table created/synced");
    });
    ParentGuardian.sync({
      force: false
    }).then(() => {
      console.log("parent guardian table created/synced");
    });
    Teacher.sync({
      force: false
    }).then(() => {
      console.log("teacher table created/synced");
    });
  });
};

const subjectsectionERD = async function() {
  //subject section erd
  await SchoolYear.sync({
    force: false
  });
  await Section.hasMany(SubjectSection, {
    foreignKey: "sectionID"
  });
  await Teacher.hasMany(SubjectSection, {
    foreignKey: "teacherID"
  });
  await Subject.hasMany(SubjectSection, {
    foreignKey: "subjectID"
  });
  await StudentSection.hasMany(SubjectSectionStudent, {
    foreignKey: "studsectID"
  });
  await SubjectSection.hasMany(SubjectSectionStudent, {
    foreignKey: "subsectID"
  });
  await SchoolYear.hasMany(SubjectSection, {
    foreignKey: "schoolYearID"
  });
  await Subject.sync({
    force: false
  }).then(async function() {
    await Teacher.sync({
      force: false
    }).then(async function() {
      await Section.sync({
        force: false
      }).then(async function() {
        await SubjectSection.sync({
          force: false
        }).then(async function() {
          await SubjectSectionStudent.sync({
            force: false
          }).then(async function() {
            console.log("subject section student created/synced");
          });
        });
      });
    });
  });
};

const studentsectionERD = async function() {
  await Student.hasMany(StudentSection, {
    foreignKey: "studentID"
  });
  await SchoolYear.hasMany(StudentSection, {
    foreignKey: "schoolYearID"
  });
  await Section.hasMany(StudentSection, {
    foreignKey: "sectionID"
  });
  await StudentSection.sync({
    force: false
  }).then(() => {
    console.log("student section table created/synced");
  });
};

const componentERD = async function() {
  // component weight ERD
  await Subject.hasMany(Component, {
    foreignKey: "subjectID"
  });
  await Component.sync({
    force: false
  }).then(() => {
    console.log("component table created/synced");
  });
};

const gradeERD = async function() {
  // grade ERD
  await ClassRecord.sync({
    force: false
  }).then(async function() {
    await ClassRecord.hasMany(StudentWeightedScore, {
      foreignKey: "classRecordID"
    });
    await SubjectSectionStudent.hasMany(StudentWeightedScore, {
      foreignKey: "subsectstudID"
    });
    await ClassRecord.hasMany(StudentSubjectGrades, {
      foreignKey: "classRecordID"
    });
    await SubjectSectionStudent.hasMany(StudentSubjectGrades, {
      foreignKey: "subsectstudID"
    });
    await ClassRecord.hasOne(ClassRecordStatus, {
      foreignKey: "classRecordID"
    });
    await ClassRecord.hasMany(Grade, {
      foreignKey: "classRecordID"
    });
    await ClassRecord.hasMany(Subcomponent, {
      foreignKey: "classRecordID"
    });
    await Component.hasMany(Subcomponent, {
      foreignKey: "componentID"
    });
    await Subcomponent.sync({
      force: false
    }).then(async function() {
      await StudentWeightedScore.sync({
        force: false
      }).then(async function() {
        await StudentSubjectGrades.sync({
          force: false
        }).then(async function() {
          await Subcomponent.hasMany(Grade, {
            foreignKey: "subcomponentID"
          });
          await Component.hasMany(Grade, {
            foreignKey: "componentID"
          });
          await SubjectSectionStudent.hasMany(Grade, {
            foreignKey: "subsectstudID"
          });
          await Grade.sync({
            force: false
          }).then(async function() {
            console.log("grade table created/synced");
          });
          await ClassRecordStatus.sync({
            force: false
          }).then(async () => {
            console.log("class record status created/synced");
          });
        });
      });
    });
  });
};

const adviserERD = async function() {
  // adviser ERD
  await SchoolYear.hasMany(TeacherSection, {
    foreignKey: "schoolYearID"
  });
  await Section.hasMany(TeacherSection, {
    foreignKey: "sectionID"
  });
  await Teacher.hasMany(TeacherSection, {
    foreignKey: "teacherID"
  });
  await TeacherSection.sync({
    force: false
  }).then(() => {
    console.log("adviser table created/synced");
  });
};

const attendancelogERD = async function() {
  // attendance log ERD
  await SchoolYear.hasMany(AttendanceLog, {
    foreignKey: "schoolYearID"
  });
  await Student.hasMany(AttendanceLog, {
    foreignKey: "studentID"
  });
  await Teacher.hasMany(AttendanceLog, {
    foreignKey: "teacherID"
  });
  await AttendanceLog.sync({
    force: false
  }).then(() => {
    console.log("attendance log table created/synced");
  });
};

const submissiondeadlineERD = async function() {
  // submission deadline ERD
  await Teacher.hasMany(SubmissionDeadline, {
    foreignKey: "teacherID"
  });
  await SubmissionDeadline.sync({
    force: false
  }).then(() => {
    console.log("submission deadline table created/synced");
  });
};

const studentnoticeERD = async function() {
  // student notice ERD
  await Student.hasOne(AccountNotice, {
    foreignKey: "studentID"
  });
  await AccountNotice.sync({
    force: false
  }).then(() => {
    console.log("Account notice table created/synced");
  });
};

const activitylogERD = async function() {
  await ClassRecord.hasMany(ActivityLog, {
    foreignKey: "classRecordID"
  });
  await ActivityLog.sync({
    force: false
  }).then(async () => {
    await ActivityLog.hasMany(LogDetails, {
      foreignKey: "logID"
    });
    await LogDetails.sync({
      force: false
    }).then(() => {
      console.log("Activity log table created/synced");
    });
  });
};

const studentgradesERD = async function() {
  await SchoolYear.hasMany(StudentGrades, { foreignKey: "schoolYearID" });
  await SchoolYear.hasMany(StudentFinalGrade, { foreignKey: "schoolYearID" });
  await StudentSection.hasMany(StudentGrades, { foreignKey: "studsectID" });
  await StudentSection.hasMany(StudentFinalGrade, { foreignKey: "studsectID" });
  await StudentGrades.sync({ forcce: false }).then(async () => {
    await StudentFinalGrade.sync({ force: false });
    console.log("Student grades created/synced");
  });
};

const hooks = async function() {
  ClassRecordStatus.addHook(
    "afterUpdate",
    async (classrecordstatus, options) => {
      const {
        position,
        classRecordID,
        type,
        accountID,
        sectionID,
        subjectID,
        oldVal,
        newVal,
        quarter
      } = options;
      const name = await utils.getAccountName(accountID);
      const section = await utils.getSectionName(sectionID);
      const subject = await utils.getSubjectCode(subjectID);
      const oldValText =
        oldVal == "L"
          ? "Locked"
          : oldVal == "E"
          ? "Encoding"
          : oldVal == "D"
          ? "For deliberation"
          : "Posted";
      const newValText =
        newVal == "L"
          ? "Locked"
          : newVal == "E"
          ? "Encoding"
          : newVal == "D"
          ? "For deliberation"
          : "Posted";
      ActivityLog.create({
        type,
        classRecordID,
        position,
        name,
        section,
        subject,
        quarter,
        timestamp: new Date()
      }).then(async al => {
        LogDetails.create({
          logID: al.logID,
          description: `Changed class record status from \'${oldValText}\' to \'${newValText}\'`
        });
      });
    }
  );

  Subcomponent.addHook("afterDestroy", async (subcomponent, options) => {
    const {
      showLog,
      position,
      type,
      accountID,
      sectionID,
      subjectID,
      quarter,
      subcompName,
      componentName,
      classRecordID
    } = options;
    if (showLog) {
      const name = await utils.getAccountName(accountID);
      const section = await utils.getSectionName(sectionID);
      const subject = await utils.getSubjectCode(subjectID);
      ActivityLog.create({
        type,
        classRecordID,
        position,
        name,
        section,
        subject,
        quarter,
        timestamp: new Date()
      }).then(async al => {
        LogDetails.create({
          logID: al.logID,
          description: `Deleted subcomponent '${subcompName}' under ${componentName}`
        });
      });
    } else {
      // Do nothing
    }
  });

  Subcomponent.addHook("afterCreate", async (subcomponent, options) => {
    const {
      showLog,
      position,
      type,
      accountID,
      sectionID,
      subjectID,
      quarter,
      subcompName,
      componentName,
      classRecordID
    } = options;
    if (showLog) {
      const name = await utils.getAccountName(accountID);
      const section = await utils.getSectionName(sectionID);
      const subject = await utils.getSubjectCode(subjectID);
      ActivityLog.create({
        type,
        classRecordID,
        position,
        name,
        section,
        subject,
        quarter,
        timestamp: new Date()
      }).then(async al => {
        LogDetails.create({
          logID: al.logID,
          description: `Added subcomponent '${subcompName}' under ${componentName}`
        });
      });
    } else {
      // Do nothing
    }
  });

  Subcomponent.addHook("afterUpdate", async (subcomponent, options) => {
    const {
      showLog,
      position,
      type,
      accountID,
      sectionID,
      subjectID,
      quarter,
      subcompName,
      componentName,
      classRecordID,
      oldVal,
      newVal,
      oldName,
      newName
    } = options;
    if (showLog) {
      const name = await utils.getAccountName(accountID);
      const section = await utils.getSectionName(sectionID);
      const subject = await utils.getSubjectCode(subjectID);
      ActivityLog.create({
        type,
        classRecordID,
        position,
        name,
        section,
        subject,
        quarter,
        timestamp: new Date()
      }).then(async al => {
        LogDetails.create({
          logID: al.logID,
          description: `Updated subcomponent '${subcompName}' ${
            oldName != newName
              ? `(changed name from ${oldName} to ${newName})`
              : ``
          } ${
            oldVal != newVal ? `(from ${oldVal}% to ${newVal})%` : ``
          } under ${componentName}`
        });
      });
    } else {
      // Do nothing
    }
  });

  ClassRecord.addHook("afterUpdate", async (classrecord, options) => {
    const {
      showLog,
      position,
      type,
      accountID,
      sectionID,
      subjectID,
      quarter,
      classRecordID,
      oldVal,
      newVal
    } = options;
    if (showLog) {
      const name = await utils.getAccountName(accountID);
      const section = await utils.getSectionName(sectionID);
      const subject = await utils.getSubjectCode(subjectID);
      ActivityLog.create({
        type,
        classRecordID,
        position,
        name,
        section,
        subject,
        quarter,
        timestamp: new Date()
      }).then(async al => {
        LogDetails.create({
          logID: al.logID,
          description: `Updated transmutation from ${oldVal}% to ${newVal}%`
        });
      });
    } else {
      // Do nothing
    }
  });

  Grade.addHook("afterCreate", async (grade, options) => {
    const {
      showLog,
      logID,
      subsectstudID,
      componentID,
      subcompID,
      value
    } = options;
    if (showLog) {
      const student = await utils.getStudentNameBySubsectstudID(subsectstudID);
      const component = await utils.getComponentName(componentID);
      const subcomponent = await utils.getSubcomponentName(subcompID);
      const oldValue = -1;
      const newValue = value;
      LogDetails.create({
        logID,
        description: "Grade added",
        student,
        component,
        subcomponent,
        oldValue,
        newValue
      });
    } else {
    }
  });

  Grade.addHook("afterDestroy", async (grade, options) => {
    const {
      showLog,
      logID,
      subsectstudID,
      componentID,
      subcompID,
      value
    } = options;
    if (showLog) {
      const student = await utils.getStudentNameBySubsectstudID(subsectstudID);
      const component = await utils.getComponentName(componentID);
      const subcomponent = await utils.getSubcomponentName(subcompID);
      const oldValue = value;
      const newValue = -1;
      LogDetails.create({
        logID,
        description: "Grade deleted",
        student,
        component,
        subcomponent,
        oldValue,
        newValue
      });
    } else {
    }
  });

  Grade.addHook("afterUpdate", async (grade, options) => {
    const {
      showLog,
      logID,
      subsectstudID,
      componentID,
      subcompID,
      oldValue,
      newValue,
      description
    } = options;
    if (showLog) {
      const student = await utils.getStudentNameBySubsectstudID(subsectstudID);
      const component = await utils.getComponentName(componentID);
      const subcomponent = await utils.getSubcomponentName(subcompID);
      if (oldValue != newValue) {
        await LogDetails.create({
          logID,
          description: `Grade updated in '${description}'`,
          student,
          component,
          subcomponent,
          oldValue,
          newValue
        });
      }
    } else {
    }
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
  await activitylogERD();
  await studentgradesERD();
  await hooks();
};
