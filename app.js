const feathers = require("@feathersjs/feathers")
const express = require("@feathersjs/express")
const socketio = require("@feathersjs/socketio")


// const app = feathers()


// a msg service that allows to create new 
//  and return all existing messages

class MessageService {
          constructor() {
                    this.messages = []
          }

          // return all our msgs
          async find() {
                    return this.messages
          }

          // d new msg is d data merged with a unique
          // identifier using d msgs length since it changes
          // wnever we add one 
          async create(data) {
                    const message = {
                              id: this.messages.length,
                              text: data.text
                    }

                    // + new msg to d list
                    this.messages.push(message)

                    return message
          }

}


// -----------------------------------------------------
// register d msg service on d Feathers application
// app.use("messages", new MessageService())

// // log every time a msg has been cr8ed
// app.service("messages").on("created", message => {
//           console.log("A new message has been created", message)
// })


// // a fxn dt cr8s new msg & dn logs
// // all existing msgs
// const main = async () => {
//           // cr8 a new msg on our msg service
//           await app.service("messages").create({
//                     text: "Hello Feathers"
//           })

//           await app.service("messages").create({
//                     text: "Hello again"
//           })

//           // find all existing msgs
//           const messages = await app.service("messages").find()

//           console.log("All messages", messages)
// }


// main()

// -----------------------------------------------------
// cr8 an expressjs compatible feathers application
const app = express(feathers())

// parse http json bodies
app.use(express.json())

// parse URL-encoded params
app.use(express.urlencoded(
          {
                    extended: true
          }
))

// host static files from d current folder
app.use(express.static(__dirname))

// add REST API support
app.configure(express.rest())

// configure socket.io real-time APIs
app.configure(socketio())

// register an in-memory messages services
app.use("/messages", new MessageService())

// register a nicer error handler than d
// default express one
app.use(express.errorHandler())

// add any new real-time connection to d "everybody" channel
app.on("connection", connection => 
          app.channel("everybody").json(connection)
)

// publish all evens to d everybody channel
app.publish(data => app.channel("everybody"))

// start d server
app.listen(3030).on("listening", () => 
          console.log("Feathers server listening on localhost: 3030")
)


// 4 gd measure let's create a msg
// so our API doesn't look so empty
app.service("messages").create({
          text: "Hello world from the server"
})

// go to: http://localhost:3030/messages
