import mongoose from "mongoose";


async function ConnectoDB() {
    try {
        const mongouri = process.env.MONGODB_URI

        if(!mongouri) { 
            throw Error("Mongo Uri Not defined in Enivorinmental Variables")
        }


        console.log(`MongoDb connection successful`)

        await mongoose.connect(mongouri)
    } catch (error) {
        console.error(`Mongodb Connection error!`)
        process.exit(1)
    }
    
}

export default ConnectoDB