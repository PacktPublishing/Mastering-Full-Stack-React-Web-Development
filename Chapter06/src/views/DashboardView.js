"use strict";

import React from 'react';
import Falcor from 'falcor';
import falcorModel from '../falcorModel.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { LoginForm } from '../components/LoginForm.js';
import { Link } from 'react-router';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Avatar from 'material-ui/lib/avatar';
import ActionInfo from 'material-ui/lib/svg-icons/action/info';
import FileFolder from 'material-ui/lib/svg-icons/file/folder';
import RaisedButton from 'material-ui/lib/raised-button';
import Divider from 'material-ui/lib/divider';

const mapStateToProps = (state) => ({
...state
});

const mapDispatchToProps = (dispatch) => ({
});

class DashboardView extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    let articlesJSX = [];
    this.props.article.forEach((articleDetails, articleKey) => {
      let articlePicUrl = articleDetails.articlePicUrl || '/static/placeholder.png';
      let articleContentPlanText = articleDetails.articleContent.replace(/<\/?[^>]+(>|$)/g, "");
      let currentArticleJSX = (
        <Link to={`/edit-article/${articleDetails['_id']}`} key={articleKey}>
        <ListItem
          leftAvatar={<img src={articlePicUrl} width="50" height="50" />}
          primaryText={articleDetails.articleTitle}
          secondaryText={articleContentPlanText}/>
        </Link>
      );

    articlesJSX.push(currentArticleJSX);
    });

    return (
      <div style={{height: '100%', width: '75%', margin: 'auto'}}>
        <Link to='/add-article'>
          <RaisedButton
          label="Create an article"
          secondary={true}
          style={{margin: '20px 20px 20px 20px'}} />
        </Link>
        <List>
          {articlesJSX}
        </List>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardView);