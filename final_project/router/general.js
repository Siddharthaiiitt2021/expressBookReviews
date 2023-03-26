const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const _username = req.body.username
  const _password = req.body.password

  if(_username && _password)
  {
     for(let i=0; i<users.length; i++)
     {
        if(users[i].username == _username || users[i].password == _password)
        {
            return res.send("Credentials already in use")
        }
     }
     users.push({username:_username, password:_password})
     return res.send("User registered successfully")
  }
  else
  {
      return res.send("Either username or password field empty")
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  isbn = parseInt(req.params.isbn)
    if(books[isbn])
    {
        return res.send(books[isbn])
    }
    else
    {
        return res.send("No such book exists")
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let auth = req.params.author
  console.log(auth)
  let i=1
  let req_books = []
  while(books[i])
  {
      if(books[i].author == auth)
      {
        req_books.push(books[i])
      }
      i = i+1
  }
  if(req_books.length != 0)
  {
      return res.send(req_books)
  }
  else
  {
      return res.send("No books with such author name found")
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title
    let i=1
    let req_books = []
    while(books[i])
    {
        if(books[i].title == title)
        {
          req_books.push(books[i])
        }
        i = i+1
    }
    if(req_books.length != 0)
    {
        return res.send(req_books)
    }
    else
    {
        return res.send("No books with such title found")
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  if(books[parseInt(req.params.isbn)])
  {
      return res.send(books[parseInt(req.params.isbn)].reviews)
  }
  else
  {
      return res.send("No book with this isbn number found, review not found")
  }
});

module.exports.general = public_users;
