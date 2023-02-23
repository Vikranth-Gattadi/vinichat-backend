import mongoose from 'mongoose'

const acoountSchema = mongoose.Schema({
    user: String,
    mobile: String,
    password: String,
    ImgUrl : String,
    user_id: String
})

export default mongoose.model('accounts', acoountSchema);