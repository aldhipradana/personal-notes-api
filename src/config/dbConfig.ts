import 'dotenv/config'

const config = {
    url: process.env.MONGODB_URL,
    // url: process.env.ATLAS_URL
    port: process.env.PORT
}

export default config