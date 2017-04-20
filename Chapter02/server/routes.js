import configMongoose from './configMongoose';
import sessionRoutes from './routesSession';

const Article = configMongoose.Article;

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