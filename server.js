const express = require('express');
const app = express();
const port = 3000;
const bcrypt =require("bcrypt");
const dotenv = require('dotenv').config();
const { engine } = require('express-handlebars');
const path = require('path');
const mongoose = require("mongoose");
var bodyParser = require('body-parser')
var UserModel = require("./models/User").User;
var jsonParser = bodyParser.json() 
var urlencodedParser = bodyParser.urlencoded({ extended: false })
const uri = process.env.MONGOOSE_URI;

//setters
console.log(UserModel.create())
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

//middleware
app.use(jsonParser); 
app.use(urlencodedParser); 
app.use((req, res, next)=>{
  console.log(`${req.method} ${req.url}`);
  console.log("Request Body:");
  console.log(req.body);
  next();
})


//db
mongoose.set("strictQuery", false);
main().catch((err) => console.log(err));

async function main() {
  console.log("mongoose connected");
  await mongoose.connect(process.env.MONGOOSE_URI);
}



//routes
app.get('/', async (req, res) => {
  // const um = new UserModel({email:"k120", "password": "ddd", entries:[]})
  res.render('index', {title:"Basic Authentication REST API"}); 
});

app.post("/signup", async (req, res)=>{
  UserModel.findOne({email: req.body.email}).then((data)=>{
    if(data){
      console.log("user exists");
      res.json({"success": -1, message:"User already existsx"})
    } else {
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(req.body.password, 10, async function(err, hash) {
            user = new UserModel({email: req.body.email, password: hash, entries:[]});
            await user.save();
            console.log("user created");

        });
      });
      res.json({"success": 1, message:"User created. You may now log in."})
    }
  })
});


app.post("/login", async (req, res)=>{
  UserModel.findOne({email: req.body.email}).then((data)=>{
    if(data){
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(req.body.password,10, async function(err, hash) {
            let user = await UserModel.findOne({email: req.body.email});
            bcrypt.compare(req.body.password, user.password, function(err, result) {
              console.log("password: " + req.body.password);
              console.log("password hash: " + user.password); //$2b$09$cUggMpQl4BaLmpXY8Pnt1OU3rFI/5A943d2QgmSIIQ9R9p62x9ate
              console.log("password hashed: " + hash);
              console.log(result);
              if(result){
                res.json({...user, success:1, message:"Login Successful"});
              } else {
                res.json({"success": -1, message:"Login failed"})
              }
          });
        });
      });

    } 

  })
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
