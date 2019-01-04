
import {MongoClient, Db} from 'mongodb';

const url = 'mongodb://localhost:27017/';
const databaseName = 'plzdb';

export default class Database {

    client : MongoClient;

    constructor() {
        this.client = new MongoClient(url);
    }

    async getDbInstance() {
        try {
            const connection = await this.client.connect();
            return connection.db(databaseName);
        }
        catch (e) {
            console.log(`Uh Oh: ${e}`);
        }
    }
}