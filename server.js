const express = require("express");
const path = require("path");
const { spawn } = require("child_process");
let formidable = require("formidable");
const mv = require("mv");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/submit", (req, res) => {
  console.log("Post /submit");
  const form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    //console.log(files)
    const cieoldpath = files.cie_file.path;
    const sfdoldpath = files.student_feedback_file.path;
    const tfdoldpath = files.teacher_feedback_file.path;
    const keyoldpath = files.key_file.path;

    mv(cieoldpath, "./data/cie1.csv", function (err) {
      if (err) throw err;
    });
    mv(sfdoldpath, "./data/StudentFeedback2.csv", function (err) {
      if (err) throw err;
    });
    mv(tfdoldpath, "./data/TeacherFeedback2.csv", function (err) {
      if (err) throw err;
    });
    mv(keyoldpath, "./data/key.csv", function (err) {
      if (err) throw err;
    });
  });

  var dataToSend;
  // spawn new child process to call the python script
  const python = spawn("python", ["final_year_project.py"]);
  // collect data from script
  python.stdout.on("data", function (data) {
    console.log("Pipe data from python script ...");
    dataToSend = data.toString();
    console.log(dataToSend);
  });
  // in close event we are sure that stream from child process is closed
  python.on("close", (code) => {
    console.log(`child process close all stdio with code ${code}`);
    //send data to browser
    //res.send(dataToSend)
    if(code===0) res.status(200).send("success");
    else res.status(500).send("Unable to process request")
  });
});

app.listen(port, () => {
  console.log(`App listening at Port:${port}`);
});
