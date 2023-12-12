const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session");
const route = require("./server/routes/userRouter");

const connectDB = require("./server/database/connection");

const app = express();

dotenv.config({ path: "config.env" });
const PORT = process.env.PORT || 8080;

// log requestsq
// app.use(morgan('tiny')); debug propuse

// app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "key",
    resave: true,
    saveUninitialized: true,
    email:""
  })
);

//clear cache
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

// mongodb connection
connectDB();

// parse request to body-parser
app.use(express.urlencoded({ extended: true }));

// set view engine
app.set("view engine", "ejs");
// app.set('views' ,path.resolve(__dirname, "views/ejs"));

// load assets
app.use("/css", express.static(path.resolve(__dirname, "assets/css")));
app.use("/images", express.static(path.resolve(__dirname, "assets/img")));
app.use("/js", express.static(path.resolve(__dirname, "assets/js")));
app.use("/fonts", express.static(path.resolve(__dirname, "assets/fonts")));
app.use("/primg", express.static(path.resolve(__dirname, "images")));

// load routers
app.use("/", require("./server/routes/userRouter"));
app.use("/", require("./server/routes/adminRouter"));

app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);
