import http from 'http';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import falcor from 'falcor';
import falcorExpress from 'falcor-express';
import falcorRouter from 'falcor-router';
import routes from './routes.js';

const app = express();

app.server = http.createServer(app);
// CORS - 3rd party middleware
app.use(cors());
// This is required by falcor-express middleware to work correctly with falcor-browser
app.use(bodyParser.json({extended: false}));

app.use(bodyParser.urlencoded({extended: false}));

app.use('/model.json', falcorExpress.dataSourceRoute((req, res) => {
  return new falcorRouter(routes);
}));

app.use(express.static('dist'));

app.server.listen(process.env.PORT || 3000);
console.log(`Started on port ${app.server.address().port}`);

export default app;
