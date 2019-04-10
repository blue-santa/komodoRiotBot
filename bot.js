// Require node modules
require('dotenv').config({ path: require('find-config')('.env')})
const meetings = require('./meetings.js')
const sdk = require('matrix-bot-sdk')

/*********************/
/* Set configuration */
/*********************/

// Set the home server
const homeserverUrl = "https://matrix.org"

// Set the access token | Found in user settings > About > Reveal access token
const accessToken = process.env.ACCESS_TOKEN

// Set the bot storage; prevents repeat messages
const storage = new sdk.SimpleFsStorageProvider("sync.json")

// Build the client
const client = new sdk.MatrixClient(homeserverUrl, accessToken, storage)

// Instruct bot to automatically join upon an invite
sdk.AutojoinRoomsMixin.setupOnClient(client)

// Initiate client
client.on("room.message", handleCommand)
client.start().then(() => console.log("Client started"))

// Instructions for events
async function handleCommand(roomId, event) {

    // If there's no content, ignore the message
    if (!event["content"]) return

    // Ignore any content that is not a message
    if (event ["content"]["msgtype"] !== "m.text") return

    // If the bot itself sent the current message, ignore it
    if (event["sender"] === await client.getUserId()) return

    // Extract content body
    const body = event["content"]["body"]

    // Listen only for the "!schedule" instruction
    if (!body || !body.startsWith("!schedule")) return

    // When the "!schedule" instruction occurs, create the response
    meetings.assembleValues((err, res) => {

        if (err) {
            return console.error(err)
        }
        
        // Build the reply value
        const reply = sdk.RichReply.createFor(roomId, event, res , res)
        reply["msgtype"] = "m.notice"

        // Send the message
        return client.sendMessage(roomId, reply)
    })        
}
