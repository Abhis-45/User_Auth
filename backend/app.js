require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const userRoutes = require("./Routes/user");
const app = express();
const cors = require("cors");
require("./db/conn");
const { v4: uuidv4 } = require("uuid");

const PORT = process.env.PORT || 4002;

app.use(express.json());
app.use(bodyParser.json());
app.use("/images", express.static(path.join(__dirname, "uploads")));
app.use(userRoutes);

app.use(cors({
origin: ["https://user-auth-ui.vercel.app"],
methods: ("POST","GET"),
credentials: true
}));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

app.use("/user", upload.single("image"), userRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.get("/hello", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Server start at Port No :${PORT}`);
  console.log(`Server is running on http://localhost:${PORT}`);
});
