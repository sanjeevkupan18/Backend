import mongoose from 'mongoose'
import { DB_NAME } from '../constants.js'

const connectDB = async()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`)
        console.log(`\nMongoDB connected || DB HOST : ${connectionInstance.connection.host}`)
    } catch (error) {
        console.error("MongoDb connection Failed",error)
        process.exit(1)
    }
}

export default connectDB;