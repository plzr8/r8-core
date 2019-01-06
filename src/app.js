"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./helper/database");
const verify_1 = require("./helper/verify");
const user_1 = require("./api/user");
const post_1 = require("./api/post");
const rating_1 = require("./api/rating");
const express = require("express");
const account_1 = require("./helper/account");
const app = express();
const database = new database_1.default();
const port = 3000;
app.use(express.json());
app.use('/api', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    const id = req.headers['id'];
    const secret = req.headers['secret'];
    let keyValid;
    try {
        keyValid = yield verify_1.isKeyValid(database, id, secret);
    }
    catch (e) {
        keyValid = false;
        console.log("Request sent with invalid and/or no API key");
    }
    if (!keyValid) {
        res.send({ error: "Invalid API Key!" });
    }
    else
        next();
}));
const accountManager = new account_1.default(app, database);
const postHandler = new post_1.default(app);
const ratingHandler = new rating_1.default(app);
const userHandler = new user_1.default(app, accountManager);
app.get('/', (req, res) => res.send('Hello World!'));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
//# sourceMappingURL=app.js.map