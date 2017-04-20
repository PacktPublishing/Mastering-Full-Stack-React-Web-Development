import mongoose from 'mongoose';

const articleSchema = {
  articleTitle:String,
  articleContent:String
};

const userSchema = {
  "username" : { type: String, index: {unique: true, dropDups: true }},
  "password" : String,
  "firstName" : String,
  "lastName" : String,
  "email" : { type: String, index: {unique: true, dropDups: true }},
  "role" : { type: String, default: 'editor' },
  "verified" : Boolean,
  "imageUrl" : String
};

const conf = {
  hostname: process.env.MONGO_HOSTNAME || 'localhost',
  port: process.env.MONGO_PORT || 27017,
  env: process.env.MONGO_ENV || 'local',
};

const Article = mongoose.model('Article', articleSchema, 'articles');
const User = mongoose.model('User', userSchema, 'pubUsers');

mongoose.connect(`mongodb://${conf.hostname}:${conf.port}/${conf.env}`);


export default {
  Article,
  User
}