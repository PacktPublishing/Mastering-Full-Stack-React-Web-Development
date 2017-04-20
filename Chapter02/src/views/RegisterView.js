import React from 'react';
import falcorModel from '../falcorModel.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Snackbar } from 'material-ui';
import { RegisterForm } from '../components/RegisterForm.js';

const mapStateToProps = (state) => ({
  ...state
});

// You can add your reducers here
const mapDispatchToProps = (dispatch) => ({
});

class RegisterView extends React.Component {
  constructor(props) {
    super(props);
    this.register = this.register.bind(this);
    this.state = {
      error: null
    };
  }

  async register (newUserModel) {
    await falcorModel
      .call(['register'],[newUserModel])
      .then((result) => result);

    const newUserId = await falcorModel.getValue(['register', 'newUserId']);

    if (newUserId === 'INVALID') {
      const errorRes = await falcorModel.getValue('register.error');

      this.setState({error: errorRes});
      return;
    }

    this.props.history.pushState(null, '/login');
  }

  render () {
    return (
      <div>
        <h1>Register</h1>
        <div style={{maxWidth: 450, margin: '0 auto'}}>
          <RegisterForm
            onSubmit={this.register} />
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterView);