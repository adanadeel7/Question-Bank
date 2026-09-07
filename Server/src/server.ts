import app from './app.js'
import dotenv from 'dotenv'
import ConnectoDB from './config/db.js'
import http from 'http'


dotenv.config()

async function startServer() { 
    await ConnectoDB()

    const server = http.createServer(app)   

    server.listen(process.env.PORT, ()=> { 
        console.log(`server is running at ${process.env.PORT}`)
    }) 
}

startServer()