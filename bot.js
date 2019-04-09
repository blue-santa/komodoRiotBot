require('dotenv').config({ path: require('find-config')('.env')})

const sdk = require('matrix-bot-sdk')

const homeserverUrl = "https://matrix.org"

const accessToken = process.env.ACCESS_TOKEN

const storage = new sdk.SimpleFsStorageProvider("hello-bot.json")

const client = new sdk.MatrixClient(homeserverUrl, accessToken, storage)

sdk.AutojoinRoomsMixin.setupOnClient(client)

client.on("room.message", handleCommand)

client.start().then(() => console.log("Client started"))

async function handleCommand(roomId, event) {
    if (!event["content"]) return

    if (event ["content"]["msgtype"] !== "m.text") return

    if (event["sender"] === await client.getUserId()) return

    const body = event["content"]["body"]
    if (!body || !body.startsWith("!hello")) return

    const replyBody = "Hello"
    const reply = sdk.RichReply.createFor(roomId, event, replyBody, replyBody)
    reply["msgtype"] = "m.notice"
    client.sendMessage(roomId, reply)
}
