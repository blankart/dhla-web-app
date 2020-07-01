const passportJWT = require("passport-jwt");
const key = require("../config/key");
const UserAccount = require("../models/UserAccount");

let ExtractJWT = passportJWT.ExtractJwt;

let JwtStrategy = passportJWT.Strategy;
let jwtOptions = {};

jwtOptions.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = key.secretKey;

module.exports = passport => {
  passport.use(
    "jwt",
    new JwtStrategy(jwtOptions, function(jwt_payload, next) {
      UserAccount.findOne({ where: { email: jwt_payload.email } })
        .then(user => {
          if (user) {
            return next(null, user);
          }
          return next(null, false);
        })
        .catch(err => console.log(err));
    })
  );

  passport.use(
    "admin",
    new JwtStrategy(jwtOptions, (jwt_payload, next) => {
      UserAccount.findOne({
        where: { email: jwt_payload.email, position: "0" }
      }).then((user, err) => {
        if (user) {
          next(null, user);
        } else {
          next(null, false);
        }
      });
    })
  );

  passport.use(
    "director",
    new JwtStrategy(jwtOptions, (jwt_payload, next) => {
      UserAccount.findOne({
        where: { email: jwt_payload.email, position: "1" }
      }).then((user, err) => {
        if (user) {
          next(null, user);
        } else {
          next(null, false);
        }
      });
    })
  );

  passport.use(
    "registrar",
    new JwtStrategy(jwtOptions, (jwt_payload, next) => {
      UserAccount.findOne({
        where: { email: jwt_payload.email, position: "2" }
      }).then((user, err) => {
        if (user) {
          next(null, user);
        } else {
          next(null, false);
        }
      });
    })
  );

  passport.use(
    "teacher",
    new JwtStrategy(jwtOptions, (jwt_payload, next) => {
      UserAccount.findOne({
        where: { email: jwt_payload.email, position: "3" }
      }).then((user, err) => {
        if (user) {
          next(null, user);
        } else {
          next(null, false);
        }
      });
    })
  );

  passport.use(
    "student",
    new JwtStrategy(jwtOptions, (jwt_payload, next) => {
      UserAccount.findOne({
        where: { email: jwt_payload.email, position: "4" }
      }).then((user, err) => {
        if (user) {
          next(null, user);
        } else {
          next(null, false);
        }
      });
    })
  );

  passport.use(
    "guardian",
    new JwtStrategy(jwtOptions, (jwt_payload, next) => {
      UserAccount.findOne({
        where: { email: jwt_payload.email, position: "5" }
      }).then((user, err) => {
        if (user) {
          next(null, user);
        } else {
          next(null, false);
        }
      });
    })
  );

  passport.use(
    "cashier",
    new JwtStrategy(jwtOptions, (jwt_payload, next) => {
      UserAccount.findOne({
        where: { email: jwt_payload.email, position: "6" }
      }).then((user, err) => {
        if (user) {
          next(null, user);
        } else {
          next(null, false);
        }
      });
    })
  );
};
