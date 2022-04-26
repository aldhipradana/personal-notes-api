import { verifyToken } from "../middleware/verifyToken"


module.exports = (app: any) => {
    const users = require('../controllers/user.controller')
    const router = require('express').Router()

    router.get('/', verifyToken, users.findAll)
    router.post('/', users.create)
    // router.get('/:id', users.findOne)
    // router.put('/:id', users.update)
    router.delete('/:id', users.delete)
    router.post('/login/', users.login)

    app.use('/api/users', router)

}