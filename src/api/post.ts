import Database from "../helper/database";
import {Db, ObjectID} from 'mongodb';

const basePath = '/api/post';

export default class PostHandler {

    app;

    constructor(app) {
        this.app = app;
        this.registerRoutes();
    }

    private registerRoutes() {
        this.createPost();
        this.deletePost();
    }

    private createPost() {
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

    private deletePost() {
        this.app.delete(`${basePath}/delete`, async (req, res) => {
            const userId = req.headers['id'];
            const dbInstance = await Database.getDbInstance();
            const postId = req.body['id'];
            if(postId == null) {
                res.send({error : "Please specify a post ID"});
                return;
            }
            dbInstance.collection('posts').findOne(new ObjectID(postId), (err, result) => {
                if(err) {
                    res.send({error : "Could not find specified post"});
                    return;
                }
                if(result != null && result['userId'] == userId) {
                    dbInstance.collection('posts').deleteOne({_id : new ObjectID(postId)}, (err, _) => {
                        if(err){
                            res.send({error : "Could not delete post."});
                            console.log(err);
                        }
                        else {
                            res.send({status : `Successfully deleted post.`})
                        }
                    });
                }
                else {
                    res.send({error : "You don't have permission to do that."});
                }
            });
        })
    }

    private query() {
        this.app.get(`${basePath}/query`, (req, res) => {

        })
    }

}