const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    for(let i=0; i<users.length; i++)
    {
        if(users[i].username == username && users[i].password == password)
        {
            return true;
        }
    }
    return false
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  let password = req.body.password
  let username = req.body.username
  console.log(password)
  if(authenticatedUser(username, password))
  {
    let accessToken = jwt.sign({data: password},'access',{ expiresIn: 60 * 60 });
    req.session.authorization = {accessToken,username}
    console.log(req.session.authorization)
    return res.send("User logged in successfully")
  }
  else
  {
    return res.send("Improper login credentials")
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  if(books[parseInt(req.params.isbn)])
  {
    const review = req.body.review
    if(review)
    {
        if(books[parseInt(req.params.isbn)].reviews[req.user.data])
        {
            books[parseInt(req.params.isbn)].reviews[req.user.data] = review
            return res.send("Review updated")
        }
        else
        {
            books[parseInt(req.params.isbn)].reviews[req.user.data] = review
            return res.send("Review added")   
        }
        
    }
    else
    {
        return res.send("As no review found, no change made")
    }
  }
  else
  {
    return res.send("No such book exists, cant add review")
  }
});


regd_users.delete("/auth/review/:isbn", (req,res)=>{
    if(books[parseInt(req.params.isbn)].reviews[req.user.data])
    {
        delete books[parseInt(req.params.isbn)].reviews[req.user.data]
        return res.send("Review deleted")
    }
    else
    {
        return res.send("Your review is inexistant")
    }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
