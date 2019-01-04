import Database from "./database";
import {Db} from 'mongodb';

const defaultImageLink = "https://image.freepik.com/free-icon/user-image-with-black-background_318-34564.jpg";
const defaultDescription = "A new user";

export default class AccountManager {

    database : Database;

    constructor(app, database) {
        this.database = database;
        app.post('/account/create', (req, res) => {
            const credentials = req.body;
            console.log(req.body);
            if(credentials['username'] == null || credentials['password'] == null || credentials['email'] == null) {
                res.json({error : "Not all account credentials were provided!"});
                return;
            }
            this.create(credentials['username'], credentials['password'], credentials['email'])
                .then(() => res.json({status : "Successfully created account!"}));
        })
    }


    async create(username, password, email) {
        const dbInstance : Db = await this.database.getDbInstance();
        dbInstance.collection('users').insertOne({
            username : username,
            password : password,
            email : email,
            image : defaultImageLink,
            description : defaultDescription
        }, (err, res) => {
            if(err) {
                res.send({error : err});
            }
            else {
                console.log(`Successfully added new user ${username}`);
            }
        });
    }

    delete(username : string, password : string) {

    }
}