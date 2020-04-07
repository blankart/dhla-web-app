const express = require("express");
const router = express.Router();
const UserAccount = require("../../models/UserAccount");
const Nonacademic = require("../../models/Nonacademic");
const Teacher = require("../../models/Teacher");
const Student = require("../../models/Student");
const ParentGuardian = require("../../models/ParentGuardian");
const Subject = require("../../models/Subject");
const Component = require("../../models/Component");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const key = require("../../config/key");
const passport = require("passport");
const multer = require("multer");
const fs = require("fs");

// Input Validation
const validateAdminCreateInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const validateChangePassword = require("../../validation/password");
const isEmpty = require("../../validation/is-empty");

//Import Utility Functions
const utils = require("../../utils");

// @route POST api/users/createAdmin
// @desc Initializing admin account. Will be deleted afterwards
// @access Private

router.post("/createAdmin", (req, res) => {
  const { email, password } = req.body;
  const { errors, isValid } = validateAdminCreateInput(req.body);

  // Validation Process
  if (!isValid) {
    return res.status(400).json(errors);
  }

  UserAccount.findOne({
    where: {
      email
    }
  }).then(user => {
    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    } else {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) throw err;
          console.log(hash);
          utils
            .createUser({
              email,
              password: hash,
              isActive: 1,
              position: 0
            })
            .then(user => {
              utils
                .createNonAcademic({
                  accountID: user.accountID
                })
                .then(user => {
                  res.json({ msg: "Account created successfully!" });
                });
            });
        });
      });
    }
  });
});

// @route POST api/users/login
// @desc Login user account
// @access Public

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }
  if (email && password) {
    UserAccount.findOne({
      where: {
        email
      }
    }).then(user => {
      if (!user) {
        errors.email = "User account not found!";
        res.status(400).json(errors);
      } else {
        bcrypt.compare(password, user.password).then(isMatch => {
          if (isMatch) {
            switch (user.position) {
              case false:
              case true:
              case 2:
                Nonacademic.findOne({
                  where: { accountID: user.accountID }
                }).then(user2 => {
                  const payload = {
                    accountID: user.accountID,
                    email: user.email,
                    position: user.position,
                    facultyID: user2.facultyID
                  };

                  if (!user.isActive) {
                    errors.isActive =
                      "Account is disabled. Please contact your system administrator.";
                    res.status(400).json(errors);
                  }

                  // Sign Nonacademic Token
                  jwt.sign(
                    payload,
                    key.secretKey,
                    { expiresIn: 100000 },
                    (err, token) => {
                      res.json({
                        token: "Bearer " + token
                      });
                    }
                  );
                });
                break;
              case 3:
                Teacher.findOne({
                  where: { accountID: user.accountID }
                }).then(user2 => {
                  const payload = {
                    accountID: user.accountID,
                    email: user.email,
                    position: user.position,
                    teacherID: user2.teacherID,
                    isAdviser: user2.isAdviser
                  };

                  if (!user.isActive) {
                    errors.isActive =
                      "Account is disabled. Please contact your system administrator.";
                    res.status(400).json(errors);
                  }

                  // Sign Teacher Token
                  jwt.sign(
                    payload,
                    key.secretKey,
                    { expiresIn: 3600 },
                    (err, token) => {
                      res.json({
                        token: "Bearer " + token
                      });
                    }
                  );
                });
                break;
              case 4:
                Student.findOne({
                  where: { accountID: user.accountID }
                }).then(user2 => {
                  const payload = {
                    accountID: user.accountID,
                    email: user.email,
                    position: user.position,
                    studentID: user2.studentID
                  };

                  if (!user.isActive) {
                    errors.isActive =
                      "Account is disabled. Please contact your system administrator.";
                    res.status(400).json(errors);
                  }

                  // Sign Student Token
                  jwt.sign(
                    payload,
                    key.secretKey,
                    { expiresIn: 3600 },
                    (err, token) => {
                      res.json({
                        token: "Bearer " + token
                      });
                    }
                  );
                });
                break;
              case 5:
                ParentGuardian.findOne({
                  where: { accountID: user.accountID }
                }).then(user2 => {
                  const payload = {
                    accountID: user.accountID,
                    email: user.email,
                    position: user.position,
                    parentID: user2.parentID
                  };

                  if (!user.isActive) {
                    errors.isActive =
                      "Account is disabled. Please contact your system administrator.";
                    res.status(400).json(errors);
                  }

                  // Sign ParentGuardian Token
                  jwt.sign(
                    payload,
                    key.secretKey,
                    { expiresIn: 3600 },
                    (err, token) => {
                      res.json({
                        token: "Bearer " + token
                      });
                    }
                  );
                });
                break;
              default:
                res.json(400);
            }
          } else {
            errors.password = "Password incorrect";
            return res.status(400).json(errors);
          }
        });
      }
    });
  }
});

// @route GET api/users/profile
// @desc Get all personal information
// @access Private

router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { accountID, position } = req.user;
    UserAccount.findOne({ where: { accountID } }).then(user => {
      const payload = {
        firstName: user.firstName,
        lastName: user.lastName,
        middleName: user.middleName,
        suffix: user.suffix,
        nickname: user.nickname,
        imageUrl: user.imageUrl,
        contactNum: user.contactNum,
        address: user.address,
        province: user.province,
        city: user.city,
        region: user.region,
        zipcode: user.zipcode,
        civilStatus: user.civilStatus,
        sex: user.sex,
        citizenship: user.citizenship,
        birthDate: user.birthDate,
        birthPlace: user.birthPlace,
        religion: user.religion,
        emergencyName: user.emergencyName,
        emergencyAddress: user.emergencyAddress,
        emergencyTelephone: user.emergencyTelephone,
        emergencyCellphone: user.emergencyCellphone,
        emergencyEmail: user.emergencyEmail,
        emergencyRelationship: user.emergencyRelationship
      };
      if (position == false || position == true || position == 2) {
        // Get Nonacademic's Profile
        Nonacademic.findOne({ where: { accountID } }).then(user2 => {
          res.json({ ...payload, facultyID: user2.faultyID });
        });
      } else if (position == 3) {
        // Get Teacher's Profile
        Teacher.findOne({ where: { accountID } }).then(user2 => {
          res.json({
            ...payload,
            teacherID: user2.teacherID,
            isActiver: user2.isAdviser
          });
        });
      } else if (position == 4) {
        // Get Student's Profile
        Student.findOne({ where: { accountID } }).then(user2 => {
          res.json({
            ...payload,
            studentID: user2.studentID,
            fatherName: user2.fatherName,
            fatherAddress: user2.fatherAddress,
            fatherEmail: user2.fatherEmail,
            fatherOccupation: user2.fatherOccupation,
            fatherEmployer: user2.fatherEmployer,
            fatherBusinessAdd: user2.fatherBusinessAdd,
            fatherOfficeNum: user2.fatherOfficeNum,
            motherName: user2.motherName,
            motherAddress: user2.motherAddress,
            motherEmail: user2.motherEmail,
            motherOccupation: user2.motherOccupation,
            motherEmployer: user2.motherEmployer,
            motherBusinessAdd: user2.motherBusinessAdd,
            motherOfficeNum: user2.motherOfficeNum
          });
        });
      } else {
        // Get Parent's Profile
        ParentGuardian.findOne({ where: { accountID } }).then(user2 => {
          res.json({
            ...payload,
            parentID: user2.parentID,
            studentID: user.studentID
          });
        });
      }
    });
  }
);

// @route POST api/users/upload
// @desc Upload photo
// @access Private

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images");
  },
  filename: (req, file, cb) => {
    console.log(file);
    var filetype = "";
    if (file.mimetype === "image/gif") {
      filetype = "gif";
    }
    if (file.mimetype === "image/png") {
      filetype = "png";
    }
    if (file.mimetype === "image/jpeg") {
      filetype = "jpg";
    }
    cb(null, "image-" + Date.now() + "." + filetype);
  }
});

const upload = multer({ storage });
router.post(
  "/upload",
  upload.single("file"),
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    if (!req.file) {
      res.status(500);
    } else {
      console.log(req.user.accountID);
      const { accountID } = req.user;
      UserAccount.findOne({ where: { accountID } }).then(user => {
        try {
          fs.unlinkSync(`./public/${user.imageUrl}`);
        } catch (err) {
          console.log(err);
        }
        user
          .update({ imageUrl: "images/" + req.file.filename })
          .then(result => {
            res.status(200).json({ msg: "Success" });
          });
      });
    }
  }
);

// @route POST api/users/changepassword
// @desc Change password
// @access Private

router.post(
  "/changepassword",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { password, currentPassword } = req.body;
    const { errors, isValid } = validateChangePassword(req.body);

    UserAccount.findOne({
      where: {
        accountID: req.user.accountID
      }
    }).then(user => {
      bcrypt.compare(currentPassword, user.password).then(isMatch => {
        if (isMatch) {
          if (!isValid) {
            return res.status(400).json(errors);
          }
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
              if (err) throw err;
              user.update({ password: hash }).then(() => {
                res.status(200).json({ msg: "Password updated successfully!" });
              });
            });
          });
        } else {
          errors.currentPassword = isEmpty(currentPassword)
            ? "Current password field is required"
            : "Password incorrect";
          return res.status(400).json(errors);
        }
      });
    });
  }
);

// @route GET api/users/populateweights
// @desc Populate component weights for all defined subjects
// @access Public

router.get("/populateweights", (req, res) => {
  const nonSHSLanguageIDs = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23
  ];
  const nonSHSAPIDs = [42, 43, 44, 45, 46, 47, 48, 49, 50, 51];
  const nonSHSEsPIDs = [52, 53, 54, 55, 56, 57, 58, 59, 60, 61];
  const nonSHSScienceIDs = [34, 35, 36, 37, 38, 39, 40, 41];
  const nonSHSMathIDs = [24, 25, 26, 27, 28, 29, 30, 31, 32, 33];
  const nonSHSMAPEHIDs = [
    62,
    63,
    64,
    65,
    66,
    67,
    68,
    69,
    70,
    71,
    72,
    73,
    74,
    75,
    76,
    77,
    78,
    79,
    80,
    81,
    82,
    83,
    84,
    85,
    86,
    87,
    88,
    89,
    90,
    91,
    92,
    93,
    94,
    95,
    96,
    97,
    98,
    99,
    100,
    101
  ];
  const nonSHSEPPTLEIDs = [102, 103, 104, 105, 106, 107, 108];
  const SHSCoreIDs = [
    109,
    110,
    111,
    112,
    113,
    114,
    115,
    116,
    117,
    118,
    119,
    120,
    121,
    122,
    123,
    124,
    125
  ];
  const SHSAcadSpecializedIDs = [];
  const SHSAcadAppliedIDs = [];
  const SHSTVLSpecializedIDs = [];
  const SHSTVLAppliedIDs = [];
  const SHSSportsSpecializedIDs = [];
  const SHSSportsAppliedIDs = [];
  const SHSAADSpecializedIDs = [];
  const SHSAADAppliedIDs = [];

  let i = 0;
  for (i = 0; i < nonSHSLanguageIDs.length; i++) {
    Component.create({
      subjectID: nonSHSLanguageIDs[i],
      component: "FA",
      compWeight: 0
    });
    Component.create({
      subjectID: nonSHSLanguageIDs[i],
      component: "WW",
      compWeight: 30
    });
    Component.create({
      subjectID: nonSHSLanguageIDs[i],
      component: "PT",
      compWeight: 50
    });
    Component.create({
      subjectID: nonSHSLanguageIDs[i],
      component: "QE",
      compWeight: 20
    });
  }
  for (i = 0; i < nonSHSAPIDs.length; i++) {
    Component.create({
      subjectID: nonSHSAPIDs[i],
      component: "FA",
      compWeight: 0
    });
    Component.create({
      subjectID: nonSHSAPIDs[i],
      component: "WW",
      compWeight: 30
    });
    Component.create({
      subjectID: nonSHSAPIDs[i],
      component: "PT",
      compWeight: 50
    });
    Component.create({
      subjectID: nonSHSAPIDs[i],
      component: "QE",
      compWeight: 20
    });
  }
  for (i = 0; i < nonSHSEsPIDs.length; i++) {
    Component.create({
      subjectID: nonSHSEsPIDs[i],
      component: "FA",
      compWeight: 0
    });
    Component.create({
      subjectID: nonSHSEsPIDs[i],
      component: "WW",
      compWeight: 30
    });
    Component.create({
      subjectID: nonSHSEsPIDs[i],
      component: "PT",
      compWeight: 50
    });
    Component.create({
      subjectID: nonSHSEsPIDs[i],
      component: "QE",
      compWeight: 20
    });
  }
  for (i = 0; i < nonSHSScienceIDs.length; i++) {
    Component.create({
      subjectID: nonSHSScienceIDs[i],
      component: "FA",
      compWeight: 0
    });
    Component.create({
      subjectID: nonSHSScienceIDs[i],
      component: "WW",
      compWeight: 40
    });
    Component.create({
      subjectID: nonSHSScienceIDs[i],
      component: "PT",
      compWeight: 40
    });
    Component.create({
      subjectID: nonSHSScienceIDs[i],
      component: "QE",
      compWeight: 20
    });
  }
  for (i = 0; i < nonSHSMathIDs.length; i++) {
    Component.create({
      subjectID: nonSHSMathIDs[i],
      component: "FA",
      compWeight: 0
    });
    Component.create({
      subjectID: nonSHSMathIDs[i],
      component: "WW",
      compWeight: 40
    });
    Component.create({
      subjectID: nonSHSMathIDs[i],
      component: "PT",
      compWeight: 40
    });
    Component.create({
      subjectID: nonSHSMathIDs[i],
      component: "QE",
      compWeight: 20
    });
  }
  for (i = 0; i < nonSHSMAPEHIDs.length; i++) {
    Component.create({
      subjectID: nonSHSMAPEHIDs[i],
      component: "FA",
      compWeight: 0
    });
    Component.create({
      subjectID: nonSHSMAPEHIDs[i],
      component: "WW",
      compWeight: 20
    });
    Component.create({
      subjectID: nonSHSMAPEHIDs[i],
      component: "PT",
      compWeight: 60
    });
    Component.create({
      subjectID: nonSHSMAPEHIDs[i],
      component: "QE",
      compWeight: 20
    });
  }
  for (i = 0; i < nonSHSEPPTLEIDs.length; i++) {
    Component.create({
      subjectID: nonSHSEPPTLEIDs[i],
      component: "FA",
      compWeight: 0
    });
    Component.create({
      subjectID: nonSHSEPPTLEIDs[i],
      component: "WW",
      compWeight: 20
    });
    Component.create({
      subjectID: nonSHSEPPTLEIDs[i],
      component: "PT",
      compWeight: 60
    });
    Component.create({
      subjectID: nonSHSEPPTLEIDs[i],
      component: "QE",
      compWeight: 20
    });
  }
  for (i = 0; i < SHSCoreIDs.length; i++) {
    Component.create({
      subjectID: SHSCoreIDs[i],
      component: "FA",
      compWeight: 0
    });
    Component.create({
      subjectID: SHSCoreIDs[i],
      component: "WW",
      compWeight: 25
    });
    Component.create({
      subjectID: SHSCoreIDs[i],
      component: "PT",
      compWeight: 50
    });
    Component.create({
      subjectID: SHSCoreIDs[i],
      component: "QE",
      compWeight: 25
    });
  }
  for (i = 0; i < SHSAcadSpecializedIDs.length; i++) {
    Component.create({
      subjectID: SHSAcadSpecializedIDs[i],
      component: "FA",
      compWeight: 0
    });
    Component.create({
      subjectID: SHSAcadSpecializedIDs[i],
      component: "WW",
      compWeight: 25
    });
    Component.create({
      subjectID: SHSAcadSpecializedIDs[i],
      component: "PT",
      compWeight: 45
    });
    Component.create({
      subjectID: SHSAcadSpecializedIDs[i],
      component: "QE",
      compWeight: 30
    });
  }
  for (i = 0; i < SHSAcadAppliedIDs.length; i++) {
    Component.create({
      subjectID: SHSAcadAppliedIDs[i],
      component: "FA",
      compWeight: 0
    });
    Component.create({
      subjectID: SHSAcadAppliedIDs[i],
      component: "WW",
      compWeight: 35
    });
    Component.create({
      subjectID: SHSAcadAppliedIDs[i],
      component: "PT",
      compWeight: 40
    });
    Component.create({
      subjectID: SHSAcadAppliedIDs[i],
      component: "QE",
      compWeight: 25
    });
  }
  for (i = 0; i < SHSTVLSpecializedIDs.length; i++) {
    Component.create({
      subjectID: SHSTVLSpecializedIDs[i],
      component: "FA",
      compWeight: 0
    });
    Component.create({
      subjectID: SHSTVLSpecializedIDs[i],
      component: "WW",
      compWeight: 20
    });
    Component.create({
      subjectID: SHSTVLSpecializedIDs[i],
      component: "PT",
      compWeight: 60
    });
    Component.create({
      subjectID: SHSTVLSpecializedIDs[i],
      component: "QE",
      compWeight: 20
    });
  }
  for (i = 0; i < SHSTVLAppliedIDs.length; i++) {
    Component.create({
      subjectID: SHSTVLAppliedIDs[i],
      component: "FA",
      compWeight: 0
    });
    Component.create({
      subjectID: SHSTVLAppliedIDs[i],
      component: "WW",
      compWeight: 20
    });
    Component.create({
      subjectID: SHSTVLAppliedIDs[i],
      component: "PT",
      compWeight: 60
    });
    Component.create({
      subjectID: SHSTVLAppliedIDs[i],
      component: "QE",
      compWeight: 20
    });
  }
  for (i = 0; i < SHSSportsAppliedIDs.length; i++) {
    Component.create({
      subjectID: SHSSportsAppliedIDs[i],
      component: "FA",
      compWeight: 0
    });
    Component.create({
      subjectID: SHSSportsAppliedIDs[i],
      component: "WW",
      compWeight: 20
    });
    Component.create({
      subjectID: SHSSportsAppliedIDs[i],
      component: "PT",
      compWeight: 60
    });
    Component.create({
      subjectID: SHSSportsAppliedIDs[i],
      component: "QE",
      compWeight: 20
    });
  }
  for (i = 0; i < SHSSportsSpecializedIDs.length; i++) {
    Component.create({
      subjectID: SHSSportsSpecializedIDs[i],
      component: "FA",
      compWeight: 0
    });
    Component.create({
      subjectID: SHSSportsSpecializedIDs[i],
      component: "WW",
      compWeight: 20
    });
    Component.create({
      subjectID: SHSSportsSpecializedIDs[i],
      component: "PT",
      compWeight: 60
    });
    Component.create({
      subjectID: SHSSportsSpecializedIDs[i],
      component: "QE",
      compWeight: 20
    });
  }
  for (i = 0; i < SHSAADAppliedIDs.length; i++) {
    Component.create({
      subjectID: SHSAADAppliedIDs[i],
      component: "FA",
      compWeight: 0
    });
    Component.create({
      subjectID: SHSAADAppliedIDs[i],
      component: "WW",
      compWeight: 20
    });
    Component.create({
      subjectID: SHSAADAppliedIDs[i],
      component: "PT",
      compWeight: 60
    });
    Component.create({
      subjectID: SHSAADAppliedIDs[i],
      component: "QE",
      compWeight: 20
    });
  }
  for (i = 0; i < SHSAADSpecializedIDs.length; i++) {
    Component.create({
      subjectID: SHSAADSpecializedIDs[i],
      component: "FA",
      compWeight: 0
    });
    Component.create({
      subjectID: SHSAADSpecializedIDs[i],
      component: "WW",
      compWeight: 20
    });
    Component.create({
      subjectID: SHSAADSpecializedIDs[i],
      component: "PT",
      compWeight: 60
    });
    Component.create({
      subjectID: SHSAADSpecializedIDs[i],
      component: "QE",
      compWeight: 20
    });
  }
});

module.exports = router;
