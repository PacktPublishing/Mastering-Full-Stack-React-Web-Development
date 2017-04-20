import configMongoose from './configMongoose';

let Article = configMongoose.Article;
import sessionRoutes from './routesSession';

const PublishingAppRoutes = [
  ...sessionRoutes,
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
    route: 'articles[{integers}]["_id","articleTitle","articleContent"]',
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