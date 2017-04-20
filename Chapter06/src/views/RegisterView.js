"use strict";

import React from 'react';
import falcorModel from '../falcorModel.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Snackbar } from 'material-ui';
import { RegisterForm } from '../components/RegisterForm.js';

const mapStateToProps = (state) => ({
  ...state
});

const mapDispatchToProps = (dispatch) => ({
});

class RegisterView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null};
    this.register = this.register.bind(this);
  }

  async register (newUserModel) {
    console.info("newUserModel", newUserModel);
    let registerResult = await falcorModel
    .call(
        ['register'],
        [newUserModel]
      ).
    then((result) => {
      return result;
    });

    let newUserId = await falcorModel.getValue(['register', 'newUserId']);
    if(newUserId === "INVALID") {
      let errorRes = await falcorModel.getValue('register.error');
      this.setState({error: errorRes});
      return;
    }

    if(newUserId) {
      this.props.history.pushState(null, '/login');
      return;
    }else {
      alert("Fatal registration error, please contact an admin");
    }
  }

  render () {
    return (
      <div>
        <div style={{maxWidth: 450, margin: '0 auto'}}>
          <RegisterForm
          onSubmit={this.register} />
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterView);