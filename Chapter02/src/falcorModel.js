import falcor from 'falcor';
import FalcorDataSource from 'falcor-http-datasource';

const model = new falcor.Model({
  source: new FalcorDataSource('/model.json')
});

export default model;