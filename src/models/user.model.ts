// const { mongoose } = require(".");

import md5 from "md5"
import bcrypt from 'bcryptjs'

module.exports = (mongoose: any) => {
    const schema = mongoose.Schema(
        {
            username: String,
            password: String,
            name: String,
            email: String,
            verified: {
                token: String,
                status: Boolean
            },
            loginToken: String
        },
        {
            timestamps: true
        }
    )

    schema.method("toJSON", function(this: any){
        const {__v, _id, ...object} = this.toObject()
        object.id = _id
        return object
    })

    schema.statics.emailExist = async function(email: String){

        if(!email) throw new Error('Invalid Email');

        try {
            const data = await this.findOne({email})
            if(data) return false
    
            return true
        } catch (error: any) {
            console.log('Error inside emailExist function', error.message)
            return false
        }

    }

    schema.statics.usernameExist = async function(username: String){

        if(!username) throw new Error('Invalid Username');
        
        try {
            const data = await this.findOne({username})
            if(data) return false
    
            return true
        } catch (error: any) {
            console.log('Error inside usernameExist function', error.message)
            return false
        }

    }

    schema.statics.checkPassword = async function (username: String, password: String) {
        if(!password) throw new Error('Invalid password');

        const pwd =  await md5(`${password}`)
        try {
            const data = await this.findOne({username})
            const compare = await bcrypt.compare (pwd, data.password)

            if(compare) return [true, data.id]

            return [false, null]
            
        } catch (error: any) {
            console.log('Error inside checkPassword function', error.message)
            return [false, null]
        }
    }

    const User = mongoose.model("users", schema)
    return User
}