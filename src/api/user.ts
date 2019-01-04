
import '../helper/database';
import Database from "../helper/database";
import {Db, ObjectID} from "mongodb";

const basePath = '/api/user';

export default class UserHandler {

    app;
    access : UserAccess;

    constructor(app, database) {
        this.app = app;
        this.access = new UserAccess(database);
        this.registerPaths()
    }

    registerPaths() {
        this._queryUser();
    }

    _queryUser() {
        this.app.get(`${basePath}/:username`, async (req, res) => {
            let users = await this.access.getUsers();
            users.findOne({username : req.params['username']}, (err, result) => {
                if(result != null) {
                    res.json({
                        username : result['username'],
                        image : result['image'],
                        description: result['description']
                    });
                }
                else {
                    res.send({error : "That user does not exist!"});
                }
            });
        });
    }
}

export class User {

    id : ObjectID;
    username : string;
    password : string;
    email : string;
    image : string;
    description : string;
    json;

    constructor(raw) {
        this.id = raw['_id'];
        this.username = raw['username'];
        this.password = raw['password'];
        this.email = raw['email'];
        this.image = raw['image'];
        this.description = raw['description'];
        this.json = raw;
    }
}

class UserAccess {

    database : Database;

    constructor(database) {
        this.database = database;
    }

    async getUsers() {
        const dbInstance : Db = await Database.getDbInstance();
        return await dbInstance.collection('users');
    }

}
