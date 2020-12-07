const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const port = process.env.PORT||8080;
const app = express();

const upload_folder = "tmp";
app.use(express.static("src"));

// app.use(bodyParser.json());
app.use(bodyParser.json({limit: '5mb', extended: true}));//avoid payload too large issue 
app.use("/uploaded", express.static(upload_folder));
app.use('/src', express.static('src'));
app.use('/tmp', express.static('tmp'));
app.use('/assets', express.static('assets'));
app.get('/', function(req, res){
  res.sendFile(__dirname+'/index.html'); // change the path to your index.html
});

// // get list of posts
app.get("/posts", (req, res) => {
  fs.promises.readdir(upload_folder).then(files => {  
    console.log(JSON.stringify(files.sort()));

    //reverse shows the latested on top 
    res.send(JSON.stringify(files.sort()));
  });

});

// Upload post route
app.post("/upload", (req, res) => {
  const { image } = req.body;
  var base64Data = image.replace(/^data:image\/png;base64,/, "");

  let idTime = new Date();

//append 0 before to make 2 digits [https://stackoverflow.com/questions/8043026/how-to-format-numbers-by-prepending-0-to-single-digit-numbers]
  let y = idTime.getFullYear();
  let month = ("0" + idTime.getMonth()).slice(-2);
  let day = ("0" + idTime.getDate()).slice(-2);
  let h = ("0" + idTime.getHours()).slice(-2);
  let m = ("0" + idTime.getMinutes()).slice(-2);
  let s = ("0" + idTime.getSeconds()).slice(-2);

  let id = `${y}-${month}-${day}-${h}-${m}-${s}`;
  
  console.log("id", id)
  // let id = Math.random()
  //   .toFixed(8)
  //   .toString()
  //   .slice(2);

  fs.writeFile(`${upload_folder}/${id}.png`, base64Data, "base64", err =>
    console.log(err)
  );

  res.json({ id: id });
  console.log("saved " + id);
});

// Server listener
app.listen(port);
console.log("Your app is listening on port " + port);
