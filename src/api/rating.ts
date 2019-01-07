import Database from "../helper/database";
import {ObjectID} from 'mongodb';

const basePath = '/api/rating';

export default class RatingHandler {

    app;

    constructor(app) {
        this.app = app;
        this.registerRoutes();
    }

    private registerRoutes() {
        this.rate();
    }

    private rate() {
        this.app.post(`${basePath}/rate`, async (req, res) => {
            const userId = req.headers['id'];
            const dbInstance = await Database.getDbInstance();
            const rating = req.body['rating'];
            const postId = req.body['postId'];
            if(rating != null && Number.isInteger(rating)) {
                if(postId == null) {
                    res.send({error : "Please provide the ID of the post this rating belongs to."});
                    return;
                }
                try {
                    dbInstance.collection('posts').findOne(new ObjectID(postId), (err, result) => {
                        if (result == null) {
                            res.send({error: "The specified post does not exist."});
                            return;
                        }
                        dbInstance.collection("ratings").insertOne({
                            postId: req.body['postId'],
                            userId: userId,
                            rating: req.body['rating'] > 8 ? 8 : req.body['rating']
                        }, (err, result) => {
                            if (err) res.send({error: "Could not add rating.."});
                            else {
                                res.send({status: `Successfully added rating to post ${req.body['postId']}`});
                            }
                        });
                    });
                }
                catch (e) {
                    res.send({error : "Invalid post ID"});
                }
            }
            else res.send({error : "Rating must be an integer value!"})
        })
    }

    private query() {
        this.app.get(`${basePath}/query`, (req, res) => {

        })
    }

}