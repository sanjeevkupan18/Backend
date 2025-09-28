import dotenv from "dotenv"
import mongoose from "mongoose"
import { DB_NAME } from "./constants.js"
import connectDB from "./db/index.js"


dotenv.config({
    path:"./env"
})

import express from 'express'
const app = express()

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000 ,()=>{
        console.log("Server Started Successfully..")
    })
})
.catch((error)=>{
    console.log("Error",error)
})

// ;(async ()=>{
//     try {
//         await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
//         app.on("error",(error)=>{
//             console.error("Err",error)
//             process.exit(1)
//         })

//         app.listen(process.env.PORT,()=>{
//             console.log(`app is listening on port ${process.env.PORT}`)
//         })
        
//     } catch (error) {
//         console.error("Error",error)
//         process.exit(1)
//     }
// })();