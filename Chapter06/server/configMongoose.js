import mongoose from 'mongoose';
var Schema = mongoose.Schema;

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

var defaultDraftJSobject = {
  "blocks" : [],
  "entityMap" : {}
}

var articleSchema = new Schema({
    articleTitle: { type: String, required: true, default: 'default articletitle' },
    articleSubTitle: { type: String, required: true, default: 'defaulsubtitle' },
    articleContent: { type: String, required: true, default: 'defaultcontent' },
    articleContentJSON: { type: Object, required: true, default:defaultDraftJSobject },
    articlePicUrl: { type: String, required: true, default: '/static/placeholder.png' }
  },
  {
    minimize: false
  }
);

var Article = mongoose.model('Article', articleSchema, 'articles');

export default {
  Article,
  User
}