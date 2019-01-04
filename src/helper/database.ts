
import {MongoClient, Db} from 'mongodb';

const url = 'mongodb://localhost:27017/';
const databaseName = 'plzdb';

export default class Database {

    constructor() {}

    static async getDbInstance() {
        try {
            const connection = await MongoClient.connect(url, { useNewUrlParser: true });
            return connection.db(databaseName);
        }
        catch (e) {
            console.log(`Uh Oh: ${e}`);
        }
    }
}