import mongoose from 'mongoose'
const messagesSchema = mongoose.Schema({
    message: String,
    type: String,
    time: String
})
const chatsSchema = mongoose.Schema({
    chat_name: String,
    chat_mobile: String,
    ImgUrl: String,
    backGroundImg: String,
    messages: [messagesSchema]
})
const vinichatSchema = mongoose.Schema({
    user: String,
    ImgUrl: String,
    mobile: String,
    chats: [chatsSchema]
})

export default mongoose.model('users', vinichatSchema);