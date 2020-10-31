const mongoose = require('mongoose')
const DBconnect = async () => {
    const connection = await mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify:true,useUnifiedTopology:true,
    })
    console.log(`Mongodb Is Connected:${connection.connection.host}`)
}
module.exports =DBconnect