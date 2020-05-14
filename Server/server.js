// Import Dependencies

const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require("cors");

// Import Models (Database table names)
const databaseTable = require("./config/erd");
const app = express();

//Enable CORS policy
app.use(cors());
// Body-parser middleware
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

//MySQL Connection Configuration
const sequelize = require("./config/db/database");
sequelize
  .authenticate()
  .then(() => console.log("Connection has been established successfully."))
  .catch(() => console.error("Unable to connect to the database."));

// Create/Sync MySQL table names from models
databaseTable.init();

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
const cashier = require("./routes/api/cashier");
const student = require("./routes/api/student");
app.use("/api/users", users);
app.use("/api/admin", admin);
app.use("/api/teacher", teacher);
app.use("/api/director", director);
app.use("/api/registrar", registrar);
app.use("/api/parent", parent);
app.use("/api/cashier", cashier);
app.use("/api/student", student);
app.use(express.static(__dirname + "/public"));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log("Server is running on localhost:5000"));
