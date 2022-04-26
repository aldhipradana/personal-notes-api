import 'dotenv/config'
import express from 'express';
import { Request, Response } from 'express';
import cors from 'cors' 

const app = express();
const port = process.env.PORT 


app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.use(
    cors({
        origin: "*",
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    })
)

import db from './models/index'

db.mongoose
    .connect(db.url, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
        // useFindAndModify: true
    })
    .then((result: any) => {
        console.log(`Db Connected`)
    }).catch((err: any) => {
        console.log(`Cannot Connected, msg: ${err}`, err)
        process.exit()
    });



app.get('/', (req: Request, res: Response) => {
    res.json({
        message: "Hello Node Je Es"
    })
});

require('./routes/post.routes')(app)
require('./routes/user.routes')(app)

app.listen(port, () => {
  console.log(`Application started on port http://localhost:${port}`);
});