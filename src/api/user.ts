
import '../helper/database';
import Database from "../helper/database";
import {Db, ObjectID} from "mongodb";
import AccountManager from "../helper/account";

const basePath = '/api/user';

export default class UserHandler {

    app;
    access : UserAccess;
    manager : AccountManager;

    constructor(app, database, manager) {
        this.app = app;
        this.access = new UserAccess(database);
        this.manager = manager;
        this.registerPaths()
    }

    registerPaths() {
        this._queryUser();
        this._deleteUser();
        this._changePicture();
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
    _deleteUser() {
        this.app.delete(`${basePath}/delete`, async (req, res) => {
            const id = req.headers['id'];
            const users = await this.access.getUsers();
            await users.findOne(new ObjectID(id), async (err, user) => {
                if(err) return;
                const password = req.body['password'];
                if(password == null) {
                    res.json({error : "Please provide a password."});
                    return;
                }
                if(user['password'] == password) {
                    await this.manager.delete(user['username'], user['password']);
                    res.json({status : "Successfully deleted user."});
                }
                else {
                    res.json({error : "Incorrect password."});
                }
            });
        });
    }
    _changePicture() {
        this.app.patch(`${basePath}/changeImage`, async (req, res) => {
            const newImageLink = req.body['image'];
            if(newImageLink == null) {
                res.json({error : "No image was provided."})
            }
            else {
               const users = await this.access.getUsers();
               users.findOne(new ObjectID(req.headers['id']), (err, result) => {
                   users.updateOne({username : result['username']}, {$set: {image : newImageLink}}, (err, result) => {
                       console.log(err);
                       if(!err) {
                           res.json({status : "Successfully updated profile image."})
                       }
                       else res.json({error : "User does not exist."});
                   })
               });
            }
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
