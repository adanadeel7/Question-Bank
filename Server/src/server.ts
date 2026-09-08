import 'dotenv/config'
import app from './app.js'
import ConnectoDB from './config/db.js'
import http from 'http'

async function startServer() {
    await ConnectoDB()

    const server = http.createServer(app)   

    server.listen(process.env.PORT, ()=> { 
        console.log(`server is running at ${process.env.PORT}`)
    }) 
}

startServer()