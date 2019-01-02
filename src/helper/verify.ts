
import {User} from "../api/user";
import {Md5} from 'ts-md5/dist/md5'
import Database from "./database";

export async function isKeyValid(database : Database, id, key) {
    const db = await database.getDbInstance();
    try {
        let user = new User(await db.collection('users').findOne({id : id}));
        let username = user.username;
        let password = user.password;
        let unencryptedKey = `${username};${password}`;
        if(hash(unencryptedKey) === key) {
            return true;
        }
        else return false;
    }
    catch (e) {
        return false;
    }
}

async function hash(key : string) {
    return await Md5.hashStr(key);
}