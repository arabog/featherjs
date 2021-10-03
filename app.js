const feathers = require("@feathersjs/feathers")
const app = feathers()


// a msg service that allows to create new 
//  and return all existing messages

class MessageService {
          constructor() {
                    this.messages = []
          }

          async find() {
                    // return all our msgs
                    return this.messages
          }

          
          render() { 
                    return (  );
          }
}
 
export default MessageService;