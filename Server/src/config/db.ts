import mongoose from "mongoose";
import dns from "node:dns";

// Node's default DNS resolver can fail SRV lookups (used by mongodb+srv://)
// on networks where the router/ISP DNS doesn't support them, even though the
// OS-level resolver works fine. Point Node at a public resolver instead.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

async function ConnectoDB() {
    try {
        const mongouri = process.env.MONGODB_URI

        if(!mongouri) { 
            throw Error("Mongo Uri Not defined in Enivorinmental Variables")
        }


        await mongoose.connect(mongouri)

        console.log(`MongoDb connection successful`)
    } catch (error) {
        console.error(`Mongodb Connection error!`, error)
        process.exit(1)
    }
    
}

export default ConnectoDB