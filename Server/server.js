const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');
const cors=require('cors');
const app=express();
const key=require('./config/jwtConfig');
app.use(bodyParser.json());
app.use(cors());
const schema=new mongoose.Schema({
    email:String,
    password:String
})

const schema2=new mongoose.Schema({
  firstname:String,
  lastname:String,
  email:String,
  password:String
})

const model=mongoose.model('userlist',schema);
const model2=mongoose.model('userprofile',schema2);

app.listen(3001,()=>{
    console.log("server listening on port 3001");
})
mongoose.connect("mongodb://127.0.0.1:27017/profiles",{useUnifiedTopology: true},()=>{
    console.log("database listening");
   /*model.findOne({firstname:"arpit"},{_id:1,firstname:1},function(err,res){
       console.log(res);
   });
   */
 /* user.save().then((err,res)=>{
      console.log("data saved in database");
  })
  */
})

const auth2=(req,res,next)=>{
  model.findOne({email:req.body.email},{firstname:1,lastname:1,email:1,password:1},function(err,resl){
    if(err)
    res.send('unable to signup')
    else if(resl!==null)
    res.send('email already exists');
    else
    next();
    })  
 }

  app.post('/signup',auth2,(req,res)=>{
         //console.log(req.body);
         const user=new model2(req.body); 
         user.save().then((err,result)=>{
         if(err)
          res.send('unable to signup');
         else
          res.status(200).send('signed up successfully');
    });
  })
  
 const auth=(req,res,next)=>{
   console.log(req.body);
  model2.findOne(req.body,{_id:1},function(err,resl){
    if(err)
    res.send('unable to sign')
    else if(resl===null)
    res.send('user does not exists');
    else
    next();
    })  
 }

  app.post('/login',auth,(req,res)=>{
     const token=jwt.sign({
       email:req.body.email
     },key.secret);
     res.send({Authorization:"successfull",token:token});
  })