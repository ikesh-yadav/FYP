const express = require('express')
const path = require('path')
const fs= require('fs')
const { spawn } = require('child_process');
let formidable = require('formidable');


const app = express()
const port = 3000


app.use(express.static(path.join(__dirname, "/public")));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,"index.html"))
})

app.post('/submit', (req, res) => {
  console.log("Received a post to /submit");
  let form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    //console.log(files)
    let cieoldpath = files.cie_file.path;
    let sfdoldpath = files.student_feedback_file.path;
    let tfdoldpath = files.teacher_feedback_file.path;
    fs.rename(cieoldpath, "./data/cie1.csv", function (err) {
      if (err) throw err;
    });
    fs.rename(sfdoldpath, "./data/StudentFeedback2.csv", function (err) {
      if (err) throw err;
    });
    fs.rename(tfdoldpath, "./data/TeacherFeedback2.csv", function (err) {
      if (err) throw err;
    });
  })
  
  var dataToSend;
  // spawn new child process to call the python script
  const python = spawn('python', ['final_year_project.py']);
  // collect data from script
  python.stdout.on('data', function (data) {
    console.log('Pipe data from python script ...');
    dataToSend = data.toString();
    console.log(dataToSend);
  });
  // in close event we are sure that stream from child process is closed
  python.on('close', (code) => {
  console.log(`child process close all stdio with code ${code}`);
    //send data to browser
    //res.send(dataToSend)
    res.status(200).send("success");
  });
  
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})