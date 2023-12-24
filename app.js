const express=require('express');
const app=express();
const passport=require('passport');
const User=require('./models/user_model');
const Log=require('./models/log_model');
const connection=require('./connection');
//const logdb=require('./log_dbsetup');
const passportconfig=require('./passport-config');
const methodOverride=require('method-override');
var bodyParser = require('body-parser');
var localStorage = require('web-storage')().localStorage;
require('dotenv').config();

var ejsLayouts = require("express-ejs-layouts");
//const authRoutes=require('./routes/auth-routes_oauth')
app.use(bodyParser.urlencoded({ extended: false }));
const session=require('express-session');


connection();
app.use(express.urlencoded({extended:false}));
app.use(methodOverride('_method'));
app.set('view engine','ejs');
app.use(ejsLayouts);
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
  }));

app.use(passport.initialize());
app.use(passport.session());
app.set('layout','layout.ejs');

//app.set("layout home", false);
//app.use('/auth',authRoutes);


//GET
app.get('/',(req,res)=>{
    res.render('../views_rem/home',{user:req.user,layout:'../views_rem/home'});
})
app.get('/login',checkNotAuthenticated,(req,res)=>{
    res.render('../views_rem/login',{layout:'../views_rem/login'});
})
app.get('/register',checkNotAuthenticated,(req,res)=>{
    res.render('../views_rem/register',{layout:'../views_rem/register'});
})

app.get('/profile',checkAuthenticated,(req,res)=>{
  const myDate1= new Date();
  console.log("Full date " + myDate1);
  console.log(myDate1.toTimeString());
  localStorage.set("dt1",myDate1);
  //localStorage.set("date1",myDate1.toDateString());



    //console.log(req.user);
  res.render('profile',{user:req.user});
    
})

app.get('/page1',checkAuthenticated,(req,res)=>{
  console.log('Page 1 '+req.user.email);
  res.render('page1',{user:req.user,pass:'12349'});
  
});



app.get('/page2',checkAuthenticated,(req,res)=>{
  const myDate2= new Date();
//  var datestr=localStorage.get("dt1");
//  var dateorg=new Date(datestr);

  console.log("Page 2 start "+myDate2.toLocaleTimeString());
  //console.log(typeof(dateorg));

  //const time1=localStorage.get("dt1").toTimeString();
  //console.log("Time from second "+time1);
  //var timedif=myDate2.getTime()-time1;
  //console.log(`Diff in time ${timedif}`);

  //console.log('Page 2 '+req.user.email);
  res.render('page2',{user:req.user,pass:'#@!23'});
  
})

app.get('/page2topage3',checkAuthenticated,(req,res)=>{
res.redirect('/page4');
});

app.get('/page4',checkAuthenticated,async (req,res)=>{
  console.log('Page 4 '+req.user.email);
  const myDate3= new Date();
  
  try {
    const doc = await Log.findOneAndUpdate({ email: req.user.email }, { level2: myDate3 }, { new: true });
    console.log("Doc for level 2 " + doc);
  } catch (err) {
    console.log("Something wrong when updating data!");
  }

  res.render('page4',{user:req.user,pass:'9957'});
  
})

app.get('/page5',checkAuthenticated,(req,res)=>{

res.render('page5',{user:req.user,pass:'97'});
});


//POST
app.post('/register',checkNotAuthenticated,(req,res)=>{
    
    var user=new User({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
    })
    user.save().then(()=>{
        console.log('User saved');
        res.redirect('/login');
    })
})
app.post('/login',checkNotAuthenticated,passport.authenticate('local',{
    successRedirect: '/profile',
    failureRedirect: '/login'
  }))

app.post('/profile',async (req,res)=>{
  //console.log(req.user);
  var date1=new Date();
 
  var log=new Log({
    email:req.user.email,
    start:date1
})
 console.log(log);
 await log.save().then(()=>{
    console.log('Email created');
    res.redirect('/page1');
}).catch((err) => {
  console.log("err here"+err);
  res.send(err.message);
});


// var key=req.body.key1;
//   if(key=='page2'){
//res.redirect('/page1');
  // }
    
});

app.post('/page4',async (req,res)=>{
var key=req.body.key4;
  if(key==process.env.KEY_4){
  const myDate4= new Date();
  
  try {
    const doc = await Log.findOneAndUpdate({ email: req.user.email }, { level4: myDate4 }, { new: true });
    console.log(`Doc level 4 is ${doc}`);
    res.redirect('/page5');
  } catch (err) {
    console.log("Something wrong when updating data!");
  }


   
  }
  else{
  
    res.render('page4',{error:'Wrong key',user:req.user,pass:'9957'});
  }
});

app.post('/page5',async (req,res)=>{
  var key=req.body.key5;
    if(key==process.env.KEY_5){
    const myDate5= new Date();
    
    try {
      const doc = await Log.findOneAndUpdate({ email: req.user.email }, { level5: myDate5 }, { new: true });
      console.log(`Doc level 5 is ${doc}`);
      res.render('profile',{user:req.user,sts:'Completed'});
    } catch (err) {
      console.log("Something wrong when updating data!");
    }
  
  
      
    }
    else{
    
      res.render('page5',{error:'Wrong key',user:req.user,pass:'9957'});
    }
  });


app.post('/page1',async (req,res)=>{

  console.log('Page 1 Post '+req.user.email);
  const myDate1= new Date();
  
  try {
    const doc = await Log.findOneAndUpdate({ email: req.user.email }, { level1: myDate1 }, { new: true });
    console.log(`Doc Page1 is ${doc}`);
    res.redirect('/page2');
  } catch (err) {
    console.log("Something wrong when updating data!");
    res.status(500).send('An error occurred while updating data.');

  }


});

//Logout
app.delete('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { 
          return next(err); 
          }
        res.redirect('/login');
      });
  });

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/login')
  }
  
  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/profile')
    }
    next()
  }

app.listen(4000,()=>{
    console.log("Server listening on port 4000");
})