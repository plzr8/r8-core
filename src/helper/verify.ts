
import {User} from "../api/user";
import {Md5} from 'ts-md5/dist/md5'
import Database from "./database";

import {ObjectID} from 'mongodb';

export async function isKeyValid(database : Database, id, secret) {
    const db = await database.getDbInstance();
    try {
        let user = new User(await db.collection('users').findOne(new ObjectID(id)));
        let username = user.username;
        let password = user.password;
        let unencryptedKey = `${username};${password}`;
        return (await hash(unencryptedKey)) == secret;
    }
    catch (e) {
        return false;
    }
}

async function hash(key : string) {
    return await Md5.hashStr(key);
}