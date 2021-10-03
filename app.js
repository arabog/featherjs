const feathers = require("@feathersjs/feathers")
const app = feathers()


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



// register d msg service on d Feathers application
app.use("messages", new MessageService())

// log every time a msg has been cr8ed
app.service("messages").on("created", message => {
          console.log("A new message has been created", message)
})


// a fxn dt cr8s new msg & dn logs
// all existing msgs
const main = async () => {
          // cr8 a new msg on our msg service
          await app.service("messages").create({
                    text: "Hello Feathers"
          })

          await app.service("messages").create({
                    text: "Hello again"
          })

          // find all existing msgs
          const messages = await app.service("messages").find()

          console.log("All messages", messages)
}


main()
