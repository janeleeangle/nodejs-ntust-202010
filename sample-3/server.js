const express = require('express');
const app = express();

const hbs    = require("hbs");
const path   = require("path");

const session     = require("express-session");
const redis       = require("redis");
const redisStore  = require("connect-redis")(session);
const redisClient = redis.createClient();


const bodyParser   = require("body-parser");


const dramas   = require("./router/dramas");

const utils    = require("./utils");

// 設定模板引擎
app.engine('html',hbs.__express);

// 設定模板 位置
app.set("views" , path.join(__dirname ,"application","views"));

// 設定靜態檔 位置
app.use(express.static(path.join(__dirname,"application")));


// Setting body-parser
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( {
		extended : false ,
		limit : "1mb",
		parameterLimit : '10000'
}));


// Use Session
app.use(session({
    store : new redisStore({ client: redisClient}),
    secret : "c90dis90#" ,
    resave : true,
    saveUninitialized : false,
    name:"_ntust_tutorial_id",
    ttl : 24*60*60*1
}))


app.get("/login",(req,res)=>{
    res.render("login.html");
});


app.post("/auth",
  utils.isUserValid,
  utils.setUserInfo,
  (req,res,next)=>{
     res.json({
       message  : "ok.",
       redirect : "/dramas/page"
     });
  }
);


app.use("/dramas",utils.isUserLogined,dramas);


app.get("/",(req,res)=>{
    res.send("Hello World!");
});



app.listen(8088,function(){
    console.log("Server is running at http://localhost:" + String(8088));
});
