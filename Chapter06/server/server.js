import http from 'http';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import falcor from 'falcor';
import falcorExpress from 'falcor-express';
import FalcorRouter from 'falcor-router';
import routes from './routes.js';
import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { renderToStaticMarkup } from 'react-dom/server'
import ReactRouter from 'react-router';
import { RoutingContext, match } from 'react-router';
import * as hist from 'history';
import rootReducer from '../src/reducers';
import reactRoutes from '../src/routes';
import fetchServerSide from './fetchServerSide';
import s3router from 'react-s3-uploader/s3router';

const app = express();

app.server = http.createServer(app);
// CORS - 3rd party middleware
app.use(cors());
// This is required by falcor-express middleware to work correctly with falcor-browser
app.use(bodyParser.json({extended: false}));

app.use(bodyParser.urlencoded({extended: false}));

app.use('/s3', s3router({
  bucket: process.env.AWS_BUCKET_NAME,
  region: process.env.AWS_REGION_NAME,
  signatureVersion: 'v4',
  headers: {'Access-Control-Allow-Origin': '*'},
  ACL: 'public-read'
}));

app.use('/static', express.static('dist'));

app.use('/model.json', falcorExpress.dataSourceRoute(function(req, res) {
  return new FalcorRouter(
      []
        .concat(routes(req, res))
    );
}));


let handleServerSideRender = async (req, res, next) => {
  try {
    let articlesArray = await fetchServerSide();
    let initMOCKstore = {
      article: articlesArray
    }
    // Create a new Redux store instance
    const store = createStore(rootReducer, initMOCKstore);
    const location = hist.createLocation(req.path);
    match({
      routes: reactRoutes,
      location: location,
      }, (err, redirectLocation, renderProps) => {
        if (redirectLocation) {
    
          res.redirect(301, redirectLocation.pathname + redirectLocation.search);
        } else if (err) {
         
          next(err);
        // res.send(500, error.message);
        } else if (renderProps === null) {
      
          res.status(404)
          .send('Not found');
        } else {
            if (typeof renderProps === 'undefined') {
            // using handleServerSideRender middleware not required;
            // we are not requesting HTML (probably an app.js or other file)
           
            return;
          }
          let html = renderToStaticMarkup(
            <Provider store={store}>
              <RoutingContext {...renderProps}/>
            </Provider>
          );
          
          const initialState = store.getState()
          let fullHTML = renderFullPage(html, initialState);
          res.send(fullHTML);
        }
       });
    } catch (err) {
    next(err);
  }
}

let renderFullPage = (html, initialState) =>
{
return `
  <!doctype html>
  <html>
    <head>
      <title>Publishing App Server Side Rendering</title>
      <link rel="stylesheet" type="text/css" href="/static/styles-draft-js.css" />
    </head>
    <body>
      <div id="publishingAppRoot">${html}</div>
      <script>
        window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
      </script>
      <script src="/static/app.js"></script>
    </body>
  </html>
  `
};

app.use(handleServerSideRender);


app.server.listen(process.env.PORT || 3000);
console.log(`Started on port ${app.server.address().port}`);

export default app;
