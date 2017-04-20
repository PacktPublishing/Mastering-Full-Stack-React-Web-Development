"use strict";

import React from 'react';
import { connect } from 'react-redux';
import WYSIWYGeditor from '../../components/articles/WYSIWYGeditor.js';
import { stateToHTML } from 'draft-js-export-html';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import articleActions from '../../actions/article.js';
import RaisedButton from 'material-ui/lib/raised-button';
import falcorModel from '../../falcorModel.js';
import ImgUploader from '../../components/articles/ImgUploader';
import DefaultInput from '../../components/DefaultInput';
import Formsy from 'formsy-react';

const mapStateToProps = (state) => ({
  ...state
});

const mapDispatchToProps = (dispatch) => ({
  articleActions: bindActionCreators(articleActions, dispatch)
});

class AddArticleView extends React.Component {
  constructor(props) {
    super(props);
    this._onDraftJSChange = this._onDraftJSChange.bind(this);
    this._articleSubmit = this._articleSubmit.bind(this);
    this.updateImgUrl = this.updateImgUrl.bind(this);this.state = {
      title: 'test',
      contentJSON: {},
      htmlContent: '',
      newArticleID: null,
      articlePicUrl: '/static/placeholder.png'
    };
  }

  async _articleSubmit(articleModel) {
    let newArticle = {
      articleTitle: articleModel.title,
      articleSubTitle: articleModel.subTitle,
      articleContent: this.state.htmlContent,
      articleContentJSON: this.state.contentJSON,
      articlePicUrl: this.state.articlePicUrl
    }
    let newArticleID = await falcorModel
    .call(
      'articles.add',
      [newArticle]
    ).then((result) => {
      return falcorModel.getValue(
        ['articles', 'newArticleID']
      ).then((articleID) => {
        return articleID;
      });
    });

    newArticle['_id'] = newArticleID;
    this.props.articleActions.pushNewArticle(newArticle);
    this.setState({ newArticleID: newArticleID });
  }

  updateImgUrl(articlePicUrl) {
    this.setState({
      articlePicUrl: articlePicUrl
    });
  }

  _onDraftJSChange(contentJSON, contentState) {
    let htmlContent = stateToHTML(contentState);
    this.setState({contentJSON, htmlContent});
  }

  render () {
    if(this.state.newArticleID) {
      return (
        <div style={{height: '100%', width: '75%', margin: 'auto'}}>
          <h3>Your new article ID is {this.state.newArticleID}</h3>
          <Link to='/dashboard'>
            <RaisedButton
              secondary={true}
              type="submit"
              style={{margin: '10px auto', display: 'block', width: 150}}
              label='Done' />
          </Link>
        </div>
      );
    }
    return (
      <div style={{height: '100%', width: '75%', margin: 'auto'}}>
        <h1>Add Article</h1>
        <Formsy.Form onSubmit={this._articleSubmit}>
          <DefaultInput
            onChange={(event) => {}}
            name='title'
            title='Article Title (required)' required />

          <DefaultInput
            onChange={(event) => {}}
            name='subTitle'
            title='Article Subtitle' />

          <WYSIWYGeditor
            name="addarticle"
            title="Create an article"
            onChangeTextJSON={this._onDraftJSChange} />
            
          <div style={{margin: '10px 10px 10px 10px'}}>
            <ImgUploader updateImgUrl={this.updateImgUrl}
              articlePicUrl={this.state.articlePicUrl} />
          </div>

          <RaisedButton
            secondary={true}
            type="submit"
            style={{margin: '10px auto', display: 'block', width: 150}}
            label={'Submit Article'} />
        </Formsy.Form>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddArticleView);