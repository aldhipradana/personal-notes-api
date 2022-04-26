import { verifyToken } from "../middleware/verifyToken"


module.exports = (app: any) => {
    const posts = require('../controllers/post.controller')
    const router = require('express').Router()

    router.get('/:id', verifyToken, posts.findAll)
    router.get('/unpublished/:id', verifyToken, posts.findUnpublish)
    router.post('/:id', verifyToken, posts.create)
    // router.get('/single/:id', posts.findOne)
    // router.put('/:id', posts.update)
    // router.delete('/:id', posts.delete)

    app.use('/api/posts', router)


}