const express = require('express')
const path = require('path')
const fs= require('fs')
let formidable = require('formidable');


const app = express()
const port = 3000


app.use(express.static(path.join(__dirname, "/public")));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,"index.html"))
})

app.post('/submit', (req, res) => {
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
  const python = spawn('python', ['script1.py']);
  // collect data from script
  python.stdout.on('data', function (data) {
    console.log('Pipe data from python script ...');
    dataToSend = data.toString();
  });
  // in close event we are sure that stream from child process is closed
  python.on('close', (code) => {
  console.log(`child process close all stdio with code ${code}`);
  // send data to browser
  res.send(dataToSend)
  });

  res.write('File uploaded and moved!');
  return res.end();
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})