import React from 'react';
import { Link } from 'react-router';
import themeDecorator from 'material-ui/lib/styles/theme-decorator';
import getMuiTheme from 'material-ui/lib/styles/getMuiTheme';

class CoreLayout extends React.Component {
  static propTypes = {
    children : React.PropTypes.element
  } 
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <div>
        <span>Links: <Link to='/register'>Register</Link> | <Link to='/login'>Login</Link> |
        <Link to='/'>Home Page</Link></span>
        <br/>
        {this.props.children}
      </div>
    );
  }
}

export default themeDecorator(getMuiTheme(null, { userAgent: 'all' }))(CoreLayout);