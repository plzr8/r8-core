
import '../helper/database';
import Database from "../helper/database";
import {Db} from "mongodb";

const basePath = 'api/user';

export default class UserHandler {

    app;

    constructor(app) {
        this.app = app;
        this.registerPaths()
    }

    registerPaths() {

    }
}

export class User {

    id : string;
    username : string;
    password : string;
    image : string;
    description : string;

    constructor(raw) {
        this.id = raw['id'];
        this.username = raw['username'];
        this.password = raw['password'];
        this.image = raw['image'];
        this.description = raw['description'];
    }
}

class UserAccess {

    database : Database

    constructor(database) {
        this.database = database;
    }

    async _getUser(key, value) {
        const dbInstance : Db = await this.database.getDbInstance();
        return new User(await dbInstance.collection('users').findOne({key : value}));
    }

    async getUserByName(name) {
        return await this._getUser('username', name);
    }

    async getUserById(id) {
       return await this._getUser('id', id);
    }
}
