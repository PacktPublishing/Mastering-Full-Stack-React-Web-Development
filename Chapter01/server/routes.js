import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost/local');

const articleSchema = {
  articleTitle:String,
  articleContent:String
};

const Article = mongoose.model('Article', articleSchema, 'articles');

const PublishingAppRoutes = [
  {
    route: 'articles.length',
    get: () => Article.count({}, (err, count) => count)
      .then ((articlesCountInDB) => {
        return {
          path: ['articles', 'length'],
          value: articlesCountInDB
        };
      })
  },
  {
    route: 'articles[{integers}]["id","articleTitle","articleContent"]',
    get: (pathSet) => {
      const articlesIndex = pathSet[1];

      return Article.find({}, (err, articlesDocs) => articlesDocs)
        .then ((articlesArrayFromDB) => {
          let results = [];

          articlesIndex.forEach((index) => {
            const singleArticleObject = articlesArrayFromDB[index].toObject();
            const falcorSingleArticleResult = {
              path: ['articles', index],
              value: singleArticleObject
            };

            results.push(falcorSingleArticleResult);
          });

          return results;
        });
    }
  }
];

export default PublishingAppRoutes;