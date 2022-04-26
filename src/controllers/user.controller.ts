const { send } = require("express/lib/response");
import 'dotenv/config'
import { Request, Response } from 'express';
import db from '../models/index'
import md5 from 'md5';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';

const User = db.users

exports.findAll = (req: Request, res: Response) => {
    User.find()
    .then((result: any) => {
        res.send(result)
    }).catch((err: any) => {
        res.status(500).send({
            message: err.message || "Some error while retrieving posts."
        })
    });
}

exports.create = async (req: Request, res: Response) => {
    const {username, password, name, email} = req.body

    const pwd =  await md5(password)
    const hash =  await bcrypt.hash(pwd, 10)

    const checkUsername = await User.usernameExist(`${username}`)
    const checkEmail = await User.emailExist(`${email}`)

    const date = new Date()
    const now = date.toLocaleDateString()
    const verifiedToken = jwt.sign({ username, name, email, now }, `${process.env.VERIFIED_TOKEN}`, { expiresIn: 1000 * 60 * 15 } )
    const loginToken = jwt.sign({ username, name, email, now }, `${process.env.ACCESS_TOKEN}`, { expiresIn: 1000 * 60 * 15 } )

    
    if((!checkEmail) || (!checkUsername)){
        console.log(`cekEmail: `, checkEmail)
        console.log(`cekUsername: `, checkUsername)
        if(checkUsername){
            res.status(409).send({
                message: "Email already in use!."
            })
        }
        else if(checkEmail){
            res.status(409).send({
                message: "Username already in use!."
            })
        }
        else{
            res.status(409).send({
                message: "Username and Email already in use!."
            })
        }

    }else{
        const user = new User({
            username: username,
            password: hash,
            name: name,
            email: email,
            verified: {
                token: verifiedToken ? verifiedToken : '',
                status: req.body.published ? req.body.published : false
            },
            loginToken: loginToken ? loginToken : ''
        })
    
        user.save(user)
        .then((result: any) => {
            res.send(result)
        }).catch((err: any) => {
            res.status(409).send({
                message: err.message || "Some error while creating user."
            })
        });
    }

    

}

exports.delete = (req: Request, res: Response) => {
    const id = req.params.id

    User.findByIdAndDelete(id)
    .then((result: any) => {
        if(!result){
            res.status(404).send({
                message: "User Not Found!"
            })
        }else{
            res.send({
                message: "User was deleted!"
    
            })
        }

    }).catch((err: any) => {
        res.status(409).send({
            message: err.message || "Some error while deleting User."
        })
    });
}

exports.login = async (req : Request, res : Response) => {
    const { username, password } = req.body
    const checkUsername = await User.usernameExist(`${username}`)

    if(!checkUsername){
        const [checkPassword, id] = await User.checkPassword(username, password)
        if(checkPassword){

            const data = await User.findOne({ id })
            const {usname, name, email} = data
            const date = new Date()
            const now = date.toLocaleDateString()
            const loginToken = jwt.sign({ usname, name, email, now }, `${process.env.ACCESS_TOKEN}`, { expiresIn: '15s' } )

            const update = {
                loginToken: loginToken ? loginToken : ''
            }
            User.findByIdAndUpdate(id, update)
            .then((result: any) => {
                res.cookie('loginToken', loginToken, {
                    httpOnly: true,
                    maxAge: 24 * 60 * 60 * 1000,
                    // secure: true
                })
                res.json({loginToken})
                res.status(200).send({
                    message: "Login successfully!"
                })
            }).catch((err: any) => {
                
            });
            

        }else{
            res.status(401).send({
                message: "Unsuccessfull login, check your username and password!"
            })
        }
    }else{
        res.status(404).send({
            message: "User Not Found!"
        })
    }

}
