import mongoose from 'mongoose'
// import dbConfig from '@/models/index'
import dbConfig from '../config/dbConfig'

mongoose.Promise = global.Promise

const db: any= {}

db.mongoose = mongoose
db.url = dbConfig.url
db.posts = require('./post.model')(mongoose)
db.users = require('./user.model')(mongoose)

export default db