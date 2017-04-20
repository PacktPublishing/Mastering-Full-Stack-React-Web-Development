"use strict";

import React from 'react';
import Falcor from 'falcor';
import { Link } from 'react-router';
import falcorModel from '../../falcorModel.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import articleActions from '../../actions/article.js';
import WYSIWYGeditor from '../../components/articles/WYSIWYGeditor';
import { stateToHTML } from 'draft-js-export-html';
import RaisedButton from 'material-ui/lib/raised-button';
import Popover from 'material-ui/lib/popover/popover';

const mapStateToProps = (state) => ({
  ...state
});

const mapDispatchToProps = (dispatch) => ({
  articleActions: bindActionCreators(articleActions, dispatch)
});

class EditArticleView extends React.Component {
  constructor(props) {
    super(props);
    this._onDraftJSChange = this._onDraftJSChange.bind(this);
    this._articleEditSubmit = this._articleEditSubmit.bind(this);
    this._fetchArticleData = this._fetchArticleData.bind(this);
    this._handleDeleteTap = this._handleDeleteTap.bind(this);
    this._handleDeletion = this._handleDeletion.bind(this);
    this._handleClosePopover = this._handleClosePopover.bind(this);

    this.state = {
      articleFetchError: null,
      articleEditSuccess: null,
      editedArticleID: null,
      articleDetails: null,
      title: 'test',
      contentJSON: {},
      htmlContent: '',
      openDelete: false,
      deleteAnchorEl: null
    };
  }

  _handleDeleteTap(event) {
    this.setState({
      openDelete: true,
      deleteAnchorEl: event.currentTarget
    });
  }

  async _handleDeletion() {
    let articleID = this.state.editedArticleID;

    let deletetionResults = await falcorModel.call(
            ['articles', 'delete'],
            [articleID]
          ).then((result) => {
        return result;
      });

    this.props.articleActions.deleteArticle(articleID);
    this.setState({
      openDelete: false
    });
    this.props.history.pushState(null, '/dashboard');
  }

  _handleClosePopover() {
    this.setState({
      openDelete: false
    });
  }

  componentWillMount() {
    this._fetchArticleData();
  }

  _fetchArticleData() {
    let articleID = this.props.params.articleID;
    if(typeof window !== 'undefined' && articleID) {
      let articleDetails = this.props.article.get(articleID);
      if(articleDetails) {
        this.setState({
          editedArticleID: articleID,
          articleDetails: articleDetails
        });
      }else {
        this.setState({
          articleFetchError: true
        })
      }
    }
  }

  _onDraftJSChange(contentJSON, contentState) {
    let htmlContent = stateToHTML(contentState);
    this.setState({contentJSON, htmlContent});
  }

  async _articleEditSubmit() {
    let currentArticleID = this.state.editedArticleID;
    let editedArticle = {
      _id: currentArticleID,
      articleTitle: this.state.title,
      articleContent: this.state.htmlContent,
      articleContentJSON: this.state.contentJSON
    }

    let editResults = await falcorModel
      .call(
            ['articles', 'update'],
            [editedArticle]
          ).
      then((result) => {
        return result;
      });

    this.props.articleActions.editArticle(editedArticle);
    this.setState({ articleEditSuccess: true });
  }

  render () {
    if(this.state.articleFetchError) {
      return <h1>Article not found (invalid article's ID {this.props.params.articleID})</h1>;
    } else if(!this.state.editedArticleID) {
      return <h1>Loading article details</h1>;
    } else if(this.state.articleEditSuccess) {
      return (
        <div style={{height: '100%', width: '75%', margin: 'auto'}}>
          <h3>Your article has been edited successfully</h3>
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

    let initialWYSIWYGValue = this.state.articleDetails.articleContentJSON;
    return (
      <div style={{height: '100%', width: '75%', margin: 'auto'}}>
      <h1>Edit an exisitng article</h1>
      <WYSIWYGeditor
        initialValue={initialWYSIWYGValue}
        name="editarticle"
        title="Edit an article"
        onChangeTextJSON={this._onDraftJSChange} />
        <RaisedButton
          onClick={this._articleEditSubmit}
          secondary={true}
          type="submit"
          style={{margin: '10px auto', display: 'block', width: 150}}
          label={'Submit Edition'} />
      <hr />
      <h1>Delete permamently this article</h1>
        <RaisedButton
          onClick={this._handleDeleteTap}
          label="Delete" />
        <Popover
          open={this.state.openDelete}
          anchorEl={this.state.deleteAnchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this._handleClosePopover}>
          <div style={{padding: 20}}>
            <RaisedButton
              onClick={this._handleDeletion}
              primary={true}
              label="Permament delete, click here"/>
          </div>
        </Popover>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditArticleView);