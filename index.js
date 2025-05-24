const { faker } = require('@faker-js/faker');
const mysql = require("mysql2");
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true}));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'myapp',
    password: 'nvsj1234',
  });
  let getRandomUser = () => {
    return [
      faker.string.uuid(),
      faker.internet.username(), // before version 9.1.0, use userName()
      faker.internet.email(),
      faker.internet.password(),
      
    ];
  }
let q = "INSERT INTO user (id, username, email, password) VALUES ?";
let data = [];
for(let i=1;i <= 100;i++) {
  data.push(getRandomUser());
}
/*try{
  conn.query(q,[data],(err,result) => {
    if(err) throw err;
    console.log(result);
    
  });
} catch(err) {
  console.log(err);
}
conn.end();*/

  //home route
  app.get("/",(req,res) => {
    let q = `SELECT count(*) FROM user`;
    try{
      conn.query(q,(err,result) => {
        if(err) throw err;
        let count =  result[0]["count(*)"];
        res.render("home.ejs",{ count });
      });
    } catch(err) {
      console.log(err);
      res.send("some error in DB");
    }
    
    
  })

  //show route
  app.get('/users',(req,res) => {
    let q = `SELECT * FROM user`;
    try{
      conn.query(q,(err,users) => {
        if(err) throw err;
        
        res.render("showusers.ejs",{ users });
      });
    } catch(err) {
      console.log(err);
      res.send("some error in DB");
    }
  })

  //edit route
  app.get("/users/:id/edit",(req,res) => {
    let { id } = req.params;
    let q = `SELECT * FROM user WHERE id='${id}'`;
    try{
      conn.query(q,(err,result) => {
        if(err) throw err;
        console.log(result);
        let user = result[0];
        res.render("edit.ejs",{ user });
      });
    } catch(err) {
      console.log(err);
      res.send("some error in DB");
    }
    
  })

  //update route
  app.patch("/user/:id",(req,res) => {
    let { id } = req.params;
    let q = `SELECT * FROM user WHERE id='${id}'`;
    let { password: formpass, username: newusername } = req.body;
    try{
      conn.query(q,(err,result) => {
        if(err) throw err;
        
        let user = result[0];
        if(formpass != user.password) {
          res.send("wrong password");
        }
        else {
          let q2 = `UPDATE user SET username='${newusername}' WHERE id='${id}'`;
          conn.query(q2,(err,result) => {
            if (err) throw err;
            res.redirect("/users");
          })
        }
      });
    } catch(err) {
      console.log(err);
      res.send("some error in DB");
    }
    
  })

  app.get("/user/new", (req, res) => {
    res.render("new.ejs");
  });
  
  app.post("/user/new", (req, res) => {
    let { username, email, password } = req.body;
    let id = uuidv4();
    //Query to Insert New User
    let q = `INSERT INTO user (id, username, email, password) VALUES ('${id}','${username}','${email}','${password}') `;
  
    try {
      connection.query(q, (err, result) => {
        if (err) throw err;
        console.log("added new user");
        res.redirect("/user");
      });
    } catch (err) {
      res.send("some error occurred");
    }
  });
  
  app.get("/user/:id/delete", (req, res) => {
    let { id } = req.params;
    let q = `SELECT * FROM user WHERE id='${id}'`;
  
    try {
      connection.query(q, (err, result) => {
        if (err) throw err;
        let user = result[0];
        res.render("delete.ejs", { user });
      });
    } catch (err) {
      res.send("some error with DB");
    }
  });
  
  app.delete("/user/:id/", (req, res) => {
    let { id } = req.params;
    let { password } = req.body;
    let q = `SELECT * FROM user WHERE id='${id}'`;
  
    try {
      connection.query(q, (err, result) => {
        if (err) throw err;
        let user = result[0];
  
        if (user.password != password) {
          res.send("WRONG Password entered!");
        } else {
          let q2 = `DELETE FROM user WHERE id='${id}'`; //Query to Delete
          connection.query(q2, (err, result) => {
            if (err) throw err;
            else {
              console.log(result);
              console.log("deleted!");
              res.redirect("/user");
            }
          });
        }
      });
    } catch (err) {
      res.send("some error with DB");
    }
  });
  

  app.listen("8080", () => {
    console.log("server is listening to port 8080");
  })