
import Database from './helper/database';
import {isKeyValid} from './helper/verify';
import UserHandler from "./api/user";
import PostHandler from "./api/post";
import RatingHandler from "./api/rating";
import express = require('express');
import AccountManager from "./helper/account";

const app = express();
const database = new Database();
const port = 3000;

app.use(express.json());
app.use('/api', async (req, res, next) => {
    const id = req.headers['id'];
    const secret = req.headers['secret'];
    let keyValid;
    try {
        keyValid = await isKeyValid(database, id, secret);
    }
    catch(e) {
        keyValid = false;
        console.log("Request sent with invalid and/or no API key")
    }
    if(!keyValid) {
        res.send({error : "Invalid API Key!"});
    }
    else next();
});

const accountManager = new AccountManager(app, database);

const postHandler = new PostHandler(app);
const ratingHandler = new RatingHandler(app);
const userHandler = new UserHandler(app, database);


app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));