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

app.get('/admin',async (req,res)=>{
  var sel = await Log.find({},{_id:0,email:1,start:1,level1:1,level2:1,level3:1,level4:1,level5:1,level6:1,level7:1,level8:1},{lean: true});
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

app.get('/1PVKQGGbqvr66wRT22Yf1NpCqc9kyE',checkAuthenticated,(req,res)=>{
  console.log('Page 1 '+req.user.email);
  const myDate1= new Date();

  res.render('page1',{user:req.user,pass:'12349'});

});

app.get('/20WH5pAWWCsr5wrvq2vRvy8rvsNdIG',checkAuthenticated,(req,res)=>{
  const myDate2= new Date();
  console.log("Page 2 start "+myDate2.toLocaleTimeString());
  res.render('page2',{user:req.user,pass:'#@!23'});

})

app.get('/3bVtxXADjx24noayRNSwEyeWxQU6yv',checkAuthenticated,async (req,res)=>{
  const myDate3= new Date();
  console.log("Page 3 start "+myDate3.toLocaleTimeString());
  res.render('page3',{user:req.user,pass:'#@!2233'});

})

app.get('/4VgYZZCnBYTraJMGv57ZHFf4rJuVah',checkAuthenticated,async (req,res)=>{
  console.log('Page 4 '+req.user.email);
  const myDate4= new Date();

  res.render('page4',{user:req.user,pass:'9957'});

})

app.get('/51YrDppBrcAJC3cDUTCcDx1MCkBeaJ',checkAuthenticated,async (req,res)=>{
  console.log('Page 5 '+req.user.email);
  const myDate5= new Date();
  let logfind=await Log.findOne({email:req.user.email});

  if (logfind && logfind.level4) {
    console.log(`Level4 already registered for ${req.user.email}`);
    res.render('page5',{user:req.user,pass:'XgwuLkBCRd'});  }
  else {
  try {
    const doc = await Log.findOneAndUpdate({ email: req.user.email }, { level4: myDate5 }, { new: true });
    console.log("Doc for level 4 " + doc);
  } catch (err) {
    console.log("Something wrong when updating data!");
  }

  res.render('page5',{user:req.user,pass:'XgwuLkBCRd'});
}
});

app.get('/almond',checkAuthenticated,async (req,res)=>{
  console.log('Page 6 '+req.user.email);
  const myDate6= new Date();
  let logfind=await Log.findOne({email:req.user.email});

  if (logfind && logfind.level5) {
    console.log(`Level5 already registered for ${req.user.email}`);
    res.redirect('/6OzAn7NEcLprJMgY6MICdXrNnCqDIR');}
  else {
  try {
    const doc = await Log.findOneAndUpdate({ email: req.user.email }, { level5: myDate6 }, { new: true });
    console.log("Doc for level 5 " + doc);
  } catch (err) {
    console.log("Something wrong when updating data!");
  }
res.redirect('/6OzAn7NEcLprJMgY6MICdXrNnCqDIR');
  }
});

app.get('/6OzAn7NEcLprJMgY6MICdXrNnCqDIR',checkAuthenticated,(req,res)=>{
  const myDate6= new Date();
  console.log("Page 6 start "+myDate6.toLocaleTimeString());
  res.render('page6',{user:req.user,pass:'#@!23'});
})

app.get('/794JBR5aLKb080ddWCO4SFE0gk5uqk',checkAuthenticated,(req,res)=>{
  const myDate7= new Date();
  console.log("Page 7 start "+myDate7.toLocaleTimeString());
  res.render('page7',{user:req.user,pass:'#@!23'});
})

app.get('/8UNw3FRV3jRTNUw9goRAl3fyXfwpR1',checkAuthenticated,(req,res)=>{
  const myDate8= new Date();
  console.log("Page 8 start "+myDate8.toLocaleTimeString());
  res.render('page8',{user:req.user,pass:'#@!23'});
})

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
    res.redirect('/1PVKQGGbqvr66wRT22Yf1NpCqc9kyE');
}).catch((err) => {
  console.log("err here"+err);
  res.send(err.message);
});
}
else{
  console.log(req.user.email,"Exists");
  res.redirect('/1PVKQGGbqvr66wRT22Yf1NpCqc9kyE');
}
});

app.post('/1PVKQGGbqvr66wRT22Yf1NpCqc9kyE',async (req,res)=>{
    const myDate1= new Date();
    let logfind=await Log.findOne({email:req.user.email});

    if (logfind && logfind.level1) {
    console.log(`Level1 already registered for ${req.user.email}`);
    res.redirect('/20WH5pAWWCsr5wrvq2vRvy8rvsNdIG');
  }
  else {
    try {
      const doc = await Log.findOneAndUpdate({ email: req.user.email }, { level1: myDate1 }, { new: true });
      console.log(`Doc level 1 is ${doc}`);
      res.redirect('/20WH5pAWWCsr5wrvq2vRvy8rvsNdIG');
    } catch (err) {
      console.log("Something wrong when updating data!");
    }

  }
});

app.post('/20WH5pAWWCsr5wrvq2vRvy8rvsNdIG',async (req,res)=>{
  var key=req.body.key2;
    if(key==process.env.KEY_2){
    const myDate2= new Date();
    let logfind=await Log.findOne({email:req.user.email});

    if (logfind && logfind.level2) {
      console.log(`Level2 already registered for ${req.user.email}`);
      res.redirect('/3bVtxXADjx24noayRNSwEyeWxQU6yv');
    }
    else {
    try {
      const doc = await Log.findOneAndUpdate({ email: req.user.email }, { level2: myDate2 }, { new: true });
      console.log(`Doc level 2 is ${doc}`);
      res.redirect('/3bVtxXADjx24noayRNSwEyeWxQU6yv');
    } catch (err) {
      console.log("Something wrong when updating data!");
    }


  }
    }
    else{
      res.render('page2',{error:'Wrong key',user:req.user,pass:'9957'});
    }
  });

app.post('/3bVtxXADjx24noayRNSwEyeWxQU6yv',async (req,res)=>{
  var key=req.body.key3;
    if(key==process.env.KEY_3){
    const myDate3= new Date();
    let logfind=await Log.findOne({email:req.user.email});

    if (logfind && logfind.level3) {
      console.log(`Level3 already registered for ${req.user.email}`);
      res.redirect('/4VgYZZCnBYTraJMGv57ZHFf4rJuVah');
    }
    else {
    try {
      const doc = await Log.findOneAndUpdate({ email: req.user.email }, { level3: myDate3 }, { new: true });
      console.log(`Doc level 3 is ${doc}`);
      res.redirect('/4VgYZZCnBYTraJMGv57ZHFf4rJuVah');
    } catch (err) {
      console.log("Something wrong when updating data!");
    }


  }
    }
    else{
      res.render('page3',{error:'Wrong key',user:req.user,pass:'9957'});
    }
  });

app.post('/6OzAn7NEcLprJMgY6MICdXrNnCqDIR',async (req,res)=>{
  var key=req.body.key6;
    if(key==process.env.KEY_6){
    const myDate6= new Date();
    let logfind=await Log.findOne({email:req.user.email});

    if (logfind && logfind.level6) {
      console.log(`Level6 already registered for ${req.user.email}`);
      res.redirect('/794JBR5aLKb080ddWCO4SFE0gk5uqk');
    }
    else {
    try {
      const doc = await Log.findOneAndUpdate({ email: req.user.email }, { level6: myDate6 }, { new: true });
      console.log(`Doc level 6 is ${doc}`);
      res.redirect('/794JBR5aLKb080ddWCO4SFE0gk5uqk');
    } catch (err) {
      console.log("Something wrong when updating data!");
    }


  }
    }
    else{
      res.render('page6',{error:'Wrong key',user:req.user,pass:'9957'});
    }
  });

app.post('/794JBR5aLKb080ddWCO4SFE0gk5uqk',async (req,res)=>{
  var key=req.body.key7;
    if(key==process.env.KEY_7){
    const myDate7= new Date();
    let logfind=await Log.findOne({email:req.user.email});

    if (logfind && logfind.level7) {
      console.log(`Level7 already registered for ${req.user.email}`);
      res.redirect('/8UNw3FRV3jRTNUw9goRAl3fyXfwpR1');
    }
    else {
    try {
      const doc = await Log.findOneAndUpdate({ email: req.user.email }, { level7: myDate7 }, { new: true });
      console.log(`Doc level 7 is ${doc}`);
      res.redirect('/8UNw3FRV3jRTNUw9goRAl3fyXfwpR1');
    } catch (err) {
      console.log("Something wrong when updating data!");
    }


  }
    }
    else{
      res.render('page7',{error:'Wrong key',user:req.user,pass:'9957'});
    }
  });

app.post('/8UNw3FRV3jRTNUw9goRAl3fyXfwpR1',async (req,res)=>{
  var key=req.body.key8;
    if(key==process.env.KEY_8){
    const myDate8= new Date();
    let logfind=await Log.findOne({email:req.user.email});

    if (logfind && logfind.level8) {
      console.log(`Level8 already registered for ${req.user.email}`);
      res.render('profile',{user:req.user,sts:'Completed'});    }
    else {
    try {
      const doc = await Log.findOneAndUpdate({ email: req.user.email }, { level8: myDate8 }, { new: true });
      console.log(`Doc level 8 is ${doc}`);
      res.render('profile',{user:req.user,sts:'Completed'});
    } catch (err) {
      console.log("Something wrong when updating data!");
    }


  }
    }
    else{

      res.render('page8',{error:'Wrong key',user:req.user,pass:'9957'});
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
