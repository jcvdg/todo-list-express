// import the express library 
const express = require('express')
// create an instance of the express library
const app = express()
// imports the MongoDB Client
const MongoClient = require('mongodb').MongoClient
// define the port# for express to listen on
const PORT = 2121
// imports 'dotenv' package and runs the config method from the package, which in turn loads the vars from '.env'; dotenv is always in the base directory
require('dotenv').config()

// declare and initializes variables for 'db' (no val), 'dbConnectionStr' (MongoDB connection string from .env), and 'dbName' (MongoDB collection 'todo')
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

// Initialize the connection to MongoDB and returns a promise
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    // handling a successfully resolved promise and prints to console.log
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        // binds the connected client instance, attached to the 'todo' collection, to the 'db' variable
        db = client.db(dbName)
    })
    // catch the error in case the connection failed
    .catch (err => console.error(err))

// sets 'ejs' as the rendering engine for the .render() method
app.set('view engine', 'ejs')
// serves 'public' folder contents as-is
app.use(express.static('public'))
// middleware (intercepts rests and responses) - allows query data from client to be passed to server via the request url (https://localhost/route?variable=value&anotherVariable=anoterValue)
app.use(express.urlencoded({ extended: true }))
// middle ware to load the json body-parser for incoming requests
app.use(express.json())

// define the 'get' method at the root of the server, '/'
app.get('/', async (request, response)=>{
    // gets the array of all the documents in the 'todos' collection, and assign the returned array to the todoItems variable
    const todoItems = await db.collection('todos').find().toArray()
    // gets the number of documents in the 'todos' collection where the 'completed' field is false
    const itemsLeft = await db
        .collection('todos')
        .countDocuments({ completed: false })
    // pass the data to the index.ejs file for process, and render to the end-user
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})
// POST method for receiving a new todo item 
app.post('/addTodo', (request, response) => {
    // adds a new todo item to the db, with the completed field defaulted to false
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    // handles returned promise, logs to the server console and redirects back to root page.
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    // logs an error to the console, if there is one
    .catch(error => console.error(error))
})

// PUT request to update 
app.put('/markComplete', (request, response) => {
    // update a document, using value from 'itemFromJS' in the body of the request
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // request.body is a JSON body 
        // when found, set the complete to true
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1}, // update the newest document if multiple results
        upsert: false // if nothing matches, don't create a new document
    })
    // if success, log and send response
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    // else, log error
    .catch(error => console.error(error))

})

// PUT method to update the provided doc, and set completed to false;
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

// DELETE method to remove the provided itemFromJS from the db
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

// starts the server and tells express which port to listen for requests coming from the client
// app.listen is a blocking function.  When JS runs this line, it'll stay here until the server is killed.  Anything past this line will be blocked by app.listen(..)
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})