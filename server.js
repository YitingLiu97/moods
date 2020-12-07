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
    res.send(JSON.stringify(files));
  });

});

// Upload post route
app.post("/upload", (req, res) => {
  const { image } = req.body;
  var base64Data = image.replace(/^data:image\/png;base64,/, "");

  let id = Math.random()
    .toFixed(8)
    .toString()
    .slice(2);

  fs.writeFile(`${upload_folder}/${id}.png`, base64Data, "base64", err =>
    console.log(err)
  );

  res.json({ id: id });
  console.log("saved " + id);
});

// Server listener
app.listen(port);
console.log("Your app is listening on port " + port);
