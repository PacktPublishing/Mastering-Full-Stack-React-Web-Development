import mongoose from 'mongoose';

var userSchema = {
  "username" : { type: String, index: {unique: true, dropDups: true }},
  "password" : String,
  "firstName" : String,
  "lastName" : String,
  "email" : { type: String, index: {unique: true, dropDups: true }},
  "role" : { type: String, default: 'editor' },
  "verified" : Boolean,
  "imageUrl" : String
}

var User = mongoose.model('User', userSchema, 'pubUsers');


const conf = {
  hostname: process.env.MONGO_HOSTNAME || 'localhost',
  port: process.env.MONGO_PORT || 27017,
  env: process.env.MONGO_ENV || 'local',
};

mongoose.connect(`mongodb://${conf.hostname}:${conf.port}/${conf.env}`);

var articleSchema = {
  articleTitle:String,
  articleContent:String
}
var Article = mongoose.model('Article', articleSchema, 'articles');

export default {
  Article,
  User
}