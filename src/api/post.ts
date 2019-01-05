import Database from "../helper/database";
import {Db} from 'mongodb';

const basePath = '/api/post';

export default class PostHandler {

    app;
    database : Database;

    constructor(app, database) {
        this.app = app;
        this.database = database;
        this._registerRoutes();
    }

    _registerRoutes() {
        this._createPost();
    }

    _createPost() {
        this.app.post(`${basePath}/create`, async (req, res) => {
            const userId = req.headers['id'];
            const dbInstance : Db = await Database.getDbInstance();
            if(req.body['image'] == null) {
                res.send({error : "You must specify an image for your post."});
                return;
                //note: descriptions are optional
            }
            dbInstance.collection('posts').insertOne({
                userId : userId,
                image : req.body['image'],
                description : req.body['description'] == null ? "" : req.body['description']
            }, (err, result) => {
                if(err) {
                    res.send({error : err});
                }
                else res.send({status : `Successfully created post ${result['insertedId']}`})
            });
        })
    }

    _deletePost() {

    }

}