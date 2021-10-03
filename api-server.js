const feathers = require("@feathersjs/feathers")
const express = require("@feathersjs/express")
const socketio = require("@feathersjs/socketio")


// cr8 an expressjs compatible feathers application
const app = express(feathers())


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
          app.channel("everybody").join(connection)
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

/* The app.use calls probably look familiar if you have used 
Express before. The app.configure calls set up the Feathers 
transport to host the API. app.on('connection') and app.publish 
are used to set up event channels which send real-time events 
to the proper clients (everybody that is connected to our server 
in this case). You can learn more about channels after finishing 
this guide in the channels API. */
