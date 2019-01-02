
import Database from './helper/database';
import {isKeyValid} from './helper/verify';
import UserHandler from "./api/user";
import PostHandler from "./api/post";
import RatingHandler from "./api/rating";
import express = require('express');

const app = express();
const port = 3000;

const postHandler = new PostHandler(app);
const ratingHandler = new RatingHandler(app);
const userHandler = new UserHandler(app);

const database = new Database();

app.get('/', (req, res) => res.send('Hello World!'));

app.use('/api', (req, res) => {
    let accessApi = false;
    const id = req.headers['id'];
    const secret = req.headers['secret'];
    isKeyValid(database, id, secret)
        .then(isValid =>  accessApi = isValid)
        .catch(() => console.log("Request sent with invalid and/or no API key"));
    if(!accessApi) {
        res.send({error : "Invalid API Key!"});
    }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));