// Import Dependencies

const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");

// Import Models (Database table names)
const UserAccount = require("./models/UserAccount");
const Nonacademic = require("./models/Nonacademic");
const Student = require("./models/Student");
const ParentGuardian = require("./models/ParentGuardian");
const Teacher = require("./models/Teacher");
const Category = require("./models/Category");
const Grade = require("./models/Grade");
const GradeLevel = require("./models/GradeLevel");
const GradeSheet = require("./models/GradeSheet");
const Section = require("./models/Section");
const Subject = require("./models/Subject");
const SubCategory = require("./models/SubCategory");
const SubComponentWeight = require("./models/SubComponentWeight");
const ComponentWeight = require("./models/ComponentWeight");
const AdvisoryTable = require("./models/AdvisoryTable");
const AttendanceLog = require("./models/AttendanceLog");
const TeacherLoad = require("./models/TeacherLoad");
const SubmissionDeadline = require("./models/SubmissionDeadline");

const app = express();

// Body-parser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

// MySQL Connection Configuration
const sequelize = require("./config/db/database");
sequelize
  .authenticate()
  .then(() => console.log("Connection has been established successfully."))
  .catch(err => console.error("Unable to connect to the database."));

// Create/Sync MySQL table names from models

// user account ERD
Nonacademic.belongsTo(UserAccount, { foreignKey: "accountID" });
UserAccount.hasOne(Nonacademic, { foreignKey: "accountID" });
UserAccount.hasOne(Student, { foreignKey: "accountID" });
UserAccount.hasOne(ParentGuardian, { foreignKey: "accountID" });
UserAccount.hasOne(Teacher, { foreignKey: "accountID" });
Student.belongsTo(UserAccount, { foreignKey: "accountID" });
ParentGuardian.belongsTo(UserAccount, { foreignKey: "accountID" });
Teacher.belongsTo(UserAccount, { foreignKey: "accountID" });
UserAccount.sync({ force: false }).then(() => {
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

// subcomponent weight ERD
Category.hasMany(SubComponentWeight, { foreignKey: "categoryID" });
SubCategory.hasMany(SubComponentWeight, { foreignKey: "subCategID" });
GradeSheet.hasMany(SubComponentWeight, { foreignKey: "gradeSheetID" });
SubCategory.sync({ force: false }).then(() => {
  SubComponentWeight.sync({ force: false }).then(() => {
    console.log("subcomponent weight table created/synced");
  });
});

// component weight ERD

Category.hasMany(ComponentWeight, { foreignKey: "categoryID" });
Subject.hasMany(ComponentWeight, { foreignKey: "subjectID" });
ComponentWeight.sync({ force: false }).then(() => {
  console.log("component weight table created/synced");
});

// grade sheet ERD

Category.sync({ force: false }).then(() => {
  console.log("category table created/synced");
  Subject.sync({ force: false }).then(() => {
    console.log("subject table created/synced");
    GradeLevel.hasMany(Section, { foreignKey: "gradeLevelID" });
    GradeLevel.sync({ force: false }).then(() => {
      console.log("grade level table created/synced");
      GradeLevel.hasMany(GradeSheet, { foreignKey: "gradeLevelID" });
      Section.hasMany(GradeSheet, { foreignKey: "sectionID" });
      Section.sync({ force: false }).then(() => {
        console.log("section table created/synced");
        Subject.hasMany(GradeSheet, { foreignKey: "subjectID" });
        Teacher.hasMany(GradeSheet, { foreignKey: "teacherID" });
        GradeSheet.sync({ force: false }).then(() => {
          console.log("grade sheet table created/synced");
          Category.hasMany(Grade, { foreignKey: "categoryID" });
          Student.hasMany(Grade, { foreignKey: "studentID" });
          GradeSheet.hasMany(Grade, { foreignKey: "gradeSheetID" });
          Grade.sync({ force: false }).then(() => {
            console.log("grade table created/synced");
          });
        });
      });
    });
  });
});

// advisory table ERD

GradeLevel.hasMany(AdvisoryTable, { foreignKey: "gradeLevelID" });
Section.hasMany(AdvisoryTable, { foreignKey: "sectionID" });
Teacher.hasMany(AdvisoryTable, { foreignKey: "teacherID" });
AdvisoryTable.sync({ force: false }).then(() => {
  console.log("advisory table created/synced");
});

// attendance log ERD

Student.hasMany(AttendanceLog, { foreignKey: "studentID" });
Teacher.hasMany(AttendanceLog, { foreignKey: "teacherID" });
AttendanceLog.sync({ force: false }).then(() => {
  console.log("attendance log table created/synced");
});

// teacher load ERD

Subject.hasMany(TeacherLoad, { foreignKey: "subjectID" });
Teacher.hasMany(TeacherLoad, { foreignKey: "teacherID" });
Section.hasMany(TeacherLoad, { foreignKey: "sectionID" });
TeacherLoad.sync({ force: false }).then(() => {
  console.log("teacher load table created/synced");
});

// submission deadline ERD

Teacher.hasMany(SubmissionDeadline, { foreignKey: "teacherID" });
SubmissionDeadline.sync({ force: false }).then(() => {
  console.log("submission deadline table created/synced");
});

// Passport middleware initialization
app.use(passport.initialize());
require("./config/passport")(passport);

// Routers
const users = require("./routes/api/users");
const admin = require("./routes/api/admin");
const teacher = require("./routes/api/teacher");
const director = require("./routes/api/director");
const registrar = require("./routes/api/registrar");
const parent = require("./routes/api/parent");
app.use("/api/users", users);
app.use("/api/admin", admin);
app.use("/api/teacher", teacher);
app.use("/api/director", director);
app.use("/api/registrar", registrar);
app.use("/api/parent", parent);
app.use(express.static(__dirname + "/public"));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log("Server is running on localhost:5000"));
