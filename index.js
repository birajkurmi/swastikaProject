var express=require("express");
var bodyParser=require("body-parser");

const mongoose = require('mongoose');
const { Console } = require("console");
const { compile } = require("proxy-addr");
mongoose.connect('mongodb://localhost:27017/tutorialsPoint');
var db=mongoose.connection;
db.on('error', console.log.bind(console, "connection error"));
db.once('open', function(callback){
   console.log("connection succeeded");
})
var app=express()
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
   extended: true
}));

app.post('/sign_up', function(req,res){

   var email =req.body.email;
   var pass = req.body.password;
   var fname=req.body.fname;
   var lname=req.body.lname;

   var data = {
      
      "email":email,
      "password":pass,
      "fname":fname,
      "lname":lname,
      
   }
   db.collection('details').insertOne(data,function(err, collection){
   if (err) throw err;
      console.log("Record inserted Successfully");
   });
   return res.render('pages/success');
})

//student signup
app.post('/sign_upstu', function(req,res){

  var email =req.body.email;
  var pass = req.body.password;
  var roll= req.body.roll;
  var fname=req.body.fname;
  var lname=req.body.lname;
  

  var data = {
     "roll": roll,
     "fname":fname,
     "lname":lname,
     "email":email,
     "password":pass
  }

  var i=0
  db.collection('student').find().toArray(function(err, items) {
      if(err) throw err;    
      items.forEach(element => { 
       
          if(element.roll===roll){
             if(element.email===email)
              i=1 
          }
        });         
  });
  setTimeout(()=>{
      if(i===0){
          console.log(i)
          return res.redirect('pages/error3');}
          else
          {
            console.log(i)
            var j=0
            db.collection('details').find().toArray(function(err, items) {
                if(err) throw err;    
                items.forEach(element => { 
                 
                    if(element.roll===roll){
                       
                        j=1 
                    }
                  });         
            });
            setTimeout(()=>{
                if(j>0){
                    console.log(j)
                    return res.redirect('pages/error2');}
                    else
                    {
                      
                      db.collection('details').insertOne(data,function(err, collection){
                        if (err) throw err;
                           console.log("Record inserted Successfully");
                        });
                        return res.redirect('pages/success');
                    }
                  
            },2000);
          
          }
        
  },2000);

})

//login
app.post('/login', function(req,res){

    var email =req.body.roll;
    var pass = req.body.password;
    var type = req.body.type;

  if(type==="admin")
  {  
   if(email==="admin@work.com")
   {
      if(pass==="Password")
      {
         res.render('pages/home');
      }
   }
}
    var data = {
       
       "email":email,
       "password":pass
    }
    var i=0
    db.collection('details').find().toArray(function(err, items) {
        if(err) throw err;    
        items.forEach(element => { 
         
            if(element.roll===email){
                if(element.password===pass)
                i=1 
            }
          });         
    });
    setTimeout(()=>{
        if(i===0){
            console.log(i)
            return res.render('pages/error');}
            else
           { 
              if(type==="student")
              {
                 res.render('studenthom',{title:'User List',userData:email});
              }
              else{
                 res.render('pages/error');
              }
              }
    },2000);
  
 })

 //login page
 app.get('/login',function(req,res){
   return res.render('pages/login');
 });
 //signup page
 app.get('/signup',function(req,res){
   return res.render('pages/signup');
 });
 //admin home page
 app.get('/home',function(req,res){
   return res.render('pages/home');
 });
 //admin department
 app.get('/departments',function(req,res){
   return res.render('pages/department');
 });
 app.get('/logout',function(req,res){
  return res.render('pages/logout');
});
 //admin courses
 app.get('/courses_form',function(req,res){
  db.collection('dept').find().toArray(function(err, items){
    if (err) throw err;
     res.render('courses_form', { title: 'User List', userData: items});
//       // return res.send(items);
});
 });
 //admin student
 app.get('/astudent',function(req,res){
  db.collection('course').find().toArray(function(err, items){
    if (err) throw err;
    res.render('astudent', { title: 'User List', userData: items});
   // return res.send(items);
    }); 
   //return res.render('pages/student');
 });
 //admin criteria
 app.get('/acriteria',function(req,res){
   return res.render('pages/criteria');
 });
 //admin admission
 app.get('/Admission1',function(req,res){
  db.collection('student').find().toArray(function(err, items){
          if (err) throw err;
           res.render('Admission1', { title: 'User List', userData: items});
    //       // return res.send(items);
     });
  //    db.collection('course').find().toArray(function(err, items){
  //     if (err) throw err;
  //     res.render('Admission1', { title: 'User List', userData: items});
  //     });
  // //  return res.render('pages/Admission');
 });

app.get('/',function(req,res){
   res.set({
      'Access-control-Allow-Origin': '*'
   });
   return res.render('pages/index');
}).listen(3000)


app.get('/dept/edit/:id', function(req,res){

   var name1 =req.url.split("/")
   var name=name1[name1.length-1]
   var MongoClient = require('mongodb').MongoClient;
   var url = "mongodb://localhost:27017/"; 

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("tutorialsPoint");
  var myquery = { name: name };
  dbo.collection("dept").deleteOne(myquery, function(err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
    db.close();
    return res.send('1 document deleted');
   
   });
});
})
app.post('/department', function(req,res){
   var i=0;
   var description =req.body.description;
   var name =req.body.name;
   var data = {  
      "name":name,
      "description":description
   }
   db.collection('dept').insertOne(data,function(err, collection){
   if (err) throw err;
  i=1
   });
   if(i==0)
 return  res.render('pages/home');
 else
 return res.render('pages/error1');
})
app.get('/department', function(req,res){

 
  db.collection('dept').find().toArray(function(err, items){
   if (err) throw err;
   res.render('department', { title: 'User List', userData: items});
   });
  
})
app.delete('/department', function(req,res){
   var name =req.body.name;
   var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("tutorialsPoint");
  var myquery = { name: name };
  dbo.collection("dept").deleteOne(myquery, function(err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
    db.close();
    return res.send('1 document deleted');
  });
});
   
 })

 app.put('/department', function(req,res){
   var name =req.body.name; var name1 =req.body.name1;var course =req.body.course;
  
   var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("tutorialsPoint");
  var myquery = { name: name };
  var newvalues = { $set: {name: name1,course: course} };
  dbo.collection("dept").updateOne(myquery, newvalues, function(err, res) {
    if (err) throw err;
    console.log("1 document updated");
    db.close();
    
  });

  return res.send('1 document updated');
});
   
 })

 app.get('/student/edit/:id', function(req,res){
   
   var name1 =req.url.split("/")
   var name=name1[name1.length-1]
   var MongoClient = require('mongodb').MongoClient;
   var url = "mongodb://localhost:27017/"; 

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("tutorialsPoint");
  var myquery = { name: name };
  dbo.collection("student").deleteOne(myquery, function(err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
    db.close();
    return res.send('1 document deleted');
    //return res.render('student',)
   });
});
})


//edit students

app.get('/student/edit_edit/:id', function(req,res){
  var name1 = req.url.split("/")
  var name =name1[name1.length-1]
  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb://localhost:27017/";

  MongoClient.connect(url, function(err, db) {
     if (err) throw err;
      var dbo = db.db("tutorialsPoint"); 
      var myquery = { name: name };
      dbo.collection('student').find().toArray(function(err, items){
        if (err) throw err;
        items.forEach(element => { 
               
          if(element.roll===name){
             
            res.render('studentedit', { title: 'User List', userData: element});
          }
        });      
     });
    });
  })


app.post('/student', function(req,res){
   var i=0;
   var roll=req.body.roll;
   var name =req.body.name;
   var address =req.body.address;
   var pname =req.body.pname;
   var phnno =req.body.phnno;
   var nob1=req.body.nob1;
   var yop1=req.body.yop1;
   var email =req.body.email;
   var course =req.body.course;
   var tm1=req.body.tm1;
   var mo1=req.body.mo1;
   var gender=req.body.gender;
   var bdate=req.body.bdate;
   var divs1=req.body.divs1;
   var pom1=req.body.pom1;
   var tm2=req.body.tm2;
   var mo2=req.body.mo2;
   var nob2=req.body.nob2;
   var yop2=req.body.yop2;
   var divs2=req.body.divs2;
   var pom2=req.body.pom2;
   

   var data = {
       
    "roll": roll,
      "name":name,
      "address":address,
      "phnno":phnno,
      "email":email,
      "course":course,
      "gender":gender,
      "bdate":bdate,
      "yop1":yop1,
      "pname":pname,
      "nob1":nob1,
      "tm1":tm1,
      "mo1":mo1,
      "divs1":divs1,
      "pom1":pom1,
      "nob2":nob2,
      "yop2":yop2,
      "tm2":tm2,
      "mo2":mo2,
      "divs2":divs2,
      "pom2":pom2
   }
   db.collection('student').insertOne(data,function(err, collection){
   if (err) throw err;
      i=1
         });
         if(i==0)
         return  res.render('pages/home');
         else
         return res.render('pages/error1');
         })
app.get('/student', function(req,res){

 
  db.collection('student').find().toArray(function(err, items){
   if (err) throw err;
   res.render('student', { title: 'User List', userData: items});
   });
  
})

//get
app.get('/student1', function(req,res){

   db.collection('student').find().toArray(function(err, items){
    if (err) throw err;
    res.render('student1', { title: 'User List', userData: items});
   // return res.send(items);
    }); 
 })

app.delete('/student', function(req,res){
   var name =req.body.name;
   var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("tutorialsPoint");
  var myquery = { name: name };
  dbo.collection("student").deleteOne(myquery, function(err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
    db.close();
    return res.send('1 document deleted');
  });
});
   
 })

 app.put('/student', function(req,res){
   var name =req.body.name; var name1 =req.body.name1;
   var phnno=req.body.phnno; 
   var course =req.body.course;var email =req.body.email;
   var address =req.body.address;
   var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("tutorialsPoint");
  var myquery = { name: name };
  var newvalues = { $set: {name: name1, phnno:phnno, address: address,email:email,course:course } };
  dbo.collection("student").updateOne(myquery, newvalues, function(err, res) {
    if (err) throw err;
    console.log("1 document updated");
    db.close();
    
  });

  return res.send('1 document updated');
});
   
 })

 app.get('/course/edit/:id', function(req,res){
   
   var name1 =req.url.split("/")
   var name=name1[name1.length-1]
   var MongoClient = require('mongodb').MongoClient;
   var url = "mongodb://localhost:27017/"; 

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("tutorialsPoint");
  var myquery = { name: name };
  dbo.collection("course").deleteOne(myquery, function(err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
    db.close();
    return res.send('1 document deleted');
   });
});
})

 app.post('/course', function(req,res){
   var i=0;
   var name =req.body.name;
   var dpt =req.body.dpt;
   var duration =req.body.duration;
   var fees =req.body.fees;
   var data = {
      
      "dpt":dpt,
      "name":name,
      "duration":duration,
      "fees":fees
   }
   db.collection('course').insertOne(data,function(err, collection){
   if (err) throw err;
      i=1
         });
         if(i==0)
         return  res.render('pages/home');
         else
         return res.render('pages/error1');
         })

         //
   app.get('/course', function(req,res){

 
  db.collection('course').find().toArray(function(err, items){
   if (err) throw err;
   res.render('courses', { title: 'User List', userData: items});
   });
  
   })

app.delete('/course', function(req,res){
   var cname =req.body.cname;
   var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("tutorialsPoint");
  var myquery = { cname: cname };
  dbo.collection("course").deleteOne(myquery, function(err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
    db.close();
    return res.send('1 document deleted');
  });
});
   
 });

 app.put('/course', function(req,res){
   var name =req.body.name; var name1 =req.body.name1; var name =req.body.name;
   var address =req.body.address;
   var email =req.body.email;var salary =req.body.salary;
   var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("tutorialsPoint");
  var myquery = { name: name };
  var newvalues = { $set: {name: name1, address: address , email:email,salary:salary} };
  dbo.collection("course").updateOne(myquery, newvalues, function(err, res) {
    if (err) throw err;
    console.log("1 document updated");
    db.close();
    
  });

  return res.send('1 document updated');
});
   
 })

 app.get('/addmission/edit/:id', function(req,res){
   
   var sname1 =req.url.split("/")
   var sname=sname1[sname1.length-1]
   var MongoClient = require('mongodb').MongoClient;
   var url = "mongodb://localhost:27017/"; 

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("tutorialsPoint");
  var myquery = { sname: sname };
  dbo.collection("addmission").deleteOne(myquery, function(err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
    db.close();
    return res.send('1 document deleted');
   });
});
})

 app.post('/addmission', function(req,res){
   var i=0;
   var sname =req.body.sname;
   var dname =req.body.dname;
   var cname =req.body.cname;
   var fee =req.body.fee;
   var data = {  
      "sname":sname,
      "dname":dname,
      "cname":cname,
      "fee":fee
   }
   db.collection('addmission').insertOne(data,function(err, collection){
   if (err) throw err;
      i=1
         });
         if(i==0)
         return  res.render('pages/home');
         else
         return res.render('pages/error1');
         })
app.get('/addmission', function(req,res){

 
  db.collection('addmission').find().toArray(function(err, items){
   if (err) throw err;
   res.render('admission', { title: 'User List', userData: items});
   });
  
})
app.delete('/addmission', function(req,res){
   var course =req.body.course;
   var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("tutorialsPoint");
  var myquery = { course: course };
  dbo.collection("addmission").deleteOne(myquery, function(err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
    db.close();
    return res.send('1 document deleted');
  });
});
   
 })

 app.put('/addmission', function(req,res){
   var course =req.body.course; var course1 =req.body.course1;var fee =req.body.fee;
  
   var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("tutorialsPoint");
  var myquery = { course: course };
  var newvalues = { $set: {course: course1,fee: fee} };
  dbo.collection("addmission").updateOne(myquery, newvalues, function(err, res) {
    if (err) throw err;
    console.log("1 document updated");
    db.close();
    
  });

  return res.send('1 document updated');
});
   
 })

 app.get('/criteria/edit/:id', function(req,res){
   
   var sname1 =req.url.split("/")
   var sname=sname1[sname1.length-1]
   var MongoClient = require('mongodb').MongoClient;
   var url = "mongodb://localhost:27017/"; 

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("tutorialsPoint");
  var myquery = { sname: sname };
  dbo.collection("criteria").deleteOne(myquery, function(err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
    db.close();
    return res.send('1 document deleted');
   });
});
})

 app.post('/criteria', function(req,res){
   var i=0;
   var sname =req.body.sname;
   var dname =req.body.dname;
   var cname =req.body.cname;
   var eligibility =req.body.eligibility;
   var data = { 
      "sname" :sname,
      "dname":dname,
      "cname":cname,
      "eligibility":eligibility
   }
   db.collection('criteria').insertOne(data,function(err, collection){
   if (err) throw err;
      i=1
         });
         if(i==0)
         return  res.render('pages/home');
         else
         return res.render('pages/error1');
         })
app.get('/criteria', function(req,res){

 
  db.collection('criteria').find().toArray(function(err, items){
   if (err) throw err;
   res.render('criteria', { title: 'User List', userData: items});
   });
  
})
app.delete('/criteria', function(req,res){
   var sname =req.body.sname;
   var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("tutorialsPoint");
  var myquery = { sname: sname };
  dbo.collection("criteria").deleteOne(myquery, function(err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
    db.close();
    return res.send('1 document deleted');
  });
});
   
 })

 app.put('/criteria', function(req,res){
   var sname =req.body.sname; var sname1 =req.body.sname1;var dname =req.body.dname; var cname =req.body.cname; var eligibility =req.body.eligibility;
  
   var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("tutorialsPoint");
  var myquery = { sname: sname };
  var newvalues = { $set: {sname: sname1,dname: dname, cname: cname, eligibility: eligibility} };
  dbo.collection("criteria").updateOne(myquery, newvalues, function(err, res) {
    if (err) throw err;
    console.log("1 document updated");
    db.close();
    
  });

  return res.send('1 document updated');
});
   
 })


console.log("server listening at port 3000");