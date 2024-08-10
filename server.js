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
app.use(express.static('public'));

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
app.get('/admin',async (req,res)=>{
  var sel = await Log.find({},{_id:0,email:1,start:1,level1:1,level2:1,level3:1,level4:1,level5:1},{lean: true});
  let i=0,t_end;
  var res_arr=[];
  while (i < sel.length){
    let one=sel[i],lvl=0;

    for(var el in one){
      

      console.log("Key:",el);
      console.log("Vlaue:",one[el]);
      t_end=one[el];
      console.log("End:key",el);
      console.log("End:",t_end);
      lvl++;
      // break; 
    }
    console.log(i," ",one);
    let t_st=sel[i]["start"].getTime();
    res_arr[i]={mail:one["email"],time:t_end-t_st,level:lvl-2};
    //console.log(t_end-t_st);
    i++;
}
res_arr.sort((a, b) => {
  if (a.level < b.level) {
    return 1;
} else if (a.level > b.level) {
    return -1;
} else {
    if (a.time < b.time) {
        return -1;
    } else if (a.time > b.time) {
        return 1;
    } else {
        return 0;
    }
}
});

console.log(res_arr);
  //res.send(sel);
  res.render('../views_rem/admin',{res_arr,layout:'../views_rem/admin'});
})

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

  console.log("Login of " + myDate1.toLocaleString(),req.user.email);
    //console.log(req.user);
  res.render('profile',{user:req.user});
    
})

app.get('/page1',checkAuthenticated,(req,res)=>{
  console.log('Page 1 '+req.user.email);
  const myDate1= new Date();
  localStorage.set("datestart",myDate1);

  res.render('page1',{user:req.user,pass:'12349'});
  
});



app.get('/page2',checkAuthenticated,(req,res)=>{
  const myDate2= new Date();
//  var datestr=localStorage.get("dt1");
//  var dateorg=new Date(datestr);

  console.log("Page 2 start "+myDate2.toLocaleTimeString());
  res.render('page2',{user:req.user,pass:'#@!23'});
  
})

app.get('/almond',checkAuthenticated,(req,res)=>{
res.redirect('/page3');
});


app.get('/page3',checkAuthenticated,async (req,res)=>{
  console.log('Page 3 '+req.user.email);
  const myDate3= new Date();
  let logfind=await Log.findOne({email:req.user.email});

  if (logfind && logfind.level2) {
    console.log(`Level2 already registered for ${req.user.email}`);
    res.render('page3',{user:req.user,pass:'#@!2233'});  } 
  else {
  try {
    const doc = await Log.findOneAndUpdate({ email: req.user.email }, { level2: myDate3 }, { new: true });
    console.log("Doc for level 2 " + doc);
  } catch (err) {
    console.log("Something wrong when updating data!");
  }

  res.render('page3',{user:req.user,pass:'#@!2233'});
}
});

app.get('/page4',checkAuthenticated,async (req,res)=>{
  console.log('Page 4 '+req.user.email);
  const myDate3= new Date();

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


 let logfind=await Log.findOne({email:req.user.email});
 console.log("Found one",logfind);

 if(!logfind){
 await log.save().then(()=>{
    console.log('Email created');
    res.redirect('/page1');
}).catch((err) => {
  console.log("err here"+err);
  res.send(err.message);
});
}
else{
  console.log(req.user.email,"Exists");
  res.redirect('/page1');
}


// var key=req.body.key1;
//   if(key=='page2'){
//res.redirect('/page1');
  // }
    
});

app.post('/page3',async (req,res)=>{
  var key=req.body.key3;
    if(key==process.env.KEY_3){
    const myDate3= new Date();
    let logfind=await Log.findOne({email:req.user.email});

    if (logfind && logfind.level3) {
    console.log(`Level3 already registered for ${req.user.email}`);
    res.redirect('/page4');
  } 
  else {
    try {
      const doc = await Log.findOneAndUpdate({ email: req.user.email }, { level3: myDate3 }, { new: true });
      console.log(`Doc level 3 is ${doc}`);
      res.redirect('/page4');
    } catch (err) {
      console.log("Something wrong when updating data!");
    }
  
  }
     
    }
    else{
    
      res.render('page3',{error:'Wrong key',user:req.user,pass:'9957'});
    }
  });
  

app.post('/page4',async (req,res)=>{
var key=req.body.key4;
  if(key==process.env.KEY_4){
  const myDate4= new Date();
  let logfind=await Log.findOne({email:req.user.email});

  if (logfind && logfind.level4) {
    console.log(`Level4 already registered for ${req.user.email}`);
    res.redirect('/page5');
  } 
  else {
  try {
    const doc = await Log.findOneAndUpdate({ email: req.user.email }, { level4: myDate4 }, { new: true });
    console.log(`Doc level 4 is ${doc}`);
    res.redirect('/page5');
  } catch (err) {
    console.log("Something wrong when updating data!");
  }


   
  }}
  else{
  
    res.render('page4',{error:'Wrong key',user:req.user,pass:'9957'});
  }
});



app.post('/page5',async (req,res)=>{
  var key=req.body.key5;
    if(key==process.env.KEY_5){
    const myDate5= new Date();
    localStorage.set("date5",myDate5);
    let logfind=await Log.findOne({email:req.user.email});

    if (logfind && logfind.level5) {
      console.log(`Level5 already registered for ${req.user.email}`);
      res.render('profile',{user:req.user,sts:'Completed'});    } 
    else {
    try {
      const doc = await Log.findOneAndUpdate({ email: req.user.email }, { level5: myDate5 }, { new: true });
      console.log(`Doc level 5 is ${doc}`);
      res.render('profile',{user:req.user,sts:'Completed'});
    } catch (err) {
      console.log("Something wrong when updating data!");
    }
  
  
  }
    }
    else{
    
      res.render('page5',{error:'Wrong key',user:req.user,pass:'9957'});
    }
  });


app.post('/page1',async (req,res)=>{

  console.log('Page 1 Post '+req.user.email);
  const myDate1= new Date();
  let logfind=await Log.findOne({email:req.user.email});

  if (logfind && logfind.level1) {
    console.log(`Level1 already registered for ${req.user.email}`);
    res.redirect('/page2');
  } 
  else {
  try {
    const doc = await Log.findOneAndUpdate({ email: req.user.email }, { level1: myDate1 }, { new: true });
    console.log(`Doc Page1 is ${doc}`);
    res.redirect('/page2');
  } catch (err) {
    console.log("Something wrong when updating data!");
    res.status(500).send('An error occurred while updating data.');

  }
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

app.listen(3000,()=>{
    console.log("Server listening on port 3000");
})
