"use strict";


import React from 'react';
import { Link } from 'react-router';

import themeDecorator from 'material-ui/lib/styles/theme-decorator';
import getMuiTheme from 'material-ui/lib/styles/getMuiTheme';

import RaisedButton from 'material-ui/lib/raised-button';
import AppBar from 'material-ui/lib/app-bar';
import Snackbar from 'material-ui/lib/snackbar';
import ActionHome from 'material-ui/lib/svg-icons/action/home';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import articleActions from '../actions/article.js';


const mapStateToProps = (state) => ({
  ...state
});

const mapDispatchToProps = (dispatch) => ({
  articleActions: bindActionCreators(articleActions, dispatch)
});


class CoreLayout extends React.Component {
  static propTypes = {
    children : React.PropTypes.element
  } 
  constructor(props) {
    super(props);
      this.state = {
        errorValue: null
      }

    if(typeof window !== 'undefined') {
      errorFuncUtil = this.handleFalcorErrors.bind(this);
    }

  }

  handleFalcorErrors(errMsg, errPath) {
    let errorValue = `Error: ${errMsg} (path ${JSON.stringify(errPath)})`
    this.setState({errorValue});
  }

  componentWillMount() {
    if(typeof window !== 'undefined' && !this.props.article.get) {
      this.props.articleActions.articlesList(this.props.article);
    }
  }

 render () {
    let errorSnackbarJSX = null;
    if(this.state.errorValue) {
      errorSnackbarJSX = <Snackbar
        open={true}
        message={this.state.errorValue}
        autoHideDuration={8000}
        onRequestClose={ () => console.log('You can add custom onClose code') } />;
    }

    const buttonStyle = {
      margin: 5
    };
    const homeIconStyle = {
      margin: 5,
      paddingTop: 5
    };

    let menuLinksJSX;
    let userIsLoggedIn = typeof localStorage !== 'undefined' && localStorage.token && this.props.routes[1].name !== 'logout';

    if(userIsLoggedIn) {
      menuLinksJSX = (<span>
          <Link to='/dashboard'><RaisedButton label="Dashboard" style={buttonStyle}  /></Link> 
          <Link to='/logout'><RaisedButton label="Logout" style={buttonStyle}  /></Link> 
        </span>);
    } else {
      menuLinksJSX = (<span>
          <Link to='/register'><RaisedButton label="Register" style={buttonStyle}  /></Link> 
          <Link to='/login'><RaisedButton label="Login" style={buttonStyle}  /></Link> 
        </span>);
    }

    let homePageButtonJSX = (<Link to='/'>
        <RaisedButton label={<ActionHome />} style={homeIconStyle}  />
      </Link>);

    return (
        <div>
          {errorSnackbarJSX}
          <AppBar
            title='Publishing App'
            iconElementLeft={homePageButtonJSX}
            iconElementRight={menuLinksJSX} />
            <br/>
            {this.props.children}
        </div>
     
    );
  }
}

let errorFuncUtil =  (errMsg, errPath) => {
}

export { errorFuncUtil as errorFunc };

const muiCoreLayout = themeDecorator(getMuiTheme(null, { userAgent: 'all' }))
(CoreLayout);

export default connect(mapStateToProps, mapDispatchToProps)(muiCoreLayout);