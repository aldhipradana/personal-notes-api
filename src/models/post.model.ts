// const { mongoose } = require(".");

module.exports = (mongoose: any) => {
    const schema = mongoose.Schema(
        {
            title: String,
            body: String,
            imgUrl: String,
            published: Boolean,
            userId: String
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

    const Post = mongoose.model("posts", schema)
    return Post
}