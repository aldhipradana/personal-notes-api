const { send } = require("express/lib/response");
import { Request, Response } from 'express';
import db from '../models/index'

const Post = db.posts

exports.findAll = (req: Request, res: Response) => {
    const id = req.params.id

    Post.find({
        userId: id,
        published: true
    })
    .then((result: any) => {
        res.send(result)
    }).catch((err: any) => {
        res.status(500).send({
            message: err.message || "Some error while retrieving posts."
        })
    });

}

exports.findUnpublish = (req: Request, res: Response) => {
    const id = req.params.id

    Post.find({
        userId: id,
        published: false
    })
    .then((result: any) => {
        res.send(result)
    }).catch((err: any) => {
        res.status(500).send({
            message: err.message || "Some error while retrieving posts."
        })
    });

}

exports.create = (req: Request, res: Response) => {
    const id = req.params.id

    const post = new Post({
        title: req.body.title,
        body: req.body.body,
        imgUrl: req.body.imgUrl ? req.body.imgUrl : '',
        published: req.body.published ? req.body.published : false,
        userId: id ? id : '',
    })

    post.save(post)
    .then((result: any) => {
        res.send(result)
    }).catch((err: any) => {
        res.status(409).send({
            message: err.message || "Some error while creating post."
        })
    });

}